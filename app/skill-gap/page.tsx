'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from '@/lib/gsap-config'
import { getSupabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  Loader2, ArrowLeft, Sparkles, Upload, FileText, X,
  Grid, Target, Plus, Trash2, CheckCircle2, AlertCircle,
  HelpCircle, ChevronRight, BarChart3, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SkillGapPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // Form State
  const [resumeText, setResumeText] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescriptions, setJobDescriptions] = useState<{ title: string; description: string }[]>([
    { title: '', description: '' }
  ])

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

  const addJobField = () => {
    if (jobDescriptions.length < 5) {
      setJobDescriptions([...jobDescriptions, { title: '', description: '' }])
    }
  }

  const removeJobField = (index: number) => {
    setJobDescriptions(jobDescriptions.filter((_, i) => i !== index))
  }

  const updateJobField = (index: number, field: 'title' | 'description', value: string) => {
    const newJds = [...jobDescriptions]
    newJds[index][field] = value
    setJobDescriptions(newJds)
  }

  const handleAnalyze = async () => {
    if (!resumeText.trim() || jobDescriptions.some(j => !j.description.trim())) return
    setLoading(true)
    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/skill-gap/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ 
          resume_text: resumeText,
          job_descriptions: jobDescriptions.filter(j => j.description.trim() !== '')
        }),
      })
      if (!res.ok) throw new Error('Analysis failed')
      setResult(await res.json())
    } catch { alert('Failed to analyze. Try again.') }
    finally { setLoading(false) }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'strong': return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
      case 'partial': return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
      case 'missing': return 'bg-red-500/80'
      case 'not_required': return 'bg-white/5 border border-white/10'
      default: return 'bg-white/5'
    }
  }

  if (!authChecked) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-white/20" /></div>

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20">
      <div ref={containerRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-8 opacity-0">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2.5 rounded-xl hover:bg-white/10 transition-all border border-white/5 bg-white/5">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                Skill Gap Heatmap
              </h1>
              <p className="text-xs text-white/40 font-mono tracking-widest uppercase mt-1">Multi-JD Analysis • Pattern Recognition</p>
            </div>
          </div>
          {result && (
            <Button variant="outline" size="sm" onClick={() => setResult(null)} className="border-white/10 bg-white/5 hover:bg-white/10 text-white/70">
              New Comparison
            </Button>
          )}
        </div>

        {!result ? (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            
            {/* Left: Resume Side */}
            <div className="space-y-6">
               <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-5">
                 <div className="flex items-center gap-3">
                   <div className="p-2 rounded-xl bg-blue-500/20"><FileText className="w-5 h-5 text-blue-400" /></div>
                   <h3 className="font-semibold">Step 1: Your Resume</h3>
                 </div>
                 
                 <div className="space-y-4">
                   {!resumeFile ? (
                     <div
                       onClick={() => fileInputRef.current?.click()}
                       onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileUpload(f) }}
                       onDragOver={(e) => e.preventDefault()}
                       className="border-2 border-dashed border-white/10 hover:border-white/20 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all hover:bg-white/[0.01]"
                     >
                       <Upload className="w-6 h-6 text-white/20" />
                       <p className="text-xs text-white/40 font-medium">Drop PDF/DOCX here</p>
                     </div>
                   ) : (
                     <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                       <FileText className="w-5 h-5 text-blue-400" />
                       <span className="text-xs text-white/70 flex-1 truncate">{resumeFile.name}</span>
                       <button onClick={() => { setResumeFile(null); setResumeText('') }} className="p-1 rounded hover:bg-white/10 transition-colors">
                         <X className="w-4 h-4 text-white/40" />
                       </button>
                     </div>
                   )}
                   <input type="file" accept=".pdf,.docx,.txt" className="hidden" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }} />
                 </div>
               </div>

               <div className="p-8 rounded-[2rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 flex flex-col items-center text-center space-y-4">
                 <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/20 flex-shrink-0 animate-bounce">
                   <img src="/shruti.png" alt="Shruti" className="w-full h-full object-cover" />
                 </div>
                 <p className="text-xs text-white/60 leading-relaxed max-w-[240px]">
                   &quot;I'll compare your resume against multiple roles to find the <strong className="text-white">pattern of skills</strong> you're missing across your target industry.&quot;
                 </p>
               </div>
            </div>

            {/* Right: JDs Side */}
            <div className="space-y-6">
               <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-5">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-500/20"><Target className="w-5 h-5 text-purple-400" /></div>
                      <h3 className="font-semibold">Step 2: Target Roles</h3>
                    </div>
                    <span className="text-[10px] font-mono text-white/30 uppercase">{jobDescriptions.length}/5</span>
                 </div>

                 <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                   {jobDescriptions.map((jd, idx) => (
                     <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 relative group animate-in slide-in-from-right-4 duration-300">
                       <div className="flex items-center gap-2">
                         <input 
                           type="text" 
                           placeholder={`Role ${idx + 1} (e.g., SWE at Stripe)`}
                           value={jd.title}
                           onChange={(e) => updateJobField(idx, 'title', e.target.value)}
                           className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-white placeholder-white/20 p-0"
                         />
                         {jobDescriptions.length > 1 && (
                           <button onClick={() => removeJobField(idx)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-red-400/50 hover:text-red-400 transition-all">
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                         )}
                       </div>
                       <textarea 
                         placeholder="Paste job description here..."
                         value={jd.description}
                         onChange={(e) => updateJobField(idx, 'description', e.target.value)}
                         className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white/70 placeholder-white/10 focus:outline-none focus:border-white/10 h-24 resize-none"
                       />
                     </div>
                   ))}
                 </div>

                 {jobDescriptions.length < 5 && (
                    <button 
                      onClick={addJobField}
                      className="w-full py-3 rounded-xl border border-dashed border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 bg-white/5 hover:bg-white/[0.08]"
                    >
                      <Plus className="w-4 h-4 text-white/40" />
                      <span className="text-xs text-white/40">Add another JD</span>
                    </button>
                 )}

                 <Button 
                    onClick={handleAnalyze} 
                    disabled={loading || !resumeText.trim() || jobDescriptions.some(j => !j.description.trim())}
                    className="w-full h-12 rounded-xl bg-white hover:bg-gray-200 text-black font-semibold text-[15px] disabled:opacity-50"
                  >
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Analyzing patterns...</> : <><Sparkles className="w-5 h-5 mr-2" />Generate Heatmap</>}
                  </Button>
               </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-700">
            
            {/* Heatmap Section */}
            <div className="rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 overflow-hidden">
               <div className="p-8 border-b border-white/5 flex flex-wrap items-center justify-between gap-6">
                 <div>
                   <h3 className="text-xl font-bold tracking-tight">Cross-Role Skill Gap</h3>
                   <div className="flex items-center gap-6 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest">Strong Match</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest">Partial Coverage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest">Missing Link</span>
                      </div>
                   </div>
                 </div>
                 
                 <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                    <p className="text-[10px] text-white/30 uppercase font-mono tracking-[0.2em] mb-1">Industry Readiness</p>
                    <p className="text-3xl font-bold text-white">{result.summary.overall_readiness_percent}%</p>
                 </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-white/[0.01]">
                       <th className="p-6 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] border-r border-white/5 w-1/4">Core Skillset</th>
                       {result.job_titles.map((title: string, i: number) => (
                         <th key={i} className="p-6 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] text-center min-w-[120px]">
                            {title || `Role ${i+1}`}
                         </th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     {result.skills.map((skill: any, sIdx: number) => (
                        <tr key={sIdx} className="border-t border-white/5 group hover:bg-white/[0.01] transition-colors">
                          <td className="p-6 border-r border-white/5">
                             <div className="flex items-center gap-3">
                               <div className={`p-1.5 rounded-lg ${skill.importance === 'critical' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-white/40'}`}>
                                 {skill.importance === 'critical' ? <Zap className="w-3 h-3" /> : <BarChart3 className="w-3 h-3" />}
                               </div>
                               <div>
                                 <p className="text-xs font-bold text-white tracking-wide">{skill.name}</p>
                                 <p className="text-[9px] text-white/20 uppercase tracking-tighter">{skill.category}</p>
                               </div>
                             </div>
                          </td>
                          {result.job_titles.map((_: any, jIdx: number) => {
                            const cov = skill.coverage.find((c: any) => c.job_index === jIdx) || { status: 'not_required' }
                            return (
                              <td key={jIdx} className="p-6 text-center">
                                 <div className="group/cell relative flex justify-center">
                                   <div className={`w-8 h-8 rounded-xl transition-all duration-300 ${getStatusColor(cov.status)}`}>
                                      {cov.status === 'strong' && <CheckCircle2 className="w-4 h-4 mx-auto mt-2 text-white" />}
                                      {cov.status === 'missing' && <AlertCircle className="w-4 h-4 mx-auto mt-2 text-white/30" />}
                                   </div>
                                   
                                   {/* Tooltip */}
                                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 rounded-lg bg-white text-black text-[10px] font-medium opacity-0 group-hover/cell:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-white">
                                      {cov.evidence || 'Pattern breakdown...'}
                                   </div>
                                 </div>
                              </td>
                            )
                          })}
                        </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Bottom Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               {/* Priority Actions */}
               <div className="lg:col-span-2 space-y-6">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-3">
                   <Target className="w-4 h-4" /> Priority Acquisition Roadmap
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {result.priority_actions.map((action: any, i: number) => (
                     <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4 hover:border-white/20 transition-all group">
                       <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center font-bold text-white text-sm">
                              {i + 1}
                            </div>
                            <h4 className="font-bold text-white">{action.skill}</h4>
                          </div>
                          <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">{action.impact} Required</span>
                       </div>
                       <div className="space-y-3">
                          <p className="text-xs text-white/50 leading-relaxed"><span className="text-white/30 uppercase font-mono text-[9px] block mb-1">The Gap:</span> {action.why}</p>
                          <div className="p-3 rounded-xl bg-black/40 border border-white/5 group-hover:border-blue-500/20 transition-all">
                             <p className="text-xs text-white/80 flex items-center gap-2">
                               <Zap className="w-3 h-3 text-amber-400" /> {action.how}
                             </p>
                          </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Stats & Metadata */}
               <div className="space-y-6">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-3">
                   <HelpCircle className="w-4 h-4" /> Analysis Stats
                 </h3>
                 <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40">Strong Matches</span>
                        <span className="text-green-400 font-bold">{result.summary.strong_matches}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${(result.summary.strong_matches / result.summary.total_skills_analyzed) * 100}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40">Partial Matches</span>
                        <span className="text-amber-400 font-bold">{result.summary.partial_matches}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${(result.summary.partial_matches / result.summary.total_skills_analyzed) * 100}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40">Missing Critical</span>
                        <span className="text-red-400 font-bold">{result.summary.missing_skills}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${(result.summary.missing_skills / result.summary.total_skills_analyzed) * 100}%` }} />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[10px] text-white/30 uppercase font-mono tracking-[0.2em] mb-4">Hidden Strengths</p>
                      <div className="flex flex-wrap gap-2">
                        {result.hidden_strengths.map((str: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-medium">
                            {str}
                          </span>
                        ))}
                      </div>
                    </div>
                 </div>

                 <Button className="w-full h-14 rounded-[2rem] bg-white hover:bg-gray-200 text-black font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all">
                    Optimize for All Roles <ChevronRight className="w-4 h-4 ml-2" />
                 </Button>
               </div>

            </div>

          </div>
        )}
      </div>
    </div>
  )
}
