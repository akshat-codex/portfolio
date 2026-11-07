import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Rule } from './ui'
import { Magnetic, useCalm } from './fx'

const links = [
  { label: 'GitHub', href: 'https://github.com/akshat-codex', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/akshhatsrivastava', external: true },
  { label: 'Email', href: 'mailto:akshsvt123@gmail.com', external: false },
]

const linkClass =
  'group relative inline-block py-1 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-paper'

const LinkLine = () => (
  <>
    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 block h-px bg-rule" />
    <span
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 block h-px origin-right scale-x-0 bg-paper transition-transform duration-500 ease-quart group-hover:origin-left group-hover:scale-x-100"
    />
  </>
)

/** Sizes the closing line so it spans the container edge to edge. */
function useFitWidth(maxPx = 260) {
  const boxRef = useRef(null)
  const measureRef = useRef(null)
  const [size, setSize] = useState(null)
  useLayoutEffect(() => {
    const box = boxRef.current
    const m = measureRef.current
    if (!box || !m) return undefined
    const fit = () => {
      const w = box.clientWidth
      const mw = m.getBoundingClientRect().width
      if (!w || !mw) return
      setSize(Math.min(maxPx, Math.floor((w / mw) * 100 * 0.98 * 10) / 10))
    }
    fit()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null
    ro?.observe(box)
    document.fonts?.ready.then(fit).catch(() => {})
    return () => ro?.disconnect()
  }, [maxPx])
  return { boxRef, measureRef, size }
}

const Footer = () => {
  const calm = useCalm()
  const ref = useRef(null)
  const { boxRef, measureRef, size } = useFitWidth()

  // The two words slide in from opposite edges and lock together as the page bottoms out.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const leftX = useTransform(scrollYProgress, [0, 0.85], ['-22%', '0%'])
  const rightX = useTransform(scrollYProgress, [0, 0.85], ['22%', '0%'])
  const fade = useTransform(scrollYProgress, [0, 0.6], [0.2, 1])
  const tickScale = useTransform(scrollYProgress, [0.3, 0.95], [0, 1])

  return (
    <footer ref={ref} className="shell overflow-hidden pb-10 pt-16 lg:pt-24">
      <div aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 h-0 w-0 overflow-hidden">
        <span ref={measureRef} className="display inline-flex whitespace-nowrap text-[100px]">
          <span className="inline-block">LET&rsquo;S</span>
          <span className="inline-block w-[0.28em]" />
          <span className="inline-block">BUILD</span>
        </span>
      </div>

      <div ref={boxRef}>
        <a
          href="#contact"
          data-cursor="view"
          data-cursor-label="Write"
          aria-label="Let's build: go to 08 Contact"
          className="group block text-paper"
        >
          <span
            aria-hidden="true"
            className="display flex whitespace-nowrap text-[clamp(3rem,15vw,15rem)] leading-[0.82]"
            style={size ? { fontSize: `${size}px` } : undefined}
          >
            <motion.span className="inline-block" style={calm ? undefined : { x: leftX, opacity: fade }}>
              LET&rsquo;S
            </motion.span>
            <span className="inline-block w-[0.28em]" />
            <motion.span
              className="inline-block transition-colors duration-500 ease-quart group-hover:text-signal"
              style={calm ? undefined : { x: rightX, opacity: fade }}
            >
              BUILD
            </motion.span>
          </span>
        </a>
        <motion.span
          aria-hidden="true"
          className="mt-4 block h-[2px] w-full origin-left bg-signal"
          style={calm ? undefined : { scaleX: tickScale }}
        />
      </div>

      <div className="grid-12 gap-y-6 pt-8 lg:pt-10">
        <div className="col-span-4 lg:col-span-4">
          <p className="font-bold uppercase tracking-[0.02em] text-paper [font-stretch:118%]">
            Akshat Kumar Srivastava
          </p>
          <p className="label mt-1">Python / Backend Developer</p>
        </div>

        <ul className="col-span-4 flex flex-wrap items-center gap-x-7 gap-y-3 lg:col-span-5 lg:col-start-6">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className={linkClass}
              >
                {l.label}
                <LinkLine />
              </a>
            </li>
          ))}
        </ul>

        <div className="col-span-4 flex items-center justify-between gap-6 lg:col-span-2 lg:col-start-11 lg:justify-end">
          <p className="label num">© 2026</p>
          <Magnetic strength={0.3}>
            <a href="#top" className={`${linkClass} flex items-center gap-2`}>
              <span
                aria-hidden="true"
                className="block h-2 w-px bg-paper transition-transform duration-500 ease-quart group-hover:-translate-y-0.5 group-hover:scale-y-150"
              />
              Back to top
              <LinkLine />
            </a>
          </Magnetic>
        </div>
      </div>
      <Rule className="mt-8" />
    </footer>
  )
}

export default Footer
