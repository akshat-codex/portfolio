import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Reveal, Rule, SectionHead, EASE_QUART } from './ui'
import { useCalm, useReducedMotionPref } from './fx'

const STATEMENT =
  'I build backends for production SaaS and AI automation, Polluxa SalesTech and Newton-AI: Django and FastAPI services, Celery and Redis queues, PostgreSQL, and SMTP/IMAP mail.'

/** Counts up once when scrolled into view. Screen readers get the final value only. */
function CountUp({ value, decimals = 0, duration = 1.4 }) {
  const ref = useRef(null)
  const reduce = useReducedMotionPref()
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const final = value.toFixed(decimals)

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return undefined
    if (!inView) {
      el.textContent = (0).toFixed(decimals)
      return undefined
    }
    const controls = animate(0, value, {
      duration,
      ease: EASE_QUART,
      onUpdate: (v) => {
        el.textContent = v.toFixed(decimals)
      },
    })
    return () => controls.stop()
  }, [inView, reduce, value, decimals, duration])

  return (
    <>
      <span className="sr-only">{final}</span>
      <span ref={ref} aria-hidden="true" className="num">
        {final}
      </span>
    </>
  )
}

const facts = [
  {
    label: 'Now',
    live: true,
    value: 'Python Backend Developer',
    detail: (
      <>
        Gravity Engineering Services, since <time dateTime="2026-06">Jun 2026</time>
      </>
    ),
  },
  {
    label: 'Education',
    value: 'B.Tech Computer Science',
    detail: (
      <>
        Babu Banarasi Das University, <span className="num">2022–2026</span>
      </>
    ),
  },
  {
    label: 'CGPA',
    big: true,
    value: (
      <>
        <CountUp value={8.97} decimals={2} />
        <span className="num text-grey">/10</span>
      </>
    ),
    detail: 'First division with honours',
  },
  { label: 'Base', value: 'Lucknow, India', detail: 'Open to collaborations' },
]

const practice = [
  {
    title: 'Backend Engineering',
    desc: 'Scalable REST APIs, microservices, and server-side systems using Python, Java, Node.js & Express.',
    tags: ['Python', 'Java', 'Node.js', 'REST APIs'],
  },
  {
    title: 'Cloud & AWS',
    desc: 'Serverless architectures, cloud deployment, and infrastructure design with AWS core services.',
    tags: ['Lambda', 'EC2', 'DynamoDB', 'API Gateway'],
  },
  {
    title: 'Full Stack Development',
    desc: 'End-to-end web apps using React on the frontend and Express/Node on the backend with MongoDB.',
    tags: ['React.js', 'MongoDB', 'Express', 'HTML/CSS'],
  },
  {
    title: 'AI / ML Solutions',
    desc: 'NLP pipelines, ML model training, and intelligent data analysis with Python-based frameworks.',
    tags: ['Scikit-Learn', 'NLP', 'TF-IDF', 'Flask'],
  },
]

const statementClass =
  'text-[clamp(1.5rem,3.4vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.015em] text-paper [font-stretch:112%]'

function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <motion.span className="inline" style={{ opacity }}>
      {children}
    </motion.span>
  )
}

/** The statement lights up word by word, scrubbed by scroll. Calm: plain text. */
function ScrubStatement() {
  const calm = useCalm()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  if (calm) return <p ref={ref} className={statementClass}>{STATEMENT}</p>
  const words = STATEMENT.split(' ')
  const n = words.length
  return (
    <p ref={ref} className={statementClass}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / n, Math.min(1, (i + 2) / n)]}>
          {w}
          {i < n - 1 ? ' ' : null}
        </Word>
      ))}
    </p>
  )
}

