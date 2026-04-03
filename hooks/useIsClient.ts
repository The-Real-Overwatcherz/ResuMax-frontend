import { useState, useEffect } from 'react'

/**
 * Returns true only after the component has mounted on the client.
 * Use this as an SSR guard for any code that references window/document.
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
