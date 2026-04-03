# ResuMax — Animation & 3D Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER WINDOW                       │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Three.js Canvas  (position: fixed, z-index: 0)   │  │
│  │  — Full viewport WebGL renderer                   │  │
│  │  — Always rendering, never unmounted              │  │
│  │  — Receives scroll progress via GSAP globals      │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  HTML Content Layer  (position: relative, z:1)    │  │
│  │  — All text, cards, buttons                       │  │
│  │  — Transparent backgrounds over canvas            │  │
│  │  — Animated by GSAP ScrollTrigger                 │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌────────────────────┐  ┌──────────────────────────┐   │
│  │  Lenis Smooth Scroll│  │  GSAP ScrollTrigger     │   │
│  │  — RAF loop        │  │  — Reads Lenis position  │   │
│  │  — Feeds to GSAP   │  │  — Drives 3D + HTML anim │   │
│  └────────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Lenis Setup

```js
// lib/lenis.js
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initLenis() {
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // expo ease
    direction: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 2.0,
    infinite: false,
  })

  // Bridge Lenis → GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  return lenis
}
```

---

## Three.js Scene Architecture

### Scene Graph

```
Scene
├── AmbientLight (intensity: 0.1)
├── PointLight — center glow (blue, intensity: 2, position: 0,0,0)
├── PointLight — rim light (white, intensity: 0.5, position: -10, 10, 5)
├── DirectionalLight (intensity: 0.3, position: 5, 10, 5)
│
├── CubeCluster (Group)
│   ├── InstancedMesh — SolidCubes (all solid cubes, single draw call)
│   │   count: 20 cubes
│   │   geometry: BoxGeometry(1, 1, 1)
│   │   material: MeshStandardMaterial (#1a1a1a, metalness: 0.8, roughness: 0.2)
│   │
│   ├── InstancedMesh — WireCubes (all wireframe/glass cubes, single draw call)
│   │   count: 12 cubes
│   │   geometry: BoxGeometry(1, 1, 1)
│   │   material: MeshPhysicalMaterial (glass — see DESIGN_SYSTEM)
│   │
│   └── EdgesGroup — wireframe edges
│       LineSegments per glass cube (for sharp edges)
│
├── ParticleSystem (Points)
│   count: 200 floating dust particles
│   geometry: BufferGeometry (random positions in sphere)
│   material: PointsMaterial (size: 0.02, color: white, opacity: 0.3)
│
└── FogPlane (invisible ground plane for fake fog reflection)
```

### Camera

```js
camera = new PerspectiveCamera(60, width/height, 0.1, 100)
camera.position.set(0, 2, 12)
camera.lookAt(0, 0, 0)
```

### Renderer

```js
renderer = new WebGLRenderer({
  antialias: true,
  alpha: true,           // transparent background
  powerPreference: 'high-performance',
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap
renderer.toneMapping = ACESFilmicToneMapping
renderer.toneMappingExposure = 0.8
```

### Post-Processing

```js
// Using @react-three/postprocessing or manual EffectComposer
composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new UnrealBloomPass(
  new Vector2(width, height),
  strength: 0.4,      // subtle bloom on glow points
  radius: 0.8,
  threshold: 0.9      // only very bright areas bloom
))
```

---

## Cube System — Data Model

Each cube has a defined state at each scroll position. The system interpolates between states.

### Cube Definition

```js
interface CubeData {
  id: number
  type: 'solid' | 'glass'
  size: [width, height, depth]     // Three.js units

  // States — position/rotation at each scroll checkpoint
  states: {
    hero:       CubeTransform,
    pipeline:   CubeTransform,
    components: CubeTransform,
    feedback:   CubeTransform,
    optimizer:  CubeTransform,
    footer:     CubeTransform,
  }

  // Fill progress: 0 = empty wireframe, 1 = solid filled
  fillTarget: Record<string, number>   // per scroll section
}

interface CubeTransform {
  position: [x, y, z]
  rotation: [rx, ry, rz]    // Euler, radians
  scale:    [sx, sy, sz]
  opacity:  number
}
```

### The 20 Solid Cubes — Hero State Positions

These roughly match the reference image: a dense cluster.

