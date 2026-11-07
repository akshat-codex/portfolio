import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Reveal, Rule, SectionHead } from './ui'
import { useCalm, EASE_QUART } from './fx'

// Measured, ruled facts. Every value is from the CV.
const facts = [
  { label: 'Period', value: <time className="num">2022–2026</time> },
  { label: 'Division', value: 'First Division with Honours' },
  { label: 'Rank', value: <><span className="num">25th</span> rank in 1st year, university-wide</> },
  { label: 'Scholarship', value: 'Awarded for academic excellence' },
  { label: 'Core modules', value: 'DSA, OOP, DBMS, OS, Computer Networks' },
]

const CGPA = 8.97
const SCALE = 10

/** Counts 0.00 → value once, the first time it is on screen. Static under reduced motion. */
function CountUp({ value, decimals = 2 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE_QUART,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals)
      },
    })
    return () => controls.stop()
  }, [inView, reduce, value, decimals])

  return (
    <span ref={ref} aria-hidden="true">
      {reduce ? value.toFixed(decimals) : (0).toFixed(decimals)}
    </span>
  )
}

const Education = () => {
  const reduce = useReducedMotion()
  const calm = useCalm()
  const numRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: numRef, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])

  return (
    <section id="education" className="shell py-24 lg:py-32">
      <SectionHead index="05" title="Education" />

      {/* Degree */}
      <div className="grid-12 mt-12 lg:mt-20">
        <div className="col-span-4 lg:col-span-8 lg:col-start-2">
          <Reveal
            as="h3"
            className="text-[clamp(1.5rem,4.5vw,2.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.01em] [font-stretch:112%]"
          >
            B.Tech Computer Science &amp; Engineering
          </Reveal>
          <Reveal as="p" delay={0.08} className="mt-5 text-lg text-paper">
            Babu Banarasi Das University
          </Reveal>
          <Reveal as="p" delay={0.12} className="label mt-1">
            Lucknow, India
          </Reveal>
        </div>
      </div>

      {/* CGPA: the one enormous measurement */}
      <div ref={numRef} className="grid-12 mt-14 items-end gap-y-6 lg:mt-20">
        <div className="col-span-4 lg:col-span-8 lg:col-start-2">
          <p className="label">CGPA</p>
          <motion.p style={calm ? undefined : { y: drift }} className="mt-3">
            <data
              value={String(CGPA)}
              className="display num block whitespace-nowrap text-[clamp(6rem,31vw,18rem)] leading-[0.8]"
            >
              <span className="sr-only">
                {CGPA} out of {SCALE}
              </span>
              <CountUp value={CGPA} />
            </data>
          </motion.p>
        </div>
        <div className="col-span-4 lg:col-span-3 lg:pb-3">
          <p className="flex items-baseline justify-between">
            <span className="label">Scale</span>
            <span className="num text-grey">/ {SCALE}</span>
          </p>
          {/* Scale bar: 0–10 ticks, signal fill to 8.97 */}
          <div aria-hidden="true" className="relative mt-3 h-6">
            <span className="absolute inset-x-0 bottom-0 h-px bg-rule" />
            {Array.from({ length: SCALE + 1 }, (_, t) => (
              <span
                key={t}
                className={`absolute bottom-0 w-px bg-grey ${t % 5 === 0 ? 'h-3' : 'h-1.5'}`}
                style={{ left: `calc(${(t / SCALE) * 100}% - ${t === SCALE ? 1 : 0}px)` }}
              />
            ))}
            <motion.span
              className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-signal"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: CGPA / SCALE }}
              style={reduce ? { transform: `scaleX(${CGPA / SCALE})` } : undefined}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 1.8, ease: EASE_QUART }}
            />
          </div>
          <p className="label num mt-2 flex justify-between">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </p>
        </div>
      </div>

      <dl className="grid-12 mt-16 lg:mt-24">
        {facts.map((f, i) => (
          <div key={f.label} className="col-span-4 lg:col-span-11 lg:col-start-2">
            <Rule delay={i * 0.07} />
            <motion.div
              className="grid grid-cols-4 gap-x-[var(--gap)] py-4 lg:grid-cols-11"
              initial={reduce ? false : { x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: EASE_QUART }}
            >
              <dt className="label col-span-4 lg:col-span-3 lg:pt-1">{f.label}</dt>
              <dd className="col-span-4 mt-1 text-paper lg:col-span-8 lg:mt-0">{f.value}</dd>
            </motion.div>
          </div>
        ))}
        <div className="col-span-4 lg:col-span-11 lg:col-start-2">
          <Rule delay={facts.length * 0.07} />
        </div>
      </dl>
    </section>
  )
}

export default Education
