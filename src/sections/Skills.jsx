import LogoLoop from '@/components/vendor/reactbits/LogoLoop'
import MagicBento from '@/components/vendor/reactbits/MagicBento'
import {
  SiPython, SiDjango, SiFastapi, SiFlask, SiPostgresql, SiRedis, SiCelery, SiDocker, SiLinux, SiGit,
  SiReact, SiNodedotjs, SiExpress, SiMongodb, SiMysql, SiScikitlearn, SiPostman, SiNextdotjs, SiJavascript,
} from 'react-icons/si'
import { FaAws, FaJava } from 'react-icons/fa'
import SectionTitle from './SectionTitle'
import { skills } from '@/data/content'

const LOGOS = [
  [SiPython, 'Python'], [SiDjango, 'Django'], [SiFastapi, 'FastAPI'], [SiPostgresql, 'PostgreSQL'],
  [SiRedis, 'Redis'], [SiCelery, 'Celery'], [SiDocker, 'Docker'], [FaAws, 'AWS'], [SiLinux, 'Linux'],
  [SiFlask, 'Flask'], [SiScikitlearn, 'Scikit-Learn'], [FaJava, 'Java'], [SiJavascript, 'JavaScript'],
  [SiNodedotjs, 'Node.js'], [SiExpress, 'Express.js'], [SiMongodb, 'MongoDB'], [SiMysql, 'MySQL'],
  [SiReact, 'React.js'], [SiNextdotjs, 'Next.js'], [SiGit, 'Git'], [SiPostman, 'Postman'],
].map(([Icon, title]) => ({ node: <Icon aria-hidden="true" />, title, ariaLabel: title }))

// Bento layout: Backend is the hero tile; Cloud spans two columns. Order matches the grid flow.
const LAYOUT = {
  Backend: { colSpan: 2, rowSpan: 2 },
  'Cloud & Infra': { colSpan: 2 },
}
const ORDER = ['Backend', 'Languages', 'Async & Distributed', 'Databases', 'AI & Automation', 'Cloud & Infra', 'Frontend', 'Tools']

function GroupVisual({ group, big }) {
  return (
    <ul className={`flex flex-wrap content-start gap-1.5 ${big ? 'gap-2' : ''}`}>
      {group.items.map((it) => (
        <li
          key={it}
          className={`rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-medium text-paper/85 ${
            big ? 'text-sm' : 'text-xs'
          }`}
        >
          {it}
        </li>
      ))}
    </ul>
  )
}

export default function Skills() {
  const groups = ORDER.map((n) => skills.groups.find((g) => g.name === n)).filter(Boolean)
  const items = groups.map((g) => ({
    title: g.name,
    description: `${g.items.length} ${g.items.length === 1 ? 'entry' : 'entries'}`,
    visual: <GroupVisual group={g} big={g.name === 'Backend'} />,
    ...(LAYOUT[g.name] ?? null),
  }))

  return (
    <section id="skills" className="relative overflow-hidden py-28 lg:py-40">
      <div className="shell">
        <SectionTitle index={skills.index} title={skills.title} kicker="The stack" />
      </div>

      {/* React Bits · Logo Loop — draggable marquee that speeds up with scroll */}
      <div className="mt-14 text-paper/70 [&_li]:transition-colors [&_li:hover]:text-signal">
        <LogoLoop
          logos={LOGOS}
          speed={70}
          logoHeight={40}
          gap={56}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutWidth={0.15}
          scrollBoost={1.5}
          ariaLabel="Technologies I work with"
        />
      </div>

      {/* React Bits · Magic Bento — spotlight + border glow following the cursor */}
      <div className="shell mt-14">
        <MagicBento
          items={items}
          columns={4}
          rowHeight={190}
          gap={14}
          radius={26}
          theme="dark"
          glowColor="#ff4d00"
          textAutoHide={false}
          enableStars
          particleCount={10}
          enableSpotlight
          enableBorderGlow
          spotlightRadius={320}
          clickEffect
        />
      </div>
    </section>
  )
}
