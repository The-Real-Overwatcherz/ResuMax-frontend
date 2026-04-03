'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Mail, ArrowRight, Loader2, Hexagon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

export function AuthModal({ isOpen, onClose, initialMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState(initialMode)
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Use this for Google Icon
  const GoogleIcon = (props: React.ComponentProps<"svg">) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Small delay to allow element to render before applying opacity
      requestAnimationFrame(() => setIsVisible(true))
    } else {
      document.body.style.overflow = 'unset'
      setIsVisible(false)
    }
  }, [isOpen])

  if (!mounted) return null
  if (!isOpen && !isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(), 300) // Match transition duration
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      handleClose()
    }, 1500)
  }

  const modalContent = (
    <div className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={handleClose} 
      />

      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row min-h-[500px] md:min-h-[600px] transform transition-all duration-300 ease-out delay-75 ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Side: Form */}
        <div className="w-full md:w-[45%] lg:w-[40%] p-8 sm:p-12 flex flex-col justify-center relative border-r border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
          
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {mode === 'signup' ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="text-[#888] text-sm sm:text-base">
              {mode === 'signup' ? 'Start maximizing your resume potential today.' : 'Enter your details to access your dashboard.'}
            </p>
          </div>

          <div className="space-y-4 w-full">
            <button 
              type="button"
              className="w-full relative group overflow-hidden flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3.5 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <GoogleIcon className="w-5 h-5" />
              <span className="text-white text-sm font-medium">Continue with Google</span>
            </button>
            
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <span className="text-xs text-white/40 uppercase tracking-widest font-medium">or email</span>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs text-white/60 font-medium pl-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full bg-white/5 border border-white/10 focus:border-white/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all shadow-inner"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-xs text-white/60 font-medium pl-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input 
                    type="email" 
                    placeholder="nam@resumax.ai" 
                    className="w-full bg-white/5 border border-white/10 focus:border-white/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all shadow-inner"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/60 font-medium pl-1">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-white/5 border border-white/10 focus:border-white/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all shadow-inner"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-4 bg-white hover:bg-gray-200 text-black font-semibold rounded-xl py-6 relative overflow-hidden group shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="flex items-center gap-2">
                      {mode === 'signup' ? 'Create Account' : 'Sign In'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[#888] text-xs">
                {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                <button 
                  onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                  className="ml-1 text-white hover:text-gray-300 font-medium transition-colors"
                >
                  {mode === 'signup' ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Visual/GIF Presentation */}
        <div className="hidden md:block w-full md:w-[55%] lg:w-[60%] relative bg-[#050505] overflow-hidden group">
          {/* Subtle Background Pattern / Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-[#050505] opacity-60" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 overflow-hidden">
            
            {/* The Visual Representation - Could be replaced with a GIF */}
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl border border-white/10 bg-black/40 overflow-hidden shadow-2xl group-hover:border-white/30 transition-colors duration-500 group-hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center">
              
              {/* Fallback presentation when GIF is not there */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-white/20 transition-colors duration-700"></div>

              {/* Replace the content below with actual `<img>` of the demo GIF once ready */}
              {/* <img src="/demo.gif" className="w-full h-full object-cover opacity-90" alt="ResuMax Capabilities" /> */}
              
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-gray-400 flex items-center justify-center shadow-lg relative z-10">
                    <Hexagon className="w-8 h-8 text-black fill-current" />
                  </div>
                  {/* Decorative pings */}
                  <div className="absolute inset-0 rounded-2xl bg-white animate-ping opacity-20" />
                  <div className="absolute -inset-4 rounded-3xl border border-white/20 animate-spin-slow pointer-events-none" />
                </div>
                
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">Unleash ResuMax Power</h3>
                  <p className="text-[#888] text-sm leading-relaxed max-w-[260px] mx-auto">
                    AI-driven ATS optimization, instant scoring, and personalized actionable feedback.
                  </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm shadow-inner mt-4">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-xs text-white/70 font-mono">Live Demo Space (GIF here)</span>
                </div>
              </div>

            </div>

            {/* Bottom floating elements */}
            <div className="absolute bottom-8 left-12 flex gap-4 opacity-50 scale-90">
              <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-wider text-white/70 mb-1">ATS Score</p>
                <p className="text-white font-mono text-xl">96%</p>
              </div>
            </div>
            
            <div className="absolute top-12 right-12 flex gap-4 opacity-50 scale-90">
              <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Matches</p>
                <div className="flex gap-1 mt-1">
                  <div className="w-3 h-1 bg-white rounded-full" />
                  <div className="w-3 h-1 bg-white rounded-full" />
                  <div className="w-3 h-1 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )

  // Use portal to render at document root to avoid any z-index or stacking context issues
  return createPortal(modalContent, document.body)
}
