import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { Reveal, Rule, SectionHead } from './ui'
import { EASE_QUART, Magnetic, ProjectCover, useLenis, useReducedMotionPref } from './fx'

// Newton-AI and Polluxa SalesTech live in Experience (02); not repeated here.
// `cover` picks the generative cover pattern (abstract art, not a screenshot).
const projects = [
  {
    title: 'AI Lead Generation & Enrichment',
    category: 'AI Automation',
    period: '2026',
    cover: 0,
    summary:
      'Automated B2B lead discovery pipeline: finds target companies and decision-makers by industry, geography, size and title, then enriches and verifies contacts at scale.',
    bullets: [
      'Company research and decision-maker enrichment',
      'Large-scale dataset processing with company/person relationships',
      'Email verification via syntax, domain/MX checks and external services',
      'Redis caching to avoid repeated verification calls',
    ],
    tech: ['Python', 'Redis', 'Lead Enrichment', 'Data Validation', 'Automation'],
    github: 'https://github.com/akshat-codex/ai-lead-agent',
  },
  {
    title: 'AI-Powered Fake Review Detection',
    category: 'AI / ML',
    period: 'Jun 2026',
    cover: 1,
    summary:
      'NLP + ML platform that authenticates product reviews in real-time using TF-IDF vectorization and Logistic Regression — deployed on cloud for public access.',
    bullets: [
      'High-accuracy classification via TF-IDF + Logistic Regression',
      'Real-time REST API built with Flask',
      'Confidence scoring and bulk analysis mode',
      'Automated analytics reports for decision-making',
    ],
    tech: ['Python', 'Flask', 'Scikit-Learn', 'NLP', 'TF-IDF', 'ML', 'REST API'],
  },
  {
    title: 'Real-Time Visitor Analytics',
    category: 'AWS Serverless',
    period: 'Feb 2026',
    cover: 2,
    summary:
      'Fully serverless analytics pipeline on AWS — Lambda, DynamoDB, API Gateway — with IAM least-privilege controls and CloudWatch monitoring. Zero dedicated servers.',
    bullets: [
      'Event-driven Lambda processing with DynamoDB storage',
      'REST APIs for visitor event ingestion',
      'IAM least-privilege security model',
      'Auto-scaling — handles any load, zero ops overhead',
    ],
    tech: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'CloudWatch', 'IAM', 'Serverless'],
  },
  {
    title: 'NewsXStudy — Full-Stack Platform',
    category: 'Full Stack',
    period: 'Nov 2025',
    cover: 3,
    summary:
      'Full-stack news aggregation and student productivity tool. React frontend, Node/Express backend, MongoDB data layer, real-time News API feeds, and a built-in study timer.',
    bullets: [
      'JWT auth, news bookmarking, category filters',
      'Live News API integration via async React Hooks',
      'Study timer + Pomodoro-style reminders',
      'MongoDB for user data and bookmark storage',
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'News API', 'JWT'],
  },
  {
    title: 'Smart Employee Management',
    category: 'Backend · Java',
    period: 'Apr 2026',
    cover: 4,
    summary:
      'Java-based CRUD system for employee records management. JDBC + MySQL backend with OOP architecture and query-optimized data retrieval for performance at scale.',
    bullets: [
      'Full CRUD via JDBC + MySQL',
      'OOP-driven modular architecture',
      'Optimized SQL queries for bulk reads',
      'Clean separation of data and business layers',
    ],
    tech: ['Java', 'MySQL', 'JDBC', 'OOP', 'SQL'],
  },
].map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0') }))

const COUNT = String(projects.length).padStart(2, '0')

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

/* ---------- shared pieces ---------- */
function ProjectLinks({ project }) {
  if (!project.github && !project.link) return null
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {project.github ? (
        <Magnetic strength={0.3}>
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            data-cursor="view"
            data-cursor-label="Code"
            className="group/btn relative inline-flex items-center gap-3 overflow-hidden border border-paper px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-paper [font-stretch:112%]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 block origin-bottom scale-y-0 bg-signal transition-transform duration-500 ease-quart group-hover/btn:scale-y-100 group-focus-visible/btn:scale-y-100"
            />
            <span className="relative transition-colors duration-300 group-hover/btn:text-ink">Source on GitHub ↗</span>
          </a>
        </Magnetic>
      ) : null}
      {project.link ? (
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          data-cursor="view"
          data-cursor-label="Open"
          className="font-semibold text-paper underline decoration-rule underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-paper"
        >
          Demo ↗
        </a>
      ) : null}
    </div>
  )
}

