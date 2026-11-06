import { Link } from 'react-scroll'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

const Footer = () => (
  <footer className="relative px-6 lg:px-16 py-10 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <Link to="hero" smooth duration={800} className="cursor-pointer">
        <span
          style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, letterSpacing: '-0.02em' }}
          className="text-white text-xl"
        >
          AKS<span className="text-purple-400">.</span>
        </span>
      </Link>

      <p className="label-text">
        Akshat Kumar Srivastava · Python / Backend Developer · © 2026
      </p>

      <div className="flex items-center gap-4">
        {[
          { icon: <FaGithub />, href: 'https://github.com/akshat-codex' },
          { icon: <FaLinkedin />, href: 'https://linkedin.com/in/akshhatsrivastava' },
          { icon: <FaEnvelope />, href: 'mailto:akshsvt123@gmail.com' },
        ].map((s, i) => (
          <a
            key={i}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 text-sm"
            style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#555' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(123,47,255,0.4)'
              e.currentTarget.style.color = '#C084FC'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color = '#555'
            }}
          >
            {s.icon}
          </a>
        ))}
      </div>
    </div>
  </footer>
)

export default Footer
