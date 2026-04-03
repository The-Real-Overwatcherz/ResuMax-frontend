'use client'

import type { EducationEntry } from '@/lib/resume-types'
import { Trash2 } from 'lucide-react'

const INPUT_CLASS =
  'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4a9eff]/50 focus:ring-1 focus:ring-[#4a9eff]/50 transition-all font-mono'
const LABEL_CLASS = 'text-xs font-mono text-[#888] tracking-widest uppercase ml-1'

interface EducationEntryFormProps {
  entry: EducationEntry
  onUpdate: (updates: Partial<EducationEntry>) => void
  onRemove: () => void
  index: number
}

export function EducationEntryForm({
  entry,
  onUpdate,
  onRemove,
  index,
}: EducationEntryFormProps) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-[#4a9eff] tracking-wider">
          EDUCATION #{index + 1}
        </span>
        <button
          onClick={onRemove}
          className="text-white/20 hover:text-red-400 transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <label className={LABEL_CLASS}>Institution</label>
        <input
          type="text"
          value={entry.institution}
          onChange={(e) => onUpdate({ institution: e.target.value })}
          className={INPUT_CLASS}
          placeholder="Massachusetts Institute of Technology"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={LABEL_CLASS}>Degree</label>
          <input
            type="text"
            value={entry.degree}
            onChange={(e) => onUpdate({ degree: e.target.value })}
            className={INPUT_CLASS}
            placeholder="Bachelor of Science"
          />
        </div>
        <div className="space-y-2">
          <label className={LABEL_CLASS}>Field of Study</label>
          <input
            type="text"
            value={entry.field}
            onChange={(e) => onUpdate({ field: e.target.value })}
            className={INPUT_CLASS}
            placeholder="Computer Science"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={LABEL_CLASS}>Dates</label>
          <input
            type="text"
            value={entry.dates}
            onChange={(e) => onUpdate({ dates: e.target.value })}
            className={INPUT_CLASS}
            placeholder="Sep 2018 - May 2022"
          />
        </div>
        <div className="space-y-2">
          <label className={LABEL_CLASS}>GPA (optional)</label>
          <input
            type="text"
            value={entry.gpa}
            onChange={(e) => onUpdate({ gpa: e.target.value })}
            className={INPUT_CLASS}
            placeholder="3.8 / 4.0"
          />
        </div>
      </div>
    </div>
  )
}
