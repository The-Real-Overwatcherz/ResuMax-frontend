'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-config'

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Ignore on touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return

    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    // Initialize transforms properly centered
    gsap.set(outer, { xPercent: -50, yPercent: -50 })
    gsap.set(inner, { xPercent: -50, yPercent: -50 })

    // QuickTo instances for blazing fast performance
    const xToOuter = gsap.quickTo(outer, 'x', { duration: 0.15, ease: 'power3' })
    const yToOuter = gsap.quickTo(outer, 'y', { duration: 0.15, ease: 'power3' })
    
    // Inner dot has zero lag
    const xToInner = gsap.quickTo(inner, 'x', { duration: 0 })
    const yToInner = gsap.quickTo(inner, 'y', { duration: 0 })

    let isHovering = false

    const onMouseMove = (e: MouseEvent) => {
      // Small offset fixes pointer grabbing
      xToOuter(e.clientX)
      yToOuter(e.clientY)
      xToInner(e.clientX)
      yToInner(e.clientY)
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      const isPointer = 
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null

      if (isPointer && !isHovering) {
        isHovering = true
        gsap.to(outer, {
          width: 48,
          height: 48,
          borderColor: 'rgba(255,255,255,0.8)',
          backgroundColor: 'rgba(255,255,255,0.05)',
          duration: 0.2,
        })
        outer.classList.add('mix-blend-difference')
      } else if (!isPointer && isHovering) {
        isHovering = false
        gsap.to(outer, {
          width: 32,
          height: 32,
          borderColor: 'rgba(255,255,255,0.5)',
          backgroundColor: 'rgba(0,0,0,0)',
          duration: 0.2,
        })
        outer.classList.remove('mix-blend-difference')
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseover', onMouseOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
    }
  }, [])

  return (
    <>
      <div 
        ref={innerRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] bg-white rounded-full pointer-events-none z-[999999]"
      />
      <div 
        ref={outerRef}
        className="fixed top-0 left-0 w-[32px] h-[32px] border border-white/50 rounded-full pointer-events-none z-[999998]"
      />
    </>
  )
}
