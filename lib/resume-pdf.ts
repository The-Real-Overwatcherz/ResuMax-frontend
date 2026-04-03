import type { ResumeData } from './resume-types'

/**
 * Opens a print dialog with the resume rendered as an A4 document.
 * The browser's "Save as PDF" option serves as the PDF export.
 */
export function printResume(resumeData: ResumeData) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const { contact, summary, experience, education, skills, certifications, projects, languages } = resumeData
  const hasText = (s: string | undefined) => s && s.trim().length > 0

  const contactParts: string[] = []
  if (hasText(contact.email)) contactParts.push(contact.email)
  if (hasText(contact.phone)) contactParts.push(contact.phone)
  if (hasText(contact.linkedin)) contactParts.push(contact.linkedin)
  if (hasText(contact.location)) contactParts.push(contact.location)

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${contact.full_name || 'Resume'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 10.5pt;
      line-height: 1.4;
      color: #1a1a1a;
      padding: 0.6in 0.75in;
    }
    h1 { font-size: 22pt; font-weight: 700; color: #111; }
    h2 {
      font-size: 11pt; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.05em; border-bottom: 1px solid #ddd;
      padding-bottom: 2px; margin-bottom: 6px; color: #111;
    }
    .contact { text-align: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #ccc; }
    .contact-info { font-size: 9pt; color: #666; margin-top: 4px; }
    .contact-info span + span::before { content: ' | '; color: #ccc; }
    section { margin-bottom: 12px; }
    .entry { margin-bottom: 10px; }
    .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
    .entry-title { font-weight: 600; }
    .entry-company { color: #444; }
    .entry-dates { font-size: 9pt; color: #888; white-space: nowrap; margin-left: 16px; }
    .entry-sub { color: #555; }
    ul { margin: 4px 0 0 16px; }
    li { margin-bottom: 2px; color: #333; }
    .tags { color: #555; }
    .tech { font-size: 9pt; color: #888; margin-top: 2px; }
    @media print {
      body { padding: 0; }
      @page { margin: 0.6in 0.75in; size: letter; }
    }
  </style>
</head>
<body>
  <div class="contact">
    ${hasText(contact.full_name) ? `<h1>${esc(contact.full_name)}</h1>` : ''}
    ${contactParts.length > 0 ? `<div class="contact-info">${contactParts.map(p => `<span>${esc(p)}</span>`).join('')}</div>` : ''}
  </div>

  ${hasText(summary) ? `<section><h2>Summary</h2><p>${esc(summary)}</p></section>` : ''}

  ${experience.length > 0 ? `<section><h2>Experience</h2>${experience.map(exp => `
    <div class="entry">
      <div class="entry-header">
        <div><span class="entry-title">${esc(exp.title)}</span>${hasText(exp.company) ? ` <span class="entry-company">— ${esc(exp.company)}</span>` : ''}</div>
        ${hasText(exp.dates) ? `<span class="entry-dates">${esc(exp.dates)}</span>` : ''}
      </div>
      ${exp.bullets.filter(b => b.trim()).length > 0 ? `<ul>${exp.bullets.filter(b => b.trim()).map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('')}</section>` : ''}

  ${education.length > 0 ? `<section><h2>Education</h2>${education.map(edu => `
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">${esc(edu.institution)}</span>
        ${hasText(edu.dates) ? `<span class="entry-dates">${esc(edu.dates)}</span>` : ''}
      </div>
      <div class="entry-sub">${esc(edu.degree)}${hasText(edu.field) ? ` in ${esc(edu.field)}` : ''}${hasText(edu.gpa) ? ` — GPA: ${esc(edu.gpa)}` : ''}</div>
    </div>
  `).join('')}</section>` : ''}

  ${skills.length > 0 ? `<section><h2>Skills</h2><p class="tags">${skills.map(s => esc(s)).join(' · ')}</p></section>` : ''}

  ${projects.length > 0 ? `<section><h2>Projects</h2>${projects.map(p => `
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">${esc(p.name)}</span>
        ${hasText(p.url) ? `<span class="entry-dates">${esc(p.url)}</span>` : ''}
      </div>
      ${hasText(p.description) ? `<p class="entry-sub">${esc(p.description)}</p>` : ''}
      ${p.technologies.length > 0 ? `<p class="tech">Technologies: ${p.technologies.map(t => esc(t)).join(', ')}</p>` : ''}
      ${p.bullets.filter(b => b.trim()).length > 0 ? `<ul>${p.bullets.filter(b => b.trim()).map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('')}</section>` : ''}

  ${certifications.length > 0 ? `<section><h2>Certifications</h2><p class="tags">${certifications.map(c => esc(c)).join(' · ')}</p></section>` : ''}

  ${languages.length > 0 ? `<section><h2>Languages</h2><p class="tags">${languages.map(l => esc(l)).join(' · ')}</p></section>` : ''}

  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`

  printWindow.document.write(html)
  printWindow.document.close()
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
