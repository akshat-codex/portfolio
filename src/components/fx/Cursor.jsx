import { useEffect, useRef } from 'react'
import { useCalm } from './prefs'

/**
 * Custom cursor for fine pointers without reduced motion. Paper dot + a ring that
 * lerps behind (mix-blend difference). States, by hovered element:
 *   a, button, [data-cursor]       ring grows
 *   [data-cursor="view"]           filled signal circle with "View" (or data-cursor-label)
 *   [data-cursor="text"], inputs   thin I-beam bar
 * Styles live in index.css (.fx-cursor*). Native cursor hidden via html.has-fx-cursor.
 */
const INTERACTIVE = 'a, button, [role="button"], label, summary, select, [data-cursor]'
const TEXTY = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]), textarea, [contenteditable="true"]'

export default function Cursor() {
  const calm = useCalm()
  const rootRef = useRef(null)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (calm) return undefined
    const root = rootRef.current
    const html = document.documentElement
    html.classList.add('has-fx-cursor')

    const target = { x: -100, y: -100 }
    const ring = { x: -100, y: -100 }
    let raf = 0
    let seen = false

    const tick = () => {
      ring.x += (target.x - ring.x) * 0.18
      ring.y += (target.y - ring.y) * 0.18
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
      if (Math.abs(target.x - ring.x) > 0.1 || Math.abs(target.y - ring.y) > 0.1) {
        raf = requestAnimationFrame(tick)
      } else raf = 0
    }

    const setState = (el) => {
      let state = 'default'
      let label = ''
      if (el) {
        const hit = el.closest?.(`${TEXTY}, ${INTERACTIVE}`)
        if (hit) {
          const mode = hit.getAttribute('data-cursor')
          if (mode === 'view') {
            state = 'view'
            label = hit.getAttribute('data-cursor-label') || 'View'
          } else if (mode === 'text' || hit.matches(TEXTY)) state = 'text'
          else if (mode === 'none') state = 'default'
          else state = 'hover'
        }
      }
      if (root.dataset.state !== state) root.dataset.state = state
      if (labelRef.current && labelRef.current.textContent !== label) labelRef.current.textContent = label
    }

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      target.x = e.clientX
      target.y = e.clientY
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`
      if (!seen) {
        seen = true
        ring.x = target.x
        ring.y = target.y
      }
      root.dataset.visible = 'true'
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onOver = (e) => setState(e.target)
    const onDown = () => (root.dataset.pressed = 'true')
    const onUp = () => (root.dataset.pressed = 'false')
    const onLeave = () => (root.dataset.visible = 'false')
    // Content can move under a still pointer (scroll); re-hit-test then.
    const onScroll = () => {
      if (seen) setState(document.elementFromPoint(target.x, target.y))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    html.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      html.classList.remove('has-fx-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      html.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
      window.removeEventListener('scroll', onScroll)
    }
  }, [calm])

  if (calm) return null

  return (
    <div ref={rootRef} className="fx-cursor" data-state="default" data-visible="false" aria-hidden="true">
      <div ref={ringRef} className="fx-cursor-pos">
        <span className="fx-cursor-ring" />
        <span className="fx-cursor-view">
          <span ref={labelRef} className="fx-cursor-label" />
        </span>
        <span className="fx-cursor-beam" />
      </div>
      <div ref={dotRef} className="fx-cursor-pos">
        <span className="fx-cursor-dot" />
      </div>
    </div>
  )
}
