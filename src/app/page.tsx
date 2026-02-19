'use client'

import { useState } from 'react'
import { VauvisionLogo } from '@/components/VauvisionLogo'
import { RoyaltyCalculator } from '@/components/RoyaltyCalculator'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-light)] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
        <VauvisionLogo height="md" />
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-2">
            Калькулятор Роялти
          </h1>
          <p className="text-center text-[var(--text-secondary)] mb-8">
            Узнайте сколько вы заработаете на стриминге
          </p>
          
          <RoyaltyCalculator />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[var(--text-muted)] text-sm border-t border-[var(--border)]">
        © 2026 Vauvision. Все права защищены.
      </footer>
    </div>
  )
}
