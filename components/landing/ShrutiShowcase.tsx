'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap-config'
import { motion, useInView, AnimatePresence } from 'motion/react'
import {
  Brain,
  MessageSquare,
  Mic,
  Sparkles,
  Users,
  Shield,
  HeartPulse,
  Gauge,
  BookOpen,
  Zap,
  ArrowRight,
} from 'lucide-react'

/* ── Behavior dimension data ── */
const BEHAVIOR_DIMENSIONS = [
  {
    icon: Gauge,
    label: 'Confidence',
    values: ['Hesitant', 'Balanced', 'Assertive'],
    active: 0,
    color: '#ef4444',
    description: 'Detects self-doubt vs conviction in your messages',
  },
  {
    icon: MessageSquare,
    label: 'Style',
    values: ['Brief', 'Conversational', 'Detailed'],
    active: 1,
    color: '#3b82f6',
    description: 'Matches your preferred message length and tone',
  },
  {
    icon: BookOpen,
    label: 'Experience',
    values: ['Beginner', 'Intermediate', 'Expert'],
    active: 2,
    color: '#a855f7',
    description: 'Adjusts technical depth and jargon level',
  },
  {
    icon: HeartPulse,
    label: 'Emotion',
    values: ['Anxious', 'Neutral', 'Excited', 'Frustrated'],
    active: 3,
    color: '#22c55e',
    description: 'Reads your emotional state and responds empathetically',
  },
  {
    icon: Zap,
    label: 'Learning',
    values: ['Examples', 'Explanations', 'Action Items'],
    active: 0,
    color: '#eab308',
    description: 'Delivers advice in your preferred learning format',
  },
]

/* ── Chat message demos ── */
const DEMO_CONVERSATIONS = [
  {
    label: 'Anxious Beginner',
    userMsg: 'hey can u help me fix my resume? idk what im doing wrong lol... applied to 50 jobs and nothing',
    shrutiMsg: "Hey, first of all — you're not doing anything wrong by asking for help. 50 applications with no response usually means your resume isn't getting past the ATS filters, not that you're unqualified. Let's start with one small win: what role are you targeting? I'll find the exact keywords you're missing.",
    profile: { confidence: 0, style: 1, experience: 0, emotion: 0, learning: 2 },
  },
  {
    label: 'Confident Expert',
    userMsg: 'I need to push my ATS score from 72 to 85+ for a Staff SRE role at Google. L5 targeting L7.',
    shrutiMsg: "At 72, your keyword density is solid but you're likely missing system design terminology Google's L7 ATS filters weight heavily. Three moves: (1) Add \"distributed systems architecture\" and \"SLO/SLI framework\" to your summary, (2) Quantify your incident response — MTTR, blast radius reduction %, (3) Replace \"managed\" with \"architected\" in your infra bullets. That should push you past 85.",
    profile: { confidence: 2, style: 2, experience: 2, emotion: 1, learning: 2 },
  },
  {
    label: 'Frustrated Job Seeker',
    userMsg: 'This is so frustrating. Every company ghosts me. My resume is fine, I just have bad luck.',
    shrutiMsg: "I hear you — the ghosting is genuinely the worst part of job searching. But here's the good news: \"bad luck\" is usually something we can fix. Let me look at your resume with fresh eyes. Often it's one thing — a missing keyword, a weak opening bullet — that makes the difference. Can you upload it? I'll find your quickest win so you can see results fast.",
    profile: { confidence: 0, style: 1, experience: 1, emotion: 3, learning: 2 },
  },
]

