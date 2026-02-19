'use client'

import { useState, useEffect } from 'react'
import { VauvisionLogo } from '@/components/VauvisionLogo'
import { ThemeToggle } from '@/components/ThemeToggle'

// Ставки роялти ($/стрим) по площадкам, странам и типам подписки
// Данные на основе отчётов дистрибьюторов 2024-2025
const RATES: Record<string, Record<string, Record<string, number>>> = {
  spotify: {
    russia: { premium: 0.0018, free: 0.0006 },
    usa: { premium: 0.0045, free: 0.0018 },
    europe: { premium: 0.0035, free: 0.0014 },
    asia: { premium: 0.0015, free: 0.0005 },
  },
  apple: {
    russia: { premium: 0.0035 },
    usa: { premium: 0.008 },
    europe: { premium: 0.006 },
    asia: { premium: 0.004 },
  },
  yandex: {
    russia: { premium: 0.0025, free: 0.0008 },
    usa: { premium: 0.0025, free: 0.0008 },
    europe: { premium: 0.0025, free: 0.0008 },
    asia: { premium: 0.0025, free: 0.0008 },
  },
  vk: {
    russia: { premium: 0.001, free: 0.0004 },
    usa: { premium: 0.001, free: 0.0004 },
    europe: { premium: 0.001, free: 0.0004 },
    asia: { premium: 0.001, free: 0.0004 },
  },
}

const PLATFORMS = [
  { id: 'spotify', name: 'Spotify', color: '#1DB954' },
  { id: 'apple', name: 'Apple Music', color: '#FC3C44' },
  { id: 'yandex', name: 'Яндекс Музыка', color: '#FFCC00' },
  { id: 'vk', name: 'VK Музыка', color: '#0077FF' },
]

const COUNTRIES = [
  { id: 'russia', name: 'Россия', flag: '🇷🇺' },
  { id: 'usa', name: 'США', flag: '🇺🇸' },
  { id: 'europe', name: 'Европа', flag: '🇪🇺' },
  { id: 'asia', name: 'Азия', flag: '🌏' },
]

const SUBSCRIPTION_TYPES = [
  { id: 'premium', name: 'Платная подписка' },
  { id: 'free', name: 'Бесплатная' },
]

const USD_TO_RUB = 92

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace('.0', '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toLocaleString('ru-RU')
}

function sliderToValue(slider: number): number {
  // Логарифмическая шкала: 0-100 → 0-100M
  if (slider === 0) return 0
  const minLog = Math.log(1000)
  const maxLog = Math.log(100000000)
  const scale = (maxLog - minLog) / 100
  return Math.round(Math.exp(minLog + scale * slider))
}

function valueToSlider(value: number): number {
  if (value <= 0) return 0
  if (value < 1000) return 0
  const minLog = Math.log(1000)
  const maxLog = Math.log(100000000)
  const scale = (maxLog - minLog) / 100
  return Math.round((Math.log(value) - minLog) / scale)
}

