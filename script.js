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

function score(mean, se) {
  return { mean, se };
}

function makeScoreMetrics(rows, columns) {
  return columns.map((column) => ({
    key: column.key,
    label: column.label,
    unit: "%",
    note: column.note,
    values: rows.map((row) => {
      const cell = row.values[column.key];
      const display = `${cell.mean.toFixed(2)} +/- ${cell.se.toFixed(2)}%`;
      return {
        label: row.label,
        value: cell.mean,
        display,
        shortDisplay: cell.mean.toFixed(cell.mean % 1 === 0 ? 0 : 2),
        detail: `${column.label}: ${display}`,
        highlight: Boolean(row.highlight),
      };
    }),
  }));
}

function simpleMetric(key, label, unit, values, note) {
  return { key, label, unit, values, note };
}

const taskScoreColumns = [
  { key: "tool", label: "Tool", note: "Mean stage progress on the Tool task." },
  { key: "book", label: "Book", note: "Mean stage progress on the Book task." },
  { key: "laundry", label: "Laundry", note: "Mean stage progress on the Laundry task." },
  { key: "cable", label: "Cable", note: "Mean stage progress on the Cable task." },
  { key: "medicine", label: "Medicine", note: "Mean stage progress on the Medicine task." },
  { key: "avg", label: "Avg.", note: "Task-balanced average progress across the five tasks." },
];

const mainProgressRows = [
  {
    label: "Diffusion Policy",
    values: {
      tool: score(18.0, 1.41),
      book: score(12.33, 0.44),
      laundry: score(22.0, 0.32),
      cable: score(34.0, 0.48),
      medicine: score(38.67, 1.01),
      avg: score(25.0, 0.38),
    },
  },
  {
    label: "ACT",
    values: {
      tool: score(31.0, 5.51),
      book: score(13.67, 0.49),
      laundry: score(11.5, 2.01),
      cable: score(44.0, 7.79),
      medicine: score(27.33, 0.05),
      avg: score(25.5, 1.95),
    },
  },
  {
    label: "pi0.5",
    values: {
      tool: score(45.5, 0.81),
      book: score(51.0, 6.99),
      laundry: score(47.5, 1.45),
      cable: score(49.0, 0.57),
      medicine: score(59.33, 1.45),
      avg: score(50.47, 1.47),
    },
  },
  {
    label: "GR00T N1.6",
    values: {
      tool: score(39.0, 2.31),
      book: score(12.67, 2.14),
      laundry: score(24.0, 2.72),
      cable: score(38.0, 12.11),
      medicine: score(39.33, 3.29),
      avg: score(30.6, 2.64),
    },
  },
  {
    label: "SmolVLA",
    values: {
      tool: score(25.0, 1.51),
      book: score(20.0, 0.82),
      laundry: score(12.0, 2.16),
      cable: score(50.0, 1.44),
      medicine: score(34.67, 1.01),
      avg: score(28.33, 0.65),
    },
  },
  {
    label: "X-VLA",
    values: {
      tool: score(5.5, 0.94),
      book: score(47.0, 6.19),
      laundry: score(41.0, 0.36),
      cable: score(36.0, 21.44),
      medicine: score(40.0, 2.92),
      avg: score(33.9, 4.51),
    },
  },
  {
    label: "Ours (Regression)",
    highlight: true,
    values: {
      tool: score(54.5, 17.96),
      book: score(83.0, 0.86),
      laundry: score(81.0, 2.84),
      cable: score(51.0, 1.11),
      medicine: score(76.67, 1.05),
      avg: score(69.23, 3.65),
    },
  },
  {
    label: "Ours (Diffusion)",
    highlight: true,
    values: {
      tool: score(58.5, 10.17),
      book: score(68.33, 2.86),
      laundry: score(70.5, 0.76),
      cable: score(51.0, 4.63),
      medicine: score(49.33, 0.17),
      avg: score(59.53, 2.31),
    },
  },
];

const memoryModuleRows = [
  {
    label: "No memory",
    values: {
      tool: score(31.0, 5.51),
      book: score(13.67, 0.49),
      laundry: score(11.5, 2.01),
      cable: score(44.0, 7.79),
      medicine: score(27.33, 0.05),
      avg: score(25.5, 1.95),
    },
  },
  {
    label: "GRU recurrent",
    values: {
      tool: score(40.5, 9.12),
      book: score(49.0, 3.04),
      laundry: score(44.0, 2.21),
      cable: score(47.0, 4.98),
      medicine: score(48.67, 1.24),
      avg: score(45.83, 1.91),
    },
  },
  {
    label: "Transformer context",
    values: {
      tool: score(40.5, 7.83),
      book: score(61.67, 2.54),
      laundry: score(55.0, 1.96),
      cable: score(46.0, 3.87),
      medicine: score(57.33, 1.41),
      avg: score(52.1, 1.68),
    },
  },
  {
    label: "LRU external",
    values: {
      tool: score(46.5, 7.64),
      book: score(57.67, 2.48),
      laundry: score(54.5, 2.03),
      cable: score(51.0, 3.52),
      medicine: score(60.0, 1.22),
      avg: score(53.93, 1.61),
    },
  },
  {
    label: "Retrieval prompt",
    values: {
      tool: score(48.0, 7.66),
      book: score(62.67, 2.18),
      laundry: score(59.5, 1.77),
      cable: score(50.0, 3.62),
      medicine: score(61.33, 1.12),
      avg: score(56.3, 1.46),
    },
  },
  {
    label: "TRACE routed slots",
    highlight: true,
    values: {
      tool: score(54.5, 17.96),
      book: score(83.0, 0.86),
      laundry: score(81.0, 2.84),
      cable: score(51.0, 1.11),
      medicine: score(76.67, 1.05),
      avg: score(69.23, 3.65),
    },
  },
];

const effectDataGroupIds = new Set([
  "main-results",
  "memory-modules",
  "diagnostics",
  "stability",
  "leave-one-task-out",
  "tool-uncertainty",
]);

