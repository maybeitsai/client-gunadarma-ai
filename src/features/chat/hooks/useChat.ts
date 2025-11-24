import { useCallback, useMemo, useState } from 'react'
import { askQuestion, ChatApiError } from '@/features/chat/services/chatApi'
import type { ApiErrorDetail, AskRequest, ChatMessage } from '@/features/chat/types'

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`
}

interface SendMessageOptions {
  use_cache?: boolean
  use_hybrid?: boolean
}

const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<ApiErrorDetail | null>(null)

  const sendMessage = useCallback(async (content: string, options?: SendMessageOptions) => {
    const trimmed = content.trim()
    if (!trimmed) {
      return
    }

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setIsTyping(true)
    setError(null)

    try {
      const requestPayload: AskRequest = {
        question: trimmed,
        use_cache: options?.use_cache ?? true,
        use_hybrid: options?.use_hybrid ?? false,
      }

      const response = await askQuestion(requestPayload)

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response.answer,
        createdAt: new Date().toISOString(),
        sources: response.source_urls,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      if (err instanceof ChatApiError) {
        setError(err.detail)
      } else {
        setError({
          status: 0,
          message: 'Something went wrong while sending your question.',
          cause: err,
        })
      }
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }, [])

  const resetConversation = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const stateSummary = useMemo(
    () => ({
      lastMessage: messages[messages.length - 1] ?? null,
      totalMessages: messages.length,
    }),
    [messages],
  )

  return {
    messages,
    isLoading,
    isTyping,
    error,
    sendMessage,
    resetConversation,
    stateSummary,
  }
}

export type { SendMessageOptions }
export { useChat }
