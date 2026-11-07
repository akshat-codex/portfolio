import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { easeOutQuart, isCalm } from './prefs'

/**
 * Lenis smooth scroll on fine pointers without reduced motion. Lenis drives the
 * native window scroll, so framer-motion useScroll keeps working.
 * - Same-page anchors (a[href^="#"]) glide to the target, offset for the sticky nav.
 * - Dispatches window CustomEvent 'fx:velocity' {detail:{velocity}} (px/frame)
 *   on each frame the velocity changes, in both smooth and native modes.
 */

export const NAV_OFFSET = 64
const LenisContext = createContext(null)
export const useLenis = () => useContext(LenisContext)

const emitVelocity = (velocity) => {
  window.dispatchEvent(new CustomEvent('fx:velocity', { detail: { velocity } }))
}

export default function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null)
  const [calm, setCalm] = useState(() => (typeof window === 'undefined' ? true : isCalm()))

  // Follow preference changes (e.g. a laptop switching to tablet mode).
  useEffect(() => {
    const qs = ['(prefers-reduced-motion: reduce)', '(hover: hover) and (pointer: fine)'].map((q) =>
      window.matchMedia(q),
    )
    const update = () => setCalm(isCalm())
    qs.forEach((q) => q.addEventListener?.('change', update))
    return () => qs.forEach((q) => q.removeEventListener?.('change', update))
  }, [])

  // Lenis instance + rAF loop that also emits velocity.
  useEffect(() => {
    if (calm) return undefined
    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      // Let the mobile menu and anything marked data-lenis-prevent scroll natively.
      prevent: (node) => node.id === 'mobile-menu',
    })
    setLenis(instance)

    let raf = 0
    let last = 0
    const loop = (time) => {
      instance.raf(time)
      const v = instance.velocity || 0
      if (v !== last) {
        last = v
        emitVelocity(v)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Mirror body scroll locks (Navbar menu, Intro) onto Lenis.
    const syncLock = () => {
      const locked = document.body.style.overflow === 'hidden'
      if (locked) instance.stop()
      else instance.start()
    }
    const mo = new MutationObserver(syncLock)
    mo.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    syncLock()

    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      instance.destroy()
      setLenis(null)
      if (last !== 0) emitVelocity(0)
    }
  }, [calm])

  // Native-scroll velocity when Lenis is off.
  useEffect(() => {
    if (lenis) return undefined
    let raf = 0
    let lastY = window.scrollY
    let lastV = 0
    let still = 0
    const tick = () => {
      const y = window.scrollY
      const v = y - lastY
      lastY = y
      if (v !== lastV) {
        lastV = v
        emitVelocity(v)
      }
      still = v === 0 ? still + 1 : 0
      raf = still > 2 ? 0 : requestAnimationFrame(tick)
    }
    const onScroll = () => {
      still = 0
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [lenis])

  // Same-page anchor links. Bubble phase: component onClick handlers run first.
  useEffect(() => {
    if (!lenis) return undefined
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a[href^="#"]')
      if (!a) return
      const hash = a.getAttribute('href')
      const id = decodeURIComponent(hash.slice(1))
      const toTop = !id || id === 'top' || id === 'hero'
      const el = toTop ? null : document.getElementById(id)
      if (!toTop && !el) return
      e.preventDefault()
      lenis.start()
      lenis.scrollTo(toTop ? 0 : el, {
        offset: toTop ? 0 : -NAV_OFFSET,
        duration: 1.2,
        easing: easeOutQuart,
      })
      if (hash !== window.location.hash) window.history.pushState(null, '', hash)
      // Move focus for keyboard and screen-reader users without a native jump.
      const focusEl = toTop ? document.getElementById('hero') : el
      if (focusEl) {
        if (!focusEl.hasAttribute('tabindex')) focusEl.setAttribute('tabindex', '-1')
        focusEl.focus({ preventScroll: true })
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [lenis])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
