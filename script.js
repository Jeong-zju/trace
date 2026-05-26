const methodSteps = {
  write: {
    kicker: "Write",
    title: "Visual-state evidence is stored when the cue is visible.",
    copy:
      "Current RGB and proprioceptive features form the memory content, so the module stores the evidence before it disappears from the camera view.",
    video: "assets/video/medicine_right_demo.mp4",
    poster: "assets/frames/medicine_right/medicine_right_12pct_t10p087s_960w.jpg",
    videoLabel: "Medicine / early tray cue",
    videoTitle: "A visible tray-origin cue is written before the branch.",
    metrics: [
      ["Task suite", "5 real robot tasks"],
      ["Physical evaluation", "25 rollouts per task"],
    ],
  },
  route: {
    kicker: "Route",
    title: "Path and delta signatures decide where evidence is written.",
    copy:
      "The address comes from the executed robot-state trajectory, not from a task label, a branch label, or raw time indexing.",
    video: "assets/video/book_desk_demo.mp4",
    poster: "assets/frames/book_desk/book_desk_37pct_t33p713s_960w.jpg",
    videoLabel: "Book / origin-conditioned route",
    videoTitle: "The same carried object is routed by how the robot arrived.",
    metrics: [
      ["Signature depth", "p = 3, 5,219 dims"],
      ["Memory budget", "K = 4 or 6 slots"],
    ],
  },
  read: {
    kicker: "Read",
    title: "The branch point reads a compact memory vector.",
    copy:
      "When current observations become visually similar across histories, the readout selects slot contents that still carry the early evidence.",
    video: "assets/video/book_bed_demo.mp4",
    poster: "assets/frames/book_bed/book_bed_62pct_t51p832s_960w.jpg",
    videoLabel: "Book / ambiguous branch",
    videoTitle: "The branch readout keeps the origin evidence available.",
    metrics: [
      ["Order-preserving branch consistency", "94.53 +/- 0.49"],
      ["Order reversal branch consistency", "41.60 +/- 2.20"],
    ],
  },
  adapt: {
    kicker: "Adapt",
    title: "The same memory state conditions different policy families.",
    copy:
      "Regression receives memory tokens through attention, while diffusion receives an added conditioning vector. The action objectives remain unchanged.",
    video: "assets/video/cable_demo.mp4",
    poster: "assets/frames/cable/cable_62pct_t40p972s_960w.jpg",
    videoLabel: "Cable / policy-family transfer",
    videoTitle: "The unchanged action heads receive the same TRACE memory state.",
    metrics: [
      ["TRACE Regression average", "69.23 +/- 3.65"],
      ["TRACE Diffusion average", "59.53 +/- 2.31"],
    ],
  },
};

const resultViews = {
  main: {
    kicker: "Main comparison",
    title: "Average stage progress",
    resultTitle: "Causal memory helps when evidence has left view.",
    resultText:
      "TRACE Regression reaches 69.23 average progress and TRACE Diffusion reaches 59.53, compared with 25.50 for ACT and 25.00 for Diffusion Policy.",
    statA: "69.23 TRACE Regression",
    statB: "5 physical delayed-evidence tasks",
    values: [
      ["Diffusion Policy", 25.0, false],
      ["ACT", 25.5, false],
      ["pi0.5", 50.47, false],
      ["GR00T N1.6", 30.6, false],
      ["SmolVLA", 28.33, false],
      ["X-VLA", 33.9, false],
      ["TRACE Regression", 69.23, true],
      ["TRACE Diffusion", 59.53, true],
    ],
  },
  memory: {
    kicker: "Memory modules",
    title: "Matched memory-module average",
    resultTitle: "History helps, but routing matters.",
    resultText:
      "Generic recurrent, context, external, and retrieval memories improve over no memory, but signature-routed slots give the strongest matched regression result.",
    statA: "69.23 TRACE slots",
    statB: "56.30 retrieval-prompt control",
    values: [
      ["No memory", 25.5, false],
      ["GRU recurrent", 45.83, false],
      ["Transformer context", 52.1, false],
      ["LRU external", 53.93, false],
      ["Retrieval prompt", 56.3, false],
      ["TRACE slots", 69.23, true],
    ],
  },
  diagnostics: {
    kicker: "Diagnostics",
    title: "Branch consistency",
    resultTitle: "Ordered history is doing real work.",
    resultText:
      "Order-preserving transforms keep branch consistency high, while reversing the causal order sharply lowers the diagnostic score.",
    statA: "94.53 order-preserving mean",
    statB: "41.60 order reversal",
    values: [
      ["Time resampling", 96.0, true],
      ["Speed jitter", 94.7, true],
      ["State offset", 95.1, true],
      ["Sparse sampling", 92.3, true],
      ["Order reversal", 41.6, false],
      ["Full TRACE", 100.0, true],
    ],
  },
};

