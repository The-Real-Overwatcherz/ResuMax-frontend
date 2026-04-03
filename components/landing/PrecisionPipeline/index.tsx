"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "@/lib/gsap-config"
import { PipelineNode } from "./PipelineNode"
import { PipelineCard, Step } from "./PipelineCard"
import { Connector } from "./Connector"

const steps: Step[] = [
  {
    num: "01",
    title: "Upload resume",
    desc: "Drop PDF or paste text. Parsing engine extracts role, tenure, impact metrics, and every keyword signal.",
    tag: "PDF · DOCX · TXT",
    type: "normal",
  },
  {
    num: "02",
    title: "ATS score",
    desc: "Real-time 0–100 score matched against your job description. Missing keywords ranked by recruiter weight.",
    tag: "Groq handles speed",
    type: "normal",
  },
  {
    num: "03",
    title: "Deep analysis",
    desc: "Claude via Bedrock maps your experience against the role's hidden competency model. Gaps surfaced.",
    tag: "Bedrock handles depth",
    type: "normal",
  },
  {
    num: "AI",
    title: "AI asks you questions",
    desc: "Before rewriting, AI interviews you — uncovers achievements, quantifies vague bullets, learns your voice.",
    tag: "LangChain orchestrates",
    type: "ai",
  },
  {
    num: "05",
    title: "Bullet rewriter",
    desc: "Every weak bullet rewritten with your real context — quantified, action-verb led, calibrated to the role.",
    tag: "STAR format",
    type: "normal",
  },
  {
    num: "06",
    title: "Export & apply",
    desc: "Download as PDF or DOCX. One-click apply tracking syncs with your full job board pipeline.",
    tag: "Ready to send",
    type: "normal",
  },
]

export function PrecisionPipeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackWrapperRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const [activeRevealed, setActiveRevealed] = useState(0)
  
  useEffect(() => {
    if (!sectionRef.current || !scrollContainerRef.current || !trackWrapperRef.current) return
    
    const container = scrollContainerRef.current
    const wrapper = trackWrapperRef.current
    
    const ctx = gsap.context(() => {
      // Create a timeline hooked to the scroll position
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1.5, // Smooth, fluid scrub without rigid snapping
          start: "top top",
          end: () => `+=${container.scrollWidth * 1.5}`,
          onUpdate: (self) => {
            // Track horizontal scrolling progress (0 to 1) before the scale down starts
            // Let's assume the horizontal drag takes 80% of the timeline, 
            // and the zoom out takes the last 20%.
            let progress = self.progress / 0.8
            if (progress > 1) progress = 1
            
            const activePhase = Math.round(progress * (steps.length - 1))
            setActiveRevealed(activePhase)
          }
        }
      })

      // The total distance we need to drag the container left
      // We leave a 120px padding on the right edge
      const maxScroll = -(container.scrollWidth - window.innerWidth + 120)

      // Phase 1: Horizontal Scroll (Takes 80% of scrub duration)
      tl.to(container, {
        x: maxScroll,
        ease: "none",
        duration: 8
      })

      // Calculate target scale to fit the entire container inside the screen wrapper
      // We want some horizontal padding when zoomed out
      const viewportWidth = window.innerWidth - 60
      const targetScale = viewportWidth / container.scrollWidth
      
      // Calculate how much we need to shift X so it centers after scaling
      const centerOffsetX = (window.innerWidth / 2) - (container.scrollWidth / 2)

      // Phase 2: Zoom Out (Takes last 20% of scrub duration)
      // We animate the same container so the X position smoothly interpolates from maxScroll to centerOffsetX.
      tl.to(container, {
        scale: targetScale,
        x: centerOffsetX,
        transformOrigin: "center center",
        ease: "power2.inOut",
        duration: 2,
        force3D: true
      })

    }, sectionRef)
    
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="pipeline" className="relative min-h-screen bg-transparent flex flex-col justify-center overflow-hidden pt-12 pb-24 z-10 w-full antialiased">
      
      {/* Background noise without mix-blend-overlay which corrupts backdrop-blur during scale */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none"></div>

      {/* Header */}
      <div className="text-center px-6 mb-16 max-w-2xl mx-auto z-10 relative">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#777] mb-6">
          The Precision Pipeline
        </h2>
        <p className="font-sans text-[#a3a3a3] text-[16px] leading-relaxed max-w-md mx-auto">
          Our proprietary parsing engine dissects your history to identify exactly what top-tier recruiters are looking for.
        </p>
      </div>

      {/* Track Wrapper - This element handles the final zoom-out scale */}
      <div ref={trackWrapperRef} className="relative w-full z-10 mx-auto" style={{ width: 'fit-content' }}>
        
        {/* Horizontal Scroll Area - GSAP natively hardware-accelerates on animate */}
        <div ref={scrollContainerRef} className="flex items-start pl-6 md:pl-24 pt-4 pb-12 pr-24">
          
          <div className="flex items-start">
            {steps.map((step, i) => (
              <div key={`step-${i}`} className="flex items-start">
                
                {/* Node & Card Column */}
                <div className="flex flex-col items-center">
                  <PipelineNode 
                    label={step.num} 
                    active={i <= activeRevealed} 
                    isAI={step.type === "ai"} 
                  />
                  <div className="mt-8">
                    <PipelineCard 
                      step={step} 
                      active={i <= activeRevealed} 
                    />
                  </div>
                </div>

                {/* Connector */}
                {i !== steps.length - 1 && (
                  <div className="flex items-center h-[56px] w-[140px] px-2 flex-shrink-0">
                    <Connector filled={i < activeRevealed} />
                  </div>
                )}
                
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll instruction marker */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-20">
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/50 to-transparent"></div>
        <span className="text-[10px] tracking-[0.2em] font-medium uppercase text-white/50">Scroll to Progress</span>
      </div>

    </section>
  )
}
