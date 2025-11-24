import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext, type ThemeContextValue, type ThemePreference } from './theme-context'

const DEFAULT_STORAGE_KEY = 'gunadarma-theme'

const getSystemTheme = (): ThemeContextValue['resolvedTheme'] =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const getStoredPreference = (fallback: ThemePreference, key: string): ThemePreference => {
  if (typeof window === 'undefined') {
    return fallback
  }

  const stored = window.localStorage.getItem(key) as ThemePreference | null
  return stored ?? fallback
}

const applyThemeToDocument = (
  mode: ThemePreference,
  computedTheme: ThemeContextValue['resolvedTheme'],
): void => {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.dataset.theme = computedTheme
  root.dataset.themeMode = mode
  root.classList.remove('theme-light', 'theme-dark')
  root.classList.add(`theme-${computedTheme}`)
  root.style.setProperty('color-scheme', computedTheme)
}

const useSystemTheme = (): ThemeContextValue['resolvedTheme'] => {
  const [systemTheme, setSystemTheme] = useState<ThemeContextValue['resolvedTheme']>(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }

    return getSystemTheme()
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (event: MediaQueryListEvent): void => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return systemTheme
}

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: ThemePreference
  storageKey?: string
}

const ThemeProvider = ({
  children,
  defaultTheme = 'system',
  storageKey = DEFAULT_STORAGE_KEY,
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemePreference>(() =>
    getStoredPreference(defaultTheme, storageKey),
  )
  const systemTheme = useSystemTheme()
  const resolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    applyThemeToDocument(theme, resolvedTheme)

    if (theme === 'system') {
      window.localStorage.removeItem(storageKey)
      return
    }

    window.localStorage.setItem(storageKey, theme)
  }, [resolvedTheme, storageKey, theme])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleStorage = (event: StorageEvent): void => {
      if (event.key !== storageKey) {
        return
      }

      const nextTheme = (event.newValue as ThemePreference | null) ?? defaultTheme
      setTheme(nextTheme)
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [defaultTheme, storageKey])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const currentResolved = current === 'system' ? resolvedTheme : current
      return currentResolved === 'dark' ? 'light' : 'dark'
    })
  }, [resolvedTheme])

  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [resolvedTheme, theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export { ThemeProvider }
export default ThemeProvider
