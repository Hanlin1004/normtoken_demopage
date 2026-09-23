"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

function argument(name, fallback) {
  const index = process.argv.indexOf(name);
  return index < 0 ? fallback : process.argv[index + 1];
}

const root = path.resolve(argument("--demo", path.join(__dirname, "..")));
const output = path.resolve(argument("--output", path.join(root, "..", "tmp", "demo-check")));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "data.js"), "utf8"), sandbox);
const data = sandbox.window.NORMTOKEN_DATA;
const digest = filename => crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex");

function checkAudioSignal(filename) {
  const buffer = fs.readFileSync(filename);
  let codec;
  let bits;
  let peak = 0;
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const tag = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const start = offset + 8;
    assert(start + size <= buffer.length, `Truncated WAV: ${filename}`);
    if (tag === "fmt ") {
      codec = buffer.readUInt16LE(start);
      bits = buffer.readUInt16LE(start + 14);
    }
    if (tag === "data") {
      assert((codec === 1 && bits === 16) || (codec === 3 && bits === 32), `Unsupported WAV format: ${filename}`);
      for (let index = start; index < start + size; index += bits / 8) {
        const value = codec === 1 ? buffer.readInt16LE(index) / 32768 : buffer.readFloatLE(index);
        assert(Number.isFinite(value), `Invalid sample: ${filename}`);
        peak = Math.max(peak, Math.abs(value));
      }
    }
    offset = start + size + size % 2;
  }
  assert(peak > 0.00001, `Silent WAV: ${filename}`);
}

