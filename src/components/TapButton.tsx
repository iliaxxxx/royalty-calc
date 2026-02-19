'use client'

import { useRef, useCallback, useEffect, useState } from 'react'

interface TapButtonProps {
  onPressStart: () => void
  onPressEnd: () => void
  disabled?: boolean
  isHolding?: boolean
  audioElement?: HTMLAudioElement | null
}

interface Particle {
  id: number
  x: number
  y: number
  angle: number
  speed: number
  size: number
  color: string
  life: number
  type?: 'burst' | 'stream' | 'spark'
}

export function TapButton({ onPressStart, onPressEnd, disabled, isHolding, audioElement }: TapButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const [audioLevel, setAudioLevel] = useState(0)
  const [isPressed, setIsPressed] = useState(false)
  const isPressedRef = useRef(false) // Track press state in ref for reliable release
  const [holdDuration, setHoldDuration] = useState(0)
  const holdStartRef = useRef<number>(0)
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const vibrationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Setup audio analyser for reactive visuals
  useEffect(() => {
    if (!audioElement) return

    const setupAudio = () => {
      if (audioContextRef.current) return

      try {
        const audioContext = new AudioContext()
        const analyser = audioContext.createAnalyser()
        const source = audioContext.createMediaElementSource(audioElement)

        analyser.fftSize = 256
        source.connect(analyser)
        analyser.connect(audioContext.destination)

        audioContextRef.current = audioContext
        analyserRef.current = analyser
      } catch (e) {
        // Audio context might already be connected
      }
    }

    audioElement.addEventListener('play', setupAudio)
    return () => {
      audioElement.removeEventListener('play', setupAudio)
    }
  }, [audioElement])

  // Analyze audio levels
  useEffect(() => {
    const analyze = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(dataArray)

        // Get average of low-mid frequencies (bass/vocals)
        const avg = dataArray.slice(0, 30).reduce((a, b) => a + b, 0) / 30
        setAudioLevel(avg / 255)
      }
      animationRef.current = requestAnimationFrame(analyze)
    }

    analyze()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += Math.cos(p.angle) * p.speed
        p.y += Math.sin(p.angle) * p.speed
        p.life -= 0.02
        p.speed *= 0.98

        if (p.life <= 0) return false

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fillStyle = p.color.replace('1)', `${p.life})`)
        ctx.fill()

        // Glow effect
        ctx.shadowBlur = 10
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.shadowBlur = 0

        return true
      })

      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Create particle explosion
  const createParticles = useCallback((type: 'start' | 'end') => {
    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.offsetWidth / 2
    const centerY = canvas.offsetHeight / 2

    // Vauvision colors
    const colors = type === 'start'
      ? ['rgba(171, 17, 21, 1)', 'rgba(226, 182, 63, 1)', 'rgba(221, 221, 221, 1)']
      : ['rgba(226, 182, 63, 1)', 'rgba(171, 17, 21, 1)', 'rgba(255, 255, 255, 1)']

    const particleCount = type === 'start' ? 16 : 24

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5
      particlesRef.current.push({
        id: Date.now() + i,
        x: centerX,
        y: centerY,
        angle,
        speed: type === 'start' ? 6 + Math.random() * 4 : 8 + Math.random() * 6,
        size: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        type: 'burst',
      })
    }
  }, [])

  // Create continuous particle stream while holding
  const createStreamParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.offsetWidth / 2
    const centerY = canvas.offsetHeight / 2

    // Vauvision orbiting sparkles
    const colors = [
      'rgba(226, 182, 63, 1)',
      'rgba(171, 17, 21, 1)',
      'rgba(221, 221, 221, 1)',
      'rgba(255, 255, 255, 1)',
    ]

    // Create 2-3 particles per tick
    for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 60 + Math.random() * 20
      particlesRef.current.push({
        id: Date.now() + Math.random(),
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        angle: angle + Math.PI / 2 + (Math.random() - 0.5) * 0.5,
        speed: 2 + Math.random() * 2,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.8 + Math.random() * 0.4,
        type: 'stream',
      })
    }

    // Create occasional sparks flying outward
    if (Math.random() < 0.3) {
      const sparkAngle = Math.random() * Math.PI * 2
      particlesRef.current.push({
        id: Date.now() + Math.random() + 1000,
        x: centerX,
        y: centerY,
        angle: sparkAngle,
        speed: 4 + Math.random() * 4,
        size: 1.5 + Math.random() * 2,
        color: 'rgba(255, 255, 255, 1)',
        life: 0.6 + Math.random() * 0.3,
        type: 'spark',
      })
    }
  }, [])


  const handlePressStart = useCallback(() => {
    if (disabled || isPressedRef.current) return

    setIsPressed(true)
    isPressedRef.current = true
    setHoldDuration(0)
    holdStartRef.current = Date.now()
    createParticles('start')

    // Start hold duration counter for visual effects
    holdIntervalRef.current = setInterval(() => {
      const newDuration = (Date.now() - holdStartRef.current) / 1000
      setHoldDuration(newDuration)
    }, 50)

    // Start continuous particle stream
    streamIntervalRef.current = setInterval(() => {
      createStreamParticles()
    }, 80)

    // Start continuous subtle vibration (pulsing)
    if (navigator.vibrate) {
      navigator.vibrate(15)
      vibrationIntervalRef.current = setInterval(() => {
        navigator.vibrate(8)
      }, 400)
    }

    onPressStart()
  }, [disabled, createParticles, createStreamParticles, onPressStart])


  const handlePressEnd = useCallback(() => {
    if (disabled || !isPressedRef.current) return

    setIsPressed(false)
    isPressedRef.current = false

    // Clean up intervals
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current)
      holdIntervalRef.current = null
    }
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current)
      streamIntervalRef.current = null
    }
    if (vibrationIntervalRef.current) {
      clearInterval(vibrationIntervalRef.current)
      vibrationIntervalRef.current = null
    }

    // Create big release explosion based on hold duration
    createParticles('end')

    // Add bonus particles for long holds
    const heldSeconds = (Date.now() - holdStartRef.current) / 1000
    if (heldSeconds > 1) {
      // Extra celebration particles for holding longer
      setTimeout(() => createParticles('end'), 100)
    }

    setHoldDuration(0)

    // Haptic feedback - satisfying double burst for end
    if (navigator.vibrate) {
      navigator.vibrate([15, 50, 25])
    }

    onPressEnd()
  }, [disabled, createParticles, onPressEnd])

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
      if (vibrationIntervalRef.current) clearInterval(vibrationIntervalRef.current)
    }
  }, [])

  // Global listeners to ensure release is always captured (even if finger moves off button)
  useEffect(() => {
    const handleGlobalEnd = () => {
      if (isPressedRef.current) {
        handlePressEnd()
      }
    }

    // Listen for touch/mouse end on document level
    document.addEventListener('mouseup', handleGlobalEnd)
    document.addEventListener('touchend', handleGlobalEnd)
    document.addEventListener('touchcancel', handleGlobalEnd)

    return () => {
      document.removeEventListener('mouseup', handleGlobalEnd)
      document.removeEventListener('touchend', handleGlobalEnd)
      document.removeEventListener('touchcancel', handleGlobalEnd)
    }
  }, [handlePressEnd])

  // Handle touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    handlePressStart()
  }, [handlePressStart])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    handlePressEnd()
  }, [handlePressEnd])

  // Scale based on audio level and press state
  const audioScale = 1 + audioLevel * 0.08
  const pressScale = isPressed || isHolding ? 0.92 : 1
  const finalScale = audioScale * pressScale

  // Intensity grows with hold duration (max at ~3 seconds)
  const holdIntensity = Math.min(holdDuration / 3, 1)
  const glowIntensity = isPressed || isHolding ? 0.6 + holdIntensity * 0.4 : 0.4 + audioLevel * 0.4
  const glowScale = isPressed || isHolding ? 1.2 + holdIntensity * 0.3 : 1 + audioLevel * 0.2

  return (
    <div className="tap-button-container relative">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Outer rotating rings */}
      <div className="tap-rings">
        <div
          className={`tap-ring tap-ring-1 ${isPressed || isHolding ? 'holding' : ''}`}
          style={{
            transform: `scale(${audioScale})`,
            animationDuration: isPressed || isHolding ? `${1.5 - holdIntensity}s` : '3s',
          }}
        />
        <div
          className={`tap-ring tap-ring-2 ${isPressed || isHolding ? 'holding' : ''}`}
          style={{
            transform: `scale(${audioScale})`,
            animationDuration: isPressed || isHolding ? `${2 - holdIntensity * 0.8}s` : '4s',
          }}
        />
        <div
          className={`tap-ring tap-ring-3 ${isPressed || isHolding ? 'holding' : ''}`}
          style={{
            transform: `scale(${audioScale})`,
            animationDuration: isPressed || isHolding ? `${2.5 - holdIntensity * 0.8}s` : '5s',
          }}
        />
      </div>

      {/* Energy buildup ring - Vauvision */}
      {(isPressed || isHolding) && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="50%"
            cy="50%"
            r="90"
            fill="none"
            stroke="rgba(226, 182, 63, 0.8)"
            strokeWidth="3"
            strokeLinecap="square"
            strokeDasharray={`${holdIntensity * 565} 565`}
            style={{
              filter: 'drop-shadow(0 0 6px rgba(226, 182, 63, 0.6))',
              transition: 'stroke-dasharray 0.1s ease',
            }}
          />
        </svg>
      )}

      {/* Glow backdrop */}
      <div
        className={`tap-glow ${isPressed || isHolding ? 'holding' : ''}`}
        style={{
          opacity: glowIntensity,
          transform: `scale(${glowScale})`,
        }}
      />

      {/* Main button */}
      <button
        ref={buttonRef}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={() => isPressed && handlePressEnd()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handlePressEnd}
        disabled={disabled}
        className={`tap-button-2026 ${disabled ? 'disabled' : ''} ${isPressed || isHolding ? 'holding' : ''}`}
        style={{
          transform: `scale(${finalScale})`,
          boxShadow: isPressed || isHolding
            ? `0 0 0 2px rgba(226, 182, 63, ${0.6 + holdIntensity * 0.4}),
               inset 0 2px 8px rgba(0, 0, 0, 0.3),
               0 4px ${20 + holdIntensity * 20}px rgba(226, 182, 63, ${0.3 + holdIntensity * 0.2})`
            : undefined,
        }}
      >
        <span className="tap-button-inner">
          <span className={`tap-text ${isPressed || isHolding ? 'holding' : ''}`}>
            {isPressed || isHolding ? '●' : 'ЖАТЬ'}
          </span>
          {!(isPressed || isHolding) && <span className="tap-subtext">зажми</span>}
        </span>

        {/* Inner shine effect */}
        <div className="tap-shine" />

        {/* Holding pulse rings - multiple with intensity */}
        {(isPressed || isHolding) && (
          <>
            <div className="tap-holding-pulse" />
            <div className="tap-holding-pulse" style={{ animationDelay: '0.4s' }} />
            {holdIntensity > 0.5 && (
              <div className="tap-holding-pulse" style={{ animationDelay: '0.8s' }} />
            )}
          </>
        )}
      </button>
    </div>
  )
}
