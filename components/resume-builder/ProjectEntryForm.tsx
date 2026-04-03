'use client'

import type { ProjectEntry } from '@/lib/resume-types'
import { Trash2, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SkillTagInput } from './SkillTagInput'

const INPUT_CLASS =
  'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4a9eff]/50 focus:ring-1 focus:ring-[#4a9eff]/50 transition-all font-mono'
const LABEL_CLASS = 'text-xs font-mono text-[#888] tracking-widest uppercase ml-1'

interface ProjectEntryFormProps {
  entry: ProjectEntry
  onUpdate: (updates: Partial<ProjectEntry>) => void
  onRemove: () => void
  index: number
}

export function ProjectEntryForm({
  entry,
  onUpdate,
  onRemove,
  index,
}: ProjectEntryFormProps) {
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
          PROJECT #{index + 1}
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
          <label className={LABEL_CLASS}>Project Name</label>
          <input
            type="text"
            value={entry.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className={INPUT_CLASS}
            placeholder="My Awesome Project"
          />
        </div>
        <div className="space-y-2">
          <label className={LABEL_CLASS}>URL (optional)</label>
          <input
            type="url"
            value={entry.url}
            onChange={(e) => onUpdate({ url: e.target.value })}
            className={INPUT_CLASS}
            placeholder="github.com/user/project"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className={LABEL_CLASS}>Description</label>
        <textarea
          value={entry.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={2}
          className={`${INPUT_CLASS} resize-none`}
          placeholder="Brief description of the project..."
        />
      </div>

      <div className="space-y-2">
        <label className={LABEL_CLASS}>Technologies</label>
        <SkillTagInput
          tags={entry.technologies}
          onChange={(technologies) => onUpdate({ technologies })}
          placeholder="React, Node.js, PostgreSQL..."
        />
      </div>

      {/* Bullets */}
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Key Points</label>
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
                placeholder="Describe what you built or achieved..."
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
          Add Point
        </Button>
      </div>
    </div>
  )
}