const problemSteps = [
  {
    kicker: "01 / Early cue",
    title: "The histories are still visibly different.",
    copy:
      "The robot observes the cue that will later determine the branch: origin, side, tray source, or object identity. TRACE writes this visual-state evidence before it leaves view.",
    phase: "phase-cue",
    historyACue: "Book begins on desk",
    historyBCue: "Book begins on bed",
    historyACurrent: "cue still visible",
    historyBCurrent: "cue still visible",
    historyAAction: "branch not needed",
    historyBAction: "branch not needed",
    bridge: "TRACE stores the cue as memory content.",
    equation:
      "cue(H<sub>t</sub>) = desk<br />cue(H'<sub>t</sub>) = bed",
    equationCopy:
      "At the beginning, the current observation can still identify the causal history.",
  },
  {
    kicker: "02 / Shared transit",
    title: "Different histories pass through the same-looking segment.",
    copy:
      "The robot moves through a shared carry or staging phase. The decisive cue is now outside the short observation window, even though it remains part of the causal history.",
    phase: "phase-transit",
    historyACue: "desk origin",
    historyBCue: "bed origin",
    historyACurrent: "same carry view",
    historyBCurrent: "same carry view",
    historyAAction: "continue transit",
    historyBAction: "continue transit",
    bridge: "The current frame no longer separates the histories.",
    equation:
      "x<sub>t-w+1:t</sub> &asymp; x'<sub>t-w+1:t</sub><br />cue &notin; x<sub>t-w+1:t</sub>",
    equationCopy:
      "A short window can contain the latest visual state while losing the earlier cause.",
  },
  {
    kicker: "03 / Ambiguous branch",
    title: "The current observation matches, but the correct action diverges.",
    copy:
      "At the branch point, both rollouts can look locally plausible. Choosing correctly requires knowing which history produced the current state.",
    phase: "phase-branch",
    historyACue: "desk origin",
    historyBCue: "bed origin",
    historyACurrent: "same bedside view",
    historyBCurrent: "same bedside view",
    historyAAction: "place on desk-route target",
    historyBAction: "place on bed-route target",
    bridge: "This is the non-Markov moment the section title points to.",
    equation:
      "x<sub>t-w+1:t</sub> &asymp; x'<sub>t-w+1:t</sub><br />a<sup>*</sup><sub>t</sub>(H<sub>t</sub>) &ne; a<sup>*</sup><sub>t</sub>(H'<sub>t</sub>)",
    equationCopy:
      "The same recent observation window can require two different demonstrated actions.",
  },
  {
    kicker: "04 / Memory readout",
    title: "TRACE supplies the missing causal context to the policy.",
    copy:
      "Path and delta signatures address the fixed memory slots by how the robot arrived here. The adapter turns the readout into a compact condition for the unchanged action policy.",
    phase: "phase-memory",
    historyACue: "stored desk cue",
    historyBCue: "stored bed cue",
    historyACurrent: "same current frame",
    historyBCurrent: "same current frame",
    historyAAction: "read desk route",
    historyBAction: "read bed route",
    bridge: "Read memory by trajectory address, then condition the action head.",
    equation:
      "c<sub>t</sub> = A<sub>&theta;</sub>(M<sub>t</sub>, &xi;<sub>t</sub>, &delta;<sub>t</sub>)<br />y&#770;<sub>t</sub> = f<sub>&psi;</sub>(z<sub>t</sub>, c<sub>t</sub>)",
    equationCopy:
      "The policy backbone, action head, and imitation loss stay unchanged; TRACE only adds causal context.",
  },
];

