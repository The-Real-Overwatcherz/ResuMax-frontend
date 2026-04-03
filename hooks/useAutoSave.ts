import { useEffect, useCallback } from 'react'
import type { ResumeData } from '@/lib/resume-types'

const STORAGE_KEY = 'resumax_builder_draft'

export function useAutoSave(resumeData: ResumeData, isDirty: boolean) {
  // Debounced save every 2s when dirty
  useEffect(() => {
    if (!isDirty) return
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData))
      } catch {
        // Storage full or unavailable — silently ignore
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [resumeData, isDirty])

  const loadDraft = useCallback((): ResumeData | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw) as ResumeData
    } catch {
      return null
    }
  }, [])

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { loadDraft, clearDraft }
}
