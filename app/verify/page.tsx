'use client'

import { useState } from 'react'
import { Hexagon, MailCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthModal } from '@/components/landing/AuthModal'
import { Navbar } from '@/components/landing/Navbar'
import Link from 'next/link'

export default function VerifyPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col relative overflow-hidden">
      {/* Background elements to match the site's theme */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-[#080808] opacity-60" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      
      <Navbar />

      <main className="flex-1 flex items-center justify-center relative p-6">
        <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-3xl p-8 sm:p-12 text-center shadow-[0_0_50px_rgba(0,0,0,0.3)] backdrop-blur-md">
          
          <div className="flex justify-center mb-8 relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10 shadow-lg">
              <MailCheck className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-white animate-ping opacity-10" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
            Check Your Email
          </h1>
          
          <p className="text-[#888] mb-8 leading-relaxed">
            We&apos;ve sent a verification link to your email address. Please click the link to verify your account.
          </p>

          <div className="space-y-4">
            <Button 
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-white hover:bg-gray-200 text-black font-semibold rounded-xl py-6 relative overflow-hidden group shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
            >
              <span className="flex items-center gap-2">
                Login Here
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </Button>
            
            <p className="text-xs text-white/40 pt-4">
              Didn&apos;t receive an email? Check your spam folder or try signing up again.
            </p>
          </div>
        </div>
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode="login" 
      />
    </div>
  )
}
