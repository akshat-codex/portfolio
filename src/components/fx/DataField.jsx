import { useEffect, useRef } from 'react'

/**
 * DataField: the Ikeda-style "datamatics" background.
 *
 * One fixed full-screen <canvas> behind all content (z-index 0, pointer-events none,
 * aria-hidden). Content must sit above it with `position: relative; z-index: 1`.
 *
 * Layers (drawn in paper at low opacity on a transparent canvas, so the ink body shows through):
 *  - bands of dense vertical barcode columns (pre-rendered to offscreen tiles, scrolled sideways)
 *  - travelling sine lattices (thin paper lines) that bend toward the cursor on fine pointers
 *  - sparse numeric tick rows (digits encoded as tiny bars of varying height)
 *  - rare signal-orange samples (a highlighted column + point)
 *  - occasional scan sweeps that briefly brighten the columns they cross
 *  - section entry: one band briefly inverts (<=180ms, low opacity, rate-limited to < 3/s)
 *
 * Reactivity: window 'fx:velocity' CustomEvents {detail:{velocity}} (falls back to scrollY deltas)
 * speed up column scroll and sine phase. Reduced motion: one static frame, no loop.
 */

const PAPER = '#f2f1ec'
const SIGNAL = '#ff4d00'
const SEED = 0x768bd033

const DPR_CAP = 1.5
const SMALL_BP = 768
const FRAME_MS_SMALL = 1000 / 30
const FLASH_MS = 170
const FLASH_GAP_MS = 400 // => at most 2.5 flashes per second
const MAX_TICK_DIGITS = 96

