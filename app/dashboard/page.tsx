'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  FileText, CheckCircle2, Loader2, Download, Menu, Plus, MessageSquare, Clock, Trash2,
  Settings, X, Send, Paperclip, Hexagon, LogOut, ChevronRight, PenLine, Linkedin, Mic,
  Volume2, VolumeX, Square, MicOff, Github, History, Sparkles, Twitter, Radio, Grid
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'



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

type MessageType = 'welcome' | 'user_submission' | 'shruti_tracking' | 'shruti_result' | 'voice_user' | 'voice_assistant'

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
  <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-white/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
    <img src="/shruti.png" alt="Shruti" className="w-full h-full object-cover" />
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

  // Mode: 'analysis' (upload resume + JD) or 'chat' (talk to Shruti)
  const [chatMode, setChatMode] = useState<'analysis' | 'chat'>('analysis')

  // Voice/Chat State
  const [resumeContext, setResumeContext] = useState('')
  const [resumeFileName, setResumeFileName] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessingChat, setIsProcessingChat] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [transcript, setTranscript] = useState('')

  // Refs for voice
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const resumeContextRef = useRef('')
  const messagesRef = useRef<Message[]>([])

  // Keep refs in sync
  useEffect(() => { resumeContextRef.current = resumeContext }, [resumeContext])
  useEffect(() => { messagesRef.current = messages }, [messages])

  // History State
  const [history, setHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const fetchHistory = async () => {
    if (!user) return
    setLoadingHistory(true)
    try {
      const { data: { session } } = await getSupabase().auth.getSession()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadHistoricalAnalysis = async (aid: string) => {
    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/analysis/${aid}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      if (!res.ok) throw new Error("Failed to load past analysis")
      const analysisData = await res.json()

      const sessionName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

      const oldResumeText = analysisData.resume_text || 
        (analysisData.parsed_resume ? JSON.stringify(analysisData.parsed_resume) : "");
      if (oldResumeText) {
        setResumeContext(`Resume:\n${oldResumeText.slice(0, 4000)}\n\nJob Description:\n${(analysisData.job_description || "").slice(0, 1000)}`);
      }

      setMessages([
        {
          id: Date.now().toString(),
          type: 'shruti_result',
          analysisId: aid,
          analysisData,
          userName: sessionName
        }
      ])

      if (window.innerWidth < 768) setSidebarOpen(false)
    } catch(e) {
      console.error("Error loading historical analysis", e)
      alert("Failed to load historical analysis")
    }
  }

  const deleteAnalysis = async (aid: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this analysis?')) return

    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/analysis/${aid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })

      if (!res.ok) throw new Error("Failed to delete analysis")
      setHistory(prev => prev.filter(h => h.id !== aid))
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
      const { data: { session } } = await getSupabase().auth.getSession()
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
            messageText: `Welcome back, ${name.split('@')[0]}. I am Shruti, your AI Advisor. Upload your resume and paste a job description to analyze — or switch to Chat mode to talk with me about your career.`
          }
        ])
      }
      setLoadingUser(false)
    }

    checkSession()

    const { data: { subscription } } = getSupabase().auth.onAuthStateChange((event, session) => {
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
        const { data: { session } } = await getSupabase().auth.getSession()
        if (!session) return

        const resStatus = await fetch(`${apiUrl}/api/analysis/${aid}/status`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
        if (!resStatus.ok) {
          // Mark as failed so polling stops
          setMessages(prev => prev.map(m => m.id === activeTrackingMsg.id ? { ...m, status: 'failed' } : m))
          return
        }
        const dataStatus = await resStatus.json()

        if (dataStatus.status === 'completed') {
          const resFull = await fetch(`${apiUrl}/api/analysis/${aid}`, {
            headers: { 'Authorization': `Bearer ${session.access_token}` }
          })
          const analysisData = await resFull.json()

          setMessages(prev => {
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

  // ─── Speech Recognition Setup ───
  useEffect(() => {
    if (typeof window === 'undefined') return
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      let final = ''
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }
      setTranscript(interim || final)
      if (final) {
        setTranscript('')
        sendChatMessage(final.trim())
        recognition.stop()
        setIsListening(false)
      }
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── TTS Playback ───
  const playAudio = useCallback((audioBase64: string) => {
    if (!ttsEnabled) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`)
    audioRef.current = audio
    audio.onplay = () => setIsSpeaking(true)
    audio.onended = () => setIsSpeaking(false)
    audio.onerror = () => setIsSpeaking(false)
    audio.play().catch(() => setIsSpeaking(false))
  }, [ttsEnabled])

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsSpeaking(false)
  }

  // ─── Send Chat Message (voice/chat mode) ───
  const sendChatMessage = useCallback(async (text: string) => {
    if (!text.trim()) return

    const initial = (user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'voice_user',
      messageText: text.trim(),
      userInitial: initial,
    }

    setMessages(prev => [...prev, userMsg])
    setIsProcessingChat(true)

    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return

      const currentResumeContext = resumeContextRef.current
      const currentMessages = messagesRef.current

      // Build conversation history from voice messages only
      const voiceHistory = currentMessages
        .filter(m => m.type === 'voice_user' || m.type === 'voice_assistant')
        .concat(userMsg)
        .slice(-10)
        .map(m => ({
          role: m.type === 'voice_user' ? 'user' : 'assistant',
          content: m.messageText || ''
        }))

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/voice-chat/ask`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: text.trim(),
          resume_context: currentResumeContext,
          conversation_history: voiceHistory,
        }),
      })

      if (!res.ok) throw new Error('Failed to get response')
      const data = await res.json()

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'voice_assistant',
        messageText: data.answer,
      }

      setMessages(prev => [...prev, aiMsg])
      if (data.audio) {
        playAudio(data.audio)
      }
    } catch (err) {
      console.error('Voice chat error:', err)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'voice_assistant',
        messageText: "Sorry, I couldn't process that. Could you try again?",
      }])
    } finally {
      setIsProcessingChat(false)
    }
  }, [playAudio, user])

  // ─── File Upload Handler (parse for voice context) ───
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setResumeFileName(selectedFile.name)

    // Parse file for voice chat context
    if (selectedFile.type === 'text/plain') {
      const text = await selectedFile.text()
      setResumeContext(text.slice(0, 5000))
    } else {
      // PDF/DOCX — send to backend to parse
      try {
        const { data: { session } } = await getSupabase().auth.getSession()
        if (!session) return

        const formData = new FormData()
        formData.append('resume', selectedFile)

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const res = await fetch(`${apiUrl}/api/voice-chat/parse-resume`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          if (data.text) {
            setResumeContext(data.text.slice(0, 5000))
          }
        }
      } catch (err) {
        console.error('File parse error:', err)
      }
    }
  }

  // ─── Mic Toggle ───
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Try Chrome.')
      return
    }
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setTranscript('')
    } else {
      stopSpeaking()
      setTranscript('')
      setChatMode('chat')
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const startAnalysis = async () => {
    if (!file) return alert('Please attach a resume file.')
    if (!jobDescription.trim()) return alert('Please enter a job description.')

    setIsSubmitting(true)

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
      const { data: { session } } = await getSupabase().auth.getSession()
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

      setFile(null)
      setJobDescription('')
      setResumeFileName('')

    } catch (err: any) {
      alert(err.message || 'An error occurred during submission.')
      setMessages(prev => prev.filter(m => m.id !== userMsgId))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSend = () => {
    if (chatMode === 'analysis') {
      startAnalysis()
    } else {
      if (jobDescription.trim()) {
        sendChatMessage(jobDescription.trim())
        setJobDescription('')
      }
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
          <button
            onClick={() => {
              const name = user?.user_metadata?.full_name || user?.email || 'Guest'
              setMessages([{
                id: Date.now().toString(),
                type: 'welcome',
                messageText: `Welcome back, ${name.split('@')[0]}. I am Shruti, your AI Advisor. Upload your resume and paste a job description to analyze — or switch to Chat mode to talk with me about your career.`
              }])
              setFile(null)
              setResumeContext('')
              setResumeFileName('')
              setChatMode('analysis')
              if (window.innerWidth < 768) setSidebarOpen(false)
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-xs text-white/90"
          >
            <Plus className="w-4 h-4" /> New Analysis
          </button>

          <Link
            href="/mock-interview"
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors text-xs text-red-400 hover:text-red-300"
          >
            <Radio className="w-4 h-4" /> Mock Interview
          </Link>

          <Link
            href="/career-timeline"
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors text-xs text-blue-400 hover:text-blue-300"
          >
            <History className="w-4 h-4" /> Career Timeline
          </Link>

          <Link
            href="/skill-gap"
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-colors text-xs text-purple-400 hover:text-purple-300"
          >
            <Grid className="w-4 h-4" /> Skill Gap Heatmap
          </Link>

          <Link
            href="/cold-outreach"
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-colors text-xs text-green-400 hover:text-green-300"
          >
            <Send className="w-4 h-4" /> Cold Outreach
          </Link>


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
          <div className="flex items-center gap-2">
            {/* TTS Toggle */}
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking()
                setTtsEnabled(!ttsEnabled)
              }}
              className={`p-2 rounded-lg transition-colors ${
                ttsEnabled ? 'bg-[#4a9eff]/10 text-[#4a9eff]' : 'bg-white/5 text-white/30'
              }`}
              title={ttsEnabled ? 'Mute voice' : 'Enable voice'}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={async () => { await getSupabase().auth.signOut(); router.push('/'); }}
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <LogOut className="w-3 h-3" /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div data-lenis-prevent className="flex-1 min-h-0 w-full overflow-y-auto scroll-smooth bg-transparent">
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-52 space-y-8">
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

          // USER SUBMISSION (analysis mode)
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
                        <p className="text-[10px] text-white/40">{(msg.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          // VOICE USER MESSAGE (chat mode)
          if (msg.type === 'voice_user') {
            return (
              <div key={msg.id} className="flex gap-4 items-start flex-row-reverse w-full animate-in fade-in slide-in-from-bottom-2">
                <UserAvatar initial={msg.userInitial || 'U'} />
                <div className="max-w-[80%] bg-[#4a9eff]/10 border border-[#4a9eff]/20 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white/90">
                  {msg.messageText}
                </div>
              </div>
            )
          }

          // VOICE ASSISTANT MESSAGE (chat mode)
          if (msg.type === 'voice_assistant') {
            const hasMarkdown = (msg.messageText || '').includes('#') || (msg.messageText || '').includes('**') || (msg.messageText || '').includes('- ')
            return (
              <div key={msg.id} className="flex gap-4 items-start w-full animate-in fade-in slide-in-from-bottom-2">
                <ShrutiAvatar />
                <div className={`bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-white/80 leading-relaxed ${hasMarkdown ? 'max-w-[90%] w-full' : 'max-w-[80%]'}`}>
                  {hasMarkdown ? (
                    <div className="prose prose-invert prose-sm max-w-none
                      [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-3 [&_h1]:mt-2
                      [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-blue-300 [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:pb-1 [&_h2]:border-b [&_h2]:border-white/10
                      [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-white/90 [&_h3]:mb-1 [&_h3]:mt-3
                      [&_strong]:text-white/95 [&_strong]:font-semibold
                      [&_ul]:space-y-1 [&_ul]:my-2 [&_ul]:pl-1
                      [&_ol]:space-y-1 [&_ol]:my-2
                      [&_li]:text-white/70 [&_li]:text-xs [&_li]:leading-relaxed
                      [&_p]:text-white/75 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:my-1.5
                      [&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2
                      [&_code]:text-[11px] [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-green-300
                      [&_hr]:border-white/10 [&_hr]:my-3
                    ">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.messageText || ''}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.messageText
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

                  <div className="bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

                    <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <Hexagon className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-mono text-white/50 uppercase tracking-widest">ResuMax AI Report</span>
                      </div>
                      <span className="text-[10px] text-white/30 font-mono">{(processingMs / 1000).toFixed(1)}s</span>
                    </div>

                    <div className="p-6 space-y-6">

                      {/* ATS Score Ring */}
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

                      {/* Strengths */}
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

                      {/* Weaknesses */}
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

                      {/* Skill Matches */}
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

                      {/* Missing Critical Skills */}
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

                      {/* Implicit Skills */}
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

                      {/* STAR Bullet Rewrites */}
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

                      {/* Gap Analysis */}
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

                      {/* Recommendations */}
                      {skillRecommendations.length > 0 && (
                        <>
                          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          <div>
                            <h4 className="text-xs font-medium text-white/70 mb-3">💡 Shruti&apos;s Recommendations</h4>
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

                    {/* Card Footer / Actions */}
                    <div className="bg-[#050505] p-4 border-t border-white/5 flex justify-end">
                      <Button
                        onClick={async () => {
                          try {
                            const { data: { session } } = await getSupabase().auth.getSession()
                            if (!session) return

                            const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/analysis/${data.id}/download`

                            const response = await fetch(url, {
                              headers: { 'Authorization': `Bearer ${session.access_token}` }
                            })
                            if (!response.ok) throw new Error("Failed to download")

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

        {/* Processing indicator for chat mode */}
        {isProcessingChat && (
          <div className="flex gap-4 items-start w-full animate-in fade-in slide-in-from-bottom-2">
            <ShrutiAvatar />
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.06]">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Live transcript */}
        {transcript && (
          <div className="flex gap-4 items-start flex-row-reverse w-full animate-in fade-in">
            <UserAvatar initial={(user?.user_metadata?.full_name?.charAt(0) || 'U').toUpperCase()} />
            <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm bg-[#4a9eff]/5 border border-[#4a9eff]/10 text-white/50 text-sm italic">
              {transcript}...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Pinned Input Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pt-12 pb-6 px-4 z-20 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">

          {/* Resume loaded indicator */}
          {resumeContext && (
            <div className="mb-3 ml-2 flex items-center gap-2 bg-green-500/5 border border-green-500/10 w-fit px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-bottom-2 shadow-lg backdrop-blur-md">
              <FileText className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs text-green-400/80 font-mono truncate max-w-[150px]">{resumeFileName} loaded</span>
              <button onClick={() => { setResumeContext(''); setResumeFileName(''); setFile(null) }} className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors">
                <X className="w-3 h-3 text-green-400/40" />
              </button>
            </div>
          )}

          {/* File pill (for analysis mode, when file selected but not yet parsed/shown as resume) */}
          {file && !resumeContext && (
            <div className="mb-3 ml-2 flex items-center gap-2 bg-white/10 border border-white/10 w-fit px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-bottom-2 shadow-lg backdrop-blur-md">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-white max-w-[100px] truncate">{file.name}</span>
              <button onClick={() => setFile(null)} className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors">
                <X className="w-3 h-3 text-white/60" />
              </button>
            </div>
          )}

          {/* Mode Toggle + Nav */}
          <div className="flex items-center gap-1 mb-3 ml-2 overflow-x-auto scrollbar-hide whitespace-nowrap pb-1">
            <button
              onClick={() => setChatMode('analysis')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-all flex-shrink-0 ${
                chatMode === 'analysis'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Analysis
            </button>
            <button
              onClick={() => setChatMode('chat')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-all flex items-center gap-1.5 flex-shrink-0 ${
                chatMode === 'chat'
                  ? 'bg-[#4a9eff]/10 text-[#4a9eff] border border-[#4a9eff]/20'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Mic className="w-3 h-3" /> Chat
            </button>
            <span className="w-px h-4 bg-white/10 mx-1 flex-shrink-0" />
            <Link href="/create" className="px-3 py-1.5 rounded-full text-[11px] font-mono flex items-center gap-1.5 text-white/40 hover:text-[#4a9eff] hover:bg-[#4a9eff]/10 flex-shrink-0">
              <PenLine className="w-3 h-3" /> Create
            </Link>
            <Link href="/linkedin-optimizer" className="px-3 py-1.5 rounded-full text-[11px] font-mono flex items-center gap-1.5 text-white/40 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 flex-shrink-0">
              <Linkedin className="w-3 h-3" /> LinkedIn
            </Link>
            <Link href="/github-enhancer" className="px-3 py-1.5 rounded-full text-[11px] font-mono flex items-center gap-1.5 text-white/40 hover:text-white hover:bg-white/10 flex-shrink-0">
              <Github className="w-3 h-3" /> GitHub
            </Link>
            <Link href="/social-post" className="px-3 py-1.5 rounded-full text-[11px] font-mono flex items-center gap-1.5 text-white/40 hover:text-[#a855f7] hover:bg-[#a855f7]/10 flex-shrink-0">
              <Sparkles className="w-3 h-3" /> Post Maker
            </Link>
            <Link href="/x-analyzer" className="px-3 py-1.5 rounded-full text-[11px] font-mono flex items-center gap-1.5 text-white/40 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 flex-shrink-0">
              <Twitter className="w-3 h-3" /> X Analyzer
            </Link>
            <Link href="/mock-interview" className="px-3 py-1.5 rounded-full text-[11px] font-mono flex items-center gap-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0">
              <Radio className="w-3 h-3" /> Interview
            </Link>
            <Link href="/history" className="px-3 py-1.5 rounded-full text-[11px] font-mono flex items-center gap-1.5 text-white/40 hover:text-[#eab308] hover:bg-[#eab308]/10 flex-shrink-0">
              <History className="w-3 h-3" /> History
            </Link>
          </div>

          <div className="relative bg-[#111] border border-white/10 focus-within:border-white/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors">

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && chatMode === 'chat') {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={chatMode === 'analysis' ? 'Paste the target job description here...' : 'Ask Shruti anything about your resume...'}
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

              <div className="flex items-center gap-2">
                {/* Mic Button */}
                <button
                  onClick={toggleListening}
                  disabled={isProcessingChat}
                  className={`p-2 rounded-xl transition-all ${
                    isListening
                      ? 'bg-red-500/20 text-red-400 animate-pulse'
                      : isSpeaking
                        ? 'bg-green-500/20 text-green-400'
                        : 'text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isListening ? (
                    <Square className="w-5 h-5 fill-current" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>

                {/* Send Button */}
                <Button
                  onClick={handleSend}
                  disabled={
                    isSubmitting || isProcessingChat ||
                    (chatMode === 'analysis' ? !jobDescription.trim() : !jobDescription.trim())
                  }
                  size="icon"
                  className="w-9 h-9 rounded-xl bg-white hover:bg-gray-200 text-black shadow-lg disabled:opacity-50 transition-all disabled:cursor-not-allowed"
                >
                  {(isSubmitting || isProcessingChat) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-0.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-3">
            <p className="text-[10px] text-white/30">
              {isListening ? 'Listening... tap mic to stop' : isSpeaking ? 'Shruti is speaking...' : 'ResuMax AI can make mistakes. Verify critical information.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
  )
}
