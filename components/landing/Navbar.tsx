'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-config'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AuthModal } from '@/components/landing/AuthModal'

const navLinks = [
  { label: 'Work', href: '/#pipeline' },
  { label: 'Features', href: '/#components' },
]

export function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')


  useEffect(() => {
    if (!navRef.current) return
    
    // Animate from the bottom
    // We explicitly set x: '-50%' here because GSAP's transform overrides Tailwind's -translate-x-1/2
    gsap.fromTo(
      navRef.current,
      { y: 100, x: '-50%', opacity: 0 },
      {
        y: 0,
        x: '-50%',
        opacity: 1,
        duration: 0.8,
        delay: pathname === '/' ? 2.2 : 0.2, // longer delay on initial landing page load
        ease: 'power3.out',
      }
    )
  }, [pathname])

  return (
    <nav
      ref={navRef}
      className="fixed bottom-6 left-1/2 z-[100] h-16 flex items-center justify-between px-6 transition-all duration-300 bg-black/40 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full w-[95%] max-w-[600px] gap-6"
    >
      <Link href="/" className="font-mono text-[13px] tracking-[0.15em] text-white font-medium hover:text-gray-300 transition-colors flex-shrink-0">
        R<span className="hidden sm:inline">ESUMAX</span>
      </Link>

      <div className="flex items-center gap-6 text-sm">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-[#888] hover:text-white transition-colors duration-200 whitespace-nowrap font-medium"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
          className="h-9 px-4 text-xs tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          Login
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
          className="h-9 px-5 text-xs font-semibold tracking-wider uppercase border-white/50 bg-white/10 text-white hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-full transition-all duration-300"
        >
          Sign Up
        </Button>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      />
    </nav>
  )
}
