'use client'

import { useState, useEffect, useMemo } from 'react'
import { VauvisionLogo } from '@/components/VauvisionLogo'
import { ThemeToggle } from '@/components/ThemeToggle'

// Платформы с актуальными ставками ($/стрим)
const PLATFORMS = [
  { 
    id: 'spotify', 
    name: 'Spotify', 
    rate: 0.004,
    color: '#1DB954',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    )
  },
  { 
    id: 'apple', 
    name: 'Apple Music', 
    rate: 0.008,
    color: '#FC3C44',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.401-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03c.525 0 1.048-.034 1.57-.1.823-.106 1.597-.35 2.296-.81.84-.553 1.472-1.287 1.88-2.208.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.785-.455-2.107-1.47-.243-.76-.078-1.455.49-2.02.386-.383.883-.594 1.413-.7.304-.06.61-.09.92-.13.32-.05.636-.1.928-.23.086-.04.168-.097.21-.183.06-.128.084-.272.084-.414V9.844a.39.39 0 00-.043-.193c-.052-.087-.14-.132-.242-.105-.238.063-.477.12-.716.18l-3.476.907c-.326.083-.65.17-.975.254-.128.033-.193.12-.203.25-.003.028 0 .058 0 .087v7.49c0 .404-.057.8-.232 1.17-.287.605-.77.99-1.408 1.17-.366.104-.74.15-1.12.16-.988.024-1.835-.46-2.148-1.494-.24-.79-.063-1.506.53-2.076.395-.378.89-.584 1.418-.688.34-.067.686-.107 1.028-.16.253-.04.503-.093.736-.2.18-.084.31-.21.362-.405.03-.118.046-.238.046-.36V6.728c0-.18.03-.345.12-.503.117-.205.306-.31.527-.36.238-.054.478-.1.72-.15l4.856-1.133c.39-.09.78-.178 1.17-.27.228-.052.39.033.476.238.04.098.06.206.06.314v5.25z"/>
      </svg>
    )
  },
  { 
    id: 'yandex', 
    name: 'Яндекс Музыка', 
    rate: 0.0025,
    color: '#FFCC00',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c4.142 0 7.5 3.358 7.5 7.5s-3.358 7.5-7.5 7.5S4.5 16.142 4.5 12 7.858 4.5 12 4.5z"/>
      </svg>
    )
  },
  { 
    id: 'vk', 
    name: 'VK Музыка', 
    rate: 0.001,
    color: '#0077FF',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.57 4 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.847 2.49 2.27 4.675 2.862 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.644v3.473c0 .372.17.508.271.508.22 0 .407-.136.814-.542 1.253-1.406 2.149-3.574 2.149-3.574.119-.254.305-.491.729-.491h1.744c.525 0 .644.27.525.644-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.491-.085.744-.576.744z"/>
      </svg>
    )
  },
]

const USD_TO_RUB = 92

function formatNumber(num: number): string {
  return num.toLocaleString('ru-RU')
}

function formatMoney(usd: number): { usd: string; rub: string } {
  const rub = usd * USD_TO_RUB
  return {
    usd: '$' + usd.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    rub: '₽' + Math.round(rub).toLocaleString('ru-RU')
  }
}

export default function Home() {
  const [streams, setStreams] = useState('')
  const [showContent, setShowContent] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const numStreams = parseInt(streams.replace(/\s/g, '')) || 0

  useEffect(() => {
    setTimeout(() => setShowContent(true), 200)
  }, [])

  useEffect(() => {
    if (numStreams > 0) {
      setShowResults(true)
    }
  }, [numStreams])

  const calculations = useMemo(() => {
    return PLATFORMS.map(platform => ({
      ...platform,
      earnings: numStreams * platform.rate,
    })).sort((a, b) => b.earnings - a.earnings)
  }, [numStreams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    if (value === '') {
      setStreams('')
    } else {
      const num = parseInt(value)
      setStreams(num.toLocaleString('ru-RU').replace(/,/g, ' '))
    }
  }

  const presets = [
    { label: '10K', value: 10000 },
    { label: '100K', value: 100000 },
    { label: '1M', value: 1000000 },
    { label: '10M', value: 10000000 },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-light)] flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 p-4 bg-[var(--bg-card)] border-b border-[var(--border)]">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="w-9" />
          <VauvisionLogo height="md" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-8 overflow-auto">
        <div className={`w-full max-w-md transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-wide mb-2">
              Калькулятор Роялти
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Узнайте доход от стриминга на популярных площадках
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded p-6 mb-6">
            <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">
              Количество прослушиваний
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={streams}
              onChange={handleInputChange}
              placeholder="0"
              className="w-full bg-transparent border-b-2 border-[var(--border)] focus:border-[var(--accent)] text-3xl font-bold text-center text-[var(--text-primary)] py-3 outline-none transition-colors"
            />
            
            {/* Presets */}
            <div className="flex gap-2 mt-6">
              {presets.map(preset => (
                <button
                  key={preset.value}
                  onClick={() => setStreams(preset.value.toLocaleString('ru-RU').replace(/,/g, ' '))}
                  className={`flex-1 py-2 text-sm font-medium rounded border transition-all ${
                    numStreams === preset.value
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-secondary)]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {numStreams > 0 && (
            <div className={`space-y-4 transition-all duration-500 ${showResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              
              {/* Platform Cards */}
              {calculations.map((platform, index) => {
                const money = formatMoney(platform.earnings)
                return (
                  <div
                    key={platform.id}
                    className="bg-[var(--bg-card)] border border-[var(--border)] rounded p-4 transition-all duration-300"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.4s ease-out forwards'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${platform.color}15`, color: platform.color }}
                      >
                        {platform.icon}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-[var(--text-primary)]">
                            {platform.name}
                          </h3>
                          <span className="text-lg font-bold" style={{ color: platform.color }}>
                            {money.rub}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                          <span>${platform.rate.toFixed(4)} / стрим</span>
                          <span>{money.usd}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Disclaimer */}
              <p className="text-xs text-center text-[var(--text-muted)] pt-4 pb-8">
                * Ставки приблизительные и зависят от страны слушателя, типа подписки и условий дистрибьютора
              </p>
            </div>
          )}

          {/* Empty State */}
          {numStreams === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                Введите количество прослушиваний<br />для расчёта дохода
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 py-4 text-center text-[var(--text-muted)] text-xs border-t border-[var(--border)] bg-[var(--bg-card)]">
        © 2026 Vauvision
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
