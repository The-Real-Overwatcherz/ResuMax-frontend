'use client'

import { useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SkillTagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function SkillTagInput({ tags, onChange, placeholder = 'Type and press Enter...' }: SkillTagInputProps) {
  const [input, setInput] = useState('')

  const addTag = (value: string) => {
    const trimmed = value.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      addTag(input)
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-[#4a9eff]/50 focus-within:ring-1 focus-within:ring-[#4a9eff]/50 transition-all">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <Badge
            key={`${tag}-${i}`}
            variant="secondary"
            className="bg-[#4a9eff]/10 text-[#4a9eff] border border-[#4a9eff]/20 hover:bg-[#4a9eff]/20 px-2.5 py-1 text-xs font-mono gap-1"
          >
            {tag}
            <button
              onClick={() => removeTag(i)}
              className="ml-0.5 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input.trim() && addTag(input)}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-white placeholder-white/20 focus:outline-none font-mono py-1"
          placeholder={tags.length === 0 ? placeholder : ''}
        />
      </div>
    </div>
  )
}
