import { useCallback, useEffect, useRef, useState } from 'react'
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

const ChatPage = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
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
        const conversation = createConversation('Percakapan baru')
        updateConversationMessages(conversation.id, nextMessages)
        return
      }

      updateConversationMessages(activeConversationId, nextMessages)
    },
    [activeConversationId, createConversation, updateConversationMessages],
  )

  const { messages, sendMessage, isLoading, isTyping, error, resetConversation, dismissError } =
    useChat({
      initialMessages: activeConversation?.messages ?? [],
      onMessagesChange: handleMessagesChange,
    })

  useEffect(() => {
    if (!scrollContainerRef.current) {
      return
    }

    scrollContainerRef.current.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isTyping])

  const showSuggestions = messages.length === 0

  const handleInputChange = (value: string) => {
    setInputValue(value)
  }

  const submitMessage = useCallback(
    async (content?: string) => {
      const payload = typeof content === 'string' ? content : inputValue

      if (!payload.trim() || isLoading) {
        return
      }

      setInputValue('')
      await sendMessage(payload)
    },
    [inputValue, isLoading, sendMessage],
  )

  const handleNewConversation = () => {
    createConversation('Percakapan baru')
    resetConversation()
    setInputValue('')
  }

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId)
    setInputValue('')
  }

  const handleDeleteConversation = (conversationId: string) => {
    deleteConversation(conversationId)
    if (activeConversationId === conversationId) {
      resetConversation()
      setInputValue('')
    }
  }

  const handleResetHistory = () => {
    resetConversations()
    resetConversation()
    setInputValue('')
  }

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
        <header className="flex flex-col gap-3 border-b border-border/60 pb-4">
          <p className="text-text-muted text-xs uppercase tracking-[0.3em] text-center lg:text-left">
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
                <h1 className="text-display-sm text-text-primary leading-tight">Asisten Interaktif</h1>
                <p className="text-text-secondary mt-1 text-sm">
                  Jawaban kontekstual dengan referensi sumber resmi kampus.
                </p>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="border-error/40 bg-error/10 text-error flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-sm">
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
          <div className="text-text-secondary rounded-3xl border border-dashed border-border px-5 py-4">
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
                    void submitMessage(question)
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
          onSubmit={() => {
            void submitMessage()
          }}
          disabled={isLoading}
          isSending={isLoading}
        />
      </div>
    </section>
  )
}

export default ChatPage
