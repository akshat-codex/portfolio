import { motion, useReducedMotion } from 'framer-motion'
import { EASE_QUART } from './Reveal'

/**
 * 1px hairline that draws left-to-right when it enters the viewport.
 * <Rule />  <Rule accent delay={0.2} className="mt-6" />
 */
export default function Rule({ className = '', delay = 0, accent = false }) {
  const reduce = useReducedMotion()
  const color = accent ? 'bg-signal' : 'bg-rule'
  const base = `block h-px w-full origin-left ${color} ${className}`
  if (reduce) return <span aria-hidden="true" className={base} />
  return (
    <motion.span
      aria-hidden="true"
      className={base}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE_QUART }}
    />
  )
}
