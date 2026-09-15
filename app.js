"use strict";

(() => {
  const data = window.NORMTOKEN_DATA;
  const players = new Set();
  const modelNames = {
    source: "Source", reference: "Reference", cosy3: "CosyVoice 3",
    iter0: "NormToken (Iter. 0)", iter4: "NormToken (Iter. 4)"
  };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function icon(name) {
    const image = element("img");
    image.src = `assets/icons/${name}.svg`;
    image.alt = "";
    image.width = 17;
    image.height = 17;
    return image;
  }

  function time(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const total = Math.max(0, Math.floor(seconds));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
  }

  function audioPlayer(info, label) {
    const container = element("div", "player");
    const audio = element("audio");
    audio.preload = "metadata";
    audio.src = info.src;
    audio.setAttribute("aria-label", label);
    const button = element("button", "icon-button play-button");
    button.type = "button";
    button.title = `Play ${label}`;
    button.setAttribute("aria-label", button.title);
    const buttonIcon = icon("play");
    button.append(buttonIcon);
    const timeline = element("div", "timeline");
    const seek = element("input", "seek");
    seek.type = "range";
    seek.min = "0";
    seek.max = String(info.duration);
    seek.step = "0.01";
    seek.value = "0";
    seek.disabled = true;
    seek.setAttribute("aria-label", `Seek ${label}`);
    const timecode = element("span", "timecode", `0:00 / ${time(info.duration)}`);
    timecode.setAttribute("aria-hidden", "true");
    const download = element("a", "icon-button download-link");
    download.href = info.src;
    download.download = info.src.split("/").pop();
    download.title = `Download ${label}`;
    download.setAttribute("aria-label", download.title);
    download.append(icon("download"));
    timeline.append(seek, timecode);
    container.append(button, timeline, download, audio);
    players.add(audio);

    function update() {
      const duration = Number.isFinite(audio.duration) ? audio.duration : info.duration;
      seek.max = String(duration);
      seek.value = String(audio.currentTime);
      seek.style.setProperty("--progress", `${duration ? 100 * audio.currentTime / duration : 0}%`);
      seek.setAttribute("aria-valuetext", `${time(audio.currentTime)} of ${time(duration)}`);
      timecode.textContent = `${time(audio.currentTime)} / ${time(duration)}`;
    }

    function showError(message) {
      container.classList.remove("is-loading");
      buttonIcon.src = "assets/icons/play.svg";
      if (!container.querySelector(".audio-error")) {
        const error = element("p", "audio-error", message);
        error.setAttribute("role", "status");
        container.append(error);
      }
    }

    button.addEventListener("click", async () => {
      if (!audio.paused) {
        audio.pause();
        return;
      }
      for (const other of players) if (other !== audio) other.pause();
      container.querySelector(".audio-error")?.remove();
      if (audio.ended) audio.currentTime = 0;
      try {
        await audio.play();
      } catch (error) {
        if (error.name !== "AbortError") showError("Audio could not play. Retry or download the WAV.");
      }
    });

    audio.addEventListener("loadedmetadata", () => { seek.disabled = false; update(); });
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("durationchange", update);
    audio.addEventListener("waiting", () => {
      if (!audio.paused) {
        container.classList.add("is-loading");
        buttonIcon.src = "assets/icons/loader-circle.svg";
      }
    });
    audio.addEventListener("playing", () => {
      container.classList.remove("is-loading");
      buttonIcon.src = "assets/icons/pause.svg";
    });
    audio.addEventListener("play", () => {
      for (const other of players) if (other !== audio) other.pause();
      container.classList.add("is-playing");
      buttonIcon.src = "assets/icons/pause.svg";
      button.title = `Pause ${label}`;
      button.setAttribute("aria-label", button.title);
    });
    const resetState = () => {
      container.classList.remove("is-playing", "is-loading");
      buttonIcon.src = "assets/icons/play.svg";
      button.title = `Play ${label}`;
      button.setAttribute("aria-label", button.title);
      update();
    };
    audio.addEventListener("pause", resetState);
    audio.addEventListener("ended", resetState);
    audio.addEventListener("error", () => showError("Audio unavailable. Check the WAV file."));
    seek.addEventListener("input", () => { audio.currentTime = Number(seek.value); update(); });
    return container;
  }

  function cell(sample, model, language, task, number) {
    const block = element("div", `audio-cell model-${model}`);
    const heading = element("div", "cell-heading");
    heading.append(element("h4", "", modelNames[model]));
    if (model === "source" || model === "reference") {
      heading.append(element("span", "role", model === "source" ? "Content" : "Voice"));
    }
    const label = `${task.toUpperCase()} ${language === "zh" ? "Mandarin" : "English"} sample ${number}, ${modelNames[model]}`;
    block.append(heading, audioPlayer(sample.audio[model], label));
    return block;
  }

  function transcript(text, language) {
    const p = element("p", "transcript", text);
    p.lang = language === "zh" ? "zh-CN" : "en";
    return p;
  }

  function sampleRow(sample, task, language, index, total) {
    const section = element("article", `sample sample-${task}`);
    section.setAttribute("aria-label", `${task.toUpperCase()} sample ${index + 1}`);
    const top = element("div", "sample-topline");
    top.append(element("h3", "sample-index", `SAMPLE ${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`));
    section.append(top);
    if (task === "tts") {
      const target = element("p", "target-text");
      target.append(element("span", "field-label", "Target text"));
      const content = element("span", "", sample.text);
      content.lang = language === "zh" ? "zh-CN" : "en";
      target.append(content);
      section.append(target);
    } else {
      const inputs = element("div", "input-grid");
      for (const model of ["source", "reference"]) {
        const block = cell(sample, model, language, task, index + 1);
        block.append(transcript(model === "source" ? sample.text : sample.referenceText, language));
        inputs.append(block);
      }
      section.append(inputs);
    }
    const grid = element("div", "comparison-grid");
    for (const model of task === "tts" ? ["reference", "iter0", "iter4"] : ["cosy3", "iter0", "iter4"]) {
      const block = cell(sample, model, language, task, index + 1);
      if (model === "reference") {
        const details = element("details", "transcript");
        details.append(element("summary", "", "Reference transcript"), transcript(sample.referenceText, language));
        block.append(details);
      }
      grid.append(block);
    }
    section.append(grid);
    return section;
  }

  function activateTab(button, focus = false) {
    const { task, language } = button.dataset;
    const taskSection = document.getElementById(task);
    taskSection.querySelectorAll("audio").forEach(audio => audio.pause());
    taskSection.querySelectorAll('[role="tab"]').forEach(tab => {
      const selected = tab === button;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    for (const lang of ["zh", "en"]) {
      document.getElementById(`${task}-panel-${lang}`).hidden = lang !== language;
    }
    if (focus) button.focus();
  }

  if (!data) {
    document.getElementById("abstract-text").textContent = "Page data could not load. Check that data.js is present.";
    return;
  }
  document.getElementById("abstract-text").textContent = data.abstract;
  for (const task of ["tts", "vc"]) {
    for (const language of ["zh", "en"]) {
      const panel = document.getElementById(`${task}-panel-${language}`);
      const samples = data.samples[task][language];
      if (!samples.length) panel.append(element("p", "empty-state", "Audio samples pending."));
      samples.forEach((sample, index) => panel.append(sampleRow(sample, task, language, index, samples.length)));
    }
  }
  document.querySelectorAll('[role="tab"]').forEach(button => {
    button.addEventListener("click", () => activateTab(button));
    button.addEventListener("keydown", event => {
      const buttons = Array.from(button.parentElement.querySelectorAll('[role="tab"]'));
      const index = buttons.indexOf(button);
      let next;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") next = buttons[1 - index];
      if (event.key === "Home") next = buttons[0];
      if (event.key === "End") next = buttons.at(-1);
      if (next) { event.preventDefault(); activateTab(next, true); }
    });
  });
})();
