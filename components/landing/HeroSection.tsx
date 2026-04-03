'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-config'
import { useLenis } from '@/components/providers/LenisProvider'
import { Button } from '@/components/ui/button'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { ArrowRight } from 'lucide-react'

import { ResumePanel } from './ResumePanel'



export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const wireframeRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    if (!titleRef.current) return

    // Block scroll during intro
    lenis?.stop()

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => lenis?.start(),
      })

    // Character scramble effect for title
    const titleEl = titleRef.current!
    const finalText = 'ResuMax'
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    titleEl.textContent = finalText.replace(/./g, () => chars[Math.floor(Math.random() * chars.length)])
    titleEl.style.opacity = '1'

    // Scramble resolve
    finalText.split('').forEach((char, i) => {
      tl.to({}, {
        duration: 0.06,
        onStart: () => {
          const current = titleEl.textContent!.split('')
          current[i] = char
          titleEl.textContent = current.join('')
        },
      }, 0.8 + i * 0.05)
    })

    // Subtitle fade up
    tl.from(subtitleRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, 1.3)

    // CTA slide up
    tl.from(ctaRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, 1.6)

    // Panel container reveal
    tl.from(wireframeRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 20,
      duration: 1.0,
      ease: 'power3.out',
    }, 1.2)

    // Scroll indicator
    tl.from(scrollIndicatorRef.current, {
      opacity: 0,
      duration: 0.5,
    }, 2.0)

    })
    
    return () => { ctx.revert() }
  }, [lenis])

  // Fade out scroll indicator on scroll
  useEffect(() => {
    if (!scrollIndicatorRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200',
          scrub: true,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-6 md:px-16"
    >
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left — text content */}
        <div className="flex-1 max-w-xl">
          <h1
            ref={titleRef}
            className="text-[72px] md:text-[96px] font-bold leading-[0.95] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#777] opacity-0"
          >
            ResuMax
          </h1>
          <p
            ref={subtitleRef}
            className="mt-4 text-lg md:text-xl text-[#aaa] font-normal leading-relaxed"
          >
            Your resume, engineered for impact.
          </p>
          <div ref={ctaRef} className="mt-8 relative z-50">
            <ShimmerButton
              className="h-13 px-8 text-sm tracking-[0.12em] uppercase font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500"
            >
              Start Analyzing
              <ArrowRight className="size-4" />
            </ShimmerButton>
          </div>
        </div>

        {/* Right — animated resume panel */}
        <div ref={wireframeRef} className="flex-shrink-0 flex items-center justify-end md:justify-center md:w-[480px]">
          <ResumePanel />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#666]">
          Scroll to Discover
        </span>
        <div className="w-1 h-1 rounded-full bg-white/50 animate-scroll-bounce" />
      </div>
    </section>
  )
}
