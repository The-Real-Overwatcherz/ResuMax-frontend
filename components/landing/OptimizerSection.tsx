'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-config'

const optimizedBullets = [
  'Resolved 45+ critical technical queries daily, maintaining 99% CSAT score.',
  'Orchestrated high-value lead acquisition strategies, increasing pipeline by 30%.',
  'Engineered automated reporting dashboards using advanced analytics.',
]

export function OptimizerSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-opt-label]', {
        y: 15,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      gsap.from('[data-opt-panel]', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })

      // Header bars width animation
      gsap.from('[data-opt-bar]', {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '[data-opt-panel]',
          start: 'top 80%',
        },
      })

      // Bullets stagger
      gsap.from('[data-opt-bullet]', {
        x: -10,
        opacity: 0,
        duration: 0.5,
        stagger: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-opt-bullets]',
          start: 'top 82%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="optimizer"
      className="relative py-32 md:py-40 px-6 md:px-16"
    >
      <div className="max-w-2xl mx-auto">
        <p
          data-opt-label
          className="font-mono text-xs tracking-[0.2em] uppercase text-[#666] text-center mb-8"
        >
          Resume Optimized
        </p>

        {/* Resume panel */}
        <div
          data-opt-panel
          className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-6 md:p-8"
        >
          {/* Skeleton header bars */}
          <div className="flex gap-3 mb-8">
            <div data-opt-bar className="h-2 w-40 bg-[#222] rounded-full" />
            <div data-opt-bar className="h-1.5 w-56 bg-[#1a1a1a] rounded-full mt-0.5" />
          </div>

          {/* Bullets */}
          <div data-opt-bullets className="space-y-5">
            {optimizedBullets.map((bullet, i) => (
              <div key={i} data-opt-bullet className="flex items-start gap-3">
                <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/50" />
                <p className="text-sm text-[#aaa] leading-relaxed">
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
