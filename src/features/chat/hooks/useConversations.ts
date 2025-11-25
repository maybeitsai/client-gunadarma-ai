import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ChatMessage, Conversation } from '@/features/chat/types'

const STORAGE_KEY = 'gunadarma-conversations'
let cachedInitialConversations: Conversation[] | null = null

const loadConversations = (): Conversation[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Conversation[]) : []
  } catch (error) {
    console.warn('Failed to load conversations from storage', error)
    return []
  }
}

const persistConversations = (conversations: Conversation[]): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
}

const clearPersistedConversations = (): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

const getInitialConversations = (): Conversation[] => {
  cachedInitialConversations ??= loadConversations()
  return cachedInitialConversations
}

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`
}

const deriveConversationTitle = (messages: ChatMessage[]): string | null => {
  const firstUserMessage = messages.find((message) => message.role === 'user')
  if (!firstUserMessage) {
    return null
  }

  const trimmed = firstUserMessage.content.trim()
  if (!trimmed) {
    return null
  }

  const snippet = trimmed.slice(0, 32).trimEnd()
  if (snippet.length === 0) {
    return null
  }

  return trimmed.length > 32 ? `${snippet}...` : snippet
}

const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    getInitialConversations(),
  )
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  useEffect(() => {
    persistConversations(conversations)
  }, [conversations])

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  )

  const createConversation = useCallback((title = 'New Conversation'): Conversation => {
    const timestamp = new Date().toISOString()
    const conversation: Conversation = {
      id: generateId(),
      title,
      createdAt: timestamp,
      updatedAt: timestamp,
      messages: [],
    }

    setConversations((prev) => [conversation, ...prev])
    setActiveConversationId(conversation.id)

    return conversation
  }, [])

  const updateConversationMessages = useCallback((id: string, messages: ChatMessage[]) => {
    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== id) {
          return conversation
        }

        let nextTitle = conversation.title
        if (conversation.messages.length === 0) {
          const derivedTitle = deriveConversationTitle(messages)
          if (derivedTitle) {
            nextTitle = derivedTitle
          }
        }

        return {
          ...conversation,
          title: nextTitle,
          messages,
          updatedAt: new Date().toISOString(),
        }
      }),
    )
  }, [])

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              title,
              updatedAt: new Date().toISOString(),
            }
          : conversation,
      ),
    )
  }, [])

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((conversation) => conversation.id !== id))
    setActiveConversationId((current) => (current === id ? null : current))
  }, [])

  const resetConversations = useCallback(() => {
    cachedInitialConversations = []
    setConversations([])
    setActiveConversationId(null)
    clearPersistedConversations()
  }, [])

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    updateConversationMessages,
    renameConversation,
    deleteConversation,
    resetConversations,
  }
}

export { useConversations }
