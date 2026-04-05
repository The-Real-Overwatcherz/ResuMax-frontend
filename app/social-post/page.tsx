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
  Sparkles,
  Hash,
  TrendingUp,
  Image as ImageIcon,
  RefreshCw,
  ArrowLeft,
  Linkedin,
  MessageSquare,
  Zap,
  Clock,
  ChevronDown,
  Hexagon,
  Send,
  Eye,
  Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ── X icon (custom since lucide X is "close") ── */
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
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white text-xs font-medium"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

const TONES = [
  { id: 'professional', label: 'Professional', emoji: '💼' },
  { id: 'casual', label: 'Casual', emoji: '😊' },
  { id: 'inspirational', label: 'Inspirational', emoji: '🔥' },
  { id: 'technical', label: 'Technical', emoji: '⚙️' },
  { id: 'humorous', label: 'Humorous', emoji: '😄' },
  { id: 'thought-leadership', label: 'Thought Leader', emoji: '🧠' },
]

interface PostResult {
  linkedin_post: {
    content: string
    hashtags: string[]
    character_count: number
    hook_line: string
    engagement_tips: string[]
    best_posting_time: string
    image_recommendation: {
      should_attach: boolean
      suggested_image: string
      image_type: string
    }
  }
  x_post: {
    content: string
    hashtags: string[]
    character_count: number
    thread: string[]
    is_thread: boolean
    engagement_tips: string[]
    best_posting_time: string
    image_recommendation: {
      should_attach: boolean
      suggested_image: string
      image_type: string
    }
  }
  topic_summary: string
  virality_score: number
  platform_strategy: string
}

