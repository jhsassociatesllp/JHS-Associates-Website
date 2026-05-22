import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook for lazy loading background images
 * @param imageUrl - The URL of the background image to load
 * @param threshold - Intersection threshold (0-1), default 0.1
 * @returns Object with ref to attach to element and loaded state
 */
export function useLazyBackground(imageUrl: string, threshold: number = 0.1) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const [error, setError] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(element)
        }
      },
      { threshold, rootMargin: '100px' }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold])

  useEffect(() => {
    if (!inView || !imageUrl) return

    const img = new Image()
    img.onload = () => {
      setLoaded(true)
      setError(false)
    }
    img.onerror = () => {
      setError(true)
      setLoaded(false)
    }
    img.src = imageUrl
  }, [inView, imageUrl])

  return {
    ref: elementRef,
    loaded,
    inView,
    error,
    style: loaded ? { backgroundImage: `url(${imageUrl})` } : {},
    className: `lazy-bg ${loaded ? 'loaded' : 'loading'} ${error ? 'error' : ''}`
  }
}