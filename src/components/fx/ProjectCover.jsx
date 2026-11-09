import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Generative project covers (abstract, not screenshots). One shader, five patterns:
 *  0 network     - drifting nodes wired together (AI / lead enrichment)
 *  1 classifier  - token rows scanned and flagged (NLP review detection)
 *  2 analytics   - live histogram + trace line (serverless analytics)
 *  3 feed        - columns of article blocks streaming (news platform)
 *  4 records     - table cells pulsing like queries (employee DB)
 * `kind` changes cross-dissolve through noise. `velocity` (px/frame) bends the image.
 */
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`
const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uFrom;
  uniform float uTo;
  uniform float uMix;
  uniform vec2 uVel;
  uniform float uAspect;
  varying vec2 vUv;

  const vec3 INK = vec3(0.043, 0.043, 0.047);
  const vec3 PAPER = vec3(0.949, 0.945, 0.925);
  const vec3 ORANGE = vec3(1.0, 0.302, 0.0);

  float h1(float n) { return fract(sin(n * 127.1) * 43758.5453); }
  float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(h2(i), h2(i + vec2(1, 0)), u.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), u.x), u.y);
  }
  float seg(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * t);
  }

  vec3 network(vec2 uv) {
    vec2 p = vec2(uv.x * uAspect, uv.y);
    vec3 c = INK;
    vec2 pts[10];
    for (int i = 0; i < 10; i++) {
      float f = float(i);
      pts[i] = vec2((0.1 + 0.8 * h1(f + 1.0)) * uAspect, 0.12 + 0.76 * h1(f + 7.0))
        + 0.05 * vec2(sin(uTime * 0.6 + f), cos(uTime * 0.5 + f * 1.7));
    }
    for (int i = 0; i < 10; i++) {
      for (int j = i + 1; j < 10; j++) {
        float d = length(pts[i] - pts[j]);
        if (d < 0.42) {
          float l = smoothstep(0.004, 0.0, seg(p, pts[i], pts[j]));
          // a signal running along the edge
          float t = fract(uTime * 0.4 + float(i) * 0.13);
          vec2 sp = mix(pts[i], pts[j], t);
          float s = smoothstep(0.018, 0.0, length(p - sp));
          c += PAPER * l * 0.22 * (1.0 - d * 2.0) + ORANGE * s * 0.9;
        }
      }
    }
    for (int i = 0; i < 10; i++) {
      float d = length(p - pts[i]);
      float pulse = 0.5 + 0.5 * sin(uTime * 2.0 + float(i));
      c += mix(PAPER, ORANGE, step(0.7, h1(float(i) + 3.0))) * smoothstep(0.022, 0.0, d) * (0.6 + 0.4 * pulse);
      c += ORANGE * smoothstep(0.08, 0.0, d) * 0.08;
    }
    return c;
  }

  vec3 classifier(vec2 uv) {
    float rows = 13.0;
    float r = floor(uv.y * rows);
    float fy = fract(uv.y * rows);
    float rowMask = step(0.3, fy) * step(fy, 0.7);
    // tokens: segments of varying width along the row
    float x = uv.x * 18.0 + h1(r) * 10.0;
    float cell = floor(x);
    float token = step(0.18, fract(x)) * step(0.25, h2(vec2(cell, r)));
    float flagged = step(0.78, h1(r + 4.0));
    float scan = fract(uTime * 0.18);
    float scanned = step(1.0 - (r + 1.0) / rows, scan + 0.08);
    vec3 tok = mix(PAPER * 0.35, PAPER * 0.8, scanned);
    tok = mix(tok, ORANGE, flagged * scanned);
    vec3 c = INK + tok * token * rowMask;
    float line = smoothstep(0.006, 0.0, abs(uv.y - (1.0 - scan)));
    c += ORANGE * line * 0.8;
    return c;
  }

  vec3 analytics(vec2 uv) {
    vec3 c = INK;
    float n = 28.0;
    float b = floor(uv.x * n);
    float fx = fract(uv.x * n);
    float hgt = 0.15 + 0.6 * (0.5 + 0.5 * sin(b * 0.45 + uTime * 1.3)) * (0.6 + 0.4 * h1(b + floor(uTime * 0.5)));
    float bar = step(0.2, fx) * step(fx, 0.8) * step(uv.y, hgt * 0.8);
    c += PAPER * bar * (0.18 + 0.4 * uv.y);
    float live = step(n - 2.0, b);
    c = mix(c, INK + ORANGE * bar * 0.9, live);
    float trace = 0.55 + 0.18 * sin(uv.x * 9.0 - uTime * 1.6) + 0.06 * sin(uv.x * 31.0 + uTime);
    c += ORANGE * smoothstep(0.006, 0.0, abs(uv.y - trace)) * 0.9;
    c += PAPER * 0.06 * step(0.995, fract(uv.y * 8.0));
    return c;
  }

  vec3 feed(vec2 uv) {
    float cols = 5.0;
    float ci = floor(uv.x * cols);
    float fx = fract(uv.x * cols);
    float speed = 0.06 + 0.06 * h1(ci + 2.0);
    float y = uv.y + uTime * speed + h1(ci) * 3.0;
    float bi = floor(y * 4.0);
    float fy = fract(y * 4.0);
    float card = step(0.08, fx) * step(fx, 0.92) * step(0.08, fy) * step(fy, 0.92);
    float headline = step(0.72, fy) * step(fy, 0.82) * step(fx, 0.2 + 0.6 * h2(vec2(ci, bi)));
    float img = step(0.16, fy) * step(fy, 0.6);
    float hot = step(0.85, h2(vec2(ci + 9.0, bi)));
    vec3 c = INK + PAPER * card * 0.06;
    c += PAPER * img * card * (0.1 + 0.12 * noise(vec2(fx * 6.0, fy * 6.0 + ci)));
    c += mix(PAPER * 0.7, ORANGE, hot) * headline;
    return c;
  }

  vec3 records(vec2 uv) {
    vec2 g = vec2(8.0, 9.0);
    vec2 id = floor(uv * g);
    vec2 f = fract(uv * g);
    float cell = step(0.06, f.x) * step(f.x, 0.94) * step(0.18, f.y) * step(f.y, 0.82);
    float fill = step(f.x, 0.25 + 0.6 * h2(id));
    float q = fract(uTime * 0.35);
    float row = 1.0 - (id.y + 0.5) / g.y;
    float hit = smoothstep(0.08, 0.0, abs(row - q)) * step(0.55, h2(id + 3.0));
    vec3 c = INK + PAPER * cell * 0.05 + PAPER * cell * fill * 0.22;
    c += ORANGE * cell * fill * hit;
    c += PAPER * smoothstep(0.004, 0.0, abs(f.y - 0.04)) * 0.08;
    return c;
  }

  vec3 pick(float k, vec2 uv) {
    if (k < 0.5) return network(uv);
    if (k < 1.5) return classifier(uv);
    if (k < 2.5) return analytics(uv);
    if (k < 3.5) return feed(uv);
    return records(uv);
  }

  void main() {
    vec2 uv = vUv;
    // velocity bend: the image drags like cloth behind the cursor
    uv.x -= uVel.x * 0.004 * sin(uv.y * 3.14159);
    uv.y += uVel.y * 0.004 * sin(uv.x * 3.14159);
    uv.y += sin(uv.x * 10.0 + uTime * 4.0) * length(uVel) * 0.0006;
    float n = noise(uv * 6.0 + uTime * 0.2);
    float m = smoothstep(uMix - 0.15, uMix + 0.15, n * 0.7 + uv.x * 0.3);
    vec3 a = pick(uFrom, uv);
    vec3 b = pick(uTo, uv);
    vec3 col = mix(a, b, m); // uMix 1 -> shows uFrom, 0 -> shows uTo
    // dissolve edge glows orange
    col += ORANGE * (1.0 - abs(m - 0.5) * 2.0) * step(0.02, uMix) * step(uMix, 0.98) * 0.5;
    // vignette + fine scanlines
    col *= 0.75 + 0.25 * smoothstep(0.9, 0.2, length(vUv - 0.5));
    col *= 0.94 + 0.06 * step(0.5, fract(vUv.y * 160.0));
    gl_FragColor = vec4(col, 1.0);
  }
`

