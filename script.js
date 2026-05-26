const methodSteps = {
  write: {
    kicker: "Write",
    title: "Visual-state evidence is stored when the cue is visible.",
    copy:
      "Current RGB and proprioceptive features form the memory content, so the module stores the evidence before it disappears from the camera view.",
    levels: ["78%", "36%", "62%", "22%", "54%", "44%"],
  },
  route: {
    kicker: "Route",
    title: "Path and delta signatures decide where evidence is written.",
    copy:
      "The address comes from the executed robot-state trajectory, not from a task label, a branch label, or raw time indexing.",
    levels: ["28%", "82%", "48%", "70%", "34%", "24%"],
  },
  read: {
    kicker: "Read",
    title: "The branch point reads a compact memory vector.",
    copy:
      "When current observations become visually similar across histories, the readout selects slot contents that still carry the early evidence.",
    levels: ["24%", "42%", "88%", "56%", "72%", "30%"],
  },
  adapt: {
    kicker: "Adapt",
    title: "The same memory state conditions different policy families.",
    copy:
      "Regression receives memory tokens through attention, while diffusion receives an added conditioning vector. The action objectives remain unchanged.",
    levels: ["46%", "58%", "70%", "38%", "64%", "84%"],
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

function setActive(buttons, activeButton) {
  buttons.forEach((button) => {
    button.classList.toggle("active", button === activeButton);
  });
}

function updateMethod(stepName) {
  const step = methodSteps[stepName];
  document.getElementById("methodKicker").textContent = step.kicker;
  document.getElementById("methodTitle").textContent = step.title;
  document.getElementById("methodCopy").textContent = step.copy;
  document.querySelectorAll(".slot-visual span").forEach((slot, index) => {
    slot.style.setProperty("--level", step.levels[index]);
  });
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

function updateFlowHighlight() {
  const nodes = [...document.querySelectorAll(".flow-node")];
  if (nodes.length === 0) return;

  const index = Math.min(
    nodes.length - 1,
    Math.max(0, Math.floor((window.scrollY / Math.max(window.innerHeight, 1)) % nodes.length))
  );

  nodes.forEach((node, nodeIndex) => {
    node.classList.toggle("active", nodeIndex === index);
  });
}

document.querySelectorAll(".method-step").forEach((button) => {
  button.addEventListener("click", () => {
    setActive([...document.querySelectorAll(".method-step")], button);
    updateMethod(button.dataset.step);
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
  updateFlowHighlight();
});

window.addEventListener("resize", updateScrollMeter);

renderChart("main");
updateScrollMeter();
updateFlowHighlight();