function PracticeRow({ p, i }) {
  const reduce = useReducedMotionPref()
  const row = (
    <div className="grid grid-cols-1 gap-y-2 py-5 lg:grid-cols-11 lg:gap-x-[var(--gap)]">
      <h4 className="flex items-baseline gap-3 font-bold uppercase tracking-[0.02em] text-paper [font-stretch:118%] lg:col-span-3">
        <span
          aria-hidden="true"
          className="block h-1.5 w-1.5 shrink-0 -translate-x-2 bg-signal opacity-0 transition-[transform,opacity] duration-500 ease-quart group-hover:translate-x-0 group-hover:opacity-100"
        />
        <span className="-ml-[1.125rem] transition-transform duration-500 ease-quart group-hover:translate-x-[1.125rem]">
          {p.title}
        </span>
      </h4>
      <p className="max-w-[60ch] text-grey transition-colors duration-500 group-hover:text-paper lg:col-span-5">{p.desc}</p>
      <p className="label lg:col-span-3 lg:pt-1 lg:text-right">{p.tags.join(' · ')}</p>
    </div>
  )
  return (
    <li className="group relative">
      <Rule delay={i * 0.06} />
      {/* Paper wash wipes in under the row on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-px block origin-left scale-x-0 bg-paper/[0.035] transition-transform duration-700 ease-quart group-hover:scale-x-100"
      />
      {reduce ? (
        row
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.8, delay: 0.05 + i * 0.07, ease: EASE_QUART }}
        >
          {row}
        </motion.div>
      )}
    </li>
  )
}

const About = () => {
  const reduce = useReducedMotionPref()
  return (
    <section id="about" className="shell py-24 lg:py-36">
      <SectionHead index="01" title="About" />

      <div className="grid-12 mt-12 gap-y-14 lg:mt-20">
        {/* Statement, columns 2-9 */}
        <div className="col-span-4 lg:col-span-8 lg:col-start-2">
          <ScrubStatement />
          <Reveal as="p" delay={0.12} className="mt-8 max-w-[62ch] text-[1.0625rem] leading-relaxed text-grey">
            B.Tech CSE graduate (2026) and Python/Backend Developer at{' '}
            <span className="text-paper">Gravity Engineering Services</span>. Passionate about
            cloud-native systems, AI, and shipping things that work in the real world, debugged across
            the full API → database → queue → mail path.
          </Reveal>
        </div>

        {/* Facts, columns 10-12 */}
        <dl className="col-span-4 lg:col-span-3 lg:col-start-10">
          {facts.map((f, i) => {
            const body = (
              <>
                <dt className={`label relative flex items-center gap-1.5 pt-3 ${f.live ? 'text-signal' : ''}`}>
                  <Rule accent={f.live} delay={0.1 + i * 0.08} className="absolute left-0 top-0" />
                  {f.live ? (
                    <motion.span
                      aria-hidden="true"
                      className="block h-1.5 w-1.5 bg-signal"
                      animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
                      transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ) : null}
                  {f.label}
                </dt>
                <dd
                  className={`mt-1.5 text-paper ${
                    f.big ? 'display text-[clamp(2.5rem,5vw,4rem)] normal-case' : 'text-lg font-semibold leading-snug'
                  }`}
                >
                  {f.value}
                </dd>
                <dd className={`text-sm leading-snug text-grey ${f.big ? 'mt-2' : ''}`}>{f.detail}</dd>
              </>
            )
            return reduce ? (
              <div key={f.label} className={i ? 'mt-7' : ''}>
                {body}
              </div>
            ) : (
              <motion.div
                key={f.label}
                className={i ? 'mt-7' : ''}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: EASE_QUART }}
              >
                {body}
              </motion.div>
            )
          })}
        </dl>

        {/* Practice areas as a ruled index, not cards */}
        <div className="col-span-4 lg:col-span-11 lg:col-start-2">
          <h3 className="label text-paper">Practice</h3>
          <ul className="mt-4">
            {practice.map((p, i) => (
              <PracticeRow key={p.title} p={p} i={i} />
            ))}
          </ul>
          <Rule />
        </div>
      </div>
    </section>
  )
}

export default About
