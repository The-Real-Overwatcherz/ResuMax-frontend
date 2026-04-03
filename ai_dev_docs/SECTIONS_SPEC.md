# ResuMax — Section-by-Section Specification

## Page Structure

```
┌──────────────────────────────────────────────────────┐
│  NAVBAR (fixed, z-index: 100)                        │
├──────────────────────────────────────────────────────┤
│  SECTION 1: HERO                (100vh, pinned)      │
├──────────────────────────────────────────────────────┤
│  SECTION 2: PIPELINE            (300vh scroll, pin)  │
├──────────────────────────────────────────────────────┤
│  SECTION 3: ENGINEERED COMP.    (300vh scroll, pin)  │
├──────────────────────────────────────────────────────┤
│  SECTION 4: VISUAL FEEDBACK     (200vh scroll, pin)  │
├──────────────────────────────────────────────────────┤
│  SECTION 5: OPTIMIZER           (200vh scroll, pin)  │
├──────────────────────────────────────────────────────┤
│  FOOTER                         (auto height)        │
└──────────────────────────────────────────────────────┘
```

Total page scroll height: ~1400vh (immersive scrollytelling)

---

## NAVBAR

### Layout

```
[RESUMAX 2.0]     [How It Works]  [Pricing]  [About]     [Login →]
```

### Specs

- Position: `fixed`, top: 0, width: 100%, z-index: 100
- Height: 64px
- Background: transparent on load → `rgba(8,8,8,0.9)` with `backdrop-filter: blur(20px)` after 50px scroll
- Left: Logo text — `RESUMAX 2.0` — monospace, 13px, letter-spacing 0.15em, white
- Center: Nav links — Inter, 14px, color: `#666`, hover: `#fff` (transition 0.2s)
- Right: `Login` button — outlined variant (white border, white text), 36px height, 16px padding
- Bottom border appears on scroll: `1px solid rgba(255,255,255,0.05)`

### Scroll Behavior

- At scroll > 50px: background fills in with blur (GSAP or CSS transition)
- Nav links highlight when their section is in viewport (GSAP ScrollTrigger active classes)

---

## SECTION 1: HERO

### HTML Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  [left half — text content]      [right half — radar chart SVG] │
│                                                                  │
│  ResuMax                         ◇─────◇                       │
│  Your resume, engineered          / \   / \                     │
│  for impact.                     ◇   ◇─◇   ◇                   │
│                                   \ /       \ /                  │
│  [START ANALYZING →]              ◇─────────◇                  │
│                                                                  │
│                                                                  │
│                     ▾ SCROLL TO DISCOVER ▾                      │
└─────────────────────────────────────────────────────────────────┘
```

### 3D Scene State

- Dense floating cube cluster (full hero state from ANIMATION_ARCHITECTURE)
- Center blue-white glow active
- Ambient rotation running

### Text Reveal Sequence (on intro complete)

1. "ResuMax" — character scramble animation (GSAP TextPlugin or custom)
   - Characters start as random `[A-Z0-9]`
   - Each character resolves to correct letter over 0.5s
   - Staggered left to right: 0.05s per char

2. Subtext — fade up from `translateY(20px)`, opacity 0→1, delay 0.3s after heading

3. CTA Button — slides up from `translateY(30px)`, delay 0.5s

4. Radar chart — draw animation (SVG stroke-dashoffset) from center outward

### Radar Chart SVG

```
A web-like geometric shape (heptagon + internal connecting lines)
Lines are thin (0.5px), color: rgba(255,255,255,0.15)
Intersection nodes: 3px circles, white, opacity 0.3
On hover: node nearest cursor brightens (opacity 0.8)
The radar chart is purely decorative — abstract representation of resume scoring dimensions
Size: ~280px × 280px
```

### CTA Button

```
Text:         "START ANALYZING  →"
Style:        Outlined variant
Font:         Inter, 14px, letter-spacing: 0.12em, uppercase
Padding:      14px 28px
Border:       1px solid rgba(255,255,255,0.6)
Hover:        bg→#fff, text→#000, transition 0.3s
              + slight box-shadow: 0 0 30px rgba(255,255,255,0.2)
```

### Scroll Indicator

```
Text: "SCROLL TO DISCOVER" — 10px, letter-spacing 0.25em, muted
Below: animated dot that bounces vertically (CSS keyframe)
Position: bottom center, absolute
Fades out as user begins scrolling (GSAP opacity → 0 at scroll > 5%)
```

---

## SECTION 2: THE PRECISION PIPELINE

### Pinning

- Pin duration: 300vh of scroll
- The section header ("PROCESS", "The Precision Pipeline") is fixed in the HTML layer
- The 4 step cards reveal progressively as cubes transform

### HTML Layout (reveals as cubes transform)

```
PROCESS
The Precision Pipeline     Our proprietary parsing engine dissects your
                           history to identify exactly what top-tier
                           recruiters are looking for.

