import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, X, Info, PenSquare, Search } from 'lucide-react'
import { useChat } from '@/features/chat/hooks/useChat'
import { useConversations } from '@/features/chat/hooks/useConversations'
import { ChatMessage as ChatMessageItem } from '@/features/chat/components/chat-message'
import { ChatInput } from '@/features/chat/components/chat-input'
import { ConversationHistory } from '@/features/chat/components/conversation-history'
import { MessageTyping } from '@/features/chat/components/message-typing'
import type { ChatMessage } from '@/features/chat/types'
import { Button } from '@/shared/ui/button'
import ThemeSwitcher from '@/shared/ui/theme-switcher'

const ChatPage = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const isNearBottomRef = useRef(true)
  const previousConversationIdRef = useRef<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

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

  const handleNewConversation = useCallback(() => {
    resetConversation()
    createConversation('Percakapan baru')
    setInputValue('')
    setIsHistoryModalOpen(false)
  }, [createConversation, resetConversation, setInputValue])

  const handleSelectConversation = useCallback(
    (conversationId: string) => {
      if (conversationId === activeConversationId) {
        return
      }
      cancelPendingRequest()
      setActiveConversationId(conversationId)
      setInputValue('')
      setIsHistoryModalOpen(false)
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
    <div className="relative flex h-screen overflow-hidden bg-background">
      {/* Sidebar Backdrop (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => {
            setIsSidebarOpen(false)
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-surface transition-all duration-300 ease-in-out lg:relative ${
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0'
        }`}
      >
        {isSidebarOpen ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-4 py-3">
              <img
                src="/favicon.png"
                alt="Logo Universitas Gunadarma"
                className="h-6 w-6 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-xs font-semibold text-text-primary">Gunadarma AI</h2>
                <p className="text-[10px] leading-tight text-text-secondary">Smart AI Assistant</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSidebarOpen(false)
                }}
                className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ConversationHistory
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelect={handleSelectConversation}
                onCreate={handleNewConversation}
                onDelete={handleDeleteConversation}
                onRename={renameConversation}
                onReset={handleResetHistory}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center gap-4 p-4">
            <button
              type="button"
              onClick={() => {
                setIsSidebarOpen(true)
              }}
              className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNewConversation}
              className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              aria-label="New conversation"
              title="New conversation"
            >
              <PenSquare className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsHistoryModalOpen(true)
              }}
              className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              aria-label="Search conversations"
              title="Search conversations"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        )}
      </aside>

      {/* History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div
            className="relative flex h-[600px] w-full max-w-md flex-col rounded-xl border border-border bg-card shadow-elevation-3"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <img
                src="/favicon.png"
                alt="Logo Universitas Gunadarma"
                className="h-8 w-8 rounded-full"
                loading="lazy"
              />
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-text-primary">Gunadarma AI</h2>
                <p className="text-xs text-text-secondary">Smart AI Assistant</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsHistoryModalOpen(false)
                }}
                className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ConversationHistory
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelect={handleSelectConversation}
                onCreate={handleNewConversation}
                onDelete={handleDeleteConversation}
                onRename={renameConversation}
                onReset={handleResetHistory}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out">
        {/* Top Bar */}
        <header className="flex items-center gap-3 bg-background px-4 py-3">
          <button
            type="button"
            onClick={() => {
              setIsSidebarOpen(true)
            }}
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {!isSidebarOpen && (
            <>
              <img
                src="/favicon.png"
                alt="Logo Universitas Gunadarma"
                className="hidden h-8 w-8 rounded-full lg:block"
              />
              <div className="hidden flex-1 lg:block">
                <h1 className="text-sm font-semibold text-text-primary">Gunadarma AI</h1>
                <p className="text-xs text-text-secondary">Smart AI Assistant</p>
              </div>
            </>
          )}

          <div
            className={
              isSidebarOpen ? 'ml-auto flex items-center gap-3' : 'ml-auto flex items-center gap-3'
            }
          >
            <Button variant="ghost" size="sm" asChild className="hidden gap-2 sm:flex">
              <a href="https://www.gunadarma.ac.id" target="_blank" rel="noreferrer">
                <Info className="h-4 w-4" />
                About
              </a>
            </Button>

            <ThemeSwitcher />
          </div>
        </header>

        {/* Messages Area */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Initial Empty State - Centered */
            <div className="flex h-full flex-col items-center justify-center px-4">
              <div className="-mt-16 w-full max-w-2xl">
                {/* Logo and Title */}
                <div className="mb-5 flex flex-col items-center gap-4 text-center">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                      Halo, Selamat datang!
                    </h1>
                    <p className="mt-3 text-md text-text-secondary/80">
                      Ada yang bisa saya bantu hari ini?
                    </p>
                  </div>
                </div>

                {/* Input Area */}
                <div>
                  <ChatInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onSubmit={handleSubmit}
                    disabled={isLoading}
                    isSending={isLoading}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Chat Messages View */
            <div className="mx-auto max-w-3xl px-4 pt-6">
              {error && (
                <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
                  <p className="flex-1">{error.message}</p>
                  <Button variant="ghost" size="sm" onClick={dismissError} className="text-error">
                    Tutup
                  </Button>
                </div>
              )}

              <div className="space-y-6">
                {messages.map((message) => (
                  <ChatMessageItem key={message.id} message={message} />
                ))}
                {isTyping && <MessageTyping />}
              </div>
            </div>
          )}
        </div>

        {/* Input Area - Fixed at Bottom (only shown when there are messages) */}
        {messages.length > 0 && (
          <div className="bg-background">
            <div className="mx-auto max-w-3xl px-4 pb-3">
              <ChatInput
                value={inputValue}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                disabled={isLoading}
                isSending={isLoading}
              />
              <p className="mt-2 text-center text-xs text-text-muted">
                Gunadarma AI dapat membuat kesalahan, jadi periksa kembali responsnya.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ChatPage
