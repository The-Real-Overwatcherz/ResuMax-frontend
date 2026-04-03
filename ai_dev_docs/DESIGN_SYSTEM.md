# ResuMax — Design System

## Color Tokens

### Base Palette

```css
:root {
  /* Backgrounds */
  --color-bg-base:        #080808;   /* Page background — near-black resumax */
  --color-bg-surface:     #111111;   /* Card/panel surface */
  --color-bg-elevated:    #1a1a1a;   /* Elevated surfaces, hover states */
  --color-bg-overlay:     #222222;   /* Tooltip, dropdown backgrounds */

  /* Text */
  --color-text-primary:   #FFFFFF;   /* Main headings, CTA labels */
  --color-text-secondary: #AAAAAA;   /* Body text, descriptions */
  --color-text-muted:     #666666;   /* Labels, timestamps, placeholders */
  --color-text-disabled:  #333333;   /* Disabled state text */

  /* Borders */
  --color-border-subtle:  #1e1e1e;   /* Card borders, dividers */
  --color-border-default: #2a2a2a;   /* Active card borders */
  --color-border-strong:  #3d3d3d;   /* Hover, focused borders */
  --color-border-white:   #FFFFFF1A; /* White 10% — glass borders */

  /* Accents — used sparingly */
  --color-glow-blue:      #4a9eff;   /* Center cube glow, score rings */
  --color-glow-white:     #FFFFFF40; /* Ambient glow halos */
  --color-score-low:      #ff4444;   /* Score < 40 — needs work */
  --color-score-mid:      #ffaa00;   /* Score 40–70 — getting there */
  --color-score-high:     #FFFFFF;   /* Score 70+ — interview ready (white, not green) */

  /* 3D / Canvas specific */
  --color-cube-solid:     #1a1a1a;   /* Solid cube face color */
  --color-cube-wire:      #2a2a2a;   /* Wireframe cube edge color */
  --color-cube-glow:      #4a9eff55; /* Cube inner glow */
  --color-canvas-fog:     #080808;   /* Three.js fog color matches bg */
}
```

### Tailwind Config Extension

```js
// tailwind.config.js — extend colors
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
}
```

---

## Typography

### Font Stack

