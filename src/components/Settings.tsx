'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, X, Sun, Moon, Globe } from 'lucide-react'
import { useApp } from '@/lib/AppContext'
import { Language } from '@/lib/translations'

const languageNames: Record<Language, string> = {
  ru: 'Русский',
  en: 'English',
  es: 'Español'
}

const languageFlags: Record<Language, string> = {
  ru: '🇷🇺',
  en: '🇬🇧',
  es: '🇪🇸'
}

export function Settings() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, theme, toggleTheme, t } = useApp()

  return (
    <>
      {/* Settings button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-9 h-9 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--text-muted)] transition-all"
        title={t.settings.title}
      >
        <SettingsIcon className="w-4 h-4" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-[var(--bg-card)] rounded-lg p-6 w-full max-w-xs relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold mb-6 text-[var(--text-primary)]">
              {t.settings.title}
            </h3>

            {/* Theme toggle */}
            <div className="mb-6">
              <label className="text-sm text-[var(--text-secondary)] mb-2 block">
                {t.settings.theme}
              </label>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--bg-light)] border border-[var(--border)]"
              >
                <div className="flex items-center gap-3">
                  {theme === 'light' ? (
                    <Sun className="w-5 h-5 text-[var(--accent-yellow)]" />
                  ) : (
                    <Moon className="w-5 h-5 text-[var(--accent)]" />
                  )}
                  <span className="text-[var(--text-primary)]">
                    {theme === 'light' ? t.settings.light : t.settings.dark}
                  </span>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  theme === 'dark' ? 'bg-[var(--accent)]' : 'bg-[var(--text-muted)]'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              </button>
            </div>

            {/* Language selector */}
            <div>
              <label className="text-sm text-[var(--text-secondary)] mb-2 block flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t.settings.language}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['ru', 'en', 'es'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      language === lang
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'bg-[var(--bg-light)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--text-muted)]'
                    }`}
                  >
                    <span className="text-lg block mb-1">{languageFlags[lang]}</span>
                    <span className="text-xs">{languageNames[lang]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
