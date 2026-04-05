'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap-config'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AuthModal } from '@/components/landing/AuthModal'
import { User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

import { useRouter } from 'next/navigation'
import { ContinuousTabs } from '@/components/ui/continuous-tabs'

const navTabs = [
  { id: '/', label: 'Home' },
  { id: '#pipeline', label: 'Work' },
  { id: '#components', label: 'Engine' },
  { id: '#features', label: 'Features' },
  { id: '#shruti', label: 'Shruti' },
  { id: '#pricing', label: 'Pricing' },
  { id: '#faq', label: 'FAQ' },
]

export function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')
  
  const [user, setUser] = useState<any>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('/')

  useEffect(() => {
    const handleScroll = () => {
      if (pathname !== '/') return

      const sections = navTabs.map(t => t.id).filter(id => id.startsWith('#'))
      let currentActive = '/'

      for (const id of sections) {
        const element = document.querySelector(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          // 40% of viewport from top
          if (rect.top <= window.innerHeight * 0.4) {
            currentActive = id
          }
        }
      }

      if (window.scrollY < window.innerHeight * 0.2) {
        currentActive = '/'
      }

      setActiveTab(currentActive)
    }

    if (pathname === '/') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()
    } else {
      setActiveTab(pathname) // fallback for other routes
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoadingAuth(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])


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
      className="fixed bottom-6 left-1/2 z-[100] h-16 flex items-center justify-between px-8 transition-all duration-300 bg-black/40 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full w-auto max-w-[95vw] gap-8 xl:gap-12"
    >
      <Link href="/" className="font-mono text-[13px] tracking-[0.15em] text-white font-medium hover:text-gray-300 transition-colors flex-shrink-0">
        R<span className="hidden sm:inline">ESUMAX</span>
      </Link>

      <div className="flex items-center">
        <ContinuousTabs 
          tabs={navTabs} 
          activeId={activeTab}
          onChange={(id) => {
            setActiveTab(id)
            if (pathname === '/') {
               if (id === '/') {
                 window.scrollTo({ top: 0, behavior: 'smooth' })
               } else if (id.startsWith('#')) {
                 const el = document.querySelector(id)
                 if (el) el.scrollIntoView({ behavior: 'smooth' })
               } else {
                 router.push(id)
               }
            } else {
               router.push(id.startsWith('#') ? `/${id}` : id)
            }
          }} 
        />
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {!loadingAuth && (
          user ? (
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 md:h-10 md:w-10 rounded-full border-white/20 bg-white/10 hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300"
              >
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
          ) : (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
              className="h-9 w-9 md:h-10 md:w-10 rounded-full border-white/20 bg-white/10 hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300"
            >
              <User className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          )
        )}
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      />
    </nav>
  )
}
