import { useState } from 'react'

/**
 * CityPartnerAvatar — A reusable avatar component for partner images
 * in city pages. Falls back to a styled letter placeholder if the
 * image fails to load (404).
 */
export default function CityPartnerAvatar({
  image,
  name,
  className = '',
  imgClassName = '',
}: {
  image: string
  name: string
  className?: string
  imgClassName?: string
}) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className={className}>
      {!imgError ? (
        <img
          src={image}
          alt={name}
          className={imgClassName}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="city-avatar__placeholder">{name.charAt(0)}</div>
      )}
    </div>
  )
}
