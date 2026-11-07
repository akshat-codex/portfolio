import Reveal from './Reveal'
import Rule from './Rule'

/**
 * Swiss section header: full-width hairline on top, tabular index in column 1,
 * title set large across columns 2–10, optional kicker (secondary note, set
 * AFTER the title, never as an eyebrow above it) in columns 11–12.
 * Sections own their ids; this component has none.
 * <SectionHead index="02" title="About" kicker="Lucknow, IN" />
 */
export default function SectionHead({ index, title, kicker, as = 'h2', className = '' }) {
  return (
    <header className={className}>
      <Rule />
      <div className="grid-12 items-start pt-4 lg:pt-5">
        <span className="label num col-span-4 text-paper lg:col-span-1 lg:pt-2">
          {index}
        </span>
        <Reveal
          as={as}
          className="display col-span-4 mt-3 text-[clamp(1.75rem,8vw,6rem)] lg:col-span-9 lg:text-[min(6rem,6.1vw)] lg:mt-0"
        >
          {title}
        </Reveal>
        {kicker ? (
          <p className="label col-span-4 mt-4 lg:col-span-2 lg:mt-0 lg:pt-2 lg:text-right">
            {kicker}
          </p>
        ) : null}
      </div>
    </header>
  )
}
