'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export function AtomWireframe3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Setup Scene
    const scene = new THREE.Scene()
    
    // Setup Camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
    camera.position.z = 12

    // Setup Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    const width = 400
    const height = 400
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Clear any existing children (React StrictMode defense)
    while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild)
    }
    mountRef.current.appendChild(renderer.domElement)

    // Base orbital group that will rotate continuously
    const orbitalGroup = new THREE.Group()
    
    // Interactive group that tilts with mouse
    const interactiveGroup = new THREE.Group()
    interactiveGroup.add(orbitalGroup)
    scene.add(interactiveGroup)

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      linewidth: 1,
    })

    const geometriesToDispose: THREE.BufferGeometry[] = []
    
    // The image features several intersecting ellipses forming an atom-like structure
    const numEllipses = 4
    for (let i = 0; i < numEllipses; i++) {
        // We create an ellipse. It is flatter on one dimension.
        const curve = new THREE.EllipseCurve(
            0, 0,
            2.5, 5, // yRadius is larger
            0, 2 * Math.PI,
            false,
            0
        )
        const points = curve.getPoints(128)
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        geometriesToDispose.push(geometry)
        
        const ellipse = new THREE.LineLoop(geometry, material)
        
        // Rotate them along Z to spread them out in an asterisk/atom pattern
        ellipse.rotation.z = (i * Math.PI) / numEllipses
        // And slightly angle them outward on X and Y to give it 3D depth
        ellipse.rotation.x = Math.PI / 4
        
        orbitalGroup.add(ellipse)
    }

    // Outer faint boundary ring (from the image)
    const boundaryCurve = new THREE.EllipseCurve(
        0, 0,
        5.5, 5.5,
        0, 2 * Math.PI,
        false, 0
    )
    const boundaryGeo = new THREE.BufferGeometry().setFromPoints(boundaryCurve.getPoints(128))
    geometriesToDispose.push(boundaryGeo)
    const boundaryCircle = new THREE.LineLoop(boundaryGeo, new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.05
    }))
    orbitalGroup.add(boundaryCircle)

    // Animation variables
    let animationFrameId: number
    const clock = new THREE.Clock()

    // Mouse Tracking Setup
    let targetRotationX = 0
    let targetRotationY = 0
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (event: MouseEvent) => {
        // Normalize mouse coordinates (-1 to +1) based on screen
        const windowHalfX = window.innerWidth / 2
        const windowHalfY = window.innerHeight / 2
        mouseX = (event.clientX - windowHalfX) * 0.001
        mouseY = (event.clientY - windowHalfY) * 0.001
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Main animation loop
    const animate = () => {
        animationFrameId = requestAnimationFrame(animate)

        const time = clock.getElapsedTime()

        // 1. Constant slight rotation
        orbitalGroup.rotation.y = time * 0.1
        orbitalGroup.rotation.z = time * 0.05

        // 2. Mouse interactive tilt
        targetRotationY = mouseX * 2
        targetRotationX = mouseY * 2

        // Lerp towards target
        interactiveGroup.rotation.x += (targetRotationX - interactiveGroup.rotation.x) * 0.05
        interactiveGroup.rotation.y += (targetRotationY - interactiveGroup.rotation.y) * 0.05

        renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        cancelAnimationFrame(animationFrameId)
        if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement)
        }
        geometriesToDispose.forEach(geo => geo.dispose())
        material.dispose()
        renderer.dispose()
    }
  }, [])

  return (
    <div 
      className="relative flex items-center justify-center w-[280px] h-[280px] md:w-[400px] md:h-[400px] pointer-events-none"
    >
        <div ref={mountRef} className="absolute inset-0 flex items-center justify-center" />
    </div>
  )
}
