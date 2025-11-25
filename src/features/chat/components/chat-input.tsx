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
  const charCount = value.length
  const maxChars = 4000
  const isNearLimit = charCount > maxChars * 0.8
  const isOverLimit = charCount > maxChars

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!disabled && !isSending && value.trim().length > 0 && !isOverLimit) {
        onSubmit()
      }
    }
  }

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  const handleSend = () => {
    if (!disabled && !isSending && value.trim().length > 0 && !isOverLimit) {
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
    <div className="space-y-2">
      <div
        className={`rounded-3xl border transition-all ${
          isOverLimit
            ? 'border-error/70 bg-error/5'
            : 'border-border/70 bg-card focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10'
        } p-3 shadow-elevation-1`}
      >
        <div className={`flex gap-3 ${hasText ? 'flex-col' : 'items-center'}`}>
          {!hasText && (
            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-dashed border-border text-text-secondary transition-colors hover:border-primary/50 hover:text-text-primary"
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
            aria-label="Message input"
            aria-describedby="char-counter"
            maxLength={maxChars}
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
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-dashed border-border text-text-secondary transition-colors hover:border-primary/50 hover:text-text-primary"
                aria-label="Attachment shortcut"
                disabled
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <Button
                type="button"
                onClick={handleSend}
                disabled={actionDisabled || isOverLimit}
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
      {hasText && isNearLimit && (
        <div
          id="char-counter"
          className={`text-right text-xs transition-colors ${
            isOverLimit ? 'font-medium text-error' : 'text-text-muted'
          }`}
        >
          {charCount} / {maxChars} characters
        </div>
      )}
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
