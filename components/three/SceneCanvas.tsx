'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { threeScene } from '@/lib/three-scene'
import { ParticleField } from './ParticleField'

export default function SceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Init scene
    threeScene.init(canvasRef.current)

    // Add ambient light (dim)
    const ambient = new THREE.AmbientLight(0xffffff, 0.15)
    threeScene.scene.add(ambient)

    // Center glow
    const centerLight = new THREE.PointLight(0x4a9eff, 1.5, 20)
    centerLight.position.set(0, 0, 0)
    threeScene.scene.add(centerLight)

    // Particles
    const particles = new ParticleField()
    particles.init()

    // Handle resize
    const onResize = () => threeScene.resize()
    window.addEventListener('resize', onResize)

    // RAF loop
    let frameId: number
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      particles.update()
      threeScene.composer.render()
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      particles.dispose()
      threeScene.scene.remove(ambient)
      threeScene.scene.remove(centerLight)
      threeScene.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="three-bg"
    />
  )
}