function StackRows({ project }) {
  return (
    <>
      <ol>
        {project.bullets.map((b, i) => (
          <li key={b} className="grid grid-cols-[2.25rem_1fr] border-t border-rule py-2.5 xl:py-3">
            <span className="label num pt-[3px]">{String(i + 1).padStart(2, '0')}</span>
            <span className="text-paper/90">{b}</span>
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-[2.25rem_1fr] border-t border-rule pt-3">
        <span aria-hidden="true" />
        <p className="text-sm text-grey">
          <span className="label mr-3 text-paper">Built with</span>
          {project.tech.join(' · ')}
        </p>
      </div>
    </>
  )
}

/* ---------- Desktop: index with a cursor-following generative cover ---------- */
const PREVIEW_W = 440
const PREVIEW_H = 300

function FloatingCover({ activeIndex }) {
  const show = activeIndex !== null
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 160, damping: 22, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 160, damping: 22, mass: 0.6 })
  const skew = useMotionValue(0)
  const sSkew = useSpring(skew, { stiffness: 200, damping: 20 })
  const vel = useRef({ x: 0, y: 0 })
  const lastKind = useRef(0)
  if (show) lastKind.current = projects[activeIndex].cover

  useEffect(() => {
    let px = 0
    let py = 0
    const onMove = (e) => {
      x.set(e.clientX - PREVIEW_W / 2)
      y.set(e.clientY - PREVIEW_H / 2)
      const vx = e.clientX - px
      const vy = e.clientY - py
      px = e.clientX
      py = e.clientY
      vel.current = { x: Math.max(-40, Math.min(40, vx)), y: Math.max(-40, Math.min(40, -vy)) }
      skew.set(Math.max(-12, Math.min(12, vx * 0.35)))
    }
    let raf = 0
    const decay = () => {
      raf = requestAnimationFrame(decay)
      vel.current = { x: vel.current.x * 0.9, y: vel.current.y * 0.9 }
      skew.set(skew.get() * 0.9)
    }
    decay()
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [x, y, skew])

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30"
      style={{ x: sx, y: sy, skewX: sSkew, width: PREVIEW_W, height: PREVIEW_H }}
      initial={false}
      animate={{
        opacity: show ? 1 : 0,
        scale: show ? 1 : 0.6,
        clipPath: show ? 'inset(0% 0% 0% 0%)' : 'inset(50% 50% 50% 50%)',
      }}
      transition={{ duration: 0.5, ease: EASE_QUART }}
    >
      <ProjectCover kind={lastKind.current} velocity={vel} className="h-full w-full" />
      <span className="label absolute bottom-2 left-3 text-paper/70">Generative cover</span>
    </motion.div>
  )
}

function IndexRow({ project, index, active, dimmed, onEnter, onOpen }) {
  return (
    <li className="relative">
      <button
        type="button"
        onPointerEnter={() => onEnter(index)}
        onFocus={() => onEnter(index)}
        onClick={(e) => onOpen(index, e.currentTarget)}
        aria-haspopup="dialog"
        data-cursor="view"
        data-cursor-label="Open"
        className="group grid w-full grid-cols-12 items-baseline gap-x-[var(--gap)] border-t border-rule py-7 text-left transition-opacity duration-500 ease-quart xl:py-9"
        style={{ opacity: dimmed ? 0.28 : 1 }}
      >
        <span className={`label num col-span-1 transition-colors duration-300 ${active ? 'text-signal' : ''}`}>
          {project.num}
        </span>
        <motion.span
          layoutId={`title-${project.num}`}
          className="col-span-8 block text-[clamp(2rem,4.6vw,4.75rem)] font-black uppercase leading-[0.9] tracking-[-0.015em] [font-stretch:125%]"
          animate={{ x: active ? 28 : 0 }}
          transition={{ duration: 0.6, ease: EASE_QUART }}
        >
          {project.title}
        </motion.span>
        <span className="label col-span-3 text-right">
          {project.category}
          <br />
          <span className="num text-paper">{project.period}</span>
        </span>
        {/* signal underline sweeps in on hover */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 block h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-700 ease-quart group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </button>
    </li>
  )
}

function ProjectDetail({ project, onClose }) {
  const closeRef = useRef(null)
  const lenis = useLenis()

  useEffect(() => {
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      lenis?.start()
    }
  }, [lenis, onClose])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`detail-${project.num}`}
      className="fixed inset-0 z-[60] overflow-y-auto bg-ink"
      data-lenis-prevent
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={{ clipPath: 'inset(0% 0 0 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.8, ease: EASE_QUART }}
    >
      <div className="shell flex min-h-full flex-col py-8">
        <div className="flex items-center justify-between">
          <p className="label num">
            Project <span className="text-signal">{project.num}</span> / {COUNT}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            data-cursor="view"
            data-cursor-label="Close"
            className="label border border-paper px-4 py-2 text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
          >
            Close · Esc
          </button>
        </div>

        <div className="grid-12 mt-10 flex-1 gap-y-10">
          <div className="col-span-4 lg:col-span-7">
            <motion.h3
              id={`detail-${project.num}`}
              layoutId={`title-${project.num}`}
              className="text-[clamp(2.25rem,6vw,6.5rem)] font-black uppercase leading-[0.88] tracking-[-0.015em] [font-stretch:125%]"
            >
              {project.title}
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE_QUART }}
            >
              <p className="label mt-6">
                {project.category} · <span className="num text-paper">{project.period}</span>
              </p>
              <p className="mt-8 max-w-[56ch] text-lg text-paper/90">{project.summary}</p>
              <div className="mt-8">
                <ProjectLinks project={project} />
              </div>
            </motion.div>
          </div>
          <motion.div
            className="col-span-4 lg:col-span-5"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE_QUART }}
          >
            <div className="relative aspect-[4/3] w-full border border-rule">
              <ProjectCover kind={project.cover} className="h-full w-full" />
              <span className="label absolute bottom-2 left-3 text-paper/70">Generative cover</span>
            </div>
            <div className="mt-8 text-[0.9375rem]">
              <StackRows project={project} />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectIndex() {
  const [hovered, setHovered] = useState(null)
  const [open, setOpen] = useState(null)
  const returnFocus = useRef(null)

  const onOpen = useCallback((i, el) => {
    returnFocus.current = el
    setOpen(i)
  }, [])
  const onClose = useCallback(() => {
    setOpen(null)
    requestAnimationFrame(() => returnFocus.current?.focus())
  }, [])

  return (
    <div className="shell">
      <div className="grid-12 mt-10 items-end gap-y-4">
        <p className="label col-span-6 text-paper">
          Selected projects · <span className="num">Nov 2025 – 2026</span>
        </p>
        <p className="label col-span-6 text-right">Hover to preview · click to open</p>
      </div>
      <ol className="mt-8" onPointerLeave={() => setHovered(null)}>
        {projects.map((p, i) => (
          <IndexRow
            key={p.num}
            project={p}
            index={i}
            active={hovered === i}
            dimmed={hovered !== null && hovered !== i}
            onEnter={setHovered}
            onOpen={onOpen}
          />
        ))}
      </ol>
      <Rule />
      <FloatingCover activeIndex={open === null ? hovered : null} />
      <AnimatePresence>{open !== null ? <ProjectDetail key={open} project={projects[open]} onClose={onClose} /> : null}</AnimatePresence>
    </div>
  )
}

