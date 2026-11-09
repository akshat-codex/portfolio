import { motion } from 'motion/react'
import CountUp from '@/components/vendor/reactbits/CountUp'
import SectionTitle from './SectionTitle'
import { education } from '@/data/content'

const EASE = [0.22, 1, 0.36, 1]
const R = 70
const C = 2 * Math.PI * R

export default function Education() {
  const share = education.cgpa / education.scale
  return (
    <section id="education" className="relative py-28 lg:py-40">
      <div className="shell">
        <SectionTitle index={education.index} title={education.title} kicker={education.location} />

        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative mt-14 grid gap-10 overflow-hidden rounded-[2rem] border border-rule bg-gradient-to-br from-paper/[0.05] to-transparent p-6 md:grid-cols-12 md:p-12"
        >
          <span aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-signal/20 blur-[100px]" />
          <div className="relative md:col-span-7">
            <h3 className="text-3xl font-black uppercase leading-[0.95] tracking-tight text-paper md:text-5xl">
              {education.degree}
            </h3>
            <p className="mt-3 text-xl text-paper/80">{education.institution}</p>
            <dl className="mt-10 divide-y divide-rule border-y border-rule">
              {education.facts.map((f) => (
                <div key={f.label} className="grid grid-cols-[8rem_1fr] gap-4 py-3">
                  <dt className="label pt-0.5">{f.label}</dt>
                  <dd className="text-paper/90">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* CGPA dial: ring fills to the score while React Bits Count Up rolls the number */}
          <div className="relative grid place-items-center md:col-span-5">
            <div className="relative h-64 w-64">
              <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(242,241,236,0.1)" strokeWidth="8" />
                <motion.circle
                  cx="80"
                  cy="80"
                  r={R}
                  fill="none"
                  stroke="#ff4d00"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  initial={{ strokeDashoffset: C }}
                  whileInView={{ strokeDashoffset: C * (1 - share) }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, ease: EASE }}
                  style={{ filter: 'drop-shadow(0 0 10px rgba(255,77,0,0.6))' }}
                />
              </svg>
              <div className="absolute inset-0 grid place-content-center text-center">
                <p className="label">CGPA</p>
                <p className="display text-6xl text-paper">
                  <CountUp to={education.cgpa} decimals={2} duration={2.2} />
                </p>
                <p className="label num">/ {education.scale}</p>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  )
}
