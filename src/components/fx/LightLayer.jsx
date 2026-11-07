/**
 * Glossy light over the data field: slow rotating rays from above, a sheen that
 * sweeps the page every ~14s, and an ember glow at the bottom edge.
 * Pure CSS (GPU-composited transforms only); reduced motion freezes it via index.css.
 */
export default function LightLayer() {
  return (
    <div className="fx-light" aria-hidden="true">
      <div className="fx-light-rays" />
      <div className="fx-light-sheen" />
      <div className="fx-light-ember" />
    </div>
  )
}
