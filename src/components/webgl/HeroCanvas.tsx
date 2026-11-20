'use client';

import { useEffect, useRef } from 'react';
import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { gsap, hasFinePointer, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap';

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Mapa topográfico procedural: curvas de nível sobre ruído simplex (referência
 * ao trabalho de terreno/level design), distorcidas pelo cursor e pelo scroll.
 */
const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uScroll;
  uniform float uEnergy;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform vec3 uBg;
  uniform vec3 uPaper;
  uniform vec3 uAccent;

  // Simplex noise 3D — Ian McEwan, Ashima Arts (MIT)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
    vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);

    // O cursor empurra o terreno como uma lente.
    vec2 toMouse = p - m;
    float d = length(toMouse);
    float lens = exp(-d * 4.5) * (0.06 + uEnergy * 0.22);
    p += normalize(toMouse + 1e-4) * lens;

    p.y += uScroll * 0.9;

    float t = uTime * 0.07;
    float n1 = snoise(vec3(p * 1.25, t));
    float n2 = snoise(vec3(p * 2.6 + n1 * 0.55, t * 1.7 + 12.0));
    float height = n1 * 0.62 + n2 * 0.26;

    // Curvas de nível com anti-aliasing por derivadas.
    float levels = 15.0;
    float hv = height * levels;
    float dist = abs(fract(hv - 0.5) - 0.5) / fwidth(hv);
    float line = 1.0 - clamp(dist - 0.35, 0.0, 1.0);

    // Curvas mestras (a cada 5 níveis) um pouco mais fortes.
    float major = 1.0 - clamp(abs(fract(hv / 5.0 - 0.5) - 0.5) / fwidth(hv / 5.0) - 0.35, 0.0, 1.0);

    float glow = exp(-d * 3.2) * (0.35 + uEnergy);
    float vignette = smoothstep(1.25, 0.15, length((vUv - 0.5) * vec2(1.15, 1.0)));

    vec3 col = uBg;
    col += uPaper * line * (0.07 + major * 0.1) * vignette;
    col = mix(col, uAccent, line * glow * 0.9);
    col += uAccent * exp(-d * 6.0) * 0.045 * (0.4 + uEnergy);
    col += (hash(vUv * uRes + uTime) - 0.5) * 0.028;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function HeroCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      return; // Sem WebGL: o fundo CSS do container continua visível.
    }

    const reduced = prefersReducedMotion();
    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uEnergy: { value: 0 },
      uRes: { value: new Vector2(1, 1) },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uBg: { value: new Vector3(0.043, 0.043, 0.047) },
      uPaper: { value: new Vector3(0.94, 0.933, 0.91) },
      uAccent: { value: new Vector3(0.843, 1.0, 0.247) },
    };
    const material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
    });
    const geometry = new PlaneGeometry(2, 2);
    scene.add(new Mesh(geometry, material));

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(canvas.width, canvas.height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    // Ponteiro suavizado + "energia" proporcional à velocidade.
    const target = new Vector2(0.5, 0.5);
    let energy = 0;
    const onPointer = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = 1 - (event.clientY - rect.top) / rect.height;
      energy = Math.min(energy + Math.hypot(nx - target.x, ny - target.y) * 6, 1);
      target.set(nx, ny);
    };
    if (hasFinePointer()) window.addEventListener('pointermove', onPointer, { passive: true });

    const scrollTrigger = ScrollTrigger.create({
      trigger: host,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        uniforms.uScroll.value = self.progress;
      },
    });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    io.observe(host);

    const render = (time: number) => {
      if (!visible || document.hidden) return;
      energy *= 0.94;
      uniforms.uEnergy.value += (energy - uniforms.uEnergy.value) * 0.12;
      uniforms.uMouse.value.lerp(target, 0.07);
      uniforms.uTime.value = time;
      renderer.render(scene, camera);
    };

    if (reduced) {
      render(8);
    } else {
      gsap.ticker.add(render);
    }

    return () => {
      gsap.ticker.remove(render);
      scrollTrigger.kill();
      io.disconnect();
      observer.disconnect();
      window.removeEventListener('pointermove', onPointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