[Card 01]  [Card 02]  [Card 03]  [Card 04]

 Upload     Parse      Score     Optimize
```

### Step Card Design

```
Width: 260px
Height: 320px (or auto)
bg: #111111
border: 1px solid #1e1e1e
border-radius: 12px
padding: 32px 28px

Top: Step icon (SVG, 28x28, color: #555)
Background: Step number "01" — font-size: 80px, opacity: 0.06, position: absolute bottom-right

Title: heading-md, white
Body: body-sm, #666

Reveal animation: translateY(40px) opacity:0 → translateY(0) opacity:1
Stagger: 0.15s per card (scroll-triggered)
```

### Step Content

```
01 — Upload
     Icon: upload/document icon
     "Securely drop your PDF or DOCX file into our encrypted analyzer."

02 — Parse
     Icon: brackets/code icon
     "AI extracts entities, skills, and impact metrics with 98.8% accuracy."

03 — Score
     Icon: chart/bar icon
     "Receive a real-time ATS compliance score benchmarked against Fortune 500 JDs."

04 — Optimize
     Icon: sparkle/wand icon
     "Deploy AI-powered improvements for bullet points and missing keywords."
```

### 3D Cube State Sync

- As scroll progress through section: 4 cubes in the cluster detach and arrange horizontally
- Each cube face shows the step number as a subtle texture
- When a card HTML reveals → its corresponding cube brightens (glow increases)

---

## SECTION 3: ENGINEERED COMPONENTS

### Pinning

- Pin duration: 300vh of scroll

### HTML Layout

```
                    Engineered Components

┌──────────────────────────┐  ┌──────────────────────────┐
│  ATS Score Analysis      │  │  Bullet Enhancer          │
│  Real-time proprietary   │  │  Transform passive duties  │
│  ranking algorithm.      │  │  into active achievements. │
│                          │  │                            │
│         ╭───╮            │  │  ┌──────────────────────┐ │
│         │ 89│            │  │  │ ~~Responsible for...~~ │
│         ╰───╯            │  │  └──────────────────────┘ │
│                          │  │  ┌──────────────────────┐ │
└──────────────────────────┘  │  │ "Expedited a 15-member│ │
                              │  │  regional sales div..." │
┌──────────────────────────┐  │  └──────────────────────┘ │
│  Skill Matching          │  └──────────────────────────┘
│                          │
│  [GSAP] [React.js]       │  ┌──────────────────────────┐
│  [Node.js] [Docker]      │  │  Job Matcher              │
│  [Python]                │  │  Maps resume keywords to   │
│                          │  │  JD demands.              │
└──────────────────────────┘  │                           │
                              │         📄                │
                              └──────────────────────────┘
```

### ATS Score Card

```
Score Ring:
  - SVG circle 120×120px
  - Track: stroke #1e1e1e, stroke-width 6
  - Progress stroke: white, animates from 0 → 89% on scroll reveal
  - Center: "89" in JetBrains Mono, 36px
  - Label below ring: "ATS SCORE" — label-lg, muted
  - Animation: stroke-dasharray 0 → value, duration 1.5s, ease.out
  - After animation: subtle pulse on the progress stroke
```

### Bullet Enhancer Card

```
Before text box:
  bg: #0a0a0a, border: 1px solid #1e1e1e, border-radius: 6px
  padding: 12px 16px
  text: body-sm, color: #444 (muted, "weak")
  strikethrough line draws across it on reveal
  Label: "BEFORE" — label-sm, #ff4444, above box

After text box:
  bg: #111, border: 1px solid #2a2a2a, border-radius: 6px
  padding: 12px 16px
  text: body-sm, color: #aaa
  Typed in character by character (GSAP TextPlugin, 0.02s/char)
  Label: "AFTER" — label-sm, #4ade80 (green) OR white — above box

Transition between boxes: before fades out → after types in
```

### Skill Matching Card

```
Tags:
  Each tag reveals with elastic spring (GSAP elastic.out(1, 0.5))
  Stagger: 0.08s between tags
  Tags: [GSAP] [React.js] [GSSX] [Node.js] [Docker] [Python]
  See Skill Tag design in DESIGN_SYSTEM.md

Cards section label: "Skill Matching" — heading-lg
Subtext: "Cross-referenced skills found in your resume." — body-sm, muted
```

### Job Matcher Card

```
Icon: Document with magnifier — 64px, color: #333, centered
Subtext: "Maps resume keywords to JD demands." — body-sm, muted, centered
Subtle dashed border inside card (animated line drawing on reveal)
```

### Cards Reveal Order (scroll-triggered)

1. ATS Score card → scale 0.9→1.0, opacity 0→1
2. Bullet Enhancer → 0.15s delay
3. Skill Matching → 0.3s delay
4. Job Matcher → 0.45s delay

---

## SECTION 4: VISUAL FEEDBACK ENGINE

### Pinning

- Pin duration: 200vh of scroll

### HTML Layout

```
              Visual Feedback Engine

  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
  │                  │  │                  │  │                  │
  │       28         │  │       60         │  │       89         │
  │                  │  │                  │  │                  │
  │   NEEDS WORK     │  │  GETTING THERE   │  │ INTERVIEW READY  │
  └──────────────────┘  └──────────────────┘  └──────────────────┘
```

### Score State Cards

```
Each card: 200×200px, centered ring, mono number, label

Score 28 — NEEDS WORK:
  Ring stroke color: #ff4444
  Number color: #ff4444
  bg: #0d0505 (very subtle warm dark)
  Label color: #ff4444, opacity: 0.8

Score 60 — GETTING THERE:
  Ring stroke color: #ffaa00
  Number color: #ffaa00
  bg: #0d0b05 (very subtle warm dark)
  Label color: #ffaa00, opacity: 0.8

Score 89 — INTERVIEW READY:
  Ring stroke color: #FFFFFF
  Number color: #FFFFFF
  bg: #111 (normal)
  Label color: #AAAAAA
  + subtle glow: box-shadow 0 0 40px rgba(255,255,255,0.05)
```

### Scroll-triggered Reveal

- All 3 cards start invisible and 20px below
- Stagger in from left to right (0.2s stagger)
- Ring animations fire when card is ~50% in viewport
- Number counts up from 0 (GSAP Counter animation)

---

## SECTION 5: OPTIMIZER PREVIEW

### Pinning

- Pin duration: 200vh of scroll

### HTML Layout

```
RESUME OPTIMIZED

  ┌─────────────────────────────────────────────────────────┐
  │  █████████████ ████████████████                         │  ← header bar (progress)
  │                                                         │
  │  • Resolved 45+ critical technical queries daily,       │
  │    maintaining 99% CSAT score.                          │
  │                                                         │
  │  • Orchestrated high-value lead acquisition strategies, │
  │    increasing pipeline by 30%.                          │
  │                                                         │
  │  • Engineered automated reporting dashboards using      │
  │    advanced analytics.                                  │
  └─────────────────────────────────────────────────────────┘
```

### Panel Design

```
Container:
  bg: #0d0d0d
  border: 1px solid #1e1e1e
  border-radius: 12px
  padding: 24px 28px
  max-width: 640px
  margin: 0 auto

Header area:
  Two bars (skeleton loader style)
  bg: #222, border-radius: 4px
  Heights: 8px and 6px
  Animate from 0 width → full width on reveal

Bullet points:
  Type in one by one (GSAP TextPlugin or custom typewriter)
  Each bullet: body-sm, #aaa
  Bullet marker: 3px circle, white, opacity: 0.5
  Delay between bullets: 0.5s
  Each bullet animates translateX(-10px) opacity:0 → translateX(0) opacity:1
```

### Section Label

```
"RESUME OPTIMIZED"
font: mono-md, letter-spacing: 0.2em, uppercase
color: muted (#666)
+ subtle underline: 1px solid #222
```

---

## FOOTER

### Layout

```
                    RESUMAX

          BUILT ON AI. OPTIMIZED FOR HUMANS.

  ─────────────────────────────────────────────────────────

  © 2026 ResuMax. All rights reserved.
```

### Design

```
Background: #080808 (same as page, no visual break)
Top border: 1px solid #111

Brand name:
  "RESUMAX"
  letter-spacing: 0.3em, uppercase
  font-size: 18px, white
  centered

Tagline:
  "BUILT ON AI. OPTIMIZED FOR HUMANS."
  mono font, 12px, #444, letter-spacing: 0.15em
  centered, margin-top: 8px

Divider: 1px solid #111, width: 100%, margin: 40px 0

Copyright: 10px, #333, centered
```

---

## HTML Animation Rules (All Sections)

### Text Reveal Standard

All headings use this pattern:

```js
// Heading reveal
gsap.from(headingEl, {
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: headingEl,
    start: 'top 85%',
  }
})

// Small label above heading (e.g., "PROCESS")
gsap.from(labelEl, {
  y: 15,
  opacity: 0,
  duration: 0.5,
  ease: 'power2.out',
  scrollTrigger: { trigger: labelEl, start: 'top 88%' }
})
```

### Card Grid Stagger Standard

```js
gsap.from(cards, {
  y: 40,
  opacity: 0,
  duration: 0.6,
  stagger: 0.12,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: cardsContainer,
    start: 'top 80%',
  }
})
```

### SVG Line Draw Standard

```js
// Any decorative SVG lines
gsap.from(svgPath, {
  strokeDashoffset: svgPath.getTotalLength(),
  duration: 1.5,
  ease: 'power2.inOut',
  scrollTrigger: { trigger: svgPath, start: 'top 80%' }
})
```
