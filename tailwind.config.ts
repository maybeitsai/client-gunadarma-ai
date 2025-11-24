import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const withOpacity = (variableName: string): string => `rgb(var(${variableName}) / <alpha-value>)`

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: withOpacity('--background'),
        surface: withOpacity('--surface'),
        'surface-hover': withOpacity('--surface-hover'),
        card: withOpacity('--card'),
        border: withOpacity('--border'),
        ring: withOpacity('--focus-ring'),
        input: withOpacity('--input-bg'),
        bubble: withOpacity('--bubble-bg'),
        disabled: withOpacity('--button-disabled'),
        accent: {
          DEFAULT: withOpacity('--accent'),
          foreground: withOpacity('--text-on-accent'),
          hover: withOpacity('--accent-hover'),
        },
        primary: {
          DEFAULT: withOpacity('--gunadarma-primary'),
          dark: withOpacity('--gunadarma-primary-dark'),
          light: withOpacity('--gunadarma-primary-light'),
          hover: withOpacity('--gunadarma-primary-hover'),
          foreground: withOpacity('--text-on-primary'),
        },
        text: {
          primary: withOpacity('--text-primary'),
          secondary: withOpacity('--text-secondary'),
          muted: withOpacity('--text-muted'),
        },
        focus: withOpacity('--focus-ring'),
        error: withOpacity('--error'),
        success: withOpacity('--success'),
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        xs: ['var(--font-size-xs)', '1.4'],
        sm: ['var(--font-size-sm)', '1.45'],
        base: ['var(--font-size-base)', '1.6'],
        lg: ['var(--font-size-lg)', '1.6'],
        xl: ['var(--font-size-xl)', '1.3'],
        '2xl': ['var(--font-size-2xl)', '1.2'],
        'display-sm': ['var(--font-size-display-sm)', '1.15'],
        'display-lg': ['var(--font-size-display-lg)', '1.05'],
      },
      spacing: {
        'layout-xs': 'var(--space-2)',
        'layout-sm': 'var(--space-3)',
        'layout-md': 'var(--space-4)',
        'layout-lg': 'var(--space-6)',
        'layout-xl': 'var(--space-8)',
        'layout-2xl': 'var(--space-10)',
      },
      boxShadow: {
        'elevation-0': 'var(--elevation-0)',
        'elevation-1': 'var(--elevation-1)',
        'elevation-2': 'var(--elevation-2)',
        'elevation-3': 'var(--elevation-3)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
