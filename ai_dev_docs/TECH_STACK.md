# ResuMax — Tech Stack & Setup

## Dependencies

### package.json

```json
{
  "name": "resumax-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev":   "next dev",
    "build": "next build",
    "start": "next start",
    "lint":  "next lint"
  },
  "dependencies": {
    "next":                        "14.2.x",
    "react":                       "^18.3.0",
    "react-dom":                   "^18.3.0",

    "three":                       "^0.167.0",
    "@types/three":                "^0.167.0",

    "gsap":                        "^3.12.5",
    "@gsap/react":                 "^2.1.1",

    "@studio-freight/lenis":       "^1.1.14",

    "clsx":                        "^2.1.1",
    "tailwind-merge":              "^2.4.0"
  },
  "devDependencies": {
    "typescript":                  "^5.5.0",
    "@types/node":                 "^20.0.0",
    "@types/react":                "^18.3.0",
    "@types/react-dom":            "^18.3.0",
    "tailwindcss":                 "^3.4.0",
    "postcss":                     "^8.4.0",
    "autoprefixer":                "^10.4.0",
    "eslint":                      "^8.57.0",
    "eslint-config-next":          "14.2.x"
  }
}
```

### Why These Specific Versions

| Package | Reason |
|---|---|
| Next.js 14 | App Router stable, Server Components, optimal for SPA-style landing |
| Three.js 0.167 | Latest stable with WebGPU groundwork, good InstancedMesh support |
| GSAP 3.12 | ScrollTrigger 3.x stable, `@gsap/react` for context cleanup |
| Lenis 1.1 | Studio Freight version — most stable, GSAP bridge maintained |
| No react-three-fiber | Direct Three.js gives more control for custom scroll-driven scenes |

---

## Project Structure

```
resumax-frontend/
│
├── ai_dev_docs/                    ← Design documentation (this folder)
│   ├── OVERVIEW.md
│   ├── DESIGN_SYSTEM.md
│   ├── ANIMATION_ARCHITECTURE.md
│   ├── SECTIONS_SPEC.md
│   └── TECH_STACK.md
│
├── app/
│   ├── layout.tsx                  ← Root layout: fonts, meta, providers
│   ├── page.tsx                    ← Landing page (/)
│   ├── globals.css                 ← Global styles, CSS variables, scrollbar
│   │
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── analyze/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   └── history/
│       └── page.tsx
│
├── components/
│   │
│   ├── three/                      ← All WebGL / Three.js components
│   │   ├── SceneCanvas.tsx         ← Mounts canvas, init renderer
│   │   ├── CubeSystem.ts           ← Cube data, states, instance updates
│   │   ├── ParticleField.ts        ← Ambient particle system
│   │   ├── SceneConfig.ts          ← Lights, camera, renderer config
│   │   └── hooks/
│   │       ├── useThreeScene.ts    ← Scene lifecycle hook
│   │       └── useScrollSync.ts    ← Bridges Lenis scroll → Three.js state
│   │
│   ├── landing/                    ← Landing page sections
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── PipelineSection.tsx
│   │   ├── ComponentsSection.tsx
│   │   ├── FeedbackSection.tsx
│   │   ├── OptimizerSection.tsx
│   │   └── SiteFooter.tsx
│   │
│   ├── ui/                         ← Reusable UI atoms
│   │   ├── ScoreRing.tsx           ← Animated SVG ring
│   │   ├── SkillTag.tsx            ← Skill chip
│   │   ├── BulletComparison.tsx    ← Before/after bullets
│   │   ├── StepCard.tsx            ← Pipeline step card
│   │   ├── FeatureCard.tsx         ← Feature grid card
│   │   ├── CustomCursor.tsx        ← Cursor overlay
│   │   └── Button.tsx              ← Button variants
│   │
│   └── providers/
│       ├── LenisProvider.tsx       ← Lenis context + init
│       └── GSAPProvider.tsx        ← GSAP context cleanup
│
├── lib/
│   ├── lenis.ts                    ← Lenis singleton + GSAP bridge
│   ├── gsap-config.ts              ← Register plugins, defaults
│   ├── three-scene.ts              ← Three.js singleton scene
│   └── utils.ts                    ← cn() helper, misc utils
│
├── hooks/
│   ├── useWindowSize.ts
│   ├── useReducedMotion.ts         ← Respects prefers-reduced-motion
│   └── useIsClient.ts              ← SSR guard
│
├── public/
│   ├── fonts/                      ← Self-hosted Inter + JetBrains Mono
│   └── assets/
│       └── hero-bg.webp            ← Optional: static fallback bg
│
├── styles/
│   └── three-overrides.css         ← canvas element specific styles
│
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── postcss.config.js
```

---

## Configuration Files

