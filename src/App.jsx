import { SmoothScroll, Intro } from './components/fx'
import TargetCursor from './components/vendor/reactbits/TargetCursor'
import { ProgressiveBlur } from './components/vendor/skiper/skiper41'
import Nav from './sections/Nav'
import Hero from './sections/Hero'
import About from './sections/About'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Education from './sections/Education'
import Certifications from './sections/Certifications'
import Achievements from './sections/Achievements'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import ScrollProgress from './sections/ScrollProgress'

/**
 * Portfolio, built from three component libraries:
 *  - React Bits: Liquid Ether, Text Pressure, Target Cursor, Scroll Reveal, Count Up, Logo Loop, Magic Bento
 *  - Aceternity UI: Resizable Navbar, Flip Words, Magnetic Button, Timeline, Expandable Card, Background Beams
 *  - Skiper UI: Text Roll (#58), Line Path (#19), Sticky Cards (#16), Coverflow (#47), Progressive Blur (#41),
 *    Scroll Progress (#89)
 */
function App() {
  return (
    <SmoothScroll>
      <Intro />
      {/* React Bits · Target Cursor: brackets lock onto links/buttons (fine pointers only) */}
      <TargetCursor
        targetSelector="a, button, .cursor-target"
        cursorColor="#f2f1ec"
        cursorColorOnTarget="#ff4d00"
        spinDuration={3}
        showLabel={false}
      />
      <div className="relative min-h-screen bg-ink font-sans text-paper">
        <Nav />
        <main>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Education />
          <Certifications />
          <Achievements />
          <Contact />
        </main>
        <Footer />
      </div>
      <ScrollProgress />
      {/* Skiper UI #41 · progressive blur on the bottom edge of the viewport */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-20">
        <ProgressiveBlur position="bottom" backgroundColor="#0b0b0c" height="80px" blurAmount="6px" />
      </div>
    </SmoothScroll>
  )
}

export default App
