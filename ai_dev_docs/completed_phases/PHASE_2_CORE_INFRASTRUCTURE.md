# Phase 2 — Core Infrastructure (COMPLETED)

**Date:** 2026-03-31

---

## What Was Done

### 1. GSAP Configuration — `lib/gsap-config.ts`

- Registered plugins: `ScrollTrigger`, `TextPlugin`, `CustomEase`
- Created 3 custom cinematic eases:
  - `'cinematic'` — `M0,0 C0.76,0 0.24,1 1,1` (weighty, deliberate motion)
  - `'heavy-drop'` — `M0,0 C0.215,0.61 0.355,1 1,1` (gravity-like drop)
  - `'reveal'` — `M0,0 C0.25,0.46 0.45,0.94 1,1` (section text reveal)
- Set GSAP global defaults: `ease: 'power3.out'`, `duration: 0.6`
- Set ScrollTrigger defaults: `toggleActions: 'play none none reverse'`, markers disabled
- `gsap.ticker.lagSmoothing(500, 33)` — tab-switch protection
- Exports `{ gsap, ScrollTrigger, TextPlugin, CustomEase }` for convenience

### 2. Three.js Singleton — `lib/three-scene.ts`

- `ThreeScene` class with singleton export `threeScene`
- `init(canvas)` — guarded by `_initialized` flag (safe to call multiple times)
- **Scene:** `THREE.Scene` with `Fog(0x080808, 15, 30)` — cubes fade into void
- **Camera:** `PerspectiveCamera(60, aspect, 0.1, 100)` at `position(0, 2, 12)`, `lookAt(0, 0, 0)`
- **Renderer:** `WebGLRenderer` with `antialias`, `alpha: true`, `powerPreference: 'high-performance'`
  - Pixel ratio capped: `Math.min(devicePixelRatio, 2)`
  - `ACESFilmicToneMapping`, exposure `0.8`
  - Shadow maps: `PCFSoftShadowMap`
- **Post-processing:** `EffectComposer` → `RenderPass` → `UnrealBloomPass`
  - Bloom: strength `0.4`, radius `0.8`, threshold `0.9` (only brightest areas bloom)
- `resize()` — updates camera aspect + renderer + composer sizes
- `dispose()` — full cleanup on unmount

### 3. Lenis Smooth Scroll — `lib/lenis.ts`

- `initLenis()` — creates Lenis instance (guarded against double-init)
- Config: `duration: 1.4`, exponential easing, `smoothWheel`, `wheelMultiplier: 0.8`, `touchMultiplier: 2.0`
- **GSAP bridge:** `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t * 1000))`
- `gsap.ticker.lagSmoothing(0)` inside initLenis (Lenis owns the smoothing)
- Exports: `initLenis()`, `getLenis()`, `destroyLenis()`
- **Import path:** `import Lenis from 'lenis'` (NOT `@studio-freight/lenis`)

### 4. Lenis React Context — `components/providers/LenisProvider.tsx`

- `'use client'` directive
- `LenisContext` — `createContext<Lenis | null>(null)`
- `useLenis()` — hook to access Lenis instance from any child component
  - Used in `HeroSection` to call `lenis.stop()` / `lenis.start()` around intro animation
- `LenisProvider` — calls `initLenis()` in `useEffect`, `destroyLenis()` on cleanup
- Wraps children in `<LenisContext.Provider value={lenisRef.current}>`

### 5. Utility Hooks

| File | Purpose |
|------|---------|
| `hooks/useIsClient.ts` | Returns `true` after hydration — SSR guard for window/document usage |
| `hooks/useReducedMotion.ts` | Reads `prefers-reduced-motion` media query — returns boolean |
| `hooks/useWindowSize.ts` | Returns `{ width, height }` that updates on resize (passive listener) |

### 6. Root Layout Updated — `app/layout.tsx`

- Wraps `{children}` with `<LenisProvider>`
- Side-effect import `'@/lib/gsap-config'` — ensures plugins registered before any component tree renders
- `<html style={{ backgroundColor: '#080808' }}>` — prevents white flash before JS
- Added full SEO metadata: title, description, keywords, OpenGraph

---

## File Manifest

```
lib/
├── gsap-config.ts          ✅ NEW
├── three-scene.ts          ✅ NEW
├── lenis.ts                ✅ NEW
└── utils.ts                (unchanged from Phase 1)

hooks/
├── useIsClient.ts          ✅ NEW
├── useReducedMotion.ts     ✅ NEW
└── useWindowSize.ts        ✅ NEW

components/providers/
└── LenisProvider.tsx       ✅ NEW

app/
└── layout.tsx              ✅ MODIFIED (LenisProvider + gsap-config import)
```

---

## Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | ✅ Zero errors |
| `npm run dev` | ✅ Compiled 487 modules, ready in 1846ms |
| `GET /` | ✅ 200 OK, 2.2s compile |
| Console errors | ✅ None |
| Background color | ✅ #080808 |
| Lenis scroll feel | ✅ Smooth inertia (no native scroll) |

---

## Deviations from prompt.md

| # | Spec Says | What We Did | Why |
|---|-----------|-------------|-----|
| 1 | `@studio-freight/lenis` | `lenis` (v1.3.x) | Package renamed; same API |
| 2 | `gsap.ticker.lagSmoothing(0)` in Lenis | Also called in `gsap-config.ts` with `lagSmoothing(500,33)` | Config sets tab-switch protection; Lenis overrides to 0 for scroll precision. Both calls are correct in context. |
| 3 | `useScrollSync.ts` in `components/three/hooks/` | Deferred to Phase 3 | This hook depends on CubeSystem which is Phase 3 |

---

## Important Notes for Future Phases

- **`useLenis()`** — any component needing scroll control imports this hook
- **`threeScene`** singleton — import from `'@/lib/three-scene'`, never instantiate new
- **`useIsClient()`** — wrap all Three.js / window code in `if (isClient)` guards
- **`useReducedMotion()`** — if `true`, SceneCanvas should skip all GSAP animation and show static scene
- **GSAP plugins** — already registered globally; never call `gsap.registerPlugin()` again elsewhere
- **Lenis stop/start** — `lenis.stop()` during intro animation (Phase 5), `lenis.start()` after 2.5s
