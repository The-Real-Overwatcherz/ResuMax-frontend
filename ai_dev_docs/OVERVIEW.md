# ResuMax — Creative Vision & Project Overview

## Project Identity

| Field         | Value                                      |
|---------------|--------------------------------------------|
| Name          | ResuMax 2.0                       |
| Tagline       | Your resume, engineered for impact.        |
| Sub-tagline   | Built on AI. Optimized for Humans.         |
| Theme         | Cinematic Dark — Brutalist Tech   |
| Hackathon     | CHARUSAT 2026 — Track 01: AI Resume Optimizer |

---

## The Core Concept: "The Living Cube"

The entire landing page is built around a single persistent idea:

> A cluster of floating 3D cubes exists as the soul of the page. As the user scrolls, the cubes are not decorative — they ARE the content. Each cube starts empty (wireframe/glass). As sections reveal, the cubes fill with data, transform into UI components, and tell the story of ResuMax.

The cube cluster is ALWAYS visible. It transitions between states as scroll progresses. It never disappears — it morphs.

### Cube States Per Scroll Position

| Scroll Position | Cube State |
|---|---|
| 0% — Hero | Dense floating cluster, center glow, ambient drift |
| 20% — Pipeline | 4 cubes detach and arrange into a horizontal line |
| 40% — Components | Grid of 4 cubes, each "opens" like a panel filling with UI |
| 65% — Feedback Engine | 3 cubes remain, score rings animate inside them |
| 85% — Optimizer | 1 large cube becomes a full document panel |
| 100% — Footer | All cubes collapse back into a single point and vanish |

---

## Award-Winning Strategy

What separates this from a standard hackathon project:

### 1. Scroll-Driven 3D Narrative
Every scroll delta advances a story. The 3D object is not background decoration — it IS the UI. This is rare. Most sites use scroll for opacity fades. This uses scroll to transform a live 3D scene into interactive components.

### 2. No Page "Sections" in the Traditional Sense
The page has no visible horizontal dividers or section breaks. The content transitions emerge FROM the 3D transformation. The cube opening IS the section transition.

### 3. Cinematic Entry Sequence
On first load (before any scroll):
- Black screen
- A single point of light appears
- Expands into the cube cluster in ~2.5 seconds
- Text fades in only AFTER the cube settles
- "ResuMax" types in character by character
- This is the first impression — must feel like a movie opening

### 4. Micro-interactions
- Cursor follows with a soft dot (custom cursor)
- Hovering over cubes causes them to repel slightly (magnetic repulsion)
- Button hover triggers a subtle glow ring
- Skill tags snap in with elastic physics

### 5. Performance-First
- Three.js canvas is a fixed background — HTML overlays on top
- Lenis provides butter-smooth scroll at 60fps
- GSAP handles all timing — NO CSS transitions compete
- Instanced mesh for cube rendering (single draw call for all cubes)

---

## Pages in Scope (Hackathon Phase 1)

| Page | Route | Description |
|---|---|---|
| Landing | `/` | Full cinematic experience (this document) |
| Auth | `/login` | Minimal dark login form |
| Auth | `/register` | Minimal dark register form |
| Upload | `/analyze` | Resume + JD upload interface |
| Dashboard | `/dashboard` | ATS score, keyword gaps, analysis results |
| History | `/history` | Past analysis list |

This document covers ONLY the Landing Page (`/`).

---

## Mood & Reference Points

- Tone: Serious, technical, premium — NOT playful or colorful
- Feel: Like a high-end product launch (Apple-esque but darker, more raw)
- Color story: Pure black — the void that absorbs all light. Nothing bright unless it means something.
- Motion: Deliberate, weighty — cubes have mass. Nothing bounces carelessly.
- Typography: Precise, engineered — like a circuit board annotation

---

## What "Award-Winning" Means Here

1. The first 3 seconds must create genuine surprise
2. Scroll must feel like controlling a film timeline
3. Every section transition must feel earned, not arbitrary
4. The product story (ATS problem → pipeline → solution) is told visually, not just with text
5. No element exists without purpose
