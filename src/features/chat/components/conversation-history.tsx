import { memo, useMemo, useState } from 'react'
import { clsx } from 'clsx'
import { Check, MessageSquare, PencilLine, PenSquare, Search, Trash2 } from 'lucide-react'
import type { Conversation } from '@/features/chat/types'
import { Button } from '@/shared/ui/button'

interface ConversationHistoryProps {
  conversations: Conversation[]
  activeConversationId: string | null
  onSelect: (conversationId: string) => void
  onCreate: () => void
  onDelete: (conversationId: string) => void
  onRename: (conversationId: string, title: string) => void
  onReset: () => void
}

const ConversationHistoryComponent = ({
  conversations,
  activeConversationId,
  onSelect,
  onCreate,
  onDelete,
  onRename,
  onReset,
}: ConversationHistoryProps) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const filteredConversations = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()
    if (!term) {
      return conversations
    }
    return conversations.filter((conversation) => conversation.title.toLowerCase().includes(term))
  }, [conversations, searchQuery])

  const beginEditing = (conversationId: string, currentTitle: string) => {
    setEditingId(conversationId)
    setDraftTitle(currentTitle)
  }

  const commitRename = () => {
    if (editingId && draftTitle.trim().length > 0) {
      onRename(editingId, draftTitle.trim())
    }
    setEditingId(null)
    setDraftTitle('')
  }

  const handleResetConfirm = () => {
    onReset()
    setShowResetConfirm(false)
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onCreate} className="gap-2">
          <PenSquare className="h-4 w-4" />
          Percakapan baru
        </Button>
      </div>

      <div>
        <label className="sr-only" htmlFor="conversation-search">
          Cari riwayat percakapan
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm transition focus-within:border-primary/30">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            id="conversation-search"
            type="search"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value)
            }}
            placeholder="Cari riwayat…"
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto">
        {filteredConversations.length === 0 && (
          <div className="px-2 text-sm text-text-muted">
            {conversations.length === 0
              ? 'Belum ada riwayat percakapan'
              : 'Tidak ada hasil pencarian'}
          </div>
        )}
        {filteredConversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId
          const isEditing = editingId === conversation.id

          return (
            <div
              key={conversation.id}
              className={clsx(
                'group flex items-center gap-2 rounded-lg px-3 py-2 transition',
                isActive ? 'bg-primary/10 text-primary' : 'hover:bg-surface-hover',
              )}
            >
              <button
                type="button"
                onClick={() => {
                  onSelect(conversation.id)
                }}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <input
                      className="w-full rounded border border-border bg-card px-2 py-1 text-sm text-text-primary focus:border-primary focus:outline-none"
                      value={draftTitle}
                      onChange={(event) => {
                        setDraftTitle(event.target.value)
                      }}
                      onBlur={commitRename}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          commitRename()
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <>
                      <p className="truncate text-sm font-medium">{conversation.title}</p>
                      <p className="text-xs text-text-muted">
                        {new Date(conversation.updatedAt).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </>
                  )}
                </div>
              </button>

              <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={commitRename}
                    className="rounded p-1 text-success hover:bg-success/10"
                    aria-label="Simpan nama"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      beginEditing(conversation.id, conversation.title)
                    }}
                    className="rounded p-1 text-text-muted hover:bg-surface-hover hover:text-text-primary"
                    aria-label="Ubah nama percakapan"
                  >
                    <PencilLine className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onDelete(conversation.id)
                  }}
                  className="rounded p-1 text-text-muted transition-colors hover:bg-error/10 hover:text-error"
                  aria-label="Hapus percakapan"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-border pt-4">
        {showResetConfirm ? (
          <div className="space-y-2">
            <p className="text-center text-sm text-text-primary">
              Yakin ingin menghapus semua riwayat?
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowResetConfirm(false)
                }}
                className="flex-1 justify-center text-text-secondary"
              >
                Batal
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetConfirm}
                className="flex-1 justify-center text-error transition-colors hover:!bg-error/10 hover:!text-error"
              >
                Hapus
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowResetConfirm(true)
            }}
            className="w-full justify-center gap-2 text-text-muted transition-colors hover:!bg-error/10 hover:!text-error"
          >
            <Trash2 className="h-4 w-4" />
            Hapus semua riwayat
          </Button>
        )}
      </div>
    </div>
  )
}

const ConversationHistory = memo(
  ConversationHistoryComponent,
  (prev, next) =>
    prev.activeConversationId === next.activeConversationId &&
    prev.conversations === next.conversations &&
    prev.onCreate === next.onCreate &&
    prev.onDelete === next.onDelete &&
    prev.onRename === next.onRename &&
    prev.onReset === next.onReset &&
    prev.onSelect === next.onSelect,
)

export { ConversationHistory }
