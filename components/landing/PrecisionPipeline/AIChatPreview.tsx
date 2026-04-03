"use client"

import { motion } from "motion/react"

export function AIChatPreview() {
  return (
    <div className="mt-4 border border-white/5 p-4 space-y-4 bg-white/[0.02] rounded-xl shadow-inner">
      <ChatMessage role="ai" text='You listed "led team" — how large, and what was the outcome?' />
      <ChatMessage role="user" text="8 engineers, 6 weeks, reduced churn 14%" />
      <ChatMessage role="ai" typing />
    </div>
  )
}

function ChatMessage({ role, text, typing }: { role: "ai"|"user"; text?: string; typing?: boolean }) {
  return (
    <div className="flex gap-3 items-start">
      <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center text-[9px] font-bold mt-0.5 rounded-full
        ${role === "ai" ? "bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "bg-white/10 text-[#888]"}`}>
        {role === "ai" ? "AI" : "U"}
      </div>
      <div className={`text-[12px] leading-relaxed flex-1 font-sans ${role === "ai" ? "text-[#ccc]" : "text-[#888]"}`}>
        {typing ? <TypingDots /> : text}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <span className="flex gap-1 items-center h-4">
      {[0, 200, 400].map((delay, i) => (
        <motion.span 
          key={i} 
          className="w-[3px] h-[3px] bg-[#555] rounded-full"
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{ duration: 1, repeat: Infinity, delay: delay / 1000 }}
        />
      ))}
    </span>
  )
}