const paperDataGroups = [
  {
    id: "main-results",
    label: "Main Results",
    source: "Body / Table 1",
    title: "Real-world delayed-evidence progress",
    description:
      "Mean stage progress for the main policy comparison across Tool, Book, Laundry, Cable, Medicine, and the task-balanced average.",
    metrics: makeScoreMetrics(mainProgressRows, taskScoreColumns),
    note: "Values are mean stage progress percentages with rollout standard error from the paper table.",
  },
  {
    id: "memory-modules",
    label: "Memory Modules",
    source: "Body / Table 2",
    title: "Matched memory-module comparison",
    description:
      "Regression-base controls compare no memory, recurrent memory, transformer context, LRU memory, retrieval prompting, and TRACE routed slots.",
    metrics: makeScoreMetrics(memoryModuleRows, taskScoreColumns),
    note: "Online/fixed/signature flags are described in the table text; the chart shows the numerical progress columns.",
  },
  {
    id: "diagnostics",
    label: "Diagnostics",
    source: "Body / Table 3",
    title: "Ablations and history-transform diagnostics",
    description:
      "Component ablations report average progress; history transforms report normalized route similarity and branch consistency.",
    metrics: [
      simpleMetric("ablation", "Ablation avg.", "%", [
        { label: "Current observation only", value: 25.5, display: "25.50 +/- 1.95%", detail: "Average progress", highlight: false },
        { label: "Signature-only", value: 45.5, display: "45.50 +/- 1.82%", detail: "Average progress", highlight: false },
        { label: "Unrouted slot memory", value: 52.17, display: "52.17 +/- 1.63%", detail: "Average progress", highlight: false },
        { label: "No-delta routing", value: 61.43, display: "61.43 +/- 2.21%", detail: "Average progress", highlight: false },
        { label: "Mean readout", value: 62.8, display: "62.80 +/- 2.44%", detail: "Average progress", highlight: false },
        { label: "No auxiliary losses", value: 66.1, display: "66.10 +/- 2.84%", detail: "Average progress", highlight: false },
        { label: "Full TRACE", value: 69.23, display: "69.23 +/- 3.65%", detail: "Average progress", highlight: true },
      ]),
      simpleMetric("route", "Route similarity", "%", [
        { label: "Time resampling", value: 92.4, display: "92.40 +/- 1.10%", detail: "time-change invariant", highlight: true },
        { label: "Speed jitter", value: 89.8, display: "89.80 +/- 1.40%", detail: "time-change invariant", highlight: true },
        { label: "State offset", value: 91.2, display: "91.20 +/- 1.20%", detail: "offset invariant", highlight: true },
        { label: "Sparse sampling", value: 86.5, display: "86.50 +/- 1.60%", detail: "sampling robustness", highlight: true },
        { label: "Order reversal", value: 37.8, display: "37.80 +/- 2.50%", detail: "negative control", highlight: false },
        { label: "Order-preserving controls", value: 89.98, display: "89.98 +/- 0.68%", detail: "summary", highlight: true },
        { label: "Full TRACE", value: 100.0, display: "100.00 +/- 0.00%", detail: "reference", highlight: true },
      ]),
      simpleMetric("branch", "Branch consistency", "%", [
        { label: "Time resampling", value: 96.0, display: "96.00 +/- 0.80%", detail: "time-change invariant", highlight: true },
        { label: "Speed jitter", value: 94.7, display: "94.70 +/- 1.00%", detail: "time-change invariant", highlight: true },
        { label: "State offset", value: 95.1, display: "95.10 +/- 0.90%", detail: "offset invariant", highlight: true },
        { label: "Sparse sampling", value: 92.3, display: "92.30 +/- 1.20%", detail: "sampling robustness", highlight: true },
        { label: "Order reversal", value: 41.6, display: "41.60 +/- 2.20%", detail: "negative control", highlight: false },
        { label: "Order-preserving controls", value: 94.53, display: "94.53 +/- 0.49%", detail: "summary", highlight: true },
        { label: "Full TRACE", value: 100.0, display: "100.00 +/- 0.00%", detail: "reference", highlight: true },
      ]),
    ],
    note: "Diagnostics are normalized to the Full TRACE reference for cross-task comparison.",
  },
  {
    id: "baseline-protocol",
    label: "Baseline Protocol",
    source: "Appendix / Table 4",
    title: "External VLA baseline protocol",
    description:
      "Numerical interface controls for language-conditioned baselines: update budget, visual/state inputs, and action chunk settings where reported.",
    metrics: [
      simpleMetric("updates", "Updates", "k", [
        { label: "SmolVLA", value: 180, display: "180k", detail: "tuned adapter/state mapper, frozen vision" },
        { label: "pi0.5", value: 180, display: "180k", detail: "released policy adaptation path" },
        { label: "X-VLA", value: 180, display: "180k", detail: "policy transformer and soft prompts" },
        { label: "GR00T N1.6", value: 180, display: "180k", detail: "released N1.6 adaptation" },
      ]),
      simpleMetric("views", "RGB views", "views", [
        { label: "SmolVLA", value: 3, display: "3 RGB views" },
        { label: "pi0.5", value: 3, display: "224px RGB views", detail: "same 3-view setup" },
        { label: "X-VLA", value: 3, display: "same views", detail: "same camera stream" },
        { label: "GR00T N1.6", value: 3, display: "same rollout API", detail: "same camera stream" },
      ]),
      simpleMetric("state", "State dim.", "D", [
        { label: "SmolVLA", value: 17, display: "17-D state" },
        { label: "pi0.5", value: 17, display: "17-D state" },
        { label: "X-VLA", value: 17, display: "same 17-D state" },
        { label: "GR00T N1.6", value: 17, display: "same 17-D state" },
      ]),
      simpleMetric("chunk", "Action chunk", "steps", [
        { label: "SmolVLA", value: 50, display: "50-step chunks" },
        { label: "pi0.5", value: 50, display: "50-step chunks" },
        { label: "X-VLA", value: 16, display: "16-step chunks" },
      ]),
    ],
    note: "Rows without a numeric value in the paper table are omitted for that selected metric.",
  },
  {
    id: "model-size",
    label: "Model Size",
    source: "Appendix / Table 5",
    title: "Parameter audit for baselines and TRACE modules",
    description:
      "Total, trainable, and frozen parameter counts from the local checkpoint and model-cache audit. Billion-scale models are converted to millions for a shared axis.",
    metrics: [
      simpleMetric("total", "Total params", "M", [
        { label: "ACT", value: 51.62, display: "51.62M" },
        { label: "Diffusion Policy", value: 270.96, display: "270.96M" },
        { label: "SmolVLA", value: 450.05, display: "450.05M" },
        { label: "pi0.5", value: 3620, display: "3.62B" },
        { label: "X-VLA", value: 879.74, display: "879.74M" },
        { label: "GR00T N1.6", value: 2720, display: "2.72B" },
        { label: "TRACE updater", value: 11.91, display: "11.91M", highlight: true },
        { label: "Regression adapter", value: 0.79, display: "0.79M", highlight: true },
        { label: "Diffusion adapter", value: 16.03, display: "16.03M", highlight: true },
      ]),
      simpleMetric("trainable", "Trainable params", "M", [
        { label: "ACT", value: 51.62, display: "51.62M" },
        { label: "Diffusion Policy", value: 270.96, display: "270.96M" },
        { label: "SmolVLA", value: 99.88, display: "99.88M" },
        { label: "pi0.5", value: 693.42, display: "693.42M" },
        { label: "X-VLA", value: 879.74, display: "879.74M" },
        { label: "GR00T N1.6", value: 1070, display: "1.07B" },
        { label: "TRACE updater", value: 11.91, display: "11.91M", highlight: true },
        { label: "Regression adapter", value: 0.79, display: "0.79M", highlight: true },
        { label: "Diffusion adapter", value: 16.03, display: "16.03M", highlight: true },
      ]),
      simpleMetric("frozen", "Frozen params", "M", [
        { label: "ACT", value: 0, display: "0" },
        { label: "Diffusion Policy", value: 0, display: "0" },
        { label: "SmolVLA", value: 350.17, display: "350.17M VLM frozen" },
        { label: "pi0.5", value: 2920, display: "2.92B PaliGemma frozen" },
        { label: "X-VLA", value: 0, display: "0" },
        { label: "GR00T N1.6", value: 1660, display: "1.66B language/vision frozen" },
        { label: "TRACE updater", value: 0, display: "0", highlight: true },
        { label: "Regression adapter", value: 0, display: "0", highlight: true },
        { label: "Diffusion adapter", value: 0, display: "0", highlight: true },
      ]),
    ],
    note: "All bars use millions of parameters for scale; the tooltip preserves the paper's M/B notation.",
  },
  {
    id: "added-params",
    label: "Added Params",
    source: "Appendix / Table 6",
    title: "Additive TRACE parameter budget",
    description:
      "Added parameter budget for the regression and diffusion policy-facing TRACE interfaces.",
    metrics: [
      simpleMetric("base", "Base params", "M", [
        { label: "Regression interface", value: 51.62, display: "51.62M", detail: "ACT audit checkpoint" },
        { label: "Diffusion interface", value: 270.96, display: "270.96M", detail: "Diffusion Policy audit checkpoint" },
      ]),
      simpleMetric("added", "Added params", "M", [
        { label: "Regression interface", value: 12.69, display: "12.69M", highlight: true },
        { label: "Diffusion interface", value: 27.94, display: "27.94M", highlight: true },
      ]),
      simpleMetric("increase", "Increase", "%", [
        { label: "Regression interface", value: 24.6, display: "24.6%", highlight: true },
        { label: "Diffusion interface", value: 10.3, display: "10.3%", highlight: true },
      ]),
    ],
    note: "Added count includes the shared updater and the policy-specific adapter.",
  },
  {
    id: "training-hparams",
    label: "Training",
    source: "Appendix / Table 7",
    title: "Training hyperparameters",
    description:
      "Optimization budget, batch, action windows, execution windows, and explicitly reported tuning constants.",
    metrics: [
      simpleMetric("updates", "Updates", "k", [
        { label: "ACT regression", value: 180, display: "180k" },
        { label: "Diffusion Policy", value: 180, display: "180k" },
        { label: "SmolVLA", value: 180, display: "180k" },
        { label: "pi0.5", value: 180, display: "180k" },
        { label: "X-VLA", value: 180, display: "180k" },
        { label: "GR00T N1.6", value: 180, display: "180k" },
      ]),
      simpleMetric("batch", "Batch max", "samples", [
        { label: "ACT regression", value: 32, display: "8 or 32" },
        { label: "Diffusion Policy", value: 8, display: "8" },
        { label: "SmolVLA", value: 16, display: "8 or 16" },
        { label: "pi0.5", value: 1, display: "1" },
        { label: "X-VLA", value: 1, display: "1" },
      ]),
      simpleMetric("window", "Action horizon", "steps", [
        { label: "ACT regression", value: 100, display: "chunk 100" },
        { label: "Diffusion Policy", value: 104, display: "horizon 104" },
        { label: "SmolVLA", value: 50, display: "chunk 50" },
        { label: "pi0.5", value: 50, display: "chunk 50" },
        { label: "X-VLA", value: 16, display: "chunk 16" },
      ]),
      simpleMetric("execute", "Execute window", "steps", [
        { label: "ACT regression", value: 100, display: "execute 100" },
        { label: "Diffusion Policy", value: 100, display: "execute 100" },
        { label: "SmolVLA", value: 50, display: "execute 50" },
        { label: "pi0.5", value: 50, display: "execute 50" },
        { label: "X-VLA", value: 16, display: "execute 16" },
      ]),
      simpleMetric("warmup", "Warmup", "steps", [
        { label: "SmolVLA", value: 1000, display: "1000 warmup steps" },
        { label: "pi0.5", value: 1000, display: "1000 warmup steps" },
        { label: "X-VLA", value: 1000, display: "1000 warmup steps" },
      ]),
    ],
    note: "LeRobot preset rows have optimizer details in text but no explicit learning-rate number in the table.",
  },
  {
    id: "dataset-scale",
    label: "Dataset Scale",
    source: "Appendix / Table 8",
    title: "Dataset and demonstration details",
    description:
      "Train demonstrations, physical evaluation rollouts, episode horizons, and task decomposition counts for the five real robot tasks.",
    metrics: [
      simpleMetric("train", "Train demos", "demos", [
        { label: "Tool", value: 100, display: "100" },
        { label: "Book", value: 150, display: "150" },
        { label: "Laundry", value: 60, display: "60" },
        { label: "Cable", value: 30, display: "30" },
        { label: "Medicine", value: 60, display: "60" },
      ]),
      simpleMetric("eval", "Eval rollouts", "rollouts", [
        { label: "Tool", value: 25, display: "25" },
        { label: "Book", value: 25, display: "25" },
        { label: "Laundry", value: 25, display: "25" },
        { label: "Cable", value: 25, display: "25" },
        { label: "Medicine", value: 25, display: "25" },
      ]),
      simpleMetric("frames", "Episode frames", "frames", [
        { label: "Tool", value: 2910, display: "2,910 frames" },
        { label: "Book", value: 1392, display: "1,392 frames" },
        { label: "Laundry", value: 2220, display: "2,220 frames" },
        { label: "Cable", value: 1770, display: "1,770 frames" },
        { label: "Medicine", value: 1759, display: "1,759 frames" },
      ]),
      simpleMetric("seconds", "Episode seconds", "s", [
        { label: "Tool", value: 97.0, display: "97.0s" },
        { label: "Book", value: 46.4, display: "46.4s" },
        { label: "Laundry", value: 74.0, display: "74.0s" },
        { label: "Cable", value: 59.0, display: "59.0s" },
        { label: "Medicine", value: 58.6, display: "58.6s" },
      ]),
      simpleMetric("subtasks", "Subtasks", "count", [
        { label: "Tool", value: 2, display: "2/4 subtasks/stages" },
        { label: "Book", value: 3, display: "3/4 subtasks/stages" },
        { label: "Laundry", value: 2, display: "2/4 subtasks/stages" },
        { label: "Cable", value: 1, display: "1/4 subtasks/stages" },
        { label: "Medicine", value: 2, display: "2/4 subtasks/stages" },
      ]),
      simpleMetric("stages", "Stages", "count", [
        { label: "Tool", value: 4, display: "4 stages" },
        { label: "Book", value: 4, display: "4 stages" },
        { label: "Laundry", value: 4, display: "4 stages" },
        { label: "Cable", value: 4, display: "4 stages" },
        { label: "Medicine", value: 4, display: "4 stages" },
      ]),
    ],
    note: "Validation demonstration count is 0 for all five rows in the paper table.",
  },
  {
    id: "state-signature",
    label: "State + Signatures",
    source: "Appendix / Table 9",
    title: "Robot state channels used by TRACE signatures",
    description:
      "Dimensionality of state blocks, full state path, path signature, and delta signature used by the routing key.",
    metrics: [
      simpleMetric("dims", "Dimension", "D", [
        { label: "Base planar velocity", value: 2, display: "2D", detail: "m/s; fixed-base tasks zero both channels" },
        { label: "Base yaw velocity", value: 1, display: "1D", detail: "rad/s; fixed-base tasks zero this channel" },
        { label: "Left arm joints", value: 7, display: "7D", detail: "radians" },
        { label: "Right arm joints", value: 7, display: "7D", detail: "radians" },
        { label: "Full state path", value: 17, display: "17D", detail: "masked, standardized state" },
        { label: "Path signature", value: 5219, display: "5,219D", detail: "scalar coordinate omitted", highlight: true },
        { label: "Delta signature", value: 5219, display: "5,219D", detail: "one-step signature difference", highlight: true },
      ]),
    ],
    note: "No cue label, branch identifier, future action, or language token is appended to the signature state.",
  },
  {
    id: "trace-hparams",
    label: "TRACE Hparams",
    source: "Appendix / Table 10",
    title: "Core TRACE hyperparameters",
    description:
      "Shared memory settings used by both policy families: signature depth, signature dimension, embedding widths, slot budget, and history scan budget.",
    metrics: [
      simpleMetric("dims", "Dimensionality", "D", [
        { label: "Raw signature dim.", value: 5219, display: "5,219", highlight: true },
        { label: "Signature embedding g_t", value: 512, display: "512" },
        { label: "Delta embedding", value: 512, display: "512" },
        { label: "Slot width", value: 512, display: "512" },
        { label: "Routing hidden size", value: 512, display: "512" },
        { label: "Adapter hidden size", value: 512, display: "512" },
      ]),
      simpleMetric("counts", "Counts / budgets", "count", [
        { label: "Signature depth", value: 3, display: "p = 3", highlight: true },
        { label: "Slot count min", value: 4, display: "K = 4" },
        { label: "Slot count max", value: 6, display: "K = 6" },
        { label: "History budget min", value: 24, display: "L = 24" },
        { label: "History budget max", value: 32, display: "L = 32" },
        { label: "History stride min", value: 4, display: "r = 4" },
        { label: "History stride max", value: 8, display: "r = 8" },
      ]),
    ],
    note: "The downstream policy losses and action heads remain unchanged.",
  },
  {
    id: "signature-depth",
    label: "Signature Depth",
    source: "Appendix / Table 11",
    title: "Signature depth scaling for 17-D state",
    description:
      "Standard signature and log-signature dimensions for depths 1 through 4, showing why p=3 is used in reported runs.",
    metrics: [
      simpleMetric("standard", "Standard dim.", "D", [
        { label: "Depth 1", value: 17, display: "17" },
        { label: "Depth 2", value: 306, display: "306" },
        { label: "Depth 3", value: 5219, display: "5,219", detail: "used in reported runs", highlight: true },
        { label: "Depth 4", value: 88740, display: "88,740" },
      ]),
      simpleMetric("log", "Log signature dim.", "D", [
        { label: "Depth 1", value: 17, display: "17" },
        { label: "Depth 2", value: 153, display: "153" },
        { label: "Depth 3", value: 1785, display: "1,785", detail: "alternative not used", highlight: true },
        { label: "Depth 4", value: 22593, display: "22,593" },
      ]),
    ],
    note: "Depth 4 substantially increases storage and learned-compression cost before routing.",
  },
  {
    id: "stability",
    label: "Stability",
    source: "Appendix / Table 12",
    title: "Long-horizon memory stability diagnostics",
    description:
      "Fixed-slot memory behavior under reported-horizon and extended-history diagnostic passes.",
    metrics: [
      simpleMetric("churn", "Slot churn", "rate", [
        { label: "Reported horizon 1.0x", value: 0.01, display: "0.010", highlight: true },
        { label: "Extended 1.25x", value: 0.017, display: "0.017" },
        { label: "Extended 1.5x", value: 0.025, display: "0.025" },
        { label: "Extended 2.0x", value: 0.041, display: "0.041" },
        { label: "Repeated distractor 1.5x", value: 0.052, display: "0.052" },
        { label: "Shared-route 2.0x", value: 0.035, display: "0.035" },
      ]),
      simpleMetric("entropy", "Write entropy", "norm.", [
        { label: "Reported horizon 1.0x", value: 0.356, display: "0.356", highlight: true },
        { label: "Extended 1.25x", value: 0.374, display: "0.374" },
        { label: "Extended 1.5x", value: 0.397, display: "0.397" },
        { label: "Extended 2.0x", value: 0.431, display: "0.431" },
        { label: "Repeated distractor 1.5x", value: 0.462, display: "0.462" },
        { label: "Shared-route 2.0x", value: 0.412, display: "0.412" },
      ]),
      simpleMetric("occupancy", "Slot occupancy", "rate", [
        { label: "Reported horizon 1.0x", value: 0.646, display: "0.646" },
        { label: "Extended 1.25x", value: 0.69, display: "0.690" },
        { label: "Extended 1.5x", value: 0.71, display: "0.710" },
        { label: "Extended 2.0x", value: 0.744, display: "0.744" },
        { label: "Repeated distractor 1.5x", value: 0.758, display: "0.758" },
        { label: "Shared-route 2.0x", value: 0.737, display: "0.737" },
      ]),
      simpleMetric("readout", "Readout consistency", "cos.", [
        { label: "Reported horizon 1.0x", value: 1.0, display: "1.000", highlight: true },
        { label: "Extended 1.25x", value: 0.982, display: "0.982" },
        { label: "Extended 1.5x", value: 0.962, display: "0.962" },
        { label: "Extended 2.0x", value: 0.928, display: "0.928" },
        { label: "Repeated distractor 1.5x", value: 0.907, display: "0.907" },
        { label: "Shared-route 2.0x", value: 0.943, display: "0.943" },
      ]),
      simpleMetric("decision", "Decision consistency", "rate", [
        { label: "Reported horizon 1.0x", value: 1.0, display: "1.000", highlight: true },
        { label: "Extended 1.25x", value: 0.968, display: "0.968" },
        { label: "Extended 1.5x", value: 0.936, display: "0.936" },
        { label: "Extended 2.0x", value: 0.904, display: "0.904" },
        { label: "Repeated distractor 1.5x", value: 0.872, display: "0.872" },
        { label: "Shared-route 2.0x", value: 0.916, display: "0.916" },
      ]),
    ],
    note: "The diagnostic measures evaluated extensions; it is not a proof for arbitrary horizons.",
  },
  {
    id: "adapter-interfaces",
    label: "Adapters",
    source: "Appendix / Table 13",
    title: "Adapter interface dimensions",
    description:
      "Numerical widths exposed by the regression adapter, diffusion adapter, and shared updater interface.",
    metrics: [
      simpleMetric("width", "Conditioning width", "D", [
        { label: "Regression memory tokens", value: 512, display: "512-D tokens", highlight: true },
        { label: "Diffusion global condition", value: 512, display: "512-D vector", highlight: true },
        { label: "Shared slot width", value: 512, display: "512-D slots", highlight: true },
      ]),
    ],
    note: "The surrounding table is mostly architectural text; this chart extracts the numeric adapter widths reported there.",
  },
  {
    id: "latency",
    label: "Latency",
    source: "Appendix / Table 14",
    title: "Per-step deployment latency",
    description:
      "Mean and p95 latency breakdowns in milliseconds for regression and diffusion adapters, plus percentage overhead.",
    metrics: [
      simpleMetric("regMean", "Regression mean", "ms", [
        { label: "Base forward", value: 5.9, display: "5.90 ms" },
        { label: "Signature", value: 0.52, display: "0.52 ms", highlight: true },
        { label: "Slot update", value: 0.9, display: "0.90 ms", highlight: true },
        { label: "Readout", value: 0.58, display: "0.58 ms", highlight: true },
        { label: "Adapter", value: 0.1, display: "0.10 ms", highlight: true },
        { label: "TRACE overhead", value: 2.11, display: "2.11 ms", highlight: true },
        { label: "Total loop", value: 8.32, display: "8.32 ms" },
      ]),
      simpleMetric("regP95", "Regression p95", "ms", [
        { label: "Base forward", value: 7.21, display: "7.21 ms" },
        { label: "Signature", value: 0.69, display: "0.69 ms", highlight: true },
        { label: "Slot update", value: 1.26, display: "1.26 ms", highlight: true },
        { label: "Readout", value: 0.74, display: "0.74 ms", highlight: true },
        { label: "Adapter", value: 0.15, display: "0.15 ms", highlight: true },
        { label: "TRACE overhead", value: 2.66, display: "2.66 ms", highlight: true },
        { label: "Total loop", value: 10.02, display: "10.02 ms" },
      ]),
      simpleMetric("diffMean", "Diffusion mean", "ms", [
        { label: "Base forward", value: 118.0, display: "118.00 ms" },
        { label: "Signature", value: 0.52, display: "0.52 ms", highlight: true },
        { label: "Slot update", value: 0.9, display: "0.90 ms", highlight: true },
        { label: "Readout", value: 0.58, display: "0.58 ms", highlight: true },
        { label: "Adapter", value: 0.14, display: "0.14 ms", highlight: true },
        { label: "TRACE overhead", value: 2.15, display: "2.15 ms", highlight: true },
        { label: "Total loop", value: 120.46, display: "120.46 ms" },
      ]),
      simpleMetric("diffP95", "Diffusion p95", "ms", [
        { label: "Base forward", value: 142.0, display: "142.00 ms" },
        { label: "Signature", value: 0.69, display: "0.69 ms", highlight: true },
        { label: "Slot update", value: 1.26, display: "1.26 ms", highlight: true },
        { label: "Readout", value: 0.74, display: "0.74 ms", highlight: true },
        { label: "Adapter", value: 0.21, display: "0.21 ms", highlight: true },
        { label: "TRACE overhead", value: 2.72, display: "2.72 ms", highlight: true },
        { label: "Total loop", value: 144.87, display: "144.87 ms" },
      ]),
      simpleMetric("overhead", "Overhead", "%", [
        { label: "Regression adapter", value: 35.8, display: "35.8%" },
        { label: "Diffusion adapter", value: 1.8, display: "1.8%" },
      ]),
    ],
    note: "Diffusion base forward is the 100-step diffusion denoising call.",
  },
  {
    id: "leave-one-task-out",
    label: "Leave-One-Out",
    source: "Appendix / Table 16",
    title: "Leave-one-task-out averages",
    description:
      "Task-balanced averages recomputed after dropping each task from the main comparison.",
    metrics: [
      simpleMetric("all", "All tasks", "%", [
        { label: "Diffusion Policy", value: 25.0, display: "25.00%" },
        { label: "ACT", value: 25.5, display: "25.50%" },
        { label: "pi0.5", value: 50.47, display: "50.47%" },
        { label: "GR00T N1.6", value: 30.6, display: "30.60%" },
        { label: "SmolVLA", value: 28.33, display: "28.33%" },
        { label: "X-VLA", value: 33.9, display: "33.90%" },
        { label: "Ours (Regression)", value: 69.23, display: "69.23%", highlight: true },
        { label: "Ours (Diffusion)", value: 59.53, display: "59.53%", highlight: true },
      ]),
      simpleMetric("dropTool", "Drop Tool", "%", [
        { label: "Diffusion Policy", value: 26.75, display: "26.75%" },
        { label: "ACT", value: 24.12, display: "24.12%" },
        { label: "pi0.5", value: 51.71, display: "51.71%" },
        { label: "GR00T N1.6", value: 28.5, display: "28.50%" },
        { label: "SmolVLA", value: 29.17, display: "29.17%" },
        { label: "X-VLA", value: 41.0, display: "41.00%" },
        { label: "Ours (Regression)", value: 72.92, display: "72.92%", highlight: true },
        { label: "Ours (Diffusion)", value: 59.79, display: "59.79%", highlight: true },
      ]),
      simpleMetric("dropBook", "Drop Book", "%", [
        { label: "Diffusion Policy", value: 28.17, display: "28.17%" },
        { label: "ACT", value: 28.46, display: "28.46%" },
        { label: "pi0.5", value: 50.33, display: "50.33%" },
        { label: "GR00T N1.6", value: 35.08, display: "35.08%" },
        { label: "SmolVLA", value: 30.42, display: "30.42%" },
        { label: "X-VLA", value: 30.62, display: "30.62%" },
        { label: "Ours (Regression)", value: 65.79, display: "65.79%", highlight: true },
        { label: "Ours (Diffusion)", value: 57.33, display: "57.33%", highlight: true },
      ]),
      simpleMetric("dropLaundry", "Drop Laundry", "%", [
        { label: "Diffusion Policy", value: 25.75, display: "25.75%" },
        { label: "ACT", value: 29.0, display: "29.00%" },
        { label: "pi0.5", value: 51.21, display: "51.21%" },
        { label: "GR00T N1.6", value: 32.25, display: "32.25%" },
        { label: "SmolVLA", value: 32.42, display: "32.42%" },
        { label: "X-VLA", value: 32.12, display: "32.12%" },
        { label: "Ours (Regression)", value: 66.29, display: "66.29%", highlight: true },
        { label: "Ours (Diffusion)", value: 56.79, display: "56.79%", highlight: true },
      ]),
      simpleMetric("dropCable", "Drop Cable", "%", [
        { label: "Diffusion Policy", value: 22.75, display: "22.75%" },
        { label: "ACT", value: 20.88, display: "20.88%" },
        { label: "pi0.5", value: 50.83, display: "50.83%" },
        { label: "GR00T N1.6", value: 28.75, display: "28.75%" },
        { label: "SmolVLA", value: 22.92, display: "22.92%" },
        { label: "X-VLA", value: 33.38, display: "33.38%" },
        { label: "Ours (Regression)", value: 73.79, display: "73.79%", highlight: true },
        { label: "Ours (Diffusion)", value: 61.66, display: "61.66%", highlight: true },
      ]),
      simpleMetric("dropMedicine", "Drop Medicine", "%", [
        { label: "Diffusion Policy", value: 21.58, display: "21.58%" },
        { label: "ACT", value: 25.04, display: "25.04%" },
        { label: "pi0.5", value: 48.25, display: "48.25%" },
        { label: "GR00T N1.6", value: 28.42, display: "28.42%" },
        { label: "SmolVLA", value: 26.75, display: "26.75%" },
        { label: "X-VLA", value: 32.38, display: "32.38%" },
        { label: "Ours (Regression)", value: 67.38, display: "67.38%", highlight: true },
        { label: "Ours (Diffusion)", value: 62.08, display: "62.08%", highlight: true },
      ]),
    ],
    note: "Drop-Tool robustness checks that the aggregate gain is not carried by the high-variance Tool task.",
  },
  {
    id: "tool-uncertainty",
    label: "Tool Uncertainty",
    source: "Appendix / Table 17",
    title: "Tool-task uncertainty and drop-Tool robustness",
    description:
      "Tool mean/SE, Tool 95% interval, drop-Tool average interval, and drop-Tool gap versus pi0.5 for TRACE variants.",
    metrics: [
      simpleMetric("toolMean", "Tool mean", "%", [
        { label: "Ours (Regression)", value: 54.5, display: "54.50 +/- 17.96%", highlight: true },
        { label: "Ours (Diffusion)", value: 58.5, display: "58.50 +/- 10.17%", highlight: true },
      ]),
      simpleMetric("toolSe", "Tool SE", "pp", [
        { label: "Ours (Regression)", value: 17.96, display: "17.96 pp", highlight: true },
        { label: "Ours (Diffusion)", value: 10.17, display: "10.17 pp", highlight: true },
      ]),
      simpleMetric("toolLow", "Tool 95% low", "%", [
        { label: "Ours (Regression)", value: 19.3, display: "19.30%" },
        { label: "Ours (Diffusion)", value: 38.57, display: "38.57%" },
      ]),
      simpleMetric("toolHigh", "Tool 95% high", "%", [
        { label: "Ours (Regression)", value: 89.7, display: "89.70%" },
        { label: "Ours (Diffusion)", value: 78.43, display: "78.43%" },
      ]),
      simpleMetric("dropAvg", "Drop-Tool avg.", "%", [
        { label: "Ours (Regression)", value: 72.92, display: "72.92 [71.28, 74.55]%", highlight: true },
        { label: "Ours (Diffusion)", value: 59.79, display: "59.79 [57.10, 62.48]%", highlight: true },
      ]),
      simpleMetric("gap", "Gap vs pi0.5", "pp", [
        { label: "Ours (Regression)", value: 21.21, display: "+21.21 [17.27, 25.15] pp", highlight: true },
        { label: "Ours (Diffusion)", value: 8.08, display: "+8.08 [3.60, 12.56] pp", highlight: true },
      ]),
    ],
    note: "Intervals are computed from the reported task SEs in the appendix table.",
  },
].filter((group) => effectDataGroupIds.has(group.id));

