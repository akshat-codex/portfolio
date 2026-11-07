import { useSyncExternalStore } from 'react'

/** Shared motion preferences. "Calm" = reduced motion OR coarse pointer (touch). */

const REDUCE_Q = '(prefers-reduced-motion: reduce)'
const FINE_Q = '(hover: hover) and (pointer: fine)'

const mq = (q) => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q) : null)

export const prefersReducedMotion = () => !!mq(REDUCE_Q)?.matches
export const hasFinePointer = () => !!mq(FINE_Q)?.matches
export const isCalm = () => prefersReducedMotion() || !hasFinePointer()

function subscribe(cb) {
  const a = mq(REDUCE_Q)
  const b = mq(FINE_Q)
  a?.addEventListener?.('change', cb)
  b?.addEventListener?.('change', cb)
  return () => {
    a?.removeEventListener?.('change', cb)
    b?.removeEventListener?.('change', cb)
  }
}

/** true when prefers-reduced-motion is set */
export const useReducedMotionPref = () => useSyncExternalStore(subscribe, prefersReducedMotion, () => false)
/** true on a mouse/trackpad (hover + fine pointer) */
export const useFinePointer = () => useSyncExternalStore(subscribe, hasFinePointer, () => false)
/** true when the page must use its calm version (reduced motion or touch) */
export const useCalm = () => useSyncExternalStore(subscribe, isCalm, () => true)

export const EASE_QUART = [0.25, 1, 0.5, 1]
export const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)
