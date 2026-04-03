"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, animate } from "motion/react"
import { gsap } from "@/lib/gsap-config"
import { FileSearch, Sparkles, Target, Zap } from "lucide-react"

// --- Monochrome ATS Score Ring Component ---
function ScoreRing({ score, size = 180 }: { score: number; size?: number }) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, score, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (val) => setDisplayScore(Math.round(val)),
      })
      return controls.stop
    }
  }, [isInView, score])

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center transform-gpu" style={{ width: size, height: size }}>
      
      {/* Crisp White Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-white/5 blur-2xl flex items-center justify-center" />

      <svg width={size} height={size} className="-rotate-90 relative z-10 overflow-visible">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
        />
        {/* Progress Fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-sans text-[48px] font-bold tracking-tighter text-white leading-none">
          {displayScore}
        </span>
        <span className="text-[10px] tracking-[0.2em] font-semibold text-[#666] uppercase mt-1">Score</span>
      </div>
    </div>
  )
}

// --- Glass Card Wrapper ---
const GlassCard = ({ children, title, desc, icon: Icon }: any) => {
  return (
    <div 
      className="w-[400px] flex-shrink-0 h-[480px] rounded-[2rem] bg-[#0a0a0a] border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)] p-8 md:p-12 relative overflow-hidden group transform-gpu"
      style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent origin-left z-10" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
            <Icon className="w-4 h-4 text-white/90" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
        </div>
        <p className="text-[#888] text-[15px] font-medium mb-10 leading-relaxed">
          {desc}
        </p>
        
        <div className="mt-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

const skills = ['React.js', 'Node.js', 'Docker', 'Python', 'LLMs', 'Kubernetes', 'GSAP', 'Next.js']

export function ComponentsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !scrollContainerRef.current) return

    const container = scrollContainerRef.current

    const ctx = gsap.context(() => {
      // Create horizontal scrub timeline identical to precision pipeline
      const maxScroll = -(container.scrollWidth - window.innerWidth + 120)
      const viewportWidth = window.innerWidth - 60
      const targetScale = viewportWidth / container.scrollWidth
      const centerOffsetX = (window.innerWidth / 2) - (container.scrollWidth / 2)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1.5,
          start: "top top",
          end: () => `+=${container.scrollWidth * 1.2}`,
        }
      })

      // Phase 1: Scroll horizontally
      tl.to(container, {
        x: maxScroll,
        ease: "none",
        duration: 8
      })

      // Phase 2: Zoom out to show all components
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
    <section id="components" ref={sectionRef} className="relative min-h-screen bg-transparent flex flex-col justify-center overflow-hidden pt-12 pb-24 z-10 w-full antialiased text-white">
      
      {/* Background noise */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none border-none"></div>

      {/* Header */}
      <div className="text-center px-6 mb-20 max-w-2xl mx-auto z-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
          <span className="text-[11px] font-semibold tracking-wider text-white uppercase">Micro-Architecture</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#777] mb-6">
          Engineered To Win.
        </h2>
        <p className="font-sans text-[#a3a3a3] text-[16px] leading-relaxed max-w-md mx-auto">
          We didn&apos;t just build a wrapper. Every micro-service is a purpose-built deterministic engine designed to crack the ATS code.
        </p>
        <div className="mt-8">
          <a href="https://watermelon.sh" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-[0.2em] bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)] hover:shadow-[0_0_25px_rgba(52,211,153,0.2)]">
            UI powered by Watermelon 🍉
          </a>
        </div>
      </div>

      {/* Horizontal Phase Scroller */}
      <div className="relative w-full z-10 mx-auto overflow-visible">
        <div ref={scrollContainerRef} className="flex items-center pl-6 md:pl-24 gap-12 pr-24 w-max">
          
          {/* Card 1: ATS Scoring */}
          <GlassCard 
            title="ATS Parser" 
            desc="Our ruthless ranking algorithm perfectly maps your document against strict JD token limits."
            icon={Target}
          >
            <div className="flex justify-center py-6 w-full -mt-4">
              <ScoreRing score={89} />
            </div>
          </GlassCard>

          {/* Card 2: STar SYNTHESIZER (Strict Monochrome) */}
          <GlassCard 
            title="S.T.A.R. Synthesizer" 
            desc="Automatically transforms passive duties into aggressive, quantified achievements."
            icon={Sparkles}
          >
            <div className="relative pl-6 border-l border-white/10 space-y-6">
              {/* Timeline dots (Monochrome Grey/White) */}
              <div className="absolute left-0 top-0 -translate-x-[50%] w-3 h-3 bg-white/5 border border-white/20 rounded-full" />
              <div className="absolute left-0 bottom-4 -translate-x-[50%] w-3 h-3 bg-white/20 border border-white/60 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
              
              <div>
                <span className="text-[10px] tracking-widest font-bold uppercase text-[#555] block mb-2">Original</span>
                <p className="text-sm text-[#444] line-through font-medium">
                  &quot;Responsible for managing the sales team and increasing revenue.&quot;
                </p>
              </div>

              <div>
                <span className="text-[10px] tracking-widest font-bold uppercase text-white block mb-2">Synthesized</span>
                <div className="bg-white/[0.03] border border-white/20 rounded-xl p-4 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] text-white">
                  <p className="text-[14px] font-medium leading-relaxed">
                    &quot;Spearheaded a 15-member regional sales division, delivering a <span className="text-white font-bold tracking-tight">42% YoY revenue growth totaling $4.2M</span>.&quot;
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Card 3: Skills Matcher */}
          <GlassCard 
            title="Semantic Skill Matching" 
            desc="Cross-references implicit resume skills with complex industry vector embeddings natively."
            icon={Zap}
          >
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] shadow-inner text-[13px] font-medium text-[#aaa]"
                >
                  {skill}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Card 4: Match Scanner */}
          <GlassCard 
            title="Density Matcher" 
            desc="Validates exact-match keyword density, typography, and mathematical whitespace balance."
            icon={FileSearch}
          >
             <div className="w-full h-32 mt-4 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] rounded-xl flex items-center justify-center border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent z-0" />
                <FileSearch className="w-12 h-12 text-white/50 relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
             </div>
          </GlassCard>

        </div>
      </div>

      {/* Scroll instruction */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-20">
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/50 to-transparent" />
        <span className="text-[10px] tracking-[0.2em] font-medium uppercase text-white/50">Scroll horizontally</span>
      </div>

    </section>
  )
}
