'use client'

import type { ResumeContact } from '@/lib/resume-types'
import { User, Mail, Phone, Linkedin, MapPin } from 'lucide-react'

const INPUT_CLASS =
  'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4a9eff]/50 focus:ring-1 focus:ring-[#4a9eff]/50 transition-all font-mono'
const LABEL_CLASS = 'text-xs font-mono text-[#888] tracking-widest uppercase ml-1'

interface ContactInfoStepProps {
  contact: ResumeContact
  updateContact: (field: keyof ResumeContact, value: string) => void
}

export function ContactInfoStep({ contact, updateContact }: ContactInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Contact Information</h2>
        <p className="text-sm text-white/40">Let employers know how to reach you.</p>
      </div>

      <div className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <label className={LABEL_CLASS}>Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              value={contact.full_name}
              onChange={(e) => updateContact('full_name', e.target.value)}
              className={`${INPUT_CLASS} pl-10`}
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={LABEL_CLASS}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="email"
                value={contact.email}
                onChange={(e) => updateContact('email', e.target.value)}
                className={`${INPUT_CLASS} pl-10`}
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className={LABEL_CLASS}>Phone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
                className={`${INPUT_CLASS} pl-10`}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="space-y-2">
          <label className={LABEL_CLASS}>LinkedIn</label>
          <div className="relative">
            <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="url"
              value={contact.linkedin}
              onChange={(e) => updateContact('linkedin', e.target.value)}
              className={`${INPUT_CLASS} pl-10`}
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className={LABEL_CLASS}>Location</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              value={contact.location}
              onChange={(e) => updateContact('location', e.target.value)}
              className={`${INPUT_CLASS} pl-10`}
              placeholder="San Francisco, CA"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
