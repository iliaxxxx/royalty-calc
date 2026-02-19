'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Info } from 'lucide-react'
import type { LyricLine } from '@/app/page'
import { useTranslation } from '@/lib/AppContext'

interface Props {
  onNext: (artistName: string, trackName: string, lyrics: LyricLine[]) => void
  onBack: () => void
}

// Clean and format a lyric line
function formatLyricLine(text: string): string {
  let cleaned = text.trim()

  // Remove ALL trailing special characters (any non-letter, non-digit)
  // This handles: . , ! ? ; : ) ] } ( [ - — _ & * etc.
  cleaned = cleaned.replace(/[^\p{L}\p{N}]+$/gu, '')

  // Capitalize first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  }

  return cleaned
}

export function InfoStep({ onNext, onBack }: Props) {
  const { t, language } = useTranslation()
  const [artistName, setArtistName] = useState('')
  const [trackName, setTrackName] = useState('')
  const [lyricsText, setLyricsText] = useState('')
  const [showHint, setShowHint] = useState(false)

  const canProceed = artistName.trim() && trackName.trim() && lyricsText.trim()

  const handleSubmit = () => {
    if (!canProceed) return

    const lines = lyricsText
      .split('\n')
      .filter(line => line.trim())
      .map(text => ({
        text: formatLyricLine(text),
        startTime: null,
        endTime: null
      }))

    onNext(artistName.trim(), trackName.trim(), lines)
  }

  // Hint text based on language
  const hintText = {
    ru: {
      title: 'Правила оформления текста',
      rules: [
        'Каждая строка = одна фраза для синхронизации',
        'Знаки препинания в конце строк удаляются автоматически',
        'Первая буква каждой строки станет заглавной',
        'Пустые строки игнорируются'
      ],
      example: 'Пример:\nhello world,\nэто тест!\n\nСтанет:\nHello world\nЭто тест'
    },
    en: {
      title: 'Text formatting rules',
      rules: [
        'Each line = one phrase to sync',
        'Trailing punctuation is removed automatically',
        'First letter of each line is capitalized',
        'Empty lines are ignored'
      ],
      example: 'Example:\nhello world,\nthis is a test!\n\nBecomes:\nHello world\nThis is a test'
    },
    es: {
      title: 'Reglas de formato de texto',
      rules: [
        'Cada línea = una frase para sincronizar',
        'La puntuación final se elimina automáticamente',
        'La primera letra de cada línea se pone en mayúscula',
        'Las líneas vacías se ignoran'
      ],
      example: 'Ejemplo:\nhola mundo,\nesto es una prueba!\n\nResulta:\nHola mundo\nEsto es una prueba'
    }
  }[language]

  return (
    <div
      className="h-full flex flex-col bg-[var(--bg-light)]"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Hint Modal */}
      {showHint && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowHint(false)}>
          <div className="bg-[var(--bg-card)] rounded-lg p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-[var(--text-primary)] mb-3">{hintText.title}</h3>
            <ul className="space-y-2 mb-4">
              {hintText.rules.map((rule, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="text-[var(--accent)]">•</span>
                  {rule}
                </li>
              ))}
            </ul>
            <pre className="text-xs bg-[var(--bg-light)] p-3 rounded text-[var(--text-muted)] whitespace-pre-wrap">
              {hintText.example}
            </pre>
            <button
              onClick={() => setShowHint(false)}
              className="btn-gradient w-full mt-4 py-2 text-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain px-6 pt-6"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
        }}
      >
        <h2 className="text-xl font-bold mb-6 text-center text-[var(--text-primary)]">{t.info.title}</h2>

        <div className="space-y-4 max-w-md mx-auto pb-6">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">{t.info.artist}</label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder={t.info.artistPlaceholder}
              className="input-glass"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">{t.info.track}</label>
            <input
              type="text"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              placeholder={t.info.trackPlaceholder}
              className="input-glass"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
              {t.info.lyrics}
              <button
                onClick={() => setShowHint(true)}
                className="w-5 h-5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent)]/20 transition-colors"
              >
                <Info className="w-3 h-3" />
              </button>
            </label>
            <textarea
              value={lyricsText}
              onChange={(e) => setLyricsText(e.target.value)}
              placeholder={t.info.lyricsPlaceholder}
              rows={10}
              className="input-glass resize-none"
            />
          </div>

          {lyricsText && (
            <p className="text-sm text-[var(--text-muted)] text-center">
              {lyricsText.split('\n').filter(l => l.trim()).length} {t.info.linesCount}
            </p>
          )}
        </div>
      </div>

      {/* Fixed buttons at bottom */}
      <div
        className="flex-shrink-0 flex gap-3 p-4 bg-gradient-to-t from-[var(--bg-light)] via-[var(--bg-light)]/95 to-transparent"
        style={{
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        }}
      >
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          {t.info.back}
        </button>

        <button
          onClick={handleSubmit}
          disabled={!canProceed}
          className="flex-1 btn-gradient flex items-center justify-center gap-2"
        >
          {t.info.next}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
