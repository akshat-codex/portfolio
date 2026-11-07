# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A mix of two audiences, both of whom must be served on the same page:

- **Recruiters and hiring managers** screening Python/backend engineers. They skim fast, on desktop and phone, and want proof of production work within seconds.
- **Engineers and tech leads** judging depth. They look for real systems (async pipelines, queues, email infrastructure, AI automation), how problems were debugged, and code on GitHub.

## Product Purpose

The personal portfolio of Akshat Kumar Srivastava, a Python backend developer at Gravity Engineering Services (June 2026 – present). It exists to show off everything at once: the production work, the details behind it, and the craft of the site itself. The animation and motion are part of the showcase, not decoration; the site should demonstrate that its author ships polished, considered work.

Success: a visitor leaves understanding what Akshat builds (production SaaS backends and AI automation), believing it is real, and impressed by how it was presented. They can then download the CV, open GitHub or LinkedIn, or send a message.

## Positioning

Not a generic student portfolio. The differentiator is real production experience early in a career: backend work on Polluxa SalesTech (a live sales-outreach SaaS) and Newton-AI (an AI LinkedIn SDR system), covering Django/DRF, FastAPI, Celery, Redis, PostgreSQL and SMTP/IMAP debugging across the full API → DB → queue → mail path.

## Operating Context

- Deployed as a static Vite + React 18 site on Vercel at https://portfolio-akshat-srivastava.vercel.app/ from github.com/akshat-codex/portfolio.
- Linked from the CV PDF, LinkedIn and GitHub; visitors often arrive from a recruiter pipeline or a LinkedIn profile.
- Single page with sections: Hero, About, Skills, Projects, Education, Certifications, Achievements, Contact, Footer.

## Capabilities and Constraints

- Stack in place: Vite 5, React 18, Tailwind CSS 3, Framer Motion 11, react-scroll, react-type-animation, react-icons, Three.js. No backend; must stay static-hostable on Vercel.
- Contact form posts directly to Web3Forms from the browser (key in `src/components/Contact.jsx`).
- CV download serves `public/Akshat_Srivastava_CV.pdf`.
- Must work well on phones as well as desktop.

## Brand Commitments

- The portrait photo `public/akshat.jpg` stays.
- Everything else about the current look (palette, fonts, "AKS." mark, terminal styling, particle/gradient backgrounds) is replaceable. Only the content is fixed.

## Evidence on Hand

- CV: `public/Akshat_Srivastava_CV.pdf` (source of truth for experience, projects, skills, education).
- Newton-AI demo video: https://grateful-joy-0dad9947f5.media.strapiapp.com/AI_Powered_Linked_In_Outreach_Automation_1271cf68cd.mp4
- AI lead generation repo: https://github.com/akshat-codex/ai-lead-agent
- Profiles: github.com/akshat-codex, linkedin.com/in/akshhatsrivastava, akshsvt123@gmail.com, +91-9936382927.
- Education: B.Tech CSE, Babu Banarasi Das University, Lucknow, 2022–2026, CGPA 8.97/10, first division with honours, 25th rank in first year, academic scholarship.
- Absent, and must not be fabricated: testimonials, client logos, metrics/benchmarks for the work projects, screenshots of Polluxa or Newton-AI, certifications beyond those in the CV (AWS Solutions Architect – Associate is in preparation, not held).

## Product Principles

1. Real work first: production experience at Gravity leads; academic projects support it.
2. Skimmable in seconds, deep on demand: every section reads at a glance, with detail available for engineers who dig in.
3. Motion is evidence of craft: every animation must feel deliberate and smooth, never noisy or gratuitous.
4. Truthful: claims match the CV; nothing is inflated or invented.
5. Fast and accessible: respects reduced-motion preferences and stays quick on mobile.

## Accessibility & Inclusion

Honour `prefers-reduced-motion` for all non-essential animation; keep text contrast at WCAG AA on the dark theme; keyboard-reachable navigation, links and form.
