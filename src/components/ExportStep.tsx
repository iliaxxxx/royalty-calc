'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, RotateCcw, Copy, Check, Star, Play, Pause, Sliders } from 'lucide-react'
import type { LyricLine } from '@/app/page'
import { useTranslation } from '@/lib/AppContext'

interface Props {
  artistName: string
  trackName: string
  lyrics: LyricLine[]
  audioUrl?: string
  onNewProject: () => void
}

function formatLrcTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 100)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
}

function formatTtmlTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`
}

function generateLRC(artistName: string, trackName: string, lyrics: LyricLine[]): string {
  const lines: string[] = [
    `[ar:${artistName}]`,
    `[ti:${trackName}]`,
    `[by:Karaoke Tap]`,
    '',
  ]

  for (const line of lyrics) {
    if (line.startTime !== null) {
      lines.push(`[${formatLrcTime(line.startTime)}]${line.text}`)
    }
  }

  return lines.join('\n')
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function generateTTML(artistName: string, trackName: string, lyrics: LyricLine[]): string {
  const syncedLyrics = lyrics.filter(l => l.startTime !== null && l.endTime !== null)

  let ttml = `<?xml version="1.0" encoding="UTF-8"?>
<tt xmlns="http://www.w3.org/ns/ttml" xmlns:tts="http://www.w3.org/ns/ttml#styling" xmlns:itunes="http://itunes.apple.com/lyric-ttml-extensions" xmlns:ttm="http://www.w3.org/ns/ttml#metadata" xml:lang="en-US">
  <head>
    <metadata>
      <ttm:title>${escapeXml(trackName)}</ttm:title>
    </metadata>
    <ttm:agent xml:id="voice1" type="person">
      <ttm:name type="full">${escapeXml(artistName)}</ttm:name>
    </ttm:agent>
  </head>
  <body>
    <div>\n`

  for (const line of syncedLyrics) {
    const begin = formatTtmlTime(line.startTime!)
    const end = formatTtmlTime(line.endTime!)
    ttml += `<p begin="${begin}" end="${end}">${escapeXml(line.text)}</p>\n  `
  }

  ttml += `
    </div>
  </body>
