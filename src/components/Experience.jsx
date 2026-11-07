import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { Reveal, Rule, SectionHead } from './ui'
import { EASE_QUART, useReducedMotionPref } from './fx'

const ROLE_STACK = ['Python', 'Django', 'DRF', 'FastAPI', 'PostgreSQL', 'Celery', 'Redis', 'Docker', 'Linux', 'Git']

// The Polluxa message path. Captions are drawn only from the Polluxa work text.
const STATIONS = [
  { num: '01', name: 'API', role: 'DRF endpoints', caption: 'Django REST Framework endpoints for email, outreach, leads, pipeline, senders and inbox.' },
  { num: '02', name: 'Service', role: 'Business logic', caption: 'Business logic behind outreach, email warm-up and deliverability.' },
  { num: '03', name: 'PostgreSQL', role: 'Data layer', caption: 'PostgreSQL data modelling and investigation.' },
  { num: '04', name: 'Celery', role: 'Async workers', caption: 'Async workflows for automated email operations.' },
  { num: '05', name: 'Redis', role: 'Broker', caption: 'The broker behind the Celery + Redis async workflows.' },
  { num: '06', name: 'SMTP/IMAP', role: 'Send + mailbox', caption: 'The mail edge: production flows debugged across API → DB → Celery → Redis → SMTP/IMAP.' },
]
const N = STATIONS.length
const LAST = N - 1

// Scroll → station position with a dwell at every station:
// hold 0, travel, hold 1, travel … hold 5  (2N keyframes, evenly spaced).
const POS_IN = Array.from({ length: 2 * N }, (_, k) => k / (2 * N - 1))
const POS_OUT = Array.from({ length: 2 * N }, (_, k) => Math.floor(k / 2))

const WORK = [
  {
    title: 'Polluxa SalesTech',
    descriptor: 'Production SaaS',
    category: 'Backend · Work',
    period: '2026 — Present',
    summary:
      'Backend APIs and business logic for a production sales-outreach SaaS — email, outreach, leads, pipeline, senders, inbox, warm-up and deliverability — built on Django REST Framework.',
    bullets: [
      'Celery + Redis async workflows for automated email operations',
      'Email warm-up and deliverability analysis (before/after comparison)',
      'Debugged production flows across API → DB → Celery → Redis → SMTP/IMAP',
      'PostgreSQL data modelling and investigation',
    ],
    tech: ['Python', 'Django', 'DRF', 'PostgreSQL', 'Celery', 'Redis', 'Docker'],
  },
  {
    title: 'Newton-AI',
    descriptor: 'LinkedIn SDR Automation',
    category: 'AI Automation · Work',
    period: '2026 — Present',
    summary:
      'FastAPI/Celery-based AI system that engages LinkedIn leads in automated SDR conversations, qualifies prospects and hands warm leads to sales — integrated with the Polluxa SalesTech platform.',
    bullets: [
      'Interest detection, intent classification and lead qualification',
      'Lifecycle states: interested, not interested, job seeker, ghosted, handed-off',
      'Human handoff workflows for leads needing sales intervention',
      'Reliable async FastAPI + Celery processing and inbound webhooks',
    ],
    tech: ['Python', 'FastAPI', 'Celery', 'Redis', 'Conversational AI', 'Webhooks'],
    link: 'https://grateful-joy-0dad9947f5.media.strapiapp.com/AI_Powered_Linked_In_Outreach_Automation_1271cf68cd.mp4',
    linkLabel: 'Watch demo ↗',
  },
]

function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches
  const [matches, setMatches] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

const RISE = { duration: 0.6, ease: EASE_QUART }
// Overdamped springs: the trail lags the packet and settles into it, never overshoots.
const TRAIL = [
  { stiffness: 260, damping: 40, size: 'h-2.5 w-2.5', opacity: 0.55 },
  { stiffness: 140, damping: 32, size: 'h-2 w-2', opacity: 0.35 },
  { stiffness: 80, damping: 26, size: 'h-1.5 w-1.5', opacity: 0.2 },
]

function TrailDot({ pos, cfg }) {
  const p = useSpring(pos, { stiffness: cfg.stiffness, damping: cfg.damping, mass: 1 })
  const x = useTransform(p, (v) => `${(v / LAST) * 100}%`)
  return (
    <motion.span aria-hidden="true" className="absolute inset-x-0 top-0 block" style={{ x }}>
      <span
        className={`absolute left-0 top-0 block -translate-x-1/2 -translate-y-1/2 bg-signal ${cfg.size}`}
        style={{ opacity: cfg.opacity }}
      />
    </motion.span>
  )
}

