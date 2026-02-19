'use client'

import { useTheme } from '@/lib/AppContext'

interface VauvisionLogoProps {
  height?: 'sm' | 'md' | 'lg'
}

const imgSizes = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-12',
}

export function VauvisionLogo({ height = 'md' }: VauvisionLogoProps) {
  const { theme } = useTheme()
  const src = theme === 'dark' ? '/logo-white.png' : '/logo-black.png'

  return (
    <a
      href="https://vauvision.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center"
    >
      <img
        src={src}
        alt="VAUVISION"
        className={`${imgSizes[height]} object-contain`}
      />
    </a>
  )
}
