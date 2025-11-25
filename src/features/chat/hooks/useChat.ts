import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

interface UseChatOptions {
  initialMessages?: ChatMessage[]
  onMessagesChange?: (messages: ChatMessage[]) => void
  conversationId?: string | null
}

interface QueuedRequest {
  id: string
  prompt: string
  options?: SendMessageOptions
}

const useChat = ({
  initialMessages = [],
  onMessagesChange,
  conversationId = null,
}: UseChatOptions = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<ApiErrorDetail | null>(null)
  const requestQueueRef = useRef<QueuedRequest[]>([])
  const activeRequestRef = useRef<{ controller: AbortController; sessionId: number } | null>(null)
  const sessionIdRef = useRef(0)
  const lastConversationIdRef = useRef<string | null>(conversationId ?? null)
  const isMountedRef = useRef(true)
  const isConversationSwitchingRef = useRef(false)

  console.log(
    '[useChat] Render - isMounted:',
    isMountedRef.current,
    'conversationId:',
    conversationId,
  )

  const cancelPendingRequest = useCallback(() => {
    if (activeRequestRef.current) {
      activeRequestRef.current.controller.abort()
      activeRequestRef.current = null
    }
    requestQueueRef.current = []
    if (isMountedRef.current) {
      setIsLoading(false)
      setIsTyping(false)
    }
  }, [])

  useEffect(() => {
    console.log('[useChat] MOUNTING - setting isMounted to true')
    isMountedRef.current = true
    return () => {
      console.log('[useChat] UNMOUNTING - setting isMounted to false')
      isMountedRef.current = false
      if (activeRequestRef.current) {
        activeRequestRef.current.controller.abort()
      }
      requestQueueRef.current = []
    }
  }, [])

  useEffect(() => {
    const normalizedConversationId = conversationId ?? null
    const previousConversationId = lastConversationIdRef.current

    console.log('[conversationEffect] conversationId changed:', {
      previous: previousConversationId,
      current: normalizedConversationId,
    })

    if (previousConversationId === normalizedConversationId) {
      return
    }

    const shouldResetSession =
      previousConversationId !== null && previousConversationId !== normalizedConversationId

    console.log('[conversationEffect] shouldResetSession:', shouldResetSession)

    lastConversationIdRef.current = normalizedConversationId

    if (shouldResetSession) {
      console.log(
        '[conversationEffect] Resetting session and messages to initialMessages:',
        initialMessages,
      )
      sessionIdRef.current += 1
      cancelPendingRequest()

      // Set flag to prevent onMessagesChange from being called during switch
      isConversationSwitchingRef.current = true
      setMessages([...initialMessages])
      setError(null)

      // Reset flag after a short delay to allow React to process the state update
      setTimeout(() => {
        isConversationSwitchingRef.current = false
      }, 0)
    } else {
      console.log('[conversationEffect] Not resetting - first conversation or same conversation')
      // Still update messages if this is the first load and initialMessages is provided
      if (previousConversationId === null && initialMessages.length > 0) {
        isConversationSwitchingRef.current = true
        setMessages([...initialMessages])
        setTimeout(() => {
          isConversationSwitchingRef.current = false
        }, 0)
      }
    }
  }, [conversationId, cancelPendingRequest, initialMessages])

  useEffect(() => {
    // Don't call onMessagesChange during conversation switching
    if (isConversationSwitchingRef.current) {
      console.log('[onMessagesChange effect] Skipping - conversation switching')
      return
    }

    console.log('[onMessagesChange effect] Calling with messages:', messages.length)
    onMessagesChange?.(messages)
  }, [messages, onMessagesChange])

  const runRequest = useCallback(async (queuedRequest: QueuedRequest) => {
    const controller = new AbortController()
    const sessionIdAtStart = sessionIdRef.current
    activeRequestRef.current = { controller, sessionId: sessionIdAtStart }

    if (isMountedRef.current) {
      setIsLoading(true)
      setIsTyping(true)
      setError(null)
    }

    const requestPayload: AskRequest = {
      question: queuedRequest.prompt,
      use_cache: queuedRequest.options?.use_cache,
      use_hybrid: queuedRequest.options?.use_hybrid,
    }

    try {
      const response = await askQuestion(requestPayload, controller.signal)

      console.log('[runRequest] Response received:', {
        isMounted: isMountedRef.current,
        aborted: controller.signal.aborted,
        sessionMatch: sessionIdAtStart === sessionIdRef.current,
      })

      if (!isMountedRef.current || controller.signal.aborted) {
        console.log('[runRequest] Skipping - unmounted or aborted')
        return false
      }

      if (sessionIdAtStart !== sessionIdRef.current) {
        console.log('[runRequest] Skipping - session changed')
        return false
      }

      // Don't show sources if the response indicates no information is available
      const hasNoInfo = response.answer.includes(
        'Maaf, informasi mengenai hal tersebut tidak tersedia',
      )

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response.answer,
        createdAt: new Date().toISOString(),
        sources: hasNoInfo ? [] : response.source_urls,
      }

      console.log('[runRequest] Adding assistant message:', assistantMessage)
      setMessages((prev) => {
        console.log('[runRequest] Previous messages:', prev.length)
        const next = [...prev, assistantMessage]
        console.log('[runRequest] Next messages:', next.length)
        return next
      })
      return true
    } catch (err) {
      if (controller.signal.aborted || !isMountedRef.current) {
        return false
      }

      if (err instanceof ChatApiError) {
        setError(err.detail)
      } else {
        setError({
          status: 0,
          message: 'Something went wrong while sending your question.',
          cause: err,
        })
      }
      return true
    } finally {
      if (isMountedRef.current) {
        activeRequestRef.current = null
        const hasQueuedRequests = requestQueueRef.current.length > 0
        if (!hasQueuedRequests) {
          setIsLoading(false)
          setIsTyping(false)
        }
      }
    }
  }, [])

  const processQueue = useCallback(() => {
    console.log(
      '[processQueue] Called - activeRequest:',
      !!activeRequestRef.current,
      'queueLength:',
      requestQueueRef.current.length,
    )

    if (activeRequestRef.current || requestQueueRef.current.length === 0) {
      return
    }

    const nextRequest = requestQueueRef.current.shift()
    if (!nextRequest) {
      return
    }

    console.log('[processQueue] Processing request:', nextRequest.prompt)
    void runRequest(nextRequest).then((shouldContinue) => {
      console.log('[processQueue] Request completed, shouldContinue:', shouldContinue)
      if (shouldContinue) {
        setTimeout(() => {
          processQueue()
        }, 0)
      }
    })
  }, [runRequest])

  const sendMessage = useCallback(
    (content: string, options?: SendMessageOptions) => {
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

      console.log('[sendMessage] Adding user message:', userMessage)
      setMessages((prev) => {
        console.log('[sendMessage] Previous messages:', prev.length)
        const next = [...prev, userMessage]
        console.log('[sendMessage] Next messages:', next.length)
        return next
      })
      setError(null)

      requestQueueRef.current.push({
        id: userMessage.id,
        prompt: trimmed,
        options,
      })

      console.log('[sendMessage] Queue length:', requestQueueRef.current.length)
      processQueue()
    },
    [processQueue],
  )

  const resetConversation = useCallback(() => {
    sessionIdRef.current += 1
    cancelPendingRequest()
    setMessages([])
    setError(null)
  }, [cancelPendingRequest])

  const dismissError = useCallback(() => {
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
    dismissError,
    cancelPendingRequest,
  }
}

export type { SendMessageOptions, UseChatOptions }
export { useChat }
