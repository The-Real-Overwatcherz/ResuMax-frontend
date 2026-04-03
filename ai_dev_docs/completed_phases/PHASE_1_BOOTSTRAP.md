# Phase 1 — Project Bootstrap (COMPLETED)

**Date:** 2026-03-31

---

## What Was Done

### 1. Git Init
- Initialized empty git repo in `ResumaxFrontend/`

### 2. Next.js 14 Scaffold (Manual)
- `create-next-app@14` failed due to directory name `ResumaxFrontend` having capitals (npm naming restriction)
- **Solution:** Manually created `package.json`, `app/layout.tsx`, `app/page.tsx`, config files
- Result is identical to what create-next-app would produce

### 3. Dependencies Installed
All from TECH_STACK.md with one deviation:

| Package | Spec | Installed | Note |
|---------|------|-----------|------|
| next | 14.2.x | 14.2.35 | |
| react / react-dom | ^18.3.0 | 18.3.x | |
| three | ^0.167.0 | 0.167.x | |
| @types/three | ^0.167.0 | 0.167.x | |
| gsap | ^3.12.5 | 3.12.x | **All plugins now free (incl. CustomEase, TextPlugin)** |
| @gsap/react | ^2.1.1 | 2.1.x | |
| **lenis** | **^1.3.0** | **1.3.x** | **DEVIATION: `@studio-freight/lenis` renamed to `lenis`. Max version under old name was 1.0.42. Import path is now `'lenis'` not `'@studio-freight/lenis'`** |
| clsx | ^2.1.1 | 2.1.x | |
| tailwind-merge | ^2.4.0 | 2.4.x | |

### 4. Configuration Files Created

| File | Source | Notes |
|------|--------|-------|
| `tailwind.config.js` | TECH_STACK.md (exact) | resumax colors, fonts, display sizes, animations |
| `postcss.config.js` | Standard | tailwindcss + autoprefixer |
| `app/globals.css` | TECH_STACK.md (exact) | All CSS vars from DESIGN_SYSTEM.md, cursor:none, scrollbar, canvas.three-bg, .page-wrapper, reduced-motion |
| `next.config.js` | TECH_STACK.md | transpilePackages: `['three', 'gsap', 'lenis']` (updated from `@studio-freight/lenis`) |
| `tsconfig.json` | TECH_STACK.md (exact) | `@/*` path alias, strict, bundler resolution |
| `.eslintrc.json` | Standard | extends next/core-web-vitals |
| `.gitignore` | Standard Next.js | node_modules, .next, .env, etc. |

### 5. Folder Structure

```
resumax-frontend/
├── app/
│   ├── layout.tsx          ← Root layout: #080808 bg on <html>, metadata
│   ├── page.tsx            ← Placeholder: "ResuMax" heading on black bg
│   ├── globals.css         ← Full CSS variables + utility styles
│   ├── login/page.tsx      ← Placeholder
│   ├── register/page.tsx   ← Placeholder
│   ├── analyze/page.tsx    ← Placeholder
│   ├── dashboard/page.tsx  ← Placeholder
│   └── history/page.tsx    ← Placeholder
├── components/
│   ├── three/
│   │   └── hooks/          ← Empty, ready for Phase 3
│   ├── landing/            ← Empty, ready for Phase 5-6
│   ├── ui/                 ← Empty, ready for Phase 4
│   └── providers/          ← Empty, ready for Phase 2
├── lib/
│   └── utils.ts            ← cn() helper (clsx + tailwind-merge)
├── hooks/                  ← Empty, ready for Phase 2-3
├── styles/
│   └── three-overrides.css ← Canvas display:block, outline:none
├── public/
│   ├── fonts/              ← Empty (using Google Fonts CDN)
│   └── assets/             ← Empty
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── tsconfig.json
├── .eslintrc.json
├── .gitignore
└── package.json
```

### 6. Verification
- `npm run dev` → compiles clean, 200 OK on `http://localhost:3000`
- Background renders #080808 (confirmed via HTML source)
- "ResuMax" text renders in display-xl size
- No console errors

---

## Deviations from TECH_STACK.md

| # | Spec Says | What We Did | Why |
|---|-----------|-------------|-----|
| 1 | `@studio-freight/lenis ^1.1.14` | `lenis ^1.3.0` | Package renamed. Old scope maxes at 1.0.42. Same API, import from `'lenis'` instead of `'@studio-freight/lenis'` |
| 2 | `create-next-app@14` | Manual scaffold | Directory name has capitals, npm rejects it. Identical result. |

## Important for Future Phases

- **Lenis import:** Use `import Lenis from 'lenis'` (NOT `'@studio-freight/lenis'`)
- **GSAP plugins:** All free now. Use `CustomEase`, `TextPlugin` directly — no workaround needed.
- **`next.config.js`:** transpilePackages uses `'lenis'` not `'@studio-freight/lenis'`
- **Fonts:** Using Google Fonts CDN import in globals.css (Inter + JetBrains Mono), not self-hosted
- **`lib/utils.ts`:** `cn()` helper already available for className merging
