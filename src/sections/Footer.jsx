import { motion } from 'motion/react'
import { TextRoll } from '@/components/vendor/skiper/skiper58'
import ScrollAssemble from './ScrollAssemble'
import { footer } from '@/data/content'

const CREDITS = [
  { label: 'React Bits', href: 'https://reactbits.dev' },
  { label: 'Aceternity UI', href: 'https://ui.aceternity.com' },
  { label: 'Skiper UI', href: 'https://skiper-ui.com' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-rule pt-20">
      <div className="shell">
        {/* Each word is scattered and assembles as you reach the end of the page. */}
        <a
          href={footer.closingHref}
          aria-label={footer.closingAriaLabel}
          className="cursor-target display group block text-[clamp(4rem,19vw,17rem)] leading-[0.86]"
        >
          {footer.closing.map((w, i) => (
            <ScrollAssemble
              key={w}
              text={w}
              spread={1.4}
              offset={['start 100%', 'end 85%']}
              className={`block transition-colors duration-500 ${i === 1 ? 'text-signal group-hover:text-paper' : 'text-paper group-hover:text-signal'}`}
            />
          ))}
        </a>

        <div className="mt-16 grid gap-8 border-t border-rule py-8 md:grid-cols-3 md:items-end">
          <div>
            <p className="font-semibold text-paper">{footer.name}</p>
            <p className="text-sm text-paper/60">{footer.role}</p>
          </div>
          <ul className="flex flex-wrap gap-6 md:justify-center">
            {footer.links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: '_blank', rel: 'noreferrer' } : null)}
                  className="cursor-target label text-paper transition-colors hover:text-signal"
                >
                  <TextRoll>{l.label}</TextRoll>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-6 md:justify-end">
            <p className="label num">{footer.copyright}</p>
            <motion.a
              href="#hero"
              whileHover={{ y: -3 }}
              className="cursor-target label rounded-full border border-rule px-4 py-2 text-paper"
            >
              {footer.backToTop.label} ↑
            </motion.a>
          </div>
        </div>

        {/* Skiper UI's free licence asks for attribution; credits for all three libraries. */}
        <p className="pb-8 text-xs text-paper/40">
          UI components:{' '}
          {CREDITS.map((c, i) => (
            <span key={c.label}>
              <a href={c.href} target="_blank" rel="noreferrer" className="underline decoration-paper/20 underline-offset-4 hover:text-paper">
                {c.label}
              </a>
              {i < CREDITS.length - 1 ? ', ' : ''}
            </span>
          ))}
          .
        </p>
      </div>
    </footer>
  )
}
