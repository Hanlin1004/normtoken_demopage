"""Build a small, traceable Seed-TTS demo without altering source audio."""

import argparse
import csv
import hashlib
import json
import os
import re
import shutil
import struct
import subprocess
from pathlib import Path


OUTPUT_DIRS = {
    "tts": {
        "iter0": "seedtts_{lang}_meta_t2u_iter0_mref_scbt",
        "iter4": "seedtts_{lang}_meta_t2u_iter4_ckpt15_s2u_iter4_190k_detok_s2u_t2u_0616_ckpt700k_seg90_mref4_5_sbtxt",
    },
    "vc": {
        "iter0": "seedtts_{lang}_non_para_reconstruct_s2u_iter0_mref",
        "iter4": "seedtts_{lang}_non_para_reconstruct_s2u_iter4_190k_detok_s2u_t2u_0428_ckpt700k_mref4_5_sbtxt",
    },
}


def read_rows(path, columns):
    with path.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.reader(handle, delimiter="|"))
    rows = [row for row in rows if row and any(row)]
    for index, row in enumerate(rows, 1):
        if len(row) != columns:
            raise ValueError(f"{path.name}:{index}: expected {columns} fields, got {len(row)}")
    return rows


def wav_index(folder):
    result = {}
    for path in sorted(folder.rglob("*.wav")):
        if path.name in result:
            raise ValueError(f"Ambiguous audio filename: {path.name}")
        result[path.name] = path
    if not result:
        raise ValueError(f"No WAV files: {folder}")
    return result


