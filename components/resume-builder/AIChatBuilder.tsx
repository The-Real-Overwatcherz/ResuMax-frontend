'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { gsap } from '@/lib/gsap-config'
import type { useResumeBuilder } from '@/hooks/useResumeBuilder'
import { ScrollArea } from '@/components/ui/scroll-area'

type BuilderHook = ReturnType<typeof useResumeBuilder>

interface AIChatBuilderProps extends BuilderHook { }

export function AIChatBuilder(props: AIChatBuilderProps) {
  const { resumeData, setResumeData, setIsDirty } = props
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Resume Assistant. Let's start building your ATS-optimized resume. What is your full name and what role are you applying for?"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const userText = input.trim()
    setInput('')
    
    const newMessages = [...messages, { role: 'user' as const, content: userText }]
    setMessages(newMessages)
    setIsLoading(true)
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/resume-builder/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          current_resume_data: resumeData
        })
      })
      
      if (!res.ok) throw new Error('Failed to get response')
        
      const data = await res.json()
      
      if (data.ai_reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.ai_reply }])
      }
      
      if (data.updated_resume_data) {
        setResumeData(data.updated_resume_data)
        if (setIsDirty) setIsDirty(true)
      }
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#080808] border border-white/[0.06] rounded-[1.5rem] overflow-hidden ml-4 my-4 relative">
      <div className="flex-shrink-0 p-4 border-b border-white/5 bg-white/[0.02]">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#4a9eff]" />
          AI Resume Builder
        </h2>
        <p className="text-white/40 text-xs mt-1">Answer simple questions and watch your resume build automatically.</p>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="flex flex-col gap-4 pb-4">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#4a9eff]/10 flex items-center justify-center flex-shrink-0 border border-[#4a9eff]/20">
                  <Bot className="w-4 h-4 text-[#4a9eff]" />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#4a9eff] text-white rounded-br-none' 
                    : 'bg-white/5 text-white/90 rounded-bl-none border border-white/5'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
                  <User className="w-4 h-4 text-white/60" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-[#4a9eff]/10 flex items-center justify-center flex-shrink-0 border border-[#4a9eff]/20">
                <Bot className="w-4 h-4 text-[#4a9eff]" />
              </div>
              <div className="bg-white/5 rounded-2xl rounded-bl-none p-4 flex items-center gap-2 border border-white/5">
                <Loader2 className="w-4 h-4 animate-spin text-[#4a9eff]" />
                <span className="text-xs text-white/40">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="flex-shrink-0 p-4 border-t border-white/5 bg-white/[0.02]">
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer here..."
            className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#4a9eff]/50 resize-none h-[50px] scrollbar-hide"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg bg-[#4a9eff] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a8eef] transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
