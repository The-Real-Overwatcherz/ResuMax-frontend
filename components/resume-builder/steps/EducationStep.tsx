'use client'

import type { EducationEntry } from '@/lib/resume-types'
import { EducationEntryForm } from '../EducationEntryForm'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface EducationStepProps {
  education: EducationEntry[]
  addEducation: () => void
  updateEducation: (id: string, updates: Partial<EducationEntry>) => void
  removeEducation: (id: string) => void
}

export function EducationStep({
  education,
  addEducation,
  updateEducation,
  removeEducation,
}: EducationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Education</h2>
        <p className="text-sm text-white/40">
          Add your educational background, most recent first.
        </p>
      </div>

      <div className="space-y-4">
        {education.map((entry, i) => (
          <EducationEntryForm
            key={entry.id}
            entry={entry}
            index={i}
            onUpdate={(updates) => updateEducation(entry.id, updates)}
            onRemove={() => removeEducation(entry.id)}
          />
        ))}
      </div>

      <Button
        variant="outline"
        onClick={addEducation}
        className="w-full border-dashed border-white/10 text-white/50 hover:text-[#4a9eff] hover:border-[#4a9eff]/30 bg-transparent"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  )
}
