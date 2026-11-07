import { motion, useReducedMotion } from 'framer-motion'

export const EASE_QUART = [0.25, 1, 0.5, 1]

/**
 * Mask-rise reveal: the child rises from below a baseline mask.
 * <Reveal as="h2" delay={0.1} className="display text-6xl">Projects</Reveal>
 * Wrapper is `as` (default 'div') with overflow:hidden; the moving inner is a block span.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, duration = 0.6, className = '', children }) {
  const reduce = useReducedMotion()
  if (reduce) {
    return <Tag className={className}>{children}</Tag>
  }
  return (
    <Tag className={`overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: '100%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration, delay, ease: EASE_QUART }}
      >
        {children}
      </motion.span>
    </Tag>
  )
}