function mulberry32(seed) {
  let a = seed >>> 0
  return function rand() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const BAR_WIDTHS = [0.5, 0.75, 1, 1, 1, 1.5, 1.5, 2, 3, 5, 8]

function buildTile(rand, pw, h, dpr, density) {
  const c = document.createElement('canvas')
  c.width = Math.max(1, Math.round(pw * dpr))
  c.height = Math.max(1, Math.round(h * dpr))
  const g = c.getContext('2d')
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.fillStyle = PAPER
  let x = rand() * 4
  while (x < pw - 1) {
    const w = BAR_WIDTHS[(rand() * BAR_WIDTHS.length) | 0]
    const kind = rand()
    g.globalAlpha = 0.3 + rand() * 0.7
    if (kind < 0.62) {
      g.fillRect(x, 0, w, h) // full column
    } else if (kind < 0.84) {
      const hh = h * (0.2 + rand() * 0.6) // partial column, anchored top or bottom
      g.fillRect(x, rand() < 0.5 ? 0 : h - hh, w, hh)
    } else {
      let y = 0 // segmented column
      while (y < h) {
        const seg = 2 + rand() * h * 0.18
        g.fillRect(x, y, w, Math.min(seg, h - y))
        y += seg + 2 + rand() * 10
      }
    }
    // gap: dense clusters with occasional wide breaks
    const r = rand()
    x += w + (r < 0.8 ? 0.75 + rand() * 3 : 6 + rand() * 30) / density
  }
  g.globalAlpha = 1
  return c
}

function generate(W, H, dpr, small) {
  const rand = mulberry32(SEED ^ (small ? 0x51 : 0x17))
  const density = small ? 0.75 : 1
  const pw = small ? 720 : 1280

  // Bands of barcode columns spread down the viewport.
  const bandCount = small ? 3 : 5
  const bands = []
  const slot = H / bandCount
  for (let i = 0; i < bandCount; i++) {
    const h = Math.round((small ? 28 : 36) + rand() * (small ? 70 : 130))
    const y = Math.round(i * slot + rand() * Math.max(0, slot - h))
    bands.push({
      y,
      h,
      pw,
      tile: buildTile(rand, pw, h, dpr, density),
      alpha: 0.045 + rand() * 0.04,
      speed: (10 + rand() * 26) * (i % 2 === 0 ? 1 : -1),
      offset: rand() * pw,
    })
  }

  // Travelling sine lattices.
  const latticeCount = small ? 2 : 3
  const lattices = []
  for (let i = 0; i < latticeCount; i++) {
    lattices.push({
      y: H * (0.18 + (i / latticeCount) * 0.7 + rand() * 0.1),
      amp: 10 + rand() * (small ? 24 : 46),
      freq: (Math.PI * 2) / (260 + rand() * 520),
      speed: 0.25 + rand() * 0.5,
      lines: small ? 4 : 5 + ((rand() * 3) | 0),
      gap: 5 + rand() * 7,
      skew: 0.18 + rand() * 0.4,
      phase: rand() * Math.PI * 2,
      alpha: 0.07 + rand() * 0.05,
    })
  }

  // Sparse numeric tick rows: digits rendered as tiny bars.
  const tickCount = small ? 2 : 4
  const ticks = []
  for (let i = 0; i < tickCount; i++) {
    const digits = new Uint8Array(MAX_TICK_DIGITS)
    for (let d = 0; d < MAX_TICK_DIGITS; d++) digits[d] = (rand() * 10) | 0
    ticks.push({
      y: Math.round(H * (0.08 + rand() * 0.84)),
      x0: rand() * W * 0.5,
      len: (small ? 24 : 40) + ((rand() * (small ? 16 : 56)) | 0),
      speed: (6 + rand() * 12) * (rand() < 0.5 ? -1 : 1),
      offset: 0,
      digits,
    })
  }

  return { bands, lattices, ticks, pw, rand: mulberry32(SEED ^ 0x9e37), stepX: small ? 12 : 8 }
}

export default function DataField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqCoarse = window.matchMedia('(pointer: coarse)')
    let reduced = mqReduce.matches
    let coarse = mqCoarse.matches

    let W = 0
    let H = 0
    let dpr = 1
    let small = false
    let field = null

    // Mutable runtime state (no allocations in the loop).
    let raf = 0
    let running = false
    let last = 0
    let lastDrawn = 0
    let time = 0

    let velTarget = 0
    let vel = 0
    let lastVelEvent = -1e9
    let lastScrollY = window.scrollY

    let px = -9999
    let py = -9999
    let pActive = false
    let pInfluence = 0

    let scanX = -1
    let scanNext = 3500
    let scanStart = 0
    let sampleBand = -1
    let sampleX = 0
    let sampleStart = 0
    let sampleNext = 2200
    let tickNext = 0
    let flashBand = -1
    let flashStart = -1e9
    let lastFlash = -1e9

    function resize() {
      const nW = window.innerWidth
      const nH = window.innerHeight
      const nDpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      // Ignore small height-only jitter (mobile URL bar) to avoid regenerating constantly.
      const regen = !field || nW !== W || Math.abs(nH - H) > 140 || nDpr !== dpr
      W = nW
      H = nH
      dpr = nDpr
      small = W < SMALL_BP
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      if (regen) field = generate(W, H, dpr, small)
      if (reduced || !running) drawFrame(0)
    }

    function drawBand(b, alpha) {
      const pw = b.pw
      const ox = ((b.offset % pw) + pw) % pw
      ctx.globalAlpha = alpha
      for (let x = -ox; x < W; x += pw) ctx.drawImage(b.tile, x, b.y, pw, b.h)
    }

    function drawFrame(dt) {
      const f = field
      if (!f) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, W, H)

      const speedMul = 1 + Math.min(Math.abs(vel), 90) * 0.11
      const dir = vel < -0.5 ? -1 : 1

      // 1. Barcode bands.
      const bands = f.bands
      for (let i = 0; i < bands.length; i++) {
        const b = bands[i]
        b.offset += b.speed * dir * speedMul * dt
        drawBand(b, b.alpha)
      }

      // 2. Cursor: brighten a vertical strip of the band(s) under the pointer.
      if (pInfluence > 0.01) {
        const sw = small ? 70 : 120
        ctx.save()
        ctx.beginPath()
        ctx.rect(px - sw * 0.5, 0, sw, H)
        ctx.clip()
        for (let i = 0; i < bands.length; i++) {
          const b = bands[i]
          const cy = b.y + b.h * 0.5
          const d = Math.abs(py - cy) / (H * 0.35)
          const k = (1 - Math.min(d, 1)) * pInfluence
          if (k > 0.02) drawBand(b, b.alpha * 1.6 * k)
        }
        ctx.restore()
      }

      // 3. Scan sweep: a hairline crossing the screen, brightening what it passes.
      if (scanX > -200) {
        const tw = small ? 60 : 110
        ctx.save()
        ctx.beginPath()
        ctx.rect(scanX - tw, 0, tw, H)
        ctx.clip()
        for (let i = 0; i < bands.length; i++) drawBand(bands[i], bands[i].alpha * 1.4)
        ctx.restore()
        ctx.globalAlpha = 0.16
        ctx.fillStyle = PAPER
        ctx.fillRect(scanX, 0, 1, H)
      }

      // 4. Sine lattices (one path per lattice).
      ctx.strokeStyle = PAPER
      ctx.lineWidth = 1
      const lattices = f.lattices
      const stepX = f.stepX
      const sigma2 = (small ? 90 : 160) * (small ? 90 : 160)
      const bendOn = pInfluence > 0.01
      for (let i = 0; i < lattices.length; i++) {
        const L = lattices[i]
        L.phase += dt * L.speed * (1 + Math.min(Math.abs(vel), 90) * 0.06) * dir
        ctx.globalAlpha = L.alpha
        ctx.beginPath()
        for (let j = 0; j < L.lines; j++) {
          const base = L.y + j * L.gap
          const ph = L.phase + j * L.skew
          for (let x = 0; x <= W + stepX; x += stepX) {
            let y = base + Math.sin(x * L.freq + ph) * L.amp
            if (bendOn) {
              const dx = x - px
              const dy = py - y
              const r2 = dx * dx + dy * dy
              if (r2 < sigma2 * 4) y += dy * 0.32 * pInfluence * Math.exp(-r2 / sigma2)
            }
            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      // 5. Numeric tick rows: each digit as a 1px bar whose height encodes its value.
      ctx.fillStyle = PAPER
      ctx.globalAlpha = 0.16
      const ticks = f.ticks
      for (let i = 0; i < ticks.length; i++) {
        const T = ticks[i]
        T.offset += T.speed * speedMul * dt
        const span = T.len * 4 + Math.floor(T.len / 8) * 8
        let x = T.x0 + (((T.offset % (W + span)) + (W + span)) % (W + span)) - span
        for (let d = 0; d < T.len; d++) {
          const v = T.digits[d]
          ctx.fillRect(x, T.y - 1 - v * 0.7, 1, 1 + v * 0.7)
          x += d % 8 === 7 ? 12 : 4
        }
      }

      // 6. Signal sample: one orange column + point, rare and brief.
      if (sampleBand >= 0) {
        const age = (time - sampleStart) / 900
        if (age < 1) {
          const b = bands[sampleBand]
          const a = age < 0.15 ? age / 0.15 : 1 - (age - 0.15) / 0.85
          ctx.fillStyle = SIGNAL
          ctx.globalAlpha = 0.5 * a
          ctx.fillRect(sampleX, b.y, 1.5, b.h)
          ctx.globalAlpha = 0.85 * a
          ctx.fillRect(sampleX - 1.5, b.y - 6, 4, 4)
        } else sampleBand = -1
      }

      // 7. Section-entry flash: invert ONE band briefly at low opacity.
      if (flashBand >= 0) {
        const p = (time - flashStart) / FLASH_MS
        if (p < 1) {
          const b = bands[flashBand]
          const a = 0.1 * (1 - p) * (1 - p)
          ctx.globalAlpha = a
          ctx.fillStyle = PAPER
          ctx.fillRect(0, b.y, W, b.h)
          ctx.globalCompositeOperation = 'destination-out'
          drawBand(b, 1)
          ctx.globalCompositeOperation = 'source-over'
        } else flashBand = -1
      }

      ctx.globalAlpha = 1
    }

    function updateEvents() {
      const f = field
      const rand = f.rand
      // Scan sweeps every ~7-12s, ~1.4s to cross.
      if (scanX <= -200 && time > scanNext) {
        scanStart = time
        scanX = -100
      }
      if (scanX > -200) {
        const p = (time - scanStart) / 1400
        if (p >= 1) {
          scanX = -9999
          scanNext = time + 7000 + rand() * 5000
        } else {
          scanX = -100 + (W + 200) * p // linear: reads as a scanner, not a UI transition
        }
      }
      // Signal samples every ~2.5-5s.
      if (sampleBand < 0 && time > sampleNext) {
        sampleBand = (rand() * f.bands.length) | 0
        sampleX = Math.round(rand() * (W - 40)) + 20
        sampleStart = time
        sampleNext = time + 2500 + rand() * 2500
      }
      // Tick digits mutate a few at a time.
      if (time > tickNext) {
        tickNext = time + 110
        for (let i = 0; i < f.ticks.length; i++) {
          const T = f.ticks[i]
          T.digits[(rand() * T.len) | 0] = (rand() * 10) | 0
          T.digits[(rand() * T.len) | 0] = (rand() * 10) | 0
        }
      }
    }

    function loop(now) {
      raf = requestAnimationFrame(loop)
      if (!last) last = now
      if (small && now - lastDrawn < FRAME_MS_SMALL - 2) return
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      lastDrawn = now
      time += dt * 1000

      // Velocity: prefer Lenis events, fall back to scrollY deltas.
      if (now - lastVelEvent > 250) {
        const sy = window.scrollY
        velTarget = ((sy - lastScrollY) / Math.max(dt, 0.001)) / 60 // px per 60fps-frame
        lastScrollY = sy
      } else {
        lastScrollY = window.scrollY
      }
      vel += (velTarget - vel) * Math.min(1, dt * 6)
      if (Math.abs(vel) < 0.01) vel = 0

      const pTarget = pActive && !coarse ? 1 : 0
      pInfluence += (pTarget - pInfluence) * Math.min(1, dt * 4)

      updateEvents()
      drawFrame(dt)
    }

    function start() {
      if (running || reduced || document.hidden) return
      running = true
      last = 0
      lastDrawn = 0
      raf = requestAnimationFrame(loop)
    }

    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    // Listeners
    function onVelocity(e) {
      const v = e && e.detail ? Number(e.detail.velocity) : 0
      if (Number.isFinite(v)) {
        velTarget = v
        lastVelEvent = performance.now()
      }
    }
    function onPointerMove(e) {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      px = e.clientX
      py = e.clientY
      pActive = true
    }
    function onPointerOut(e) {
      if (!e.relatedTarget) pActive = false
    }
    function onVisibility() {
      if (document.hidden) stop()
      else start()
    }
    function onReduceChange() {
      reduced = mqReduce.matches
      if (reduced) {
        stop()
        drawFrame(0)
      } else start()
    }
    function onCoarseChange() {
      coarse = mqCoarse.matches
    }

    // Section entry -> invert the band nearest the viewport centre (rate limited).
    let io = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (reduced || !running) return
          for (let i = 0; i < entries.length; i++) {
            if (!entries[i].isIntersecting) continue
            const now = time
            if (now - lastFlash < FLASH_GAP_MS || !field) continue
            lastFlash = now
            flashStart = now
            let best = 0
            let bestD = Infinity
            const mid = H * 0.5
            for (let b = 0; b < field.bands.length; b++) {
              const d = Math.abs(field.bands[b].y + field.bands[b].h * 0.5 - mid)
              if (d < bestD) {
                bestD = d
                best = b
              }
            }
            flashBand = best
          }
        },
        { rootMargin: '-48% 0px -48% 0px', threshold: 0 }
      )
      document.querySelectorAll('section[id]').forEach((s) => io.observe(s))
    }

    let ro = null
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => resize())
      ro.observe(canvas) // canvas is fixed inset 0, so this tracks the viewport
    } else {
      window.addEventListener('resize', resize)
    }

    resize()
    window.addEventListener('fx:velocity', onVelocity)
    if (!coarse) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.addEventListener('pointerout', onPointerOut, { passive: true })
    }
    document.addEventListener('visibilitychange', onVisibility)
    mqReduce.addEventListener?.('change', onReduceChange)
    mqCoarse.addEventListener?.('change', onCoarseChange)

    if (reduced) drawFrame(0)
    else start()

    return () => {
      stop()
      if (io) io.disconnect()
      if (ro) ro.disconnect()
      else window.removeEventListener('resize', resize)
      window.removeEventListener('fx:velocity', onVelocity)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerout', onPointerOut)
      document.removeEventListener('visibilitychange', onVisibility)
      mqReduce.removeEventListener?.('change', onReduceChange)
      mqCoarse.removeEventListener?.('change', onCoarseChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="data-field"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
        backgroundColor: 'transparent',
      }}
    />
  )
}

export { DataField }
