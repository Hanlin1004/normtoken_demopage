# NormToken Audio Demo

Open `index.html` directly in a browser. This is a self-contained static site:
there is no build step, backend, external font, CDN dependency, or API key.
Keep the whole `demo/` directory together when moving or hosting it.

## Included Content

- Title, authors, abstract, paper PDF, and original method figure from the
  newer paper repository, as of this build.
- TTS: 3 Mandarin and 3 English samples. Each includes target text,
  reference WAV, NormToken Iter. 0 WAV, and NormToken Iter. 4 WAV.
- VC: 3 Mandarin and 3 English samples. Each includes source WAV/text,
  reference WAV/text, CosyVoice 3 WAV, and both NormToken outputs.
- 48 original WAV files. Audio bytes are copied without resampling,
  trimming, gain normalization, or speed modification.

The visible title uses title case. Abstract wording is copied from
`Template.tex`; the paper and figure files themselves are not edited.

## Sample Selection and Matching

`manifest.json` records the original filenames, selected IDs, relative source
locations, WAV metadata, and SHA-256 hashes. `originRoot` is either the supplied
Downloads directory or the supplied CosyVoice directory; absolute personal
paths are intentionally omitted.

Samples are deterministic selections, not a subjective best-of ranking:
the first three fully matched examples with distinct references in metadata
order. TTS additionally limits target text to 16-70 characters for Mandarin
and 16-160 characters for English. VC is selected first; TTS excludes all
selected VC source/reference recordings and transcripts, so the two tasks
do not repeat content or reference audio. Sample IDs are retained only in
the data/manifest, not displayed on the page.

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

### Extreme-pair Lists

The supplied `extreme_seedtts_vc_zh (1).lst` and
`extreme_seedtts_vc_en (1).lst` each contain 20 pairs. None of those exact
pairs occur in the supplied NormToken or CosyVoice 3 output directories.
For example, the requested Mandarin pair is:

```text
reference: 10002394-00000014
source:    00005260-00000027
```

The existing generated file instead pairs that source with reference
`00005258-00000102`. These are not interchangeable.

With the author's approval, this version uses fully matched pairs from
`non_para_reconstruct_meta.lst`. **The displayed VC samples are not claimed
to be extreme speaking-rate pairs.** Replace them once outputs for the
requested extreme pairs are available. No phone-rate values are inferred
from duration or text length.

## Update the Samples

`data.js` contains the displayed text and relative audio URLs. The UI builds
all audio players from that data. Preserve the field names and task/language
structure to add or replace examples.

For reproducible matching and copying, use Python 3 and Poppler's
`pdftoppm` (on PATH):

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
`standard` explicitly for the current fallback. `--count` controls samples
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
