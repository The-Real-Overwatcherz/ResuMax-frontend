'use client'

import type { ResumeData } from '@/lib/resume-types'
import { ResumePreviewDocument } from './ResumePreviewDocument'

interface ResumePreviewProps {
  resumeData: ResumeData
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
  return (
    <div className="w-full max-w-[360px]">
      <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase mb-3 text-center">
        Live Preview
      </p>
      <div className="relative rounded-lg overflow-hidden border border-white/10 shadow-xl bg-white">
        <div
          className="origin-top-left"
          style={{
            transform: 'scale(0.44)',
            width: '8.5in',
            minHeight: '11in',
            transformOrigin: 'top left',
          }}
        >
          <ResumePreviewDocument resumeData={resumeData} />
        </div>
        {/* Scale the container height to match */}
        <div style={{ paddingBottom: '129.4%' }} className="pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" />
      </div>
    </div>
  )
}
