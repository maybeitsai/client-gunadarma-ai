import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useChat } from '@/features/chat/hooks/useChat'
import { useConversations } from '@/features/chat/hooks/useConversations'
import { ChatMessage as ChatMessageItem } from '@/features/chat/components/chat-message'
import { ChatInput } from '@/features/chat/components/chat-input'
import { ConversationHistory } from '@/features/chat/components/conversation-history'
import { MessageTyping } from '@/features/chat/components/message-typing'
import type { ChatMessage } from '@/features/chat/types'
import { Button } from '@/shared/ui/button'

const suggestedQuestions = [
  'Cara mendaftar kuliah',
  'Program magang/PKL',
  'Perpustakaan dan laboratorium',
  'Kontak dan alamat',
]

const ChatHeader = memo(() => (
  <header className="flex flex-col gap-3 border-b border-border/60 pb-4">
    <p className="text-center text-xs uppercase tracking-[0.3em] text-text-muted lg:text-left">
      Gunadarma AI
    </p>
    <div className="flex flex-col items-center gap-3 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
      <div className="flex items-center gap-3">
        <img
          src="/favicon.png"
          alt="Logo Universitas Gunadarma"
          className="h-12 w-12 rounded-full shadow-elevation-1"
          loading="lazy"
        />
        <div>
          <h1 className="text-display-sm leading-tight text-text-primary">Asisten Interaktif</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Jawaban kontekstual dengan referensi sumber resmi kampus.
          </p>
        </div>
      </div>
    </div>
  </header>
))

const ChatPage = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const isNearBottomRef = useRef(true)
  const previousConversationIdRef = useRef<string | null>(null)
  const [inputValue, setInputValue] = useState('')

  const {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    updateConversationMessages,
    renameConversation,
    deleteConversation,
    resetConversations,
  } = useConversations()

  const handleMessagesChange = useCallback(
    (nextMessages: ChatMessage[]) => {
      if (nextMessages.length === 0 && !activeConversationId) {
        return
      }

      if (!activeConversationId) {
        return
      }

      updateConversationMessages(activeConversationId, nextMessages)
    },
    [activeConversationId, updateConversationMessages],
  )

  const {
    messages,
    sendMessage,
    isLoading,
    isTyping,
    error,
    resetConversation,
    dismissError,
    cancelPendingRequest,
  } = useChat({
    conversationId: activeConversationId,
    initialMessages: activeConversation?.messages ?? [],
    onMessagesChange: handleMessagesChange,
  })

  const lastMessageCountRef = useRef(messages.length)

  const handleScroll = useCallback(() => {
    const node = scrollContainerRef.current
    if (!node) {
      return
    }
    const { scrollTop, clientHeight, scrollHeight } = node
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)
    isNearBottomRef.current = distanceFromBottom <= 120
  }, [])

  useEffect(() => {
    const node = scrollContainerRef.current
    if (!node) {
      return
    }

    node.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      node.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    const previousCount = lastMessageCountRef.current
    const currentCount = messages.length
    const hasNewMessage = currentCount > previousCount
    lastMessageCountRef.current = currentCount

    if (!hasNewMessage || !isNearBottomRef.current) {
      return
    }

    const frameId = window.requestAnimationFrame(() => {
      const node = scrollContainerRef.current
      if (!node) {
        return
      }
      node.scrollTo({
        top: node.scrollHeight,
        behavior: 'smooth',
      })
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [messages])

  useEffect(() => {
    if (previousConversationIdRef.current === activeConversationId) {
      return
    }

    previousConversationIdRef.current = activeConversationId
    lastMessageCountRef.current = messages.length
    isNearBottomRef.current = true

    const node = scrollContainerRef.current
    if (!node) {
      return
    }
    node.scrollTo({ top: node.scrollHeight })
  }, [activeConversationId, messages.length])

  const showSuggestions = useMemo(() => messages.length === 0, [messages.length])

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value)
  }, [])

  const submitMessage = useCallback(
    (content?: string) => {
      const payload = typeof content === 'string' ? content : inputValue

      if (!payload.trim() || isLoading) {
        return
      }

      if (!activeConversationId) {
        const conversation = createConversation('Percakapan baru')
        setActiveConversationId(conversation.id)
      }

      setInputValue('')
      sendMessage(payload)
    },
    [
      inputValue,
      isLoading,
      sendMessage,
      activeConversationId,
      createConversation,
      setActiveConversationId,
    ],
  )

  const handleSubmit = useCallback(() => {
    submitMessage()
  }, [submitMessage])

  const handleSuggestionClick = useCallback(
    (question: string) => {
      submitMessage(question)
    },
    [submitMessage],
  )

  const handleNewConversation = useCallback(() => {
    resetConversation()
    createConversation('Percakapan baru')
    setInputValue('')
  }, [createConversation, resetConversation, setInputValue])

  const handleSelectConversation = useCallback(
    (conversationId: string) => {
      if (conversationId === activeConversationId) {
        return
      }
      cancelPendingRequest()
      setActiveConversationId(conversationId)
      setInputValue('')
    },
    [activeConversationId, cancelPendingRequest, setActiveConversationId, setInputValue],
  )

  const handleDeleteConversation = useCallback(
    (conversationId: string) => {
      const deletingActive = activeConversationId === conversationId
      if (deletingActive) {
        resetConversation()
        setInputValue('')
      }
      deleteConversation(conversationId)
    },
    [activeConversationId, deleteConversation, resetConversation, setInputValue],
  )

  const handleResetHistory = useCallback(() => {
    resetConversation()
    resetConversations()
    setInputValue('')
  }, [resetConversations, resetConversation, setInputValue])

  return (
    <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <ConversationHistory
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelect={handleSelectConversation}
        onCreate={handleNewConversation}
        onDelete={handleDeleteConversation}
        onRename={renameConversation}
        onReset={handleResetHistory}
      />

      <div className="surface-panel flex min-h-[70vh] flex-col gap-6">
        <ChatHeader />

        {error && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
            <p className="flex-1">{error.message}</p>
            <Button variant="ghost" size="sm" onClick={dismissError} className="text-error">
              Tutup
            </Button>
          </div>
        )}

        <div ref={scrollContainerRef} className="flex-1 space-y-6 overflow-y-auto pr-1">
          {messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))}
          {isTyping && <MessageTyping />}
        </div>

        {showSuggestions && (
          <div className="rounded-3xl border border-dashed border-border px-5 py-4 text-text-secondary">
            <p className="text-sm font-semibold">Mulai percakapan dengan pertanyaan populer</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {suggestedQuestions.map((question) => (
                <Button
                  key={question}
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-2xl"
                  onClick={() => {
                    handleSuggestionClick(question)
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        <ChatInput
          value={inputValue}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          disabled={isLoading}
          isSending={isLoading}
        />
      </div>
    </section>
  )
}

export default ChatPage
