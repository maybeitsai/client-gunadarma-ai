import { memo, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react'
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
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

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      // Reset height to measure actual content height
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const newHeight = Math.min(scrollHeight, 200) // Max height 200px
      textarea.style.height = String(newHeight) + 'px'
    }
  }, [value])

  const hasText = value.trim().length > 0

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-3 shadow-elevation-1 transition focus-within:border-primary/50">
      <div className={`flex gap-3 ${hasText ? 'flex-col' : 'items-center'}`}>
        {!hasText && (
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-dashed border-border text-text-secondary hover:text-text-primary"
            aria-label="Attachment shortcut"
            disabled
          >
            <Paperclip className="h-4 w-4" />
          </button>
        )}
        <textarea
          ref={textareaRef}
          className={`resize-none bg-transparent py-2 text-base leading-relaxed text-text-primary placeholder:text-text-muted focus:outline-none ${hasText ? 'w-full' : 'flex-1'}`}
          rows={1}
          placeholder="Type your message here…"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          style={{ maxHeight: '200px', overflowY: 'auto' }}
        />
        {!hasText && (
          <Button
            type="button"
            onClick={handleSend}
            disabled={actionDisabled}
            size="icon"
            className="h-9 w-9 shrink-0 rounded-2xl p-0"
          >
            {isSending ? (
              <LoadingSpinner className="h-4 w-4 border-2" label="Sending" />
            ) : (
              <SendHorizonal className="h-4 w-4" strokeWidth={2.5} />
            )}
          </Button>
        )}
        {hasText && (
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-dashed border-border text-text-secondary hover:text-text-primary"
              aria-label="Attachment shortcut"
              disabled
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <Button
              type="button"
              onClick={handleSend}
              disabled={actionDisabled}
              size="icon"
              className="h-9 w-9 shrink-0 rounded-2xl p-0"
            >
              {isSending ? (
                <LoadingSpinner className="h-4 w-4 border-2" label="Sending" />
              ) : (
                <SendHorizonal className="h-4 w-4" strokeWidth={2.5} />
              )}
            </Button>
          </div>
        )}
      </div>
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
