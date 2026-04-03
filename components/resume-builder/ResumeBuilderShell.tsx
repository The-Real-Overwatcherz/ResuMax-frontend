'use client'

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap-config'
import { StepIndicator } from './StepIndicator'
import { ResumePreview } from './ResumePreview'
import { ContactInfoStep } from './steps/ContactInfoStep'
import { SummaryStep } from './steps/SummaryStep'
import { ExperienceStep } from './steps/ExperienceStep'
import { EducationStep } from './steps/EducationStep'
import { SkillsStep } from './steps/SkillsStep'
import { ProjectsCertificationsStep } from './steps/ProjectsCertificationsStep'
import { PreviewStep } from './steps/PreviewStep'
import { STEP_CONFIG, type BuilderStep } from '@/lib/resume-types'
import type { useResumeBuilder } from '@/hooks/useResumeBuilder'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

type BuilderHook = ReturnType<typeof useResumeBuilder>

interface ResumeBuilderShellProps extends BuilderHook {
  onExportPDF: () => void
  onExportDOCX: () => void
}

export function ResumeBuilderShell(props: ResumeBuilderShellProps) {
  const {
    currentStep,
    resumeData,
    goNext,
    goPrev,
    goToStep,
    onExportPDF,
    onExportDOCX,
  } = props

  const formPanelRef = useRef<HTMLDivElement>(null)
  const prevStepRef = useRef(currentStep)

  // GSAP step transition
  useEffect(() => {
    if (prevStepRef.current === currentStep) return
    prevStepRef.current = currentStep

    if (formPanelRef.current) {
      gsap.fromTo(
        formPanelRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' },
      )
    }
  }, [currentStep])

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ContactInfoStep
            contact={resumeData.contact}
            updateContact={props.updateContact}
          />
        )
      case 1:
        return (
          <SummaryStep
            summary={resumeData.summary}
            updateSummary={props.updateSummary}
          />
        )
      case 2:
        return (
          <ExperienceStep
            experience={resumeData.experience}
            addExperience={props.addExperience}
            updateExperience={props.updateExperience}
            removeExperience={props.removeExperience}
          />
        )
      case 3:
        return (
          <EducationStep
            education={resumeData.education}
            addEducation={props.addEducation}
            updateEducation={props.updateEducation}
            removeEducation={props.removeEducation}
          />
        )
      case 4:
        return (
          <SkillsStep
            skills={resumeData.skills}
            setSkills={props.setSkills}
            languages={resumeData.languages}
            setLanguages={props.setLanguages}
          />
        )
      case 5:
        return (
          <ProjectsCertificationsStep
            projects={resumeData.projects}
            addProject={props.addProject}
            updateProject={props.updateProject}
            removeProject={props.removeProject}
            certifications={resumeData.certifications}
            setCertifications={props.setCertifications}
          />
        )
      case 6:
        return (
          <PreviewStep
            resumeData={resumeData}
            onExportPDF={onExportPDF}
            onExportDOCX={onExportDOCX}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Step Indicator */}
      <div className="flex-shrink-0 py-4 px-4 border-b border-white/5">
        <StepIndicator currentStep={currentStep} goToStep={goToStep} />
        <p className="text-center text-xs text-white/40 font-mono mt-2 tracking-wider uppercase">
          {STEP_CONFIG[currentStep].label}
        </p>
      </div>

      {/* Main content: form + preview */}
      <div className="flex-1 flex min-h-0">
        {/* Form Panel */}
        <div className="w-full lg:w-[60%] flex flex-col min-h-0">
          <ScrollArea className="flex-1">
            <div ref={formPanelRef} className="p-6 sm:p-8">
              {renderStep()}
            </div>
          </ScrollArea>

          {/* Navigation */}
          {currentStep < 6 && (
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-t border-white/5">
              <Button
                variant="ghost"
                onClick={goPrev}
                disabled={currentStep === 0}
                className="text-white/60 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={goNext}
                className="bg-[#4a9eff] hover:bg-[#4a9eff]/80 text-white shadow-[0_0_15px_rgba(74,158,255,0.2)]"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>

        {/* Preview Panel — desktop only, hidden on Step 6 (PreviewStep has its own) */}
        {currentStep < 6 && (
          <div className="hidden lg:flex w-[40%] border-l border-white/5 p-6 items-start justify-center overflow-auto bg-white/[0.01]">
            <ResumePreview resumeData={resumeData} />
          </div>
        )}
      </div>
    </div>
  )
}
