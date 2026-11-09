import { motion } from 'motion/react'
import ScrollAssemble from './ScrollAssemble'

/**
 * Section opener: an index chip, then a giant display title whose letters fly in from a
 * scattered, broken state and assemble as the section scrolls into view.
 */
export default function SectionTitle({ index, title, kicker, className = '' }) {
  return (
    <header className={`relative ${className}`}>
      <motion.p
        className="label flex items-center gap-3 text-paper"
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="num inline-grid h-7 min-w-7 place-items-center rounded-full border border-signal/60 px-2 text-signal">
          {index}
        </span>
        <span className="h-px w-10 bg-rule" aria-hidden="true" />
        {kicker}
      </motion.p>
      <ScrollAssemble
        as="h2"
        text={title}
        className="display mt-5 text-[clamp(2.75rem,9vw,8.5rem)] leading-[0.9]"
      >
        <span className="text-signal" aria-hidden="true">.</span>
      </ScrollAssemble>
    </header>
  )
}
