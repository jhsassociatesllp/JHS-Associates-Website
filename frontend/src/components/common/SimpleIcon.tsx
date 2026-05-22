import React from 'react'
import './SimpleIcon.css'

interface SimpleIconProps {
  type: string
  size?: number
  className?: string
}

/**
 * Professional icon component using CSS-based icons
 * Clean, business-appropriate icons similar to the sectors page
 */
export const SimpleIcon: React.FC<SimpleIconProps> = ({ 
  type, 
  size = 20, 
  className = '' 
}) => {
  return (
    <div 
      className={`simple-icon simple-icon--${type} ${className}`}
      style={{ 
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`
      }}
      role="img"
      aria-label={type}
    />
  )
}

export default SimpleIcon