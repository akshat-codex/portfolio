import { Suspense, useEffect, useState } from 'react'
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

/** Mount the 3D background only once the first screen has painted and the browser is idle. */
function useAfterFirstPaint() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let idle = 0
    let timer = 0
    const go = () => setReady(true)
    const schedule = () => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(go, { timeout: 1500 })
      else timer = window.setTimeout(go, 300)
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })
    return () => {
      window.removeEventListener('load', schedule)
      if (idle && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle)
      window.clearTimeout(timer)
    }
  }, [])
  return ready
}

function App() {
  const show3D = useAfterFirstPaint()
  return (
    <SmoothScroll>
      <Intro />
      <Cursor />
      {show3D ? (
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      ) : null}
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
