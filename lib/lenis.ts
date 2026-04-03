import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Import ensures GSAP plugins are registered before Lenis bridge is set up
import '@/lib/gsap-config'

let lenisInstance: Lenis | null = null

/**
 * initLenis — creates and configures the Lenis smooth scroll instance.
 *
 * Bridges Lenis → GSAP ScrollTrigger so all scroll-driven animations
 * read from the same smoothed scroll position.
 *
 * IMPORTANT: Call only once (guarded by lenisInstance check).
 * Import is 'lenis' not '@studio-freight/lenis' (renamed package).
 */
export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance

  lenisInstance = new Lenis({
    duration: 1.4,
    // Exponential easing — fast start, graceful deceleration
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 2.0,
    infinite: false,
  })

  // ─── Bridge: Lenis scroll position → GSAP ScrollTrigger ──────────────────
  // Every time Lenis ticks, update GSAP's scroll awareness
  lenisInstance.on('scroll', ScrollTrigger.update)

  // Feed Lenis into GSAP's RAF ticker so both share one clock.
  // GSAP ticker time is in seconds → Lenis RAF expects milliseconds
  gsap.ticker.add((time: number) => {
    lenisInstance!.raf(time * 1000)
  })

  // Disable GSAP lag smoothing so scroll feels immediate (Lenis handles smoothing)
  gsap.ticker.lagSmoothing(0)

  return lenisInstance
}

/**
 * getLenis — get the existing Lenis instance (after initLenis has been called).
 * Returns null if called before initialization.
 */
export function getLenis(): Lenis | null {
  return lenisInstance
}

/**
 * destroyLenis — clean up on unmount.
 */
export function destroyLenis(): void {
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
}
