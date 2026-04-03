'use client'

import { forwardRef } from 'react'
import type { ResumeData } from '@/lib/resume-types'

interface ResumePreviewDocumentProps {
  resumeData: ResumeData
}

export const ResumePreviewDocument = forwardRef<HTMLDivElement, ResumePreviewDocumentProps>(
  function ResumePreviewDocument({ resumeData }, ref) {
    const { contact, summary, experience, education, skills, certifications, projects, languages } = resumeData

    const hasContent = (arr: unknown[]) => arr.length > 0
    const hasText = (s: string | undefined) => s && s.trim().length > 0

    return (
      <div
        ref={ref}
        className="bg-white text-black w-[8.5in] min-h-[11in] px-[0.75in] py-[0.6in] font-['Inter',sans-serif] text-[10.5pt] leading-[1.4]"
        id="resume-print-target"
      >
        {/* Header / Contact */}
        <div className="text-center mb-4 pb-3 border-b border-gray-300">
          {hasText(contact.full_name) && (
            <h1 className="text-[22pt] font-bold text-gray-900 tracking-tight leading-tight">
              {contact.full_name}
            </h1>
          )}
          <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[9pt] text-gray-600">
            {hasText(contact.email) && <span>{contact.email}</span>}
            {hasText(contact.phone) && (
              <>
                <span className="text-gray-300">|</span>
                <span>{contact.phone}</span>
              </>
            )}
            {hasText(contact.linkedin) && (
              <>
                <span className="text-gray-300">|</span>
                <span>{contact.linkedin}</span>
              </>
            )}
            {hasText(contact.location) && (
              <>
                <span className="text-gray-300">|</span>
                <span>{contact.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Summary */}
        {hasText(summary) && (
          <section className="mb-3">
            <h2 className="text-[11pt] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-0.5 mb-1.5">
              Summary
            </h2>
            <p className="text-gray-700">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {hasContent(experience) && (
          <section className="mb-3">
            <h2 className="text-[11pt] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-0.5 mb-1.5">
              Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-2.5">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-gray-900">{exp.title}</span>
                    {hasText(exp.company) && (
                      <span className="text-gray-600"> — {exp.company}</span>
                    )}
                  </div>
                  {hasText(exp.dates) && (
                    <span className="text-[9pt] text-gray-500 flex-shrink-0 ml-4">
                      {exp.dates}
                    </span>
                  )}
                </div>
                {exp.bullets.filter((b) => b.trim()).length > 0 && (
                  <ul className="mt-1 ml-4 list-disc text-gray-700 space-y-0.5">
                    {exp.bullets
                      .filter((b) => b.trim())
                      .map((bullet, bi) => (
                        <li key={bi}>{bullet}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {hasContent(education) && (
          <section className="mb-3">
            <h2 className="text-[11pt] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-0.5 mb-1.5">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-gray-900">{edu.institution}</span>
                  </div>
                  {hasText(edu.dates) && (
                    <span className="text-[9pt] text-gray-500 flex-shrink-0 ml-4">
                      {edu.dates}
                    </span>
                  )}
                </div>
                <div className="text-gray-700">
                  {edu.degree}
                  {hasText(edu.field) && ` in ${edu.field}`}
                  {hasText(edu.gpa) && ` — GPA: ${edu.gpa}`}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {hasContent(skills) && (
          <section className="mb-3">
            <h2 className="text-[11pt] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-0.5 mb-1.5">
              Skills
            </h2>
            <p className="text-gray-700">{skills.join(' · ')}</p>
          </section>
        )}

        {/* Projects */}
        {hasContent(projects) && (
          <section className="mb-3">
            <h2 className="text-[11pt] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-0.5 mb-1.5">
              Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-gray-900">{proj.name}</span>
                  {hasText(proj.url) && (
                    <span className="text-[9pt] text-gray-500 flex-shrink-0 ml-4">
                      {proj.url}
                    </span>
                  )}
                </div>
                {hasText(proj.description) && (
                  <p className="text-gray-600 text-[9.5pt]">{proj.description}</p>
                )}
                {proj.technologies.length > 0 && (
                  <p className="text-[9pt] text-gray-500 mt-0.5">
                    Technologies: {proj.technologies.join(', ')}
                  </p>
                )}
                {proj.bullets.filter((b) => b.trim()).length > 0 && (
                  <ul className="mt-1 ml-4 list-disc text-gray-700 space-y-0.5">
                    {proj.bullets
                      .filter((b) => b.trim())
                      .map((bullet, bi) => (
                        <li key={bi}>{bullet}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {hasContent(certifications) && (
          <section className="mb-3">
            <h2 className="text-[11pt] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-0.5 mb-1.5">
              Certifications
            </h2>
            <p className="text-gray-700">{certifications.join(' · ')}</p>
          </section>
        )}

        {/* Languages */}
        {hasContent(languages) && (
          <section className="mb-3">
            <h2 className="text-[11pt] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-0.5 mb-1.5">
              Languages
            </h2>
            <p className="text-gray-700">{languages.join(' · ')}</p>
          </section>
        )}
      </div>
    )
  },
)
