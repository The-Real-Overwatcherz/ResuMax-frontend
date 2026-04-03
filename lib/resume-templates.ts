import type { ResumeData, ExperienceEntry, EducationEntry, ProjectEntry } from './resume-types'

let idCounter = 0
export function generateId(): string {
  return `entry_${Date.now()}_${++idCounter}`
}

export function createEmptyContact(): ResumeData['contact'] {
  return {
    full_name: '',
    email: '',
    phone: '',
    linkedin: '',
    location: '',
  }
}

export function createEmptyExperience(): ExperienceEntry {
  return {
    id: generateId(),
    company: '',
    title: '',
    dates: '',
    bullets: [''],
    is_current: false,
  }
}

export function createEmptyEducation(): EducationEntry {
  return {
    id: generateId(),
    institution: '',
    degree: '',
    field: '',
    dates: '',
    gpa: '',
  }
}

export function createEmptyProject(): ProjectEntry {
  return {
    id: generateId(),
    name: '',
    description: '',
    technologies: [],
    bullets: [''],
    url: '',
  }
}

export function createEmptyResume(): ResumeData {
  return {
    contact: createEmptyContact(),
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
  }
}
