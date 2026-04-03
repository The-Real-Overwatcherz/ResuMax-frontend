'use client'

interface SummaryStepProps {
  summary: string
  updateSummary: (value: string) => void
}

const MAX_CHARS = 500

export function SummaryStep({ summary, updateSummary }: SummaryStepProps) {
  const charCount = summary.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Professional Summary</h2>
        <p className="text-sm text-white/40">
          Write a brief overview of your qualifications and career goals.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-[#888] tracking-widest uppercase ml-1">
          Summary
        </label>
        <textarea
          value={summary}
          onChange={(e) => updateSummary(e.target.value)}
          rows={6}
          maxLength={MAX_CHARS}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4a9eff]/50 focus:ring-1 focus:ring-[#4a9eff]/50 transition-all font-mono resize-none"
          placeholder="Results-driven software engineer with 5+ years of experience building scalable web applications..."
        />
        <div className="flex justify-end">
          <span
            className={`text-xs font-mono ${
              charCount > MAX_CHARS * 0.9 ? 'text-amber-400' : 'text-white/30'
            }`}
          >
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      </div>
    </div>
  )
}
