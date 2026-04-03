'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from '@/lib/gsap-config'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  Linkedin,
  Loader2,
  Copy,
  Check,
  Clock,
  Lightbulb,
  Hash,
  TrendingUp,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const INPUT_CLASS =
  'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#0A66C2]/50 focus:ring-1 focus:ring-[#0A66C2]/50 transition-all font-mono'
const LABEL_CLASS = 'text-xs font-mono text-[#888] tracking-widest uppercase ml-1'

interface OptimizationResult {
  profile_optimization: {
    headline_options: string[]
    about_section: string
    experience_tips: string[]
    profile_keywords: string[]
  }
  content_calendar: {
    best_posting_times: { day: string; time: string; reason: string }[]
    posting_frequency: string
    content_mix: { type: string; percentage: number; description: string }[]
  }
  post_ideas: {
    title: string
    hook: string
    outline: string
    format: string
    best_day: string
  }[]
  post_templates: {
    name: string
    template: string
    when_to_use: string
  }[]
  hashtag_strategy: {
    primary_hashtags: string[]
    niche_hashtags: string[]
    branded_hashtags: string[]
    usage_tips: string
  }
  engagement_tips: {
    tip: string
    why: string
    action: string
  }[]
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/30 hover:text-white"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  color = '#0A66C2',
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
  color?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-white/40" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/40" />
        )}
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  )
}

