import { useState, useCallback } from 'react'
import type {
  ResumeData,
  ResumeContact,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
  BuilderStep,
} from '@/lib/resume-types'
import {
  createEmptyResume,
  createEmptyExperience,
  createEmptyEducation,
  createEmptyProject,
} from '@/lib/resume-templates'

export function useResumeBuilder() {
  const [currentStep, setCurrentStep] = useState<BuilderStep>(0)
  const [resumeData, setResumeData] = useState<ResumeData>(createEmptyResume)
  const [isDirty, setIsDirty] = useState(false)

  const markDirty = useCallback(() => setIsDirty(true), [])

  // --- Step navigation ---
  const goNext = useCallback(
    () => setCurrentStep((s) => Math.min(s + 1, 6) as BuilderStep),
    [],
  )
  const goPrev = useCallback(
    () => setCurrentStep((s) => Math.max(s - 1, 0) as BuilderStep),
    [],
  )
  const goToStep = useCallback((step: BuilderStep) => setCurrentStep(step), [])

  // --- Contact ---
  const updateContact = useCallback(
    (field: keyof ResumeContact, value: string) => {
      setResumeData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }))
      markDirty()
    },
    [markDirty],
  )

  // --- Summary ---
  const updateSummary = useCallback(
    (value: string) => {
      setResumeData((prev) => ({ ...prev, summary: value }))
      markDirty()
    },
    [markDirty],
  )

  // --- Experience ---
  const addExperience = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, createEmptyExperience()],
    }))
    markDirty()
  }, [markDirty])

  const updateExperience = useCallback(
    (id: string, updates: Partial<ExperienceEntry>) => {
      setResumeData((prev) => ({
        ...prev,
        experience: prev.experience.map((e) =>
          e.id === id ? { ...e, ...updates } : e,
        ),
      }))
      markDirty()
    },
    [markDirty],
  )

  const removeExperience = useCallback(
    (id: string) => {
      setResumeData((prev) => ({
        ...prev,
        experience: prev.experience.filter((e) => e.id !== id),
      }))
      markDirty()
    },
    [markDirty],
  )

  // --- Education ---
  const addEducation = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, createEmptyEducation()],
    }))
    markDirty()
  }, [markDirty])

  const updateEducation = useCallback(
    (id: string, updates: Partial<EducationEntry>) => {
      setResumeData((prev) => ({
        ...prev,
        education: prev.education.map((e) =>
          e.id === id ? { ...e, ...updates } : e,
        ),
      }))
      markDirty()
    },
    [markDirty],
  )

  const removeEducation = useCallback(
    (id: string) => {
      setResumeData((prev) => ({
        ...prev,
        education: prev.education.filter((e) => e.id !== id),
      }))
      markDirty()
    },
    [markDirty],
  )

  // --- Projects ---
  const addProject = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, createEmptyProject()],
    }))
    markDirty()
  }, [markDirty])

  const updateProject = useCallback(
    (id: string, updates: Partial<ProjectEntry>) => {
      setResumeData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id ? { ...p, ...updates } : p,
        ),
      }))
      markDirty()
    },
    [markDirty],
  )

  const removeProject = useCallback(
    (id: string) => {
      setResumeData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
      }))
      markDirty()
    },
    [markDirty],
  )

  // --- Skills, Certifications, Languages ---
  const setSkills = useCallback(
    (skills: string[]) => {
      setResumeData((prev) => ({ ...prev, skills }))
      markDirty()
    },
    [markDirty],
  )

  const setCertifications = useCallback(
    (certifications: string[]) => {
      setResumeData((prev) => ({ ...prev, certifications }))
      markDirty()
    },
    [markDirty],
  )

  const setLanguages = useCallback(
    (languages: string[]) => {
      setResumeData((prev) => ({ ...prev, languages }))
      markDirty()
    },
    [markDirty],
  )

  // --- Reset ---
  const resetResume = useCallback(() => {
    setResumeData(createEmptyResume())
    setCurrentStep(0)
    setIsDirty(false)
  }, [])

  return {
    currentStep,
    resumeData,
    isDirty,
    setResumeData,
    setIsDirty,
    goNext,
    goPrev,
    goToStep,
    updateContact,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addProject,
    updateProject,
    removeProject,
    setSkills,
    setCertifications,
    setLanguages,
    resetResume,
  }
}