const heroVideos = [...document.querySelectorAll(".hero-video-tile")];

function warmHeroVideos() {
  heroVideos.forEach((video, index) => {
    const primeVideo = () => {
      const maxInitialOffset = Math.min(video.duration * 0.35, 4);
      const offset = (maxInitialOffset * index) / Math.max(heroVideos.length - 1, 1);
      if (Number.isFinite(video.duration) && video.duration > offset + 0.25) {
        video.currentTime = offset;
      }

      video.play().catch(() => {});
    };

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      primeVideo();
    } else {
      video.addEventListener("loadedmetadata", primeVideo, { once: true });
    }

    video.addEventListener("canplay", () => video.play().catch(() => {}), { once: true });
  });
}

function setActive(buttons, activeButton) {
  buttons.forEach((button) => {
    const isActive = button === activeButton;
    button.classList.toggle("active", isActive);
    if (button.hasAttribute("aria-selected")) {
      button.setAttribute("aria-selected", String(isActive));
    }
    if (button.hasAttribute("role") && button.getAttribute("role") === "tab") {
      button.tabIndex = isActive ? 0 : -1;
    }
  });
}

function updateProblemStep(stepIndex) {
  const step = problemSteps[Number(stepIndex)] ?? problemSteps[0];
  const buttons = [...document.querySelectorAll(".flow-node")];
  const activeButton = buttons.find((button) => button.dataset.node === String(stepIndex)) ?? buttons[0];
  setActive(buttons, activeButton);
  buttons.forEach((button) => {
    button.tabIndex = button === activeButton ? 0 : -1;
  });

  const panel = document.getElementById("problemDetail");
  if (panel && activeButton?.id) {
    panel.setAttribute("aria-labelledby", activeButton.id);
  }

  document.getElementById("problemKicker").textContent = step.kicker;
  document.getElementById("problemTitle").textContent = step.title;
  document.getElementById("problemCopy").textContent = step.copy;
  document.getElementById("historyACue").textContent = step.historyACue;
  document.getElementById("historyBCue").textContent = step.historyBCue;
  document.getElementById("historyACurrent").textContent = step.historyACurrent;
  document.getElementById("historyBCurrent").textContent = step.historyBCurrent;
  document.getElementById("historyAAction").textContent = step.historyAAction;
  document.getElementById("historyBAction").textContent = step.historyBAction;
  document.getElementById("memoryBridgeLabel").textContent = step.bridge;
  document.getElementById("problemEquation").innerHTML = step.equation;
  document.getElementById("problemEquationCopy").textContent = step.equationCopy;

  const branchVisual = document.getElementById("branchVisual");
  branchVisual.className = `branch-visual ${step.phase}`;
}