/* ---------- Desktop: pinned, scroll-driven pipeline ---------- */
function PipelineScroll() {
  const trackRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  const pos = useTransform(scrollYProgress, POS_IN, POS_OUT)
  const packetX = useTransform(pos, (v) => `${(v / LAST) * 100}%`)
  const trailScale = useTransform(pos, (v) => v / LAST)
  // Big station counter: a strip of 01–06 rolled by scroll.
  const stripY = useTransform(pos, (v) => `${(-v * 100) / N}%`)
  const [active, setActive] = useState(0)

  useMotionValueEvent(pos, 'change', (v) => {
    const next = Math.min(LAST, Math.max(0, Math.floor(v + 0.02)))
    setActive((cur) => (cur === next ? cur : next))
  })

  const station = STATIONS[active]

  return (
    <div ref={trackRef} className="relative h-[560vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center pb-[6vh] pt-20">
        {/* Frame head */}
        <div className="grid-12 items-baseline">
          <p className="label col-span-6 text-paper">Polluxa · one message, six stations</p>
          <p className="label num col-span-6 text-right">
            Station{' '}
            <span className="relative inline-block h-[1.3em] overflow-hidden align-bottom text-signal">
              <motion.span key={station.num} className="block" initial={{ y: '100%' }} animate={{ y: '0%' }} transition={RISE}>
                {station.num}
              </motion.span>
            </span>{' '}
            / 06
          </p>
        </div>
        <div className="hairline mt-4" />

        {/* The enormous element: the station counter, scrubbed by scroll */}
        <div className="grid-12 mt-[4vh] items-end" aria-hidden="true">
          <div className="col-span-5 h-[min(15rem,27vh,16vw)] overflow-hidden">
            <motion.div className="flex flex-col will-change-transform" style={{ y: stripY }}>
              {STATIONS.map((s) => (
                <span
                  key={s.num}
                  className="display num block h-[min(15rem,27vh,16vw)] text-[min(15rem,27vh,16vw)] leading-[1] text-signal"
                >
                  {s.num}
                </span>
              ))}
            </motion.div>
          </div>
          <div className="col-span-7 pb-[1vh]">
            <div className="overflow-hidden pb-[0.08em]">
              <motion.p
                key={`${station.num}-name`}
                className="display text-[clamp(2.5rem,min(5vw,9vh),5rem)]"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ ...RISE, delay: 0.04 }}
              >
                {station.name}
              </motion.p>
            </div>
            <div className="mt-4 overflow-hidden">
              <motion.p
                key={`${station.num}-cap`}
                className="max-w-[52ch] text-lg leading-snug text-paper"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ ...RISE, delay: 0.12 }}
              >
                {station.caption}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Rail: the packet travels the hairline through six stations */}
        <div className="relative mt-[7vh]">
          <div className="absolute left-0 top-0 h-px w-[calc(100%*5/6)]">
            <span aria-hidden="true" className="absolute inset-0 block bg-rule" />
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 -top-px block h-[3px] origin-left bg-signal"
              style={{ scaleX: trailScale }}
            />
            {TRAIL.map((cfg, i) => (
              <TrailDot key={i} pos={pos} cfg={cfg} />
            ))}
            <motion.span aria-hidden="true" className="absolute inset-x-0 top-0 block" style={{ x: packetX }}>
              <span className="absolute left-0 top-0 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 bg-signal" />
            </motion.span>
          </div>

          <ol className="grid grid-cols-6">
            {STATIONS.map((s, i) => {
              const reached = i <= active
              const isActive = i === active
              return (
                <li key={s.num} className="relative pr-4 pt-6">
                  {/* tick: grey base + signal overlay that grows when reached */}
                  <span aria-hidden="true" className="absolute left-0 top-0 block h-2 w-px bg-rule" />
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-0 top-0 block h-5 w-px origin-top bg-signal"
                    initial={false}
                    animate={{ scaleY: reached ? 1 : 0 }}
                    transition={RISE}
                  />
                  {/* arrival pulse */}
                  {isActive ? (
                    <span
                      key={`pulse-${s.num}`}
                      aria-hidden="true"
                      className="absolute left-0 top-0 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2"
                    >
                      <motion.span
                        className="block h-full w-full border border-signal"
                        initial={{ scale: 1, opacity: 0.9 }}
                        animate={{ scale: 3.2, opacity: 0 }}
                        transition={{ duration: 0.9, ease: EASE_QUART }}
                      />
                    </span>
                  ) : null}

                  {/* number flips grey → signal */}
                  <span className="label num relative block h-[1.3em] overflow-hidden">
                    <motion.span
                      className="block"
                      initial={false}
                      animate={{ y: reached ? '-50%' : '0%' }}
                      transition={RISE}
                    >
                      <span className="block h-[1.3em] text-grey">{s.num}</span>
                      <span className="block h-[1.3em] text-signal">{s.num}</span>
                    </motion.span>
                  </span>
                  <motion.span
                    className="mt-2 block text-base font-bold uppercase leading-tight tracking-tight text-paper [font-stretch:115%]"
                    initial={false}
                    animate={{ opacity: reached ? 1 : 0.55, x: isActive ? 4 : 0 }}
                    transition={RISE}
                  >
                    {s.name}
                  </motion.span>
                  {/* caption sets in (mask-rise) when reached */}
                  <span className="mt-1 block overflow-hidden">
                    <motion.span
                      className="label block normal-case tracking-normal"
                      initial={false}
                      animate={{ y: reached ? '0%' : '110%' }}
                      transition={{ ...RISE, delay: reached ? 0.1 : 0 }}
                      aria-hidden="true"
                    >
                      {s.role}
                    </motion.span>
                  </span>
                  <span className="sr-only">
                    {s.role}. {s.caption}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}

/* ---------- Mobile / reduced motion: numbered vertical list ---------- */
function PipelineList({ reduce }) {
  const listRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 60%'] })
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div>
      <p className="label text-paper">Polluxa · one message, six stations</p>
      <ol ref={listRef} className="relative mt-6">
        {/* vertical rail; the signal fill follows scroll unless motion is reduced */}
        <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-0 block w-px bg-rule" />
        {!reduce ? (
          <motion.span
            aria-hidden="true"
            className="absolute bottom-0 left-[5px] top-0 block w-px origin-top bg-signal"
            style={{ scaleY: fill }}
          />
        ) : null}
        {STATIONS.map((s, i) => (
          <li key={s.num} className="relative grid grid-cols-[3rem_1fr] gap-x-3">
            <span aria-hidden="true" className="absolute left-0 top-[1.3rem] block h-[11px] w-[11px] border border-signal bg-ink" />
            <span className="label num pl-6 pt-5 text-paper">{s.num}</span>
            <div className="border-t border-rule pb-6 pt-4">
              <Reveal as="p" delay={0.02 * i} className="text-2xl font-extrabold uppercase leading-none [font-stretch:118%]">
                {s.name}
              </Reveal>
              <p className="label mt-2 normal-case tracking-normal">{s.role}</p>
              <p className="mt-3 max-w-[60ch] text-paper/90">{s.caption}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="hairline" />
    </div>
  )
}

/* ---------- Work entries ---------- */
function WorkEntry({ entry, index, reduce }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 40%'] })
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1])
  const titleX = useTransform(scrollYProgress, [0, 1], ['6%', '0%'])

  return (
    <article ref={ref} className="group relative pb-14 pt-6 lg:pb-20">
      <span aria-hidden="true" className="absolute left-0 right-0 top-0 block h-px bg-rule" />
      {!reduce ? (
        <motion.span
          aria-hidden="true"
          className="absolute left-0 right-0 top-0 block h-px origin-left bg-paper/60"
          style={{ scaleX: draw }}
        />
      ) : null}
      <div className="grid-12 gap-y-6">
        <span className="label num col-span-4 text-paper lg:col-span-1 lg:pt-2">{index}</span>

        <div className="col-span-4 lg:col-span-5">
          <Reveal
            as="h3"
            className="text-[clamp(2rem,5vw,3.75rem)] font-black uppercase leading-[0.92] tracking-[-0.01em] [font-stretch:120%]"
          >
            <motion.span className="inline-block" style={reduce ? undefined : { x: titleX }}>
              <span className="inline-block transition-transform duration-500 ease-quart motion-safe:group-hover:translate-x-1">
                {entry.title}
              </span>
            </motion.span>
          </Reveal>
          <Reveal as="p" delay={0.06} className="mt-2 text-lg font-semibold text-paper">
            {entry.descriptor}
          </Reveal>
          <p className="label mt-4">
            {entry.category} · <span className="num">{entry.period}</span>
          </p>
          {entry.link ? (
            <a
              href={entry.link}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              data-cursor-label="Play"
              className="group/link mt-6 inline-flex items-center gap-3 font-semibold text-signal"
            >
              <span aria-hidden="true" className="block h-2 w-2 bg-signal" />
              <span className="relative">
                {entry.linkLabel}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 block h-px w-full origin-left scale-x-[0.35] bg-signal transition-transform duration-500 ease-quart group-hover/link:scale-x-100"
                />
              </span>
            </a>
          ) : null}
        </div>

        <div className="col-span-4 lg:col-span-6">
          <p className="max-w-[65ch] text-paper">{entry.summary}</p>
          <ol className="mt-6">
            {entry.bullets.map((b, i) => (
              <motion.li
                key={b}
                className="grid grid-cols-[2.25rem_1fr] border-t border-rule py-3 text-grey"
                initial={reduce ? false : { opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ duration: 0.6, delay: 0.06 * i, ease: EASE_QUART }}
              >
                <span className="label num pt-[3px]">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-paper/90">{b}</span>
              </motion.li>
            ))}
          </ol>
          <div className="grid grid-cols-[2.25rem_1fr] border-t border-rule pt-3">
            <span aria-hidden="true" />
            <p className="text-sm text-grey">
              <span className="label mr-3 text-paper">Built with</span>
              {entry.tech.join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Experience() {
  const reduce = useReducedMotionPref()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const scrollDriven = isDesktop && !reduce

  return (
    <section id="experience" className="shell overflow-x-clip py-24 lg:py-32">
      <SectionHead index="02" title="Experience" />

      {/* Role */}
      <div className="grid-12 gap-y-6 pt-12 lg:pt-16">
        <div className="col-span-4 lg:col-span-1 lg:pt-3">
          <span className="label inline-flex items-center gap-2 text-signal">
            <span aria-hidden="true" className="relative block h-2 w-2">
              <span className="absolute inset-0 block bg-signal" />
              {!reduce ? (
                <motion.span
                  className="absolute inset-0 block border border-signal"
                  animate={{ scale: [1, 2.6], opacity: [0.8, 0] }}
                  transition={{ duration: 1.8, ease: EASE_QUART, repeat: Infinity, repeatDelay: 0.6 }}
                />
              ) : null}
            </span>
            Now
          </span>
        </div>
        <div className="col-span-4 lg:col-span-7">
          <Reveal
            as="h3"
            className="text-[clamp(1.75rem,4.6vw,3.75rem)] font-black uppercase leading-[0.92] [font-stretch:118%]"
          >
            Gravity Engineering Services
          </Reveal>
          <Reveal as="p" delay={0.08} className="mt-3 text-xl font-semibold text-paper">
            Python Backend Developer
          </Reveal>
          <p className="mt-4 max-w-[60ch] text-grey">
            Building and maintaining scalable backend systems, REST APIs, and cloud-integrated services
            using Python. Contributing to real-world engineering solutions and microservice architecture.
          </p>
        </div>
        <dl className="col-span-4 grid grid-cols-2 gap-x-[var(--gap)] gap-y-4 lg:col-span-4 lg:pt-3">
          <div>
            <dt className="label">Period</dt>
            <dd className="num mt-1 text-paper">
              <time dateTime="2026-06">June 2026</time> – <span className="text-signal">Present</span>
            </dd>
          </div>
          <div>
            <dt className="label">Base</dt>
            <dd className="mt-1 text-paper">Full-Time · Lucknow, India</dd>
          </div>
        </dl>
      </div>

      <div className="grid-12 mt-8">
        <div className="col-span-4 lg:col-span-11 lg:col-start-2">
          <Rule delay={0.1} />
          <p className="pt-3 text-sm text-grey">
            <span className="label mr-3 text-paper">Stack</span>
            {ROLE_STACK.join(' · ')}
          </p>
        </div>
      </div>

      {/* Signature: the Polluxa pipeline */}
      <div className="mt-20 lg:mt-28">
        <div className="grid-12 mb-6 gap-y-3 lg:mb-0">
          <p className="col-span-4 max-w-[60ch] text-lg text-paper lg:col-span-8 lg:col-start-2">
            Follow a message through the Polluxa backend: the full API → DB → queue → mail path.
          </p>
        </div>
        {scrollDriven ? (
          <PipelineScroll />
        ) : (
          <div className="mt-6">
            <PipelineList reduce={reduce} />
          </div>
        )}
      </div>

      {/* Work entries */}
      <div className="mt-20 lg:mt-24">
        {WORK.map((entry, i) => (
          <WorkEntry key={entry.title} entry={entry} index={`02.${i + 1}`} reduce={reduce} />
        ))}
        <Rule />
      </div>
    </section>
  )
}
