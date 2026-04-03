/**
 * Resume builder types — mirrors backend ParsedResume (app/models/resume.py)
 */

export interface ResumeContact {
  full_name: string
  email: string
  phone: string
  linkedin: string
  location: string
}

export interface ExperienceEntry {
  id: string
  company: string
  title: string
  dates: string
  bullets: string[]
  is_current: boolean
}

export interface EducationEntry {
  id: string
  institution: string
  degree: string
  field: string
  dates: string
  gpa: string
}

export interface ProjectEntry {
  id: string
  name: string
  description: string
  technologies: string[]
  bullets: string[]
  url: string
}

export interface ResumeData {
  contact: ResumeContact
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  certifications: string[]
  projects: ProjectEntry[]
  languages: string[]
}

export type BuilderStep = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const STEP_CONFIG = [
  { label: 'Contact', icon: 'User' },
  { label: 'Summary', icon: 'FileText' },
  { label: 'Experience', icon: 'Briefcase' },
  { label: 'Education', icon: 'GraduationCap' },
  { label: 'Skills', icon: 'Wrench' },
  { label: 'Projects', icon: 'FolderOpen' },
  { label: 'Preview', icon: 'Eye' },
] as const
