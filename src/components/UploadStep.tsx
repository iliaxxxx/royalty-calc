'use client'

import { useState, useRef } from 'react'
import { Upload, Music } from 'lucide-react'
import { useTranslation } from '@/lib/AppContext'

interface Props {
  onNext: (file: File, url: string) => void
}

// Supported audio extensions
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.wma', '.aiff']

function isAudioFile(file: File): boolean {
  // Check MIME type first
  if (file.type && file.type.startsWith('audio/')) {
    return true
  }

  // Fallback: check file extension (iOS Safari often doesn't provide MIME type)
  const fileName = file.name.toLowerCase()
  return AUDIO_EXTENSIONS.some(ext => fileName.endsWith(ext))
}

export function UploadStep({ onNext }: Props) {
  const { t } = useTranslation()
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!isAudioFile(file)) {
      alert('Please upload an audio file (MP3, WAV, M4A, etc.)')
      return
    }
    setFileName(file.name)
    const url = URL.createObjectURL(file)
    setTimeout(() => onNext(file, url), 500)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-[var(--bg-light)]">
      <div className="text-6xl mb-6">🎵</div>

      <h2 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">{t.upload.title}</h2>
      <p className="text-[var(--text-secondary)] text-center mb-8">
        {t.upload.subtitle}
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac,.aiff,audio/mpeg,audio/wav,audio/mp4,audio/x-m4a,audio/aac"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          w-full max-w-sm p-8 rounded bg-[var(--bg-card)] border-2 border-dashed cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-[var(--accent)] bg-[var(--accent)]/5'
            : 'border-[var(--border)] hover:border-[var(--text-muted)]'
          }
          ${fileName ? 'border-green-500 bg-green-500/5' : ''}
        `}
      >
        <div className="flex flex-col items-center">
          {fileName ? (
            <>
              <Music className="w-12 h-12 text-green-500 mb-4" />
              <p className="text-[var(--text-primary)] font-medium truncate max-w-full">{fileName}</p>
              <p className="text-green-500 text-sm mt-1">✓</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-[var(--text-muted)] mb-4" />
              <p className="text-[var(--text-secondary)]">{t.upload.dropzone}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
