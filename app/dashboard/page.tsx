'use client'

import React, { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  FileText, CheckCircle2, Loader2, Download, Menu, Plus, MessageSquare, Clock, Trash2,
  Settings, X, Send, Paperclip, Hexagon, LogOut, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const STEP_LABELS = [
  "Queued",
  "Extracting resume data",
  "Calculating ATS score",
  "Running deep analysis",
  "Generating interview questions",
  "Rewriting bullet points",
  "Running final optimization",
  "Optimization complete"
]

type MessageType = 'welcome' | 'user_submission' | 'shruti_tracking' | 'shruti_result'

interface Message {
  id: string
  type: MessageType
  userName?: string
  userInitial?: string
  jd?: string
  file?: { name: string, size: number }
  messageText?: string
  
  // For Tracking & Result
  analysisId?: string
  status?: string | null
  currentStep?: number
  analysisData?: any
}

// Sub-components for chat bubbles
const ShrutiAvatar = () => (
  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white to-gray-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
    <Hexagon className="w-5 h-5 text-black fill-current" />
  </div>
)

const UserAvatar = ({ initial }: { initial: string }) => (
  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center flex-shrink-0">
    <span className="text-blue-400 text-sm font-semibold uppercase">{initial}</span>
  </div>
)

export default function DashboardChat() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  // Chat State
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Input State
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // History State
  const [history, setHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const fetchHistory = async () => {
    if (!user) return
    setLoadingHistory(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/analysis/`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      if (!res.ok) throw new Error("Failed to fetch history")
      const data = await res.json()
      setHistory(data.analyses || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [user])

  const loadHistoricalAnalysis = async (aid: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/analysis/${aid}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      if (!res.ok) throw new Error("Failed to load past analysis")
      const analysisData = await res.json()
      
      const sessionName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
      
      setMessages([
        {
          id: Date.now().toString(),
          type: 'shruti_result',
          analysisId: aid,
          analysisData,
          userName: sessionName
        }
      ])
      
      // Close sidebar on mobile
      if (window.innerWidth < 768) setSidebarOpen(false)
    } catch(e) {
      console.error("Error loading historical analysis", e)
      alert("Failed to load historical analysis")
    }
  }

  const deleteAnalysis = async (aid: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent loading the analysis when clicking delete
    
    if (!confirm('Are you sure you want to delete this analysis?')) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/analysis/${aid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      
      if (!res.ok) throw new Error("Failed to delete analysis")
      
      // Remove from state
      setHistory(prev => prev.filter(h => h.id !== aid))
      
      // If the deleted items is currently active in chat, we could clear it, but let's just let it be or clear everything
      setMessages(prev => prev.filter(m => m.analysisId !== aid))
      
    } catch(e) {
      console.error("Error deleting analysis", e)
      alert("Failed to delete analysis")
    }
  }
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return
      
      if (!session) {
        router.replace('/')
      } else {
        setUser(session.user)
        const name = session.user.user_metadata?.full_name || session.user.email || 'Guest'
        setMessages([
          {
            id: '1',
            type: 'welcome',
            messageText: `Welcome back, ${name.split('@')[0]}. I am Shruti, your AI Advisor. Please upload your resume document and paste the target job description below to begin the analysis pipeline.`
          }
        ])
      }
      setLoadingUser(false)
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/')
      } else if (session) {
        setUser(session.user)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  // Polling Effect for tracking message
  useEffect(() => {
    const activeTrackingMsg = messages.find(m => m.type === 'shruti_tracking' && m.status !== 'completed' && m.status !== 'failed')
    if (!activeTrackingMsg || !activeTrackingMsg.analysisId) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const aid = activeTrackingMsg.analysisId

    let isPolling = false

    const poll = async () => {
      if (isPolling) return
      isPolling = true

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        // 1. Fetch Status
        const resStatus = await fetch(`${apiUrl}/api/analysis/${aid}/status`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
        if (!resStatus.ok) throw new Error("Status API failed")
        const dataStatus = await resStatus.json()

        // 2 & 3. Combine State Updates to prevent duplicates from overlapping polls
        if (dataStatus.status === 'completed') {
          const resFull = await fetch(`${apiUrl}/api/analysis/${aid}`, {
            headers: { 'Authorization': `Bearer ${session.access_token}` }
          })
          const analysisData = await resFull.json()
          
          setMessages(prev => {
            // Guard against duplicate results
            if (prev.some(m => m.type === 'shruti_result' && m.analysisId === aid)) {
              return prev
            }
            const updated = prev.map(m => m.id === activeTrackingMsg.id ? { ...m, status: 'completed', currentStep: dataStatus.current_step } : m)
            return [
              ...updated,
              {
                id: Date.now().toString(),
                type: 'shruti_result',
                analysisId: aid,
                analysisData,
                userName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
              }
            ]
          })
        } else {
          setMessages(prev => prev.map(m => m.id === activeTrackingMsg.id ? { ...m, status: dataStatus.status, currentStep: dataStatus.current_step } : m))
        }

      } catch (err) {
        console.error("Polling error", err)
      } finally {
        isPolling = false
      }
    }

    const interval = setInterval(poll, 3000)
    return () => clearInterval(interval)
  }, [messages, user])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const startAnalysis = async () => {
    if (!file) return alert('Please attach a resume file.')
    if (!jobDescription.trim()) return alert('Please enter a job description.')

    setIsSubmitting(true)
    
    // Add user message
    const initial = (user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()
    
    const userMsgId = Date.now().toString()
    setMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        type: 'user_submission',
        userInitial: initial,
        jd: jobDescription,
        file: { name: file.name, size: file.size }
      }
    ])

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Not authenticated.")

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('job_description', jobDescription)

      const res = await fetch(`${apiUrl}/api/analysis/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to start analysis')
      }

      // Append Shruti tracking msg
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'shruti_tracking',
          analysisId: data.analysis_id,
          status: 'pending',
          currentStep: 0
        }
      ])

      // Clear input
      setFile(null)
      setJobDescription('')
      
    } catch (err: any) {
      alert(err.message || 'An error occurred during submission.')
      // Remove the user message if it failed entirely to prevent a stuck UI
      setMessages(prev => prev.filter(m => m.id !== userMsgId))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-[100dvh] bg-[#050505] text-white w-full overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`flex-shrink-0 flex flex-col transition-all duration-300 border-r border-white/5 bg-[#0a0a0a] z-40
        ${sidebarOpen ? 'w-64' : 'w-0 opacity-0 overflow-hidden'}
        md:relative absolute h-full`}
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/50" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/70">Chat History</h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {/* New Chat Button */}
          <button 
            onClick={() => {
              const name = user?.user_metadata?.full_name || user?.email || 'Guest'
              setMessages([{
                id: Date.now().toString(),
                type: 'welcome',
                messageText: `Welcome back, ${name.split('@')[0]}. I am Shruti, your AI Advisor. Please upload your resume document and paste the target job description below to begin the analysis pipeline.`
              }])
              if (window.innerWidth < 768) setSidebarOpen(false)
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-xs text-white/90"
          >
            <Plus className="w-4 h-4" /> New Analysis
          </button>

          <div className="pt-4 space-y-1">
            <p className="px-3 text-[10px] text-white/40 font-mono mb-2 uppercase">Past Analyses</p>
            {loadingHistory ? (
              <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-white/30" /></div>
            ) : history.length === 0 ? (
              <p className="px-3 text-xs text-white/30 italic">No history yet</p>
            ) : (
              history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => loadHistoricalAnalysis(h.id)}
                  className="w-full text-left flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-white/30 group-hover:text-white/70 mt-0.5 flex-shrink-0" />
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs text-white/80 truncate font-medium">{h.job_title || 'Untitled Role'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-mono ${h.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {h.status}
                      </span>
                      {h.ats_score > 0 && <span className="text-[10px] text-blue-400">Score: {h.ats_score}</span>}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => deleteAnalysis(h.id, e)}
                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-md transition-all text-white/30 hover:text-red-400"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        
        {/* Top Header */}
        <header className="w-full flex flex-shrink-0 justify-between items-center px-4 sm:px-6 py-4 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <ShrutiAvatar />
            <div>
              <h1 className="text-sm font-bold tracking-wider uppercase">Shruti Advisor</h1>
              <p className="text-[10px] text-white/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
              </p>
            </div>
          </div>
          <button 
            onClick={async () => { await supabase.auth.signOut(); router.push('/'); }}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <LogOut className="w-3 h-3" /> <span className="hidden sm:inline">Sign Out</span>
          </button>
        </header>

        {/* Chat Area */}
        <div data-lenis-prevent className="flex-1 min-h-0 h-0 w-full overflow-y-auto scroll-smooth bg-transparent">
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-40 space-y-8">
          {messages.map((msg) => {
          
          // WELCOME MESSAGE
          if (msg.type === 'welcome') {
            return (
              <div key={msg.id} className="flex gap-4 items-start w-full animate-in fade-in slide-in-from-bottom-2">
                <ShrutiAvatar />
                <div className="flex-1 mt-1">
                  <p className="text-sm leading-relaxed text-white/90 max-w-[90%]">
                    {msg.messageText}
                  </p>
                </div>
              </div>
            )
          }

          // USER SUBMISSION
          if (msg.type === 'user_submission') {
            return (
              <div key={msg.id} className="flex gap-4 items-start flex-row-reverse w-full animate-in fade-in slide-in-from-bottom-2">
                <UserAvatar initial={msg.userInitial || 'U'} />
                <div className="flex flex-col items-end gap-2 max-w-[85%]">
                  <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tr-sm p-4 text-sm text-white/90 shadow-lg">
                    {msg.jd}
                  </div>
                  {msg.file && (
                    <div className="flex items-center gap-3 bg-[#111] border border-white/10 p-3 rounded-xl shadow-md cursor-default">
                      <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-medium text-white truncate max-w-[150px]">{msg.file.name}</p>
                        <p className="text-[10px] text-white/40">{(msg.file.size / 1024 / 1024).toFixed(2)} MB PDF Document</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          // SHRUTI TRACKING PIPELINE
          if (msg.type === 'shruti_tracking') {
            return (
              <div key={msg.id} className="flex gap-4 items-start w-full animate-in fade-in slide-in-from-bottom-2">
                <ShrutiAvatar />
                <div className="flex-1 mt-1">
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl max-w-sm">
                    <h4 className="text-xs font-mono text-white/40 mb-4 tracking-wider uppercase">Pipeline Engine</h4>
                    <div className="space-y-4">
                      {STEP_LABELS.map((step, idx) => {
                        const isCompleted = (msg.currentStep ?? 0) > idx || msg.status === 'completed'
                        const isActive = msg.currentStep === idx && msg.status !== 'completed' && msg.status !== 'failed'
                        const isPending = (msg.currentStep ?? 0) < idx && msg.status !== 'completed'
                        
                        return (
                          <div key={idx} className={`flex items-start gap-4 transition-all duration-300 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
                            <div className="relative">
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                              ) : isActive ? (
                                <div className="w-5 h-5 rounded-full border-2 border-dashed border-blue-400 animate-[spin_3s_linear_infinite] flex items-center justify-center">
                                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-white/20" />
                              )}
                              {idx !== STEP_LABELS.length - 1 && (
                                <div className={`absolute left-1/2 top-5 w-[1px] h-4 -translate-x-1/2 ${isCompleted ? 'bg-green-400/50' : 'bg-white/10'}`} />
                              )}
                            </div>
                            <div className="flex-1 pb-0">
                              <p className={`text-sm ${isCompleted ? 'text-white' : isActive ? 'text-blue-400 font-medium' : 'text-white/50'}`}>
                                {step}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          // SHRUTI RESULT BREAKDOWN
          if (msg.type === 'shruti_result') {
            const data = msg.analysisData || {}
            const atsScore = data.ats_score ?? 0
            const deepAnalysis = data.deep_analysis || {}
            const skillAnalysis = data.skill_analysis || {}
            const bulletRewrites = data.bullet_rewrites || []
            const keywordAnalysis = data.keyword_analysis || {}
            const densityAnalysis = data.density_analysis || {}
            const processingMs = data.processing_time_ms || 0

            // Combine missing keywords from both keyword_analysis and skill_analysis
            const missingCritical = skillAnalysis.missing_critical || []
            const missingOptional = skillAnalysis.missing_optional || []
            const exactMatches = skillAnalysis.exact_matches || []
            const synonymMatches = skillAnalysis.synonym_matches || []
            const implicitSkills = skillAnalysis.implicit_skills || []
            const skillRecommendations = skillAnalysis.recommendations || []

            return (
              <div key={msg.id} className="flex gap-4 items-start w-full animate-in fade-in slide-in-from-bottom-2">
                <ShrutiAvatar />
                <div className="flex-1 mt-1 space-y-4 max-w-2xl">
                  <p className="text-sm leading-relaxed text-white">
                    Hey <span className="font-semibold text-blue-400">{msg.userName}</span>, I have analyzed your resume. Here is the breakdown:
                  </p>
                  
                  {/* ─── Black Box Report ─── */}
                  <div className="bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    
                    {/* Report Header */}
                    <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <Hexagon className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-mono text-white/50 uppercase tracking-widest">ResuMax AI Report</span>
                      </div>
                      <span className="text-[10px] text-white/30 font-mono">{(processingMs / 1000).toFixed(1)}s</span>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      
                      {/* ─── ATS Score Ring ─── */}
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center relative flex-shrink-0">
                          <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth="5" />
                            <circle cx="40" cy="40" r="34" fill="none"
                              className="transition-all duration-1000 ease-out"
                              stroke={atsScore >= 80 ? '#22c55e' : atsScore >= 60 ? '#eab308' : '#ef4444'}
                              strokeWidth="5" strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 34}`}
                              strokeDashoffset={`${2 * Math.PI * 34 * (1 - atsScore / 100)}`}
                            />
                          </svg>
                          <span className={`text-2xl font-bold font-mono relative z-10 ${atsScore >= 80 ? 'text-green-400' : atsScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{atsScore}</span>
                          <span className="text-[8px] text-white/40 font-bold uppercase tracking-wider relative z-10">ATS</span>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <h4 className="text-sm font-semibold text-white">Overall Match</h4>
                          <p className="text-xs text-white/50 leading-relaxed">
                            {deepAnalysis.overall_assessment || data.ats_breakdown?.overall_feedback || `Your resume scored ${atsScore}/100 against the target job description.`}
                          </p>
                          {deepAnalysis.experience_level_match && (
                            <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-mono mt-1 ${
                              deepAnalysis.experience_level_match === 'match' ? 'bg-green-500/15 text-green-400 border border-green-500/20' :
                              deepAnalysis.experience_level_match === 'over-qualified' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' :
                              'bg-red-500/15 text-red-400 border border-red-500/20'
                            }`}>
                              {deepAnalysis.experience_level_match === 'match' ? '✓ Experience Level Match' :
                               deepAnalysis.experience_level_match === 'over-qualified' ? '↑ Over-qualified' : '↓ Under-qualified'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                      {/* ─── Strengths ─── */}
                      {deepAnalysis.strengths && deepAnalysis.strengths.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-green-400/80 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" /> Your Strengths
                          </h4>
                          <div className="space-y-2">
                            {deepAnalysis.strengths.map((s: string, i: number) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-white/70">
                                <span className="text-green-500 mt-0.5">+</span>
                                <span>{s}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ─── Weaknesses ─── */}
                      {deepAnalysis.weaknesses && deepAnalysis.weaknesses.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-red-400/80 mb-3 flex items-center gap-2">
                            <ChevronRight className="w-3 h-3" /> Areas to Improve
                          </h4>
                          <div className="space-y-2">
                            {deepAnalysis.weaknesses.map((w: string, i: number) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-white/70">
                                <span className="text-red-400 mt-0.5">−</span>
                                <span>{w}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(deepAnalysis.strengths?.length > 0 || deepAnalysis.weaknesses?.length > 0) && (
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      )}

                      {/* ─── Skill Matches ─── */}
                      {exactMatches.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-white/70 mb-3">Matched Skills</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {exactMatches.map((s: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-300 text-[10px] rounded-md font-mono">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ─── Missing Critical Skills ─── */}
                      {missingCritical.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-red-400/80 mb-3 flex items-center gap-2">
                            <ChevronRight className="w-3 h-3" /> Missing Critical Skills
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {missingCritical.map((kw: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-300 text-[10px] rounded-md font-mono">{kw}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ─── Implicit Skills ─── */}
                      {implicitSkills.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-blue-400/80 mb-3">Implicit Skills Detected</h4>
                          <div className="space-y-2">
                            {implicitSkills.slice(0, 4).map((item: any, i: number) => (
                              <div key={i} className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3">
                                <p className="text-xs font-medium text-blue-300">{item.skill || item}</p>
                                {item.evidence && <p className="text-[10px] text-white/40 mt-1">{item.evidence}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(exactMatches.length > 0 || missingCritical.length > 0) && (
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      )}

                      {/* ─── STAR Bullet Rewrites ─── */}
                      {bulletRewrites.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-white/70 mb-3 flex items-center gap-2">
                            <Settings className="w-3 h-3" /> STAR Bullet Rewrites ({bulletRewrites.length})
                          </h4>
                          <div className="space-y-3">
                            {bulletRewrites.slice(0, 3).map((rw: any, i: number) => (
                              <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 space-y-2">
                                <div className="flex items-center gap-2 text-[10px] text-white/30 font-mono">
                                  <span>{rw.company || 'Experience'}</span>
                                  {rw.confidence && <span className="ml-auto text-blue-400">{Math.round(rw.confidence * 100)}% conf</span>}
                                </div>
                                <div className="text-xs text-white/40 line-through">{rw.original}</div>
                                <div className="text-xs text-white/90 leading-relaxed">{rw.rewritten}</div>
                                {rw.keywords_added && rw.keywords_added.length > 0 && (
                                  <div className="flex gap-1 mt-1">
                                    {rw.keywords_added.map((kw: string, j: number) => (
                                      <span key={j} className="px-1.5 py-0.5 bg-blue-500/10 text-blue-300 text-[9px] rounded font-mono">+{kw}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                            {bulletRewrites.length > 3 && (
                              <p className="text-[10px] text-white/30 text-center font-mono">+ {bulletRewrites.length - 3} more rewrites available</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ─── Gap Analysis ─── */}
                      {deepAnalysis.gap_analysis && deepAnalysis.gap_analysis.length > 0 && (
                        <>
                          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          <div>
                            <h4 className="text-xs font-medium text-yellow-400/80 mb-3">Gap Analysis</h4>
                            <div className="space-y-2">
                              {deepAnalysis.gap_analysis.map((gap: any, i: number) => (
                                <div key={i} className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3">
                                  <p className="text-xs font-medium text-yellow-300">{gap.area}</p>
                                  <p className="text-[10px] text-white/50 mt-1">{gap.gap_description}</p>
                                  {gap.suggestion && <p className="text-[10px] text-green-400/70 mt-1.5">💡 {gap.suggestion}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* ─── Recommendations ─── */}
                      {skillRecommendations.length > 0 && (
                        <>
                          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          <div>
                            <h4 className="text-xs font-medium text-white/70 mb-3">💡 Shruti's Recommendations</h4>
                            <div className="space-y-2">
                              {skillRecommendations.map((rec: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-white/60">
                                  <span className="text-blue-400 mt-0.5 font-bold">{i + 1}.</span>
                                  <span>{rec}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                    </div>

                    {/* ─── Card Footer / Actions ─── */}
                    <div className="bg-[#050505] p-4 border-t border-white/5 flex justify-end">
                      <Button
                        onClick={async () => {
                          try {
                            const { data: { session } } = await supabase.auth.getSession()
                            if (!session) return

                            // Prepare API call
                            const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/analysis/${data.id}/download`
                            
                            // Fetch raw bytes
                            const response = await fetch(url, {
                              headers: { 'Authorization': `Bearer ${session.access_token}` }
                            })
                            if (!response.ok) throw new Error("Failed to download")

                            // Convert to Blob and download
                            const blob = await response.blob()
                            const downloadUrl = window.URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = downloadUrl
                            a.download = `Optimized_Resume_${data.id.slice(0, 4)}.docx`
                            document.body.appendChild(a)
                            a.click()
                            a.remove()
                            window.URL.revokeObjectURL(downloadUrl)

                          } catch (e) {
                            console.error("Export failed:", e)
                            alert("Failed to export DOCX. Please ensure the backend is running.")
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2 transition-all"
                      >
                        <Download className="w-4 h-4" /> Export Optimized DOCX
                      </Button>
                    </div>

                  </div>
                </div>
              </div>
            )
          }

          return null
        })}
        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Pinned Input Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pt-12 pb-6 px-4 z-20 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          
          {/* File pill if selected */}
          {file && (
            <div className="mb-3 ml-2 flex items-center gap-2 bg-white/10 border border-white/10 w-fit px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-bottom-2 shadow-lg backdrop-blur-md">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-white max-w-[100px] truncate">{file.name}</span>
              <button onClick={() => setFile(null)} className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors">
                <X className="w-3 h-3 text-white/60" />
              </button>
            </div>
          )}

          <div className="relative bg-[#111] border border-white/10 focus-within:border-white/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors">
            
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here..."
              className="w-full bg-transparent text-sm text-white placeholder:text-white/30 resize-none p-4 min-h-[60px] max-h-[150px] outline-none"
              rows={jobDescription.split('\n').length > 2 ? 3 : 1}
            />
            
            <div className="flex items-center justify-between px-3 pb-3">
              <div className="flex gap-2">
                <input 
                  type="file" 
                  accept=".pdf,.docx,.txt" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>

              <Button 
                onClick={startAnalysis}
                disabled={isSubmitting || !jobDescription.trim()}
                size="icon"
                className="w-9 h-9 rounded-xl bg-white hover:bg-gray-200 text-black shadow-lg disabled:opacity-50 transition-all disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-0.5" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="text-center mt-3">
            <p className="text-[10px] text-white/30">ResuMax AI can make mistakes. Verify critical information.</p>
          </div>
        </div>
      </div>

    </div>
  </div>
  )
}
