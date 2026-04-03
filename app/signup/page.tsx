'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-config'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/landing/Navbar'

export default function SignupPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !formRef.current) return

    // Background orbs animation
    gsap.to('.orb-1', {
      x: 'random(-50, 50)',
      y: 'random(-50, 50)',
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    
    gsap.to('.orb-2', {
      x: 'random(-50, 50)',
      y: 'random(-50, 50)',
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    // Reveal form
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    )
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#080808] flex items-center justify-center overflow-hidden flex-col">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb-1 absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px]" />
        <div className="orb-2 absolute bottom-[20%] right-[30%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Glassmorphic Card */}
      <div ref={formRef} className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-[2rem] bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-2xl mx-4">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block font-mono text-[16px] tracking-[0.2em] text-white font-medium mb-6 hover:text-emerald-400 transition-colors">
            RESUMAX <span className="text-emerald-500">2.0</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Create an account</h1>
          <p className="text-sm text-[#888]">Enter your details to get started</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
              placeholder="••••••••"
            />
          </div>

          <Button className="w-full mt-8 h-12 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] text-[15px]">
            Sign Up Now
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[#666]">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:text-emerald-400 transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-emerald-400">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
