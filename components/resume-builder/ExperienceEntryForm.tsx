'use client'

import type { ExperienceEntry } from '@/lib/resume-types'
import { Trash2, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const INPUT_CLASS =
  'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4a9eff]/50 focus:ring-1 focus:ring-[#4a9eff]/50 transition-all font-mono'
const LABEL_CLASS = 'text-xs font-mono text-[#888] tracking-widest uppercase ml-1'

interface ExperienceEntryFormProps {
  entry: ExperienceEntry
  onUpdate: (updates: Partial<ExperienceEntry>) => void
  onRemove: () => void
  index: number
}

export function ExperienceEntryForm({
  entry,
  onUpdate,
  onRemove,
  index,
}: ExperienceEntryFormProps) {
  const updateBullet = (bulletIndex: number, value: string) => {
    const newBullets = [...entry.bullets]
    newBullets[bulletIndex] = value
    onUpdate({ bullets: newBullets })
  }

  const addBullet = () => {
    onUpdate({ bullets: [...entry.bullets, ''] })
  }

  const removeBullet = (bulletIndex: number) => {
    onUpdate({ bullets: entry.bullets.filter((_, i) => i !== bulletIndex) })
  }

  return (
    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-[#4a9eff] tracking-wider">
          EXPERIENCE #{index + 1}
        </span>
        <button
          onClick={onRemove}
          className="text-white/20 hover:text-red-400 transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={LABEL_CLASS}>Company</label>
          <input
            type="text"
            value={entry.company}
            onChange={(e) => onUpdate({ company: e.target.value })}
            className={INPUT_CLASS}
            placeholder="Google"
          />
        </div>
        <div className="space-y-2">
          <label className={LABEL_CLASS}>Job Title</label>
          <input
            type="text"
            value={entry.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className={INPUT_CLASS}
            placeholder="Senior Software Engineer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <label className={LABEL_CLASS}>Dates</label>
          <input
            type="text"
            value={entry.dates}
            onChange={(e) => onUpdate({ dates: e.target.value })}
            className={INPUT_CLASS}
            placeholder="Jan 2022 - Present"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer py-3">
          <input
            type="checkbox"
            checked={entry.is_current}
            onChange={(e) => onUpdate({ is_current: e.target.checked })}
            className="w-4 h-4 rounded border-white/20 bg-black/40 text-[#4a9eff] focus:ring-[#4a9eff]/50"
          />
          <span className="text-sm text-white/60 font-mono">Current position</span>
        </label>
      </div>

      {/* Bullets */}
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Bullet Points</label>
        <div className="space-y-2">
          {entry.bullets.map((bullet, bi) => (
            <div key={bi} className="flex gap-2 items-start">
              <span className="text-white/20 text-xs font-mono pt-3.5 w-4 text-right flex-shrink-0">
                {bi + 1}.
              </span>
              <textarea
                value={bullet}
                onChange={(e) => updateBullet(bi, e.target.value)}
                rows={2}
                className={`${INPUT_CLASS} resize-none flex-1`}
                placeholder="Describe your achievement or responsibility..."
              />
              {entry.bullets.length > 1 && (
                <button
                  onClick={() => removeBullet(bi)}
                  className="text-white/20 hover:text-red-400 transition-colors pt-3"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={addBullet}
          className="text-[#4a9eff]/70 hover:text-[#4a9eff] text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Bullet
        </Button>
      </div>
    </div>
  )
}
