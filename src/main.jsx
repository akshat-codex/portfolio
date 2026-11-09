import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/unbounded/wght.css'
import '@fontsource-variable/syne/wght.css' // hero name
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Dev only: `?scrollto=<section-id>` jumps there after load (for screenshots; Lenis ignores #hash on load).
if (import.meta.env.DEV) {
  const target = new URLSearchParams(window.location.search).get('scrollto')
  if (target) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const el = document.getElementById(target)
        if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40)
      }, 1500)
    })
  }
}
