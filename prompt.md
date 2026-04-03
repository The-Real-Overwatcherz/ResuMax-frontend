# ResuMax — Build Prompt

You are building the landing page for **ResuMax 2.0**, an AI Resume Optimizer for CHARUSAT Hackathon 2026. The goal is an award-winning, cinematic frontend. All design decisions are already made and documented in `ai_dev_docs/`. Read every file there before writing a single line of code.

---

## Step 0 — Read These Docs First (mandatory)

```
ai_dev_docs/OVERVIEW.md              ← Creative vision, cube states, award strategy
ai_dev_docs/DESIGN_SYSTEM.md         ← Colors, typography, components, motion tokens
ai_dev_docs/ANIMATION_ARCHITECTURE.md← Three.js scene graph, GSAP timeline, Lenis bridge
ai_dev_docs/SECTIONS_SPEC.md         ← Every section: layout, content, reveal animations
ai_dev_docs/TECH_STACK.md            ← package.json, folder structure, all config files
```

Do not invent design decisions. Everything is specified. If something is ambiguous, the answer is always: darker, more minimal, more cinematic.

---

## What You Are Building

A single-page cinematic landing experience at `/`. The defining concept:

> A cluster of 3D floating cubes (Three.js WebGL) lives as a `position: fixed` canvas behind all HTML content. As the user scrolls (via Lenis smooth scroll), GSAP ScrollTrigger drives the cubes through 5 transformation states — from a dense hero cluster to individual feature panels that "fill" with UI content. The cubes ARE the content, not decoration.

---

## Build Order

Follow this exact sequence. Do not skip ahead.

### Phase 1 — Project Bootstrap
1. Run `npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"`
2. Install all dependencies from `ai_dev_docs/TECH_STACK.md` → package.json section
3. Replace `tailwind.config.js` with the full config from TECH_STACK.md
4. Replace `app/globals.css` with the globals from TECH_STACK.md
5. Create `next.config.js` from TECH_STACK.md
6. Create `tsconfig.json` from TECH_STACK.md
7. Create all folders from the project structure in TECH_STACK.md

### Phase 2 — Core Infrastructure
1. `lib/gsap-config.ts` — register ScrollTrigger, TextPlugin, CustomEase with custom cinematic eases
2. `lib/three-scene.ts` — ThreeScene singleton (scene, camera, renderer, bloom composer)
3. `lib/lenis.ts` — Lenis init with GSAP bridge (lenis.on scroll → ScrollTrigger.update)
4. `components/providers/LenisProvider.tsx` — context that inits Lenis, runs RAF
5. `app/layout.tsx` — wrap with LenisProvider, set html/body bg #080808, load fonts

### Phase 3 — Three.js Scene
1. `components/three/SceneConfig.ts` — lights (ambient, center point light, rim), fog, camera setup
2. `components/three/CubeSystem.ts` — InstancedMesh for 20 solid + 12 glass cubes, all positions from ANIMATION_ARCHITECTURE.md, `updateToProgress(progress: number)` method that interpolates between hero/pipeline/components/feedback/optimizer states
3. `components/three/ParticleField.ts` — 200 particle Points, upward drift in RAF
4. `components/three/SceneCanvas.tsx` — `'use client'`, mounts canvas, calls threeScene.init(), runs RAF loop with composer.render(), handles resize
5. `hooks/useScrollSync.ts` — registers all GSAP ScrollTrigger pins and scrub timelines, calls cubeSystem.updateToProgress() on each section's onUpdate

### Phase 4 — UI Components
Build these atoms before sections:
1. `components/ui/Button.tsx` — 4 variants: primary, secondary, outlined, ghost
2. `components/ui/ScoreRing.tsx` — animated SVG ring, accepts score (0-100), color by score range, animates on mount
3. `components/ui/SkillTag.tsx` — single tag chip
4. `components/ui/BulletComparison.tsx` — before/after bullets with strikethrough and typewriter reveal
5. `components/ui/StepCard.tsx` — pipeline step card with large faded number bg
6. `components/ui/CustomCursor.tsx` — outer ring (32px, lagged) + inner dot (6px, exact), mix-blend-mode difference on hover

### Phase 5 — Intro Animation
In `components/landing/HeroSection.tsx`:
- Implement the 2.5s intro sequence from ANIMATION_ARCHITECTURE.md Chapter 0
- Block scroll during intro (lenis.stop() → lenis.start() after 2.5s)
- "ResuMax" character scramble: start with random [A-Z0-9], resolve left-to-right
- Radar chart SVG draw animation (stroke-dashoffset from total length → 0)

