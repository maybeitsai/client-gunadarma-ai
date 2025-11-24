import { createContext, type Dispatch, type SetStateAction } from 'react'

type ThemePreference = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  theme: ThemePreference
  resolvedTheme: ResolvedTheme
  setTheme: Dispatch<SetStateAction<ThemePreference>>
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export type { ThemeContextValue, ThemePreference, ResolvedTheme }
export { ThemeContext }
