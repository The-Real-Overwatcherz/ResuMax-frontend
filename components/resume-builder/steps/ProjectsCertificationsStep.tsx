'use client'

import type { ProjectEntry } from '@/lib/resume-types'
import { ProjectEntryForm } from '../ProjectEntryForm'
import { SkillTagInput } from '../SkillTagInput'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface ProjectsCertificationsStepProps {
  projects: ProjectEntry[]
  addProject: () => void
  updateProject: (id: string, updates: Partial<ProjectEntry>) => void
  removeProject: (id: string) => void
  certifications: string[]
  setCertifications: (certs: string[]) => void
}

export function ProjectsCertificationsStep({
  projects,
  addProject,
  updateProject,
  removeProject,
  certifications,
  setCertifications,
}: ProjectsCertificationsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Projects & Certifications</h2>
        <p className="text-sm text-white/40">
          Showcase your projects and professional certifications.
        </p>
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono text-white/60 tracking-wider uppercase">Projects</h3>
        {projects.map((entry, i) => (
          <ProjectEntryForm
            key={entry.id}
            entry={entry}
            index={i}
            onUpdate={(updates) => updateProject(entry.id, updates)}
            onRemove={() => removeProject(entry.id)}
          />
        ))}
        <Button
          variant="outline"
          onClick={addProject}
          className="w-full border-dashed border-white/10 text-white/50 hover:text-[#4a9eff] hover:border-[#4a9eff]/30 bg-transparent"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Certifications */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono text-white/60 tracking-wider uppercase">
          Certifications
        </h3>
        <SkillTagInput
          tags={certifications}
          onChange={setCertifications}
          placeholder="AWS Solutions Architect, Google Cloud Professional..."
        />
      </div>
    </div>
  )
}
