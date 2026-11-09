import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotionPref } from '@/components/fx'

/**
 * Hero name in Syne ExtraBold, each line fitted to the full width.
 *
 * Motion, built on Skiper UI #31's CharacterV1 technique (letters offset by their distance
 * from the word's centre, with a 3D rotateX):
 *  - load:   letters fly in fanned out, tilted and blurred, and lock together centre-first
 *  - scroll: as the hero leaves, the name fans apart in 3D (and re-forms on the way back)
 *  - hover:  each letter rolls to the other colour (Skiper UI #58 Text Roll, per letter)
 */
const EASE = [0.22, 1, 0.36, 1]
const FONT = "'Syne Variable', 'Syne', 'Archivo Variable', sans-serif"

function Letter({ ch, d, scroll, play, delay, base, roll }) {
  // Skiper #31 CharacterV1: x and rotateX scale with distance from centre
  const x = useTransform(scroll, [0, 1], [0, d * 55])
  const rotateX = useTransform(scroll, [0, 1], [0, d * 40])
  const y = useTransform(scroll, [0, 1], [0, -Math.abs(d) * 12])
  const glyph = ch === ' ' ? ' ' : ch

  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, x: d * 70, y: 80, rotateX: 85, filter: 'blur(14px)' }}
      animate={play ? { opacity: 1, x: 0, y: 0, rotateX: 0, filter: 'blur(0px)' } : undefined}
      transition={{ duration: 1.3, delay, ease: EASE }}
    >
      <motion.span style={{ x, rotateX, y }} className="group/l relative inline-block overflow-hidden px-[0.01em] align-top">
        <span className={`block transition-transform duration-500 ease-quart group-hover/l:-translate-y-full ${base}`}>{glyph}</span>
        <span
          aria-hidden="true"
          className={`absolute inset-0 block translate-y-full px-[0.01em] transition-transform duration-500 ease-quart group-hover/l:translate-y-0 ${roll}`}
        >
          {glyph}
        </span>
      </motion.span>
    </motion.span>
  )
}

/** Font size per line so each line spans the full container width. */
function useFitLines(lines) {
  const boxRef = useRef(null)
  const measureRefs = useRef([])
  const [sizes, setSizes] = useState(() => lines.map(() => null))

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return undefined
    const fit = () => {
      const w = box.clientWidth
      setSizes(
        measureRefs.current.map((el, i) => {
          if (!el) return null
          // measured at 100px; each rendered letter adds 0.02em of side padding (2px at 100px)
          const at100 = el.getBoundingClientRect().width + Array.from(lines[i]).length * 2
          // 0.93: Syne's wide A/V overhang their advance width, so leave a little air
          return at100 ? Math.min(260, (w / at100) * 100 * 0.93) : null
        }),
      )
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    document.fonts?.ready.then(fit).catch(() => {})
    return () => ro.disconnect()
  }, [lines])

  return { boxRef, measureRefs, sizes }
}

export default function HeroName({ lines, play }) {
  const reduce = useReducedMotionPref()
  const { scrollY } = useScroll()
  const scroll = useTransform(scrollY, [0, 650], [0, 1], { clamp: true })
  const { boxRef, measureRefs, sizes } = useFitLines(lines)
  const styles = [
    { base: 'text-paper', roll: 'text-signal' },
    { base: 'text-signal', roll: 'text-paper' },
  ]
  return (
    <div ref={boxRef} className="relative w-full">
      {/* off-screen measurers at 100px */}
      <div aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 h-0 overflow-hidden">
        {lines.map((l, i) => (
          <span
            key={l}
            ref={(el) => (measureRefs.current[i] = el)}
            className="inline-block whitespace-nowrap uppercase"
            style={{ fontFamily: FONT, fontWeight: 800, fontSize: 100, letterSpacing: '-0.045em' }}
          >
            {l}
          </span>
        ))}
      </div>

      <div aria-hidden="true" style={{ perspective: '900px' }}>
        {lines.map((line, li) => {
          const chars = Array.from(line)
          const center = (chars.length - 1) / 2
          return (
            <div
              key={line}
              className="whitespace-nowrap uppercase leading-[0.86]"
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                letterSpacing: '-0.045em',
                fontSize: sizes[li] ? `${sizes[li]}px` : 'clamp(3rem,11vw,10rem)',
              }}
            >
              {chars.map((ch, ci) => {
                const d = ci - center
                // centre letters land first, rippling outward; second line follows the first
                const delay = li * 0.18 + Math.abs(d) * 0.045
                return reduce ? (
                  <span key={ci} className={`inline-block ${styles[li % 2].base}`}>
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ) : (
                  <Letter
                    key={ci}
                    ch={ch}
                    d={d}
                    scroll={scroll}
                    play={play}
                    delay={delay}
                    base={styles[li % 2].base}
                    roll={styles[li % 2].roll}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
