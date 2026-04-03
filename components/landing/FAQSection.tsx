'use client'

import Accordion4, { type AccordionItemData } from '@/components/ui/accordion-4'

const FAQ_ITEMS: AccordionItemData[] = [
  {
    value: 'item-1',
    title: 'How does AI Optimization work?',
    content: 'Our SHRUTI AI deeply analyzes your resume against industry benchmarks and ATS rules, rewriting your bullet points for maximum impact and keyword density.'
  },
  {
    value: 'item-2',
    title: 'Is my personal data kept secure?',
    content: 'Absolutely. We do not store your parsed resume content permanently unless you save it to your dashboard. All processed data is anonymized before AI analysis.'
  },
  {
    value: 'item-3',
    title: 'Does this pass ATS systems?',
    content: 'Yes! The optimization explicitly optimizes formats and semantic structures that legacy and modern Applicant Tracking Systems look for.'
  },
  {
    value: 'item-4',
    title: 'Can I export to PDF or DOCX?',
    content: 'Once the AI has optimized your resume, you can export it instantly as an ATS-friendly PDF or as a Word DOCX file for quick fine-tuning.'
  },
  {
    value: 'item-5',
    title: 'Does it support different formats?',
    content: 'Our parser handles PDFs, Word documents, and text files. Just upload whatever you have, and we handle the complex text extraction.'
  }
];

export function FAQSection() {
  return (
    <section className="relative py-24 px-6 md:px-16" id="faq">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-24 items-start relative z-10">
        
        <div className="flex-1 md:sticky md:top-24 mt-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Got Questions?
          </h2>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-md">
            Everything you need to know about our resume analysis pipeline and exactly how we engineer your career moves.
          </p>
        </div>

        <div className="flex-1 w-full flex flex-col items-center justify-start md:items-end md:justify-center">
          <div className="w-full max-w-lg mt-8 md:mt-0">
            <Accordion4 items={FAQ_ITEMS} />
            <div className="w-full mt-4 flex justify-end">
              <a href="https://watermelon.sh" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.1em] text-emerald-400/50 hover:text-emerald-400 transition-colors">
                <span>UI by Watermelon</span>
                <span>🍉</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