async function main() {
  fs.mkdirSync(output, { recursive: true });
  for (const record of manifest.records) {
    assert.equal(digest(path.join(root, record.file)), record.sha256, record.file);
    checkAudioSignal(path.join(root, record.file));
  }
  const paperPath = path.join(root, "assets/paper.pdf");
  const hasLocalPaper = fs.existsSync(paperPath);
  if (hasLocalPaper) assert.equal(digest(paperPath), manifest.paperSha256);
  else assert.equal(manifest.paperPublished, false, "Missing published paper");
  assert.equal(digest(path.join(root, "assets/method.pdf")), manifest.methodSha256);
  if (manifest.methodPngSha256) {
    assert.equal(digest(path.join(root, "assets/method.png")), manifest.methodPngSha256);
  }
  const textKey = text => text.trim().replace(/\s+/g, " ").toLocaleLowerCase();
  const sharedReferences = manifest.allowedSharedReferences || [];
  const sharedReferenceTexts = manifest.allowedSharedReferenceTexts || [];
  for (const allowed of sharedReferenceTexts) {
    const samples = Object.values(data.samples).flatMap(task => Object.values(task)).flat();
    const tts = samples.find(sample => sample.id === allowed.ttsSample);
    const vc = samples.find(sample => sample.id === allowed.vcSample);
    assert(tts && vc && allowed.reason, "Invalid shared-reference-text exception");
    assert.equal(textKey(tts.referenceText), textKey(allowed.text));
    assert.equal(textKey(vc.referenceText), textKey(allowed.text));
  }
  for (const allowed of sharedReferences) {
    const tts = manifest.records.find(record => record.sample === allowed.ttsSample && record.role === "reference");
    const vc = manifest.records.find(record => record.sample === allowed.vcSample && record.role === "reference");
    assert(tts && vc && allowed.reason, "Invalid shared-reference exception");
    assert.equal(tts.sha256, allowed.sha256);
    assert.equal(vc.sha256, allowed.sha256);
  }
  for (const language of ["zh", "en"]) {
    const vcTexts = new Set(data.samples.vc[language].flatMap(sample =>
      [textKey(sample.text), textKey(sample.referenceText)]));
    const vcInputs = manifest.records.filter(record => record.sample.startsWith(`vc-${language}-`) &&
      ["source", "reference"].includes(record.role));
    const vcStems = new Set(vcInputs.map(record => path.posix.parse(record.origin).name));
    for (const sample of data.samples.tts[language]) {
      const allowedVc = new Set(sharedReferences.filter(item => item.ttsSample === sample.id).map(item => item.vcSample));
      const allowedTextVc = new Set([...allowedVc, ...sharedReferenceTexts
        .filter(item => item.ttsSample === sample.id).map(item => item.vcSample)]);
      const restrictedTexts = new Set(data.samples.vc[language].flatMap(item =>
        allowedTextVc.has(item.id) ? [textKey(item.text)] : [textKey(item.text), textKey(item.referenceText)]));
      const restrictedInputs = vcInputs.filter(record => !(record.role === "reference" && allowedVc.has(record.sample)));
      const restrictedStems = new Set(restrictedInputs.map(record => path.posix.parse(record.origin).name));
      const restrictedHashes = new Set(restrictedInputs.map(record => record.sha256));
      assert(!vcTexts.has(textKey(sample.text)), `Repeated target text: ${sample.id}`);
      assert(!restrictedTexts.has(textKey(sample.referenceText)), `Repeated reference text: ${sample.id}`);
      assert(!vcStems.has(sample.originalId), `Repeated content recording: ${sample.id}`);
      const reference = manifest.records.find(record => record.sample === sample.id && record.role === "reference");
      assert(!restrictedStems.has(path.posix.parse(reference.origin).name), `Repeated reference: ${sample.id}`);
      assert(!restrictedHashes.has(reference.sha256), `Repeated reference bytes: ${sample.id}`);
    }
  }
  const expectedAudio = manifest.records.length;
  const sampleCount = Object.values(data.samples).flatMap(task => Object.values(task)).flat().length;
  const executablePath = process.env.CHROME_PATH ||
    (process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : undefined);
  const browser = await chromium.launch({ executablePath, headless: true,
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  try {
    await page.goto(pathToFileURL(path.join(root, "index.html")).href);
    await page.waitForFunction(count => document.querySelectorAll("audio").length === count, expectedAudio);
    if (manifest.paperPublished === false) {
      assert.equal(await page.locator('a[href="assets/paper.pdf"]').count(), 0);
    }
    assert.equal(await page.locator("article.sample").count(), sampleCount);
    assert.equal(await page.locator(".sample-details").count(), 0);
    const bodyText = await page.locator("body").textContent();
    assert(!bodyText.includes("Sample ID"));
    for (const sample of Object.values(data.samples).flatMap(task => Object.values(task)).flat()) {
      assert(!bodyText.includes(sample.originalId), `Exposed sample ID: ${sample.originalId}`);
    }
    const media = await page.locator("audio").evaluateAll(async audios => {
      return Promise.all(audios.map(audio => new Promise(resolve => {
        const done = () => resolve({ src: audio.getAttribute("src"), duration: audio.duration,
          readyState: audio.readyState, error: audio.error?.message });
        if (audio.readyState >= 1 || audio.error) return done();
        audio.addEventListener("loadedmetadata", done, { once: true });
        audio.addEventListener("error", done, { once: true });
        setTimeout(done, 15000);
      })));
    });
    for (const result of media) {
      const record = manifest.records.find(item => item.file === result.src);
      assert(!result.error, JSON.stringify(result));
      assert(result.readyState >= 1 && Number.isFinite(result.duration), JSON.stringify(result));
      assert(Math.abs(result.duration - record.duration) < 0.03, result.src);
    }
    const images = await page.locator("img").evaluateAll(imgs => imgs.map(img => ({ src: img.src, width: img.naturalWidth })));
    assert(images.every(image => image.width > 0), JSON.stringify(images.filter(image => !image.width)));
    await page.locator("#method").evaluate(section => scrollTo({ top: section.offsetTop - 80, behavior: "instant" }));
    await page.screenshot({ path: path.join(output, "desktop-method.png") });
    await page.locator("#vc-panel-zh article.sample").last().scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(output, "desktop-vc-zh-last.png") });
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: path.join(output, "desktop-overview.png"), fullPage: false });
    await page.locator("#tts").evaluate(section => scrollTo({ top: section.offsetTop - 80, behavior: "instant" }));
    await page.screenshot({ path: path.join(output, "desktop-tts.png") });
    await page.locator("#vc").evaluate(section => scrollTo({ top: section.offsetTop - 80, behavior: "instant" }));
    await page.screenshot({ path: path.join(output, "desktop-vc.png") });

    for (const task of ["tts", "vc"]) {
      for (const language of ["en", "zh"]) {
        const tab = page.locator(`#${task}-tab-${language}`);
        await tab.click();
        assert.equal(await tab.getAttribute("aria-selected"), "true");
        assert(await page.locator(`#${task}-panel-${language}`).isVisible());
        const panel = page.locator(`#${task}-panel-${language}`);
        const buttons = panel.locator(".play-button");
        // Exercise every recording, including reference/source inputs and baselines.
        for (let index = 0; index < await buttons.count(); index++) {
          await buttons.nth(index).click();
          await page.waitForFunction(({ task, language, index }) => {
            const audio = document.querySelectorAll(`#${task}-panel-${language} audio`)[index];
            return audio.currentTime > 0 || audio.error;
          }, { task, language, index }, { timeout: 15000 });
          const state = await panel.locator("audio").nth(index).evaluate(audio => ({
            currentTime: audio.currentTime, paused: audio.paused, error: audio.error?.message
          }));
          assert(!state.paused && state.currentTime > 0 && !state.error, JSON.stringify(state));
          assert.equal(await page.locator("audio").evaluateAll(audios => audios.filter(audio => !audio.paused).length), 1);
        }
        const slider = panel.locator(".seek").last();
        await slider.evaluate(input => {
          input.value = String(Number(input.max) / 2);
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
        assert(await panel.locator("audio").last().evaluate(audio => audio.currentTime >= audio.duration * 0.45));
      }
      await page.locator(`#${task}-tab-en`).focus();
      await page.keyboard.press("ArrowLeft");
      assert.equal(await page.locator(`#${task}-tab-zh`).getAttribute("aria-selected"), "true");
      assert.equal(await page.locator(`#${task} audio`).evaluateAll(audios => audios.filter(audio => !audio.paused).length), 0);
    }

    const viewports = [[1440, 1000], [1920, 1080], [768, 1024], [390, 844], [320, 760]];
    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height });
      for (const language of ["zh", "en"]) {
        for (const task of ["tts", "vc"]) await page.locator(`#${task}-tab-${language}`).click();
        const overflow = await page.evaluate(() => {
          return [...document.querySelectorAll("main *, nav *, footer *")].filter(node => {
            if (node.closest("[hidden]") || !node.getClientRects().length) return false;
            const box = node.getBoundingClientRect();
            return box.left < -1 || box.right > innerWidth + 1;
          }).map(node => ({ tag: node.tagName, class: node.className, text: node.textContent.slice(0, 60) }));
        });
        assert.equal(overflow.length, 0, `${width}px ${language}: ${JSON.stringify(overflow)}`);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      }
      if (width === 390) {
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        await page.screenshot({ path: path.join(output, "mobile-overview.png") });
        await page.locator("#tts").evaluate(section => scrollTo({ top: section.offsetTop - 80, behavior: "instant" }));
        await page.screenshot({ path: path.join(output, "mobile-tts.png") });
        await page.locator("#vc").evaluate(section => scrollTo({ top: section.offsetTop - 80, behavior: "instant" }));
        await page.screenshot({ path: path.join(output, "mobile-vc.png") });
        await page.screenshot({ path: path.join(output, "mobile-full.png"), fullPage: true });
      }
    }
    assert.equal(errors.length, 0, errors.join("\n"));
    const report = { samples: sampleCount, verifiedWavs: media.length,
      hashChecks: manifest.records.length + 1 + Number(hasLocalPaper) + Number(Boolean(manifest.methodPngSha256)),
      paperPublished: manifest.paperPublished !== false,
      nonSilentAudio: "passed", allAudioPlayback: "passed", tabsAndSeeking: "passed",
      disjointTtsVcExamples: sharedReferences.length || sharedReferenceTexts.length
        ? "passed except recorded reference overlaps" : "passed",
      sharedReferences, sharedReferenceTexts, noVisibleSampleIds: "passed", viewports, consoleErrors: errors };
    fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
