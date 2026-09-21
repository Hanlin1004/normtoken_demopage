"""Replace only VC samples using exact pairs and supplied CosyVoice ZIPs."""

import argparse
import hashlib
import json
import shutil
import zipfile
from pathlib import Path, PurePosixPath

from build_samples import read_rows, sha256, wav_info


def load_data(path):
    text = path.read_text(encoding="utf-8-sig").strip()
    prefix = "window.NORMTOKEN_DATA = "
    if not text.startswith(prefix) or not text.endswith(";"):
        raise ValueError("Unexpected data.js format")
    return json.loads(text[len(prefix):-1])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--demo", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--downloads", type=Path, required=True)
    parser.add_argument("--pairs", type=Path, default=Path(__file__).with_name("vc-selection.json"))
    parser.add_argument("--cosy-zh", type=Path, required=True)
    parser.add_argument("--cosy-en", type=Path, required=True)
    args = parser.parse_args()
    data = load_data(args.demo / "data.js")
    before_tts = json.dumps(data["samples"]["tts"], ensure_ascii=False, sort_keys=True)
    manifest = json.loads((args.demo / "manifest.json").read_text(encoding="utf-8"))
    pairs = json.loads(args.pairs.read_text(encoding="utf-8"))["pairs"]
    plans, selections = [], {}

    for language in ("zh", "en"):
        chosen = [p for p in pairs if p["language"] == language]
        assert len(chosen) == 3 and len({p["pair_id"] for p in chosen}) == 3
        source_rows = {r[0]: r for r in read_rows(
            args.downloads / f"extreme_seedtts_vc_{language}.lst", 5)}
        archive_path = getattr(args, f"cosy_{language}")
        archive_hash = sha256(archive_path)
        with zipfile.ZipFile(archive_path) as archive:
            if archive.testzip() is not None:
                raise ValueError(f"Corrupt archive: {archive_path.name}")
            wavs = {}
            for entry in archive.infolist():
                if not entry.is_dir() and entry.filename.lower().endswith(".wav"):
                    name = PurePosixPath(entry.filename).name
                    if name in wavs:
                        raise ValueError(f"Ambiguous ZIP filename: {name}")
                    wavs[name] = entry
            for pair in chosen:
                assert pair["pair_id"] == f"{pair['reference_id']}_{pair['source_id']}"
                assert source_rows[pair["pair_id"]] == [
                    pair["pair_id"], pair["reference_text"], pair["reference_wav"],
                    pair["source_text"], pair["source_wav"],
                ]
                for role, details in pair["files"].items():
                    source = args.downloads / details["path_relative_to_downloads"]
                    if sha256(source) != details["sha256"]:
                        raise ValueError(f"Input changed since selection: {source}")
                expected = (f"semantic_{pair['source_id']}_acoustic_"
                            f"{pair['reference_id']}_recombination.wav")
                assert expected == pair["cosyvoice3_output_filename"]
                entry = wavs[expected]
                plans.append((pair, archive.read(entry), entry.filename,
                              archive_path.name, archive_hash))
        selections[language] = [p["pair_id"] for p in chosen]

    replacements, samples = {}, {"zh": [], "en": []}
    for pair, cosy_bytes, member, archive_name, archive_hash in plans:
        sample = {
            "id": pair["sample"], "originalId": pair["pair_id"],
            "text": pair["source_text"], "referenceText": pair["reference_text"],
            "audio": {}, "metadata": f"tools/vc-selection.json#{pair['sample']}",
        }
        for role in ("reference", "iter0", "iter4", "source", "cosy3"):
            relative = f"assets/audio/{sample['id']}-{role}.wav"
            destination = args.demo / relative
            if role == "cosy3":
                destination.write_bytes(cosy_bytes)
                origin = {"originRoot": "cosyArchive", "origin": member,
                          "originArchive": archive_name, "archiveSha256": archive_hash}
                expected_hash = hashlib.sha256(cosy_bytes).hexdigest()
            else:
                details = pair["files"][role]
                shutil.copy2(args.downloads / details["path_relative_to_downloads"], destination)
                origin = {"originRoot": "downloads", "origin": details["path_relative_to_downloads"]}
                expected_hash = details["sha256"]
            info = wav_info(destination)
            assert sha256(destination) == expected_hash
            sample["audio"][role] = {"src": relative, **info}
            replacements[sample["id"], role] = {
                "sample": sample["id"], "role": role, "file": relative,
                **origin, "sha256": expected_hash, **info,
            }
        samples[pair["language"]].append(sample)
    assert len(replacements) == 30
    assert set(replacements) == {
        (r["sample"], r["role"]) for r in manifest["records"] if r["sample"].startswith("vc-")}
    manifest["records"] = [replacements.get((r["sample"], r["role"]), r) for r in manifest["records"]]
    for selection in manifest["selection"]:
        if selection["task"] == "vc":
            selection.update({"selection": "extreme-explicit", "skippedMissing": 0,
                              "ids": selections[selection["language"]]})
    manifest["policy"] = (
        "3 per task/language. VC: six author-selected extreme pairs in screenshot order; "
        "exact source/reference match across Iter. 0, Iter. 4 and supplied CosyVoice 3 ZIPs. "
        "TTS unchanged by author request; tts-en-01 and vc-en-03 intentionally share "
        "a reference recording. Original WAV bytes preserved."
    )
    tts_reference = next(r for r in manifest["records"]
                         if r["sample"] == "tts-en-01" and r["role"] == "reference")
    vc_reference = replacements["vc-en-03", "reference"]
    assert tts_reference["sha256"] == vc_reference["sha256"]
    manifest["allowedSharedReferences"] = [{
        "ttsSample": "tts-en-01", "vcSample": "vc-en-03",
        "sha256": vc_reference["sha256"],
        "reason": "Author explicitly requested leaving TTS unchanged on 2026-09-21.",
    }]
    data["samples"]["vc"] = samples
    assert json.dumps(data["samples"]["tts"], ensure_ascii=False, sort_keys=True) == before_tts
    (args.demo / "data.js").write_text("window.NORMTOKEN_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    (args.demo / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"vc_pairs": 6, "updated_wavs": 30, "tts": "unchanged", "selection": selections}, indent=2))


if __name__ == "__main__":
    main()
