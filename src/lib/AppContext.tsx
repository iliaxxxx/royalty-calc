'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language, Translations } from './translations'

type Theme = 'light' | 'dark'

interface AppContextType {
  // Language
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations

  // Theme
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru')
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Load saved preferences on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('vauvision-language') as Language
    const savedTheme = localStorage.getItem('vauvision-theme') as Theme

    if (savedLang && ['ru', 'en', 'es'].includes(savedLang)) {
      setLanguageState(savedLang)
    }

    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      setThemeState(savedTheme)
    }

    setMounted(true)
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('vauvision-theme', theme)
  }, [theme, mounted])

  // Save language preference
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('vauvision-language', lang)
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light')
  }

  const t = translations[language]

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <AppContext.Provider value={{
        language: 'ru',
        setLanguage,
        t: translations.ru,
        theme: 'light',
        setTheme,
        toggleTheme
      }}>
        {children}
      </AppContext.Provider>
    )
  }

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t,
      theme,
      setTheme,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Shorthand hooks
export function useTranslation() {
  const { t, language, setLanguage } = useApp()
  return { t, language, setLanguage }
}

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useApp()
  return { theme, setTheme, toggleTheme }
}