```js
const solidCubePositions = [
  // Core cluster (large cubes near center)
  { pos: [0,   0,    0],   size: [1.5, 1.5, 1.5] },   // center anchor cube
  { pos: [1.8, 0.5,  0.3], size: [1.2, 1.2, 1.2] },
  { pos: [-1.6,0.2, -0.2], size: [1.3, 1.0, 1.0] },
  { pos: [0.3, 1.8,  0.5], size: [1.0, 1.4, 1.0] },
  { pos: [0.2,-1.6,  0.4], size: [1.1, 1.1, 1.1] },

  // Mid ring
  { pos: [2.8, -0.8, 1.0], size: [0.9, 0.9, 0.9] },
  { pos: [-2.5, 1.2, 0.8], size: [0.8, 1.0, 0.9] },
  { pos: [1.2, -2.4, 0.6], size: [1.0, 0.8, 0.8] },
  { pos: [-0.8, 2.6, 0.3], size: [0.9, 0.9, 1.0] },
  { pos: [2.2,  1.8, -0.5],size: [0.7, 0.7, 0.7] },
  { pos: [-1.8,-2.0, 0.7], size: [0.8, 0.8, 0.8] },
  { pos: [0.5,  0.5, 2.2], size: [0.9, 0.9, 0.9] },

  // Outer scattered (smaller)
  { pos: [3.5,  1.0, -1.0],size: [0.5, 0.5, 0.5] },
  { pos: [-3.2, 0.5,  1.5],size: [0.6, 0.6, 0.6] },
  { pos: [1.5, -3.0,  0.2],size: [0.5, 0.5, 0.5] },
  { pos: [-1.0, 3.2, -0.8],size: [0.5, 0.5, 0.5] },
  { pos: [3.0, -2.0,  0.5],size: [0.4, 0.6, 0.4] },
  { pos: [-2.8, -1.5,-0.5],size: [0.5, 0.4, 0.5] },
  { pos: [0.8,  0.8,  3.0],size: [0.4, 0.4, 0.6] },
  { pos: [-0.5,-0.5, -2.8],size: [0.5, 0.5, 0.4] },
]
```

---

## GSAP ScrollTrigger Timeline

The master timeline is driven by total page scroll progress (0–1).

### Master Timeline Structure

```js
// Main scroll-driven GSAP context
gsap.registerPlugin(ScrollTrigger)

const masterTL = gsap.timeline({
  scrollTrigger: {
    trigger: '.page-wrapper',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,       // 1.5s lag for cinematic feel
  }
})

// Each "chapter" below is added to masterTL with position labels
```

---

## Section-by-Section 3D Animation Spec

### Chapter 0: Intro (on load, no scroll)

Duration: 2.5 seconds autoplay. Blocks scroll until complete.

```
t=0.0   — Black screen, all cubes at scale 0 (invisible)
t=0.2   — Center point light activates, radius: 0.1
t=0.4   — Center cube scales 0→1 with cinematic ease
t=0.6   — Glow radius expands 0.1→2.0
t=0.8   — Adjacent cubes scale in with staggered delay (0.05s per cube)
t=1.2   — Glass cubes fade in (opacity 0→0.15)
t=1.5   — Full cluster assembled, begins ambient drift animation
t=1.8   — "ResuMax" text scramble animation starts (character reveal)
t=2.2   — Subtext fades in
t=2.5   — "START ANALYZING →" button slides up
         — Scroll unlock: user can now scroll
```

### Chapter 1: Hero → Pipeline Transition (scroll: 0% → 20%)

```
Scroll 0–5%:   Cluster does gentle ambient drift (permanent loop running underneath)
               Camera: no movement yet

Scroll 5–15%:  4 "feature cubes" begin separating from cluster
               They drift outward and DOWN (toward viewer's bottom half)
               Remaining cubes compress slightly toward center
               "PROCESS" label fades in from opacity 0

Scroll 15–20%: 4 feature cubes SNAP to horizontal row (y: -2 level)
               Each cube scales to uniform 1.2×1.2×1.2
               Rotation settles to (0, π/4, 0) — angled for visibility
               Step number (01–04) text texture applied to cube face
               Camera rotates: y: 0 → y: -0.2 (slight pan left)
               "The Precision Pipeline" heading slides in from left
```

### Chapter 2: Pipeline → Components Transition (scroll: 20% → 40%)

```
Scroll 20–30%: Pipeline row cubes rise back up and begin arranging into 2×2 grid
               Grid position: center of viewport
               Cubes are empty (wireframe only at this point)
               Background cubes fade to 30% opacity

Scroll 30–35%: Each grid cube "opens" — front face slides away revealing interior
               Interior is black void at first

Scroll 35–40%: Feature content fills each cube interior:
               Cube 1 → ATS Score ring animates in (0→89 counter)
               Cube 2 → Bullet text appears line by line
               Cube 3 → Skill tags bounce in with elastic spring
               Cube 4 → Job Matcher document icon slides in
               "Engineered Components" heading reveal
               Camera: zooms in slightly (fov 60 → 55)
```

### Chapter 3: Components → Feedback Engine (scroll: 40% → 65%)

```
Scroll 40–50%: 2×2 grid collapses — 3 cubes float upward in a row
               4th cube shrinks and drifts off to the right (exits scene)
               3 cubes scale up to larger size (2.0×2.0×2.0)

Scroll 50–58%: Score ring animations inside each cube:
               Left cube:   ring fills to 28% (red stroke color)
               Center cube: ring fills to 60% (amber stroke color)
               Right cube:  ring fills to 89% (white stroke color)
               Labels appear below: "NEEDS WORK", "GETTING THERE", "INTERVIEW READY"

Scroll 58–65%: Score cubes tilt slightly (perspective effect)
               Camera pans right 0.2 units
               "Visual Feedback Engine" heading slides in
```

### Chapter 4: Feedback → Optimizer (scroll: 65% → 85%)

