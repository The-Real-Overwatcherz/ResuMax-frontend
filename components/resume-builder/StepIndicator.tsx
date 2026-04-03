'use client'

import { STEP_CONFIG, type BuilderStep } from '@/lib/resume-types'
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  Eye,
  Check,
} from 'lucide-react'

const ICONS = [User, FileText, Briefcase, GraduationCap, Wrench, FolderOpen, Eye]

interface StepIndicatorProps {
  currentStep: BuilderStep
  goToStep: (step: BuilderStep) => void
}

export function StepIndicator({ currentStep, goToStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 w-full px-2">
      {STEP_CONFIG.map((step, i) => {
        const Icon = ICONS[i]
        const isActive = i === currentStep
        const isCompleted = i < currentStep

        return (
          <div key={step.label} className="flex items-center">
            <button
              onClick={() => goToStep(i as BuilderStep)}
              className={`
                relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full
                transition-all duration-300 cursor-pointer
                ${
                  isActive
                    ? 'bg-[#4a9eff] shadow-[0_0_20px_rgba(74,158,255,0.4)] scale-110'
                    : isCompleted
                      ? 'bg-[#4a9eff]/20 border border-[#4a9eff]/50'
                      : 'bg-white/5 border border-white/10 hover:border-white/20'
                }
              `}
            >
              {isCompleted ? (
                <Check className="w-4 h-4 text-[#4a9eff]" />
              ) : (
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/40'}`}
                />
              )}
            </button>

            {/* Connector line */}
            {i < STEP_CONFIG.length - 1 && (
              <div
                className={`w-4 sm:w-8 h-[2px] mx-0.5 transition-colors duration-300 ${
                  i < currentStep ? 'bg-[#4a9eff]/50' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
