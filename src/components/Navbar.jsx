import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { EASE_QUART } from './ui'
import { Magnetic, useLenis, useReducedMotionPref } from './fx'

const CV_HREF = '/Akshat_Srivastava_CV.pdf'

// core: shown in the bar from lg; the rest join at xl where all eight fit.
const sections = [
  { id: 'about', index: '01', label: 'About', core: true },
  { id: 'experience', index: '02', label: 'Experience', core: true },
  { id: 'projects', index: '03', label: 'Projects', core: true },
  { id: 'skills', index: '04', label: 'Skills', core: false },
  { id: 'education', index: '05', label: 'Education', core: false },
  { id: 'certifications', index: '06', label: 'Certifications', core: false },
  { id: 'achievements', index: '07', label: 'Achievements', core: false },
  { id: 'contact', index: '08', label: 'Contact', core: true },
]

const FOCUSABLE = 'a[href], button:not([disabled])'

function useActiveSection() {
  const [active, setActive] = useState(null)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const ids = ['hero', ...sections.map((s) => s.id)]
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id === 'hero' ? null : e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

/** Hide the bar while reading downward, bring it back on any upward scroll. */
function useBarState() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const last = useRef(0)
  useMotionValueEvent(scrollY, 'change', (y) => {
    const dy = y - last.current
    last.current = y
    setScrolled(y > 12)
    if (y < 160) setHidden(false)
    else if (dy > 4) setHidden(true)
    else if (dy < -4) setHidden(false)
  })
  return { hidden, scrolled }
}

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotionPref()
  const lenis = useLenis()
  const active = useActiveSection()
  const { hidden, scrolled } = useBarState()
  const headerRef = useRef(null)
  const buttonRef = useRef(null)
  const firstLinkRef = useRef(null)
  const [barFocus, setBarFocus] = useState(false)

  const unlock = useCallback(() => {
    document.body.style.overflow = ''
    lenis?.start()
  }, [lenis])

  const close = useCallback(
    (returnFocus = true) => {
      unlock()
      setOpen(false)
      if (returnFocus) buttonRef.current?.focus()
    },
    [unlock],
  )

  // Body scroll lock (and Lenis stop), Escape to close, focus kept inside the open menu.
  useEffect(() => {
    if (!open) return undefined
    document.body.style.overflow = 'hidden'
    lenis?.stop()
    const raf = requestAnimationFrame(() => firstLinkRef.current?.focus())

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab' || !headerRef.current) return
      const items = Array.from(headerRef.current.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      )
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    const onResize = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) close(false)
    }

    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      unlock()
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open, close, unlock, lenis])

  // Restore scroll synchronously so the anchor glide (or native jump) is not blocked.
  const onMenuLink = () => close(false)

  // Never hide while the menu is open or while keyboard focus is in the bar.
  const showBar = open || barFocus || !hidden

  return (
    <header ref={headerRef} className="pointer-events-none sticky top-0 z-50 h-14">
      <motion.div
        className={`pointer-events-auto relative h-14 border-b transition-[background-color,border-color] duration-500 ease-quart ${
          scrolled || open ? 'border-rule bg-ink' : 'border-transparent bg-ink/0'
        }`}
        initial={false}
        animate={{ y: showBar ? '0%' : '-101%' }}
        transition={{ duration: reduce ? 0 : 0.55, ease: EASE_QUART }}
        onFocus={() => setBarFocus(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setBarFocus(false)
        }}
      >
        <nav aria-label="Primary" className="shell flex h-full items-center justify-between gap-6">
          <a
            href="#hero"
            className="group flex items-baseline gap-2 leading-none text-paper"
            aria-label="Akshat Kumar Srivastava, back to top"
            onClick={() => open && close(false)}
          >
            <span className="display text-[1.375rem]">AKS</span>
            <span
              aria-hidden="true"
              className="block h-1.5 w-1.5 bg-signal transition-transform duration-500 ease-quart group-hover:translate-x-1"
            />
          </a>

          <ul className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-7">
            {sections.map((s) => {
              const isActive = active === s.id
              return (
                <li key={s.id} className={s.core ? '' : 'hidden xl:block'}>
                  <a
                    href={`#${s.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    className={`group relative flex items-baseline gap-1.5 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 ${
                      isActive ? 'text-paper' : 'text-grey hover:text-paper'
                    }`}
                  >
                    <span className={`num transition-colors duration-300 ${isActive ? 'text-signal' : 'text-grey'}`}>
                      {s.index}
                    </span>
                    <span className="relative overflow-hidden">
                      {/* Label rolls up on hover: a second copy slides in from below. */}
                      <span className="block transition-transform duration-500 ease-quart motion-safe:group-hover:-translate-y-full">
                        {s.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-full block text-paper transition-transform duration-500 ease-quart motion-safe:group-hover:-translate-y-full"
                      >
                        {s.label}
                      </span>
                    </span>
                    {isActive ? (
                      <motion.span
                        layoutId="nav-tick"
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-px block h-[2px] bg-signal"
                        transition={{ duration: reduce ? 0 : 0.5, ease: EASE_QUART }}
                      />
                    ) : null}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-5">
            <Magnetic strength={0.25}>
              <a
                href={CV_HREF}
                download="Akshat_Srivastava_CV.pdf"
                className="group relative inline-block whitespace-nowrap py-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-signal"
              >
                Download CV
                <span aria-hidden="true" className="absolute inset-x-0 bottom-1 block h-px bg-signal/50" />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-1 block h-px origin-left scale-x-0 bg-signal transition-transform duration-500 ease-quart group-hover:scale-x-100"
                />
              </a>
            </Magnetic>
            <button
              ref={buttonRef}
              type="button"
              className="flex items-center gap-2.5 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-paper lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => (open ? close() : setOpen(true))}
            >
              <span>{open ? 'Close' : 'Menu'}</span>
              <span aria-hidden="true" className="relative block h-2.5 w-4">
                <span
                  className={`absolute left-0 top-0 block h-px w-4 bg-paper transition-transform duration-500 ease-quart ${
                    open ? 'translate-y-[5px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 block h-px w-4 bg-paper transition-transform duration-500 ease-quart ${
                    open ? '-translate-y-[4px] -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            className="pointer-events-auto fixed inset-x-0 bottom-0 top-14 flex flex-col overflow-y-auto bg-ink lg:hidden"
            initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: reduce ? 0 : 0.6, ease: EASE_QUART }}
          >
            <ul className="shell pt-4">
              {sections.map((s, i) => {
                const isActive = active === s.id
                return (
                  <li key={s.id} className="relative">
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 block h-px origin-left bg-rule"
                      initial={reduce ? false : { scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.7, delay: reduce ? 0 : 0.12 + i * 0.045, ease: EASE_QUART }}
                    />
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={`#${s.id}`}
                      onClick={onMenuLink}
                      aria-current={isActive ? 'location' : undefined}
                      className="group flex items-baseline gap-4 overflow-hidden py-3"
                    >
                      <motion.span
                        className="flex items-baseline gap-4"
                        initial={reduce ? false : { y: '110%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 0.6, delay: reduce ? 0 : 0.1 + i * 0.045, ease: EASE_QUART }}
                      >
                        <span className={`label num w-7 ${isActive ? 'text-signal' : 'text-grey'}`}>{s.index}</span>
                        {/* 6vw keeps "CERTIFICATIONS" inside 390px beside the index. */}
                        <span className="display text-[clamp(1.375rem,6vw,2.75rem)] text-paper transition-transform duration-500 ease-quart motion-safe:group-hover:translate-x-2">
                          {s.label}
                        </span>
                        {isActive ? <span aria-hidden="true" className="block h-2 w-2 self-center bg-signal" /> : null}
                      </motion.span>
                    </a>
                  </li>
                )
              })}
            </ul>
            <motion.div
              className="shell mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-8 pt-10"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: reduce ? 0 : 0.5, ease: EASE_QUART }}
            >
              <a
                href="mailto:akshsvt123@gmail.com"
                className="text-[0.8125rem] font-semibold tracking-[0.02em] text-paper underline decoration-rule underline-offset-[6px]"
              >
                akshsvt123@gmail.com
              </a>
              <span className="label">Lucknow, India</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
