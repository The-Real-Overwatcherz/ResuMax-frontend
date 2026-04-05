'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from '@/lib/gsap-config'
import { getSupabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  Loader2, ArrowLeft, Copy, Check, Sparkles, Send, Mail, Linkedin,
  MessageSquare, Users, Lightbulb, Upload, FileText, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white text-xs font-medium"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function ColdOutreachPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // Form
  const [resumeText, setResumeText] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [targetCompany, setTargetCompany] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [targetPerson, setTargetPerson] = useState('')
  const [targetPersonTitle, setTargetPersonTitle] = useState('')
  const [context, setContext] = useState('')

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else setAuthChecked(true)
    })
  }, [router])

  useEffect(() => {
    if (!authChecked || !containerRef.current) return
    gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
  }, [authChecked])

  const handleFileUpload = async (file: File) => {
    setResumeFile(file)
    if (file.name.endsWith('.txt')) {
      setResumeText(await file.text())
    } else {
      // Parse via backend
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return
      const formData = new FormData()
      formData.append('resume', file)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/voice-chat/parse-resume`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        setResumeText(data.text)
      }
    }
  }

  const handleGenerate = async () => {
    if (!resumeText.trim() || !targetCompany.trim()) return
    setLoading(true)
    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/cold-outreach/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          resume_text: resumeText,
          target_company: targetCompany,
          target_role: targetRole,
          target_person: targetPerson,
          target_person_title: targetPersonTitle,
          context,
        }),
      })
      if (!res.ok) throw new Error('Generation failed')
      setResult(await res.json())
    } catch { alert('Failed to generate. Try again.') }
    finally { setLoading(false) }
  }

  if (!authChecked) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="min-h-screen bg-[#050505]">
      <div ref={containerRef} className="max-w-5xl mx-auto px-4 sm:px-6 py-8 opacity-0">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Cold Outreach Generator</h1>
                <p className="text-xs text-white/40">AI-crafted messages that actually get replies</p>
              </div>
            </div>
          </div>
          {result && (
            <Button variant="outline" size="sm" onClick={() => setResult(null)} className="border-white/10 text-white/60 bg-transparent hover:text-white">
              New Outreach
            </Button>
          )}
        </div>

        {/* Form */}
        {!result && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Shruti intro */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-white/20 flex-shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <img src="/shruti.png" alt="Shruti" className="w-full h-full object-cover" />
              </div>
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm px-5 py-4 max-w-lg">
                <p className="text-sm text-white/80 leading-relaxed">
                  Upload your resume and tell me who you want to reach out to. I&apos;ll craft a <strong className="text-white">LinkedIn request</strong>, <strong className="text-white">cold email</strong>, and <strong className="text-white">follow-up</strong> — all personalized to your background.
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06] p-6 sm:p-8 space-y-5">
              {/* Resume upload */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">Resume</label>
                {!resumeFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileUpload(f) }}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-white/10 hover:border-white/20 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer transition-all hover:bg-white/[0.01]"
                  >
                    <Upload className="w-6 h-6 text-white/20" />
                    <p className="text-xs text-white/40">Drop PDF/DOCX/TXT or click to browse</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <FileText className="w-5 h-5 text-white/50" />
                    <span className="text-sm text-white/70 flex-1 truncate">{resumeFile.name}</span>
                    <button onClick={() => { setResumeFile(null); setResumeText('') }} className="p-1 rounded hover:bg-white/10"><X className="w-4 h-4 text-white/40" /></button>
                  </div>
                )}
                <input type="file" accept=".pdf,.docx,.txt" className="hidden" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }} />
              </div>

              {/* Target company */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">Target Company *</label>
                <input type="text" value={targetCompany} onChange={(e) => setTargetCompany(e.target.value)} placeholder="e.g., Stripe, Google, YC Startup..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all" />
              </div>

              {/* Target role */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">Target Role (optional)</label>
                <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g., Senior Backend Engineer"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all" />
              </div>

              {/* Target person */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">Person Name (optional)</label>
                  <input type="text" value={targetPerson} onChange={(e) => setTargetPerson(e.target.value)} placeholder="e.g., Jane Doe"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">Their Title (optional)</label>
                  <input type="text" value={targetPersonTitle} onChange={(e) => setTargetPersonTitle(e.target.value)} placeholder="e.g., Engineering Manager"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all" />
                </div>
              </div>

              {/* Context */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">Extra Context (optional)</label>
                <textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="e.g., I saw their talk at React Conf, we have a mutual connection..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all min-h-[80px] resize-none" />
              </div>

              <Button onClick={handleGenerate} disabled={loading || !resumeText.trim() || !targetCompany.trim()}
                className="w-full h-12 rounded-xl bg-white hover:bg-gray-200 text-black font-semibold text-[15px] disabled:opacity-50">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Shruti is crafting...</> : <><Sparkles className="w-5 h-5 mr-2" />Generate Outreach Messages</>}
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* LinkedIn Connection */}
            {result.linkedin_connection && (
              <div className="rounded-[1.5rem] bg-white/[0.02] border border-[#0A66C2]/20 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#0A66C2]/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/20 flex items-center justify-center"><Linkedin className="w-4 h-4 text-[#0A66C2]" /></div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">LinkedIn Connection Request</h3>
                      <p className="text-[10px] text-white/40">{result.linkedin_connection.message.length}/300 chars</p>
                    </div>
                  </div>
                  <CopyButton text={result.linkedin_connection.message} />
                </div>
                <div className="p-5 space-y-3">
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                    <p className="text-sm text-white/90 leading-relaxed">{result.linkedin_connection.message}</p>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-white/40">
                    <Lightbulb className="w-3 h-3 text-yellow-400/60 flex-shrink-0 mt-0.5" />
                    <span>{result.linkedin_connection.note}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Cold Email */}
            {result.cold_email && (
              <div className="rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><Mail className="w-4 h-4 text-white/70" /></div>
                    <h3 className="text-sm font-semibold text-white">Cold Email</h3>
                  </div>
                  <CopyButton text={`Subject: ${result.cold_email.subject}\n\n${result.cold_email.body}`} />
                </div>
                <div className="p-5 space-y-3">
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/30 font-mono">Subject:</span>
                    <p className="text-sm text-white/90 font-medium">{result.cold_email.subject}</p>
                  </div>
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                    <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{result.cold_email.body}</p>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-white/40">
                    <Lightbulb className="w-3 h-3 text-yellow-400/60 flex-shrink-0 mt-0.5" /><span>{result.cold_email.note}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Follow-up */}
            {result.follow_up && (
              <div className="rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><MessageSquare className="w-4 h-4 text-white/70" /></div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Follow-Up (Day 5-7)</h3>
                    </div>
                  </div>
                  <CopyButton text={result.follow_up.message} />
                </div>
                <div className="p-5 space-y-3">
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                    <p className="text-sm text-white/80 leading-relaxed">{result.follow_up.message}</p>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-white/40">
                    <Lightbulb className="w-3 h-3 text-yellow-400/60 flex-shrink-0 mt-0.5" /><span>{result.follow_up.note}</span>
                  </div>
                </div>
              </div>
            )}

            {/* LinkedIn Comment */}
            {result.linkedin_comment && (
              <div className="rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center"><Users className="w-4 h-4 text-[#0A66C2]/70" /></div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Warm-Up Comment</h3>
                      <p className="text-[10px] text-white/40">Comment on their post first to get noticed</p>
                    </div>
                  </div>
                  <CopyButton text={result.linkedin_comment.example} />
                </div>
                <div className="p-5 space-y-3">
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                    <p className="text-sm text-white/80 leading-relaxed">{result.linkedin_comment.example}</p>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-white/40">
                    <Lightbulb className="w-3 h-3 text-yellow-400/60 flex-shrink-0 mt-0.5" /><span>{result.linkedin_comment.note}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Strategy Tips */}
            {result.strategy_tips?.length > 0 && (
              <div className="rounded-[1.5rem] bg-white/[0.02] border border-white/[0.06] p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" /> Response Rate Strategy
                </h3>
                <div className="space-y-2">
                  {result.strategy_tips.map((tip: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                      <span className="text-yellow-400 font-bold text-sm mt-0.5">{i + 1}</span>
                      <p className="text-sm text-white/70">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
