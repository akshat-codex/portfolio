import { useCallback, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'
import { Reveal, Rule, SectionHead } from './ui'
import { Magnetic, useCalm } from './fx'

// Web3Forms public access key — safe to ship in client code; it only allows sending to the owner's inbox.
const WEB3FORMS_ACCESS_KEY = 'd6f81333-9a41-4a2b-a847-b2195c6d9c05'

const EMAIL = 'akshsvt123@gmail.com'

const contactLinks = [
  { label: 'Email', value: 'akshsvt123@gmail.com', href: 'mailto:akshsvt123@gmail.com' },
  { label: 'Phone', value: '+91-9936382927', href: 'tel:+919936382927', num: true },
  { label: 'LinkedIn', value: 'linkedin.com/in/akshhatsrivastava', href: 'https://linkedin.com/in/akshhatsrivastava' },
  { label: 'GitHub', value: 'github.com/akshat-codex', href: 'https://github.com/akshat-codex' },
]

const fields = [
  { name: 'name', type: 'text', label: 'Name', autoComplete: 'name', placeholder: 'Your name' },
  { name: 'email', type: 'email', label: 'Email', autoComplete: 'email', placeholder: 'your@email.com' },
]

const inputClass =
  'mt-2 block w-full border-0 border-b border-rule bg-transparent px-0 py-3 text-lg text-paper outline-none transition-[border-color] duration-300 ease-quart hover:border-grey focus:border-paper'

/* ---------- The close: one enormous line whose letters lean toward the cursor ---------- */

const LINE = ['LET’S', 'TALK']
const LEAN_RADIUS = 460 // px of influence around the pointer
const LEAN_MAX = 14 // px of travel at the closest point
const LEAN_SPRING = { stiffness: 220, damping: 30, mass: 0.5 } // overdamped: no bounce

function LeanLetter({ char, index, count, progress, register }) {
  // Scroll-scrubbed rise: letters lift out of the mask left to right.
  const start = (index / count) * 0.45
  const rise = useTransform(progress, [start, start + 0.55], ['130%', '0%'], { clamp: true })
  const x = useSpring(0, LEAN_SPRING)
  const y = useSpring(0, LEAN_SPRING)
  const rotate = useSpring(0, LEAN_SPRING)
  const ref = useCallback((el) => register(index, el ? { el, x, y, rotate } : null), [index, register, x, y, rotate])

  return (
    <motion.span className="inline-block" style={{ y: rise }}>
      <motion.span ref={ref} className="inline-block will-change-transform" style={{ x, y, rotate }}>
        {char}
      </motion.span>
    </motion.span>
  )
}

function TalkLine() {
  const calm = useCalm()
  const wrapRef = useRef(null)
  const letters = useRef([])
  const centers = useRef([])
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start 0.98', 'start 0.45'] })

  const register = useCallback((i, entry) => {
    letters.current[i] = entry
  }, [])

  const scrollAtMeasure = useRef(0)
  const measure = () => {
    scrollAtMeasure.current = window.scrollY
    centers.current = letters.current.map((l) => {
      if (!l) return null
      const r = l.el.getBoundingClientRect()
      // remove the current lean so the rest position is measured
      return { cx: r.left + r.width / 2 - l.x.get(), cy: r.top + r.height / 2 - l.y.get() }
    })
  }
  const onMove = (e) => {
    if (!centers.current.length) measure()
    const drift = window.scrollY - scrollAtMeasure.current // page scrolled under a resting pointer
    letters.current.forEach((l, i) => {
      const c = centers.current[i]
      if (!l || !c) return
      const dx = e.clientX - c.cx
      const dy = e.clientY - (c.cy - drift)
      const d = Math.hypot(dx, dy) || 1
      const f = Math.max(0, 1 - d / LEAN_RADIUS)
      const pull = f * f * LEAN_MAX
      l.x.set((dx / d) * pull)
      l.y.set((dy / d) * pull)
      l.rotate.set((dx / LEAN_RADIUS) * f * 6)
    })
  }
  const onLeave = () => {
    centers.current = []
    letters.current.forEach((l) => {
      if (!l) return
      l.x.set(0)
      l.y.set(0)
      l.rotate.set(0)
    })
  }

  const count = LINE.join('').length
  let k = 0

  return (
    <div
      ref={wrapRef}
      className="-mx-4 px-4 py-6 lg:-mx-10 lg:px-10 lg:py-10"
      onPointerEnter={calm ? undefined : measure}
      onPointerMove={calm ? undefined : onMove}
      onPointerLeave={calm ? undefined : onLeave}
    >
      <a
        href={`mailto:${EMAIL}`}
        aria-label={`Let’s talk. Email ${EMAIL}`}
        data-cursor="view"
        data-cursor-label="Write"
        className="display block text-[clamp(3rem,13vw,13rem)] leading-[0.86] text-paper no-underline transition-colors duration-500 ease-quart hover:text-signal"
      >
        <span aria-hidden="true" className="flex flex-wrap gap-x-[0.24em]">
          {LINE.map((word) => (
            <span key={word} className="inline-flex overflow-hidden whitespace-nowrap px-[0.1em] py-[0.14em] -mx-[0.1em] -my-[0.14em]">
              {[...word].map((ch) => {
                const i = k++
                return calm ? (
                  <span key={i} className="inline-block">
                    {ch}
                  </span>
                ) : (
                  <LeanLetter
                    key={i}
                    char={ch}
                    index={i}
                    count={count}
                    progress={scrollYProgress}
                    register={register}
                  />
                )
              })}
            </span>
          ))}
        </span>
      </a>
    </div>
  )
}

/* ---------- Section ---------- */

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `[Portfolio] New message from ${form.name}`,
          from_name: 'Portfolio Contact Form',
          ...form,
        }),
      })
      const data = await res.json().catch(() => ({}))
      const ok = res.ok && data.success
      setStatus(ok ? 'success' : 'error')
      if (ok) setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    } finally {
      setSending(false)
      setTimeout(() => setStatus(null), 5000)
    }
  }

  return (
    <section id="contact" className="shell pb-16 pt-24 lg:pb-24 lg:pt-32">
      <SectionHead index="08" title="Contact" />

      {/* The close */}
      <div className="mt-10 lg:mt-20">
        <TalkLine />
        <Rule accent delay={0.3} className="mt-2 w-1/3 lg:mt-4" />
        <Reveal as="p" delay={0.2} className="mt-6 max-w-[48ch] text-lg text-grey">
          Open to collaborations, side projects, and interesting engineering challenges.
        </Reveal>
      </div>

      <div className="grid-12 mt-16 gap-y-16 lg:mt-24">
        {/* Links */}
        <div className="col-span-4 lg:col-span-5">
          <ul>
            {contactLinks.map((c, i) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="group relative block"
                >
                  <Rule delay={i * 0.06} />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 ease-quart group-hover:scale-x-100"
                  />
                  <span className="grid grid-cols-[4.75rem_1fr_auto] items-baseline gap-x-4 py-5 transition-transform duration-500 ease-quart motion-safe:group-hover:translate-x-2 sm:grid-cols-[5.5rem_1fr_auto]">
                    <span className="label transition-colors duration-300 ease-quart group-hover:text-signal">
                      {c.label}
                    </span>
                    <Reveal
                      as="span"
                      delay={0.05 + i * 0.06}
                      className={`min-w-0 break-words text-[0.9375rem] text-paper sm:text-base ${c.num ? 'num' : ''}`}
                    >
                      {c.value}
                    </Reveal>
                    <FaArrowRight
                      aria-hidden="true"
                      className="text-xs text-grey transition-[transform,color] duration-300 ease-quart group-hover:text-signal motion-safe:group-hover:-rotate-45"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="relative flex flex-wrap items-baseline gap-x-3 gap-y-1 border-y border-rule py-5">
            <span aria-hidden="true" className="inline-block h-2 w-2 shrink-0 animate-pulse self-center bg-signal" />
            <span className="label text-signal">Currently</span>
            <span className="text-paper">Python / Backend Developer @ Gravity Engineering Services</span>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="col-span-4 lg:col-span-6 lg:col-start-7"
          aria-describedby="contact-status"
        >
          <h3 className="label text-paper">Send a message</h3>
          <Rule className="mt-3" />

          <div className="mt-8 space-y-8">
            {fields.map((f) => (
              <div key={f.name}>
                <label htmlFor={`contact-${f.name}`} className="label">
                  {f.label}
                </label>
                <input
                  id={`contact-${f.name}`}
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                  autoComplete={f.autoComplete}
                  placeholder={f.placeholder}
                  data-cursor="text"
                  className={inputClass}
                />
              </div>
            ))}

            <div>
              <label htmlFor="contact-message" className="label">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell me about your project or opportunity..."
                data-cursor="text"
                data-lenis-prevent
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          <p id="contact-status" role="status" aria-live="polite" className="mt-6 min-h-[1.5rem] text-sm">
            {status === 'success' && <span className="text-paper">Message sent. I&rsquo;ll reply to your email soon.</span>}
            {status === 'error' && (
              <span className="text-signal">
                The message could not be sent. Please try again, or email akshsvt123@gmail.com directly.
              </span>
            )}
          </p>

          <Magnetic strength={0.3} className="w-full sm:w-auto">
            <button
              type="submit"
              disabled={sending}
              className="group mt-4 flex w-full items-center justify-between gap-4 bg-signal px-6 py-5 text-left text-base font-bold uppercase tracking-[0.04em] text-ink [font-stretch:112%] transition-[background-color] duration-300 ease-quart hover:bg-paper disabled:cursor-wait disabled:bg-grey sm:w-auto sm:min-w-[18rem]"
            >
              <span>{sending ? 'Sending…' : 'Send message'}</span>
              <FaArrowRight
                aria-hidden="true"
                className="text-sm transition-transform duration-300 ease-quart motion-safe:group-hover:translate-x-1"
              />
            </button>
          </Magnetic>
        </form>
      </div>
    </section>
  )
}

export default Contact
