'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  Loader2, Hexagon, Send, Paperclip, FileText, X, Mic, Square,
  Volume2, VolumeX, ArrowLeft, Briefcase, MicOff, Radio
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const ShrutiAvatar = ({ large }: { large?: boolean }) => (
  <div className={`${large ? 'w-12 h-12' : 'w-8 h-8'} rounded-xl overflow-hidden border-2 border-white/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
    <img src="/shruti.png" alt="Shruti" className="w-full h-full object-cover" />
  </div>
)

const UserAvatar = ({ initial }: { initial: string }) => (
  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center flex-shrink-0">
    <span className="text-blue-400 text-sm font-semibold uppercase">{initial}</span>
  </div>
)

interface InterviewMessage {
  id: string
  role: 'interviewer' | 'candidate'
  content: string
}

export default function MockInterviewPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  // Interview state
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [messages, setMessages] = useState<InterviewMessage[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [questionNumber, setQuestionNumber] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Input
  const [inputText, setInputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Resume context
  const [resumeContext, setResumeContext] = useState('')
  const [resumeFileName, setResumeFileName] = useState('')
  const [jobRole, setJobRole] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resumeContextRef = useRef('')

  // Voice
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Keep ref in sync
  useEffect(() => { resumeContextRef.current = resumeContext }, [resumeContext])

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => { scrollToBottom() }, [messages])

  // Auth
  useEffect(() => {
    let mounted = true
    const check = async () => {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!mounted) return
      if (!session) { router.replace('/'); return }
      setUser(session.user)
      setLoadingUser(false)
    }
    check()
    return () => { mounted = false }
  }, [router])

  // Speech Recognition
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
        if (result.isFinal) final += result[0].transcript
        else interim += result[0].transcript
      }
      setTranscript(interim || final)
      if (final) {
        setTranscript('')
        handleSendAnswer(final.trim())
        recognition.stop()
        setIsListening(false)
      }
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // TTS Playback
  const playAudio = useCallback((audioBase64: string) => {
    if (!ttsEnabled) return
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`)
    audioRef.current = audio
    audio.onplay = () => setIsSpeaking(true)
    audio.onended = () => setIsSpeaking(false)
    audio.onerror = () => setIsSpeaking(false)
    audio.play().catch(() => setIsSpeaking(false))
  }, [ttsEnabled])

  const stopSpeaking = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    setIsSpeaking(false)
  }

  // File upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const selectedFile = e.target.files[0]
    setResumeFileName(selectedFile.name)

    if (selectedFile.type === 'text/plain') {
      const text = await selectedFile.text()
      setResumeContext(text.slice(0, 5000))
    } else {
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
          if (data.text) setResumeContext(data.text.slice(0, 5000))
        }
      } catch (err) { console.error('File parse error:', err) }
    }
  }

  // Start interview
  const startInterview = async () => {
    if (!resumeContext) return alert('Please upload your resume first.')
    setIsStarting(true)

    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/mock-interview/start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_context: resumeContext,
          job_role: jobRole,
        }),
      })

      if (!res.ok) throw new Error('Failed to start interview')
      const data = await res.json()

      setMessages([{
        id: Date.now().toString(),
        role: 'interviewer',
        content: data.message,
      }])
      setInterviewStarted(true)
      setQuestionNumber(1)

      if (data.audio) playAudio(data.audio)
    } catch (err) {
      console.error('Start interview error:', err)
      alert('Failed to start interview. Please try again.')
    } finally {
      setIsStarting(false)
    }
  }

  // Send answer
  const handleSendAnswer = async (text?: string) => {
    const answer = text || inputText.trim()
    if (!answer || isProcessing || isComplete) return

    const initial = (user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()

    const candidateMsg: InterviewMessage = {
      id: Date.now().toString(),
      role: 'candidate',
      content: answer,
    }

    const updatedMessages = [...messages, candidateMsg]
    setMessages(updatedMessages)
    setInputText('')
    setIsProcessing(true)

    try {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) return

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/mock-interview/respond`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_context: resumeContextRef.current,
          job_role: jobRole,
          answer: answer,
          conversation_history: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!res.ok) throw new Error('Failed to get response')
      const data = await res.json()

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'interviewer',
        content: data.message,
      }])

      if (data.question_number) setQuestionNumber(data.question_number)
      if (data.is_complete) setIsComplete(true)
      if (data.audio) playAudio(data.audio)
    } catch (err) {
      console.error('Interview respond error:', err)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'interviewer',
        content: "I apologize, there was a technical issue. Could you repeat your answer?",
      }])
    } finally {
      setIsProcessing(false)
    }
  }

  // Mic toggle
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
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // ─── PRE-INTERVIEW SETUP SCREEN ───
  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
          <button onClick={() => router.push('/dashboard')} className="p-2 -ml-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <ShrutiAvatar />
          <div>
            <h1 className="text-sm font-bold tracking-wider uppercase">Mock Interview</h1>
            <p className="text-[10px] text-white/50 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Shruti is ready to interview you
            </p>
          </div>
        </header>

        {/* Setup */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md space-y-8">
            {/* Hero */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(74,158,255,0.15)]">
                <Briefcase className="w-10 h-10 text-white/70" />
              </div>
              <h2 className="text-2xl font-bold">Prepare for Your Interview</h2>
              <p className="text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
                Upload your resume and Shruti will conduct a realistic mock interview with AI-powered feedback on every answer.
              </p>
            </div>

            {/* Upload + Role */}
            <div className="space-y-4">
              {/* Resume Upload */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-wider">Resume *</label>
                <input type="file" accept=".pdf,.docx,.txt" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl border transition-all cursor-pointer ${
                    resumeContext
                      ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10'
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${resumeContext ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className={`text-sm font-medium ${resumeContext ? 'text-green-400' : 'text-white/70'}`}>
                      {resumeFileName || 'Upload your resume'}
                    </p>
                    <p className="text-[10px] text-white/30">{resumeContext ? 'Resume loaded successfully' : 'PDF, DOCX, or TXT'}</p>
                  </div>
                  {resumeContext && (
                    <button onClick={(e) => { e.stopPropagation(); setResumeContext(''); setResumeFileName('') }} className="p-1 rounded-full hover:bg-white/10">
                      <X className="w-4 h-4 text-white/30" />
                    </button>
                  )}
                </div>
              </div>

              {/* Job Role */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-white/40 uppercase tracking-wider">Target Role (optional)</label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Frontend Developer, Data Scientist..."
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
                />
              </div>

              {/* Start Button */}
              <button
                onClick={startInterview}
                disabled={!resumeContext || isStarting}
                className="w-full py-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-white to-gray-300 text-black hover:from-gray-100 hover:to-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
              >
                {isStarting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Starting Interview...</>
                ) : (
                  <><Radio className="w-4 h-4" /> Begin Mock Interview</>
                )}
              </button>

              <p className="text-center text-[10px] text-white/20">
                Shruti will ask ~10 questions based on your resume and provide real-time feedback
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── LIVE INTERVIEW SCREEN ───
  const userInitial = (user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()

  return (
    <div className="flex flex-col h-[100dvh] bg-[#050505] text-white overflow-hidden">

      {/* Header */}
      <header className="flex-shrink-0 flex justify-between items-center px-4 sm:px-6 py-4 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="p-2 -ml-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <ShrutiAvatar />
          <div>
            <h1 className="text-sm font-bold tracking-wider uppercase">Mock Interview</h1>
            <p className="text-[10px] text-white/50 flex items-center gap-1">
              {isComplete ? (
                <><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Interview Complete</>
              ) : (
                <><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 font-mono">LIVE</span> — Question {questionNumber}/10
                  {jobRole && <span className="text-white/30 ml-1">• {jobRole}</span>}
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* TTS toggle */}
          <button
            onClick={() => { if (isSpeaking) stopSpeaking(); setTtsEnabled(!ttsEnabled) }}
            className={`p-2 rounded-lg transition-colors ${ttsEnabled ? 'bg-[#4a9eff]/10 text-[#4a9eff]' : 'bg-white/5 text-white/30'}`}
            title={ttsEnabled ? 'Mute voice' : 'Enable voice'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Progress indicator */}
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${
                i < questionNumber ? 'bg-green-400' : 'bg-white/10'
              }`} />
            ))}
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto scroll-smooth bg-transparent">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-52 space-y-6">
          {messages.map((msg) => {
            if (msg.role === 'interviewer') {
              return (
                <div key={msg.id} className="flex gap-4 items-start w-full animate-in fade-in slide-in-from-bottom-2">
                  <ShrutiAvatar />
                  <div className="flex-1 mt-1">
                    <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-white/85 leading-relaxed max-w-[90%]">
                      {msg.content}
                    </div>
                  </div>
                </div>
              )
            } else {
              return (
                <div key={msg.id} className="flex gap-4 items-start flex-row-reverse w-full animate-in fade-in slide-in-from-bottom-2">
                  <UserAvatar initial={userInitial} />
                  <div className="max-w-[80%] bg-[#4a9eff]/10 border border-[#4a9eff]/20 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white/90">
                    {msg.content}
                  </div>
                </div>
              )
            }
          })}

          {/* Processing dots */}
          {isProcessing && (
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
              <UserAvatar initial={userInitial} />
              <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm bg-[#4a9eff]/5 border border-[#4a9eff]/10 text-white/50 text-sm italic">
                {transcript}...
              </div>
            </div>
          )}

          {/* Interview complete banner */}
          {isComplete && (
            <div className="text-center py-8 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-green-400">Interview Complete!</h3>
              <p className="text-sm text-white/50 max-w-sm mx-auto">Scroll up to review Shruti&apos;s feedback and scoring.</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setMessages([])
                    setIsComplete(false)
                    setQuestionNumber(0)
                    setInterviewStarted(false)
                  }}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Input Bar */}
      {!isComplete && (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pt-12 pb-6 px-4 z-20 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <div className="relative bg-[#111] border border-white/10 focus-within:border-white/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendAnswer()
                  }
                }}
                placeholder="Type your answer..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/30 resize-none p-4 min-h-[60px] max-h-[150px] outline-none"
                rows={1}
              />

              <div className="flex items-center justify-between px-3 pb-3">
                <div className="text-[10px] text-white/20 font-mono">
                  {isSpeaking ? '🔊 Shruti is speaking...' : isListening ? '🎙️ Listening...' : 'Press Enter to send or use mic'}
                </div>

                <div className="flex items-center gap-2">
                  {/* Mic */}
                  <button
                    onClick={toggleListening}
                    disabled={isProcessing}
                    className={`p-2 rounded-xl transition-all ${
                      isListening
                        ? 'bg-red-500/20 text-red-400 animate-pulse'
                        : isSpeaking
                          ? 'bg-green-500/20 text-green-400'
                          : 'text-white/50 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {isListening ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
                  </button>

                  {/* Send */}
                  <Button
                    onClick={() => handleSendAnswer()}
                    disabled={isProcessing || !inputText.trim()}
                    size="icon"
                    className="w-9 h-9 rounded-xl bg-white hover:bg-gray-200 text-black shadow-lg disabled:opacity-50 transition-all disabled:cursor-not-allowed"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-0.5" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center mt-3">
              <p className="text-[10px] text-white/30">
                {isListening ? 'Listening... tap mic to stop' : 'Shruti will provide feedback after each answer'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
