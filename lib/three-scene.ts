import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

/**
 * ThreeScene — singleton pattern.
 * One scene, one camera, one renderer. Never create more than one.
 * Initialized once when SceneCanvas mounts. Referenced by CubeSystem, ParticleField, etc.
 */
class ThreeScene {
  scene!: THREE.Scene
  camera!: THREE.PerspectiveCamera
  renderer!: THREE.WebGLRenderer
  composer!: EffectComposer

  private _initialized = false

  init(canvas: HTMLCanvasElement): void {
    if (this._initialized) return
    this._initialized = true

    // ─── Scene ───────────────────────────────────────────────────────────────
    this.scene = new THREE.Scene()
    // Fog matches bg color — cubes fade into void at distance
    this.scene.fog = new THREE.Fog(0x080808, 15, 30)

    // ─── Camera ──────────────────────────────────────────────────────────────
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    this.camera.position.set(0, 2, 12)
    this.camera.lookAt(0, 0, 0)

    // ─── Renderer ────────────────────────────────────────────────────────────
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true, // transparent bg — page bg (#080808) shows through
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 0.8

    // ─── Post-processing ─────────────────────────────────────────────────────
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))

    // Subtle bloom — only very bright areas glow (threshold: 0.9)
    this.composer.addPass(
      new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.4,  // strength
        0.8,  // radius
        0.9   // threshold — only center glow & score rings bloom
      )
    )
  }

  /**
   * Call on window resize to keep everything in sync with viewport.
   */
  resize(): void {
    if (!this._initialized) return

    const w = window.innerWidth
    const h = window.innerHeight

    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
    this.composer.setSize(w, h)
  }

  /**
   * Check if the singleton has been initialized.
   */
  get isInitialized(): boolean {
    return this._initialized
  }

  /**
   * Dispose all resources (call on unmount in extreme cases).
   */
  dispose(): void {
    if (!this._initialized) return
    this.renderer.dispose()
    this.composer.dispose()
    this._initialized = false
  }
}

// Singleton instance — imported and used across all Three.js components
export const threeScene = new ThreeScene()
