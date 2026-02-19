'use client'

import { useState, useMemo } from 'react'

// Средние ставки роялти за 1 стрим (в долларах)
const PLATFORMS = [
  { id: 'spotify', name: 'Spotify', icon: '🎵', rate: 0.004, color: '#1DB954' },
  { id: 'apple', name: 'Apple Music', icon: '🍎', rate: 0.008, color: '#FC3C44' },
  { id: 'youtube', name: 'YouTube Music', icon: '▶️', rate: 0.002, color: '#FF0000' },
  { id: 'yandex', name: 'Яндекс Музыка', icon: '🔴', rate: 0.0025, color: '#FFCC00' },
  { id: 'vk', name: 'VK Музыка', icon: '💙', rate: 0.001, color: '#0077FF' },
  { id: 'deezer', name: 'Deezer', icon: '🎧', rate: 0.0064, color: '#FEAA2D' },
  { id: 'tidal', name: 'Tidal', icon: '🌊', rate: 0.0125, color: '#000000' },
  { id: 'amazon', name: 'Amazon Music', icon: '📦', rate: 0.004, color: '#FF9900' },
]

// Курс доллара к рублю
const USD_TO_RUB = 92

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toLocaleString('ru-RU')
}

function formatMoney(usd: number, showRub: boolean = true): string {
  if (usd < 0.01) return '< $0.01'
  const usdStr = '$' + usd.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (!showRub) return usdStr
  const rub = usd * USD_TO_RUB
  const rubStr = '₽' + rub.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  return `${usdStr} (${rubStr})`
}

export function RoyaltyCalculator() {
  const [streams, setStreams] = useState<string>('')
  const [showAllPlatforms, setShowAllPlatforms] = useState(false)

  const numStreams = parseInt(streams.replace(/\s/g, '')) || 0

  const calculations = useMemo(() => {
    return PLATFORMS.map(platform => ({
      ...platform,
      earnings: numStreams * platform.rate,
    })).sort((a, b) => b.earnings - a.earnings)
  }, [numStreams])

  const totalAverage = useMemo(() => {
    const avgRate = PLATFORMS.reduce((sum, p) => sum + p.rate, 0) / PLATFORMS.length
    return numStreams * avgRate
  }, [numStreams])

  const displayedPlatforms = showAllPlatforms ? calculations : calculations.slice(0, 4)

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
    <div className="space-y-6">
      {/* Input */}
      <div className="glass-card p-6">
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Количество прослушиваний
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={streams}
          onChange={handleInputChange}
          placeholder="Введите число"
          className="input-glass text-2xl font-bold text-center"
        />
        
        {/* Presets */}
        <div className="flex gap-2 mt-4">
          {presets.map(preset => (
            <button
              key={preset.value}
              onClick={() => setStreams(preset.value.toLocaleString('ru-RU').replace(/,/g, ' '))}
              className="flex-1 btn-secondary text-sm py-2"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {numStreams > 0 && (
        <>
          {/* Average */}
          <div className="glass-card p-6 text-center">
            <p className="text-sm text-[var(--text-secondary)] mb-1">
              Средний доход ({formatNumber(numStreams)} стримов)
            </p>
            <p className="text-3xl font-bold text-[var(--vinous)]">
              {formatMoney(totalAverage)}
            </p>
          </div>

          {/* Per Platform */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4 px-2">
              По платформам
            </h3>
            <div className="space-y-2">
              {displayedPlatforms.map(platform => (
                <div
                  key={platform.id}
                  className="flex items-center justify-between p-3 rounded hover:bg-[var(--bg-light)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{platform.icon}</span>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        {platform.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        ${platform.rate.toFixed(4)} / стрим
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-[var(--text-primary)]">
                    {formatMoney(platform.earnings, false)}
                  </p>
                </div>
              ))}
            </div>

            {!showAllPlatforms && calculations.length > 4 && (
              <button
                onClick={() => setShowAllPlatforms(true)}
                className="w-full mt-4 btn-secondary"
              >
                Показать все платформы
              </button>
            )}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-center text-[var(--text-muted)] px-4">
            * Ставки приблизительные и могут варьироваться в зависимости от страны слушателя, типа подписки и договора с дистрибьютором.
          </p>
        </>
      )}
    </div>
  )
}
