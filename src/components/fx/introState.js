import { useSyncExternalStore } from 'react'
import { prefersReducedMotion } from './prefs'

const KEY = 'intro-seen'

function readSeen() {
  try {
    return window.sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

function initial() {
  if (typeof window === 'undefined') return true
  let skip = false
  try {
    skip = new URLSearchParams(window.location.search).has('nointro')
  } catch {
    skip = false
  }
  return skip || prefersReducedMotion() || readSeen()
}

let done = initial()
const listeners = new Set()

if (done && typeof document !== 'undefined') document.documentElement.dataset.introDone = 'true'

/** Whether the intro should play at all on this load. */
export const introShouldPlay = () => !done

export function markIntroDone() {
  if (done) return
  done = true
  try {
    window.sessionStorage.setItem(KEY, '1')
  } catch {
    /* storage blocked: intro may replay next load, harmless */
  }
  document.documentElement.dataset.introDone = 'true'
  window.dispatchEvent(new Event('fx:intro-done'))
  listeners.forEach((l) => l())
}

const subscribe = (cb) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
const get = () => done

/** true once the intro has finished, or immediately if it was skipped / already seen. */
export const useIntroDone = () => useSyncExternalStore(subscribe, get, () => true)