```css
/* Primary — Display & Headings */
font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;

/* Mono — Labels, code snippets, data */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `display-xl` | 96px / 6rem | 0.95 | 700 | "ResuMax" hero title |
| `display-lg` | 72px / 4.5rem | 1.0 | 700 | Section main headings |
| `display-md` | 48px / 3rem | 1.05 | 600 | Sub-section headings |
| `heading-lg` | 32px / 2rem | 1.1 | 600 | Card titles |
| `heading-md` | 24px / 1.5rem | 1.2 | 500 | Card sub-headings |
| `body-lg` | 18px / 1.125rem | 1.6 | 400 | Primary body copy |
| `body-md` | 16px / 1rem | 1.6 | 400 | Secondary body copy |
| `body-sm` | 14px / 0.875rem | 1.5 | 400 | Captions, meta |
| `label-lg` | 12px / 0.75rem | 1.4 | 500 | UPPERCASE labels |
| `label-sm` | 10px / 0.625rem | 1.4 | 500 | Tags, badges |
| `mono-md` | 14px / 0.875rem | 1.5 | 400 | Code, data values |

### Typography Rules

- Section labels (e.g., "PROCESS") — always `letter-spacing: 0.2em`, uppercase, `color: var(--color-text-muted)`
- Step numbers (01, 02…) — always `font-size: 64px`, `font-weight: 700`, `opacity: 0.15` (decorative background)
- Score numbers inside gauges — `JetBrains Mono`, 48px, white
- Before/after bullet text — `body-sm`, secondary color

---

## Spacing Scale

```css
/* Based on 4px grid */
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
--space-32: 128px
```

### Layout

- Max content width: `1280px`
- Section padding (vertical): `160px` top/bottom on desktop, `80px` mobile
- Grid columns: 12-column grid, `24px` gap
- Card padding: `32px`
- Navbar height: `64px` (fixed)

---

## Component Variants

### Button

```
Primary     — white bg (#FFF), black text (#000), no border
             hover: scale(1.02), box-shadow: 0 0 20px rgba(255,255,255,0.2)

Secondary   — transparent bg, white border (1px solid #333), white text
             hover: border-color #666, bg #111

Outlined    — transparent bg, white border (1px solid #FFF), white text
             hover: bg #FFF, text #000 (invert)

Ghost       — transparent bg, no border, white text
             hover: bg rgba(255,255,255,0.05)

Icon        — 40x40 square, border #2a2a2a, centered icon
             hover: border #555, bg #1a1a1a
```

### Card

```
Base Card   — bg: #111, border: 1px solid #1e1e1e, border-radius: 12px, padding: 32px
             hover: border-color #2a2a2a, box-shadow: 0 8px 32px rgba(0,0,0,0.5)

Feature Card — Base Card + colored left border (4px solid)
              Left border colors per feature: blue, orange, teal, purple (subtle)

Score Card  — circular layout, mono font for numbers, ring animation

Step Card   — Base Card + large faded step number (opacity: 0.08) in background
```

### Skill Tag

```
Default     — bg: #1a1a1a, border: 1px solid #2a2a2a, border-radius: 4px
              padding: 4px 10px, font: mono-md, color: text-secondary

Matched     — bg: rgba(255,255,255,0.08), border: 1px solid #555
              color: text-primary
```

### Score Ring (SVG)

```
Container   — circular SVG, 120x120px
Track       — stroke: #1e1e1e, stroke-width: 6, fill: none
Progress    — stroke: white (high) / #ffaa00 (mid) / #ff4444 (low)
              stroke-dasharray animated from 0 to value%
Number      — centered text, JetBrains Mono, 36px, white
Label       — below ring, label-lg, muted color, uppercase
```

---

## Glassmorphism — Cube Glass Panels

Used for wireframe/glass cubes in Three.js scene:

```
material: MeshPhysicalMaterial
  color: #ffffff
  metalness: 0.1
  roughness: 0.05
  transmission: 0.9       (glass-like transparency)
  opacity: 0.15
  transparent: true
  envMapIntensity: 1.0
  side: DoubleSide
```

---

## Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Tags, badges, inputs |
| `radius-md` | 8px | Buttons, small cards |
| `radius-lg` | 12px | Feature cards |
| `radius-xl` | 20px | Large panels |
| `radius-full` | 9999px | Pills, score rings |

---

## Shadow System

```css
--shadow-sm:  0 2px 8px rgba(0,0,0,0.4);
--shadow-md:  0 8px 32px rgba(0,0,0,0.6);
--shadow-lg:  0 16px 64px rgba(0,0,0,0.8);
--shadow-glow-white: 0 0 30px rgba(255,255,255,0.08);
--shadow-glow-blue:  0 0 40px rgba(74,158,255,0.3);
```

---

## Motion Tokens

```js
const easing = {
  smooth:    [0.25, 0.1, 0.25, 1.0],   // cubic-bezier — standard
  spring:    'elastic.out(1, 0.5)',      // GSAP elastic — for tags, pops
  decelerate:[0.0, 0.0, 0.2, 1.0],     // enters
  accelerate:[0.4, 0.0, 1.0, 1.0],     // exits
  cinematic: [0.76, 0, 0.24, 1],        // heavy, weighty motion
}

const duration = {
  instant:  0.1,
  fast:     0.2,
  normal:   0.4,
  slow:     0.7,
  cinematic:1.2,
  reveal:   1.8,    // section reveals
  intro:    2.5,    // initial load sequence
}
```

---

## Cursor

Custom cursor replaces default:

```
Outer ring  — 32px circle, border: 1px solid rgba(255,255,255,0.5), no fill
              follows cursor with ~80ms lag (GSAP quickTo)
Inner dot   — 6px solid white circle
              follows cursor exactly (no lag)

Hover state (links/buttons):
  outer ring → scales to 48px, opacity 0.8
  mix-blend-mode: difference  (inverts colors under cursor on hover)

Grab state (over 3D canvas):
  outer ring → crosshair style, dashed border
```
