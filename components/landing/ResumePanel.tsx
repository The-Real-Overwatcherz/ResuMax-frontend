'use client'

import React, { useRef } from 'react'

export function ResumePanel() {
  const panelRef = useRef<HTMLDivElement>(null)

  return (
    <div 
      ref={panelRef}
      className="flex items-center justify-center gap-8 md:gap-14 min-h-[400px]"
    >
      {/* Resume Card Column */}
      <div className="resume-card group relative w-[240px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden flex-shrink-0 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
        
        {/* Ambient background glow inside the card */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700" />
        
        {/* Animated Scan Line with trailing light */}
        <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent z-20 animate-[scan_3.5s_ease-in-out_forwards] fill-mode-both" 
             style={{ boxShadow: '0 0 20px 2px rgba(255,255,255,0.6)', animationDelay: '2.5s' }} />
        <div className="absolute left-0 w-full h-[60px] bg-gradient-to-b from-transparent to-white/10 z-10 -translate-y-[58px] animate-[scan_3.5s_ease-in-out_forwards] fill-mode-both" 
             style={{ animationDelay: '2.5s' }} />

        {/* Skeletons — completely visible so they represent the revealed document */}
        <div className="relative z-10">
          
          {/* Header Area */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex-shrink-0 shadow-inner" />
            <div className="flex flex-col gap-2.5 w-full">
              <div className="w-[85%] h-3 bg-white/20 rounded-full" />
              <div className="w-[50%] h-2 bg-white/10 rounded-full" />
            </div>
          </div>
          
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent mb-6" />

          {/* Section 1 */}
          <div className="mb-5 space-y-2.5">
            <div className="w-[45%] h-2 bg-white/20 rounded-full mb-1.5" />
            <div className="w-full h-[5px] bg-white/10 rounded-full" />
            <div className="w-[85%] h-[5px] bg-white/10 rounded-full" />
            <div className="w-[95%] h-[5px] bg-white/30 border border-white/40 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            <div className="w-[60%] h-[5px] bg-white/10 rounded-full" />
          </div>

          {/* Section 2 */}
          <div className="mb-5 space-y-2.5">
            <div className="w-[35%] h-2 bg-white/20 rounded-full mb-1.5" />
            <div className="w-[90%] h-[5px] bg-white/30 border border-white/40 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            <div className="w-[75%] h-[5px] bg-white/10 rounded-full" />
            <div className="w-[100%] h-[5px] bg-white/10 rounded-full" />
          </div>

          {/* Section 3 */}
          <div className="space-y-2.5">
            <div className="w-[40%] h-2 bg-white/20 rounded-full mb-1.5" />
            <div className="w-[80%] h-[5px] bg-white/10 rounded-full" />
            <div className="w-[65%] h-[5px] bg-white/10 rounded-full" />
          </div>
          
        </div>
        
        {/* Subtle gradient overlay to fade out the bottom seamlessly */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-20" />
      </div>

      {/* Stats Column */}
      <div className="flex flex-col justify-center gap-7 flex-1">
        
        {/* ATS Score Ring */}
        <div className="relative w-[110px] h-[110px] animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-both" style={{ animationDelay: '2.8s' }}>
          
          <div className="absolute inset-0 bg-white/10 rounded-full blur-xl animate-pulse" />
          
          <svg className="relative w-full h-full -rotate-90 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r="34" fill="none" className="stroke-white/10" strokeWidth="6" />
            <circle cx="44" cy="44" r="34" fill="none" strokeWidth="6" strokeLinecap="round" strokeDasharray="214"
                    className="stroke-white animate-[dash_1.6s_cubic-bezier(0.22,1,0.36,1)_forwards]"
                    style={{ strokeDashoffset: 214, animationDelay: '3.1s' }} />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[32px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight">94</span>
            <span className="text-[9px] text-[#aaa] tracking-[0.2em] mt-1.5 font-semibold uppercase">Score</span>
          </div>
        </div>

        {/* Status Chips */}
        <div className="flex flex-col gap-3.5">
          
          <div className="group relative flex items-center gap-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/40 transition-all duration-300 px-4 py-3 rounded-xl backdrop-blur-md cursor-default shadow-lg animate-in slide-in-from-right-8 fade-in duration-700 fill-mode-both hover:-translate-y-0.5" style={{ animationDelay: '3.7s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className="relative w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            <span className="relative text-[13.5px] font-medium text-slate-200 group-hover:text-white transition-colors">12 keywords matched</span>
          </div>

          <div className="group relative flex items-center gap-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/40 transition-all duration-300 px-4 py-3 rounded-xl backdrop-blur-md cursor-default shadow-lg animate-in slide-in-from-right-8 fade-in duration-700 fill-mode-both hover:-translate-y-0.5" style={{ animationDelay: '4.8s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className="relative w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            <span className="relative text-[13.5px] font-medium text-slate-200 group-hover:text-white transition-colors">2 skill gaps found</span>
          </div>

          <div className="group relative flex items-center gap-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/40 transition-all duration-300 px-4 py-3 rounded-xl backdrop-blur-md cursor-default shadow-lg animate-in slide-in-from-right-8 fade-in duration-700 fill-mode-both hover:-translate-y-0.5" style={{ animationDelay: '5.6s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className="relative w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            <span className="relative text-[13.5px] font-medium text-slate-200 group-hover:text-white transition-colors">ATS optimized</span>
          </div>

        </div>
      </div>

    </div>
  )
}
