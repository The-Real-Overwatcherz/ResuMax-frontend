'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-config'

const scores = [
  {
    value: 28,
    label: 'Needs Work',
    color: '#ff4444',
    bg: 'bg-[#0d0505]',
  },
  {
    value: 60,
    label: 'Getting There',
    color: '#ffaa00',
    bg: 'bg-[#0d0b05]',
  },
  {
    value: 89,
    label: 'Interview Ready',
    color: '#ffffff',
    bg: 'bg-[#111]',
    glow: true,
  },
]

function FeedbackRing({
  value,
  color,
  size = 160,
}: {
  value: number
  color: string
  size?: number
}) {
  const ringRef = useRef<SVGCircleElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)

  const radius = (size - 14) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (value / 100) * circ

  useEffect(() => {
    if (!ringRef.current || !numRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.fromTo(ringRef.current, { strokeDashoffset: circ }, {
            strokeDashoffset: offset,
            duration: 1.5,
            ease: 'power2.out',
          })
          const obj = { val: 0 }
          gsap.to(obj, {
            val: value,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
              if (numRef.current) numRef.current.textContent = Math.round(obj.val).toString()
            },
          })
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(ringRef.current)
    return () => observer.disconnect()
  }, [value, circ, offset])

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#1e1e1e" strokeWidth="7"
        />
        <circle
          ref={ringRef}
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ}
        />
      </svg>
      <span
        ref={numRef}
        className="absolute font-mono text-[48px] font-normal"
        style={{ color }}
      >
        0
      </span>
    </div>
  )
}

export function FeedbackSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-fb-heading]', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      gsap.from('[data-fb-card]', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-fb-cards]',
          start: 'top 82%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="feedback"
      className="relative py-32 md:py-40 px-6 md:px-16"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          data-fb-heading
          className="text-[42px] md:text-[56px] font-bold text-center text-white mb-20"
        >
          Visual Feedback Engine
        </h2>

        <div data-fb-cards className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {scores.map((s) => (
            <div
              key={s.value}
              data-fb-card
              className={`flex flex-col items-center gap-5 rounded-2xl ${s.bg} border border-[#1e1e1e] px-10 py-10 ${
                s.glow ? 'shadow-[0_0_40px_rgba(255,255,255,0.05)]' : ''
              }`}
            >
              <FeedbackRing value={s.value} color={s.color} />
              <span
                className="text-xs tracking-[0.15em] uppercase font-medium"
                style={{ color: s.color, opacity: s.glow ? 0.7 : 0.8 }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
