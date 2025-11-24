import { Sparkles } from 'lucide-react'

const MessageTyping = () => (
  <div className="flex w-full items-center gap-3">
    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-base text-primary">
      <Sparkles className="h-5 w-5" />
      <span className="sr-only">Assistant typing</span>
    </span>
    <div className="rounded-3xl border border-border bg-card px-5 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="typing-dot" />
        <span className="typing-dot typing-delay-150" />
        <span className="typing-dot typing-delay-300" />
      </div>
    </div>
  </div>
)

export { MessageTyping }
