// Single source of user-facing portfolio content.
// Copied verbatim from the section components in src/components/.
// JSX entities were decoded (&amp; -> &, &rsquo; -> ’); inline <time>/<span> markup
// was flattened to plain text, with machine values kept in separate fields.

// From Hero.jsx (CV_HREF, NAME_LINES, lede, Role/Focus/Base facts); email/phone from Contact.jsx;
// mobile-menu email + base from Navbar.jsx; footer name/role from Footer.jsx.
export const profile = {
  name: 'Akshat Kumar Srivastava',
  nameLines: ['AKSHAT KUMAR', 'SRIVASTAVA'],
  monogram: 'AKS', // Navbar.jsx logo
  role: 'Python Backend Developer',
  roleAlt: 'Python / Backend Developer', // Footer.jsx + Contact.jsx "Currently"
  company: 'Gravity Engineering Services',
  roleSince: 'Jun 2026',
  roleSinceDateTime: '2026-06',
  rolePeriod: 'Jun 2026 – present',
  location: 'Lucknow, India',
  focus: 'Django · FastAPI · Celery · Redis · PostgreSQL',
  lede:
    'Python backend developer building production SaaS and AI automation: the APIs, queues, PostgreSQL and mail infrastructure behind Polluxa SalesTech and Newton-AI.',
  email: 'akshsvt123@gmail.com',
  phone: '+91-9936382927',
  phoneHref: 'tel:+919936382927',
  social: {
    github: 'https://github.com/akshat-codex',
    linkedin: 'https://linkedin.com/in/akshhatsrivastava',
  },
  cvHref: '/Akshat_Srivastava_CV.pdf',
  cvDownloadName: 'Akshat_Srivastava_CV.pdf',
  cvLabel: 'Download CV',
  portrait: {
    src: '/akshat-cutout.webp',
    alt: 'Portrait of Akshat Kumar Srivastava',
    width: 1000,
    height: 1000,
  },
}

