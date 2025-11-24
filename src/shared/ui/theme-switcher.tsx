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
          className="bg-surface shadow-elevation-1 hover:bg-surface-hover focus-visible:ring-focus relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Sun
            className={cn(
              'text-text-primary h-5 w-5 rotate-0 scale-100 transition-all',
              resolvedTheme === 'dark' && 'rotate-90 scale-0',
            )}
            aria-hidden="true"
          />
          <Moon
            className={cn(
              'text-text-primary absolute h-5 w-5 rotate-90 scale-0 transition-all',
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
          className="bg-surface shadow-elevation-3 z-50 min-w-[260px] rounded-2xl border border-border p-2 backdrop-blur-sm focus:outline-none"
        >
          <DropdownMenu.Label className="text-text-muted px-3 py-2 text-xs font-semibold uppercase tracking-wide">
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
                className="text-text-secondary focus-visible:bg-surface-hover data-[state=checked]:bg-surface-hover group flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left text-sm outline-none transition-colors"
              >
                <span className="text-text-primary mt-0.5">{option.icon}</span>
                <span className="flex-1">
                  <span className="text-text-primary block font-medium">{option.label}</span>
                  <span className="text-text-muted text-xs">{option.description}</span>
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
