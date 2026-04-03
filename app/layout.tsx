import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { CustomCursor } from '@/components/ui/CustomCursor'

// Side-effect import — registers GSAP plugins (ScrollTrigger, TextPlugin, CustomEase)
// before any component in the tree can use them
import '@/lib/gsap-config'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm' })

export const metadata: Metadata = {
  title: 'ResuMax 2.0 — Your Resume, Engineered for Impact',
  description:
    'AI-powered resume optimizer. ATS scoring, bullet enhancement, skill matching. Built on AI. Optimized for Humans.',
  keywords: ['resume optimizer', 'ATS score', 'AI resume', 'job application'],
  openGraph: {
    title: 'ResuMax 2.0',
    description: 'Your resume, engineered for impact.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // #080808 on <html> prevents white flash before JS hydrates
    <html lang="en" style={{ backgroundColor: '#080808' }}>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${bebasNeue.variable} ${dmSans.variable} bg-resumax-950 text-white antialiased font-sans overflow-x-hidden`}>
        <LenisProvider>
          {children}
        </LenisProvider>
        <CustomCursor />
      </body>
    </html>
  )
}
