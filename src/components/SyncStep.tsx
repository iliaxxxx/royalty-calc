'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, ArrowLeft, Check, Undo2, HelpCircle, X } from 'lucide-react'
import { TapButton } from './TapButton'
import type { LyricLine } from '@/app/page'
import { useTranslation } from '@/lib/AppContext'

interface Props {
  audioUrl: string
  lyrics: LyricLine[]
  onComplete: (syncedLyrics: LyricLine[]) => void
  onBack: () => void
}

export function SyncStep({ audioUrl, lyrics: initialLyrics, onComplete, onBack }: Props) {
  const { t } = useTranslation()
  const audioRef = useRef<HTMLAudioElement>(null)
  const lyricsContainerRef = useRef<HTMLDivElement>(null)

  const [lyrics, setLyrics] = useState<LyricLine[]>(initialLyrics)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [canUndo, setCanUndo] = useState(false)
  const [isHolding, setIsHolding] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)

  const isComplete = currentIndex >= lyrics.length

  // Audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  // Play/pause
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [isPlaying])

  // Scroll to current line
  useEffect(() => {
    if (!lyricsContainerRef.current) return
    const line = lyricsContainerRef.current.children[currentIndex]
    line?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [currentIndex])

  // Constants for timing validation
  const MIN_DURATION = 0.01 // 10ms minimum line duration
  const MIN_GAP = 0.05 // 50ms minimum gap between lines

  // Handle press START - record start time
  const handlePressStart = useCallback(() => {
    if (!isPlaying || isComplete) return

    setIsHolding(true)

    // Calculate start time with minimum gap from previous line
    let startTime = currentTime
    if (currentIndex > 0) {
      const prevEndTime = lyrics[currentIndex - 1].endTime
      if (prevEndTime !== null && startTime < prevEndTime + MIN_GAP) {
        startTime = prevEndTime + MIN_GAP
      }
    }

    const newLyrics = [...lyrics]
    newLyrics[currentIndex] = {
      ...newLyrics[currentIndex],
      startTime,
      endTime: null // will be set on release
    }
    setLyrics(newLyrics)
  }, [isPlaying, isComplete, lyrics, currentIndex, currentTime])

  // Handle press END - record end time, move to next line
  const handlePressEnd = useCallback(() => {
    if (!isPlaying || isComplete || !isHolding) return

    setIsHolding(false)

    const newLyrics = [...lyrics]
    const startTime = newLyrics[currentIndex].startTime

    // Ensure minimum duration (10ms)
    let endTime = currentTime
    if (startTime !== null && endTime < startTime + MIN_DURATION) {
      endTime = startTime + MIN_DURATION
    }

    newLyrics[currentIndex] = {
      ...newLyrics[currentIndex],
      endTime
    }
    setLyrics(newLyrics)

    setCurrentIndex(prev => prev + 1)
    setCanUndo(true)
  }, [isPlaying, isComplete, isHolding, lyrics, currentIndex, currentTime])

  const handleUndo = useCallback(() => {
    if (currentIndex === 0) return

    const newLyrics = [...lyrics]
    newLyrics[currentIndex - 1] = {
      ...newLyrics[currentIndex - 1],
      startTime: null,
      endTime: null
    }
    setLyrics(newLyrics)
    setCurrentIndex(prev => prev - 1)
    setCanUndo(currentIndex > 1)
    setIsHolding(false)
  }, [currentIndex, lyrics])

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
    setLyrics(initialLyrics)
    setCurrentIndex(0)
    setIsPlaying(false)
    setCanUndo(false)
    setIsHolding(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const formatTimeShort = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="h-full flex flex-col bg-[var(--bg-light)]">
      <audio ref={audioRef} src={audioUrl} preload="auto" />

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="modal-overlay" onClick={() => setShowTutorial(false)}>
          <div
            className="glass-card p-6 mx-4 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTutorial(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-center mb-4 text-[var(--text-primary)]">
              {t.sync.tutorial.title}
            </h3>

            <div className="space-y-4 text-sm">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {num}
                  </div>
                  <p className="text-[var(--text-secondary)]" dangerouslySetInnerHTML={{
                    __html: t.sync.tutorial[`step${num}` as keyof typeof t.sync.tutorial]
                      .replace(/<accent>/g, '<span class="text-[var(--accent)] font-medium">')
                      .replace(/<\/accent>/g, '</span>')
                  }} />
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowTutorial(false)}
              className="btn-gradient w-full mt-6 py-3"
            >
              {t.sync.tutorial.got_it}
            </button>
          </div>
        </div>
      )}

      {/* Stats bar */}
      <div className="flex-shrink-0 px-4 py-3 glass-card mx-4 mb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-mono text-[var(--text-secondary)]">
            {formatTimeShort(currentTime)} / {formatTimeShort(duration)}
          </div>
          <div className="text-sm">
            <span className="text-[var(--text-secondary)]">{currentIndex}</span>
            <span className="text-[var(--text-muted)]">/{lyrics.length}</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Lyrics */}
      <div className="flex-1 overflow-auto scrollbar-hide px-4 py-2">
        <div ref={lyricsContainerRef} className="max-w-md mx-auto space-y-1">
          {lyrics.map((line, i) => (
            <div
              key={i}
              className={`lyrics-line text-center ${
                i === currentIndex ? (isHolding ? 'editing' : 'active') : ''
              } ${i < currentIndex ? 'done' : ''}`}
            >
              {i < currentIndex && (
                <Check className="inline w-4 h-4 mr-2 text-green-400" />
              )}
              {line.text}
              {line.startTime !== null && line.endTime !== null && i < currentIndex && (
                <span className="ml-2 text-xs text-[#999999]">
                  {formatTime(line.startTime)} → {formatTime(line.endTime)}
                </span>
              )}
              {i === currentIndex && isHolding && line.startTime !== null && (
                <span className="ml-2 text-xs text-green-400 animate-pulse">
                  {formatTime(line.startTime)} → ...
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 p-4 pb-8">
        {/* Play controls */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <button
            onClick={() => setShowTutorial(true)}
            className="w-11 h-11 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--text-muted)] transition-all"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button
            onClick={handleReset}
            className="w-11 h-11 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--text-muted)] transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/25 text-white hover:brightness-110 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </button>

          <button
            onClick={handleUndo}
            disabled={!canUndo || currentIndex === 0}
            className="h-11 px-4 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center gap-2 text-[var(--text-secondary)] hover:border-[var(--text-muted)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Undo2 className="w-4 h-4" />
            <span className="text-sm">{t.sync.undo}</span>
          </button>
        </div>

        {/* Tap button or Complete */}
        {isComplete ? (
          <button
            onClick={() => onComplete(lyrics)}
            className="btn-gradient w-full flex items-center justify-center gap-2 py-5"
          >
            <Check className="w-5 h-5" />
            {t.sync.complete}
          </button>
        ) : (
          <div className="flex flex-col items-center">
            <TapButton
              onPressStart={handlePressStart}
              onPressEnd={handlePressEnd}
              disabled={!isPlaying}
              isHolding={isHolding}
              audioElement={audioRef.current}
            />

            {!isPlaying && (
              <p className="text-center text-[var(--text-muted)] text-sm mt-4">
                {t.sync.hint}
              </p>
            )}
          </div>
        )}

        {/* Back button */}
        <button
          onClick={onBack}
          className="mt-4 w-full py-3 text-[var(--text-secondary)] flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.sync.back}
        </button>
      </div>
    </div>
  )
}