def wav_info(path):
    # Read RIFF chunks directly to support both PCM and IEEE-float WAVs.
    with path.open("rb") as handle:
        header = handle.read(12)
        if header[:4] != b"RIFF" or header[8:12] != b"WAVE":
            raise ValueError(f"Not a RIFF WAV: {path}")
        fmt = None
        data_bytes = 0
        while chunk := handle.read(8):
            if len(chunk) != 8:
                raise ValueError(f"Truncated chunk: {path}")
            tag, size = struct.unpack("<4sI", chunk)
            if tag == b"fmt ":
                raw = handle.read(size)
                fmt = struct.unpack("<HHIIHH", raw[:16])
            else:
                if tag == b"data":
                    data_bytes += size
                handle.seek(size, 1)
            if size % 2:
                handle.seek(1, 1)
    if not fmt or not data_bytes:
        raise ValueError(f"Missing audio payload: {path}")
    codec, channels, rate, byte_rate, block_align, bits = fmt
    duration = data_bytes / byte_rate
    if duration <= 0 or duration > 120:
        raise ValueError(f"Unexpected duration {duration}: {path}")
    return {"duration": round(duration, 3), "sampleRate": rate,
            "channels": channels, "bits": bits, "codec": codec}


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def text_key(text):
    return " ".join(text.split()).casefold()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--downloads", type=Path, required=True)
    parser.add_argument("--cosy", type=Path, required=True)
    parser.add_argument("--paper-repo", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--count", type=int, default=3)
    parser.add_argument("--vc-selection", choices=("standard", "extreme"), default="extreme")
    parser.add_argument("--inspect", action="store_true")
    args = parser.parse_args()
    if os.name == "nt":
        for name in ("downloads", "cosy"):
            path = str(getattr(args, name).resolve())
            if not path.startswith("\\\\?\\"):
                setattr(args, name, Path("\\\\?\\" + path))
    if args.count < 1:
        parser.error("--count must be positive")
    dataset = args.downloads / "seedtts_testset (2)" / "seedtts_testset"
    samples = {"tts": {}, "vc": {}}
    records = []
    selected_files = []
    report = []

    for lang in ("zh", "en"):
        indexes = {
            task: {model: wav_index(args.downloads / name.format(lang=lang))
                   for model, name in models.items()}
            for task, models in OUTPUT_DIRS.items()
        }
        cosy_index = wav_index(args.cosy / f"seedtts_eval_{lang}")
        meta = read_rows(dataset / lang / "meta.lst", 4)
        vc_meta = {row[0]: row for row in read_rows(
            dataset / lang / "non_para_reconstruct_meta.lst", 5)}
        extreme_name = f"extreme_seedtts_vc_{lang} (1).lst"
        extreme = read_rows(args.downloads / extreme_name, 5)
        if args.inspect:
            coverage = {model: sum(row[0] + ".wav" in index for row in extreme)
                        for model, index in indexes["vc"].items()}
            coverage["cosy3"] = sum(
                f"semantic_{Path(row[4]).stem}_acoustic_{Path(row[2]).stem}_recombination.wav"
                in cosy_index for row in extreme)
            print(json.dumps({"language": lang, "extremeListCount": len(extreme),
                              "extremeCoverage": coverage}))

        vc_rows = extreme if args.vc_selection == "extreme" else list(vc_meta.values())
        vc_audio_stems = set()
        vc_texts = set()
        # Select VC first so TTS can exclude its content and reference recordings.
        for task, rows in (("vc", vc_rows), ("tts", meta)):
            samples[task][lang] = []
            seen_refs = set()
            missing = 0
            for row in rows:
                sample_id, prompt_text, prompt_wav, target_text = row[:4]
                if task == "vc" and sample_id in vc_meta and vc_meta[sample_id] != row:
                    raise ValueError(f"Extreme-list row differs from VC metadata: {sample_id}")
                if prompt_wav in seen_refs:
                    continue
                if task == "tts" and (
                    {sample_id, Path(prompt_wav).stem} & vc_audio_stems
                    or {text_key(target_text), text_key(prompt_text)} & vc_texts
                ):
                    continue
                # TTS: deterministic, distinct references and moderate text length.
                if task == "tts" and not (16 <= len(target_text) <= (70 if lang == "zh" else 160)):
                    continue
                paths = {"reference": dataset / lang / prompt_wav}
                for model, index in indexes[task].items():
                    paths[model] = index.get(sample_id + ".wav")
                if task == "vc":
                    source_wav = row[4]
                    paths["source"] = dataset / lang / source_wav
                    cosy_name = (f"semantic_{Path(source_wav).stem}_acoustic_"
                                 f"{Path(prompt_wav).stem}_recombination.wav")
                    paths["cosy3"] = cosy_index.get(cosy_name)
                if any(path is None or not path.is_file() for path in paths.values()):
                    missing += 1
                    continue

                number = len(samples[task][lang]) + 1
                key = f"{task}-{lang}-{number:02d}"
                item = {"id": key, "originalId": sample_id, "text": target_text,
                        "referenceText": prompt_text, "audio": {}}
                for model, path in paths.items():
                    relative = f"assets/audio/{key}-{model}.wav"
                    info = wav_info(path)
                    item["audio"][model] = {"src": relative, **info}
                    selected_files.append((path, args.output / relative))
                    origin_root = args.cosy if model == "cosy3" else args.downloads
                    records.append({"sample": key, "role": model, "file": relative,
                                    "originRoot": "cosy" if model == "cosy3" else "downloads",
                                    "origin": path.relative_to(origin_root).as_posix(),
                                    "sha256": sha256(path), **info})
                item["metadata"] = (f"{lang}/meta.lst" if task == "tts" else
                                    extreme_name if args.vc_selection == "extreme" else
                                    f"{lang}/non_para_reconstruct_meta.lst")
                samples[task][lang].append(item)
                seen_refs.add(prompt_wav)
                if task == "vc":
                    vc_audio_stems.update((Path(prompt_wav).stem, Path(source_wav).stem))
                    vc_texts.update((text_key(target_text), text_key(prompt_text)))
                if len(samples[task][lang]) == args.count:
                    break
            if len(samples[task][lang]) != args.count and not args.inspect:
                raise ValueError(f"Insufficient fully matched {task}/{lang} examples")
            report.append({"task": task, "language": lang, "skippedMissing": missing,
                           "selection": "standard" if task == "tts" else args.vc_selection,
                           "ids": [item["originalId"] for item in samples[task][lang]]})

    if args.inspect:
        print(json.dumps({"selection": report, "samples": samples}, ensure_ascii=False, indent=2))
        return

    for source, destination in selected_files:
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
    assets = args.output / "assets"
    shutil.copy2(args.paper_repo / "Template.pdf", assets / "paper.pdf")
    shutil.copy2(args.paper_repo / "fig_method.pdf", assets / "method.pdf")
    subprocess.run(["pdftoppm", "-png", "-singlefile", "-scale-to", "2600",
                    str(assets / "method.pdf"), str(assets / "method")], check=True)
    source = (args.paper_repo / "Template.tex").read_text(encoding="utf-8-sig")
    abstract = re.search(r"\\begin\{abstract\}(.*?)\\end\{abstract\}", source, re.S).group(1)
    abstract = " ".join(abstract.split()).replace("--", "\u2013")
    data = {"abstract": abstract, "samples": samples}
    (args.output / "data.js").write_text(
        "window.NORMTOKEN_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8")
    manifest = {"selection": report, "records": records,
                "policy": f"{args.count} per task/language; first eligible distinct references in metadata order. "
                          "TTS excludes selected VC source/reference recordings and transcripts. "
                          f"VC selection: {args.vc_selection}. Original WAV bytes preserved.",
                "paperSha256": sha256(assets / "paper.pdf"),
                "methodSha256": sha256(assets / "method.pdf")}
    (args.output / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"selection": report, "audioFiles": len(records),
                      "audioMB": round(sum(path.stat().st_size for path, _ in selected_files) / 1e6, 2)},
                     ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