export default function ProjectCover({ kind = 0, velocity, className = '', active = true }) {
  const wrapRef = useRef(null)
  const state = useRef({ kind, from: kind, mix: 1 })
  state.current.target = kind

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return undefined
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
    } catch {
      return undefined
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    wrap.appendChild(renderer.domElement)
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' })

    const uniforms = {
      uTime: { value: 0 },
      uFrom: { value: kind },
      uTo: { value: kind },
      uMix: { value: 1 },
      uVel: { value: new THREE.Vector2() },
      uAspect: { value: 1.4 },
    }
    const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat)
    const scene = new THREE.Scene()
    scene.add(quad)
    const cam = new THREE.Camera()

    const resize = () => {
      const w = wrap.clientWidth || 1
      const h = wrap.clientHeight || 1
      renderer.setSize(w, h, false)
      uniforms.uAspect.value = w / h
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    const clock = new THREE.Clock()
    let raf = 0
    const s = state.current
    s.shown = kind
    // Only draw while the cover is on screen (it stays mounted when you scroll past Projects).
    let onScreen = true
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting }, { rootMargin: '100px' })
    io.observe(wrap)
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (document.hidden || !onScreen) return
      // start a dissolve whenever the requested kind changes
      if (s.target !== s.shown) {
        uniforms.uFrom.value = s.shown
        uniforms.uTo.value = s.target
        s.shown = s.target
        s.mix = 0
      }
      s.mix = Math.min(1, s.mix + 0.045)
      uniforms.uMix.value = 1 - s.mix // 1 -> 0 reveals uTo
      uniforms.uTime.value = clock.getElapsedTime()
      const v = velocity?.current
      if (v) uniforms.uVel.value.set(v.x, v.y)
      renderer.render(scene, cam)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      mat.dispose(); quad.geometry.dispose(); renderer.dispose()
      if (renderer.domElement.parentNode === wrap) wrap.removeChild(renderer.domElement)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={wrapRef} aria-hidden="true" className={className} data-active={active} />
}