const resultVideos = {
  bookDesk: {
    kicker: "Book / desk origin",
    title: "Origin-conditioned relocation.",
    copy:
      "The book starts on the desk route, then moves through a shared carry segment before the policy must select the origin-consistent placement.",
    video: "assets/video/book_desk_web.mp4",
    poster: "assets/frames/book_desk/book_desk_37pct_t33p713s_960w.jpg",
    score: "83.00% Book progress",
  },
  bookBed: {
    kicker: "Book / bed origin",
    title: "A paired start reaches a similar later view.",
    copy:
      "The same object category and similar transit view require a different placement because the origin cue came from the bed-side start.",
    video: "assets/video/book_bed_web.mp4",
    poster: "assets/frames/book_bed/book_bed_37pct_t30p932s_960w.jpg",
    score: "83.00% Book progress",
  },
  laundry: {
    kicker: "Laundry / clean side",
    title: "Source side selects the later routine.",
    copy:
      "After a shared pickup and staging segment, the garment branch depends on whether the early source was the clean side or the wash side.",
    video: "assets/video/laundry_clean_web.mp4",
    poster: "assets/frames/laundry_clean/laundry_clean_37pct_t39p400s_960w.jpg",
    score: "81.00% Laundry progress",
  },
  cable: {
    kicker: "Cable / matched device",
    title: "The cable head must be routed to the source-consistent device.",
    copy:
      "The visible cable geometry becomes locally similar during traversal, so the target device choice benefits from the earlier source-side evidence.",
    video: "assets/video/cable_web.mp4",
    poster: "assets/frames/cable/cable_37pct_t24p451s_960w.jpg",
    score: "51.00% Cable progress",
  },
  medicineRight: {
    kicker: "Medicine / right tray",
    title: "The paired branch selects box and return.",
    copy:
      "The simulated medicine enters a shared bedside area, then the rollout must keep the earlier branch choice available for later box and return decisions.",
    video: "assets/video/medicine_right_web.mp4",
    poster: "assets/frames/medicine_right/medicine_right_37pct_t31p101s_960w.jpg",
    score: "76.67% Medicine progress",
  },
  medicineLeft: {
    kicker: "Medicine / left tray",
    title: "The alternate branch keeps the same task structure.",
    copy:
      "This paired clip shows the alternate start, where the later box and return path should follow the earlier branch rather than the current view alone.",
    video: "assets/video/medicine_left_web.mp4",
    poster: "assets/frames/medicine_left/medicine_left_37pct_t27p853s_960w.jpg",
    score: "76.67% Medicine progress",
  },
};

