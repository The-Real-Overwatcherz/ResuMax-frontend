'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-config'

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-footer-content]', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
        },
      })
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative border-t border-[#111] py-20 px-6"
    >
      <div data-footer-content className="max-w-4xl mx-auto text-center">
        <h3 className="text-lg tracking-[0.3em] uppercase text-white font-medium">
          ResuMax
        </h3>
        <p className="mt-2 font-mono text-xs tracking-[0.15em] text-[#444]">
          Built on AI. Optimized for Humans.
        </p>

        <div className="w-full h-px bg-[#111] my-10" />

        <p className="text-[10px] text-[#333]">
          &copy; 2026 ResuMax. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
