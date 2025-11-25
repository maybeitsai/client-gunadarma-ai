import { memo } from 'react'
import { clsx } from 'clsx'
import { ExternalLink, Bot, User } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '@/features/chat/types'
import { MarkdownRenderer } from '@/features/chat/components/markdown-renderer'

interface ChatMessageProps {
  message: ChatMessageType
}

const ChatMessageComponent = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user'

  return (
    <div
      className={clsx(
        'flex w-full gap-3 duration-300 animate-in fade-in slide-in-from-bottom-4',
        isUser ? 'justify-end' : 'justify-start',
      )}
    >
      {!isUser && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Bot className="h-5 w-5 shrink-0" />
          <span className="sr-only">Assistant</span>
        </span>
      )}

      <div
        className={clsx(
          'max-w-3xl rounded-3xl border border-transparent px-5 py-4 text-sm shadow-sm transition',
          isUser
            ? 'bg-user-bubble rounded-br-md text-primary-foreground'
            : 'rounded-bl-md border-border bg-card text-text-primary',
        )}
      >
        {isUser ? (
          <p className="text-base leading-relaxed text-primary-foreground">{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}

        <div className="mt-3 flex items-center justify-between gap-2 text-[0.7rem] text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-text-muted/50"></span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {!isUser && <span className="font-medium">Gunadarma AI</span>}
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
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    <span className="break-all">{source}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isUser && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface text-text-primary">
          <User className="h-5 w-5 shrink-0" />
          <span className="sr-only">You</span>
        </span>
      )}
    </div>
  )
}

const ChatMessage = memo(ChatMessageComponent, (prev, next) => prev.message === next.message)

export { ChatMessage }
