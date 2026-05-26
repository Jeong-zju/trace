# TRACE Paper Site

Static research page for:

**TRACE: Trajectory-Routed Causal Memory for Delayed-Evidence Visuomotor Imitation**

## Open

Open `index.html` directly in a browser, or run:

```bash
npm run dev
```

The local server is only a convenience wrapper around Python's static file server.

## Visual Asset Rule

Displayed raster figures are generated from figures explicitly referenced by
`CoRL_PRISM/corl_2026_prism/main.tex`:

- `figs/teaser.pdf`
- `figs/signal_diagram.pdf`
- `figs/tasks_overview.pdf`
- `figs/rollout_results_combined.pdf`
- `figs/train_inference_overview.pdf`

The page also uses rollout videos and extracted posters under `assets/video` and `assets/frames`.
Hero and method previews use lightweight `*_demo.mp4` clips. The experiment-video gallery uses
browser-compatible H.264 `*_web.mp4` derivatives of the full rollouts copied from
`CoRL_PRISM/corl_2026_prism/videos`; the original 4K HEVC files are kept only as source media.