/* ── Animated dimension bar ── */
function DimensionBar({
  dimension,
  activeIndex,
  delay,
}: {
  dimension: typeof BEHAVIOR_DIMENSIONS[0]
  activeIndex: number
  delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const Icon = dimension.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="group"
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center border"
          style={{
            backgroundColor: `${dimension.color}10`,
            borderColor: `${dimension.color}20`,
          }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: dimension.color }} />
        </div>
        <span className="text-xs font-semibold text-white/70 tracking-wide">{dimension.label}</span>
      </div>
      <div className="flex gap-1.5 ml-10">
        {dimension.values.map((val, i) => (
          <div
            key={val}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all duration-500 ${
              i === activeIndex
                ? 'text-white border-white/20 bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.05)]'
                : 'text-white/20 border-white/5 bg-transparent'
            }`}
          >
            {val}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function ShrutiShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeDemo, setActiveDemo] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [showResponse, setShowResponse] = useState(true)

  // Cycle through demos
  const switchDemo = (index: number) => {
    if (index === activeDemo) return
    setShowResponse(false)
    setIsTyping(true)
    setActiveDemo(index)

    setTimeout(() => {
      setIsTyping(false)
      setShowResponse(true)
    }, 1200)
  }

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('[data-shruti-header]', {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const demo = DEMO_CONVERSATIONS[activeDemo]

  return (
    <section
      ref={sectionRef}
      id="shruti"
      className="relative py-32 md:py-40 px-6 md:px-16"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.015] rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div data-shruti-header className="text-center mb-16 max-w-2xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]" />
          <span className="text-[11px] font-semibold tracking-wider text-white uppercase">
            Behavioral AI
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#777] mb-6">
          Meet Shruti.
        </h2>
        <p className="font-sans text-[#a3a3a3] text-[16px] leading-relaxed max-w-lg mx-auto">
          She doesn&apos;t just answer questions — she reads <em>how</em> you communicate and adapts her personality in real-time. Every user gets a different Shruti, tuned to their exact behavioral profile.
        </p>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Left: Behavioral Profile */}
          <div className="space-y-6">
            {/* How it works */}
            <div className="rounded-[1.5rem] bg-[#0a0a0a] border border-white/[0.06] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Behavioral Profiling Engine</h3>
                  <p className="text-[11px] text-white/40">Powered by Qwen 3.5 397B on Ollama Cloud</p>
                </div>
              </div>

              {/* Architecture flow */}
              <div className="flex items-center gap-2 mb-8 px-2">
                {[
                  { label: 'Your Message', icon: MessageSquare },
                  { label: 'Qwen 3.5 Profiles', icon: Brain },
                  { label: 'Prompt Adapted', icon: Sparkles },
                  { label: 'Shruti Responds', icon: Mic },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-center gap-2 flex-1">
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <step.icon className="w-3.5 h-3.5 text-white/50" />
                      </div>
                      <span className="text-[8px] text-white/30 text-center leading-tight">{step.label}</span>
                    </div>
                    {i < 3 && <ArrowRight className="w-3 h-3 text-white/15 flex-shrink-0 mb-4" />}
                  </div>
                ))}
              </div>

              {/* Dimension bars */}
              <div className="space-y-4">
                {BEHAVIOR_DIMENSIONS.map((dim, i) => (
                  <DimensionBar
                    key={dim.label}
                    dimension={dim}
                    activeIndex={demo.profile[
                      ['confidence', 'style', 'experience', 'emotion', 'learning'][i] as keyof typeof demo.profile
                    ]}
                    delay={i * 0.08}
                  />
                ))}
              </div>
            </div>

            {/* What she does */}
            <div className="rounded-[1.5rem] bg-[#0a0a0a] border border-white/[0.06] p-6 sm:p-8">
              <h3 className="text-sm font-semibold text-white mb-4">What Shruti Does</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: MessageSquare, label: 'Voice Chat', desc: 'Talk naturally about your resume' },
                  { icon: Users, label: 'Mock Interview', desc: '10-question live simulation' },
                  { icon: Sparkles, label: 'Resume Builder', desc: 'Build from scratch via chat' },
                  { icon: Shield, label: 'Career Advisor', desc: 'Roadmaps, skills, strategy' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <item.icon className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-white/80">{item.label}</p>
                      <p className="text-[10px] text-white/30">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Chat Demo */}
          <div className="space-y-4">
            {/* Demo selector tabs */}
            <div className="flex gap-2">
              {DEMO_CONVERSATIONS.map((d, i) => (
                <button
                  key={d.label}
                  onClick={() => switchDemo(i)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-300 ${
                    i === activeDemo
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-transparent border-white/5 text-white/30 hover:text-white/50 hover:border-white/10'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Chat window */}
            <div className="rounded-[1.5rem] bg-[#0a0a0a] border border-white/[0.06] overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    <img src="/shruti.png" alt="Shruti" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a0a]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Shruti</h4>
                  <p className="text-[10px] text-emerald-400">Adapting to your style...</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10">
                  <Brain className="w-3 h-3 text-white/40" />
                  <span className="text-[9px] text-white/40 font-mono">Behavioral AI</span>
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-4 min-h-[380px]">
                {/* User message */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`user-${activeDemo}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] bg-white/10 border border-white/10 rounded-2xl rounded-tr-sm px-4 py-3">
                      <p className="text-sm text-white/90 leading-relaxed">{demo.userMsg}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20 flex-shrink-0">
                      <img src="/shruti.png" alt="Shruti" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Shruti response */}
                <AnimatePresence mode="wait">
                  {showResponse && !isTyping && (
                    <motion.div
                      key={`shruti-${activeDemo}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="flex items-start gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20 flex-shrink-0">
                        <img src="/shruti.png" alt="Shruti" className="w-full h-full object-cover" />
                      </div>
                      <div className="max-w-[85%] bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3">
                        <p className="text-sm text-white/80 leading-relaxed">{demo.shrutiMsg}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input bar (decorative) */}
              <div className="px-5 py-3 border-t border-white/5">
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5">
                  <span className="text-sm text-white/20 flex-1">Ask Shruti anything...</span>
                  <Mic className="w-4 h-4 text-white/20" />
                </div>
              </div>
            </div>

            {/* Bottom note */}
            <p className="text-center text-[11px] text-white/25 font-mono">
              Same AI. Different personality for every user. Zero prompt engineering needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