// From Hero.jsx `links` (identical list in Footer.jsx `links`).
export const heroLinks = [
  { label: 'GitHub', href: 'https://github.com/akshat-codex', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/akshhatsrivastava', external: true },
  { label: 'Email', href: 'mailto:akshsvt123@gmail.com', external: false },
]

// From Navbar.jsx `sections` (current order). `core` = shown in the bar from lg; others from xl.
export const navLinks = [
  { id: 'about', index: '01', label: 'About', href: '#about', core: true },
  { id: 'experience', index: '02', label: 'Experience', href: '#experience', core: true },
  { id: 'projects', index: '03', label: 'Projects', href: '#projects', core: true },
  { id: 'skills', index: '04', label: 'Skills', href: '#skills', core: false },
  { id: 'education', index: '05', label: 'Education', href: '#education', core: false },
  { id: 'certifications', index: '06', label: 'Certifications', href: '#certifications', core: false },
  { id: 'achievements', index: '07', label: 'Achievements', href: '#achievements', core: false },
  { id: 'contact', index: '08', label: 'Contact', href: '#contact', core: true },
]

// From About.jsx (STATEMENT, intro paragraph, facts, practice).
export const about = {
  index: '01',
  title: 'About',
  statement:
    'I build backends for production SaaS and AI automation, Polluxa SalesTech and Newton-AI: Django and FastAPI services, Celery and Redis queues, PostgreSQL, and SMTP/IMAP mail.',
  paragraph:
    'B.Tech CSE graduate (2026) and Python/Backend Developer at Gravity Engineering Services. Passionate about cloud-native systems, AI, and shipping things that work in the real world, debugged across the full API → database → queue → mail path.',
  facts: [
    {
      label: 'Now',
      live: true,
      value: 'Python Backend Developer',
      detail: 'Gravity Engineering Services, since Jun 2026',
      dateTime: '2026-06',
    },
    {
      label: 'Education',
      value: 'B.Tech Computer Science',
      detail: 'Babu Banarasi Das University, 2022–2026',
    },
    {
      label: 'CGPA',
      big: true,
      value: 8.97,
      decimals: 2,
      suffix: '/10',
      detail: 'First division with honours',
    },
    { label: 'Base', value: 'Lucknow, India', detail: 'Open to collaborations' },
  ],
  practiceHeading: 'Practice',
  practice: [
    {
      title: 'Backend Engineering',
      desc: 'Scalable REST APIs, microservices, and server-side systems using Python, Java, Node.js & Express.',
      tags: ['Python', 'Java', 'Node.js', 'REST APIs'],
    },
    {
      title: 'Cloud & AWS',
      desc: 'Serverless architectures, cloud deployment, and infrastructure design with AWS core services.',
      tags: ['Lambda', 'EC2', 'DynamoDB', 'API Gateway'],
    },
    {
      title: 'Full Stack Development',
      desc: 'End-to-end web apps using React on the frontend and Express/Node on the backend with MongoDB.',
      tags: ['React.js', 'MongoDB', 'Express', 'HTML/CSS'],
    },
    {
      title: 'AI / ML Solutions',
      desc: 'NLP pipelines, ML model training, and intelligent data analysis with Python-based frameworks.',
      tags: ['Scikit-Learn', 'NLP', 'TF-IDF', 'Flask'],
    },
  ],
}

// From Experience.jsx (role block, ROLE_STACK, STATIONS pipeline, WORK entries).
export const experience = {
  index: '02',
  title: 'Experience',
  roles: [
    {
      company: 'Gravity Engineering Services',
      role: 'Python Backend Developer',
      current: true,
      period: 'June 2026 – Present',
      periodStart: 'June 2026',
      periodStartDateTime: '2026-06',
      periodEnd: 'Present',
      employmentType: 'Full-Time',
      location: 'Lucknow, India',
      base: 'Full-Time · Lucknow, India',
      summary:
        'Building and maintaining scalable backend systems, REST APIs, and cloud-integrated services using Python. Contributing to real-world engineering solutions and microservice architecture.',
      stack: ['Python', 'Django', 'DRF', 'FastAPI', 'PostgreSQL', 'Celery', 'Redis', 'Docker', 'Linux', 'Git'],
    },
  ],
  pipeline: {
    intro: 'Follow a message through the Polluxa backend: the full API → DB → queue → mail path.',
    label: 'Polluxa · one message, six stations',
    stations: [
      { num: '01', name: 'API', role: 'DRF endpoints', caption: 'Django REST Framework endpoints for email, outreach, leads, pipeline, senders and inbox.' },
      { num: '02', name: 'Service', role: 'Business logic', caption: 'Business logic behind outreach, email warm-up and deliverability.' },
      { num: '03', name: 'PostgreSQL', role: 'Data layer', caption: 'PostgreSQL data modelling and investigation.' },
      { num: '04', name: 'Celery', role: 'Async workers', caption: 'Async workflows for automated email operations.' },
      { num: '05', name: 'Redis', role: 'Broker', caption: 'The broker behind the Celery + Redis async workflows.' },
      { num: '06', name: 'SMTP/IMAP', role: 'Send + mailbox', caption: 'The mail edge: production flows debugged across API → DB → Celery → Redis → SMTP/IMAP.' },
    ],
  },
  work: [
    {
      title: 'Polluxa SalesTech',
      descriptor: 'Production SaaS',
      category: 'Backend · Work',
      period: '2026 — Present',
      summary:
        'Backend APIs and business logic for a production sales-outreach SaaS — email, outreach, leads, pipeline, senders, inbox, warm-up and deliverability — built on Django REST Framework.',
      bullets: [
        'Celery + Redis async workflows for automated email operations',
        'Email warm-up and deliverability analysis (before/after comparison)',
        'Debugged production flows across API → DB → Celery → Redis → SMTP/IMAP',
        'PostgreSQL data modelling and investigation',
      ],
      tech: ['Python', 'Django', 'DRF', 'PostgreSQL', 'Celery', 'Redis', 'Docker'],
    },
    {
      title: 'Newton-AI',
      descriptor: 'LinkedIn SDR Automation',
      category: 'AI Automation · Work',
      period: '2026 — Present',
      summary:
        'FastAPI/Celery-based AI system that engages LinkedIn leads in automated SDR conversations, qualifies prospects and hands warm leads to sales — integrated with the Polluxa SalesTech platform.',
      bullets: [
        'Interest detection, intent classification and lead qualification',
        'Lifecycle states: interested, not interested, job seeker, ghosted, handed-off',
        'Human handoff workflows for leads needing sales intervention',
        'Reliable async FastAPI + Celery processing and inbound webhooks',
      ],
      tech: ['Python', 'FastAPI', 'Celery', 'Redis', 'Conversational AI', 'Webhooks'],
      link: 'https://grateful-joy-0dad9947f5.media.strapiapp.com/AI_Powered_Linked_In_Outreach_Automation_1271cf68cd.mp4',
      linkLabel: 'Watch demo ↗',
    },
  ],
}

// From Projects.jsx `projects` (num is derived there via index; kept here explicitly) and header copy.
export const projects = {
  index: '03',
  title: 'Projects',
  label: 'Selected projects · Nov 2025 – 2026',
  intro:
    'AI automation, ML, serverless, full-stack and Java backend builds, each traced from outcome to the stack it was built with.',
  hint: 'Hover to preview · click to open',
  githubLabel: 'Source on GitHub ↗',
  demoLabel: 'Demo ↗',
  items: [
    {
      num: '01',
      title: 'AI Lead Generation & Enrichment',
      category: 'AI Automation',
      period: '2026',
      cover: 0,
      summary:
        'Automated B2B lead discovery pipeline: finds target companies and decision-makers by industry, geography, size and title, then enriches and verifies contacts at scale.',
      bullets: [
        'Company research and decision-maker enrichment',
        'Large-scale dataset processing with company/person relationships',
        'Email verification via syntax, domain/MX checks and external services',
        'Redis caching to avoid repeated verification calls',
      ],
      tech: ['Python', 'Redis', 'Lead Enrichment', 'Data Validation', 'Automation'],
      github: 'https://github.com/akshat-codex/ai-lead-agent',
    },
    {
      num: '02',
      title: 'AI-Powered Fake Review Detection',
      category: 'AI / ML',
      period: 'Jun 2026',
      cover: 1,
      summary:
        'NLP + ML platform that authenticates product reviews in real-time using TF-IDF vectorization and Logistic Regression — deployed on cloud for public access.',
      bullets: [
        'High-accuracy classification via TF-IDF + Logistic Regression',
        'Real-time REST API built with Flask',
        'Confidence scoring and bulk analysis mode',
        'Automated analytics reports for decision-making',
      ],
      tech: ['Python', 'Flask', 'Scikit-Learn', 'NLP', 'TF-IDF', 'ML', 'REST API'],
    },
    {
      num: '03',
      title: 'Real-Time Visitor Analytics',
      category: 'AWS Serverless',
      period: 'Feb 2026',
      cover: 2,
      summary:
        'Fully serverless analytics pipeline on AWS — Lambda, DynamoDB, API Gateway — with IAM least-privilege controls and CloudWatch monitoring. Zero dedicated servers.',
      bullets: [
        'Event-driven Lambda processing with DynamoDB storage',
        'REST APIs for visitor event ingestion',
        'IAM least-privilege security model',
        'Auto-scaling — handles any load, zero ops overhead',
      ],
      tech: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'CloudWatch', 'IAM', 'Serverless'],
    },
    {
      num: '04',
      title: 'NewsXStudy — Full-Stack Platform',
      category: 'Full Stack',
      period: 'Nov 2025',
      cover: 3,
      summary:
        'Full-stack news aggregation and student productivity tool. React frontend, Node/Express backend, MongoDB data layer, real-time News API feeds, and a built-in study timer.',
      bullets: [
        'JWT auth, news bookmarking, category filters',
        'Live News API integration via async React Hooks',
        'Study timer + Pomodoro-style reminders',
        'MongoDB for user data and bookmark storage',
      ],
      tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'News API', 'JWT'],
    },
    {
      num: '05',
      title: 'Smart Employee Management',
      category: 'Backend · Java',
      period: 'Apr 2026',
      cover: 4,
      summary:
        'Java-based CRUD system for employee records management. JDBC + MySQL backend with OOP architecture and query-optimized data retrieval for performance at scale.',
      bullets: [
        'Full CRUD via JDBC + MySQL',
        'OOP-driven modular architecture',
        'Optimized SQL queries for bulk reads',
        'Clean separation of data and business layers',
      ],
      tech: ['Java', 'MySQL', 'JDBC', 'OOP', 'SQL'],
    },
  ],
}

