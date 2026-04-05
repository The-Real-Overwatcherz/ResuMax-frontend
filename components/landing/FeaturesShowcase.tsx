'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap-config'
import { motion, useInView } from 'motion/react'
import Link from 'next/link'
import {
  Github,
  Linkedin,
  Chrome,
  Download,
  ArrowUpRight,
  Star,
  GitFork,
  TrendingUp,
  Hash,
  Sparkles,
  Send,
  Eye,
  Zap,
  Target,
  MessageSquare,
  ExternalLink,
  History,
  Grid,
} from 'lucide-react'

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

/* ── Mini Score Ring ── */
function MiniScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = (size - 8) / 2
  const circumference = 2 * Math.PI * r
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="white" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: circumference * (1 - score / 100) } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
        />
      </svg>
      <span className="absolute text-sm font-bold font-mono text-white">{score}</span>
    </div>
  )
}

/* ── Feature Card ── */
function FeatureCard({
  icon: Icon,
  iconColor,
  title,
  description,
  href,
  children,
  badge,
  delay = 0,
}: {
  icon: React.ElementType
  iconColor: string
  title: string
  description: string
  href: string
  children: React.ReactNode
  badge?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      <Link href={href} className="group block h-full">
        <div className="relative h-full rounded-[1.5rem] bg-[#0a0a0a] border border-white/[0.06] p-6 sm:p-8 overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:shadow-[0_0_60px_rgba(255,255,255,0.03)] flex flex-col">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border"
                style={{
                  backgroundColor: `${iconColor}10`,
                  borderColor: `${iconColor}25`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
                {badge && (
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border mt-1 inline-block"
                    style={{
                      color: iconColor,
                      backgroundColor: `${iconColor}10`,
                      borderColor: `${iconColor}20`,
                    }}
                  >
                    {badge}
                  </span>
                )}
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transform" />
          </div>

          <p className="text-sm text-[#777] leading-relaxed mb-6 flex-grow">{description}</p>

          {/* Preview content */}
          <div className="relative mt-auto">{children}</div>
        </div>
      </Link>
    </motion.div>
  )
}

export function FeaturesShowcase() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('[data-feat-header]', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-32 md:py-40 px-6 md:px-16 overflow-hidden"
    >
      {/* Header */}
      <div data-feat-header className="text-center mb-20 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
          <span className="text-[11px] font-semibold tracking-wider text-white uppercase">
            Platform Suite
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#777] mb-6">
          Beyond The Resume.
        </h2>
        <p className="font-sans text-[#a3a3a3] text-[16px] leading-relaxed max-w-lg mx-auto">
          A complete career optimization platform. Analyze profiles, generate content, and dominate every hiring channel — all powered by Shruti.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 1. LinkedIn Extension */}
        <FeatureCard
          icon={Chrome}
          iconColor="#4285F4"
          title="LinkedIn Extension"
          description="Install our Chrome extension to analyze any LinkedIn profile directly from linkedin.com. Get instant AI-powered optimization suggestions."
          href="/ResuMaxExtension.zip"
          badge="Chrome Extension"
          delay={0}
        >
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-[10px] text-white/30 font-mono italic">
                linkedin.com/in/...
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2 w-24 bg-white/10 rounded-full" />
                <div className="h-1.5 w-32 bg-white/5 rounded-full" />
              </div>
              <MiniScoreRing score={82} size={40} />
            </div>
          </div>
        </FeatureCard>

        {/* 2. GitHub Profile Analyzer */}
        <FeatureCard
          icon={Github}
          iconColor="#ffffff"
          title="GitHub Enhancer"
          description="Enter any GitHub username and get an AI-powered analysis of their profile, repos, and contribution patterns."
          href="/github-enhancer"
          delay={0.1}
        >
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                <Github className="w-5 h-5 text-white/50" />
              </div>
              <div className="flex-1">
                <div className="h-2.5 w-20 bg-white/15 rounded-full" />
                <div className="h-1.5 w-28 bg-white/5 rounded-full mt-1.5" />
              </div>
              <MiniScoreRing score={76} size={40} />
            </div>
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5">
               <div className="text-center"><div className="text-xs font-bold text-white/80">47</div><div className="text-[8px] text-white/30">Repos</div></div>
               <div className="text-center"><div className="text-xs font-bold text-white/80">1.2k</div><div className="text-[8px] text-white/30">Stars</div></div>
               <div className="text-center"><div className="text-xs font-bold text-white/80">340</div><div className="text-[8px] text-white/30">Forks</div></div>
               <div className="text-center"><div className="text-xs font-bold text-white/80">892</div><div className="text-[8px] text-white/30">Fans</div></div>
            </div>
          </div>
        </FeatureCard>

        {/* 3. X Profile Analyzer */}
        <FeatureCard
          icon={XLogo}
          iconColor="#ffffff"
          title="X Profile Analyzer"
          description="Upload a screenshot of any X/Twitter profile. Shruti analyzes your bio, pinned tweet, and engagement patterns."
          href="/x-analyzer"
          delay={0.2}
        >
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3">
            <div className="h-14 rounded-lg bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-dashed border-white/10 flex items-center justify-center gap-2">
              <Eye className="w-4 h-4 text-white/20" />
              <span className="text-[10px] text-white/30">Screenshot dropzone</span>
            </div>
            <div className="space-y-1.5">
              {[
                { name: 'Bio & Headline', score: 85, color: '#22c55e' },
                { name: 'Engagement', score: 48, color: '#ef4444' },
              ].map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="text-[9px] text-white/40 w-20 truncate">{s.name}</span>
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.score}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FeatureCard>

        {/* 4. Social Post Maker */}
        <FeatureCard
          icon={MessageSquare}
          iconColor="#0A66C2"
          title="Social Post Maker"
          description="Generate platform-optimized posts for LinkedIn and X tailored with hashtags and engagement hooks."
          href="/social-post"
          delay={0.3}
        >
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg border border-[#0A66C2]/15 bg-[#0A66C2]/5">
                <Linkedin className="w-3 h-3 text-[#0A66C2] mb-1" />
                <div className="space-y-1"><div className="h-1 w-full bg-white/10 rounded-full" /><div className="h-1 w-2/3 bg-white/5 rounded-full" /></div>
              </div>
              <div className="p-2 rounded-lg border border-white/10 bg-white/[0.02]">
                <XLogo className="w-3 h-3 text-white/70 mb-1" />
                <div className="space-y-1"><div className="h-1 w-full bg-white/10 rounded-full" /><div className="h-1 w-3/4 bg-white/5 rounded-full" /></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[9px] text-green-400/60 font-mono">
              <TrendingUp className="w-3 h-3" /> Virality: 8/10
            </div>
          </div>
        </FeatureCard>

        {/* 5. Cold Outreach AI */}
        <FeatureCard
          icon={Send}
          iconColor="#22c55e"
          title="Cold Outreach AI"
          description="Craft high-converting LinkedIn requests and cold emails personalized using your resume."
          href="/cold-outreach"
          badge="Outreach Pro"
          delay={0.4}
        >
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-[#22c55e]/20 flex items-center justify-center"><Linkedin className="w-3 h-3 text-[#22c55e]" /></div>
              <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest">LinkedIn Draft</span>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
              <div className="h-1.5 w-full bg-white/10 rounded-full" />
              <div className="h-1.5 w-[90%] bg-white/10 rounded-full" />
              <div className="h-2 w-2/3 bg-[#22c55e]/20 rounded-full mt-2" />
            </div>
          </div>
        </FeatureCard>

        {/* 6. Career Timeline Visualizer */}
        <FeatureCard
          icon={History}
          iconColor="#3b82f6"
          title="Career Timeline"
          description="Visualize your professional growth, detect pivots, and resolve resume gaps automatically."
          href="/career-timeline"
          badge="Visualizer"
          delay={0.5}
        >
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3 h-[110px]">
             <div className="relative h-full flex items-end justify-around gap-2 px-1">
                {[40, 65, 55, 85, 70, 95].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md bg-blue-500/20 border-t border-x border-blue-500/30 relative">
                     <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: 0.5 + i * 0.1 }} className="w-full bg-blue-500/40 rounded-t-sm" />
                     {i === 5 && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />}
                  </div>
                ))}
             </div>
          </div>
        </FeatureCard>

        {/* 7. Skill Gap Heatmap */}
        <FeatureCard
          icon={Grid}
          iconColor="#a855f7"
          title="Skill Gap Heatmap"
          description="Compare your resume against 5 JDs simultaneously to see exactly which skills you're missing."
          href="/skill-gap"
          badge="Gap Analysis"
          delay={0.6}
        >
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
             <div className="grid grid-cols-4 gap-1.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={`h-4 rounded-md ${i % 3 === 0 ? 'bg-green-500/40' : i % 4 === 0 ? 'bg-red-500/40' : 'bg-amber-500/30'}`} />
                ))}
             </div>
             <div className="flex justify-between items-center pt-2">
                <span className="text-[9px] text-white/30 font-mono">24 skills analyzed</span>
                <span className="text-[10px] text-purple-400 font-bold">82% Match</span>
             </div>
          </div>
        </FeatureCard>
      </div>
    </section>
  )
}
