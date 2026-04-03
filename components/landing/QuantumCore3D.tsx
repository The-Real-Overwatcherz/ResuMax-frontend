'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export function QuantumCore3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentMount = mountRef.current
    if (!currentMount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    // Pull camera back enough to fit the large rings
    camera.position.z = 13

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    const width = 450
    const height = 450
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Clear any previous dom element from strict mode
    while (currentMount.firstChild) {
      currentMount.removeChild(currentMount.firstChild)
    }
    currentMount.appendChild(renderer.domElement)

    const masterGroup = new THREE.Group()
    scene.add(masterGroup)

    // 1. Center Crystal Core 
    const coreGeo = new THREE.IcosahedronGeometry(2.0, 0)
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.95, // Glass effect
      ior: 1.5,
      thickness: 2.0,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    })
    
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    masterGroup.add(coreMesh)

    // Inner wireframe (blue) to make the glass "pop" with internal structure
    const innerWireGeo = new THREE.IcosahedronGeometry(1.6, 1)
    const innerWireMat = new THREE.MeshBasicMaterial({
      color: 0x4a9eff, // ResuMax Blue
      wireframe: true,
      transparent: true,
      opacity: 0.4
    })
    const innerWireMesh = new THREE.Mesh(innerWireGeo, innerWireMat)
    masterGroup.add(innerWireMesh)

    // 2. Gyroscopic Containment Rings
    const ringGroup1 = new THREE.Group()
    const ringGroup2 = new THREE.Group()
    const ringGroup3 = new THREE.Group()
    masterGroup.add(ringGroup1, ringGroup2, ringGroup3)

    // Inner thicker ring
    const ringGeo1 = new THREE.TorusGeometry(3.2, 0.04, 16, 100)
    const ringMat1 = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 })
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1)
    ringMesh1.rotation.x = Math.PI / 2
    ringGroup1.add(ringMesh1)

    // Middle glowing blue ring
    const ringGeo2 = new THREE.TorusGeometry(3.8, 0.02, 16, 100)
    const ringMat2 = new THREE.MeshStandardMaterial({ 
        color: 0x4a9eff, 
        emissive: 0x4a9eff,
        emissiveIntensity: 1.5,
        transparent: true, 
        opacity: 0.8 
    })
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2)
    ringMesh2.rotation.y = Math.PI / 3
    ringGroup2.add(ringMesh2)

    // Outer subtle metallic ring
    const ringGeo3 = new THREE.TorusGeometry(4.5, 0.03, 16, 100)
    const ringMat3 = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.6, roughness: 0.4 })
    const ringMesh3 = new THREE.Mesh(ringGeo3, ringMat3)
    ringMesh3.rotation.z = Math.PI / 4
    ringGroup3.add(ringMesh3)

    // 3. Floating Orbital Particles 
    const particleGeo = new THREE.BufferGeometry()
    const particleCount = 60
    const posArray = new Float32Array(particleCount * 3)
    for(let i=0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 12
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const particleMat = new THREE.PointsMaterial({
        size: 0.06,
        color: 0x4a9eff,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    masterGroup.add(particles)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x4a9eff, 20, 20)
    pointLight.position.set(0, 0, 0)
    scene.add(pointLight)

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3)
    dirLight1.position.set(5, 5, 5)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.5)
    dirLight2.position.set(-5, -5, 5)
    scene.add(dirLight2)

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

        // Independent continuous rotations
        coreMesh.rotation.y = time * 0.2
        coreMesh.rotation.x = time * 0.1

        innerWireMesh.rotation.y = time * -0.3
        innerWireMesh.rotation.z = time * 0.15

        ringGroup1.rotation.y = time * 0.4
        ringGroup1.rotation.x = time * 0.1

        ringGroup2.rotation.x = time * 0.3
        ringGroup2.rotation.z = time * -0.2

        ringGroup3.rotation.y = time * -0.25
        ringGroup3.rotation.z = time * 0.1

        particles.rotation.y = time * 0.05
        particles.rotation.x = time * 0.02

        // Floating hover effect
        masterGroup.position.y = Math.sin(time * 1.5) * 0.2

        // Reactive mouse tilt (lerping towards target rotation)
        targetX = mouseX * 1.5
        targetY = mouseY * 1.5

        masterGroup.rotation.x += (targetY - masterGroup.rotation.x) * 0.05
        masterGroup.rotation.y += (targetX - masterGroup.rotation.y) * 0.05

        renderer.render(scene, camera)
    }

    animate()

    return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        cancelAnimationFrame(animationId)
        if (currentMount && renderer.domElement) {
            currentMount.removeChild(renderer.domElement)
        }
        
        coreGeo.dispose()
        innerWireGeo.dispose()
        ringGeo1.dispose()
        ringGeo2.dispose()
        ringGeo3.dispose()
        particleGeo.dispose()

        coreMat.dispose()
        innerWireMat.dispose()
        ringMat1.dispose()
        ringMat2.dispose()
        ringMat3.dispose()
        particleMat.dispose()
        
        renderer.dispose()
    }
  }, [])

  return (
    <div 
      className="relative flex items-center justify-center w-[350px] h-[350px] md:w-[450px] md:h-[450px] pointer-events-none"
    >
        <div ref={mountRef} className="absolute inset-0 flex items-center justify-center mix-blend-screen" />
    </div>
  )
}
