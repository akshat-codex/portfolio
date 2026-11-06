import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight } from 'react-icons/fa'
import { HiDownload } from 'react-icons/hi'
import { Link } from 'react-scroll'

const stats = [
  { val: '9+',   key: 'CGPA'        },
  { val: '4',    key: 'PROJECTS'    },
  { val: '25TH', key: 'UNIV. RANK'  },
  { val: '3',    key: 'AWS CERTS'   },
]

/* ── Photo Card ─────────────────────────────────────────── */
const PhotoCard = () => (
  <div className="relative flex justify-center items-center animate-float" style={{ zIndex: 1 }}>

    {/* Outer ambient glow */}
    <div style={{
      position: 'absolute',
      width: '340px',
      height: '420px',
      borderRadius: '30px',
      background: 'radial-gradient(ellipse at 50% 40%, rgba(79,70,229,0.35) 0%, rgba(6,182,212,0.12) 50%, transparent 70%)',
      filter: 'blur(28px)',
      zIndex: 0,
    }} />

    {/* Holo rotating border */}
    <div className="holo-ring" style={{ borderRadius: '26px', position: 'relative', zIndex: 1 }}>
      <div style={{
        width: '272px',
        height: '358px',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        background: '#0C0C1A',
      }}>
        <img
          src="/akshat.jpg"
          alt="Akshat Kumar Srivastava"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
          }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
        {/* Gradient overlay at bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '20px 16px 14px',
          background: 'linear-gradient(transparent, rgba(6,6,16,0.97))',
        }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.55rem', color: '#4F46E5', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '3px' }}>
            Python / Backend Dev
          </p>
          <p style={{ color: '#06B6D4', fontSize: '0.72rem', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
            @ Gravity Engineering Services
          </p>
        </div>

        {/* Scanline shimmer */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(79,70,229,0.015) 2px, rgba(79,70,229,0.015) 4px)',
          pointerEvents: 'none',
        }} />
      </div>
    </div>

    {/* Corner HUD brackets */}
    {[
      { top: '-8px', left: '-8px', borderTop: '2px solid rgba(79,70,229,0.7)', borderLeft: '2px solid rgba(79,70,229,0.7)' },
      { top: '-8px', right: '-8px', borderTop: '2px solid rgba(6,182,212,0.7)', borderRight: '2px solid rgba(6,182,212,0.7)' },
      { bottom: '-8px', left: '-8px', borderBottom: '2px solid rgba(6,182,212,0.7)', borderLeft: '2px solid rgba(6,182,212,0.7)' },
      { bottom: '-8px', right: '-8px', borderBottom: '2px solid rgba(79,70,229,0.7)', borderRight: '2px solid rgba(79,70,229,0.7)' },
    ].map((s, i) => (
      <div key={i} style={{ position: 'absolute', width: '18px', height: '18px', ...s, zIndex: 2 }} />
    ))}

    {/* Status badge */}
    <div style={{
      position: 'absolute',
      bottom: '-20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(6,6,16,0.92)',
      border: '1px solid rgba(79,70,229,0.35)',
      borderRadius: '20px',
      padding: '5px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
      backdropFilter: 'blur(16px)',
      whiteSpace: 'nowrap',
      zIndex: 2,
    }}>
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981', flexShrink: 0 }} className="animate-pulse" />
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.58rem', letterSpacing: '0.12em', color: '#94A3B8', textTransform: 'uppercase' }}>
        Available for Hire
      </span>
    </div>

    {/* Floating ping dots */}
    {[
      { top: '18%', left: '-22px', color: '#4F46E5', delay: '0s' },
      { top: '55%', right: '-20px', color: '#06B6D4', delay: '1.2s' },
      { top: '80%', left: '-16px', color: '#8B5CF6', delay: '2.4s' },
    ].map((d, i) => (
      <div key={i} style={{ position: 'absolute', ...d, zIndex: 0 }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color, boxShadow: `0 0 10px ${d.color}`, animation: `pulse 2s ${d.delay} infinite` }} />
      </div>
    ))}
  </div>
)

