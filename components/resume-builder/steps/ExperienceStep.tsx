'use client'

import type { ExperienceEntry } from '@/lib/resume-types'
import { ExperienceEntryForm } from '../ExperienceEntryForm'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface ExperienceStepProps {
  experience: ExperienceEntry[]
  addExperience: () => void
  updateExperience: (id: string, updates: Partial<ExperienceEntry>) => void
  removeExperience: (id: string) => void
}

export function ExperienceStep({
  experience,
  addExperience,
  updateExperience,
  removeExperience,
}: ExperienceStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Work Experience</h2>
        <p className="text-sm text-white/40">
          Add your relevant work experience, most recent first.
        </p>
      </div>

      <div className="space-y-4">
        {experience.map((entry, i) => (
          <ExperienceEntryForm
            key={entry.id}
            entry={entry}
            index={i}
            onUpdate={(updates) => updateExperience(entry.id, updates)}
            onRemove={() => removeExperience(entry.id)}
          />
        ))}
      </div>

      <Button
        variant="outline"
        onClick={addExperience}
        className="w-full border-dashed border-white/10 text-white/50 hover:text-[#4a9eff] hover:border-[#4a9eff]/30 bg-transparent"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
    </div>
  )
}
