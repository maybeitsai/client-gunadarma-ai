import { memo } from 'react'
import { clsx } from 'clsx'
import { ExternalLink, Sparkles, User } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '@/features/chat/types'
import { MarkdownRenderer } from '@/features/chat/components/markdown-renderer'

interface ChatMessageProps {
  message: ChatMessageType
}

const ChatMessageComponent = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user'

  return (
    <div className={clsx('flex w-full gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-base text-primary">
          <Sparkles className="h-5 w-5" />
          <span className="sr-only">Assistant</span>
        </span>
      )}

      <div
        className={clsx(
          'max-w-3xl rounded-3xl border border-transparent px-5 py-4 text-sm shadow-sm transition',
          isUser
            ? 'rounded-br-md bg-primary text-primary-foreground'
            : 'rounded-bl-md border-border bg-card text-text-primary',
        )}
      >
        {isUser ? (
          <p className="text-base leading-relaxed text-primary-foreground">{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}

        <div className="mt-3 flex items-center justify-between text-[0.75rem] text-text-muted">
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <span>{isUser ? 'You' : 'Gunadarma AI'}</span>
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Sources:
            </p>
            <ul className="mt-2 space-y-1">
              {message.sources.map((source, index) => (
                <li key={`${source}-${index.toString()}`}>
                  <a
                    href={source}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {source}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isUser && (
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface text-base text-text-primary">
          <User className="h-5 w-5" />
          <span className="sr-only">You</span>
        </span>
      )}
    </div>
  )
}

const ChatMessage = memo(ChatMessageComponent, (prev, next) => prev.message === next.message)

export { ChatMessage }