// From Skills.jsx `groups` (in order).
export const skills = {
  index: '04',
  title: 'Skills',
  groups: [
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
  ],
}

// From Education.jsx (degree block, CGPA/SCALE, facts).
export const education = {
  index: '05',
  title: 'Education',
  degree: 'B.Tech Computer Science & Engineering',
  institution: 'Babu Banarasi Das University',
  location: 'Lucknow, India',
  cgpa: 8.97,
  scale: 10,
  facts: [
    { label: 'Period', value: '2022–2026' },
    { label: 'Division', value: 'First Division with Honours' },
    { label: 'Rank', value: '25th rank in 1st year, university-wide' },
    { label: 'Scholarship', value: 'Awarded for academic excellence' },
    { label: 'Core modules', value: 'DSA, OOP, DBMS, OS, Computer Networks' },
  ],
}

// From Certifications.jsx `certs`.
export const certifications = {
  index: '06',
  title: 'Certifications',
  items: [
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
  ],
}

// From Achievements.jsx `achievements`.
export const achievements = {
  index: '07',
  title: 'Achievements',
  items: [
    { title: '1st Place — Gaming', desc: 'College-level gaming competition winner' },
    { title: '25th University Rank', desc: '1st year, university-wide ranking' },
    { title: 'Excellence Scholarship', desc: 'Awarded for academic performance' },
    { title: 'NSS Photography Lead', desc: 'Led & coordinated 5+ events' },
    { title: 'TechXplore Participant', desc: 'University coding & tech competition' },
    { title: 'DSA Practice', desc: 'LeetCode & GeeksForGeeks problems' },
    { title: 'Tech Events Volunteer', desc: 'University event coordination' },
    { title: 'CGPA 8.97 / 10', desc: 'First Division with Honours' },
  ],
}

