import { useContext } from 'react'
import {
  ThemeContext,
  type ThemeContextValue,
  type ThemePreference,
  type ResolvedTheme,
} from '@/shared/providers/theme-context'

const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

export type { ThemeContextValue, ThemePreference, ResolvedTheme }
export { useTheme }
