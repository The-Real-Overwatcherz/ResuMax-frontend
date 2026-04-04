'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from '@/lib/gsap-config'
import { getSupabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  Loader2,
  Copy,
  Check,
  Upload,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Target,
  Hash,
  TrendingUp,
  X,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MinusCircle,
  ArrowLeft,
  MessageSquare,
  Lightbulb,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ── X icon (custom) ── */
const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

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
  color = '#fff',
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

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'excellent':
      return <CheckCircle2 className="w-4 h-4 text-green-400" />
    case 'good':
      return <CheckCircle2 className="w-4 h-4 text-blue-400" />
    case 'needs_work':
      return <AlertCircle className="w-4 h-4 text-yellow-400" />
    case 'missing':
      return <XCircle className="w-4 h-4 text-red-400" />
    default:
      return <MinusCircle className="w-4 h-4 text-white/30" />
  }
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = size * 0.425
  const circumference = 2 * Math.PI * r
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444'

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 w-full h-full -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color}
          strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${circumference * (1 - score / 100)}`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="text-2xl font-bold font-mono relative z-10" style={{ color }}>{score}</span>
      <span className="text-[8px] text-white/40 font-bold uppercase tracking-wider relative z-10">Score</span>
    </div>
  )
}

interface AnalysisResult {
  profile_name: string
  handle: string
  overall_score: number
  overall_summary: string
  sections: {
    name: string
    score: number
    status: string
    current: string
    suggestions: string[]
  }[]
  quick_wins: string[]
  bio_suggestions: string[]
  content_strategy_tips: {
    tip: string
    why: string
    how: string
  }[]
  hashtag_recommendations: string[]
  growth_tactics: string[]
}

export default function XAnalyzerPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  // Upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [additionalContext, setAdditionalContext] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setAuthChecked(true)
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith('image/')) return
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return
    setLoading(true)
    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return

      const formData = new FormData()
      formData.append('screenshot', selectedImage)
      if (additionalContext.trim()) {
        formData.append('context', additionalContext.trim())
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/x-analyzer/analyze`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error('X analysis failed:', err)
      alert('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <div ref={containerRef} className="max-w-4xl mx-auto px-4 sm:px-6 py-8 opacity-0">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/10">
                <XLogo className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-white tracking-tight">
                X Profile Analyzer
              </h1>
            </div>
          </div>
          {result && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setResult(null)
                setSelectedImage(null)
                setImagePreview(null)
                setAdditionalContext('')
              }}
              className="border-white/10 text-white/60 bg-transparent hover:text-white"
            >
              Analyze Another
            </Button>
          )}
        </div>

        {/* Upload Area */}
        {!result && (
          <div className="space-y-6">
            <div className="rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06] p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  Upload your X Profile Screenshot
                </h2>
                <p className="text-sm text-white/40">
                  Take a screenshot of your X/Twitter profile and drop it here. Shruti will analyze every element and give you specific suggestions to grow your presence.
                </p>
              </div>

              {/* Drop Zone */}
              {!imagePreview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-white/30 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:bg-white/[0.01] group"
                >
                  <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                    <ImageIcon className="w-10 h-10 text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white/70 font-medium">
                      Drop your screenshot here or click to browse
                    </p>
                    <p className="text-xs text-white/30 mt-1">
                      PNG, JPG, or WebP — max 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src={imagePreview}
                    alt="X profile screenshot"
                    className="w-full max-h-[500px] object-contain bg-black/50"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null)
                      setImagePreview(null)
                    }}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white/70 hover:text-white transition-colors backdrop-blur-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageSelect}
              />

              {/* Optional context */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">
                  Additional Context (optional)
                </label>
                <input
                  type="text"
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="e.g., I'm building a developer audience and want to grow to 10K followers..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all font-mono"
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={loading || !selectedImage}
                className="w-full h-12 rounded-xl bg-white hover:bg-gray-200 text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] text-[15px] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Analyzing your profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze My X Profile
                  </>
                )}
              </Button>
            </div>

            {/* Tips */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
              <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-3">How to get the best analysis</p>
              <div className="space-y-2 text-xs text-white/50">
                <p>1. Go to your X/Twitter profile page</p>
                <p>2. Take a full-page screenshot including your bio, banner, and a few tweets</p>
                <p>3. Make sure your profile stats (followers, following) are visible</p>
                <p>4. Upload and let Shruti analyze it</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Overall Score Card */}
            <div className="rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06] p-6 sm:p-8">
              <div className="flex items-center gap-6">
                <ScoreRing score={result.overall_score} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{result.profile_name}</h3>
                    {result.handle && (
                      <span className="text-sm text-white/40 font-mono">{result.handle}</span>
                    )}
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{result.overall_summary}</p>
                </div>
              </div>
            </div>

            {/* Section Breakdown */}
            <CollapsibleSection title="Section-by-Section Breakdown" icon={Target} defaultOpen color="#fff">
              <div className="space-y-3">
                {result.sections.map((section, i) => (
                  <div key={i} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={section.status} />
                        <span className="text-sm font-semibold text-white">{section.name}</span>
                      </div>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                        section.score >= 80 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        section.score >= 60 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {section.score}/100
                      </span>
                    </div>
                    <p className="text-xs text-white/40">{section.current}</p>
                    <div className="space-y-1.5">
                      {section.suggestions.map((s, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs text-white/70">
                          <span className="text-white/50 mt-0.5">→</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Quick Wins */}
            <CollapsibleSection title="Quick Wins (Do These Now)" icon={Zap} defaultOpen color="#22c55e">
              <div className="space-y-2">
                {result.quick_wins.map((win, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                    <span className="text-green-400 font-bold text-sm mt-0.5">{i + 1}</span>
                    <p className="text-sm text-white/80">{win}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Bio Suggestions */}
            <CollapsibleSection title="Bio Suggestions" icon={MessageSquare} color="#fff">
              <div className="space-y-2">
                {result.bio_suggestions.map((bio, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-black/30 border border-white/5"
                  >
                    <p className="text-sm text-white/90 flex-1">{bio}</p>
                    <CopyButton text={bio} />
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Hashtag Recommendations */}
            <CollapsibleSection title="Recommended Hashtags" icon={Hash} color="#06b6d4">
              <div className="flex flex-wrap gap-1.5">
                {result.hashtag_recommendations.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs rounded-lg font-mono cursor-pointer hover:bg-cyan-500/20 transition-colors"
                    onClick={() => navigator.clipboard.writeText(`#${tag}`)}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-white/40 mt-2">Click any hashtag to copy. Use these in your tweets and bio.</p>
            </CollapsibleSection>

            {/* Content Strategy Tips */}
            <CollapsibleSection title="Content Strategy Tips" icon={TrendingUp} color="#a855f7">
              <div className="space-y-3">
                {result.content_strategy_tips.map((tip, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2"
                  >
                    <p className="text-sm font-semibold text-white">{tip.tip}</p>
                    <p className="text-xs text-white/50">{tip.why}</p>
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-purple-500/5 border border-purple-500/10">
                      <span className="text-purple-400 text-xs mt-0.5">→</span>
                      <p className="text-xs text-purple-300">{tip.how}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Growth Tactics */}
            <CollapsibleSection title="Growth Tactics" icon={Users} color="#f59e0b">
              <div className="space-y-2">
                {result.growth_tactics.map((tactic, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <span className="text-amber-400 font-bold text-sm mt-0.5">{i + 1}</span>
                    <p className="text-sm text-white/80">{tactic}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Screenshot Preview */}
            {imagePreview && (
              <CollapsibleSection title="Your Screenshot" icon={ImageIcon} color="#888">
                <div className="rounded-xl overflow-hidden border border-white/5">
                  <img
                    src={imagePreview}
                    alt="Analyzed X profile"
                    className="w-full max-h-[400px] object-contain bg-black/50"
                  />
                </div>
              </CollapsibleSection>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
