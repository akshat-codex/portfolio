import { useRef } from 'react'
import { useScroll } from 'motion/react'
import { StickyCard_001 } from '@/components/vendor/skiper/skiper16'
import { useReducedMotionPref } from '@/components/fx'
import SectionTitle from './SectionTitle'
import { certifications } from '@/data/content'

const TINTS = [
  'from-[#2a1206] via-[#151213] to-[#0f0e10]',
  'from-[#3a1405] via-[#1a1210] to-[#0f0e10]',
  'from-[#1f1a17] via-[#141213] to-[#0f0e10]',
]

function CertBody({ c, i }) {
  return (
    <div className={`relative flex h-full w-full flex-col justify-between border border-rule bg-gradient-to-br p-6 md:p-10 ${TINTS[i % TINTS.length]}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="label">{c.issuer}</p>
        <span
          className={`label rounded-full border px-3 py-1 ${
            c.live ? 'border-signal text-signal' : 'border-rule text-paper/70'
          }`}
        >
          {c.live ? <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-signal align-middle" /> : null}
          {c.status}
        </span>
      </div>
      <div>
        <span className="display num text-5xl text-paper/15 md:text-7xl" aria-hidden="true">
          {String(i + 1).padStart(2, '0')}
        </span>
        <h3 className="mt-2 text-2xl font-black uppercase leading-[0.95] tracking-tight text-paper md:text-4xl">{c.title}</h3>
        <p className="mt-3 max-w-[56ch] text-paper/75">{c.desc}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {c.skills.map((s) => (
            <li key={s} className="rounded-full border border-rule px-3 py-1 text-xs text-paper/80">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Certifications() {
  const ref = useRef(null)
  const reduce = useReducedMotionPref()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const items = certifications.items

  return (
    <section id="certifications" className="relative pt-28 lg:pt-40">
      <div className="shell">
        <SectionTitle index={certifications.index} title={certifications.title} kicker="Credentials" />
      </div>

      {reduce ? (
        <ul className="shell mt-14 grid gap-6">
          {items.map((c, i) => (
            <li key={c.title} className="min-h-[340px] overflow-hidden rounded-[2rem]">
              <CertBody c={c} i={i} />
            </li>
          ))}
        </ul>
      ) : (
        /* Skiper UI #16 · cards pin, stack and shrink back as you scroll */
        <div ref={ref} className="relative pb-[40vh] pt-[8vh]">
          {items.map((c, i) => (
            <StickyCard_001
              key={c.title}
              i={i}
              progress={scrollYProgress}
              range={[i / items.length, 1]}
              targetScale={Math.max(0.8, 1 - (items.length - i - 1) * 0.06)}
              className="h-[min(70vh,420px)] w-[min(92vw,760px)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
              baseTop={120}
            >
              <CertBody c={c} i={i} />
            </StickyCard_001>
          ))}
        </div>
      )}
    </section>
  )
}
