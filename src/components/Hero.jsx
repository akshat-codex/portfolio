import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { EASE_QUART } from './ui'
import { KineticName, Magnetic, useIntroDone, useCalm, useReducedMotionPref } from './fx'

const CV_HREF = '/Akshat_Srivastava_CV.pdf'
const NAME_LINES = ['AKSHAT KUMAR', 'SRIVASTAVA']
const MAX_NAME_PX = 132

const links = [
  { label: 'GitHub', href: 'https://github.com/akshat-codex', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/akshhatsrivastava', external: true },
  { label: 'Email', href: 'mailto:akshsvt123@gmail.com', external: false },
]

// Measured at 100px with the same per-letter inline-block structure KineticName renders.
// Desktop sets two lines; phones let "AKSHAT KUMAR" wrap, so the widest single word wins.
const MEASURE = ['AKSHAT KUMAR', 'SRIVASTAVA', 'AKSHAT', 'KUMAR']

function useFittedName() {
  const boxRef = useRef(null)
  const measureRef = useRef(null)
  const [size, setSize] = useState(null)

  useLayoutEffect(() => {
    const box = boxRef.current
    const measure = measureRef.current
    if (!box || !measure) return undefined
    const fit = () => {
      const w = box.clientWidth
      const widths = Array.from(measure.children).map((el) => el.getBoundingClientRect().width)
      const lg = window.matchMedia('(min-width: 1024px)').matches
      const widest = lg ? Math.max(widths[0], widths[1]) : Math.max(widths[1], widths[2], widths[3])
      if (!w || !widest) return
      // 0.97 leaves room for the cursor lean (a few px) without touching the edge.
      setSize(Math.min(MAX_NAME_PX, Math.floor((w / widest) * 100 * 0.97 * 10) / 10))
    }
    fit()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null
    ro?.observe(box)
    document.fonts?.ready.then(fit).catch(() => {})
    return () => ro?.disconnect()
  }, [])

  return { boxRef, measureRef, size }
}

/** Mask-rise gated on the intro: plays once the wipe uncovers the hero. */
function Rise({ as: Tag = 'div', show, delay = 0, className = '', children }) {
  const reduce = useReducedMotionPref()
  if (reduce) return <Tag className={className}>{children}</Tag>
  return (
    <Tag className={`overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: '105%' }}
        animate={{ y: show ? '0%' : '105%' }}
        transition={{ duration: 0.8, delay, ease: EASE_QUART }}
      >
        {children}
      </motion.span>
    </Tag>
  )
}

/** Hairline that draws left to right once the intro is done. */
function Line({ show, delay = 0, accent = false, className = '' }) {
  const reduce = useReducedMotionPref()
  const cls = `block h-px w-full origin-left ${accent ? 'bg-signal' : 'bg-rule'} ${className}`
  if (reduce) return <span aria-hidden="true" className={cls} />
  return (
    <motion.span
      aria-hidden="true"
      className={cls}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: show ? 1 : 0 }}
      transition={{ duration: 0.9, delay, ease: EASE_QUART }}
    />
  )
}

/** Fade + small lift, for groups that are not single lines. */
function Lift({ show, delay = 0, className = '', children }) {
  const reduce = useReducedMotionPref()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.7, delay, ease: EASE_QUART }}
    >
      {children}
    </motion.div>
  )
}

const TextLink = ({ href, external, children }) => (
  <a
    href={href}
    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    className="group relative inline-block py-1 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-paper"
  >
    {children}
    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 block h-px bg-rule" />
    <span
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 block h-px origin-right scale-x-0 bg-paper transition-transform duration-500 ease-quart group-hover:origin-left group-hover:scale-x-100"
    />
  </a>
)

/** Live "now" marker: a small orange square breathing slowly. */
function NowMarker() {
  const reduce = useReducedMotionPref()
  return (
    <span className="flex items-center gap-1.5 text-signal">
      <motion.span
        aria-hidden="true"
        className="block h-1.5 w-1.5 bg-signal"
        animate={reduce ? undefined : { opacity: [1, 0.3, 1], scale: [1, 0.75, 1] }}
        transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      Now
    </span>
  )
}

// Fixed heights so the bar reads as data, not noise; one signal sample sweeps across.
const CUE_BARS = [10, 4, 14, 7, 12, 5, 16, 9, 6, 13, 4, 11, 8, 15, 5, 10, 7, 12, 4, 14, 9, 6, 11, 8]

function ScrollCue({ show }) {
  const reduce = useReducedMotionPref()
  return (
    <Lift show={show} delay={1.05}>
      <a
        href="#about"
        className="group flex items-end gap-4 py-2"
        aria-label="Scroll to 01 About"
      >
        <span className="label text-paper">Scroll</span>
        <span aria-hidden="true" className="relative flex h-4 items-end gap-[3px] overflow-hidden">
          {CUE_BARS.map((h, i) => (
            <span key={i} className="block w-px bg-paper/40" style={{ height: h }} />
          ))}
          {reduce ? (
            <span className="absolute bottom-0 left-0 block h-4 w-[3px] bg-signal" />
          ) : (
            <motion.span
              className="absolute bottom-0 left-0 block h-4 w-[3px] bg-signal"
              initial={{ x: 0 }}
              animate={{ x: [0, 90, 90] }}
              transition={{ duration: 2.6, times: [0, 0.8, 1], repeat: Infinity, ease: EASE_QUART }}
            />
          )}
        </span>
        <span className="label num hidden transition-colors duration-300 group-hover:text-paper xs:inline">
          01 About
        </span>
      </a>
    </Lift>
  )
}

// Engineered ring: a technical dial with 72 ticks (every 6th long) that turns slowly behind the figure.
const TICKS = Array.from({ length: 72 }, (_, i) => i)
function Dial({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(242,241,236,0.18)" strokeWidth="0.4" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255,77,0,0.35)" strokeWidth="0.4" strokeDasharray="2 3" />
      {TICKS.map((i) => {
        const long = i % 6 === 0
        const a = (i / 72) * Math.PI * 2
        const r1 = long ? 86 : 90
        return (
          <line
            key={i}
            x1={100 + Math.cos(a) * r1}
            y1={100 + Math.sin(a) * r1}
            x2={100 + Math.cos(a) * 95}
            y2={100 + Math.sin(a) * 95}
            stroke={i === 0 ? '#ff4d00' : 'rgba(242,241,236,0.35)'}
            strokeWidth={long ? 0.6 : 0.3}
          />
        )
      })}
    </svg>
  )
}

function Portrait({ show, progress, calm }) {
  const reduce = useReducedMotionPref()
  const still = reduce || calm
  // Parallax: figure rises a touch faster than the aura as the hero scrolls away (depth).
  const figY = useTransform(progress, [0, 1], ['0%', '-6%'])
  const auraY = useTransform(progress, [0, 1], ['0%', '8%'])
  return (
    <figure className="relative mx-auto w-full">
      <motion.div
        className="relative aspect-square"
        initial={reduce ? false : { opacity: 0, y: 40 }}
        animate={show || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1.1, delay: 0.15, ease: EASE_QUART }}
      >
        {/* Aura: ember light + slow rotating rays, centred behind the head and shoulders */}
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-[-18%_-30%_10%_-30%]" style={still ? undefined : { y: auraY }}>
          <div className="portrait-glow absolute inset-0" />
          <div className={`portrait-rays absolute inset-0 ${still ? '' : 'animate-[spin_40s_linear_infinite]'}`} />
          <Dial
            className={`absolute left-1/2 top-[30%] w-[78%] -translate-x-1/2 -translate-y-1/2 ${still ? '' : 'animate-[spin_90s_linear_infinite]'}`}
          />
        </motion.div>

        {/* The figure itself: full colour, background removed, bottom fades into the page */}
        <motion.div className="portrait-figure absolute inset-0" style={still ? undefined : { y: figY }}>
          <img
            src="/akshat-cutout.webp"
            alt="Portrait of Akshat Kumar Srivastava"
            width="1000"
            height="1000"
            fetchpriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain object-bottom"
          />
          {/* Gloss: a light band that sweeps across the figure only (masked by the cutout) */}
          {!still ? <div aria-hidden="true" className="portrait-sheen absolute inset-0" /> : null}
        </motion.div>
      </motion.div>
    </figure>
  )
}

const Hero = () => {
  const done = useIntroDone()
  const calm = useCalm()
  const { boxRef, measureRef, size } = useFittedName()
  const sectionRef = useRef(null)

  // Cinematic handoff: as the hero leaves, the name drifts down and settles smaller.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const nameOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.15])
  const nameMotion = calm ? undefined : { scale: nameScale, y: nameY, opacity: nameOpacity }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="shell relative flex flex-col pb-6 pt-8 lg:min-h-[min(calc(100svh-3.5rem),64rem)] lg:pb-8 lg:pt-10"
    >
      {/* Off-screen measuring lines for the fitted name. */}
      <div aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 h-0 w-0 overflow-hidden">
        <div ref={measureRef}>
          {MEASURE.map((t) => (
            <span key={t} className="display inline-block whitespace-nowrap text-[100px]">
              {Array.from(t).map((ch, i) => (
                <span key={i} className="inline-block">
                  {ch === ' ' ? ' ' : ch}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="grid-12 flex-1 gap-y-8 lg:grid-rows-[auto_1fr] lg:gap-y-10">
        {/* Name across the full measure on desktop. Font size lives on the wrapper; the h1 inherits it. */}
        <motion.div
          ref={boxRef}
          className="relative z-0 col-span-4 origin-[50%_0%] text-[clamp(2.5rem,13vw,4.5rem)] will-change-transform lg:col-span-12 lg:row-start-1 lg:text-[clamp(3rem,8.4vw,8.25rem)]"
          style={{ ...(size ? { fontSize: `${size}px` } : null), ...nameMotion }}
        >
          <KineticName lines={NAME_LINES} className="display" />
        </motion.div>

        {/* Portrait: centred, standing in front of the name (text-behind-subject) */}
        <div className="col-span-4 mx-auto -mt-6 w-full max-w-[28rem] lg:pointer-events-none lg:absolute lg:bottom-0 lg:left-1/2 lg:z-10 lg:mt-0 lg:w-[min(46vw,44rem)] lg:max-w-none lg:-translate-x-1/2">
          <Portrait show={done} progress={scrollYProgress} calm={calm} />
        </div>

        {/* Right column (desktop): focus + base, beside the figure */}
        <dl className="relative z-20 col-span-4 hidden gap-y-6 lg:col-span-3 lg:col-start-10 lg:row-start-2 lg:grid lg:self-end lg:pb-24 lg:text-right">
          <Lift show={done} delay={0.63}>
            <dt className="label relative pt-3">
              <Line show={done} delay={0.58} className="absolute right-0 top-0" />
              Focus
            </dt>
            <dd className="mt-2 font-semibold leading-snug text-paper">Django · FastAPI · Celery · Redis · PostgreSQL</dd>
          </Lift>
          <Lift show={done} delay={0.71}>
            <dt className="label relative pt-3">
              <Line show={done} delay={0.66} className="absolute right-0 top-0" />
              Base
            </dt>
            <dd className="mt-2 font-semibold leading-snug text-paper">Lucknow, India</dd>
          </Lift>
        </dl>

        {/* Left column: lede, role and actions */}
        <div className="relative z-20 col-span-4 lg:row-start-2 lg:self-end">
          <Rise as="p" show={done} delay={0.35} className="max-w-[54ch] text-[1.0625rem] leading-relaxed text-grey lg:max-w-[34ch] lg:text-lg">
            Python backend developer building production SaaS and AI automation: the APIs, queues,
            PostgreSQL and mail infrastructure behind Polluxa SalesTech and Newton-AI.
          </Rise>

          <dl className="mt-8 grid grid-cols-1 gap-y-5 sm:grid-cols-3 sm:gap-x-[var(--gap)] lg:mt-10 lg:grid-cols-1">
            <Lift show={done} delay={0.55}>
              <dt className="label relative flex items-center justify-between pt-3">
                <Line show={done} delay={0.5} accent className="absolute left-0 top-0" />
                <span>Role</span>
                <NowMarker />
              </dt>
              <dd className="mt-2 font-semibold leading-snug text-paper">
                Python Backend Developer
                <span className="block font-normal text-grey">Gravity Engineering Services</span>
                <span className="num block text-sm font-normal text-grey">
                  <time dateTime="2026-06">Jun 2026</time> – present
                </span>
              </dd>
            </Lift>
            {/* On phones/tablets the focus + base stay in this row; desktop shows them on the right */}
            <Lift show={done} delay={0.63} className="lg:hidden">
              <dt className="label relative pt-3">
                <Line show={done} delay={0.58} className="absolute left-0 top-0" />
                Focus
              </dt>
              <dd className="mt-2 font-semibold leading-snug text-paper">
                Django · FastAPI · Celery · Redis · PostgreSQL
              </dd>
            </Lift>
            <Lift show={done} delay={0.71} className="lg:hidden">
              <dt className="label relative pt-3">
                <Line show={done} delay={0.66} className="absolute left-0 top-0" />
                Base
              </dt>
              <dd className="mt-2 font-semibold leading-snug text-paper">Lucknow, India</dd>
            </Lift>
          </dl>

          <Lift show={done} delay={0.85} className="mt-8 flex flex-col gap-5 xs:flex-row xs:flex-wrap xs:items-center xs:gap-x-8 lg:mt-10">
            <Magnetic strength={0.35} className="self-start">
              <a
                href={CV_HREF}
                download="Akshat_Srivastava_CV.pdf"
                className="group relative inline-flex items-center justify-between gap-6 overflow-hidden bg-signal px-5 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-ink"
              >
                {/* Paper fill wipes up on hover; label stays ink. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 block origin-bottom scale-y-0 bg-paper transition-transform duration-500 ease-quart group-hover:scale-y-100"
                />
                <span className="relative">Download CV</span>
                <span
                  aria-hidden="true"
                  className="relative block h-[2px] w-6 origin-left bg-ink transition-transform duration-500 ease-quart group-hover:scale-x-[1.7]"
                />
              </a>
            </Magnetic>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {links.map((l) => (
                <TextLink key={l.label} href={l.href} external={l.external}>
                  {l.label}
                </TextLink>
              ))}
            </div>
          </Lift>
        </div>
      </div>

      <div className="mt-10 lg:mt-6">
        <ScrollCue show={done} />
      </div>
    </section>
  )
}

export default Hero
