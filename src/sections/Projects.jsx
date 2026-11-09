import { Suspense, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { Carousel_001 } from '@/components/vendor/skiper/skiper47'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { ProjectCover, useReducedMotionPref } from '@/components/fx'
import SectionTitle from './SectionTitle'
import { projects, uiStrings } from '@/data/content'

// Static art per cover kind: shown on inactive slides (only the centred slide runs WebGL).
const ART = [
  'radial-gradient(circle at 30% 40%, rgba(255,77,0,0.55), transparent 45%), radial-gradient(circle at 75% 65%, rgba(255,154,77,0.35), transparent 40%)',
  'repeating-linear-gradient(0deg, rgba(242,241,236,0.08) 0 2px, transparent 2px 22px), linear-gradient(120deg, rgba(255,77,0,0.35), transparent 60%)',
  'linear-gradient(to top, rgba(255,77,0,0.5), transparent 55%), repeating-linear-gradient(90deg, rgba(242,241,236,0.08) 0 10px, transparent 10px 26px)',
  'repeating-linear-gradient(90deg, rgba(242,241,236,0.07) 0 30%, transparent 30% 34%), radial-gradient(circle at 70% 20%, rgba(255,77,0,0.45), transparent 50%)',
  'repeating-linear-gradient(0deg, rgba(242,241,236,0.06) 0 1px, transparent 1px 34px), repeating-linear-gradient(90deg, rgba(242,241,236,0.06) 0 1px, transparent 1px 60px), radial-gradient(circle at 40% 70%, rgba(255,77,0,0.4), transparent 50%)',
]

function Cover({ project, live }) {
  return (
    <div className="absolute inset-0 bg-ink" style={{ backgroundImage: ART[project.cover] }}>
      {live ? (
        <Suspense fallback={null}>
          <ProjectCover kind={project.cover} className="absolute inset-0 h-full w-full" />
        </Suspense>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
    </div>
  )
}

function Slide({ project, active, id, onOpen }) {
  return (
    <motion.button
      type="button"
      layoutId={`card-${project.num}-${id}`}
      onClick={() => active && onOpen(project)}
      tabIndex={active ? 0 : -1}
      aria-label={`Open project ${project.num}: ${project.title}`}
      className={`cursor-target group relative block h-full w-full overflow-hidden rounded-[1.75rem] border text-left transition-colors duration-500 ${
        active ? 'border-signal/60' : 'border-rule'
      }`}
    >
      <motion.div layoutId={`cover-${project.num}-${id}`} className="absolute inset-0">
        <Cover project={project} live={active} />
      </motion.div>
      <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between">
          <span className="display num text-6xl text-paper/90 md:text-7xl">{project.num}</span>
          <span className="label rounded-full border border-rule bg-ink/50 px-3 py-1 text-paper/80 backdrop-blur">
            {project.category}
          </span>
        </div>
        <div>
          <p className="label num">{project.period}</p>
          <motion.h3
            layoutId={`title-${project.num}-${id}`}
            className="mt-2 text-2xl font-black uppercase leading-[0.95] tracking-tight text-paper md:text-3xl"
          >
            {project.title}
          </motion.h3>
          <span
            className={`label mt-4 inline-flex items-center gap-2 text-signal transition-opacity duration-500 ${
              active ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Open case <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </motion.button>
  )
}

function ProjectModal({ project, id, onClose }) {
  const ref = useRef(null)
  useOutsideClick(ref, onClose)
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    ref.current?.querySelector('button')?.focus()
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-0 sm:p-6">
      <motion.div
        layoutId={`card-${project.num}-${id}`}
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-${project.num}`}
        data-lenis-prevent
        className="relative flex h-full w-full max-w-3xl flex-col overflow-y-auto border border-rule bg-[#111012] sm:h-auto sm:max-h-[90vh] sm:rounded-[1.75rem]"
      >
        <motion.div layoutId={`cover-${project.num}-${id}`} className="relative h-56 shrink-0 md:h-72">
          <Cover project={project} live />
        </motion.div>
        <button
          type="button"
          onClick={onClose}
          className="cursor-target label absolute right-4 top-4 z-10 rounded-full border border-paper/40 bg-ink/60 px-4 py-2 text-paper backdrop-blur transition-colors hover:bg-paper hover:text-ink"
        >
          {uiStrings.projectClose}
        </button>
        <div className="p-6 md:p-10">
          <p className="label flex flex-wrap gap-x-4">
            <span className="num text-signal">{project.num}</span>
            <span>{project.category}</span>
            <span className="num">{project.period}</span>
          </p>
          <motion.h3
            id={`project-${project.num}`}
            layoutId={`title-${project.num}-${id}`}
            className="mt-3 text-3xl font-black uppercase leading-[0.95] tracking-tight text-paper md:text-5xl"
          >
            {project.title}
          </motion.h3>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.15 }}>
            <p className="mt-6 text-lg text-paper/80">{project.summary}</p>
            <ol className="mt-6 divide-y divide-rule border-y border-rule">
              {project.bullets.map((b, i) => (
                <li key={b} className="grid grid-cols-[2.5rem_1fr] py-3 text-paper/85">
                  <span className="label num pt-1 text-signal">{String(i + 1).padStart(2, '0')}</span>
                  {b}
                </li>
              ))}
            </ol>
            <p className="label mt-6 text-paper">{uiStrings.builtWith}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li key={t} className="rounded-full border border-rule px-3 py-1 text-xs text-paper/80">
                  {t}
                </li>
              ))}
            </ul>
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="cursor-target mt-8 inline-flex rounded-full bg-signal px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-ink"
              >
                {projects.githubLabel}
              </a>
            ) : null}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Projects() {
  const id = useId()
  const reduce = useReducedMotionPref()
  const [open, setOpen] = useState(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const swiperRef = useRef(null)
  const pinRef = useRef(null)
  const n = projects.items.length
  const active = projects.items[activeIdx]

  // Scroll drives the coverflow: the stage pins and each ~70vh of scroll advances one card.
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const s = swiperRef.current
    if (!s || reduce) return
    const idx = Math.min(n - 1, Math.max(0, Math.round(p * (n - 1))))
    if (s.activeIndex !== idx) s.slideTo(idx, 700)
  })
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="projects" className="relative py-28 lg:py-40">
      <div className="shell">
        <SectionTitle index={projects.index} title={projects.title} kicker={projects.label} />
        <p className="mt-8 max-w-[52ch] text-lg text-paper/70">{projects.intro}</p>
      </div>

      {/* pinned stage: tall wrapper + sticky viewport */}
      <div ref={pinRef} className="relative" style={{ height: reduce ? 'auto' : `${100 + (n - 1) * 70}vh` }}>
        <div className={reduce ? 'pt-14' : 'sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden'}>
          <div className="shell flex items-baseline justify-between gap-6">
            <p className="label" aria-live="polite">
              <span className="num text-signal">{active.num}</span> / {String(n).padStart(2, '0')} · {active.title}
            </p>
            <p className="label hidden text-paper/50 md:block">Scroll · drag · ← → · click the centre card</p>
          </div>

          {/* Skiper UI #47 · coverflow; cards rise in from below when the stage arrives */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 140, rotateX: 28, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1200 }}
          >
            <Carousel_001
              items={projects.items}
              showPagination
              loop={false}
              spaceBetween={28}
              onSwiper={(s) => (swiperRef.current = s)}
              onActiveChange={setActiveIdx}
              slideClassName="!h-[min(58vh,460px)]"
              renderSlide={(p, i, isActive) => <Slide project={p} active={isActive} id={id} onOpen={setOpen} />}
            />
          </motion.div>

          {/* scroll progress through the projects */}
          {!reduce ? (
            <div className="shell mt-2">
              <div className="h-px w-full bg-rule">
                <motion.div className="h-px origin-left bg-signal" style={{ scaleX: bar }} />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Aceternity · Expandable Card pattern: the card morphs into a detail sheet */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-ink/80 backdrop-blur-sm"
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {open ? <ProjectModal key={open.num} project={open} id={id} onClose={() => setOpen(null)} /> : null}
      </AnimatePresence>
    </section>
  )
}