export default function Home() {
  const [sliderValue, setSliderValue] = useState(50)
  const [inputValue, setInputValue] = useState('1 000 000')
  const [country, setCountry] = useState('russia')
  const [subscription, setSubscription] = useState('premium')
  const [platform, setPlatform] = useState('spotify')
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<{ usd: number; rub: number } | null>(null)
  const [showContent, setShowContent] = useState(false)

  const numStreams = parseInt(inputValue.replace(/\s/g, '')) || 0

  useEffect(() => {
    setTimeout(() => setShowContent(true), 200)
  }, [])

  // Синхронизация слайдера и инпута
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slider = parseInt(e.target.value)
    setSliderValue(slider)
    const value = sliderToValue(slider)
    setInputValue(value.toLocaleString('ru-RU').replace(/,/g, ' '))
    setResult(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    if (raw === '') {
      setInputValue('')
      setSliderValue(0)
    } else {
      const num = Math.min(parseInt(raw), 100000000)
      setInputValue(num.toLocaleString('ru-RU').replace(/,/g, ' '))
      setSliderValue(valueToSlider(num))
    }
    setResult(null)
  }

  // Проверка доступности типа подписки
  const hasSubscriptionType = (sub: string) => {
    return RATES[platform]?.[country]?.[sub] !== undefined
  }

  // Автоматически переключить на premium если free недоступен
  useEffect(() => {
    if (subscription === 'free' && !hasSubscriptionType('free')) {
      setSubscription('premium')
    }
  }, [platform, country])

  const calculate = () => {
    if (numStreams === 0) return
    
    setIsCalculating(true)
    setResult(null)

    // Имитация загрузки
    setTimeout(() => {
      const rate = RATES[platform]?.[country]?.[subscription] || 0.001
      const usd = numStreams * rate
      const rub = usd * USD_TO_RUB
      setResult({ usd, rub })
      setIsCalculating(false)
    }, 800)
  }

  const selectedPlatform = PLATFORMS.find(p => p.id === platform)

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
      <main className="flex-1 flex flex-col items-center px-4 py-6 overflow-auto">
        <div className={`w-full max-w-md transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-wide mb-1">
              Рассчитай, сколько ты заработаешь
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              с музыки
            </p>
          </div>

          {/* Streams Input */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded p-5 mb-4">
            <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-4">
              Выбери количество прослушиваний
            </label>
            
            {/* Slider */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={handleSliderChange}
                className="w-full h-2 bg-[var(--border)] rounded-full appearance-none cursor-pointer accent-[var(--accent)]"
                style={{
                  background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${sliderValue}%, var(--border) ${sliderValue}%, var(--border) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>0</span>
                <span>100M</span>
              </div>
            </div>

            {/* Number Input */}
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full bg-[var(--bg-light)] border border-[var(--border)] rounded px-4 py-3 text-xl font-bold text-center text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>

          {/* Country Selection */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded p-5 mb-4">
            <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">
              Страна прослушиваний
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COUNTRIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setCountry(c.id); setResult(null) }}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded border text-sm font-medium transition-all ${
                    country === c.id
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-secondary)]'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subscription Type */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded p-5 mb-4">
            <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">
              Тип подписки слушателя
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SUBSCRIPTION_TYPES.map(s => {
                const available = hasSubscriptionType(s.id)
                return (
                  <button
                    key={s.id}
                    onClick={() => available && (setSubscription(s.id), setResult(null))}
                    disabled={!available}
                    className={`py-3 px-4 rounded border text-sm font-medium transition-all ${
                      !available
                        ? 'opacity-40 cursor-not-allowed bg-transparent text-[var(--text-muted)] border-[var(--border)]'
                        : subscription === s.id
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-secondary)]'
                    }`}
                  >
                    {s.name}
                  </button>
                )
              })}
            </div>
            {platform === 'apple' && (
              <p className="text-xs text-[var(--text-muted)] mt-2 text-center">
                Apple Music — только платная подписка
              </p>
            )}
          </div>

          {/* Platform Selection */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded p-5 mb-6">
            <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">
              Площадка
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setPlatform(p.id); setResult(null) }}
                  className={`py-3 px-4 rounded border text-sm font-medium transition-all ${
                    platform === p.id
                      ? 'text-white border-transparent'
                      : 'bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-secondary)]'
                  }`}
                  style={platform === p.id ? { backgroundColor: p.color } : {}}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculate}
            disabled={numStreams === 0 || isCalculating}
            className={`w-full py-4 rounded font-bold text-white uppercase tracking-wider transition-all ${
              numStreams === 0
                ? 'bg-[var(--border)] cursor-not-allowed'
                : 'bg-[var(--accent)] hover:brightness-110 active:scale-[0.98]'
            }`}
          >
            {isCalculating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Считаем...
              </span>
            ) : (
              'Рассчитать'
            )}
          </button>

          {/* Result */}
          {result && (
            <div 
              className="mt-6 bg-[var(--bg-card)] border border-[var(--border)] rounded p-6 text-center animate-fadeIn"
              style={{ animation: 'fadeIn 0.4s ease-out' }}
            >
              <p className="text-sm text-[var(--text-muted)] mb-2">
                Приблизительный доход с {formatNumber(numStreams)} прослушиваний
              </p>
              <p 
                className="text-4xl font-bold mb-1"
                style={{ color: selectedPlatform?.color }}
              >
                ₽{Math.round(result.rub).toLocaleString('ru-RU')}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                ${result.usd.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              
              <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
                {selectedPlatform?.name} • {COUNTRIES.find(c => c.id === country)?.name} • {SUBSCRIPTION_TYPES.find(s => s.id === subscription)?.name}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-center text-[var(--text-muted)] mt-6 px-2 leading-relaxed">
            * Указанная цифра приблизительная. Реальные выплаты зависят от многих факторов и не являются гарантией. Данные на основе отчётов дистрибьюторов по площадкам и территориям.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 py-4 text-center text-[var(--text-muted)] text-xs border-t border-[var(--border)] bg-[var(--bg-card)]">
        © 2026 Vauvision
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: var(--accent);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: var(--accent);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}
