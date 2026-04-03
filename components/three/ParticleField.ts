import * as THREE from 'three'
import { threeScene } from '@/lib/three-scene'

const PARTICLE_COUNT = 300
const SPREAD_X = 30
const SPREAD_Y = 20
const SPREAD_Z = 15

interface Particle {
  velocity: number // upward drift speed
  resetY: number   // y position where particle wraps back to bottom
}

/**
 * Floating dust particles that drift upward in the RAF loop.
 * Integrates smooth scroll-based parallax without moving out of bounds.
 */
export class ParticleField {
  private points!: THREE.Points
  private positions!: Float32Array
  private particles: Particle[] = []

  private targetScrollY = 0
  private currentScrollY = 0
  private lastScrollY = 0

  init(): void {
    const geometry = new THREE.BufferGeometry()
    this.positions = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random position inside a wide box to spread across the page
      this.positions[i * 3]     = (Math.random() - 0.5) * SPREAD_X
      this.positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_Y
      this.positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z

      this.particles.push({
        velocity: 0.002 + Math.random() * 0.004,
        resetY: -SPREAD_Y / 2,
      })
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.025,
      opacity: 0.5,
      transparent: true,
      sizeAttenuation: true,
    })

    this.points = new THREE.Points(geometry, material)
    threeScene.scene.add(this.points)

    if (typeof window !== 'undefined') {
      this.targetScrollY = window.scrollY
      this.currentScrollY = window.scrollY
      this.lastScrollY = window.scrollY
      window.addEventListener('scroll', this.onScroll, { passive: true })
    }
  }

  private onScroll = () => {
    this.targetScrollY = window.scrollY
  }

  /**
   * Call every frame. Drifts particles upward and wraps them when out of view.
   */
  update(): void {
    if (!this.positions) return

    // Lerp scroll for smooth parallax
    this.currentScrollY += (this.targetScrollY - this.currentScrollY) * 0.05
    
    // Calculate scroll delta
    const scrollDelta = this.currentScrollY - this.lastScrollY
    this.lastScrollY = this.currentScrollY

    // Apply slight scroll rotation parallax
    if (this.points) {
      this.points.rotation.y = this.currentScrollY * 0.0002
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Add drift velocity and scroll parallax delta to each particle
      this.positions[i * 3 + 1] += this.particles[i].velocity + (scrollDelta * 0.003)

      // Wrap back to bottom when particle exits top
      if (this.positions[i * 3 + 1] > SPREAD_Y / 2) {
        this.positions[i * 3 + 1] -= SPREAD_Y
      }
      // Wrap back to top when particle exits bottom (if scrolling up fast)
      else if (this.positions[i * 3 + 1] < -SPREAD_Y / 2) {
        this.positions[i * 3 + 1] += SPREAD_Y
      }
    }

    const attr = this.points.geometry.getAttribute('position') as THREE.BufferAttribute
    attr.needsUpdate = true
  }

  dispose(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll)
    }
    this.points.geometry.dispose()
    ;(this.points.material as THREE.Material).dispose()
    threeScene.scene.remove(this.points)
  }
}
