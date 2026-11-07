import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useCalm, useReducedMotionPref, useFinePointer } from './prefs'
import { useIntroDone } from './introState'
import { LiquidName } from './lazy'

// Kept here (not in LiquidName) so checking support never downloads three.js.
function liquidSupported() {
  try {
    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')
    return !!ctx && 'fontStretch' in ctx && !!document.createElement('canvas').getContext('webgl')
  } catch {
    return false
  }
}

/**
 * <KineticName lines={['AKSHAT KUMAR','SRIVASTAVA']} className="display ..." />
 * After the intro, each letter resolves from scrambled data glyphs in a
 * left-to-right sweep (~900ms). On fine pointers letters lean a few px toward
 * the cursor. The real text is the h1's aria-label; the letter spans are aria-hidden.
 */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789|'
const SWEEP_MS = 600 // start of first → start of last letter
const SCRAMBLE_MS = 300 // each letter cycles this long before resolving
const SWAP_MS = 45
const LEAN_PX = 6
const LEAN_RADIUS = 420

const rand = () => GLYPHS[(Math.random() * GLYPHS.length) | 0]

export default function KineticName({ lines = [], className = '' }) {
  const reduce = useReducedMotionPref()
  const fine = useFinePointer()
  const calm = useCalm()
  const introDone = useIntroDone()
  const h1Ref = useRef(null)
  const letters = useRef([]) // span elements in reading order
  const ranRef = useRef(false)
  const [swept, setSwept] = useState(false)
  const [liquidReady, setLiquidReady] = useState(false)
  const [canLiquid] = useState(() => typeof window !== 'undefined' && liquidSupported())
  const liquid = canLiquid && fine && !calm && swept
  const getLetters = useCallback(() => letters.current.filter(Boolean), [])
  letters.current = []

  const label = lines.join(' ')

  // Scramble sweep, once, after the intro. Layout effect: no flash of the final text.
  useLayoutEffect(() => {
    if (reduce || !introDone || ranRef.current) return undefined
    ranRef.current = true
    const els = letters.current.filter(Boolean)
    const n = els.length
    if (!n) return undefined
    // Lock each cell to its real width so glyph swaps never reflow the line.
    const finals = els.map((el) => el.dataset.char)
    els.forEach((el) => {
      el.style.width = `${el.getBoundingClientRect().width}px`
      el.style.opacity = '0.3'
      el.textContent = rand()
    })
    const stagger = n > 1 ? SWEEP_MS / (n - 1) : 0
    const lastSwap = new Array(n).fill(0)
    const resolved = new Array(n).fill(false)
    let left = n
    let raf = 0
    const start = performance.now()
    const tick = (now) => {
      const t = now - start
      for (let i = 0; i < n; i += 1) {
        if (resolved[i]) continue
        const el = els[i]
        if (t >= i * stagger + SCRAMBLE_MS) {
          resolved[i] = true
          left -= 1
          el.textContent = finals[i]
          el.style.opacity = ''
          el.style.width = ''
        } else if (t - lastSwap[i] >= SWAP_MS) {
          lastSwap[i] = t
          el.textContent = rand()
          if (t >= i * stagger) el.style.opacity = '0.6'
        }
      }
      if (left > 0) raf = requestAnimationFrame(tick)
      else {
        raf = 0
        setSwept(true)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      if (raf) ranRef.current = false // interrupted (e.g. StrictMode remount): allow a rerun
      cancelAnimationFrame(raf)
      els.forEach((el, i) => {
        el.textContent = finals[i]
        el.style.opacity = ''
        el.style.width = ''
      })
    }
  }, [introDone, reduce])

  // No sweep this load (intro already seen in this session): go straight to the liquid state.
  useEffect(() => {
    if (introDone && ranRef.current === false && !reduce) {
      const id = setTimeout(() => setSwept(true), 1200)
      return () => clearTimeout(id)
    }
    return undefined
  }, [introDone, reduce])

  // Cursor lean (fine pointer, motion allowed), only when the WebGL liquid overlay is unavailable.
  useEffect(() => {
    if (calm || !fine || canLiquid) return undefined
    const h1 = h1Ref.current
    const els = letters.current.filter(Boolean)
    if (!h1 || !els.length) return undefined
    let centers = []
    const measure = () => {
      const base = h1.getBoundingClientRect()
      centers = els.map((el) => {
        const r = el.getBoundingClientRect()
        // Subtract the current lean so measurements stay stable.
        const tx = Number(el.dataset.tx || 0)
        const ty = Number(el.dataset.ty || 0)
        return { x: r.left - base.left + r.width / 2 - tx, y: r.top - base.top + r.height / 2 - ty }
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(h1)

    const pos = els.map(() => ({ x: 0, y: 0 }))
    let pointer = null
    let raf = 0
    const tick = () => {
      raf = 0
      const base = h1.getBoundingClientRect()
      let moving = false
      for (let i = 0; i < els.length; i += 1) {
        let tx = 0
        let ty = 0
        if (pointer && centers[i]) {
          const dx = pointer.x - (base.left + centers[i].x)
          const dy = pointer.y - (base.top + centers[i].y)
          const d = Math.hypot(dx, dy) || 1
          const k = Math.max(0, 1 - d / LEAN_RADIUS)
          const f = k * k * LEAN_PX
          tx = (dx / d) * f
          ty = (dy / d) * f * 0.6
        }
        const p = pos[i]
        p.x += (tx - p.x) * 0.14
        p.y += (ty - p.y) * 0.14
        if (Math.abs(tx - p.x) > 0.02 || Math.abs(ty - p.y) > 0.02) moving = true
        els[i].dataset.tx = p.x
        els[i].dataset.ty = p.y
        els[i].style.transform = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0)`
      }
      if (moving) raf = requestAnimationFrame(tick)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onMove = (e) => {
      pointer = { x: e.clientX, y: e.clientY }
      kick()
    }
    const onLeave = () => {
      pointer = null
      kick()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', kick, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', kick)
      els.forEach((el) => {
        el.style.transform = ''
        delete el.dataset.tx
        delete el.dataset.ty
      })
    }
  }, [calm, fine, canLiquid])

  let k = 0
  return (
    <h1 ref={h1Ref} aria-label={label} className={`relative ${className}`}>
      {liquid ? (
        <Suspense fallback={null}>
          <LiquidName h1Ref={h1Ref} getLetters={getLetters} onReady={setLiquidReady} />
        </Suspense>
      ) : null}
      {lines.map((line, li) => (
        <span
          key={li}
          aria-hidden="true"
          className="block transition-opacity duration-500"
          style={liquid && liquidReady ? { opacity: 0 } : undefined}
        >
          {line.split(' ').map((word, wi, words) => (
            <span key={wi}>
              <span className="inline-block whitespace-nowrap">
                {Array.from(word).map((ch, ci) => {
                  const idx = k
                  k += 1
                  return (
                    <span
                      key={ci}
                      ref={(el) => {
                        letters.current[idx] = el
                      }}
                      data-char={ch}
                      className="inline-block text-center"
                    >
                      {ch}
                    </span>
                  )
                })}
              </span>
              {wi < words.length - 1 ? ' ' : null}
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}
