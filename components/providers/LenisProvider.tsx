'use client'

import React, { createContext, useContext, useEffect, useRef } from 'react'
import type Lenis from 'lenis'
import { initLenis, destroyLenis, getLenis } from '@/lib/lenis'

// ─── Context ──────────────────────────────────────────────────────────────────

const LenisContext = createContext<Lenis | null>(null)

/**
 * useLenis — access the Lenis instance from any client component.
 *
 * Example:
 *   const lenis = useLenis()
 *   lenis?.stop()   // pause scroll during intro animation
 *   lenis?.start()  // resume after intro completes
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface LenisProviderProps {
  children: React.ReactNode
}

/**
 * LenisProvider — initializes Lenis smooth scroll once on mount.
 *
 * Place this at the root of the app (in layout.tsx) so all child components
 * can access the Lenis instance via useLenis().
 *
 * The GSAP ↔ Lenis bridge (RAF sharing) is set up inside initLenis().
 * This component only manages lifecycle (init on mount, destroy on unmount).
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis + GSAP bridge
    lenisRef.current = initLenis()

    return () => {
      // Clean up on unmount (HMR, route changes)
      destroyLenis()
      lenisRef.current = null
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}