/* ---------- Mobile / reduced motion: vertical list ---------- */
function StackedPanel({ project }) {
  return (
    <li className="relative border-t border-rule py-10">
      <div className="flex items-start justify-between gap-4">
        <Reveal as="span" duration={0.7} className="display num block text-[clamp(5rem,26vw,9rem)] leading-[0.82]">
          <span aria-hidden="true">{project.num}</span>
        </Reveal>
        <p className="label pt-1 text-right">
          {project.category}
          <br />
          <span className="num text-paper">{project.period}</span>
        </p>
      </div>
      <Reveal
        as="h3"
        className="mt-6 text-[clamp(1.75rem,8vw,3.25rem)] font-black uppercase leading-[0.92] tracking-[-0.01em] [font-stretch:115%]"
      >
        <span className="sr-only">Project {project.num}: </span>
        {project.title}
      </Reveal>
      <div className="mt-5 grid gap-y-6 md:grid-cols-2 md:gap-x-8">
        <div>
          <p className="max-w-[60ch] text-paper/90">{project.summary}</p>
          <div className="mt-6">
            <ProjectLinks project={project} />
          </div>
        </div>
        <div>
          <StackRows project={project} />
        </div>
      </div>
    </li>
  )
}

function StackedList() {
  return (
    <div className="shell">
      <div className="grid-12 mt-10 items-end gap-y-4">
        <Reveal as="p" duration={0.7} className="display num col-span-4 text-[clamp(9rem,40vw,18rem)] leading-[0.86]">
          <span aria-hidden="true">{COUNT}</span>
          <span className="sr-only">{projects.length} projects</span>
        </Reveal>
        <div className="col-span-4 pb-2">
          <p className="label text-paper">
            Selected projects · <span className="num">Nov 2025 – 2026</span>
          </p>
          <p className="mt-3 max-w-[48ch] text-grey">
            AI automation, ML, serverless, full-stack and Java backend builds, each traced from outcome to the stack it
            was built with.
          </p>
        </div>
      </div>
      <ol className="mt-12">
        {projects.map((p) => (
          <StackedPanel key={p.num} project={p} />
        ))}
      </ol>
      <Rule />
    </div>
  )
}

const Projects = () => {
  const reduce = useReducedMotionPref()
  const isDesktop = useMediaQuery('(min-width: 1024px) and (pointer: fine)')
  const index = isDesktop && !reduce

  return (
    <section id="projects" className="py-24 lg:py-32">
      <div className="shell">
        <SectionHead index="03" title="Projects" />
      </div>
      {index ? <ProjectIndex /> : <StackedList />}
    </section>
  )
}

export default Projects
