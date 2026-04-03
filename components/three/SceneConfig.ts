import * as THREE from 'three'
import { threeScene } from '@/lib/three-scene'

export interface SceneLights {
  ambient: THREE.AmbientLight
  center: THREE.PointLight
  rim: THREE.PointLight
  directional: THREE.DirectionalLight
}

/**
 * Adds lights to the Three.js scene and returns references for animation.
 * Call once after threeScene.init().
 */
export function setupSceneLights(): SceneLights {
  const { scene } = threeScene

  // Ambient — very dim, preserves material darkness
  const ambient = new THREE.AmbientLight(0xffffff, 0.1)
  scene.add(ambient)

  // Center glow — blue, drives the cube cluster glow effect
  const center = new THREE.PointLight(0x4a9eff, 2, 20)
  center.position.set(0, 0, 0)
  scene.add(center)

  // Rim light — cool white from upper-left
  const rim = new THREE.PointLight(0xffffff, 0.5, 30)
  rim.position.set(-10, 10, 5)
  scene.add(rim)

  // Directional — fills mid-tones on cube faces
  const directional = new THREE.DirectionalLight(0xffffff, 0.3)
  directional.position.set(5, 10, 5)
  scene.add(directional)

  return { ambient, center, rim, directional }
}
