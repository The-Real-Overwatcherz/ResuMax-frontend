'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export function DocumentParticles3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    const width = 450
    const height = 450
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Clear any previous dom element from strict mode
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild)
    }
    mountRef.current.appendChild(renderer.domElement)

    const masterGroup = new THREE.Group()
    scene.add(masterGroup)

    // Document Particle Generation
    const particleCount = 6000
    const positions = new Float32Array(particleCount * 3)
    const originalPositions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const colorBlue = new THREE.Color(0x4a9eff)
    const colorWhite = new THREE.Color(0xffffff)
    
    let p = 0
    for (let i = 0; i < particleCount; i++) {
      // 60% of particles form structured text lines, 40% form the paper body
      const isText = Math.random() > 0.4
      let x, y, z
      
      // Base paper bounds
      const docWidth = 4.5
      const docHeight = 6.3 // ~1:1.4 aspect ratio

      x = (Math.random() - 0.5) * docWidth
      y = (Math.random() - 0.5) * docHeight
      z = (Math.random() - 0.5) * 0.05
      
      let pColor = colorBlue.clone()
      
      if (isText) {
        // Map Y to dense bands
        const numLines = 14
        const lineIndex = Math.floor(Math.random() * numLines)
        
        // Add random slight variation inside the line thickness
        y = (lineIndex / numLines) * (docHeight * 0.8) - (docHeight * 0.4) + (Math.random() - 0.5) * 0.12
        
        // Indent lines and style headers differently
        if (lineIndex === 0 || lineIndex === 5 || lineIndex === 9) {
          // Headers
          x = (Math.random() - 0.5) * (docWidth * 0.6) - (docWidth * 0.15)
          pColor = colorWhite.clone()
        } else {
          // Regular bullet points
          x = (Math.random() - 0.5) * (docWidth * 0.8)
        }
      } else {
        // Body background scatter
        pColor.multiplyScalar(0.4) // Dim background
      }

      positions[p] = x
      positions[p+1] = y
      positions[p+2] = z

      originalPositions[p] = x
      originalPositions[p+1] = y
      originalPositions[p+2] = z
      
      colors[p] = pColor.r
      colors[p+1] = pColor.g
      colors[p+2] = pColor.b
      
      p += 3
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    })

    const particles = new THREE.Points(geometry, material)
    
    // Tilt it back slightly so you view the document dynamically in 3D
    particles.rotation.x = -Math.PI / 10
    particles.rotation.y = Math.PI / 6
    
    masterGroup.add(particles)

    // Animation tracking
    let animationId: number
    const clock = new THREE.Clock()

    // Interactive mouse positioning
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (event: MouseEvent) => {
        const windowHalfX = window.innerWidth / 2
        const windowHalfY = window.innerHeight / 2
        mouseX = (event.clientX - windowHalfX) * 0.001
        mouseY = (event.clientY - windowHalfY) * 0.001
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const animate = () => {
        animationId = requestAnimationFrame(animate)
        const time = clock.getElapsedTime()

        // 1. CPU-based Vertex undulating animation for the "data flow" wave
        const posAttr = geometry.attributes.position
        const posArray = posAttr.array as Float32Array
        
        for (let i = 0; i < particleCount; i++) {
          const px = originalPositions[i * 3]
          const py = originalPositions[i * 3 + 1]
          const pz = originalPositions[i * 3 + 2]
          
          // Apply a gentle traveling wave across the document
          const wave = Math.sin(px * 1.0 + time * 1.5) * 0.15 + 
                       Math.cos(py * 1.2 + time * 1.2) * 0.15
                       
          posArray[i * 3 + 2] = pz + wave
        }
        posAttr.needsUpdate = true

        // 2. Slow continuous rotation
        masterGroup.rotation.y = time * 0.1
        masterGroup.position.y = Math.sin(time * 1.0) * 0.2 // general floating

        // 3. Reactive mouse tilt (lerping towards target rotation)
        targetX = mouseX * 1.5
        targetY = mouseY * 1.5

        // apply additional rotational tilt from mouse but layered over active group
        masterGroup.rotation.x += (targetY - masterGroup.rotation.x) * 0.05
        
        // For Y, we need an inner group to separate mouse from constant rotation,
        // or just apply an offset.
        // Let's apply standard lerp.
        
        renderer.render(scene, camera)
    }

    animate()

    return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        cancelAnimationFrame(animationId)
        if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement)
        }
        
        geometry.dispose()
        material.dispose()
        renderer.dispose()
    }
  }, [])

  return (
    <div 
      className="relative flex items-center justify-center w-[350px] h-[350px] md:w-[450px] md:h-[450px] pointer-events-none"
    >
        <div ref={mountRef} className="absolute inset-0 flex items-center justify-center mix-blend-screen opacity-90" />
    </div>
  )
}