// From Contact.jsx (headline, copy, contactLinks, "Currently" line, form fields, status messages).
export const contact = {
  index: '08',
  title: 'Contact',
  headline: ['LET’S', 'TALK'],
  headlineAriaLabel: 'Let’s talk. Email akshsvt123@gmail.com',
  headlineHref: 'mailto:akshsvt123@gmail.com',
  lede: 'Open to collaborations, side projects, and interesting engineering challenges.',
  links: [
    { label: 'Email', value: 'akshsvt123@gmail.com', href: 'mailto:akshsvt123@gmail.com' },
    { label: 'Phone', value: '+91-9936382927', href: 'tel:+919936382927', num: true },
    { label: 'LinkedIn', value: 'linkedin.com/in/akshhatsrivastava', href: 'https://linkedin.com/in/akshhatsrivastava' },
    { label: 'GitHub', value: 'github.com/akshat-codex', href: 'https://github.com/akshat-codex' },
  ],
  currently: {
    label: 'Currently',
    value: 'Python / Backend Developer @ Gravity Engineering Services',
  },
  form: {
    heading: 'Send a message',
    fields: [
      { name: 'name', type: 'text', label: 'Name', autoComplete: 'name', placeholder: 'Your name', required: true },
      { name: 'email', type: 'email', label: 'Email', autoComplete: 'email', placeholder: 'your@email.com', required: true },
      {
        name: 'message',
        type: 'textarea',
        label: 'Message',
        rows: 5,
        placeholder: 'Tell me about your project or opportunity...',
        required: true,
      },
    ],
    submitLabel: 'Send message',
    sendingLabel: 'Sending…',
    successMessage: 'Message sent. I’ll reply to your email soon.',
    errorMessage: 'The message could not be sent. Please try again, or email akshsvt123@gmail.com directly.',
    statusResetMs: 5000,
  },
}

// From Footer.jsx (closing line, name/role, links, copyright, back-to-top).
export const footer = {
  closing: ['LET’S', 'BUILD'],
  closingHref: '#contact',
  closingAriaLabel: "Let's build: go to 08 Contact",
  name: 'Akshat Kumar Srivastava',
  role: 'Python / Backend Developer',
  links: [
    { label: 'GitHub', href: 'https://github.com/akshat-codex', external: true },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/akshhatsrivastava', external: true },
    { label: 'Email', href: 'mailto:akshsvt123@gmail.com', external: false },
  ],
  copyright: '© 2026',
  backToTop: { label: 'Back to top', href: '#top' },
}

// Small UI strings that don't belong to a single section (Hero.jsx scroll cue, Navbar.jsx menu, Skills.jsx readout).
export const uiStrings = {
  scrollCue: { label: 'Scroll', target: '01 About', href: '#about', ariaLabel: 'Scroll to 01 About' },
  nowMarker: 'Now',
  navHomeAriaLabel: 'Akshat Kumar Srivastava, back to top',
  menuOpen: 'Menu',
  menuClose: 'Close',
  projectClose: 'Close · Esc',
  generativeCover: 'Generative cover',
  builtWith: 'Built with',
  stack: 'Stack',
  skillsReadout: {
    groups: 'Groups',
    reading: 'Reading',
    group: 'Group',
    idleHint: 'Point at any entry',
    calmHint: 'Full index',
    entriesSuffix: 'entries',
  },
}
