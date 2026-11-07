import { motion, useReducedMotion } from 'framer-motion'
import { Rule, SectionHead } from './ui'
import { EASE_QUART } from './fx'

const achievements = [
  { title: '1st Place — Gaming', desc: 'College-level gaming competition winner' },
  { title: '25th University Rank', desc: '1st year, university-wide ranking' },
  { title: 'Excellence Scholarship', desc: 'Awarded for academic performance' },
  { title: 'NSS Photography Lead', desc: 'Led & coordinated 5+ events' },
  { title: 'TechXplore Participant', desc: 'University coding & tech competition' },
  { title: 'DSA Practice', desc: 'LeetCode & GeeksForGeeks problems' },
  { title: 'Tech Events Volunteer', desc: 'University event coordination' },
  { title: 'CGPA 8.97 / 10', desc: 'First Division with Honours' },
]

const pad = (n) => String(n).padStart(2, '0')

const Achievements = () => {
  const reduce = useReducedMotion()
  const row = (i, dir = 1) => ({
    initial: reduce ? false : { x: -48 * dir, opacity: 0 },
    whileInView: { x: 0, opacity: 1 },
    viewport: { once: true, margin: '0px 0px -8% 0px' },
    transition: { duration: 0.85, delay: 0.12 + (i % 4) * 0.06, ease: EASE_QUART },
  })

  return (
    <section id="achievements" className="shell py-24 lg:py-32">
      <SectionHead
        index="07"
        title="Achievements"
        kicker={<span className="num">{pad(achievements.length)} entries</span>}
      />

      <ol className="mt-12 lg:mt-20">
        {achievements.map((a, i) => (
          <li key={a.title} className="group relative">
            <Rule delay={(i % 4) * 0.06} />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 ease-quart group-hover:scale-x-100"
            />
            <div className="grid-12 items-baseline gap-y-1 py-5 transition-transform duration-500 ease-quart motion-safe:group-hover:translate-x-2 lg:py-6">
              <span
                aria-hidden="true"
                className="num col-span-1 text-sm font-bold text-grey transition-colors duration-300 ease-quart group-hover:text-signal lg:text-base"
              >
                {pad(i + 1)}
              </span>
              {/* Title enters from the left, description from the right: both travel the row axis */}
              <motion.h3
                {...row(i)}
                className="col-span-3 text-lg font-bold uppercase leading-tight [font-stretch:112%] lg:col-span-5 lg:text-2xl"
              >
                <span className="num">{a.title}</span>
              </motion.h3>
              <motion.p
                {...row(i, -1)}
                className="col-span-3 col-start-2 text-grey transition-colors duration-300 ease-quart group-hover:text-paper lg:col-span-6 lg:col-start-7"
              >
                {a.desc}
              </motion.p>
            </div>
          </li>
        ))}
      </ol>
      <Rule />
    </section>
  )
}

export default Achievements
