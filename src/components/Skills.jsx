import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const allSkills = [
  'Python', 'Django', 'Django REST Framework', 'FastAPI', 'Celery', 'Redis', 'PostgreSQL',
  'Docker', 'Linux', 'REST APIs', 'Webhooks', 'AWS Lambda', 'EC2', 'S3', 'DynamoDB',
  'API Gateway', 'CloudWatch', 'IAM', 'Java', 'JavaScript', 'SQL', 'React.js', 'Next.js',
  'Node.js', 'Express.js', 'MySQL', 'MongoDB', 'Machine Learning', 'NLP', 'Conversational AI',
  'Scikit-Learn', 'Flask', 'Git', 'Postman',
]

const row1 = allSkills.slice(0, 17)
const row2 = allSkills.slice(17)

const skillGroups = [
  {
    category: 'Languages',
    color: '#7B2FFF',
    items: [
      { name: 'Python', level: 90 },
      { name: 'SQL', level: 80 },
      { name: 'Java', level: 80 },
      { name: 'JavaScript', level: 78 },
    ],
  },
  {
    category: 'Backend',
    color: '#22C55E',
    items: [
      { name: 'Django / DRF', level: 86 },
      { name: 'FastAPI', level: 82 },
      { name: 'PostgreSQL', level: 82 },
      { name: 'REST APIs', level: 88 },
    ],
  },
  {
    category: 'Async & Infra',
    color: '#EC4899',
    items: [
      { name: 'Celery', level: 84 },
      { name: 'Redis', level: 80 },
      { name: 'Docker', level: 74 },
      { name: 'Linux', level: 76 },
    ],
  },
  {
    category: 'Cloud & AWS',
    color: '#FF9900',
    items: [
      { name: 'Lambda / EC2', level: 80 },
      { name: 'DynamoDB / S3', level: 79 },
      { name: 'API Gateway', level: 76 },
      { name: 'IAM / CloudWatch', level: 78 },
    ],
  },
  {
    category: 'Web & DB',
    color: '#00D4FF',
    items: [
      { name: 'React.js', level: 82 },
      { name: 'Node / Express', level: 79 },
      { name: 'MongoDB', level: 77 },
      { name: 'MySQL', level: 80 },
    ],
  },
  {
    category: 'AI / ML',
    color: '#FF6B35',
    items: [
      { name: 'Machine Learning', level: 73 },
      { name: 'NLP / TF-IDF', level: 70 },
      { name: 'Scikit-Learn', level: 73 },
      { name: 'Flask', level: 78 },
    ],
  },
]

const MarqueeRow = ({ skills, reverse }) => {
  const doubled = [...skills, ...skills]
  return (
    <div className="overflow-hidden relative">
      <div
        className="flex gap-3 py-2"
        style={{
          animation: `${reverse ? 'marqueeRev' : 'marquee'} ${reverse ? 22 : 28}s linear infinite`,
          width: 'max-content',
        }}
      >
        {doubled.map((skill, i) => (
          <span key={i} className="tag whitespace-nowrap text-xs px-4 py-2">
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

const SkillBar = ({ name, level, color, animate }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs mb-1.5">
      <span className="text-gray-400 font-mono">{name}</span>
      <span className="font-mono" style={{ color }}>{level}%</span>
    </div>
    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: animate ? `${level}%` : '0%' }}
        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          boxShadow: `0 0 8px ${color}66`,
        }}
      />
    </div>
  </div>
)

const Skills = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="skills" className="relative py-28 overflow-hidden">
      {/* Ghost number */}
      <span className="section-ghost-num" style={{ top: '-20px', right: '0px' }}>02</span>

      {/* Header */}
      <div className="px-6 lg:px-16 mb-14" ref={ref}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-4"
          >
            <div>
              <p className="label-text mb-4">Technical Skills</p>
              <h2 className="heading-text text-white">
                My <span className="gradient-text">Arsenal</span>
              </h2>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
              Technologies I work with daily to build robust, scalable systems.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Marquee rows */}
      <div className="space-y-3 mb-20">
        <MarqueeRow skills={row1} reverse={false} />
        <MarqueeRow skills={row2} reverse={true} />
      </div>

      {/* Skill bars grid */}
      <div className="px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + gi * 0.1 }}
              className="glass p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: group.color, boxShadow: `0 0 8px ${group.color}` }}
                />
                <span className="label-text">{group.category}</span>
              </div>
              {group.items.map((skill) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  color={group.color}
                  animate={inView}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
