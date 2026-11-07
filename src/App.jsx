import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Certifications from './components/Certifications'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { SmoothScroll, Intro, Cursor, Scene3D, LightLayer } from './components/fx'

function App() {
  return (
    <SmoothScroll>
      <Intro />
      <Cursor />
      <Scene3D />
      <LightLayer />
      <div className="relative min-h-screen font-sans text-paper">
        <Navbar />
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
    </SmoothScroll>
  )
}

export default App
