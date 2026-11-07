import { useEffect, useRef } from 'react'

/**
 * Builds the portrait out of particles: the image is sampled on a grid, every sample becomes a
 * particle that starts scattered in a swirling cloud and flies home in a staggered, eased sweep
 * (head first, bottom last). Rendered into one ImageData buffer per frame (no per-particle draw
 * calls), so ~15k particles stay smooth. When the figure has formed it calls onDone and fades out,
 * letting the real <img> take over.
 */
const DURATION = 2300 // ms until every particle has landed

export default function ParticlePortrait({ src, play, onDone }) {
  const canvasRef = useRef(null)
  const doneRef = useRef(false)

  useEffect(() => {
    if (!play) return undefined
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const box = canvas.parentElement
    let raf = 0
    let cancelled = false

    const img = new Image()
    img.decoding = 'async'
    img.src = src
    img.onload = () => {
      if (cancelled) return
      const small = window.innerWidth < 768
      const dpr = Math.min(window.devicePixelRatio || 1, small ? 1 : 1.5)
      const W = Math.max(1, Math.round(box.clientWidth * dpr))
      const H = Math.max(1, Math.round(box.clientHeight * dpr))
      canvas.width = W
      canvas.height = H

      // draw the image the way <img object-fit:contain object-position:bottom> lays it out
      const off = document.createElement('canvas')
      off.width = W
      off.height = H
      const octx = off.getContext('2d', { willReadFrequently: true })
      const s = Math.min(W / img.naturalWidth, H / img.naturalHeight)
      const dw = img.naturalWidth * s
      const dh = img.naturalHeight * s
      octx.drawImage(img, (W - dw) / 2, H - dh, dw, dh)
      const src32 = octx.getImageData(0, 0, W, H).data

      // sample on a grid
      const step = Math.max(2, Math.round((small ? 5 : 4) * dpr))
      const size = Math.max(1, step - 1)
      const ps = []
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const i = (y * W + x) * 4
          const a = src32[i + 3]
          if (a < 90) continue
          ps.push(x, y, src32[i], src32[i + 1], src32[i + 2], a)
        }
      }
      const n = ps.length / 6
      // start positions: a wide swirling cloud around the figure's centre
      const cx = W / 2
      const cy = H * 0.42
      const sx = new Float32Array(n)
      const sy = new Float32Array(n)
      const delay = new Float32Array(n)
      const spin = new Float32Array(n)
      let seed = 7
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
      for (let k = 0; k < n; k++) {
        const ang = rnd() * Math.PI * 2
        const rad = (0.55 + rnd() * 0.9) * Math.max(W, H)
        sx[k] = cx + Math.cos(ang) * rad
        sy[k] = cy + Math.sin(ang) * rad * 0.7
        const ty = ps[k * 6 + 1]
        delay[k] = (ty / H) * 0.45 + rnd() * 0.18 // head lands first
        spin[k] = (rnd() - 0.5) * 2.4
      }

      const ctx = canvas.getContext('2d')
      const frame = ctx.createImageData(W, H)
      const buf = new Uint32Array(frame.data.buffer)
      const ease = (t) => 1 - Math.pow(1 - t, 4)
      const t0 = performance.now()

      const tick = (now) => {
        if (cancelled) return
        const T = Math.min(1, (now - t0) / DURATION)
        buf.fill(0)
        for (let k = 0; k < n; k++) {
          const local = Math.min(1, Math.max(0, (T - delay[k]) / (1 - 0.63)))
          const e = ease(local)
          const o = k * 6
          const tx = ps[o]
          const ty = ps[o + 1]
          // swirl: rotate the start offset around the target, unwinding as it lands
          const dx = sx[k] - tx
          const dy = sy[k] - ty
          const ang = spin[k] * (1 - e)
          const ca = Math.cos(ang)
          const sa = Math.sin(ang)
          const px = (tx + (dx * ca - dy * sa) * (1 - e)) | 0
          const py = (ty + (dx * sa + dy * ca) * (1 - e)) | 0
          if (px < 0 || py < 0 || px >= W - size || py >= H - size) continue
          const alpha = Math.min(255, ps[o + 5] * (0.25 + 0.75 * e)) | 0
          // landed particles keep their colour; in-flight ones run hot (signal orange)
          const heat = 1 - e
          const r = Math.min(255, ps[o + 2] + heat * 200) | 0
          const g = Math.min(255, ps[o + 3] + heat * 60) | 0
          const b = ps[o + 4] * (1 - heat * 0.6) | 0
          const c = (alpha << 24) | (b << 16) | (g << 8) | r // little-endian RGBA
          for (let yy = 0; yy < size; yy++) {
            const row = (py + yy) * W + px
            for (let xx = 0; xx < size; xx++) buf[row + xx] = c
          }
        }
        ctx.putImageData(frame, 0, 0)
        if (T < 1) raf = requestAnimationFrame(tick)
        else if (!doneRef.current) {
          doneRef.current = true
          onDone?.()
        }
      }
      raf = requestAnimationFrame(tick)
    }
    img.onerror = () => onDone?.()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [play, src, onDone])

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
}