export default function SocialPostPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [authChecked, setAuthChecked] = useState(false)

  // Form state
  const [step, setStep] = useState<'topic' | 'details' | 'result'>('topic')
  const [topic, setTopic] = useState('')
  const [keyPoints, setKeyPoints] = useState('')
  const [tone, setTone] = useState('professional')
  const [audience, setAudience] = useState('')
  const [includeThread, setIncludeThread] = useState(false)

  // Result state
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PostResult | null>(null)

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

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true)

    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/social-post/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          topic: topic.trim(),
          key_points: keyPoints.trim(),
          tone,
          target_audience: audience.trim(),
          include_thread: includeThread,
        }),
      })

      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      setResult(data)
      setStep('result')
    } catch (err) {
      console.error('Post generation failed:', err)
      alert('Failed to generate posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = () => {
    setResult(null)
    handleGenerate()
  }

  const handleStartOver = () => {
    setResult(null)
    setStep('topic')
    setTopic('')
    setKeyPoints('')
    setTone('professional')
    setAudience('')
    setIncludeThread(false)
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
      <div ref={containerRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-8 opacity-0">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A66C2]/20 to-white/10 flex items-center justify-center border border-white/10">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Social Post Maker</h1>
                <p className="text-xs text-white/40">Create posts for LinkedIn & X simultaneously</p>
              </div>
            </div>
          </div>
          {result && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartOver}
              className="border-white/10 text-white/60 bg-transparent hover:text-white"
            >
              New Post
            </Button>
          )}
        </header>

        {/* Shruti welcome */}
        {step === 'topic' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Shruti chat bubble */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-white/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <img src="/shruti.png" alt="Shruti" className="w-full h-full object-cover" />
              </div>
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm px-5 py-4 max-w-lg">
                <p className="text-sm text-white/80 leading-relaxed">
                  Hey! I&apos;m Shruti. Tell me what you want to post about and I&apos;ll create <strong className="text-white">platform-optimized</strong> versions for both LinkedIn and X — each tailored to perform best on its platform.
                </p>
              </div>
            </div>

            {/* Topic input card */}
            <div className="rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06] p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">What&apos;s your topic?</h2>
                <p className="text-sm text-white/40">What do you want to post about?</p>
              </div>

              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., I just launched my first SaaS product after 6 months of building in public..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all min-h-[100px] resize-none"
              />

              <Button
                onClick={() => setStep('details')}
                disabled={!topic.trim()}
                className="w-full h-12 rounded-xl bg-white hover:bg-gray-200 text-black font-semibold text-[15px] disabled:opacity-50 transition-all"
              >
                Continue
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 'details' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Topic preview */}
            <div className="flex items-start gap-3 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 text-sm font-semibold">U</span>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tr-sm px-4 py-3 max-w-md">
                <p className="text-sm text-white/90 line-clamp-3">{topic}</p>
              </div>
            </div>

            {/* Shruti asks for details */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-white/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <img src="/shruti.png" alt="Shruti" className="w-full h-full object-cover" />
              </div>
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm px-5 py-4 max-w-lg">
                <p className="text-sm text-white/80 leading-relaxed">
                  Great topic! Let me customize the posts. Pick a tone and add any extra details you want included.
                </p>
              </div>
            </div>

            {/* Details form */}
            <div className="rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06] p-6 sm:p-8 space-y-6">

              {/* Tone selector */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all border ${
                        tone === t.id
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-transparent border-white/5 text-white/40 hover:text-white/60 hover:border-white/10'
                      }`}
                    >
                      <span>{t.emoji}</span>
                      <span className="font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Key points */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">
                  Key Points (optional)
                </label>
                <textarea
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  placeholder="Any specific points, stats, or facts to include..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all min-h-[80px] resize-none"
                />
              </div>

              {/* Target audience */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">
                  Target Audience (optional)
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g., Tech founders, developers, startup community..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all font-mono"
                />
              </div>

              {/* Thread toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
                <div>
                  <p className="text-sm text-white/80 font-medium">Generate X Thread</p>
                  <p className="text-xs text-white/40">Create a multi-tweet thread for X</p>
                </div>
                <button
                  onClick={() => setIncludeThread(!includeThread)}
                  className={`w-10 h-6 rounded-full transition-all relative ${
                    includeThread ? 'bg-white' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full absolute top-1 transition-all ${
                      includeThread ? 'right-1 bg-black' : 'left-1 bg-white/30'
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('topic')}
                  className="flex-1 h-12 rounded-xl border-white/10 text-white/60 bg-transparent hover:text-white"
                >
                  Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-[2] h-12 rounded-xl bg-gradient-to-r from-[#0A66C2] to-white/90 hover:opacity-90 text-black font-semibold text-[15px] disabled:opacity-50 transition-all shadow-[0_0_30px_rgba(10,102,194,0.3)]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Shruti is writing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Both Posts
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Results — Split View */}
        {step === 'result' && result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Strategy bar */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs font-mono text-green-400">Virality: {result.virality_score}/10</span>
              </div>
              <p className="text-xs text-white/50 flex-1">{result.platform_strategy}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={loading}
                className="border-white/10 text-white/60 bg-transparent hover:text-white gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            </div>

            {/* Split cards */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* LinkedIn Post Card */}
              <div className="rounded-[1.5rem] bg-white/[0.02] border border-[#0A66C2]/20 overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#0A66C2]/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/20 flex items-center justify-center">
                      <Linkedin className="w-4.5 h-4.5 text-[#0A66C2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">LinkedIn</h3>
                      <p className="text-[10px] text-white/40">{result.linkedin_post.character_count} chars</p>
                    </div>
                  </div>
                  <CopyButton text={
                    result.linkedin_post.content +
                    '\n\n' +
                    result.linkedin_post.hashtags.map(h => `#${h}`).join(' ')
                  } />
                </div>

                {/* Post content */}
                <div className="p-5 space-y-4">
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4 max-h-[300px] overflow-y-auto">
                    <p className="text-sm text-white/85 leading-relaxed whitespace-pre-line">{result.linkedin_post.content}</p>
                  </div>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5">
                    {result.linkedin_post.hashtags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] text-xs rounded-lg font-mono cursor-pointer hover:bg-[#0A66C2]/20 transition-colors"
                        onClick={() => navigator.clipboard.writeText(`#${tag}`)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Image recommendation */}
                  {result.linkedin_post.image_recommendation.should_attach && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-[#0A66C2]/5 border border-[#0A66C2]/10">
                      <ImageIcon className="w-4 h-4 text-[#0A66C2] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-[#0A66C2]">Image Recommended: {result.linkedin_post.image_recommendation.image_type}</p>
                        <p className="text-xs text-white/40 mt-0.5">{result.linkedin_post.image_recommendation.suggested_image}</p>
                      </div>
                    </div>
                  )}

                  {/* Engagement Tips */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Engagement Tips</p>
                    {result.linkedin_post.engagement_tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/50">
                        <Lightbulb className="w-3 h-3 text-yellow-400/60 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>

                  {/* Best time */}
                  <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <Clock className="w-3 h-3" />
                    Best time to post: {result.linkedin_post.best_posting_time}
                  </div>
                </div>
              </div>

              {/* X/Twitter Post Card */}
              <div className="rounded-[1.5rem] bg-white/[0.02] border border-white/10 overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <XLogo className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">X / Twitter</h3>
                      <p className="text-[10px] text-white/40">
                        {result.x_post.character_count}/280 chars
                        {result.x_post.is_thread && ` • ${result.x_post.thread.length} tweets`}
                      </p>
                    </div>
                  </div>
                  <CopyButton text={
                    result.x_post.is_thread
                      ? result.x_post.thread.join('\n\n---\n\n')
                      : result.x_post.content + '\n\n' + result.x_post.hashtags.map(h => `#${h}`).join(' ')
                  } />
                </div>

                {/* Post content */}
                <div className="p-5 space-y-4">
                  {!result.x_post.is_thread ? (
                    <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                      <p className="text-sm text-white/85 leading-relaxed">{result.x_post.content}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {result.x_post.thread.map((tweet, i) => (
                        <div key={i} className="bg-black/30 border border-white/5 rounded-xl p-4 relative">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-white/30">
                              {i + 1}/{result.x_post.thread.length}
                            </span>
                            <span className="text-[10px] font-mono text-white/30">
                              {tweet.length}/280
                            </span>
                          </div>
                          <p className="text-sm text-white/85 leading-relaxed">{tweet}</p>
                          {i < result.x_post.thread.length - 1 && (
                            <div className="absolute -bottom-2 left-6 w-[2px] h-4 bg-white/10" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5">
                    {result.x_post.hashtags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/70 text-xs rounded-lg font-mono cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => navigator.clipboard.writeText(`#${tag}`)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Image recommendation */}
                  {result.x_post.image_recommendation.should_attach && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <ImageIcon className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-white/70">Image Recommended: {result.x_post.image_recommendation.image_type}</p>
                        <p className="text-xs text-white/40 mt-0.5">{result.x_post.image_recommendation.suggested_image}</p>
                      </div>
                    </div>
                  )}

                  {/* Engagement Tips */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Engagement Tips</p>
                    {result.x_post.engagement_tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/50">
                        <Lightbulb className="w-3 h-3 text-yellow-400/60 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>

                  {/* Best time */}
                  <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <Clock className="w-3 h-3" />
                    Best time to post: {result.x_post.best_posting_time}
                  </div>
                </div>
              </div>

            </div>

            {/* Topic summary */}
            <div className="text-center text-xs text-white/30 font-mono">
              {result.topic_summary}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
