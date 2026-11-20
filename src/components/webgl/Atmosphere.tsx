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
import { useEverReady } from '@/hooks/useSiteReady';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

const TRAIL = 14;
const RIPPLES = 4;

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Atmosfera gótica em tela cheia (fixa atrás de todo o site):
 * névoa (fbm), arcos ogivais em paralaxe, rosácea girando, brasas subindo,
 * rastro de sangue atrás do cursor e ondas de choque no clique.
 * Coordenadas do shader: p.y em [-0.5, 0.5], p.x escalado pelo aspecto.
 */
const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uScroll;
  uniform float uEnergy;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform vec2 uTrail[${TRAIL}];
  uniform vec3 uRipples[${RIPPLES}];
  uniform vec3 uBg;
  uniform vec3 uPaper;
  uniform vec3 uAccent;
  uniform vec3 uBlood;

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

  float fbm(vec3 p) {
    float a = 0.5;
    float s = 0.0;
    for (int i = 0; i < 3; i++) {
      s += a * snoise(p);
      p = p * 2.03 + 7.1;
      a *= 0.5;
    }
    return s;
  }

  // Distância ao contorno de um arco ogival (largura w, linha de impulso ys).
  float arch(vec2 q, float w, float ys) {
    float side = q.x < 0.0 ? -1.0 : 1.0;
    float arc = abs(length(vec2(q.x + side * w * 0.5, q.y - ys)) - w);
    float wall = abs(abs(q.x) - w * 0.5);
    return q.y >= ys ? arc : (q.y >= 0.0 ? wall : 1.0);
  }

  float stroke(float d, float px) {
    return 1.0 - smoothstep(px * 0.4, px * 1.7, d);
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    float px = 1.0 / uRes.y;
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
    float t = uTime * 0.05;

    // Ondas de choque (cliques): distorcem o espaço e acendem um anel.
    float ringGlow = 0.0;
    for (int i = 0; i < ${RIPPLES}; i++) {
      vec3 r = uRipples[i];
      float age = uTime - r.z;
      if (age > 0.0 && age < 3.2) {
        vec2 dv = p - r.xy;
        float dl = length(dv);
        float fade = 1.0 - age / 3.2;
        float ring = exp(-pow((dl - age * 0.5) * 9.0, 2.0));
        p += dv / (dl + 1e-4) * ring * 0.035 * fade;
        ringGlow += ring * fade;
      }
    }

    // Rastro do cursor: deforma levemente e acumula brilho vermelho.
    float trailGlow = 0.0;
    for (int i = 0; i < ${TRAIL}; i++) {
      float w = 1.0 - float(i) / float(${TRAIL});
      vec2 dv = p - uTrail[i];
      float d2 = dot(dv, dv);
      p += dv * exp(-d2 * 70.0) * 0.018 * w;
      trailGlow += exp(-d2 * 260.0) * w * w;
    }

    float dm = length(p - uMouse);
    float lit = exp(-dm * 2.6) * (0.45 + uEnergy * 0.9);

    // Névoa em duas camadas, empurrada pelo scroll.
    vec2 fq = p * 1.15 + vec2(0.0, uScroll * 0.12);
    float f1 = fbm(vec3(fq, t));
    float f2 = fbm(vec3(fq * 1.9 + f1 * 0.9, t * 1.5 + 5.0));
    float fog = smoothstep(-0.25, 0.75, f2);

    // Arcos ogivais: duas camadas com paralaxe de scroll.
    vec2 a1 = p + vec2(0.0, uScroll * 0.22);
    float cw = 0.44;
    float ch = 0.95;
    vec2 q1 = vec2(mod(a1.x + cw * 0.5, cw) - cw * 0.5, mod(a1.y, ch));
    float arches = max(stroke(arch(q1, cw * 0.86, ch * 0.5), px),
                       stroke(arch(q1, cw * 0.58, ch * 0.42), px) * 0.7);

    vec2 a2 = p * 0.55 + vec2(0.17, uScroll * 0.08 + 0.3);
    float cw2 = 0.62;
    float ch2 = 1.3;
    vec2 q2 = vec2(mod(a2.x + cw2 * 0.5, cw2) - cw2 * 0.5, mod(a2.y, ch2));
    float deep = stroke(arch(q2, cw2 * 0.86, ch2 * 0.5), px * 0.9) * 0.55;

    // Rosácea: anéis, raios e pétalas ogivais, giro lento acelerado pelo cursor.
    vec2 rc = p - vec2(0.0, 0.04 - uScroll * 0.05);
    float rr = length(rc);
    float ang = atan(rc.y, rc.x) + uTime * (0.025 + uEnergy * 0.2);
    float petal = abs(sin(ang * 6.0));
    float rose = stroke(abs(rr - (0.27 + 0.06 * petal)), px);
    rose += stroke(abs(rr - 0.42), px) * 0.8;
    rose += stroke(abs(rr - 0.11), px) * 0.8;
    rose += stroke(abs(sin(ang * 6.0)) * rr, px) * step(rr, 0.42) * step(0.11, rr);
    rose += stroke(abs(sin(ang * 12.0 + 1.5708)) * rr, px) * step(rr, 0.27) * step(0.11, rr) * 0.6;
    rose = clamp(rose, 0.0, 1.0) * smoothstep(0.55, 0.3, rr);

    float vignette = smoothstep(1.15, 0.15, length((vUv - 0.5) * vec2(1.2, 1.0)));

    vec3 col = uBg;
    col += vec3(0.05, 0.045, 0.05) * fog * vignette;
    col += uBlood * fog * fog * 0.22 * (0.3 + lit) * vignette;
    col += uPaper * (arches * 0.07 + deep * 0.05) * vignette;
    col = mix(col, uAccent, arches * lit * 0.85);
    col += uBlood * rose * (0.55 + uEnergy * 0.8);
    col += uAccent * rose * lit * 0.35;

    // Brasas subindo em três camadas.
    float embers = 0.0;
    for (int i = 0; i < 3; i++) {
      float L = float(i);
      vec2 g = p * vec2(9.0, 5.0) * (1.0 + L * 0.7);
      g.y -= uTime * (0.35 + L * 0.22) + uScroll * (2.0 + L);
      vec2 id = floor(g);
      vec2 f = fract(g) - 0.5;
      float h = hash(id + L * 31.0);
      vec2 off = vec2(sin(uTime * 0.7 + h * 40.0) * 0.28, (hash(id + 7.0) - 0.5) * 0.5);
      float spark = smoothstep(0.07, 0.0, length(f - off)) * step(0.78, h);
      embers += spark * (0.6 + 0.4 * sin(uTime * 4.0 + h * 90.0)) / (1.0 + L * 0.5);
    }
    col += mix(uAccent, vec3(1.0, 0.55, 0.3), 0.35) * embers * 0.9 * vignette;

    // Cursor e cliques.
    col += uAccent * trailGlow * 0.5;
    col += uAccent * exp(-dm * dm * 14.0) * 0.1 * (0.5 + uEnergy);
    col += uAccent * ringGlow * 0.35;

    col *= mix(0.55, 1.0, vignette);
    col += (hash(vUv * uRes + uTime) - 0.5) * 0.03;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ready = useEverReady();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false });
    } catch {
      return; // Sem WebGL: o fundo CSS do body continua visível.
    }

    const reduced = prefersReducedMotion();
    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const trail = Array.from({ length: TRAIL }, () => new Vector2());
    const ripples = Array.from({ length: RIPPLES }, () => new Vector3(0, 0, -100));
    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uEnergy: { value: 0 },
      uRes: { value: new Vector2(1, 1) },
      uMouse: { value: new Vector2() },
      uTrail: { value: trail },
      uRipples: { value: ripples },
      uBg: { value: new Vector3(0.035, 0.035, 0.039) },
      uPaper: { value: new Vector3(0.894, 0.875, 0.863) },
      uAccent: { value: new Vector3(0.863, 0.141, 0.188) },
      uBlood: { value: new Vector3(0.18, 0.025, 0.04) },
    };
    const material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
    });
    const geometry = new PlaneGeometry(2, 2);
    scene.add(new Mesh(geometry, material));

    const resize = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.uRes.value.set(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Converte coordenadas de tela para o espaço do shader.
    const toShader = (x: number, y: number, out: Vector2) =>
      out.set(
        (x / window.innerWidth - 0.5) * (window.innerWidth / window.innerHeight),
        0.5 - y / window.innerHeight,
      );

    const target = new Vector2();
    const smooth = new Vector2();
    toShader(window.innerWidth * 0.62, window.innerHeight * 0.4, target);
    smooth.copy(target);
    uniforms.uMouse.value.copy(target);
    trail.forEach((v) => v.copy(target));

    let energy = 0;
    let lastInput = -10;
    let rippleIndex = 0;
    const scratch = new Vector2();

    const onMove = (event: PointerEvent) => {
      toShader(event.clientX, event.clientY, scratch);
      energy = Math.min(energy + scratch.distanceTo(target) * 5, 1);
      target.copy(scratch);
      lastInput = uniforms.uTime.value;
    };
    const onDown = (event: PointerEvent) => {
      toShader(event.clientX, event.clientY, scratch);
      ripples[rippleIndex % RIPPLES]?.set(scratch.x, scratch.y, uniforms.uTime.value);
      rippleIndex += 1;
      energy = 1;
      onMove(event);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });

    let frame = 0;
    const render = (time: number) => {
      if (document.hidden) return;
      uniforms.uTime.value = time;

      // Sem interação (ex.: celular), uma luz fantasma vaga pela tela.
      if (time - lastInput > 2.5) {
        toShader(
          window.innerWidth * (0.5 + 0.32 * Math.sin(time * 0.31)),
          window.innerHeight * (0.45 + 0.25 * Math.sin(time * 0.23 + 1.3)),
          target,
        );
      }

      energy *= 0.93;
      uniforms.uEnergy.value += (energy - uniforms.uEnergy.value) * 0.1;
      smooth.lerp(target, 0.08);
      uniforms.uMouse.value.copy(smooth);

      // Histórico do rastro: um ponto novo a cada 2 quadros.
      if (frame++ % 2 === 0) {
        for (let i = TRAIL - 1; i > 0; i--) {
          const prev = trail[i - 1];
          if (prev) trail[i]?.copy(prev);
        }
        trail[0]?.copy(smooth);
      }

      uniforms.uScroll.value = window.scrollY / window.innerHeight;
      renderer.render(scene, camera);
    };

    if (reduced) {
      uniforms.uTime.value = 8;
      renderer.render(scene, camera);
    } else {
      gsap.ticker.add(render);
    }

    return () => {
      gsap.ticker.remove(render);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-20 size-full transition-opacity duration-[2400ms] ${ready ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}
