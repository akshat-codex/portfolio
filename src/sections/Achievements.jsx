import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotionPref } from '@/components/fx'
import SectionTitle from './SectionTitle'
import { achievements } from '@/data/content'

const rnd = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

/**
 * Spotlight card that starts "shattered" (scattered, tilted in 3D) and locks into the grid
 * as the grid scrolls into view. Scrubbed, so it breaks apart again on the way back up.
 */
function Item({ a, i, n, progress, still }) {
  const r1 = rnd(i + 3)
  const r2 = rnd(i + 33)
  const r3 = rnd(i + 333)
  const start = (i / n) * 0.35
  const t = useTransform(progress, [start, start + 0.65], [0, 1], { clamp: true })
  const x = useTransform(t, [0, 1], [(r1 - 0.5) * 520, 0])
  const y = useTransform(t, [0, 1], [180 + r2 * 260, 0])
  const rotate = useTransform(t, [0, 1], [(r3 - 0.5) * 50, 0])
  const rotateX = useTransform(t, [0, 1], [55, 0])
  const opacity = useTransform(t, [0, 0.4, 1], [0, 0.8, 1])

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <motion.li
      onMouseMove={onMove}
      style={still ? undefined : { x, y, rotate, rotateX, opacity, transformPerspective: 900 }}
      className="group relative overflow-hidden rounded-3xl border border-rule bg-[#111012] p-6 transition-colors duration-500 hover:border-signal/40"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(260px circle at var(--mx) var(--my), rgba(255,77,0,0.18), transparent 60%)' }}
      />
      <span className="label num relative text-signal">{String(i + 1).padStart(2, '0')}</span>
      <h3 className="relative mt-8 text-xl font-bold leading-tight text-paper">{a.title}</h3>
      <p className="relative mt-2 text-sm text-paper/65">{a.desc}</p>
    </motion.li>
  )
}

export default function Achievements() {
  const ref = useRef(null)
  const gridRef = useRef(null)
  const reduce = useReducedMotionPref()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const { scrollYProgress: gridProgress } = useScroll({ target: gridRef, offset: ['start 105%', 'start 35%'] })
  const x = useTransform(scrollYProgress, [0, 1], ['10%', '-30%'])
  const items = achievements.items

  return (
    <section id="achievements" ref={ref} className="relative overflow-hidden py-28 lg:py-40">
      {/* oversized outline word drifting with scroll (parallax layer) */}
      <motion.p
        aria-hidden="true"
        style={reduce ? undefined : { x }}
        className="display pointer-events-none absolute top-24 whitespace-nowrap text-[22vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(242,241,236,0.07)]"
      >
        Milestones · Milestones
      </motion.p>
      <div className="shell relative">
        <SectionTitle index={achievements.index} title={achievements.title} kicker="Milestones" />
        <ul ref={gridRef} className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((a, i) => (
            <Item key={a.title} a={a} i={i} n={items.length} progress={gridProgress} still={reduce} />
          ))}
        </ul>
      </div>
    </section>
  )
}
