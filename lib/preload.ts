import { useEffect, useState } from 'react'
import { preloadImages } from './utils'

export function usePreloadImages(urls: string[]) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (urls.length === 0) {
      setLoaded(true)
      return
    }

    preloadImages(urls)
      .then(() => setLoaded(true))
      .catch(() => setError(true))
  }, [urls])

  return { loaded, error }
}
