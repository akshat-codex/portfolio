import { useRef } from 'react'
import { motion, useScroll } from 'motion/react'
import ScrollReveal from '@/components/vendor/reactbits/ScrollReveal'
import CountUp from '@/components/vendor/reactbits/CountUp'
import { LinePath } from '@/components/vendor/skiper/skiper19'
import { useReducedMotionPref } from '@/components/fx'
import SectionTitle from './SectionTitle'
import { about } from '@/data/content'

const EASE = [0.22, 1, 0.36, 1]

function Fact({ fact, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
      className="group relative overflow-hidden rounded-3xl border border-rule bg-paper/[0.03] p-6 backdrop-blur-sm transition-colors duration-500 hover:border-signal/50"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-signal/0 blur-3xl transition-colors duration-700 group-hover:bg-signal/25"
      />
      <p className="label flex items-center gap-2">
        {fact.live ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" aria-hidden="true" /> : null}
        {fact.label}
      </p>
      {/* React Bits · Count Up for the numeric fact */}
      {typeof fact.value === 'number' ? (
        <p className="display mt-4 text-5xl text-paper">
          <CountUp to={fact.value} decimals={fact.decimals} duration={2.2} />
          <span className="text-2xl text-paper/50">{fact.suffix}</span>
        </p>
      ) : (
        <p className="mt-4 text-xl font-semibold leading-snug text-paper">{fact.value}</p>
      )}
      <p className="mt-2 text-sm text-paper/60">{fact.detail}</p>
    </motion.div>
  )
}

export default function About() {
  const ref = useRef(null)
  const reduce = useReducedMotionPref()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  return (
    <section id="about" ref={ref} className="relative overflow-hidden py-28 lg:py-40">
      {/* Skiper UI #19 · a stroke that draws itself with scroll progress */}
      {!reduce ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0 opacity-40">
          <LinePath
            className="absolute -right-[30%] top-[4%] h-auto w-[110%] md:-right-[10%] md:w-[70%]"
            scrollYProgress={scrollYProgress}
            stroke="#ff4d00"
            strokeWidth={14}
            from={0.05}
          />
        </div>
      ) : null}

      <div className="shell relative">
        <SectionTitle index={about.index} title={about.title} kicker="Who I am" />

        {/* React Bits · Scroll Reveal — words un-blur and rise as you scroll */}
        <div className="mt-14 max-w-5xl">
          <ScrollReveal
            baseOpacity={0.08}
            enableBlur
            baseRotation={2}
            blurStrength={8}
            textClassName="!text-[clamp(1.9rem,4.4vw,4rem)] !font-semibold !leading-[1.08] tracking-[-0.02em] text-paper"
          >
            {about.statement}
          </ScrollReveal>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-10 max-w-[60ch] text-lg leading-relaxed text-paper/70"
        >
          {about.paragraph}
        </motion.p>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {about.facts.map((f, i) => (
            <Fact key={f.label} fact={f} i={i} />
          ))}
        </div>

        <h3 className="label mt-24 text-paper">{about.practiceHeading}</h3>
        <ol className="mt-6 divide-y divide-rule border-y border-rule">
          {about.practice.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              className="group grid gap-4 py-8 md:grid-cols-12 md:items-baseline"
            >
              <span className="label num text-signal md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
              <h4 className="text-2xl font-bold uppercase tracking-tight text-paper transition-transform duration-500 group-hover:translate-x-2 md:col-span-4 lg:text-3xl">
                {p.title}
              </h4>
              <p className="text-paper/70 md:col-span-4">{p.desc}</p>
              <ul className="flex flex-wrap gap-2 md:col-span-3 md:justify-end">
                {p.tags.map((t) => (
                  <li key={t} className="rounded-full border border-rule px-3 py-1 text-xs text-paper/80">
                    {t}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
