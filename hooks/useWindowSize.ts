import { useState, useEffect } from 'react'

interface WindowSize {
  width: number
  height: number
}

/**
 * Returns live window dimensions, updating on resize.
 * Used by SceneCanvas to keep Three.js renderer in sync with viewport.
 */
export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial size
    handleResize()

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}