/* ── Hero ────────────────────────────────────────────────── */
const Hero = () => {
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  }
  const up = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center px-6 lg:px-20 pt-24 pb-16 overflow-hidden">

      {/* HUD corner brackets */}
      <div className="absolute top-20 left-6 lg:left-20 w-8 h-8 pointer-events-none"
        style={{ borderTop: '1px solid rgba(79,70,229,0.4)', borderLeft: '1px solid rgba(79,70,229,0.4)' }} />
      <div className="absolute bottom-20 right-6 lg:right-20 w-8 h-8 pointer-events-none"
        style={{ borderBottom: '1px solid rgba(79,70,229,0.4)', borderRight: '1px solid rgba(79,70,229,0.4)' }} />

      {/* HUD coordinates */}
      <div className="absolute top-20 right-6 lg:right-20 text-right pointer-events-none hidden lg:block">
        <p className="label-muted">26.8467° N</p>
        <p className="label-muted">80.9462° E</p>
        <p className="label-muted" style={{ color: '#4F46E555' }}>LKO-IND</p>
      </div>

      {/* Two-column grid */}
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

        {/* ── LEFT: Text content ── */}
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* Status pills */}
          <motion.div variants={up} className="flex flex-wrap items-center gap-3 mb-7">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md glass-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="label-muted" style={{ color: '#94A3B8' }}>Backend Developer @ Gravity</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md glass-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="label-muted" style={{ color: '#94A3B8' }}>Open to Collaborations</span>
            </div>
          </motion.div>

          {/* Name */}
          <motion.div variants={up} className="mb-2">
            <h1 className="display-name">
              AKSHAT KUMAR
              <br />
              SRIVASTAVA
              <span className="cursor-blink" style={{ color: '#4F46E5', marginLeft: '3px' }}>_</span>
            </h1>
          </motion.div>

          {/* Gradient rule */}
          <motion.div variants={up} className="mb-6">
            <div style={{ height: '1px', maxWidth: '460px', background: 'linear-gradient(90deg, rgba(79,70,229,0.7), rgba(6,182,212,0.4), transparent)' }} />
          </motion.div>

          {/* Terminal lines */}
          <motion.div variants={up} className="mb-7 space-y-1.5">
            {[
              { num: '01', text: 'Python / Backend Developer @ Gravity Engineering Services', accent: false },
              { num: '02', text: 'B.Tech Computer Science · BBDU · Class of 2026', accent: false },
              { num: '03', text: 'AWS · React · Node.js · Java · Machine Learning · REST APIs', accent: true },
            ].map((line) => (
              <div key={line.num} className="flex items-start gap-3">
                <span className="label-muted shrink-0 mt-px">{line.num}</span>
                <span className="text-sm font-mono" style={{ color: line.accent ? '#94A3B8' : '#64748B', letterSpacing: '0.01em' }}>
                  {line.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* TypeAnimation */}
          <motion.div variants={up} className="flex items-center gap-2 mb-8 text-sm font-mono" style={{ color: '#4F46E5' }}>
            <span style={{ opacity: 0.5 }}>&gt;&gt;</span>
            <TypeAnimation
              sequence={[
                'currently: python_backend_dev()',
                2000,
                'building: scalable_apis()',
                2000,
                'deploying: aws_serverless()',
                2000,
                'exploring: ai_ml_solutions()',
                2000,
              ]}
              repeat={Infinity}
              style={{ color: '#A5B4FC' }}
            />
          </motion.div>

          {/* CTA */}
          <motion.div variants={up} className="flex flex-wrap gap-3 mb-12">
            <Link to="projects" smooth duration={800}>
              <button className="btn-solid">View Projects <FaArrowRight className="text-xs" /></button>
            </Link>
            <a href="/Akshat_Srivastava_CV.pdf" download="Akshat_Srivastava_CV.pdf" className="btn-ghost">
              <HiDownload className="text-sm" /> Download CV
            </a>
            <div className="flex items-center gap-2 ml-1">
              {[
                { icon: <FaGithub />, href: 'https://github.com/akshat-codex', label: 'GitHub' },
                { icon: <FaLinkedin />, href: 'https://linkedin.com/in/akshhatsrivastava', label: 'LinkedIn' },
                { icon: <FaEnvelope />, href: 'mailto:akshsvt123@gmail.com', label: 'Email' },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg glass-sm text-sm transition-all duration-300 hover:-translate-y-0.5"
                  style={{ color: '#475569' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#A5B4FC'; e.currentTarget.style.borderColor = 'rgba(79,70,229,0.3)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '' }}
                >{s.icon}</a>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={up}>
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', marginBottom: '1.4rem' }} />
            <div className="flex flex-wrap gap-8 lg:gap-12">
              {stats.map((s) => (
                <div key={s.key}>
                  <p style={{
                    fontFamily: 'Orbitron, Syne, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(1.4rem, 2.5vw, 2.1rem)',
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, #E2E8F0 0%, #64748B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{s.val}</p>
                  <p className="label-muted mt-1">{s.key}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Photo ── */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex justify-center items-center"
          style={{ paddingTop: '30px', paddingBottom: '30px' }}
        >
          <PhotoCard />
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, rgba(79,70,229,0.5), transparent)' }} />
        <span className="label-muted">SCROLL</span>
      </motion.div>
    </section>
  )
}

export default Hero
