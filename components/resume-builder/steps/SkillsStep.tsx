'use client'

import { SkillTagInput } from '../SkillTagInput'

interface SkillsStepProps {
  skills: string[]
  setSkills: (skills: string[]) => void
  languages: string[]
  setLanguages: (languages: string[]) => void
}

export function SkillsStep({ skills, setSkills, languages, setLanguages }: SkillsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Skills & Languages</h2>
        <p className="text-sm text-white/40">
          Add your technical and professional skills. Press Enter or comma to add.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">
            Skills
          </label>
          <SkillTagInput
            tags={skills}
            onChange={setSkills}
            placeholder="React, TypeScript, Python..."
          />
          <p className="text-xs text-white/20 ml-1 font-mono">
            {skills.length} skill{skills.length !== 1 ? 's' : ''} added
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">
            Languages
          </label>
          <SkillTagInput
            tags={languages}
            onChange={setLanguages}
            placeholder="English, Spanish, Mandarin..."
          />
        </div>
      </div>
    </div>
  )
}
