import { Children, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useCalm } from './prefs'

/**
 * <Magnetic strength={0.35}><a className="...">Download CV</a></Magnetic>
 * Pulls its single child toward the pointer while hovered, then springs back
 * (overdamped: no bounce). Renders the child untouched on touch / reduced motion.
 * Wrapper is an inline-block span; pass `className` to size it (e.g. "w-full").
 */
const SPRING = { stiffness: 260, damping: 34, mass: 0.6 }

export default function Magnetic({ strength = 0.35, className = '', children }) {
  const calm = useCalm()
  const ref = useRef(null)
  const rect = useRef(null)
  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)

  const child = Children.only(children)
  if (calm) return child

  const onEnter = () => {
    rect.current = ref.current?.getBoundingClientRect() || null
  }
  const onMove = (e) => {
    const r = rect.current || ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => {
    rect.current = null
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {child}
    </motion.span>
  )
}
