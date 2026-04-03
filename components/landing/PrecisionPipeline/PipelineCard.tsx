"use client"
import { motion } from "motion/react"
import { AIChatPreview } from "./AIChatPreview"

export type Step = {
  num: string
  title: string
  desc: string
  tag: string
  type: string
}

export function PipelineCard({ step, active }: { step: Step; active: boolean }) {
  // Simple active vs inactive state for horizontal scroll view
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: active ? 1 : 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-[320px] flex-shrink-0 bg-[#0a0a0a] border border-white/10 rounded-2xl p-7 relative shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden group"
    >
      {/* Top accent bar */}
      <motion.div
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent origin-left z-10"
      />
      
      {/* Internal Glow on active */}
      <motion.div 
        animate={{ opacity: active ? 1 : 0 }}
        className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none transition-opacity duration-700"
      />
      
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center shadow-inner">
          <span className="text-[11px] font-semibold tracking-wider text-white/80">{step.num}</span>
        </div>
        <p className="text-xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#777] leading-tight">
          {step.title}
        </p>
      </div>

      <p className="text-[14px] text-[#999] leading-relaxed min-h-[80px] relative z-10">
        {step.desc}
      </p>
      
      {step.type === "ai" && (
        <div className="mt-2 relative z-10">
          <AIChatPreview />
        </div>
      )}
      
      <div className="mt-6 relative z-10 pt-5 border-t border-white/[0.05]">
        <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          <span className="text-[11px] font-medium text-slate-300">
            {step.tag}
          </span>
        </span>
      </div>
    </motion.div>
  )
}

