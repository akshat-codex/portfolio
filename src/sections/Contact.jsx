import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { BackgroundBeams } from '@/components/vendor/aceternity/background-beams'
import { MagneticButton } from '@/components/vendor/aceternity/magnetic-button'
import { useReducedMotionPref } from '@/components/fx'
import SectionTitle from './SectionTitle'
import { contact } from '@/data/content'
import { submitContact } from '@/data/contactSubmit'

const EASE = [0.22, 1, 0.36, 1]
const EMPTY = { name: '', email: '', message: '' }

function Field({ f, value, onChange }) {
  const common = {
    id: `contact-${f.name}`,
    name: f.name,
    required: f.required,
    placeholder: f.placeholder,
    autoComplete: f.autoComplete,
    value,
    onChange: (e) => onChange(f.name, e.target.value),
    className:
      'peer w-full rounded-2xl border border-rule bg-ink/60 px-4 py-3.5 text-paper placeholder:text-paper/30 outline-none transition-colors focus:border-signal focus:bg-ink/80',
  }
  return (
    <label htmlFor={common.id} className="block">
      <span className="label mb-2 block text-paper/80">{f.label}</span>
      {f.type === 'textarea' ? <textarea rows={f.rows} {...common} className={`${common.className} resize-none`} /> : <input type={f.type} {...common} />}
    </label>
  )
}

export default function Contact() {
  const reduce = useReducedMotionPref()
  const sectionRef = useRef(null)
  // Beams animate ~50 SVG gradients: only mount them while Contact is near the viewport.
  const near = useInView(sectionRef, { margin: '300px 0px' })
  const [values, setValues] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }))

  useEffect(() => {
    if (status !== 'sent' && status !== 'error') return undefined
    const t = setTimeout(() => setStatus('idle'), contact.form.statusResetMs)
    return () => clearTimeout(t)
  }, [status])

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    const res = await submitContact(values)
    if (res.ok) {
      setValues(EMPTY)
      setStatus('sent')
    } else setStatus('error')
  }

  return (
    <section id="contact" ref={sectionRef} className="relative isolate overflow-hidden py-28 lg:py-40">
      {/* Aceternity · Background Beams */}
      {!reduce && near ? <BackgroundBeams className="-z-10 opacity-70" /> : null}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(255,77,0,0.18),transparent)]" />

      <div className="shell">
        <SectionTitle index={contact.index} title={contact.title} kicker={contact.currently.value} />

        <div className="mt-14 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <motion.a
              href={contact.headlineHref}
              aria-label={contact.headlineAriaLabel}
              className="cursor-target group display block text-[clamp(3.5rem,11vw,9rem)] leading-[0.85]"
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true }}
            >
              {contact.headline.map((w, i) => (
                <span key={w} className="block overflow-hidden">
                  <motion.span
                    className={`block transition-colors duration-500 ${i === 1 ? 'text-signal group-hover:text-paper' : 'group-hover:text-signal'}`}
                    variants={{ hidden: { y: '100%' }, shown: { y: '0%' } }}
                    transition={{ duration: 1, delay: i * 0.12, ease: EASE }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </motion.a>
            <p className="mt-8 max-w-[44ch] text-lg text-paper/70">{contact.lede}</p>
            <ul className="mt-10 divide-y divide-rule border-y border-rule">
              {contact.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : null)}
                    className="cursor-target group flex items-baseline justify-between gap-4 py-4"
                  >
                    <span className="label">{l.label}</span>
                    <span className={`text-right text-paper transition-colors group-hover:text-signal ${l.num ? 'num' : ''}`}>
                      {l.value} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">↗</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative rounded-[2rem] border border-rule bg-ink/50 p-6 backdrop-blur-xl md:p-10 lg:col-span-6"
          >
            <h3 className="text-2xl font-bold text-paper">{contact.form.heading}</h3>
            <div className="mt-8 space-y-5">
              {contact.form.fields.map((f) => (
                <Field key={f.name} f={f} value={values[f.name]} onChange={set} />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <MagneticButton strength={0.35} maxDistance={30}>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="cursor-target rounded-full bg-signal px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-ink shadow-[0_18px_50px_-12px_rgba(255,77,0,0.75)] disabled:opacity-60"
                >
                  {status === 'sending' ? contact.form.sendingLabel : contact.form.submitLabel}
                </button>
              </MagneticButton>
              <p role="status" aria-live="polite" className={`text-sm ${status === 'error' ? 'text-signal' : 'text-paper/80'}`}>
                {status === 'sent' ? contact.form.successMessage : status === 'error' ? contact.form.errorMessage : ''}
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
