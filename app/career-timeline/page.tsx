'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from '@/lib/gsap-config'
import { getSupabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  Loader2, ArrowLeft, Sparkles, Upload, FileText, X,
  TrendingUp, Milestone, History, Briefcase, GraduationCap,
  AlertCircle, ChevronRight, Share2, Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CareerTimelinePage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // Form
  const [resumeText, setResumeText] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)

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

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return
    setLoading(true)
    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/career-timeline/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ resume_text: resumeText }),
      })
      if (!res.ok) throw new Error('Analysis failed')
      setResult(await res.json())
    } catch { alert('Failed to analyze. Try again.') }
    finally { setLoading(false) }
  }

  if (!authChecked) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-white/20" /></div>

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div ref={containerRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-8 opacity-0">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2.5 rounded-xl hover:bg-white/10 transition-all border border-white/5 bg-white/5">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                Career Timeline Visualizer
              </h1>
              <p className="text-xs text-white/40 font-mono tracking-widest uppercase mt-1">Growth • Gaps • Pivots</p>
            </div>
          </div>
          {result && (
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => window.print()} className="border-white/10 bg-white/5 hover:bg-white/10 text-white/70">
                <Download className="w-4 h-4 mr-2" /> PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => setResult(null)} className="border-white/10 bg-white/5 hover:bg-white/10 text-white/70">
                Analyze New
              </Button>
            </div>
          )}
        </div>

        {!result ? (
          <div className="max-w-2xl mx-auto space-y-8 py-12">
            <div className="text-center space-y-4">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 mb-2">
                <History className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold">Visualize Your Professional Journey</h2>
              <p className="text-white/40 text-sm max-w-md mx-auto">
                Upload your resume and let Shruti reconstruct your career path into an interactive, high-fidelity visual trajectory.
              </p>
            </div>

            <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-8 sm:p-10 space-y-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="space-y-4 relative">
                <label className="text-[10px] font-mono text-[#888] tracking-[0.2em] uppercase ml-1 block">Source Resume</label>
                {!resumeFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileUpload(f) }}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-white/10 hover:border-white/20 rounded-[2rem] p-12 flex flex-col items-center gap-4 cursor-pointer transition-all hover:bg-white/[0.01]"
                  >
                    <div className="p-4 rounded-full bg-white/5">
                      <Upload className="w-8 h-8 text-white/40" />
                    </div>
                    <p className="text-sm text-white/40">Drop PDF/DOCX or click to browse</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
                    <div className="p-3 rounded-xl bg-blue-500/20">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{resumeFile.name}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-tight">Ready for analysis</p>
                    </div>
                    <button onClick={() => { setResumeFile(null); setResumeText('') }} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                      <X className="w-5 h-5 text-white/30" />
                    </button>
                  </div>
                )}
                <input type="file" accept=".pdf,.docx,.txt" className="hidden" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }} />
              </div>

              <Button 
                onClick={handleAnalyze} 
                disabled={loading || !resumeText.trim()}
                className="w-full h-14 rounded-2xl bg-white hover:bg-gray-200 text-black font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-50 relative overflow-hidden"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Mapping Trajectory...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Career Map</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            
            {/* Upper Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-1">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Growth Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-400">{result.growth_score}</span>
                  <span className="text-xs text-white/20">/ 100</span>
                </div>
              </div>
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-1">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Total Experience</p>
                <p className="text-3xl font-bold text-white">{result.career_analysis.total_years} <span className="text-sm font-normal text-white/40">Yrs</span></p>
              </div>
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-1">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Trajectory</p>
                <p className="text-2xl font-bold capitalize text-white flex items-center gap-2">
                  {result.career_analysis.career_trajectory}
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </p>
              </div>
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-1">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Tenure Avg</p>
                <p className="text-3xl font-bold text-white">{Math.round(result.career_analysis.avg_tenure_months)} <span className="text-sm font-normal text-white/40">Mo</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Timeline Visualization */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 p-8 sm:p-10 relative overflow-hidden">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-10 flex items-center gap-2">
                    <Milestone className="w-4 h-4" /> Trajectory Map
                  </h3>

                  <div className="relative pl-8 md:pl-12 border-l border-white/10 space-y-12 pb-8">
                    {result.timeline.map((item: any, idx: number) => (
                      <div key={idx} className="relative group">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[37px] md:-left-[53px] top-0 w-4 h-4 rounded-full border-2 border-[#050505] transition-all duration-500 scale-125
                          ${item.type === 'role' ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
                            item.type === 'education' ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 
                            item.type === 'gap' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,44,44,0.5)]' : 'bg-white/40'}`} 
                        />
                        
                        <div className="space-y-2 group-hover:translate-x-2 transition-transform duration-300">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded uppercase tracking-tighter">
                              {item.start_date} — {item.end_date}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${
                              item.growth_indicator === 'promotion' ? 'text-green-400' : 
                              item.growth_indicator === 'career_change' ? 'text-amber-400' : 'text-white/40'
                            }`}>
                              {item.growth_indicator?.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-bold text-white">{item.title}</h4>
                            <p className="text-sm text-white/50">{item.organization}</p>
                          </div>

                          <p className="text-xs text-white/40 max-w-xl leading-relaxed">
                            {item.description}
                          </p>

                          {item.skills_gained?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {item.skills_gained.slice(0, 5).map((s: string, i: number) => (
                                <span key={i} className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Narrative Card */}
                <div className="rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 p-8 sm:p-10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white/20 flex-shrink-0">
                      <img src="/shruti.png" alt="Shruti" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-2">Analysis Narrative</h4>
                      <p className="text-sm text-white/80 leading-relaxed italic">
                        &quot;{result.narrative}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Insights */}
              <div className="space-y-6">
                
                {/* Pivots & Gaps */}
                {(result.career_analysis.pivots?.length > 0 || result.career_analysis.gaps?.length > 0) && (
                  <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-8 space-y-8">
                    
                    {result.career_analysis.pivots?.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Strategic Pivots</h4>
                        {result.career_analysis.pivots.map((p: any, i: number) => (
                          <div key={i} className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-amber-400 uppercase">{p.when}</span>
                              <TrendingUp className="w-3 h-3 text-amber-400" />
                            </div>
                            <p className="text-xs font-semibold text-white">{p.from_role} <ChevronRight className="inline w-3 h-3 mx-1 text-white/30" /> {p.to_role}</p>
                            <p className="text-[10px] text-white/50 leading-relaxed">{p.narrative}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {result.career_analysis.gaps?.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Gap Resolution</h4>
                        {result.career_analysis.gaps.map((g: any, i: number) => (
                          <div key={i} className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-red-400 uppercase">{g.duration_months} Months</span>
                              <AlertCircle className="w-3 h-3 text-red-400" />
                            </div>
                            <p className="text-xs font-semibold text-white">{g.start} — {g.end}</p>
                            <div className="p-2 rounded-lg bg-black/40 border border-white/5 mt-1">
                              <p className="text-[9px] text-white/40 uppercase mb-1">Shruti's Tip:</p>
                              <p className="text-[10px] text-white/70 leading-relaxed italic">{g.suggestion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Recommendations */}
                <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-8 space-y-6">
                   <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Next-Step Strategy</h4>
                   <div className="space-y-3">
                     {result.recommendations.map((rec: string, i: number) => (
                       <div key={i} className="flex gap-3 text-xs text-white/70">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                         <p>{rec}</p>
                       </div>
                     ))}
                   </div>
                   <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-10 text-xs">
                     Find matching roles <ChevronRight className="w-3 h-3 ml-1" />
                   </Button>
                </div>

                <div className="rounded-[2.5rem] border border-white/5 p-8 flex flex-col items-center justify-center text-center space-y-3">
                  <Share2 className="w-6 h-6 text-white/20" />
                  <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest">Share Profile</p>
                </div>

              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  )
}
