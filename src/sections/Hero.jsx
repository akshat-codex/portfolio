import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import HeroName from './HeroName'
import { FlipWords } from '@/components/vendor/aceternity/flip-words'
import { MagneticButton } from '@/components/vendor/aceternity/magnetic-button'
import ParticlePortrait from '@/components/fx/ParticlePortrait'
import { useIntroDone, useReducedMotionPref } from '@/components/fx'
import { profile, heroLinks, uiStrings } from '@/data/content'

// React Bits LiquidEther pulls a WebGL fluid sim: load it after first paint.
const LiquidEther = lazy(() => import('@/components/vendor/reactbits/LiquidEther'))

const EASE = [0.22, 1, 0.36, 1]
const WORDS = ['REST APIs', 'Celery queues', 'AI SDR agents', 'mail infrastructure']

function useIdle() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const go = () => setReady(true)
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(go, { timeout: 1200 })
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(go, 300)
    return () => clearTimeout(t)
  }, [])
  return ready
}

function Portrait({ play }) {
  const reduce = useReducedMotionPref()
  const [formed, setFormed] = useState(reduce)
  const onDone = useCallback(() => setFormed(true), [])
  return (
    <div className="relative aspect-square w-full">
      <div aria-hidden="true" className="portrait-glow absolute inset-[-12%_-18%_8%_-18%]" />
      <div className="portrait-figure absolute inset-0">
        <img
          src={profile.portrait.src}
          alt={profile.portrait.alt}
          width={profile.portrait.width}
          height={profile.portrait.height}
          fetchpriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain object-bottom transition-opacity duration-700"
          style={{ opacity: formed ? 1 : 0 }}
        />
        {!reduce ? (
          <div className="pointer-events-none absolute inset-0 transition-opacity duration-700" style={{ opacity: formed ? 0 : 1 }}>
            <ParticlePortrait src={profile.portrait.src} play={play} onDone={onDone} />
          </div>
        ) : null}
        {!reduce && formed ? <div aria-hidden="true" className="portrait-sheen absolute inset-0" /> : null}
      </div>
    </div>
  )
}

export default function Hero() {
  const done = useIntroDone()
  const reduce = useReducedMotionPref()
  const idle = useIdle()
  const { scrollY } = useScroll()
  const nameY = useTransform(scrollY, [0, 700], [0, -120])
  const fade = useTransform(scrollY, [0, 600], [1, 0])

  const rise = (delay) => ({
    initial: { opacity: 0, y: 28 },
    animate: done ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    transition: { duration: 0.9, delay, ease: EASE },
  })

  return (
    <section id="hero" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24">
      {/* React Bits · Liquid Ether — fluid that follows the cursor (listens on window) */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {idle && !reduce ? (
          <Suspense fallback={null}>
            <LiquidEther
              colors={['#ff4d00', '#ff9a4d', '#5a1a02']}
              mouseForce={18}
              cursorSize={110}
              resolution={0.45}
              autoDemo
              autoSpeed={0.35}
              autoIntensity={1.8}
              maxDevicePixelRatio={1.5}
            />
          </Suspense>
        ) : null}
        {/* legibility: darken toward the text, keep colour near the portrait */}
        <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_70%_55%,transparent,rgba(11,11,12,0.75)_70%,#0b0b0c)]" />
      </div>

      <div className="shell relative flex flex-1 flex-col">
        <motion.p {...rise(0.05)} className="label flex flex-wrap items-center gap-x-4 gap-y-1 text-paper/80">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            {uiStrings.nowMarker}: {profile.role}
          </span>
          <span className="text-paper/50">{profile.company}</span>
          <span className="text-paper/50">{profile.location}</span>
        </motion.p>

        {/* Name: Syne ExtraBold, Skiper #31 fan-in/fan-out + per-letter Text Roll on hover */}
        <motion.div style={reduce ? undefined : { y: nameY }} className="relative z-10 mt-8">
          <h1 className="sr-only">{profile.name}</h1>
          <HeroName lines={profile.nameLines} play={done} />
        </motion.div>

        <div className="relative mt-auto grid items-end gap-10 pb-10 md:grid-cols-12">
          <motion.div style={reduce ? undefined : { opacity: fade }} className="relative z-10 md:col-span-6 lg:col-span-5">
            {/* div, not p: FlipWords renders a block-level motion.div */}
            <motion.div {...rise(0.45)} className="text-[clamp(1.35rem,2.4vw,2rem)] font-semibold leading-tight text-paper">
              I build
              <FlipWords words={WORDS} className="!px-1.5 text-signal" />
              <br />
              that ship to production.
            </motion.div>
            <motion.p {...rise(0.55)} className="mt-5 max-w-[46ch] text-paper/70">
              {profile.lede}
            </motion.p>
            <motion.div {...rise(0.65)} className="mt-8 flex flex-wrap items-center gap-6">
              {/* Aceternity · Magnetic Button */}
              <MagneticButton strength={0.4} maxDistance={40}>
                <a
                  href={profile.cvHref}
                  download={profile.cvDownloadName}
                  className="cursor-target group inline-flex items-center gap-3 rounded-full bg-signal px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-ink shadow-[0_18px_50px_-12px_rgba(255,77,0,0.75)]"
                >
                  {profile.cvLabel}
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
                    ↓
                  </span>
                </a>
              </MagneticButton>
              <ul className="flex flex-wrap gap-5">
                {heroLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.external ? { target: '_blank', rel: 'noreferrer' } : null)}
                      className="cursor-target label border-b border-rule pb-1 text-paper transition-colors hover:border-signal hover:text-signal"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative mx-auto w-[min(88vw,26rem)] md:col-span-6 md:w-full lg:col-span-5 lg:col-start-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: done ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <Portrait play={done} />
          </motion.div>
        </div>

        <a
          href={uiStrings.scrollCue.href}
          aria-label={uiStrings.scrollCue.ariaLabel}
          className="cursor-target label absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-paper/60 lg:flex"
        >
          {uiStrings.scrollCue.label}
          <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-rule">
            <span className="absolute inset-x-0 top-0 block h-4 animate-[scrollcue_1.6s_cubic-bezier(0.22,1,0.36,1)_infinite] bg-signal" />
          </span>
        </a>
      </div>
    </section>
  )
}
