'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { gsap } from '@/lib/gsap-config'
import { supabase } from '@/lib/supabase'
import { useResumeBuilder } from '@/hooks/useResumeBuilder'
import { useAutoSave } from '@/hooks/useAutoSave'
import { AIChatBuilder } from '@/components/resume-builder/AIChatBuilder'
import { ResumePreview } from '@/components/resume-builder/ResumePreview'
import { Download, FileText } from 'lucide-react'
import { printResume } from '@/lib/resume-pdf'
import Link from 'next/link'
import { Linkedin } from 'lucide-react'

export default function CreateResumePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4a9eff] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CreateResumeContent />
    </Suspense>
  )
}

function CreateResumeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [linkedinImported, setLinkedinImported] = useState(false)

  const builder = useResumeBuilder()
  const { loadDraft, clearDraft } = useAutoSave(builder.resumeData, builder.isDirty)

  // Auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setAuthChecked(true)
      }
    })
  }, [router])

  // Load draft on mount
  useEffect(() => {
    if (!authChecked) return
    const draft = loadDraft()
    if (draft) {
      builder.setResumeData(draft)
    }
  }, [authChecked]) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle LinkedIn callback data from query params
  useEffect(() => {
    if (!authChecked) return
    const linkedinSuccess = searchParams.get('linkedin_success')
    if (linkedinSuccess === 'true') {
      const name = searchParams.get('linkedin_name') || ''
      const email = searchParams.get('linkedin_email') || ''

      if (name) builder.updateContact('full_name', name)
      if (email) builder.updateContact('email', email)

      setLinkedinImported(true)

      // Clean up URL params
      window.history.replaceState({}, '', '/create')
    }

    const linkedinError = searchParams.get('linkedin_error')
    if (linkedinError) {
      console.error('LinkedIn OAuth error:', linkedinError)
      window.history.replaceState({}, '', '/create')
    }
  }, [authChecked, searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  // Entry animation
  useEffect(() => {
    if (!authChecked || !containerRef.current) return
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
    )
  }, [authChecked])

  const handleExportPDF = () => {
    printResume(builder.resumeData)
  }

  const handleExportDOCX = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/resume/generate-docx`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(builder.resumeData),
      })

      if (!res.ok) throw new Error('Failed to generate DOCX')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${builder.resumeData.contact.full_name || 'resume'}.docx`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('DOCX export failed:', err)
    }
  }

  const handleLinkedInImport = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    window.location.href = `${apiUrl}/api/auth/linkedin/login`
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4a9eff] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#080808] flex flex-col pt-16 md:pt-4">

      <div ref={containerRef} className="flex-1 flex flex-col opacity-0 min-h-0">
        {/* Header */}
        <div className="flex-shrink-0 px-6 sm:px-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-white/40 hover:text-white text-sm font-mono transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-white/20">/</span>
              <h1 className="text-lg font-semibold text-white tracking-tight">
                Create Resume
              </h1>
            </div>

            <button
              onClick={handleLinkedInImport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-all text-sm font-medium"
            >
              <Linkedin className="w-4 h-4" />
              {linkedinImported ? 'Imported' : 'Import from LinkedIn'}
            </button>
          </div>
        </div>

        {/* Chat & Preview split */}
        <div className="flex-1 mx-4 sm:mx-6 mb-4 flex min-h-0 gap-4">
          
          {/* Chat Panel */}
          <div className="w-full lg:w-[45%] flex flex-col min-h-0">
            <AIChatBuilder {...builder} />
          </div>

          {/* Preview Panel */}
          <div className="hidden lg:flex w-[55%] flex-col bg-white/[0.02] border border-white/[0.06] rounded-[1.5rem] p-6 items-center justify-start overflow-auto">
            <div className="w-full flex justify-end gap-2 mb-4">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors border border-white/10"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={handleExportDOCX}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors border border-white/10"
              >
                <FileText className="w-4 h-4" />
                DOCX
              </button>
            </div>
            
            <ResumePreview resumeData={builder.resumeData} />
          </div>

        </div>
      </div>
    </div>
  )
}
