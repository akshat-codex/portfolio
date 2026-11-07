import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import DataField from './DataField'
import { useReducedMotionPref } from './prefs'

/**
 * 3D neural network background (three.js).
 *
 * - ~340 graph nodes wired layer-to-layer, plus a halo of ambient particles.
 * - Every node has two homes: a brain-like sphere and a layered network diagram
 *   (input -> hidden -> output). Scroll morphs between them, entirely on the GPU.
 * - Synapse pulses (orange) fire along the connections; nodes flicker as they "activate".
 * - Pointer tilts the network; scroll velocity speeds the signals; entering a section sends a pulse.
 * - Fallbacks: reduced motion or no WebGL -> the 2D DataField (static frame under reduced motion).
 */

const INK = new THREE.Color('#0b0b0c')

const LAYERS = 7
const PER_LAYER = 48
const RADIUS = 4.2

const shared = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  attribute vec3 aSphere;
  attribute vec3 aNet;
  attribute float aSeed;
  vec3 place() {
    float m = smoothstep(0.0, 1.0, uMorph);
    vec3 p = mix(aSphere, aNet, m);
    // organic breathing so it never looks static
    p += 0.12 * vec3(
      sin(uTime * 0.7 + aSeed * 12.0),
      sin(uTime * 0.6 + aSeed * 7.0),
      sin(uTime * 0.5 + aSeed * 3.0)
    );
    return p;
  }
`

const nodeVertex = /* glsl */ `
  ${shared}
  uniform float uPixel;
  uniform float uPulse;
  attribute float aSize;
  varying float vFire;
  varying float vDepth;
  varying float vOrange;
  void main() {
    vec4 mv = modelViewMatrix * vec4(place(), 1.0);
    gl_Position = projectionMatrix * mv;
    // activation: each node fires on its own rhythm
    float f = pow(0.5 + 0.5 * sin(uTime * (1.2 + aSeed * 1.8) + aSeed * 40.0), 12.0);
    vFire = f + uPulse * 0.6;
    vOrange = step(0.9, fract(aSeed * 57.3));
    vDepth = -mv.z;
    gl_PointSize = aSize * uPixel * (1.0 + f * 1.6) * (28.0 / -mv.z);
  }
`

const nodeFragment = /* glsl */ `
  varying float vFire;
  varying float vDepth;
  varying float vOrange;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(core, 2.2);
    vec3 paper = vec3(0.949, 0.945, 0.925);
    vec3 orange = vec3(1.0, 0.36, 0.06);
    vec3 col = mix(paper, orange, clamp(vOrange + vFire * 0.8, 0.0, 1.0));
    float fade = 1.0 - smoothstep(10.0, 30.0, vDepth);
    gl_FragColor = vec4(col * glow * (0.55 + vFire * 1.4) * fade, 1.0);
  }
`

const edgeVertex = /* glsl */ `
  ${shared}
  attribute float aT;      // 0 at the source node, 1 at the target node
  attribute float aEdge;   // per-edge random
  varying float vT;
  varying float vEdge;
  varying float vDepth;
  void main() {
    vec4 mv = modelViewMatrix * vec4(place(), 1.0);
    gl_Position = projectionMatrix * mv;
    vT = aT;
    vEdge = aEdge;
    vDepth = -mv.z;
  }
`

const edgeFragment = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uPulse;
  varying float vT;
  varying float vEdge;
  varying float vDepth;
  void main() {
    // a signal travelling source -> target, each edge on its own phase
    float head = fract(uTime * uSpeed * (0.25 + vEdge * 0.35) + vEdge * 9.0);
    float dist = vT - head;
    float pulse = smoothstep(-0.18, 0.0, dist) * (1.0 - smoothstep(0.0, 0.02, dist));
    pulse *= step(0.55, fract(vEdge * 31.7));              // not every edge fires at once
    vec3 base = vec3(0.949, 0.945, 0.925) * (0.05 + uPulse * 0.08);
    vec3 sig = vec3(1.0, 0.40, 0.08) * pulse * 1.6;
    float fade = 1.0 - smoothstep(10.0, 30.0, vDepth);
    gl_FragColor = vec4((base + sig) * fade, 1.0);
  }
`

const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixel;
  attribute float aSeed;
  varying float vA;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.2 + aSeed * 20.0) * 0.3;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vA = 0.25 + 0.75 * fract(aSeed * 13.1);
    gl_PointSize = uPixel * 1.6 * (20.0 / -mv.z);
  }
`
const dustFragment = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vec3(0.949, 0.945, 0.925) * smoothstep(0.5, 0.0, d) * 0.35 * vA, 1.0);
  }
`

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

