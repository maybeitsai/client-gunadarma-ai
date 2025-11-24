import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  className?: string
  label?: string
}

const LoadingSpinner = ({ className, label = 'Loading' }: LoadingSpinnerProps) => (
  <span className="text-text-secondary inline-flex items-center gap-2 text-sm">
    <span
      className={clsx(
        'inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent',
        className,
      )}
      aria-hidden="true"
    />
    <span className="sr-only">{label}</span>
  </span>
)

export { LoadingSpinner }