### Phase 6 — Landing Sections (in order)
Build each section component. Each must:
- Have correct scroll-pin height as specified in SECTIONS_SPEC.md
- Register its GSAP ScrollTrigger in a `useLayoutEffect` (cleaned up on unmount)
- Sync with Three.js cube state via `cubeSystem`
- Implement all text/card reveal animations from SECTIONS_SPEC.md

1. `components/landing/Navbar.tsx`
2. `components/landing/HeroSection.tsx` (complete)
3. `components/landing/PipelineSection.tsx`
4. `components/landing/ComponentsSection.tsx`
5. `components/landing/FeedbackSection.tsx`
6. `components/landing/OptimizerSection.tsx`
7. `components/landing/SiteFooter.tsx`

### Phase 7 — Assembly
`app/page.tsx`:
```tsx
'use client'
import dynamic from 'next/dynamic'
// ... import all sections

const SceneCanvas = dynamic(() => import('@/components/three/SceneCanvas'), { ssr: false })

export default function LandingPage() {
  return (
    <>
      <SceneCanvas />
      <CustomCursor />
      <div className="page-wrapper">
        <Navbar />
        <HeroSection />
        <PipelineSection />
        <ComponentsSection />
        <FeedbackSection />
        <OptimizerSection />
        <SiteFooter />
      </div>
    </>
  )
}
```

---

## Non-Negotiable Rules

1. **Three.js canvas is always `position: fixed`, z-index 0, pointer-events none** — HTML sits above it at z-index 1
2. **No CSS transitions or animations that compete with GSAP** — all motion goes through GSAP
3. **Lenis must drive scroll** — never use `window.scrollY` directly; use Lenis's scroll value
4. **InstancedMesh for all cubes** — never create individual Mesh per cube (performance)
5. **`'use client'` on every Three.js component** — no SSR for WebGL
6. **`dynamic(() => import(...), { ssr: false })`** for SceneCanvas in page.tsx
7. **Scroll pins use `scrub: 1.5`** — cinematic lag, not instant
8. **Background color #080808 must be set in `<html>`** before any JS loads — prevents white flash
9. **Custom cursor must hide native cursor** via `* { cursor: none !important }`
10. **`prefers-reduced-motion`** — if detected, skip all Three.js animation, show static scene only

---

## Color Quick Reference

```
Background:     #080808
Surface:        #111111
Border:         #1e1e1e → #2a2a2a (hover)
Text primary:   #FFFFFF
Text secondary: #AAAAAA
Text muted:     #666666
Glow blue:      #4a9eff
Score low:      #ff4444
Score mid:      #ffaa00
Score high:     #FFFFFF
```

---

## Typography Quick Reference

```
Hero title:     Inter 700, 96px, line-height 0.95   → "ResuMax"
Section head:   Inter 700, 72px, line-height 1.0    → "The Precision Pipeline"
Card title:     Inter 600, 24px                      → "ATS Score Analysis"
Body:           Inter 400, 16px, line-height 1.6
Labels:         Inter 500, 12px, letter-spacing 0.2em, uppercase
Mono data:      JetBrains Mono 400, 14px
Score numbers:  JetBrains Mono 400, 48px
```

---

## The Cube State Machine (summary)

```
Progress 0.00–0.20  →  Hero state:      dense cluster, center glow, ambient drift
Progress 0.20–0.40  →  Pipeline state:  4 cubes break off into horizontal row
Progress 0.40–0.65  →  Components:      2×2 grid, cubes "open" and fill with UI
Progress 0.65–0.85  →  Feedback:        3 cubes with score rings inside
Progress 0.85–1.00  →  Optimizer:       1 flat document cube, then all collapse
```

`CubeSystem.updateToProgress(p)` must lerp all 32 cube transforms between these states using GSAP's internal interpolation or manual THREE.MathUtils.lerp.

---

## Deliverable

A running `npm run dev` with:
- Smooth 60fps scroll (Lenis)
- 3D cube cluster visible in hero, transforming through all states on scroll
- All 5 sections with correct content and reveal animations
- Custom cursor working
- Intro animation on first load
- No console errors
- Mobile: Three.js scene simplified (reduce cube count to 8, no bloom), sections stack vertically
