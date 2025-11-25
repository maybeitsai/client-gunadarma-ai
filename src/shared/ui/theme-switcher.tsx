import { type ReactElement } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Monitor, Moon, Sun, Check } from 'lucide-react'
import { useTheme, type ThemePreference } from '@/shared/hooks/use-theme'
import { cn } from '@/shared/lib/utils'

interface ThemeOption {
  label: string
  value: ThemePreference
  description: string
  icon: ReactElement
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    label: 'Light',
    value: 'light',
    description: 'Bright background for well-lit spaces.',
    icon: <Sun className="h-4 w-4" aria-hidden="true" />,
  },
  {
    label: 'Dark',
    value: 'dark',
    description: 'Low-glare experience for night owls.',
    icon: <Moon className="h-4 w-4" aria-hidden="true" />,
  },
  {
    label: 'System',
    value: 'system',
    description: 'Follow your operating system preference.',
    icon: <Monitor className="h-4 w-4" aria-hidden="true" />,
  },
]

const ThemeSwitcher = () => {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Sun
            className={cn(
              'h-5 w-5 rotate-0 scale-100 text-text-primary transition-all',
              resolvedTheme === 'dark' && 'rotate-90 scale-0',
            )}
            aria-hidden="true"
          />
          <Moon
            className={cn(
              'absolute h-5 w-5 rotate-90 scale-0 text-text-primary transition-all',
              resolvedTheme === 'dark' && 'rotate-0 scale-100',
            )}
            aria-hidden="true"
          />
          <span className="sr-only">Switch theme</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          align="end"
          className="z-50 min-w-[260px] rounded-2xl border border-border bg-surface p-2 shadow-elevation-3 backdrop-blur-sm focus:outline-none"
        >
          <DropdownMenu.Label className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Theme
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={theme}
            onValueChange={(value) => {
              setTheme(value as ThemePreference)
            }}
          >
            {THEME_OPTIONS.map((option) => (
              <DropdownMenu.RadioItem
                key={option.value}
                value={option.value}
                className="group flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left text-sm text-text-secondary outline-none transition-colors focus-visible:bg-surface-hover data-[state=checked]:bg-surface-hover"
              >
                <span className="mt-0.5 text-text-primary">{option.icon}</span>
                <span className="flex-1">
                  <span className="block font-medium text-text-primary">{option.label}</span>
                  <span className="text-xs text-text-muted">{option.description}</span>
                </span>
                <DropdownMenu.ItemIndicator>
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default ThemeSwitcher
export { ThemeSwitcher }