</tt>`

  return ttml
}

export function ExportStep({ artistName, trackName, lyrics: initialLyrics, audioUrl, onNewProject }: Props) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [format, setFormat] = useState<'lrc' | 'ttml'>('ttml')
  const [lyrics, setLyrics] = useState(initialLyrics)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const [previewHighlight, setPreviewHighlight] = useState<number | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)

  const content = format === 'lrc'
    ? generateLRC(artistName, trackName, lyrics)
    : generateTTML(artistName, trackName, lyrics)

  const syncedCount = lyrics.filter(l => l.startTime !== null && l.endTime !== null).length
  const stars = syncedCount === lyrics.length ? 3 : syncedCount >= lyrics.length * 0.8 ? 2 : 1

  // Preview mode
  useEffect(() => {
    if (!isPreviewPlaying || !audioRef.current) return

    const audio = audioRef.current
    audio.play()

    const interval = setInterval(() => {
      const currentTime = audio.currentTime
      const activeIndex = lyrics.findIndex((line) => {
        if (line.startTime === null || line.endTime === null) return false
        return currentTime >= line.startTime && currentTime <= line.endTime
      })
      setPreviewHighlight(activeIndex >= 0 ? activeIndex : null)
    }, 50)

    return () => {
      clearInterval(interval)
      audio.pause()
    }
  }, [isPreviewPlaying, lyrics])

  const handleFineTune = (index: number, field: 'startTime' | 'endTime', delta: number) => {
    const MIN_DURATION = 0.01 // 10ms minimum line duration
    const MIN_GAP = 0.05 // 50ms minimum gap between lines

    const newLyrics = [...lyrics]
    const current = newLyrics[index][field]
    if (current === null) return

    let newValue = Math.max(0, current + delta)
    const line = newLyrics[index]

    if (field === 'startTime') {
      // startTime constraints:
      // 1. Must be at least MIN_GAP after previous line's endTime
      // 2. Must be at least MIN_DURATION before current line's endTime
      if (index > 0) {
        const prevEnd = newLyrics[index - 1].endTime
        if (prevEnd !== null) {
          newValue = Math.max(newValue, prevEnd + MIN_GAP)
        }
      }
      if (line.endTime !== null) {
        newValue = Math.min(newValue, line.endTime - MIN_DURATION)
      }
    } else {
      // endTime constraints:
      // 1. Must be at least MIN_DURATION after current line's startTime
      // 2. Must be at least MIN_GAP before next line's startTime
      if (line.startTime !== null) {
        newValue = Math.max(newValue, line.startTime + MIN_DURATION)
      }
      if (index < newLyrics.length - 1) {
        const nextStart = newLyrics[index + 1].startTime
        if (nextStart !== null) {
          newValue = Math.min(newValue, nextStart - MIN_GAP)
        }
      }
    }

    newLyrics[index] = {
      ...newLyrics[index],
      [field]: newValue
    }
    setLyrics(newLyrics)
  }

  const handlePlayFromTiming = (startTime: number | null) => {
    if (startTime === null || !audioRef.current) return
    audioRef.current.currentTime = startTime
    audioRef.current.play()
    setIsPreviewPlaying(true)
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${artistName} - ${trackName}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = content
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="h-full flex flex-col overflow-auto scrollbar-hide p-6 bg-[var(--bg-light)]">
      {audioUrl && <audio ref={audioRef} src={audioUrl} />}

      {/* Success header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
          <Check className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">{t.export.done}</h2>

        {/* Stars */}
        <div className="flex justify-center gap-1 mb-2">
          {[1, 2, 3].map(i => (
            <Star
              key={i}
              className={`w-6 h-6 star ${i <= stars ? 'filled' : 'empty'}`}
              fill={i <= stars ? 'currentColor' : 'none'}
            />
          ))}
        </div>

        <p className="text-[var(--text-secondary)]">
          {artistName} — {trackName}
        </p>
        <p className="text-[var(--text-muted)] text-sm">
          {t.export.synced} {syncedCount} {t.export.of} {lyrics.length} {t.export.lines}
        </p>
      </div>

      {/* Format selector */}
      <div className="flex gap-2 mb-4 max-w-sm mx-auto w-full">
        <button
          onClick={() => setFormat('ttml')}
          className={`flex-1 py-3 rounded text-sm font-bold uppercase transition-all ${
            format === 'ttml'
              ? 'btn-gradient'
              : 'bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--text-muted)]'
          }`}
        >
          TTML
        </button>
        <button
          onClick={() => setFormat('lrc')}
          className={`flex-1 py-3 rounded text-sm font-bold uppercase transition-all ${
            format === 'lrc'
              ? 'btn-gradient'
              : 'bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--text-muted)]'
          }`}
        >
          LRC
        </button>
      </div>

      {/* Preview button */}
      {audioUrl && (
        <button
          onClick={() => setIsPreviewPlaying(!isPreviewPlaying)}
          className="flex items-center justify-center gap-2 mb-4 max-w-sm mx-auto w-full py-3 rounded bg-[var(--bg-card)] border-2 border-[var(--accent)]/30 text-[var(--accent)] font-medium uppercase text-sm hover:bg-[var(--accent)]/5 transition-all"
        >
          {isPreviewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPreviewPlaying ? t.export.stop : t.export.preview}
        </button>
      )}

      {/* Lyrics with fine-tune */}
      <div className="glass-card p-4 mb-4 max-w-sm mx-auto w-full">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-[var(--text-primary)]">{t.export.timings}</span>
          <Sliders className="w-4 h-4 text-[var(--text-secondary)]" />
        </div>
        <div className="space-y-3 max-h-[40vh] overflow-auto scrollbar-hide">
          {lyrics.map((line, i) => (
            <div
              key={i}
              className={`flex flex-col gap-2 text-sm py-3 px-3 rounded-lg border cursor-pointer transition-colors ${
                previewHighlight === i
                  ? 'text-[#ab1115] bg-[#ab1115]/10 border-[#ab1115]/30'
                  : 'text-[var(--text-primary)] bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--accent)]/30'
              }`}
              onClick={() => handlePlayFromTiming(line.startTime)}
            >
              <div className="flex items-center gap-2">
                {line.startTime !== null && (
                  <Play className="w-3 h-3 text-[var(--accent)] flex-shrink-0" />
                )}
                <span className="truncate font-medium">{line.text}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {/* Start time */}
                <div className="flex items-center gap-1">
                  <span className="text-green-600 text-[10px]">▶</span>
                  <span className="font-mono text-[var(--text-muted)] min-w-[52px]">
                    {line.startTime !== null ? formatLrcTime(line.startTime) : '--:--'}
                  </span>
                  {line.startTime !== null && (
                    <div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleFineTune(i, 'startTime', -0.1)}
                        className="w-5 h-5 rounded bg-[var(--bg-light)] text-xs font-bold hover:bg-[var(--accent)]/10 text-[var(--text-primary)]"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleFineTune(i, 'startTime', 0.1)}
                        className="w-5 h-5 rounded bg-[var(--bg-light)] text-xs font-bold hover:bg-[var(--accent)]/10 text-[var(--text-primary)]"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[var(--text-muted)]">→</span>
                {/* End time */}
                <div className="flex items-center gap-1">
                  <span className="text-[#ab1115] text-[10px]">■</span>
                  <span className="font-mono text-[var(--text-muted)] min-w-[52px]">
                    {line.endTime !== null ? formatLrcTime(line.endTime) : '--:--'}
                  </span>
                  {line.endTime !== null && (
                    <div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleFineTune(i, 'endTime', -0.1)}
                        className="w-5 h-5 rounded bg-[var(--bg-light)] text-xs font-bold hover:bg-[var(--accent)]/10 text-[var(--text-primary)]"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleFineTune(i, 'endTime', 0.1)}
                        className="w-5 h-5 rounded bg-[var(--bg-light)] text-xs font-bold hover:bg-[var(--accent)]/10 text-[var(--text-primary)]"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="max-w-sm mx-auto w-full space-y-3 mt-auto">
        <button
          onClick={handleDownload}
          className="btn-gradient w-full flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          {t.export.download} .{format.toUpperCase()}
        </button>

        <button
          onClick={onNewProject}
          className="w-full py-4 rounded bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text-primary)] font-medium flex items-center justify-center gap-2 hover:border-[var(--text-muted)] transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          {t.export.newProject}
        </button>
      </div>
    </div>
  )
}
