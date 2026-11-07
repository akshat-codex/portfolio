import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Reveal, Rule, SectionHead } from './ui'
import { useCalm, EASE_QUART } from './fx'

// Dense skills index. Plain text lines grouped into ruled columns; no levels, no pills.
const groups = [
  { name: 'Languages', items: ['Python', 'SQL', 'Java', 'JavaScript'] },
  {
    name: 'Backend',
    items: ['Django', 'Django REST Framework', 'FastAPI', 'Flask', 'Node.js', 'Express.js', 'REST APIs', 'Webhooks'],
  },
  { name: 'Async & Distributed', items: ['Celery', 'Redis', 'SMTP / IMAP'] },
  { name: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'DynamoDB'] },
  {
    name: 'Cloud & Infra',
    items: ['AWS Lambda', 'EC2', 'S3', 'API Gateway', 'CloudWatch', 'IAM', 'Docker', 'Linux'],
  },
  { name: 'AI & Automation', items: ['Machine Learning', 'NLP / TF-IDF', 'Conversational AI', 'Scikit-Learn'] },
  { name: 'Frontend', items: ['React.js', 'Next.js'] },
  { name: 'Tools', items: ['Git', 'Postman'] },
]

const pad = (n) => String(n).padStart(2, '0')
const total = groups.reduce((sum, g) => sum + g.items.length, 0)

/** A value that ticks upward (rises out of a mask) every time it changes. */
function Tick({ value, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <motion.span
        key={value}
        className="block"
        initial={reduce ? false : { y: '100%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.32, ease: EASE_QUART }}
      >
        {value}
      </motion.span>
    </span>
  )
}

function Group({ group, gi, progress, calm, active, setActive }) {
  // Scroll-scrubbed stagger: columns further right travel further and settle later.
  const lift = calm ? 0 : 36 + (gi % 4) * 34
  const y = useTransform(progress, [0, 1], [lift, 0])
  const isActive = active?.g === gi
  const n = group.items.length

  return (
    <motion.div
      style={calm ? undefined : { y }}
      className="col-span-2 lg:col-span-3"
      onPointerLeave={() => setActive(null)}
    >
      <Rule delay={(gi % 4) * 0.08} />
      <div className="flex items-baseline justify-between gap-3 pb-3 pt-3">
        <h3 className={`label transition-colors duration-300 ease-quart ${isActive ? 'text-signal' : 'text-paper'}`}>
          {group.name}
        </h3>
        <span className="label num text-paper" aria-label={`${n} skills`}>
          {isActive ? (
            <span aria-hidden="true" className="inline-flex items-baseline">
              <Tick value={pad(active.i + 1)} className="text-signal" />
              <span className="text-grey">/{pad(n)}</span>
            </span>
          ) : (
            <span aria-hidden="true">{pad(n)}</span>
          )}
        </span>
      </div>
      {/* Group fill bar: how far through the group the pointer is */}
      <span aria-hidden="true" className="relative block h-[2px] w-full">
        <span
          className="absolute inset-0 origin-left bg-signal transition-transform duration-500 ease-quart"
          style={{ transform: `scaleX(${isActive ? (active.i + 1) / n : 0})` }}
        />
      </span>
      <ul>
        {group.items.map((item, i) => {
          const on = isActive && active.i === i
          const dim = active && !on
          return (
            <li key={item} className="group/item relative" onPointerEnter={() => setActive({ g: gi, i })}>
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1/2 -mt-[3px] block h-1.5 w-1.5 bg-signal transition-transform duration-300 ease-quart ${
                  on ? 'scale-100' : 'scale-0'
                }`}
              />
              <div
                className={`transition-[transform,color] duration-300 ease-quart ${
                  on ? 'translate-x-3.5 text-paper' : dim ? 'text-grey' : 'text-paper'
                }`}
              >
                <Reveal
                  delay={(gi % 4) * 0.08 + i * 0.035}
                  duration={0.55}
                  className="py-2 text-[0.9375rem] leading-snug"
                >
                  {item}
                </Reveal>
              </div>
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 h-px origin-left transition-[transform,background-color] duration-300 ease-quart ${
                  on ? 'scale-y-[2] bg-paper' : 'bg-rule'
                }`}
              />
            </li>
          )
        })}
      </ul>
    </motion.div>
  )
}

const Skills = () => {
  const calm = useCalm()
  const [active, setActive] = useState(null)
  const gridRef = useRef(null)
  const counterRef = useRef(null)
  const numRef = useRef(null)

  const { scrollYProgress: gridProgress } = useScroll({ target: gridRef, offset: ['start end', 'start 0.35'] })
  const { scrollYProgress: countProgress } = useScroll({ target: counterRef, offset: ['start 0.95', 'start 0.4'] })
  const count = useTransform(countProgress, [0, 1], [0, total])

  useMotionValueEvent(count, 'change', (v) => {
    if (calm || !numRef.current) return
    numRef.current.textContent = pad(Math.round(v))
  })

  const activeGroup = active ? groups[active.g] : null

  return (
    <section id="skills" className="shell py-24 lg:py-32">
      <SectionHead index="04" title="Skills" kicker={<span className="num">{pad(total)} entries</span>} />

      {/* Index readout: scroll-scrubbed total, plus a live line for whatever the pointer is on */}
      <div ref={counterRef} className="grid-12 mt-10 items-end gap-y-6 lg:mt-16">
        <p className="col-span-4 lg:col-span-5">
          <span className="sr-only">{total} skills across {groups.length} groups</span>
          <span
            ref={numRef}
            aria-hidden="true"
            className="display num block text-[clamp(6rem,34vw,15rem)] leading-[0.8]"
          >
            {pad(total)}
          </span>
        </p>
        <div aria-hidden="true" className="col-span-4 lg:col-span-6 lg:col-start-7">
          <dl className="grid grid-cols-[5.5rem_1fr] gap-y-2 border-t border-rule pt-3">
            <dt className="label">Groups</dt>
            <dd className="num text-paper">{pad(groups.length)}</dd>
            <dt className="label">Reading</dt>
            <dd className="min-w-0 truncate text-paper">
              {activeGroup ? (
                <Tick value={activeGroup.items[active.i]} className="text-signal" />
              ) : (
                <span className="text-grey">{calm ? 'Full index' : 'Point at any entry'}</span>
              )}
            </dd>
            <dt className="label">Group</dt>
            <dd className="num text-paper">
              {activeGroup ? (
                <Tick value={`${activeGroup.name} · ${pad(active.i + 1)}/${pad(activeGroup.items.length)}`} />
              ) : (
                <span className="text-grey">All · {pad(total)}</span>
              )}
            </dd>
          </dl>
        </div>
      </div>

      <div ref={gridRef} className="grid-12 mt-14 gap-y-12 lg:mt-20 lg:gap-y-16">
        {groups.map((group, gi) => (
          <Group
            key={group.name}
            group={group}
            gi={gi}
            progress={gridProgress}
            calm={calm}
            active={active}
            setActive={setActive}
          />
        ))}
      </div>
    </section>
  )
}

export default Skills
