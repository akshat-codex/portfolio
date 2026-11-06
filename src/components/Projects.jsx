import { useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaArrowLeft, FaArrowRight, FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

const projects = [
  {
    title: 'Newton-AI — LinkedIn SDR Automation',
    category: 'AI Automation · Work',
    period: '2026 — Present',
    color: '#F59E0B',
    accentRgb: '245,158,11',
    icon: '💬',
    summary: 'FastAPI/Celery-based AI system that engages LinkedIn leads in automated SDR conversations, qualifies prospects and hands warm leads to sales — integrated with the Polluxa SalesTech platform.',
    bullets: [
      'Interest detection, intent classification and lead qualification',
      'Lifecycle states: interested, not interested, job seeker, ghosted, handed-off',
      'Human handoff workflows for leads needing sales intervention',
      'Reliable async FastAPI + Celery processing and inbound webhooks',
    ],
    tech: ['Python', 'FastAPI', 'Celery', 'Redis', 'Conversational AI', 'Webhooks'],
    link: 'https://grateful-joy-0dad9947f5.media.strapiapp.com/AI_Powered_Linked_In_Outreach_Automation_1271cf68cd.mp4',
  },
  {
    title: 'Polluxa SalesTech — Production SaaS',
    category: 'Backend · Work',
    period: '2026 — Present',
    color: '#EC4899',
    accentRgb: '236,72,153',
    icon: '📬',
    summary: 'Backend APIs and business logic for a production sales-outreach SaaS — email, outreach, leads, pipeline, senders, inbox, warm-up and deliverability — built on Django REST Framework.',
    bullets: [
      'Celery + Redis async workflows for automated email operations',
      'Email warm-up and deliverability analysis (before/after comparison)',
      'Debugged production flows across API → DB → Celery → Redis → SMTP/IMAP',
      'PostgreSQL data modelling and investigation',
    ],
    tech: ['Python', 'Django', 'DRF', 'PostgreSQL', 'Celery', 'Redis', 'Docker'],
  },
  {
    title: 'AI Lead Generation & Enrichment',
    category: 'AI Automation',
    period: '2026',
    color: '#22C55E',
    accentRgb: '34,197,94',
    icon: '🎯',
    summary: 'Automated B2B lead discovery pipeline: finds target companies and decision-makers by industry, geography, size and title, then enriches and verifies contacts at scale.',
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
    color: '#4F46E5',
    accentRgb: '79,70,229',
    icon: '🤖',
    summary: 'NLP + ML platform that authenticates product reviews in real-time using TF-IDF vectorization and Logistic Regression — deployed on cloud for public access.',
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
    color: '#06B6D4',
    accentRgb: '6,182,212',
    icon: '☁️',
    summary: 'Fully serverless analytics pipeline on AWS — Lambda, DynamoDB, API Gateway — with IAM least-privilege controls and CloudWatch monitoring. Zero dedicated servers.',
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
    color: '#8B5CF6',
    accentRgb: '139,92,246',
    icon: '📰',
    summary: 'Full-stack news aggregation and student productivity tool. React frontend, Node/Express backend, MongoDB data layer, real-time News API feeds, and a built-in study timer.',
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
    color: '#10B981',
    accentRgb: '16,185,129',
    icon: '👥',
    summary: 'Java-based CRUD system for employee records management. JDBC + MySQL backend with OOP architecture and query-optimized data retrieval for performance at scale.',
    bullets: [
      'Full CRUD via JDBC + MySQL',
      'OOP-driven modular architecture',
      'Optimized SQL queries for bulk reads',
      'Clean separation of data and business layers',
    ],
    tech: ['Java', 'MySQL', 'JDBC', 'OOP', 'SQL'],
  },
].map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0') }))

const CardInner = ({ project, isActive, mousePos, onMouseMove, onMouseLeave }) => {
  const shine = isActive
    ? {
        background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.07) 0%, transparent 55%)`,
      }
    : {}

  return (
    <div
      className="rounded-[20px] p-6 lg:p-8 h-full flex flex-col"
      style={{ background: '#0C0C1A', minHeight: '420px' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Shine overlay */}
      <div className="absolute inset-0 rounded-[20px] pointer-events-none transition-all duration-200" style={shine} />

      {/* Header row */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{project.icon}</span>
          <div>
            <span className="label" style={{ color: project.color }}>{project.category}</span>
            <div className="label-muted mt-0.5">{project.num} · {project.period}</div>
          </div>
        </div>
        <div className="flex gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              title="Source code"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all duration-200 glass-sm"
              style={{ color: '#475569' }}
              onClick={e => e.stopPropagation()}
              onMouseEnter={e => { e.currentTarget.style.color = '#E2E8F0' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#475569' }}
            >
              <FaGithub />
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              title="Demo"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all duration-200"
              style={{ background: `${project.color}18`, border: `1px solid ${project.color}30`, color: project.color }}
              onClick={e => e.stopPropagation()}
            >
              <FaExternalLinkAlt />
            </a>
          )}
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-white font-semibold mb-3 leading-snug relative z-10"
        style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem' }}
      >
        {project.title}
      </h3>

      {/* Summary */}
      <p className="text-sm leading-relaxed mb-5 relative z-10" style={{ color: '#64748B', fontSize: '0.82rem' }}>
        {project.summary}
      </p>

      {/* Bullets */}
      <ul className="space-y-1.5 mb-6 flex-1 relative z-10">
        {project.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#475569' }}>
            <span className="mt-0.5 shrink-0" style={{ color: project.color, opacity: 0.7 }}>▸</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5 relative z-10">
        {project.tech.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 rounded font-mono"
            style={{
              background: `rgba(${project.accentRgb},0.08)`,
              color: project.color,
              border: `1px solid rgba(${project.accentRgb},0.18)`,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px rounded-b-[20px]"
        style={{ background: `linear-gradient(90deg, transparent, ${project.color}66, transparent)` }}
      />
    </div>
  )
}

const Projects = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [active, setActive] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  const total = projects.length

  const normalizeOffset = (i) => {
    let o = i - active
    if (o > total / 2) o -= total
    if (o < -total / 2) o += total
    return o
  }

  const go = useCallback((dir) => {
    setActive((a) => (a + dir + total) % total)
  }, [total])

  const getStyle = (offset) => {
    const abs = Math.abs(offset)
    if (abs > 1.5) return { opacity: 0, pointerEvents: 'none', zIndex: 0 }
    return {
      transform: `translateX(${offset * 72}%) scale(${1 - abs * 0.14}) rotateY(${-offset * 20}deg)`,
      opacity: abs === 0 ? 1 : 0.35,
      zIndex: abs === 0 ? 10 : 2,
      filter: abs === 0 ? 'none' : 'blur(1.5px)',
      pointerEvents: abs === 0 ? 'auto' : 'none',
    }
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <section id="projects" className="relative py-28 overflow-hidden">
      <span className="ghost-num" style={{ top: '-10px', left: '-10px' }}>03</span>

      <div className="max-w-7xl mx-auto px-6 lg:px-20" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14"
        >
          <div>
            <p className="label mb-3" style={{ color: '#4F46E5' }}>Selected Work</p>
            <h2 className="heading-syne text-white">
              What I've <span className="grad-indigo">shipped</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => go(-1)}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 glass-sm hover:-translate-x-0.5"
              style={{ color: '#475569' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#E2E8F0'; e.currentTarget.style.borderColor = 'rgba(79,70,229,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '' }}
            >
              <FaArrowLeft className="text-xs" />
            </button>
            <div className="flex gap-1.5">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="rounded-full transition-all duration-400"
                  style={{
                    width: i === active ? '20px' : '6px',
                    height: '6px',
                    background: i === active ? '#4F46E5' : 'rgba(255,255,255,0.15)',
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 glass-sm hover:translate-x-0.5"
              style={{ color: '#475569' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#E2E8F0'; e.currentTarget.style.borderColor = 'rgba(79,70,229,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '' }}
            >
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="carousel-scene">
            <div className="carousel-track" style={{ perspective: '1400px' }}>
              {projects.map((project, i) => {
                const offset = normalizeOffset(i)
                const isActive = offset === 0
                const style = getStyle(offset)

                return (
                  <div
                    key={project.num}
                    className="carousel-card"
                    style={style}
                    onClick={() => !isActive && setActive(i)}
                  >
                    {/* Holographic ring on active card */}
                    {isActive ? (
                      <div className="holo-ring relative">
                        <CardInner
                          project={project}
                          isActive
                          mousePos={mousePos}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={() => setMousePos({ x: 0.5, y: 0.5 })}
                        />
                      </div>
                    ) : (
                      <div
                        className="relative rounded-[20px]"
                        style={{ border: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <CardInner
                          project={project}
                          isActive={false}
                          mousePos={{ x: 0.5, y: 0.5 }}
                          onMouseMove={() => {}}
                          onMouseLeave={() => {}}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Project title ticker below carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-2 mt-10 flex-wrap"
        >
          {projects.map((p, i) => (
            <button
              key={p.num}
              onClick={() => setActive(i)}
              className="px-4 py-2 rounded-lg text-xs font-mono transition-all duration-300"
              style={{
                background: i === active ? `rgba(${p.accentRgb},0.12)` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${i === active ? `rgba(${p.accentRgb},0.3)` : 'rgba(255,255,255,0.06)'}`,
                color: i === active ? p.color : '#475569',
              }}
            >
              {p.num} {p.title.split(' ').slice(0, 3).join(' ')}…
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
