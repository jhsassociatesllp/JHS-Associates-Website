import React, { useState, useRef, useEffect } from 'react'
import './LazyImage.css'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  placeholder?: string
  threshold?: number
  className?: string
  onLoad?: () => void
  onError?: () => void
  fallbackSrc?: string
}

/**
 * LazyImage component with intersection observer and loading states
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  threshold = 0.1,
  className = '',
  onLoad,
  onError,
  fallbackSrc,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const [error, setError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(img)
        }
      },
      { threshold, rootMargin: '50px' }
    )

    observer.observe(img)

    return () => {
      observer.unobserve(img)
    }
  }, [threshold])

  const handleLoad = () => {
    setLoaded(true)
    setError(false)
    onLoad?.()
  }

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      return
    }
    setError(true)
    onError?.()
  }

  // Generate a simple placeholder SVG
  const placeholderSvg = placeholder || `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial, sans-serif" font-size="14">
        Loading...
      </text>
    </svg>
  `)}`

  return (
    <img
      ref={imgRef}
      src={inView ? currentSrc : placeholderSvg}
      alt={alt}
      className={`lazy-image ${className} ${loaded ? 'loaded' : 'loading'} ${error ? 'error' : ''}`}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  )
}

export default LazyImage