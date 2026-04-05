'use client'

import React, { useEffect, useState } from 'react'
import { Mail, ArrowRight, Loader2, Hexagon, Github, Sparkles, CheckCircle2, ShieldCheck, Zap, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const GoogleIcon = (props: React.ComponentProps<"svg">) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        })
        if (error) throw error
        router.push('/dashboard')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setErrorMsg('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row overflow-hidden font-sans selection:bg-white selection:text-black">
      
      {/* Left Column: Brand & Visuals */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-3/5 bg-[#0a0a0a] border-r border-white/[0.05] p-12 lg:p-20 flex-col overflow-hidden">
        
        {/* Background glow and patterns */}
        <div className="absolute top-0 left-0 w-full h-full">
           <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/[0.03] blur-[120px] rounded-full" />
           <div className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] bg-white/[0.02] blur-[150px] rounded-full" />
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none" />
           {/* Grid Pattern */}
           <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3 group mb-20 self-start">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform">
            <Hexagon className="w-6 h-6 text-black fill-current" />
          </div>
          <span className="font-mono text-xl tracking-[0.2em] font-bold text-white">RESUMAX</span>
        </Link>

        {/* Hero Text */}
        <div className="relative z-10 mt-auto max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-white/60" />
              <span className="text-[11px] font-semibold tracking-wider text-white uppercase">
                Powered by Multi-Agent AI
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-8">
              Unlock your peak <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                career potential.
              </span>
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-md mb-12">
              The only platform that coordinates a team of AI agents to optimize your resume, analyze competitors, and generate winning outreach.
            </p>
          </motion.div>

          {/* Testimonial/Proof Chips */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 }}
               className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                   <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Fast Start</span>
              </div>
              <p className="text-[13px] text-white/40 leading-relaxed">Boost your ATS score from 40 to 90+ in less than 5 minutes.</p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.5 }}
               className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                   <ShieldCheck className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Secure</span>
              </div>
              <p className="text-[13px] text-white/40 leading-relaxed">Enterprise-grade encryption for all your professional data.</p>
            </motion.div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="relative z-10 mt-auto pt-10">
          <p className="text-[11px] text-white/20 font-mono tracking-widest uppercase">
            © 2026 RESUMAX INC. ALL AGENTS ACTIVE.
          </p>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-y-auto">
        
        {/* Mobile Logo */}
        <Link href="/" className="md:hidden flex items-center gap-3 mb-12 self-center">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <Hexagon className="w-5 h-5 text-black fill-current" />
          </div>
          <span className="font-mono text-lg tracking-[0.15em] font-bold text-white">RESUMAX</span>
        </Link>
        
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-white mb-3">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-white/40 text-[15px]">
                {mode === 'login' 
                  ? 'Access your resume dashboard and AI agents.' 
                  : 'Get started with the world\'s most powerful career AI.'}
              </p>
            </div>

            <div className="space-y-4">
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-14 relative group overflow-hidden flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <GoogleIcon className="w-5 h-5" />
                <span className="text-white text-[15px] font-semibold">Continue with Google</span>
              </button>

              <div className="flex items-center gap-4 py-4">
                <div className="h-[1px] flex-1 bg-white/[0.08]"></div>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">or use email</span>
                <div className="h-[1px] flex-1 bg-white/[0.08]"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[#ff4444] text-[13px] bg-[#ff4444]/10 border border-[#ff4444]/20 rounded-xl px-4 py-3 text-center font-medium"
                  >
                    {errorMsg}
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="text-[13px] text-white/50 font-semibold pl-1">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-14 bg-white/[0.04] border border-white/10 focus:border-white/50 rounded-2xl px-5 text-[15px] text-white placeholder:text-white/20 outline-none transition-all shadow-inner focus:bg-white/[0.06]"
                        required={mode === 'signup'}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="text-[13px] text-white/50 font-semibold pl-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20" />
                    <input 
                      type="email" 
                      placeholder="name@company.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 bg-white/[0.04] border border-white/10 focus:border-white/50 rounded-2xl pl-13 pr-5 text-[15px] text-white placeholder:text-white/20 outline-none transition-all shadow-inner focus:bg-white/[0.06]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between pl-1 pr-1">
                    <label className="text-[13px] text-white/50 font-semibold">Password</label>
                    <button type="button" className="text-[12px] text-white/30 hover:text-white transition-colors">Forgot password?</button>
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-white/[0.04] border border-white/10 focus:border-white/50 rounded-2xl px-5 text-[15px] text-white placeholder:text-white/20 outline-none transition-all shadow-inner focus:bg-white/[0.06]"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 mt-4 bg-white hover:bg-gray-200 text-black font-bold rounded-2xl relative overflow-hidden group shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.2)] hover:scale-[1.01] transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </Button>
              </form>

              <div className="mt-8 text-center bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4">
                <p className="text-white/40 text-sm">
                  {mode === 'login' ? 'New to ResuMax?' : 'Already have an account?'}
                  <button 
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="ml-2 text-white hover:text-white/70 font-bold transition-all underline decoration-white/20 underline-offset-4"
                  >
                    {mode === 'login' ? 'Create an account' : 'Sign in here'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Social Links / Footer */}
          <div className="mt-12 flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
             <Github className="w-5 h-5 cursor-pointer hover:text-white" />
             <Linkedin className="w-5 h-5 cursor-pointer hover:text-white" />
             <div className="w-[1px] h-5 bg-white/20" />
             <p className="text-[11px] font-mono leading-none flex items-center">v1.2.4-STAFF</p>
          </div>
        </div>
      </div>
    </div>
  )
}
