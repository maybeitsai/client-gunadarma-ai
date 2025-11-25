import { memo, type ChangeEvent, type KeyboardEvent } from 'react'
import { Paperclip, SendHorizonal } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  isSending?: boolean
}

const ChatInputComponent = ({ value, onChange, onSubmit, disabled, isSending }: ChatInputProps) => {
  const resolvedDisabled = disabled ?? false
  const actionDisabled = resolvedDisabled ? true : isSending ? true : value.trim().length === 0
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!disabled && !isSending && value.trim().length > 0) {
        onSubmit()
      }
    }
  }

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  const handleSend = () => {
    if (!disabled && !isSending && value.trim().length > 0) {
      onSubmit()
    }
  }

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-elevation-1 transition focus-within:border-primary/50">
      <div className="flex items-end gap-3">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-dashed border-border text-text-secondary hover:text-text-primary"
          aria-label="Attachment shortcut"
          disabled
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <textarea
          className="flex-1 resize-none bg-transparent text-base leading-relaxed text-text-primary placeholder:text-text-muted focus:outline-none"
          rows={2}
          placeholder="Type your message here…"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <Button
          type="button"
          onClick={handleSend}
          disabled={actionDisabled}
          className="h-12 w-12 rounded-2xl"
        >
          {isSending ? (
            <LoadingSpinner className="h-5 w-5 border-2" label="Sending" />
          ) : (
            <SendHorizonal className="h-5 w-5" />
          )}
        </Button>
      </div>
      <p className="mt-3 text-xs text-text-muted">
        Gunadarma AI dapat memberikan jawaban berdasarkan basis pengetahuan terbaru kampus.
      </p>
    </div>
  )
}

const ChatInput = memo(
  ChatInputComponent,
  (prev, next) =>
    prev.value === next.value &&
    prev.disabled === next.disabled &&
    prev.isSending === next.isSending &&
    prev.onChange === next.onChange &&
    prev.onSubmit === next.onSubmit,
)

export { ChatInput }