function updateMethod(stepName) {
  const step = methodSteps[stepName] ?? methodSteps.write;
  const buttons = [...document.querySelectorAll(".method-step")];
  const activeButton = buttons.find((button) => button.dataset.step === stepName) ?? buttons[0];
  const panel = document.getElementById("methodDetail");

  if (panel && activeButton?.id) {
    panel.setAttribute("aria-labelledby", activeButton.id);
  }

  document.getElementById("methodKicker").textContent = step.kicker;
  document.getElementById("methodTitle").textContent = step.title;
  document.getElementById("methodCopy").textContent = step.copy;
  document.getElementById("methodVideoLabel").textContent = step.videoLabel;
  document.getElementById("methodVideoTitle").textContent = step.videoTitle;

  const video = document.getElementById("methodVideo");
  if (video.getAttribute("src") !== step.video) {
    video.poster = step.poster;
    video.src = step.video;
    video.load();
  }
  video.play().catch(() => {});

  const metricOne = step.metrics[0];
  const metricTwo = step.metrics[1];
  document.getElementById("methodMetricOneLabel").textContent = metricOne[0];
  document.getElementById("methodMetricOne").textContent = metricOne[1];
  document.getElementById("methodMetricTwoLabel").textContent = metricTwo[0];
  document.getElementById("methodMetricTwo").textContent = metricTwo[1];
}

function renderChart(viewName) {
  const view = resultViews[viewName];
  document.getElementById("chartTitle").textContent = view.title;
  document.getElementById("resultKicker").textContent = view.kicker;
  document.getElementById("resultTitle").textContent = view.resultTitle;
  document.getElementById("resultText").textContent = view.resultText;
  document.getElementById("resultStatA").textContent = view.statA;
  document.getElementById("resultStatB").textContent = view.statB;

  const chart = document.getElementById("barChart");
  chart.innerHTML = "";

  view.values.forEach(([label, value, highlight]) => {
    const row = document.createElement("div");
    row.className = `bar-row${highlight ? " highlight" : ""}`;

    const name = document.createElement("span");
    name.textContent = label;

    const track = document.createElement("span");
    track.className = "bar-track";

    const fill = document.createElement("span");
    fill.className = "bar-fill";
    fill.style.setProperty("--value", `${Math.max(0, Math.min(100, value))}%`);
    track.appendChild(fill);

    const amount = document.createElement("strong");
    amount.textContent = value.toFixed(value % 1 === 0 ? 0 : 2);

    row.append(name, track, amount);
    chart.appendChild(row);
  });
}

function updateScrollMeter() {
  const meter = document.getElementById("scrollMeter");
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  meter.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;
}

document.querySelectorAll(".flow-node").forEach((button) => {
  button.addEventListener("click", () => updateProblemStep(button.dataset.node));
  button.addEventListener("keydown", (event) => {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;

    event.preventDefault();
    const buttons = [...document.querySelectorAll(".flow-node")];
    const currentIndex = buttons.indexOf(button);
    const lastIndex = buttons.length - 1;
    let nextIndex = (currentIndex + 1) % buttons.length;
    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (currentIndex + lastIndex) % buttons.length;
    }
    const nextButton = buttons[nextIndex];
    nextButton.focus();
    updateProblemStep(nextButton.dataset.node);
  });
});

document.querySelectorAll(".method-step").forEach((button) => {
  button.addEventListener("click", () => {
    setActive([...document.querySelectorAll(".method-step")], button);
    updateMethod(button.dataset.step);
  });
  button.addEventListener("keydown", (event) => {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;

    event.preventDefault();
    const buttons = [...document.querySelectorAll(".method-step")];
    const currentIndex = buttons.indexOf(button);
    const lastIndex = buttons.length - 1;
    let nextIndex = (currentIndex + 1) % buttons.length;
    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (currentIndex + lastIndex) % buttons.length;
    }
    const nextButton = buttons[nextIndex];
    nextButton.focus();
    setActive(buttons, nextButton);
    updateMethod(nextButton.dataset.step);
  });
});

document.querySelectorAll(".results-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    setActive([...document.querySelectorAll(".results-tabs button")], button);
    renderChart(button.dataset.result);
  });
});

window.addEventListener("scroll", () => {
  updateScrollMeter();
});

window.addEventListener("resize", updateScrollMeter);

warmHeroVideos();
updateProblemStep("0");
updateMethod("write");
renderChart("main");
updateScrollMeter();
