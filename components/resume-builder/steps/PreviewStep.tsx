'use client'

import type { ResumeData } from '@/lib/resume-types'
import { ResumePreviewDocument } from '../ResumePreviewDocument'
import { Button } from '@/components/ui/button'
import { Download, FileText, Sparkles } from 'lucide-react'

interface PreviewStepProps {
  resumeData: ResumeData
  onExportPDF: () => void
  onExportDOCX: () => void
}

export function PreviewStep({ resumeData, onExportPDF, onExportDOCX }: PreviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Preview & Export</h2>
          <p className="text-sm text-white/40">
            Review your resume and download it.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onExportPDF}
            className="bg-[#4a9eff] hover:bg-[#4a9eff]/80 text-white shadow-[0_0_15px_rgba(74,158,255,0.2)]"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button
            onClick={onExportDOCX}
            variant="outline"
            className="border-white/10 text-white/70 hover:text-white bg-transparent"
          >
            <FileText className="w-4 h-4 mr-2" />
            DOCX
          </Button>
        </div>
      </div>

      {/* Full-size preview */}
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-white mx-auto max-w-[680px] shadow-2xl">
        <div className="overflow-auto max-h-[70vh]">
          <div
            className="origin-top-left"
            style={{
              transform: 'scale(0.78)',
              width: '8.5in',
              transformOrigin: 'top left',
            }}
          >
            <ResumePreviewDocument resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  )
}
