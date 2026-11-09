import { motion } from 'motion/react'
import { Timeline } from '@/components/vendor/aceternity/timeline'
import SectionTitle from './SectionTitle'
import { experience } from '@/data/content'

const EASE = [0.22, 1, 0.36, 1]

function Chips({ items }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {items.map((t) => (
        <li key={t} className="rounded-full border border-rule bg-paper/[0.03] px-3 py-1 text-xs font-medium text-paper/80">
          {t}
        </li>
      ))}
    </ul>
  )
}

function Card({ children, accent = false }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, ease: EASE }}
      className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${
        accent ? 'border-signal/40 bg-gradient-to-br from-signal/[0.12] to-transparent' : 'border-rule bg-paper/[0.03]'
      }`}
    >
      {children}
    </motion.article>
  )
}

/** The Polluxa message path: six stations, a pulse that runs across them. */
function Pipeline({ pipeline }) {
  return (
    <div className="mt-8">
      <p className="label text-paper/80">{pipeline.label}</p>
      <ol className="relative mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {pipeline.stations.map((s, i) => (
          <motion.li
            key={s.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className="group relative rounded-2xl border border-rule bg-ink/60 p-3"
            title={s.caption}
          >
            <span className="label num text-signal">{s.num}</span>
            <p className="mt-2 font-bold text-paper">{s.name}</p>
            <p className="text-xs text-paper/55">{s.role}</p>
            <span
              aria-hidden="true"
              className="absolute inset-x-3 bottom-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100"
            />
          </motion.li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-paper/60">{pipeline.intro}</p>
    </div>
  )
}

export default function Experience() {
  const role = experience.roles[0]
  const [polluxa, newton] = experience.work

  const data = [
    {
      title: role.periodStart,
      content: (
        <Card accent>
          <p className="label flex items-center gap-2 text-signal">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" aria-hidden="true" />
            {role.period}
          </p>
          <h3 className="mt-3 text-3xl font-black uppercase leading-none tracking-tight text-paper md:text-4xl">{role.role}</h3>
          <p className="mt-2 text-lg text-paper/80">{role.company}</p>
          <p className="label mt-1">{role.base}</p>
          <p className="mt-5 max-w-[62ch] text-paper/75">{role.summary}</p>
          <Chips items={role.stack} />
        </Card>
      ),
    },
    ...[polluxa, newton].map((w, idx) => ({
      title: w.title,
      content: (
        <Card>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="label text-signal">{w.category}</p>
            <p className="label num">{w.period}</p>
          </div>
          <h3 className="mt-3 text-3xl font-black uppercase leading-none tracking-tight text-paper md:text-4xl">{w.title}</h3>
          <p className="mt-1 text-paper/60">{w.descriptor}</p>
          <p className="mt-5 max-w-[62ch] text-paper/75">{w.summary}</p>
          <ul className="mt-5 space-y-2">
            {w.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-paper/85">
                <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-signal" />
                {b}
              </li>
            ))}
          </ul>
          {idx === 0 ? <Pipeline pipeline={experience.pipeline} /> : null}
          <Chips items={w.tech} />
          {w.link ? (
            <a
              href={w.link}
              target="_blank"
              rel="noreferrer"
              className="cursor-target mt-6 inline-flex rounded-full border border-paper px-5 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-paper transition-colors hover:border-signal hover:bg-signal hover:text-ink"
            >
              {w.linkLabel}
            </a>
          ) : null}
        </Card>
      ),
    })),
  ]

  return (
    <section id="experience" className="relative py-28 lg:py-40">
      <div className="shell">
        {/* Aceternity · Timeline — sticky labels + a beam that traces your scroll */}
        <Timeline data={data} heading={<SectionTitle index={experience.index} title={experience.title} kicker="Where I build" />} />
      </div>
    </section>
  )
}
