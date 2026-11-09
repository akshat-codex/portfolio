import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotionPref } from '@/components/fx'

/**
 * "Broken, then built": every character starts scattered (offset, rotated, tilted in 3D,
 * transparent) and snaps into place as the element scrolls into view. Scrubbed to scroll,
 * so scrolling back up breaks it apart again. Reduced motion renders plain text.
 */

// deterministic pseudo-random so the shatter pattern is stable across renders
const rnd = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function Char({ ch, i, n, progress, spread }) {
  const a = rnd(i + 1)
  const b = rnd(i + 101)
  const c = rnd(i + 201)
  // letters land in a wave, left to right, each over ~60% of the scroll window
  const start = (i / Math.max(1, n)) * 0.4
  const t = useTransform(progress, [start, start + 0.6], [0, 1], { clamp: true })
  const x = useTransform(t, [0, 1], [(a - 0.5) * 260 * spread, 0])
  const y = useTransform(t, [0, 1], [(b - 0.3) * 220 * spread, 0])
  const rotate = useTransform(t, [0, 1], [(c - 0.5) * 110, 0])
  const rotateX = useTransform(t, [0, 1], [(a - 0.5) * 140, 0])
  const scale = useTransform(t, [0, 1], [0.4 + b * 0.5, 1])
  const opacity = useTransform(t, [0, 0.35, 1], [0, 0.9, 1])
  return (
    <motion.span aria-hidden="true" className="inline-block will-change-transform" style={{ x, y, rotate, rotateX, scale, opacity }}>
      {ch === ' ' ? ' ' : ch}
    </motion.span>
  )
}

export default function ScrollAssemble({
  text,
  as: Tag = 'span',
  className = '',
  offset = ['start 100%', 'start 45%'],
  spread = 1,
  children,
}) {
  const ref = useRef(null)
  const reduce = useReducedMotionPref()
  const { scrollYProgress } = useScroll({ target: ref, offset })

  if (reduce) {
    return (
      <Tag className={className}>
        {text}
        {children}
      </Tag>
    )
  }

  const words = text.split(' ')
  let k = 0
  const n = text.length
  return (
    <Tag ref={ref} aria-label={text} className={className} style={{ perspective: '800px' }}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {Array.from(w + (wi < words.length - 1 ? ' ' : '')).map((ch) => {
            const i = k++
            return <Char key={i} ch={ch} i={i} n={n} progress={scrollYProgress} spread={spread} />
          })}
        </span>
      ))}
      {children}
    </Tag>
  )
}
