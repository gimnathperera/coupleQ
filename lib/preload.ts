import { useEffect, useState } from 'react'
import { preloadImages } from './utils'
import { preloadAnswerImages } from './image-service'

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

export function usePreloadAnswerImages(
  labels: string[],
  questionText?: string
) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (labels.length === 0) {
      setLoaded(true)
      return
    }

    preloadAnswerImages(labels, questionText)
      .then(() => setLoaded(true))
      .catch(() => setError(true))
  }, [labels, questionText])

  return { loaded, error }
}
