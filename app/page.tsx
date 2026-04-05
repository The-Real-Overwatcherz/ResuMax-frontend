'use client'

import dynamic from 'next/dynamic'
import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { PrecisionPipeline } from '@/components/landing/PrecisionPipeline'
import { ComponentsSection } from '@/components/landing/ComponentsSection'
import { FeedbackSection } from '@/components/landing/FeedbackSection'
import { OptimizerSection } from '@/components/landing/OptimizerSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { SiteFooter } from '@/components/landing/SiteFooter'
import { FeaturesShowcase } from '@/components/landing/FeaturesShowcase'
import { ShrutiShowcase } from '@/components/landing/ShrutiShowcase'

const SceneCanvas = dynamic(() => import('@/components/three/SceneCanvas'), {
  ssr: false,
})

export default function LandingPage() {
  return (
    <>
      <SceneCanvas />
      <div className="page-wrapper">
        <Navbar />
        <HeroSection />
        <PrecisionPipeline />
        <ComponentsSection />
        <FeedbackSection />
        <OptimizerSection />
        <FeaturesShowcase />
        <ShrutiShowcase />
        <PricingSection />
        <FAQSection />
        <SiteFooter />
      </div>
    </>
  )
}