```
Scroll 65–72%: 3 score cubes merge into a SINGLE large cube (center of scene)
               Scale: 3×4×0.2 (flat, like a document/card)
               Rotation: faces camera directly (0,0,0 rotation)

Scroll 72–80%: Document cube "types" content onto its face:
               — Header bar appears (dark #222)
               — Bullet points type in one by one
               — Optimized bullets slide in from right with strikethrough on originals
               The cube face essentially becomes a resume panel

Scroll 80–85%: Camera slowly pulls back to reveal full document
               "RESUME OPTIMIZED" label appears above cube with monospace font
```

### Chapter 5: Footer (scroll: 85% → 100%)

```
Scroll 85–92%: Document cube begins shrinking back
               All remaining background cubes fade opacity 0.5→0

Scroll 92–98%: All cubes converge back to center point
               Scale down from 1.0→0

Scroll 98–100%: Single point of light remains
                Pulse animation (scale 1→1.5→0 once)
                Pure black — canvas contribution ends
                Footer HTML fully visible
```

---

## Ambient Animations (Always Running)

These loop continuously regardless of scroll:

### Cluster Drift
```js
// Runs as an offset layer on top of scroll-driven positions
gsap.to(cubeCluster.rotation, {
  y: '+=6.28318',   // full rotation over 30s
  duration: 30,
  repeat: -1,
  ease: 'none',
})

// Subtle float up/down
gsap.to(cubeCluster.position, {
  y: '+=0.3',
  duration: 3,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut',
})
```

### Individual Cube Micro-rotation
```js
// Each cube has slight independent rotation
cubes.forEach((cube, i) => {
  gsap.to(cube.rotation, {
    x: `+=${(i % 3 - 1) * 0.5}`,
    y: `+=${(i % 5 - 2) * 0.3}`,
    duration: 4 + (i * 0.3),
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })
})
```

### Particle Drift
```js
// Particles drift upward slowly
// Handled in RAF loop by updating BufferGeometry attributes
// Each particle has: position, velocity (tiny upward drift), reset when out of view
```

### Glow Pulse
```js
// Center point light intensity pulse
gsap.to(centerLight, {
  intensity: 2.5,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut',
})
```

---

## RAF (requestAnimationFrame) Loop

```js
// Main render loop — runs at 60fps
function animate(time) {
  requestAnimationFrame(animate)

  // Update instanced mesh matrices for any animated cubes
  updateCubeInstances()

  // Update particles
  updateParticles(time)

  // Render
  composer.render()   // post-processing enabled
}
animate(0)
```

---

## Next.js Integration

### Canvas Component Structure

```
app/
├── layout.tsx              — HTML shell, Lenis init
├── page.tsx                — Landing page orchestrator
│
components/
├── three/
│   ├── SceneManager.tsx    — Mounts canvas, owns Three.js state
│   ├── CubeSystem.tsx      — All cube logic, states, transitions
│   ├── ParticleSystem.tsx  — Particle field
│   └── useScrollScene.ts   — Hook: bridges GSAP scroll → Three.js
│
├── landing/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── PipelineSection.tsx
│   ├── ComponentsSection.tsx
│   ├── FeedbackSection.tsx
│   ├── OptimizerSection.tsx
│   └── Footer.tsx
│
├── ui/
│   ├── ScoreRing.tsx       — Animated SVG score gauge
│   ├── SkillTag.tsx        — Skill chip component
│   ├── BulletComparison.tsx— Before/after bullet display
│   └── CustomCursor.tsx    — Global cursor overlay
│
lib/
├── lenis.ts               — Lenis instance, init function
├── gsap.ts                — GSAP + ScrollTrigger setup
└── three-scene.ts         — Three.js singleton scene manager
```

### Key Rule: Client-Only Three.js

```tsx
// SceneManager.tsx
'use client'   // Required — Three.js uses window/document

// Dynamic import for SSR safety
const SceneManager = dynamic(() => import('./SceneManager'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#080808]" />,
})
```

---

## Performance Budget

| Concern | Target | Strategy |
|---|---|---|
| Draw calls | < 5 | InstancedMesh for all cubes |
| Triangle count | < 50k | Low-poly cubes (12 tris each) |
| FPS | 60fps | Pixel ratio capped at 2, bloom threshold high |
| JS parse time | < 200ms | Code-split Three.js, lazy load on hero visible |
| LCP | < 2.5s | Canvas placeholder until Three.js boots |
| CLS | 0 | Fixed canvas, no layout shifts |

---

## Scroll Pinning Strategy

Each section is pinned (scroll "sticks" while the 3D animation plays out).

```js
// Example: Pipeline section pin
ScrollTrigger.create({
  trigger: '#section-pipeline',
  start: 'top top',
  end: '+=300%',         // 3x viewport height of scroll distance
  pin: true,
  pinSpacing: true,
  scrub: 1,
  onUpdate: (self) => {
    // self.progress 0→1 drives this section's animation
    updatePipelineState(self.progress)
  }
})
```

This creates a "scrollytelling" effect — the physical scroll distance is extended, but the viewport stays pinned while the 3D animates.