const rolloutPoints = {
  cue: {
    kicker: "Early cue",
    title: "TRACE writes the origin evidence while it is visible.",
    copy:
      "The initial book origin is visible at the start, so the memory update can store the cue before the later views become similar.",
    accent: "126, 87, 233",
    spotlightX: "4.9%",
    spotlightY: "30.5%",
    cardX: "10.5%",
    cardY: "9%",
  },
  transit: {
    kicker: "Ambiguous transit",
    title: "The current views converge, but the histories are not equivalent.",
    copy:
      "After pickup and transit, the overhead observations look similar across origins. The branch cue has left the short visual window.",
    accent: "146, 154, 151",
    spotlightX: "31.7%",
    spotlightY: "44%",
    cardX: "27%",
    cardY: "10%",
  },
  target: {
    kicker: "Target selection",
    title: "The branch action depends on the stored route evidence.",
    copy:
      "Near placement, the rollout must select the origin-consistent target rather than the locally plausible target visible in the frame.",
    accent: "255, 69, 72",
    spotlightX: "63.6%",
    spotlightY: "44%",
    cardX: "35%",
    cardY: "12%",
  },
  memory: {
    kicker: "Memory signals",
    title: "Slot 1 evidence is retained and read out near the branch.",
    copy:
      "The right panels show signed routing and selectivity: positive weights support the selected slot, while opposite-sign evidence suppresses alternatives.",
    accent: "37, 157, 115",
    spotlightX: "86.1%",
    spotlightY: "66%",
    cardX: "56%",
    cardY: "12%",
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

function formatAxisValue(value, unit) {
  const absValue = Math.abs(value);
  const maximumFractionDigits = absValue >= 100 ? 0 : absValue >= 10 ? 1 : 2;
  const formatted = value.toLocaleString("en-US", {
    maximumFractionDigits,
  });
  return unit ? `${formatted} ${unit}` : formatted;
}

function formatCompactValue(value, unit) {
  const absValue = Math.abs(value);
  const maximumFractionDigits = absValue >= 100 ? 0 : absValue >= 10 ? 1 : 2;
  const formatted = value.toLocaleString("en-US", {
    maximumFractionDigits,
  });
  return unit ? `${formatted}${unit.length <= 2 ? unit : ` ${unit}`}` : formatted;
}

function createBarRow(item, maxValue, unit) {
  const row = document.createElement("div");
  row.className = `bar-row${item.highlight ? " highlight" : ""}`;
  row.tabIndex = 0;

  const value = Number(item.value) || 0;
  const width = maxValue > 0 ? (Math.abs(value) / maxValue) * 100 : 0;

  const name = document.createElement("span");
  name.textContent = item.label;

  const track = document.createElement("span");
  track.className = "bar-track";

  const fill = document.createElement("span");
  fill.className = "bar-fill";
  fill.style.setProperty("--value", `${Math.max(0, Math.min(100, width))}%`);
  track.appendChild(fill);

  const amount = document.createElement("strong");
  amount.textContent = item.shortDisplay ?? formatCompactValue(value, unit);

  const popover = document.createElement("span");
  popover.className = "bar-popover";
  const display = item.display ?? formatAxisValue(value, unit);
  popover.textContent = `${item.label}: ${display}${item.detail ? ` | ${item.detail}` : ""}`;

  row.append(name, track, amount, popover);
  return row;
}

function renderChart(viewName) {
  const view = resultViews[viewName];
  document.getElementById("chartTitle").textContent = view.title;
  document.getElementById("chartUnit").textContent = view.unit ?? "%";
  document.getElementById("resultKicker").textContent = view.kicker;
  document.getElementById("resultTitle").textContent = view.resultTitle;
  document.getElementById("resultText").textContent = view.resultText;
  document.getElementById("resultStatA").textContent = view.statA;
  document.getElementById("resultStatB").textContent = view.statB;

  const chart = document.getElementById("barChart");
  chart.innerHTML = "";
  const maxValue = Math.max(...view.values.map(([, value]) => Math.abs(value)), 1);

  view.values.forEach(([label, value, highlight]) => {
    chart.appendChild(
      createBarRow(
        {
          label,
          value,
          shortDisplay: value.toFixed(value % 1 === 0 ? 0 : 2),
          display: `${value.toFixed(value % 1 === 0 ? 0 : 2)}%`,
          detail: view.title,
          highlight,
        },
        maxValue,
        "%"
      )
    );
  });
}

const activeMetricByGroup = {};

function renderPaperDataMetric(group, metricKey) {
  const metric = group.metrics.find((candidate) => candidate.key === metricKey) ?? group.metrics[0];
  activeMetricByGroup[group.id] = metric.key;

  document.getElementById("dataStatValue").textContent = metric.label;
  document.getElementById("dataNote").textContent = metric.note || group.note || "";

  document.querySelectorAll("#dataMetricTabs button").forEach((button) => {
    const isActive = button.dataset.metric === metric.key;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  const chart = document.getElementById("dataChart");
  const axis = document.getElementById("dataChartAxis");
  chart.innerHTML = "";
  axis.innerHTML = "";

  const values = metric.values.filter((item) => Number.isFinite(Number(item.value)));
  const maxValue = metric.max ?? Math.max(...values.map((item) => Math.abs(Number(item.value))), 1);

  const axisStart = document.createElement("span");
  axisStart.textContent = "0";
  const axisEnd = document.createElement("span");
  axisEnd.textContent = formatAxisValue(maxValue, metric.unit);
  axis.append(axisStart, axisEnd);

  values.forEach((item) => {
    chart.appendChild(createBarRow(item, maxValue, metric.unit));
  });
}

function renderPaperDataGroup(groupId) {
  const group = paperDataGroups.find((candidate) => candidate.id === groupId) ?? paperDataGroups[0];
  const metricKey = activeMetricByGroup[group.id] ?? group.metrics[0]?.key;

  document.querySelectorAll("#dataGroupList button").forEach((button) => {
    const isActive = button.dataset.group === group.id;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  const panel = document.getElementById("dataPanel");
  const activeGroupButton = document.querySelector(`#dataGroupList button[data-group="${group.id}"]`);
  if (panel && activeGroupButton?.id) {
    panel.setAttribute("aria-labelledby", activeGroupButton.id);
  }

  document.getElementById("dataSource").textContent = group.source;
  document.getElementById("dataTitle").textContent = group.title;
  document.getElementById("dataDescription").textContent = group.description;

  const metricTabs = document.getElementById("dataMetricTabs");
  metricTabs.innerHTML = "";

  group.metrics.forEach((metric, index) => {
    const button = document.createElement("button");
    button.id = `dataMetric-${group.id}-${metric.key}`;
    button.type = "button";
    button.setAttribute("role", "tab");
    button.dataset.metric = metric.key;
    button.textContent = metric.label;
    button.setAttribute("aria-controls", "dataChart");
    button.addEventListener("click", () => renderPaperDataMetric(group, metric.key));
    button.addEventListener("keydown", (event) => {
      const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
      if (!keys.includes(event.key)) return;

      event.preventDefault();
      const buttons = [...metricTabs.querySelectorAll("button")];
      const currentIndex = buttons.indexOf(button);
      const lastIndex = buttons.length - 1;
      let nextIndex = (currentIndex + 1) % buttons.length;
      if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = lastIndex;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (currentIndex + lastIndex) % buttons.length;
      }
      buttons[nextIndex].focus();
      renderPaperDataMetric(group, buttons[nextIndex].dataset.metric);
    });
    if (index === 0) {
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");
    } else {
      button.setAttribute("aria-selected", "false");
      button.tabIndex = -1;
    }
    metricTabs.appendChild(button);
  });

  renderPaperDataMetric(group, metricKey);
}

function initPaperDataExplorer() {
  const list = document.getElementById("dataGroupList");
  if (!list) return;

  paperDataGroups.forEach((group, index) => {
    const button = document.createElement("button");
    button.id = `dataGroup-${group.id}`;
    button.type = "button";
    button.setAttribute("role", "tab");
    button.dataset.group = group.id;
    button.setAttribute("aria-controls", "dataPanel");
    button.innerHTML = `<span>${group.source}</span><strong>${group.label}</strong>`;
    button.addEventListener("click", () => renderPaperDataGroup(group.id));
    button.addEventListener("keydown", (event) => {
      const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
      if (!keys.includes(event.key)) return;

      event.preventDefault();
      const buttons = [...list.querySelectorAll("button")];
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
      buttons[nextIndex].focus();
      renderPaperDataGroup(buttons[nextIndex].dataset.group);
    });
    if (index === 0) {
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");
    } else {
      button.setAttribute("aria-selected", "false");
      button.tabIndex = -1;
    }
    list.appendChild(button);
  });

  renderPaperDataGroup(paperDataGroups[0].id);
}

function updateResultVideo(videoName) {
  const clip = resultVideos[videoName] ?? resultVideos.bookDesk;
  const video = document.getElementById("resultFeatureVideo");
  if (!video) return;

  if (video.getAttribute("src") !== clip.video) {
    video.poster = clip.poster;
    video.src = clip.video;
    video.load();
  }
  video.play().catch(() => {});

  document.getElementById("resultFeatureKicker").textContent = clip.kicker;
  document.getElementById("resultFeatureTitle").textContent = clip.title;
  document.getElementById("resultFeatureCopy").textContent = clip.copy;
  document.getElementById("resultFeatureScore").textContent = clip.score;

  document.querySelectorAll(".result-video-card").forEach((button) => {
    const isActive = button.dataset.resultVideo === videoName;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function initResultVideoGallery() {
  const buttons = [...document.querySelectorAll(".result-video-card")];
  if (buttons.length === 0) return;

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => updateResultVideo(button.dataset.resultVideo));
    button.addEventListener("keydown", (event) => {
      const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
      if (!keys.includes(event.key)) return;

      event.preventDefault();
      let nextIndex = (index + 1) % buttons.length;
      if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = buttons.length - 1;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index + buttons.length - 1) % buttons.length;
      }

      buttons[nextIndex].focus();
      updateResultVideo(buttons[nextIndex].dataset.resultVideo);
    });
  });

  updateResultVideo("bookDesk");
}

function updateRolloutPoint(pointName) {
  const point = rolloutPoints[pointName] ?? rolloutPoints.cue;
  const stage = document.getElementById("rolloutStage");
  if (!stage) return;

  stage.classList.add("is-inspecting");
  stage.style.setProperty("--rollout-accent", point.accent);
  stage.style.setProperty("--spotlight-x", point.spotlightX);
  stage.style.setProperty("--spotlight-y", point.spotlightY);
  stage.style.setProperty("--card-x", point.cardX);
  stage.style.setProperty("--card-y", point.cardY);

  document.getElementById("rolloutFloatingKicker").textContent = point.kicker;
  document.getElementById("rolloutFloatingTitle").textContent = point.title;
  document.getElementById("rolloutDetailTitle").textContent = point.title;
  document.getElementById("rolloutDetailCopy").textContent = point.copy;

  document.querySelectorAll(".rollout-hotspot").forEach((button) => {
    const isActive = button.dataset.rollout === pointName;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.querySelectorAll(".rollout-highlight").forEach((highlight) => {
    highlight.classList.toggle("active", highlight.dataset.rolloutHighlight === pointName);
  });

  document.querySelectorAll(".rollout-trail").forEach((path) => {
    path.classList.toggle("active", path.dataset.rolloutTrail === pointName);
  });
}

function initRolloutFigure() {
  const stage = document.getElementById("rolloutStage");
  const buttons = [...document.querySelectorAll(".rollout-hotspot")];
  if (!stage || buttons.length === 0) return;

  buttons.forEach((button, index) => {
    const activate = () => updateRolloutPoint(button.dataset.rollout);
    button.addEventListener("mouseenter", activate);
    button.addEventListener("focus", activate);
    button.addEventListener("click", activate);
    button.addEventListener("keydown", (event) => {
      const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
      if (!keys.includes(event.key)) return;

      event.preventDefault();
      let nextIndex = (index + 1) % buttons.length;
      if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = buttons.length - 1;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index + buttons.length - 1) % buttons.length;
      }

      buttons[nextIndex].focus();
      updateRolloutPoint(buttons[nextIndex].dataset.rollout);
    });
  });

  stage.addEventListener("mouseleave", () => {
    stage.classList.remove("is-inspecting");
  });
  stage.addEventListener("focusout", (event) => {
    if (!stage.contains(event.relatedTarget)) {
      stage.classList.remove("is-inspecting");
    }
  });

  updateRolloutPoint("cue");
  stage.classList.remove("is-inspecting");
}

function updateScrollMeter() {
  const meter = document.getElementById("scrollMeter");
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  meter.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;
}

function initMoreWorksDropdown() {
  const root = document.querySelector("[data-more-works]");
  if (!root) return;

  const toggle = root.querySelector(".more-works-toggle");
  const menu = root.querySelector(".more-works-menu");
  if (!toggle || !menu) return;

  const closeMenu = () => {
    root.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    menu.inert = true;
  };

  const openMenu = () => {
    root.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
    menu.inert = false;
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    if (root.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  root.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !root.classList.contains("is-open")) return;
    closeMenu();
    toggle.focus();
  });
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
initPaperDataExplorer();
initResultVideoGallery();
initRolloutFigure();
initMoreWorksDropdown();
updateScrollMeter();