### next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Needed for Three.js + GSAP to work in App Router
  transpilePackages: ['three', 'gsap', '@studio-freight/lenis'],

  // Optimize font loading
  optimizeFonts: true,

  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
```

### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        resumax: {
          950: '#080808',
          900: '#111111',
          800: '#1a1a1a',
          700: '#222222',
          600: '#2a2a2a',
          500: '#333333',
          400: '#555555',
          300: '#666666',
          200: '#AAAAAA',
          100: '#DDDDDD',
        },
        glow: {
          blue:  '#4a9eff',
          white: 'rgba(255,255,255,0.25)',
        },
        score: {
          low:  '#ff4444',
          mid:  '#ffaa00',
          high: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display-xl': ['96px', { lineHeight: '0.95', fontWeight: '700' }],
        'display-lg': ['72px', { lineHeight: '1.0',  fontWeight: '700' }],
        'display-md': ['48px', { lineHeight: '1.05', fontWeight: '600' }],
      },
      animation: {
        'scroll-bounce': 'scrollBounce 1.5s ease-in-out infinite',
        'glow-pulse':    'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        scrollBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(6px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### globals.css (critical parts)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  /* All CSS variables from DESIGN_SYSTEM.md */
  --color-bg-base: #080808;
  /* ... */
}

/* Hide default cursor — custom cursor active */
* { cursor: none !important; }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #080808; }
::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: #333; }

/* Three.js canvas — always behind everything */
canvas.three-bg {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 0;
  pointer-events: none;
}

/* All HTML content sits above canvas */
.page-wrapper {
  position: relative;
  z-index: 1;
}

/* Prevent flash of white */
html, body {
  background-color: #080808;
  color: #fff;
  overflow-x: hidden;
}

/* Reduced motion override */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## GSAP Plugin Setup

```ts
// lib/gsap-config.ts
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, TextPlugin, CustomEase)

// Custom cinematic ease
CustomEase.create('cinematic', 'M0,0 C0.76,0 0.24,1 1,1')
CustomEase.create('heavy-drop', 'M0,0 C0.215,0.61 0.355,1 1,1')

// GSAP defaults
gsap.defaults({
  ease: 'power3.out',
  duration: 0.6,
})

// ScrollTrigger defaults
ScrollTrigger.defaults({
  markers: process.env.NODE_ENV === 'development',   // visible markers in dev
  toggleActions: 'play none none reverse',
})
```

---

## Three.js Singleton Scene

```ts
// lib/three-scene.ts
// Singleton pattern — scene created once, referenced everywhere

import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass }     from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

class ThreeScene {
  scene!:    THREE.Scene
  camera!:   THREE.PerspectiveCamera
  renderer!: THREE.WebGLRenderer
  composer!: EffectComposer
  private _initialized = false

  init(canvas: HTMLCanvasElement) {
    if (this._initialized) return
    this._initialized = true

    this.scene    = new THREE.Scene()
    this.scene.fog = new THREE.Fog(0x080808, 15, 30)

    this.camera   = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100)
    this.camera.position.set(0, 2, 12)

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 0.8

    // Post-processing
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.4, 0.8, 0.9
    ))
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.composer.setSize(window.innerWidth, window.innerHeight)
  }
}

export const threeScene = new ThreeScene()
```

---

## Key Integration: Lenis + GSAP + Three.js

```ts
// The bridge — how all three systems connect

// 1. Lenis updates GSAP ticker
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))

// 2. GSAP ScrollTrigger controls Three.js via onUpdate
ScrollTrigger.create({
  trigger: '#hero',
  start: 'top top',
  end: '+=500%',
  scrub: 1.5,
  onUpdate: ({ progress }) => {
    // progress 0–1 drives Three.js cube state
    cubeSystem.updateToProgress(progress)
  }
})

// 3. Three.js runs in its own RAF loop, independent of scroll
// It reads cubeSystem state which GSAP has written
function threeRaf() {
  requestAnimationFrame(threeRaf)
  threeScene.composer.render()
}
```

---

## Initialization Sequence

```
Browser loads
    ↓
Next.js App Router hydrates
    ↓
layout.tsx: LenisProvider mounts
    ↓
page.tsx: SceneCanvas mounts (client only, dynamic import)
    ↓
SceneCanvas: threeScene.init(canvas) called
    ↓
CubeSystem: creates InstancedMesh, places cubes in hero state
    ↓
ParticleField: creates Points geometry
    ↓
GSAP ScrollTrigger: all triggers registered
    ↓
Intro animation plays (2.5s, no scroll)
    ↓
User can scroll — Lenis → GSAP → Three.js pipeline is live
```

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000   # FastAPI backend
NEXT_PUBLIC_ENV=development
```

---

## Install & Run

```bash
# Install
npm install

# Development
npm run dev

# Production build
npm run build && npm start
```
