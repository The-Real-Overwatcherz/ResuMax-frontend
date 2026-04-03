'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { CustomEase } from 'gsap/CustomEase'

// Register all plugins — must happen before any GSAP usage
gsap.registerPlugin(ScrollTrigger, TextPlugin, CustomEase)

// Custom cinematic eases
CustomEase.create('cinematic', 'M0,0 C0.76,0 0.24,1 1,1')
CustomEase.create('heavy-drop', 'M0,0 C0.215,0.61 0.355,1 1,1')
CustomEase.create('reveal', 'M0,0 C0.25,0.46 0.45,0.94 1,1')

// Global GSAP defaults
gsap.defaults({
  ease: 'power3.out',
  duration: 0.6,
})

// ScrollTrigger defaults
ScrollTrigger.defaults({
  markers: process.env.NODE_ENV === 'development' ? false : false, // disable markers even in dev for cleaner UX
  toggleActions: 'play none none reverse',
})

// Prevent laggy scroll after tab switch
gsap.ticker.lagSmoothing(500, 33)

export { gsap, ScrollTrigger, TextPlugin, CustomEase }
