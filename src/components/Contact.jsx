import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaArrowRight } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'

// Web3Forms public access key — safe to ship in client code; it only allows sending to the owner's inbox.
const WEB3FORMS_ACCESS_KEY = 'd6f81333-9a41-4a2b-a847-b2195c6d9c05'

const contactLinks = [
  { icon: <FaEnvelope />, label: 'Email', value: 'akshsvt123@gmail.com', href: 'mailto:akshsvt123@gmail.com', color: '#7B2FFF' },
  { icon: <FaPhone />, label: 'Phone', value: '+91-9936382927', href: 'tel:+919936382927', color: '#00D4FF' },
  { icon: <FaLinkedin />, label: 'LinkedIn', value: 'Connect with me', href: 'https://linkedin.com/in/akshhatsrivastava', color: '#0077B5' },
  { icon: <FaGithub />, label: 'GitHub', value: 'View my code', href: 'https://github.com/akshat-codex', color: '#C084FC' },
]

const Contact = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
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
    <section id="contact" className="relative py-28 px-6 lg:px-16 overflow-hidden">
      <span className="section-ghost-num" style={{ top: '-20px', left: '-10px' }}>07</span>

      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Big CTA text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center lg:text-left"
        >
          <p className="label-text mb-6">Let's Connect</p>
          <h2
            className="font-black text-white mb-4"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(2.5rem, 7vw, 6rem)',
              lineHeight: '0.95',
              letterSpacing: '-0.02em',
            }}
          >
            Got a project?<br />
            <span className="gradient-text">Let's talk.</span>
          </h2>
          <p className="text-gray-500 text-base max-w-md mt-4 mx-auto lg:mx-0">
            Open to collaborations, side projects, and interesting engineering challenges.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left — links */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-4"
          >
            {contactLinks.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${c.color}08`
                  e.currentTarget.style.borderColor = `${c.color}25`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${c.color}15`, border: `1px solid ${c.color}25`, color: c.color }}
                >
                  {c.icon}
                </div>
                <div className="flex-1">
                  <p className="label-text">{c.label}</p>
                  <p className="text-white text-sm font-medium">{c.value}</p>
                </div>
                <FaArrowRight
                  className="text-xs text-gray-700 group-hover:text-gray-400 transition-all duration-300 group-hover:translate-x-1"
                />
              </a>
            ))}

            {/* Availability card */}
            <div
              className="p-5 rounded-2xl mt-2"
              style={{ background: 'rgba(123,47,255,0.08)', border: '1px solid rgba(123,47,255,0.2)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="label-text">Currently</span>
              </div>
              <p className="text-white text-sm font-medium">Python / Backend Developer @ Gravity Engineering Services</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Backend · Cloud · AI — always happy to talk shop
              </p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl space-y-5"
              style={{ background: 'rgba(12,12,26,0.75)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(24px)' }}
            >
              <p className="label-text">Send a Message</p>

              {[
                { name: 'name', type: 'text', placeholder: 'Your name' },
                { name: 'email', type: 'email', placeholder: 'your@email.com' },
              ].map((f) => (
                <input
                  key={f.name}
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                  placeholder={f.placeholder}
                  className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all duration-300 font-mono placeholder-gray-600"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(123,47,255,0.5)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
                />
              ))}

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell me about your project or opportunity..."
                className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all duration-300 font-mono placeholder-gray-600 resize-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(123,47,255,0.5)' }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
              />

              {status === 'success' && (
                <p className="text-emerald-400 text-sm font-mono">✓ Message sent successfully!</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-sm font-mono">✗ Failed. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #7B2FFF, #C084FC)',
                  boxShadow: '0 0 0 rgba(123,47,255,0)',
                }}
                onMouseEnter={(e) => { if (!sending) e.currentTarget.style.boxShadow = '0 0 30px rgba(123,47,255,0.4)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 0 rgba(123,47,255,0)' }}
              >
                {sending ? 'Sending...' : <>Send Message <FaArrowRight className="text-xs" /></>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