export default function LinkedInOptimizerPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<OptimizationResult | null>(null)

  // Form state
  const [fullName, setFullName] = useState('')
  const [currentRole, setCurrentRole] = useState('')
  const [industry, setIndustry] = useState('')
  const [experienceSummary, setExperienceSummary] = useState('')
  const [skills, setSkills] = useState('')
  const [currentHeadline, setCurrentHeadline] = useState('')
  const [currentAbout, setCurrentAbout] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [goals, setGoals] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setAuthChecked(true)
        const name = session.user.user_metadata?.full_name || ''
        if (name) setFullName(name)
      }
    })
  }, [router])

  useEffect(() => {
    if (!authChecked || !containerRef.current) return
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
    )
  }, [authChecked])

  const handleOptimize = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/linkedin-optimizer/optimize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          current_role: currentRole,
          industry,
          experience_summary: experienceSummary,
          skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
          current_headline: currentHeadline,
          current_about: currentAbout,
          target_audience: targetAudience,
          goals,
        }),
      })

      if (!res.ok) throw new Error('Failed to optimize')
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error('LinkedIn optimization failed:', err)
      alert('Optimization failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0A66C2] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <div ref={containerRef} className="max-w-4xl mx-auto px-4 sm:px-6 py-8 opacity-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-white/40 hover:text-white text-sm font-mono transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-white/20">/</span>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#0A66C2]/10">
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
              </div>
              <h1 className="text-lg font-semibold text-white tracking-tight">
                LinkedIn Optimizer
              </h1>
            </div>
          </div>
        </div>

        {/* Input Form — shown when no result yet */}
        {!result && (
          <div className="rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06] p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                Tell us about yourself
              </h2>
              <p className="text-sm text-white/40">
                The more details you provide, the better the optimization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={LABEL_CLASS}>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="Shrujal Ganatra"
                />
              </div>
              <div className="space-y-2">
                <label className={LABEL_CLASS}>Current Role</label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="Full Stack Developer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={LABEL_CLASS}>Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="Software / AI / Finance..."
                />
              </div>
              <div className="space-y-2">
                <label className={LABEL_CLASS}>Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="Recruiters, CTOs, Developers..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={LABEL_CLASS}>Skills (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className={INPUT_CLASS}
                placeholder="React, Python, AI/ML, Leadership..."
              />
            </div>

            <div className="space-y-2">
              <label className={LABEL_CLASS}>Experience Summary</label>
              <textarea
                value={experienceSummary}
                onChange={(e) => setExperienceSummary(e.target.value)}
                rows={3}
                className={`${INPUT_CLASS} resize-none`}
                placeholder="Brief summary of your career journey and key achievements..."
              />
            </div>

            <div className="space-y-2">
              <label className={LABEL_CLASS}>Current LinkedIn Headline (optional)</label>
              <input
                type="text"
                value={currentHeadline}
                onChange={(e) => setCurrentHeadline(e.target.value)}
                className={INPUT_CLASS}
                placeholder="Your current headline to improve..."
              />
            </div>

            <div className="space-y-2">
              <label className={LABEL_CLASS}>Current LinkedIn About (optional)</label>
              <textarea
                value={currentAbout}
                onChange={(e) => setCurrentAbout(e.target.value)}
                rows={3}
                className={`${INPUT_CLASS} resize-none`}
                placeholder="Paste your current About section to get it rewritten..."
              />
            </div>

            <div className="space-y-2">
              <label className={LABEL_CLASS}>Goals</label>
              <input
                type="text"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                className={INPUT_CLASS}
                placeholder="Get hired, build personal brand, grow network..."
              />
            </div>

            <Button
              onClick={handleOptimize}
              disabled={loading || !fullName.trim() || !currentRole.trim()}
              className="w-full h-12 rounded-xl bg-[#0A66C2] hover:bg-[#0A66C2]/80 text-white font-semibold shadow-[0_0_20px_rgba(10,102,194,0.2)] hover:shadow-[0_0_30px_rgba(10,102,194,0.4)] text-[15px] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Analyzing & Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Optimize My LinkedIn
                </>
              )}
            </Button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-white">Your LinkedIn Strategy</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResult(null)}
                className="border-white/10 text-white/60 bg-transparent hover:text-white"
              >
                Start Over
              </Button>
            </div>

            {/* Profile Optimization */}
            <CollapsibleSection title="Profile Optimization" icon={Linkedin} defaultOpen color="#0A66C2">
              {/* Headlines */}
              <div>
                <p className="text-xs font-mono text-[#0A66C2] tracking-wider uppercase mb-3">
                  Headline Options
                </p>
                <div className="space-y-2">
                  {result.profile_optimization.headline_options.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-black/30 border border-white/5"
                    >
                      <p className="text-sm text-white/90 flex-1">{h}</p>
                      <CopyButton text={h} />
                    </div>
                  ))}
                </div>
              </div>

              {/* About */}
              <div>
                <p className="text-xs font-mono text-[#0A66C2] tracking-wider uppercase mb-3">
                  Optimized About Section
                </p>
                <div className="relative p-4 rounded-xl bg-black/30 border border-white/5">
                  <p className="text-sm text-white/80 whitespace-pre-line leading-relaxed">
                    {result.profile_optimization.about_section}
                  </p>
                  <div className="absolute top-3 right-3">
                    <CopyButton text={result.profile_optimization.about_section} />
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <p className="text-xs font-mono text-[#0A66C2] tracking-wider uppercase mb-3">
                  Profile Keywords
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.profile_optimization.profile_keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] text-xs rounded-lg font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience Tips */}
              <div>
                <p className="text-xs font-mono text-[#0A66C2] tracking-wider uppercase mb-3">
                  Experience Section Tips
                </p>
                <div className="space-y-2">
                  {result.profile_optimization.experience_tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="text-[#0A66C2] mt-0.5 font-bold">{i + 1}.</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleSection>

            {/* Content Calendar */}
            <CollapsibleSection title="Content Calendar" icon={Calendar} color="#22c55e">
              <div>
                <p className="text-xs font-mono text-green-400 tracking-wider uppercase mb-3">
                  Best Posting Times
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {result.content_calendar.best_posting_times.map((slot, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-black/30 border border-white/5 text-center"
                    >
                      <p className="text-lg font-semibold text-white">{slot.day}</p>
                      <p className="text-sm text-green-400 font-mono">{slot.time}</p>
                      <p className="text-xs text-white/40 mt-2">{slot.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-mono text-green-400 tracking-wider uppercase mb-2">
                  Posting Frequency
                </p>
                <p className="text-sm text-white/70">{result.content_calendar.posting_frequency}</p>
              </div>

              <div>
                <p className="text-xs font-mono text-green-400 tracking-wider uppercase mb-3">
                  Content Mix
                </p>
                <div className="space-y-2">
                  {result.content_calendar.content_mix.map((mix, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-16 text-right">
                        <span className="text-sm font-bold text-green-400">{mix.percentage}%</span>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-green-400/60 rounded-full"
                          style={{ width: `${mix.percentage}%` }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-white/80 font-medium">{mix.type}</p>
                        <p className="text-[10px] text-white/40">{mix.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleSection>

            {/* Post Ideas */}
            <CollapsibleSection title="Post Ideas" icon={Lightbulb} color="#eab308">
              <div className="space-y-3">
                {result.post_ideas.map((idea, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{idea.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-mono">
                          {idea.format}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 font-mono">
                          {idea.best_day}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.03] border-l-2 border-yellow-400/50">
                      <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Hook</p>
                      <p className="text-sm text-white/80 italic">{idea.hook}</p>
                    </div>
                    <p className="text-xs text-white/50">{idea.outline}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Post Templates */}
            <CollapsibleSection title="Post Templates" icon={FileText} color="#a855f7">
              <div className="space-y-3">
                {result.post_templates.map((tmpl, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-purple-300">{tmpl.name}</p>
                      <CopyButton text={tmpl.template} />
                    </div>
                    <p className="text-xs text-white/40">{tmpl.when_to_use}</p>
                    <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono leading-relaxed p-3 rounded-lg bg-white/[0.03]">
                      {tmpl.template}
                    </pre>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Hashtag Strategy */}
            <CollapsibleSection title="Hashtag Strategy" icon={Hash} color="#06b6d4">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-2">
                    Primary (High Volume)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.hashtag_strategy.primary_hashtags.map((h, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs rounded-lg font-mono cursor-pointer hover:bg-cyan-500/20 transition-colors"
                        onClick={() => navigator.clipboard.writeText(`#${h}`)}
                      >
                        #{h}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-2">
                    Niche (Low Competition)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.hashtag_strategy.niche_hashtags.map((h, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-cyan-500/5 border border-cyan-500/10 text-cyan-400/70 text-xs rounded-lg font-mono cursor-pointer hover:bg-cyan-500/15 transition-colors"
                        onClick={() => navigator.clipboard.writeText(`#${h}`)}
                      >
                        #{h}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-2">
                    Personal Brand
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.hashtag_strategy.branded_hashtags.map((h, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs rounded-lg font-mono cursor-pointer hover:bg-purple-500/20 transition-colors"
                        onClick={() => navigator.clipboard.writeText(`#${h}`)}
                      >
                        #{h}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-white/50 p-3 rounded-lg bg-white/[0.02]">
                  {result.hashtag_strategy.usage_tips}
                </p>
              </div>
            </CollapsibleSection>

            {/* Engagement Tips */}
            <CollapsibleSection title="Engagement Tips" icon={TrendingUp} color="#ef4444">
              <div className="space-y-3">
                {result.engagement_tips.map((tip, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2"
                  >
                    <p className="text-sm font-semibold text-white">{tip.tip}</p>
                    <p className="text-xs text-white/50">{tip.why}</p>
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                      <span className="text-red-400 text-xs mt-0.5">→</span>
                      <p className="text-xs text-red-300">{tip.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </div>
        )}
      </div>
    </div>
  )
}
