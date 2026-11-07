import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * WebGL "liquid" overlay for the hero name.
 * Draws every letter of the h1 (at its exact DOM position) into a texture, then renders it
 * through a shader: noise displacement + bulge + an orange/paper chromatic split around the
 * cursor, and a faint idle ripple. The DOM text stays in place for accessibility and is
 * faded out only once the overlay has drawn its first frame.
 */
const PAD = 48 // bleed so displaced pixels are not clipped

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`
const frag = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform vec2 uMouse;
  uniform vec2 uVel;
  uniform float uHover;
  uniform float uTime;
  uniform float uAspect;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }

  void main() {
    vec2 uv = vUv;
    vec2 q = vec2((uv.x - uMouse.x) * uAspect, uv.y - uMouse.y);
    float d = length(q);
    float s = uHover * smoothstep(0.32, 0.0, d);

    // liquid: flowing noise displacement concentrated around the cursor
    float n1 = noise(uv * vec2(9.0, 4.0) + uTime * 0.6);
    float n2 = noise(uv * vec2(7.0, 5.0) - uTime * 0.5 + 3.1);
    vec2 off = (vec2(n1, n2) - 0.5) * 0.06 * s;
    // bulge away from the cursor, dragged by its velocity
    off -= normalize(q + 1e-4) * 0.025 * s * vec2(1.0 / uAspect, 1.0);
    off -= uVel * 0.6 * s;
    // idle shimmer everywhere
    off.y += sin(uv.x * 18.0 + uTime * 1.4) * 0.0012;

    vec2 dir = normalize(q + 1e-4) * vec2(1.0 / uAspect, 1.0);
    vec2 split = dir * (0.004 + 0.012 * s) + uVel * 0.25;

    float a0 = texture2D(uTex, uv + off).a;
    float ar = texture2D(uTex, uv + off + split).a;
    float ab = texture2D(uTex, uv + off - split).a;

    vec3 paper = vec3(0.949, 0.945, 0.925);
    vec3 orange = vec3(1.0, 0.302, 0.0);
    vec3 col = paper * a0 + orange * max(ar - a0, 0.0) * (0.4 + s) + paper * 0.35 * max(ab - a0, 0.0) * s;
    float alpha = max(a0, max(ar * (0.4 + s), ab * 0.35 * s));
    gl_FragColor = vec4(col, alpha);
  }
`

export function liquidSupported() {
  try {
    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')
    return !!ctx && 'fontStretch' in ctx && !!(c.getContext && document.createElement('canvas').getContext('webgl'))
  } catch {
    return false
  }
}

const stretchKeyword = (v) => {
  const n = parseFloat(v)
  if (Number.isNaN(n)) return 'normal'
  if (n >= 200) return 'ultra-expanded'
  if (n >= 150) return 'extra-expanded'
  if (n >= 125) return 'expanded'
  if (n >= 112.5) return 'semi-expanded'
  return 'normal'
}

export default function LiquidName({ h1Ref, getLetters, onReady }) {
  const wrapRef = useRef(null)

  useEffect(() => {
    const h1 = h1Ref.current
    const wrap = wrapRef.current
    if (!h1 || !wrap) return undefined

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, premultipliedAlpha: false })
    } catch {
      return undefined
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    renderer.setPixelRatio(dpr)
    renderer.setClearColor(0x000000, 0)
    wrap.appendChild(renderer.domElement)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

    const textCanvas = document.createElement('canvas')
    const tex = new THREE.CanvasTexture(textCanvas)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = false

    const uniforms = {
      uTex: { value: tex },
      uMouse: { value: new THREE.Vector2(-2, -2) },
      uVel: { value: new THREE.Vector2(0, 0) },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uAspect: { value: 1 },
    }
    const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat)
    const scene = new THREE.Scene()
    scene.add(quad)
    const cam = new THREE.Camera()

    let W = 0
    let H = 0
    const draw = () => {
      const base = h1.getBoundingClientRect()
      // the overlay lives inside the (possibly scaled) h1, so draw in untransformed layout px
      const scale = h1.offsetWidth ? base.width / h1.offsetWidth : 1
      W = Math.ceil(h1.offsetWidth + PAD * 2)
      H = Math.ceil(h1.offsetHeight + PAD * 2)
      renderer.setSize(W, H, false)
      uniforms.uAspect.value = W / H
      textCanvas.width = Math.ceil(W * dpr)
      textCanvas.height = Math.ceil(H * dpr)
      const ctx = textCanvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const el of getLetters()) {
        if (!el) continue
        const r = el.getBoundingClientRect()
        const cs = getComputedStyle(el)
        ctx.fontStretch = stretchKeyword(cs.fontStretch)
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
        const cx = (r.left - base.left + r.width / 2) / scale + PAD
        const cy = (r.top - base.top + r.height / 2) / scale + PAD
        ctx.fillText(el.dataset.char || el.textContent, cx, cy)
      }
      tex.needsUpdate = true
    }

    let ready = false
    let raf = 0
    let hover = 0
    let inside = false
    const mouse = new THREE.Vector2(-2, -2)
    const smooth = new THREE.Vector2(-2, -2)
    const prev = new THREE.Vector2(-2, -2)
    const clock = new THREE.Clock()
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (document.hidden) return
      const t = clock.getElapsedTime()
      hover += ((inside ? 1 : 0) - hover) * 0.08
      prev.copy(smooth)
      smooth.lerp(mouse, 0.18)
      uniforms.uMouse.value.copy(smooth)
      uniforms.uVel.value.set((smooth.x - prev.x) * 0.5, (smooth.y - prev.y) * 0.5)
      uniforms.uHover.value = hover
      uniforms.uTime.value = t
      renderer.render(scene, cam)
      if (!ready) {
        ready = true
        onReady?.(true)
      }
    }

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = 1 - (e.clientY - r.top) / r.height
      mouse.set(x, y)
      inside = x > -0.05 && x < 1.05 && y > -0.2 && y < 1.2
    }
    const onLeave = () => { inside = false }

    const start = () => {
      draw()
      tick()
    }
    // wait for the display face so the texture matches the DOM text
    ;(document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(start))

    const ro = new ResizeObserver(() => { if (ready) draw() })
    ro.observe(h1)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      onReady?.(false)
      tex.dispose(); mat.dispose(); quad.geometry.dispose(); renderer.dispose()
      if (renderer.domElement.parentNode === wrap) wrap.removeChild(renderer.domElement)
    }
  }, [h1Ref, getLetters, onReady])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ left: -PAD, top: -PAD, right: -PAD, bottom: -PAD }}
    />
  )
}
