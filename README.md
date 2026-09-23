# NormToken Audio Demo

Open `index.html` directly in a browser. This is a self-contained static site:
there is no build step, backend, external font, CDN dependency, or API key.
Keep the whole `demo/` directory together when moving or hosting it.

## Included Content

- Title, authors, and abstract from the newer paper repository. The method
  figure uses its current `fig_method.pdf`, refreshed on 2026-09-23.
- The paper download remains hidden. `assets/paper.pdf` may exist locally,
  but is ignored by Git and is not included in the deployed site.
- TTS: 3 Mandarin and 3 English samples. Each includes target text,
  reference WAV, NormToken Iter. 0 WAV, and NormToken Iter. 4 WAV.
- VC: 3 Mandarin and 3 English samples. Each includes source WAV/text,
  reference WAV/text, CosyVoice 3 WAV, and both NormToken outputs.
- 48 original WAV files. Audio bytes are copied without resampling,
  trimming, gain normalization, or speed modification.

The visible title uses title case. Abstract wording is copied from
`Template.tex`; the local paper and figure files themselves are not edited.

## Sample Selection and Matching

`manifest.json` records the original filenames, selected IDs, relative source
locations, WAV metadata, and SHA-256 hashes. `originRoot` is either the supplied
Downloads directory, the original CosyVoice directory, or a supplied
CosyVoice ZIP (`cosyArchive`), or a standalone supplied WAV (`cosyFile`).
ZIP records include the archive filename,
archive SHA-256, and exact member name. Absolute personal paths are omitted.

VC uses the exact three Mandarin and three English extreme pairs selected
by the author. The screenshot order is retained, with Mandarin sample 3
replaced by the author's new pair on 2026-09-23. These are curated listening
examples, not a random evaluation subset. TTS originally used deterministic
metadata-order selection with moderate text length. Sample IDs are retained
only in the data/manifest, not displayed on the page.

TTS is unchanged as explicitly requested by the author. English TTS sample 1
and VC sample 3 therefore share reference `common_voice_en_120405`, while
their target/source content differs. This specific exception is recorded in
`manifest.json` under `allowedSharedReferences`; other overlap checks remain
enabled.

Mandarin VC sample 3 also shares the reference sentence with Mandarin TTS
samples 1 and 2, but uses a different reference recording. These text-only
overlaps are recorded under `allowedSharedReferenceTexts`; all TTS audio
and text remain unchanged.

TTS metadata has four pipe-separated fields:

```text
utterance_id|reference_text|reference_wav|target_text
```

NormToken output is exactly `utterance_id.wav`.

VC metadata has five fields:

```text
pair_id|reference_text|reference_wav|source_text|source_wav
```

NormToken output is `pair_id.wav`. CosyVoice 3 output is matched by **both**
audio stems, not by source alone:

```text
semantic_{source_stem}_acoustic_{reference_stem}_recombination.wav
```

Only `recombination` outputs are used for the baseline, never `reconstruction`.

### Current VC Inputs

`tools/vc-selection.json` pins the six requested pairs, source/reference
texts, original metadata line numbers, and matching Iter. 0 / Iter. 4 paths.
Iter. 0 comes from `extreme_seedtts_vc_{zh,en}_gen_iter0`; Iter. 4 comes
from `extreme_seedtts_vc_{zh,en}_gen`. CosyVoice 3 outputs come from
`normtoken_vc_selected_zh.zip` and `normtoken_vc_selected_en.zip`.

Mandarin sample 3 instead uses pair
`10002823-00000029_00004926-00000078`, the latest standalone
`vc-zh-03-iter0.wav` / `vc-zh-03-iter4.wav` in Downloads, and
`semantic_00004926-00000078_acoustic_10002823-00000029_recombination.wav`.
Its reference is `10002823-00000029`; its source is `00004926-00000078`.

All three models use the same source/reference pair for each example.
These extreme pairs are not the default pairings in the official VC list.
No phone-rate values are inferred from duration or text length.

## Update the Samples

`data.js` contains the displayed text and relative audio URLs. The UI builds
all audio players from that data. Preserve the field names and task/language
structure to add or replace examples.

To reapply the current VC selection without rebuilding TTS or paper assets,
use Python 3:

```powershell
python tools/update_selected_vc.py `
  --downloads "PATH_TO_DOWNLOADS" `
  --cosy-zh "PATH_TO/normtoken_vc_selected_zh.zip" `
  --cosy-en "PATH_TO/normtoken_vc_selected_en.zip" `
  --cosy-zh-03 "PATH_TO/semantic_00004926-00000078_acoustic_10002823-00000029_recombination.wav"
```

This verifies input hashes and exact source/reference filenames, then updates
only the 30 VC WAVs and their data/manifest entries. The original ZIPs and
input recordings are unchanged.

The older full-site builder below recreates metadata-order samples and
**does not preserve the current curated VC selection**. Use a separate output
directory for a fresh build. It requires Python 3 and Poppler's `pdftoppm`:

```powershell
python tools/build_samples.py `
  --downloads "PATH_TO_DOWNLOADS" `
  --cosy "PATH_TO_COSYVOICE3_VC" `
  --paper-repo "PATH_TO_LATEST_PAPER_REPOSITORY" `
  --vc-selection standard
```

Run from `demo/`, or supply `--output PATH_TO_DEMO`. `--inspect` checks and
prints matches without writing assets. The default VC selection is
`extreme`, which fails if the required exact pairs are missing; select
`standard` explicitly for the older fallback. `--count` controls samples
per language/task. The script writes demo assets and manifests only; it does
not alter original recordings or LaTeX. Use a fresh output directory when
reducing the number of examples to avoid unused old WAVs.

## Browser Verification

The optional `tools/verify_demo.cjs` uses Playwright and a locally installed
Chrome (or Playwright's Chromium). It verifies asset hashes, all WAV loading
and playback, language tabs, seek controls, exclusive playback, and viewport
overflow. Screenshots are saved outside the published page.

```powershell
node tools/verify_demo.cjs --demo . --output ../tmp/demo-check
```

Install Playwright separately or expose its package with `NODE_PATH`.
Set `CHROME_PATH` if Chrome is installed in a nonstandard location.

## Hosting

This directory can be served by any static host. For GitHub Pages, use a
Pages deployment targeting this directory, or move its contents to the
repository's configured publishing directory. No deployment is performed
by the build script. Review sample redistribution permissions before
making audio public.

Lucide icons are bundled locally with their license in `assets/icons/`.