function buildGraph(rand) {
  const count = LAYERS * PER_LAYER
  const sphere = new Float32Array(count * 3)
  const net = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const sizes = new Float32Array(count)
  const COLS = 6
  const ROWS = PER_LAYER / COLS
  for (let l = 0; l < LAYERS; l++) {
    for (let j = 0; j < PER_LAYER; j++) {
      const i = l * PER_LAYER + j
      // sphere home: each layer is a latitude band, so layer-to-layer edges stay short on the sphere too
      const phi = ((l + 0.5 + (rand() - 0.5) * 0.8) / LAYERS) * Math.PI
      const theta = (j / PER_LAYER) * Math.PI * 2 + rand() * 0.25
      const r = RADIUS * (0.92 + rand() * 0.16)
      sphere[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      sphere[i * 3 + 1] = r * Math.cos(phi)
      sphere[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      // network home: layers are vertical slabs left -> right; middle layers wider like a real net
      const width = 1 - Math.abs(l - (LAYERS - 1) / 2) / LAYERS
      const col = j % COLS
      const row = Math.floor(j / COLS)
      net[i * 3] = (l - (LAYERS - 1) / 2) * 2.1
      net[i * 3 + 1] = (row - (ROWS - 1) / 2) * 0.62 * (0.6 + width)
      net[i * 3 + 2] = (col - (COLS - 1) / 2) * 0.62 * (0.6 + width)
      seeds[i] = rand()
      sizes[i] = 0.9 + rand() * 1.4
    }
  }
  // edges: every node feeds three nodes in the next layer
  const pairs = []
  for (let l = 0; l < LAYERS - 1; l++) {
    for (let j = 0; j < PER_LAYER; j++) {
      const a = l * PER_LAYER + j
      const targets = [j, (j + 1) % PER_LAYER, Math.floor(rand() * PER_LAYER)]
      for (const t of targets) pairs.push([a, (l + 1) * PER_LAYER + t])
    }
  }
  return { count, sphere, net, seeds, sizes, pairs }
}

export default function Scene3D() {
  const reduce = useReducedMotionPref()
  const mountRef = useRef(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    if (reduce) return undefined
    if (!webglAvailable()) {
      setFallback(true)
      return undefined
    }
    const mount = mountRef.current
    if (!mount) return undefined

    const small = window.matchMedia('(max-width: 767px)').matches
    const fine = window.matchMedia('(pointer: fine)').matches

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: false, powerPreference: 'high-performance' })
    } catch {
      setFallback(true)
      return undefined
    }
    const pixel = Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5)
    renderer.setPixelRatio(pixel)
    renderer.setClearColor(INK, 1)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(0, 0, 14)

    let s = 20260611
    const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    const g = buildGraph(rand)

    const uniforms = {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uPixel: { value: pixel },
      uPulse: { value: 0 },
      uSpeed: { value: 1 },
    }
    const additive = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }

    // nodes
    const nodeGeo = new THREE.BufferGeometry()
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(g.sphere.slice(), 3)) // bounds only
    nodeGeo.setAttribute('aSphere', new THREE.BufferAttribute(g.sphere, 3))
    nodeGeo.setAttribute('aNet', new THREE.BufferAttribute(g.net, 3))
    nodeGeo.setAttribute('aSeed', new THREE.BufferAttribute(g.seeds, 1))
    nodeGeo.setAttribute('aSize', new THREE.BufferAttribute(g.sizes, 1))
    const nodeMat = new THREE.ShaderMaterial({ vertexShader: nodeVertex, fragmentShader: nodeFragment, uniforms, ...additive })
    const nodes = new THREE.Points(nodeGeo, nodeMat)
    nodes.frustumCulled = false

    // edges (each vertex carries its node's two homes, so edges morph with the nodes)
    const E = g.pairs.length
    const eSphere = new Float32Array(E * 6)
    const eNet = new Float32Array(E * 6)
    const eSeed = new Float32Array(E * 2)
    const eT = new Float32Array(E * 2)
    const eRand = new Float32Array(E * 2)
    g.pairs.forEach(([a, b], k) => {
      for (let v = 0; v < 2; v++) {
        const n = v === 0 ? a : b
        for (let c = 0; c < 3; c++) {
          eSphere[k * 6 + v * 3 + c] = g.sphere[n * 3 + c]
          eNet[k * 6 + v * 3 + c] = g.net[n * 3 + c]
        }
        eSeed[k * 2 + v] = g.seeds[n]
        eT[k * 2 + v] = v
      }
      const r = rand()
      eRand[k * 2] = r
      eRand[k * 2 + 1] = r
    })
    const edgeGeo = new THREE.BufferGeometry()
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(eSphere.slice(), 3))
    edgeGeo.setAttribute('aSphere', new THREE.BufferAttribute(eSphere, 3))
    edgeGeo.setAttribute('aNet', new THREE.BufferAttribute(eNet, 3))
    edgeGeo.setAttribute('aSeed', new THREE.BufferAttribute(eSeed, 1))
    edgeGeo.setAttribute('aT', new THREE.BufferAttribute(eT, 1))
    edgeGeo.setAttribute('aEdge', new THREE.BufferAttribute(eRand, 1))
    const edgeMat = new THREE.ShaderMaterial({ vertexShader: edgeVertex, fragmentShader: edgeFragment, uniforms, ...additive })
    const edges = new THREE.LineSegments(edgeGeo, edgeMat)
    edges.frustumCulled = false

    const brain = new THREE.Group()
    brain.add(edges, nodes)
    scene.add(brain)

    // ambient dust halo
    const DUST = small ? 600 : 1600
    const dPos = new Float32Array(DUST * 3)
    const dSeed = new Float32Array(DUST)
    for (let i = 0; i < DUST; i++) {
      const r = 6 + rand() * 18
      const th = rand() * Math.PI * 2
      const ph = Math.acos(2 * rand() - 1)
      dPos[i * 3] = r * Math.sin(ph) * Math.cos(th)
      dPos[i * 3 + 1] = r * Math.cos(ph) * 0.6
      dPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 6
      dSeed[i] = rand()
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3))
    dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(dSeed, 1))
    const dustMat = new THREE.ShaderMaterial({ vertexShader: dustVertex, fragmentShader: dustFragment, uniforms, ...additive })
    const dust = new THREE.Points(dustGeo, dustMat)
    scene.add(dust)

    // ---- input ----
    const ndc = new THREE.Vector2(0, 0)
    const target = new THREE.Vector2(0, 0)
    const onMove = (e) => target.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
    if (fine) window.addEventListener('pointermove', onMove, { passive: true })

    let velocity = 0
    let lastY = window.scrollY
    const onVelocity = (e) => { velocity = e.detail?.velocity ?? velocity }
    window.addEventListener('fx:velocity', onVelocity)

    let pulse = 0
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) pulse = 1 }),
      { threshold: 0.35 },
    )
    document.querySelectorAll('section[id]').forEach((el) => io.observe(el))

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      // keep the brain off the text on desktop (right side, behind the portrait); centred and smaller on phones
      // centred behind the portrait, like a halo of the network around the head
      brain.position.set(0, w >= 1024 ? 0.4 : 1.2, -2)
      brain.scale.setScalar(w >= 1024 ? 1 : 0.72)
    }
    resize()
    window.addEventListener('resize', resize)

    const clock = new THREE.Clock()
    let raf = 0
    let spin = 0
    let morph = 0
    let skip = false
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (document.hidden) return
      if (small) { skip = !skip; if (skip) return }
      const dt = Math.min(clock.getDelta(), 0.1)
      const t = clock.elapsedTime

      const y = window.scrollY
      const v = Math.max(Math.abs(velocity), Math.abs(y - lastY) * 0.5)
      lastY = y
      velocity *= 0.9
      const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const prog = y / docH

      // sphere at the top, full network through the work sections, back to a sphere at the close
      const goal = Math.sin(Math.min(1, prog * 1.15) * Math.PI)
      morph += (goal - morph) * 0.05
      uniforms.uMorph.value = morph

      spin += dt * (0.08 + Math.min(v, 60) * 0.004) * (1 - morph * 0.7)
      ndc.lerp(target, 0.05)
      brain.rotation.y = spin + ndc.x * 0.35
      brain.rotation.x = -ndc.y * 0.25 + Math.sin(t * 0.2) * 0.05
      dust.rotation.y = -spin * 0.3
      camera.position.z = 14 - morph * 2

      pulse *= 0.94
      uniforms.uTime.value = t
      uniforms.uPulse.value = pulse
      uniforms.uSpeed.value = 1 + Math.min(v, 60) * 0.03

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('fx:velocity', onVelocity)
      if (fine) window.removeEventListener('pointermove', onMove)
      io.disconnect()
      nodeGeo.dispose(); nodeMat.dispose(); edgeGeo.dispose(); edgeMat.dispose(); dustGeo.dispose(); dustMat.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [reduce])

  if (reduce || fallback) return <DataField />
  return <div ref={mountRef} className="fixed inset-0 z-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full" aria-hidden="true" />
}
