import { motion, useReducedMotion } from 'framer-motion'
import { Reveal, Rule, SectionHead } from './ui'
import { EASE_QUART } from './fx'

const certs = [
  {
    title: 'AWS Cloud Computing Training',
    issuer: 'Amazon Web Services',
    status: 'Completed',
    skills: ['EC2', 'S3', 'Lambda', 'DynamoDB', 'VPC', 'IAM'],
    desc: 'Hands-on practical training covering AWS core services, cloud architecture, and deployment.',
  },
  {
    title: 'AWS Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    status: 'In preparation',
    live: true,
    skills: ['Architecture', 'Auto Scaling', 'ELB', 'CloudWatch'],
    desc: 'Preparing for the exam: fault-tolerant distributed systems and scalable cloud architectures on AWS.',
  },
  {
    title: 'Full Stack Java Development',
    issuer: 'Industry Training',
    status: 'Completed',
    skills: ['Java', 'JDBC', 'MySQL', 'OOP', 'REST APIs'],
    desc: 'Comprehensive full-stack training in Java, JDBC, MySQL, and RESTful API development.',
  },
]

const pad = (n) => String(n).padStart(2, '0')

const Certifications = () => {
  const reduce = useReducedMotion()

  return (
    <section id="certifications" className="shell py-24 lg:py-32">
      <SectionHead index="06" title="Certifications" />

      <ol className="mt-12 lg:mt-20">
        {certs.map((c, i) => (
          <li key={c.title} className="group relative">
            <Rule delay={i * 0.1} />
            {/* Hover: a signal hairline sweeps along the row's top rule */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 ease-quart group-hover:scale-x-100"
            />
            {/* Entrance: content slides in along the row axis behind the drawing rule */}
            <motion.div
              initial={reduce ? false : { x: -56, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: EASE_QUART }}
            >
              <div className="grid-12 gap-y-3 py-7 transition-transform duration-500 ease-quart motion-safe:group-hover:translate-x-2 lg:py-10">
                <span
                  aria-hidden="true"
                  className="display num col-span-1 text-[clamp(1.75rem,4vw,3.5rem)] text-grey transition-colors duration-300 ease-quart group-hover:text-signal"
                >
                  {pad(i + 1)}
                </span>
                <p
                  className={`label col-span-3 flex items-center justify-end gap-2 lg:order-last lg:col-span-2 lg:items-start lg:pt-2 ${
                    c.live ? 'text-signal' : ''
                  }`}
                >
                  {c.live ? (
                    <span aria-hidden="true" className="block h-2 w-2 shrink-0 animate-pulse bg-signal lg:mt-[0.15rem]" />
                  ) : null}
                  {c.status}
                </p>
                <div className="col-span-4 lg:col-span-5">
                  <Reveal
                    as="h3"
                    delay={0.2 + i * 0.1}
                    className="text-[clamp(1.25rem,3vw,1.875rem)] font-extrabold uppercase leading-[1] [font-stretch:112%]"
                  >
                    {c.title}
                  </Reveal>
                  <p className="mt-2 text-grey">{c.issuer}</p>
                </div>
                <div className="col-span-4 lg:col-span-4">
                  <p className="max-w-[60ch] text-paper/90">{c.desc}</p>
                  <p className="mt-3 text-sm text-grey">{c.skills.join(' · ')}</p>
                </div>
              </div>
            </motion.div>
          </li>
        ))}
      </ol>
      <Rule delay={certs.length * 0.1} />
    </section>
  )
}

export default Certifications
