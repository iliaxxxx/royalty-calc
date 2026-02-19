'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/AppContext'
import { Settings } from './Settings'
import { VauvisionLogo } from './VauvisionLogo'

interface OnboardingStepProps {
  onStart: () => void
}

export function OnboardingStep({ onStart }: OnboardingStepProps) {
  const { t } = useTranslation()
  const [showWave, setShowWave] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    // Staggered animations
    const t1 = setTimeout(() => setShowWave(true), 300)
    const t2 = setTimeout(() => setShowText(true), 800)
    const t3 = setTimeout(() => setShowButton(true), 1200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg-light)] flex flex-col items-center justify-center p-6 relative">
      {/* Settings button in corner */}
      <div className="absolute top-4 right-4">
        <Settings />
      </div>

      {/* Vauvision Logo/Brand */}
      <div className="mb-6 animate-fade-in">
        <VauvisionLogo height="lg" />
      </div>

      {/* Main heading */}
      <h1 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-2 uppercase tracking-wide">
        {t.onboarding.title}
      </h1>
      <h2 className="text-sm text-[var(--text-secondary)] text-center mb-8 max-w-xs">
        {t.onboarding.subtitle}
      </h2>

      {/* Sound wave animation - Vauvision colors */}
      <div className={`my-6 transition-all duration-1000 ${showWave ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <div className="sound-wave-container">
          <svg width="280" height="80" viewBox="0 0 280 80" className="sound-wave">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="var(--accent-yellow)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              className="wave-path wave-1"
              d="M0,40 Q35,10 70,40 T140,40 T210,40 T280,40"
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="2"
            />
            <path
              className="wave-path wave-2"
              d="M0,40 Q35,70 70,40 T140,40 T210,40 T280,40"
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="2"
            />
            <path
              className="wave-path wave-3"
              d="M0,40 Q35,20 70,40 T140,40 T210,40 T280,40"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
          </svg>
        </div>
      </div>

      {/* Features list */}
      <div className={`max-w-xs mb-10 transition-all duration-700 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <ul className="space-y-2">
          {t.onboarding.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <span className="w-6 h-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Start button - Vauvision style */}
      <button
        onClick={onStart}
        className={`group relative px-12 py-4 bg-[var(--accent)] rounded font-bold text-white uppercase tracking-wider transition-all duration-300 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} hover:brightness-110 active:scale-95`}
      >
        <span className="relative z-10 flex items-center gap-3">
          {t.onboarding.start}
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>

      {/* Features hint */}
      <div className={`mt-12 flex gap-8 text-[var(--text-muted)] text-xs uppercase tracking-wide transition-all duration-700 delay-300 ${showButton ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          WAV / MP3
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          TTML
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          LRC
        </div>
      </div>
    </div>
  )
}
