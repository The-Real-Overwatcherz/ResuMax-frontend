'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from '@/lib/gsap-config'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  Upload,
  FileText,
  Hexagon,
  X,
  Square,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export default function VoiceChatPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

  const [authChecked, setAuthChecked] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [transcript, setTranscript] = useState('')
  const [resumeContext, setResumeContext] = useState('')
  const [resumeFileName, setResumeFileName] = useState('')
  const [pulseScale, setPulseScale] = useState(1)
  const [textInput, setTextInput] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setAuthChecked(true)
        const name = session.user.user_metadata?.full_name || 'there'
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: `Hey ${name.split(' ')[0]}! I'm Shruti, your AI resume advisor. Upload your resume or paste it, then ask me anything — I'll help you improve it. You can use the mic or type.`,
            timestamp: Date.now(),
          },
        ])
      }
    })
  }, [router])

  // Entry animation
  useEffect(() => {
    if (!authChecked || !containerRef.current) return
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
    )
  }, [authChecked])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
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
        sendMessage(final.trim())
        recognition.stop()
        setIsListening(false)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const speak = useCallback(
    (text: string) => {
      if (!ttsEnabled || typeof window === 'undefined') return
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.05
      utterance.pitch = 1.0

      // Try to pick a natural voice
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(
        (v) =>
          v.name.includes('Samantha') ||
          v.name.includes('Google') ||
          v.name.includes('Natural') ||
          v.name.includes('Female'),
      )
      if (preferred) utterance.voice = preferred

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      synthRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [ttsEnabled],
  )

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isProcessing) return

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: text.trim(),
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, userMsg])
      setIsProcessing(true)

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) return

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const res = await fetch(`${apiUrl}/api/voice-chat/ask`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: text.trim(),
            resume_context: resumeContext,
            conversation_history: messages
              .concat(userMsg)
              .slice(-10)
              .map((m) => ({ role: m.role, content: m.content })),
          }),
        })

        if (!res.ok) throw new Error('Failed to get response')
        const data = await res.json()

        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.answer,
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, aiMsg])
        speak(data.answer)
      } catch (err) {
        console.error('Voice chat error:', err)
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Sorry, I couldn't process that. Could you try again?",
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, errorMsg])
      } finally {
        setIsProcessing(false)
      }
    },
    [isProcessing, resumeContext, messages, speak],
  )

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setResumeFileName(file.name)

    if (file.type === 'text/plain') {
      const text = await file.text()
      setResumeContext(text)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I've loaded your resume "${file.name}". Go ahead and ask me anything about it — how to improve it, what's strong, what's weak, or how it matches a specific job.`,
          timestamp: Date.now(),
        },
      ])
    } else {
      // For PDF/DOCX, send to backend to parse
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) return

        const formData = new FormData()
        formData.append('resume', file)
        formData.append('job_description', 'General review')

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        // Use the analysis start just to parse, or just read as text
        // For simplicity, read as text if possible
        const reader = new FileReader()
        reader.onload = (ev) => {
          const text = ev.target?.result as string
          if (text) {
            setResumeContext(text.slice(0, 5000))
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                role: 'assistant',
                content: `I've loaded your resume "${file.name}". Ask me anything about it!`,
                timestamp: Date.now(),
              },
            ])
          }
        }
        reader.readAsText(file)
      } catch (err) {
        console.error('File upload error:', err)
      }
    }
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (textInput.trim()) {
      sendMessage(textInput.trim())
      setTextInput('')
    }
  }

  // Mic pulse animation
  useEffect(() => {
    if (!isListening) {
      setPulseScale(1)
      return
    }
    const interval = setInterval(() => {
      setPulseScale(1 + Math.random() * 0.3)
    }, 150)
    return () => clearInterval(interval)
  }, [isListening])

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4a9eff] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      <div ref={containerRef} className="flex-1 flex flex-col max-w-3xl mx-auto w-full opacity-0">
        {/* Header */}
        <div className="flex-shrink-0 px-4 sm:px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-white/40 hover:text-white text-sm font-mono transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-white/20">/</span>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#4a9eff]/10">
                  <Mic className="w-4 h-4 text-[#4a9eff]" />
                </div>
                <h1 className="text-lg font-semibold text-white tracking-tight">
                  Voice Chat
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* TTS toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking()
                  setTtsEnabled(!ttsEnabled)
                }}
                className={`p-2 rounded-xl transition-colors ${
                  ttsEnabled
                    ? 'bg-[#4a9eff]/10 text-[#4a9eff]'
                    : 'bg-white/5 text-white/30'
                }`}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Upload resume */}
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                {resumeFileName || 'Upload Resume'}
              </button>
            </div>
          </div>
        </div>

        {/* Resume context indicator */}
        {resumeContext && (
          <div className="mx-4 sm:mx-6 mb-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/5 border border-green-500/10">
            <FileText className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-green-400/80 font-mono flex-1 truncate">
              {resumeFileName} loaded
            </span>
            <button
              onClick={() => {
                setResumeContext('')
                setResumeFileName('')
              }}
              className="text-green-400/40 hover:text-green-400"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-6 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              {msg.role === 'assistant' ? (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white to-gray-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                  <Hexagon className="w-5 h-5 text-black fill-current" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#4a9eff]/20 border border-[#4a9eff]/50 flex items-center justify-center flex-shrink-0">
                  <Mic className="w-4 h-4 text-[#4a9eff]" />
                </div>
              )}

              {/* Bubble */}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#4a9eff]/10 border border-[#4a9eff]/20 text-white/90 rounded-tr-sm'
                    : 'bg-white/[0.04] border border-white/[0.06] text-white/80 rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white to-gray-400 flex items-center justify-center flex-shrink-0">
                <Hexagon className="w-5 h-5 text-black fill-current" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live transcript */}
          {transcript && (
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-9 h-9 rounded-full bg-[#4a9eff]/20 border border-[#4a9eff]/50 flex items-center justify-center flex-shrink-0">
                <Mic className="w-4 h-4 text-[#4a9eff] animate-pulse" />
              </div>
              <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm bg-[#4a9eff]/5 border border-[#4a9eff]/10 text-white/50 text-sm italic">
                {transcript}...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="flex-shrink-0 px-4 sm:px-6 pb-6 pt-3 border-t border-white/5">
          {/* Text input */}
          <form onSubmit={handleTextSubmit} className="flex gap-3 mb-4">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type a question or use the mic..."
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4a9eff]/50 focus:ring-1 focus:ring-[#4a9eff]/50 transition-all"
              disabled={isProcessing}
            />
            <Button
              type="submit"
              disabled={!textInput.trim() || isProcessing}
              className="bg-[#4a9eff] hover:bg-[#4a9eff]/80 text-white rounded-xl px-4 disabled:opacity-50"
            >
              Send
            </Button>
          </form>

          {/* Mic button */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={toggleListening}
              disabled={isProcessing}
              className="relative disabled:opacity-50"
            >
              {/* Pulse rings */}
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                  <div
                    className="absolute -inset-3 rounded-full bg-red-500/10 transition-transform duration-150"
                    style={{ transform: `scale(${pulseScale})` }}
                  />
                </>
              )}

              <div
                className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                    : isSpeaking
                      ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                      : 'bg-[#4a9eff] shadow-[0_0_20px_rgba(74,158,255,0.3)] hover:shadow-[0_0_30px_rgba(74,158,255,0.5)]'
                }`}
              >
                {isListening ? (
                  <Square className="w-6 h-6 text-white fill-white" />
                ) : isSpeaking ? (
                  <Volume2 className="w-7 h-7 text-white" />
                ) : (
                  <Mic className="w-7 h-7 text-white" />
                )}
              </div>
            </button>

            <p className="text-xs text-white/30 font-mono">
              {isListening
                ? 'Listening... tap to stop'
                : isSpeaking
                  ? 'Shruti is speaking...'
                  : isProcessing
                    ? 'Thinking...'
                    : 'Tap to speak'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
