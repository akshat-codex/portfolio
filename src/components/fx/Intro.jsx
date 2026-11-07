import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { EASE_QUART, easeOutQuart } from './prefs'
import { introShouldPlay, markIntroDone } from './introState'

/**
 * Once-per-session cinematic intro: 000→100 counter, a signal progress rule and
 * the label, then the black panel wipes up (clip-path) to reveal the page.
 * Click / any key skips straight to the wipe. Skipped under reduced motion.
 */
const COUNT_MS = 1250
const WIPE_S = 0.7

export default function Intro() {
  const [mounted, setMounted] = useState(introShouldPlay)
  const [leaving, setLeaving] = useState(false)
  const numRef = useRef(null)
  const barRef = useRef(null)
  const leavingRef = useRef(false)

  useEffect(() => {
    if (!mounted) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)

    let raf = 0
    const start = performance.now()
    const leave = () => {
      if (leavingRef.current) return
      leavingRef.current = true
      cancelAnimationFrame(raf)
      if (numRef.current) numRef.current.textContent = '100'
      if (barRef.current) barRef.current.style.transform = 'scaleX(1)'
      setLeaving(true)
      // Release the page as the wipe starts so the name begins assembling under it.
      document.body.style.overflow = prevOverflow
      markIntroDone()
    }
    const tick = (now) => {
      const t = Math.min(1, (now - start) / COUNT_MS)
      const p = easeOutQuart(t)
      if (numRef.current) numRef.current.textContent = String(Math.round(p * 100)).padStart(3, '0')
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
      if (t < 1) raf = requestAnimationFrame(tick)
      else setTimeout(leave, 120)
    }
    raf = requestAnimationFrame(tick)

    const skip = () => leave()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    window.addEventListener('wheel', skip, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('wheel', skip)
      document.body.style.overflow = prevOverflow
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink text-paper"
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      animate={leaving ? { clipPath: 'inset(0% 0% 100% 0%)' } : { clipPath: 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: WIPE_S, ease: EASE_QUART }}
      onAnimationComplete={() => leaving && setMounted(false)}
      style={{ willChange: 'clip-path' }}
    >
      <div className="shell flex items-center justify-between pt-5">
        <span className="label text-paper">AKS / Portfolio 2026</span>
        <span className="label"><span className="hidden sm:inline">Click or press any key to </span>skip</span>
      </div>

      <div className="shell pb-8 lg:pb-12">
        <div className="flex items-end justify-between gap-6">
          <span
            ref={numRef}
            className="display num text-[clamp(4.5rem,25vw,22rem)] leading-[0.8] text-paper"
          >
            000
          </span>
          <span className="label mb-2 hidden text-right sm:block">
            Akshat Kumar Srivastava
            <br />
            Python backend
          </span>
        </div>
        <span className="mt-5 block h-[2px] w-full bg-rule lg:mt-8">
          <span
            ref={barRef}
            className="block h-full w-full origin-left bg-signal"
            style={{ transform: 'scaleX(0)' }}
          />
        </span>
      </div>
    </motion.div>
  )
}
