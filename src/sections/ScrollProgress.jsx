import NumberFlow from '@number-flow/react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { useState } from 'react'

/**
 * Draggable circular scroll-progress ring with a rolling percentage.
 * The indicator from Skiper UI #89, lifted out of its demo page and themed.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const [pct, setPct] = useState(0)
  const clamped = useTransform(scrollYProgress, (v) => Math.min(Math.max(v, 0), 1))
  useMotionValueEvent(clamped, 'change', (v) => setPct(Math.round(v * 100)))
  const r = 18

  return (
    <motion.div
      drag
      dragMomentum={false}
      aria-hidden="true"
      className="group fixed bottom-5 right-5 z-40 hidden cursor-grab active:cursor-grabbing md:block"
    >
      <NumberFlow
        value={pct}
        suffix="%"
        className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full text-xs font-semibold tabular-nums text-paper/0 transition-colors group-hover:text-paper/70"
      />
      <div className="grid h-12 w-12 place-items-center rounded-2xl border border-rule bg-ink/50 backdrop-blur-md">
        <svg className="h-10 w-10 text-signal" viewBox="0 0 48 48" role="presentation">
          <circle cx="24" cy="24" r={r} stroke="currentColor" strokeWidth="3" className="opacity-20" fill="none" />
          <motion.circle
            cx="24"
            cy="24"
            r={r}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            style={{ pathLength: clamped, rotate: -90, transformOrigin: '50% 50%' }}
          />
        </svg>
      </div>
    </motion.div>
  )
}
