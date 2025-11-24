import { useMemo, useState } from 'react'
import { clsx } from 'clsx'
import { Check, MessageSquare, PencilLine, Plus, Trash2 } from 'lucide-react'
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

const ConversationHistory = ({
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

  return (
    <aside className="surface-panel flex h-full flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-muted text-xs uppercase tracking-[0.3em]">History</p>
          <h2 className="text-text-primary mt-1 text-lg font-semibold">Percakapan</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Baru
        </Button>
      </div>

      <div>
        <label className="sr-only" htmlFor="conversation-search">
          Cari riwayat percakapan
        </label>
        <div className="bg-surface-hover/60 focus-within:border-primary/30 border-border mb-3 flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition">
          <input
            id="conversation-search"
            type="search"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value)
            }}
            placeholder="Cari riwayat…"
            className="bg-transparent flex-1 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
      </div>

      <div className="-mx-2 flex-1 space-y-1 overflow-y-auto pr-1">
        {filteredConversations.length === 0 && (
          <div className="text-text-muted text-sm">
            {conversations.length === 0
              ? 'Riwayat kosong. Mulai percakapan baru untuk menyimpannya di sini.'
              : 'Tidak ada percakapan yang cocok dengan pencarian.'}
          </div>
        )}
        {filteredConversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId
          const isEditing = editingId === conversation.id

          return (
            <div
              key={conversation.id}
              className={clsx(
                'group flex items-center gap-2 rounded-2xl border border-transparent px-2 py-2 transition',
                isActive ? 'border-primary/20 bg-primary/10' : 'hover:bg-surface-hover/80',
              )}
            >
              <button
                type="button"
                onClick={() => {
                  onSelect(conversation.id)
                }}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <span className="bg-surface text-text-secondary flex h-9 w-9 items-center justify-center rounded-2xl">
                  <MessageSquare className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      className="text-text-primary w-full rounded-xl border border-border bg-card px-3 py-1 text-sm focus:border-primary focus:outline-none"
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
                    <p className="text-text-primary text-sm font-medium">{conversation.title}</p>
                  )}
                  <p className="text-text-muted text-xs">
                    {new Date(conversation.updatedAt).toLocaleString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={commitRename}
                    className="text-success hover:text-success/80"
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
                    className="text-text-muted hover:text-text-primary"
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
                  className="text-error hover:text-error/80"
                  aria-label="Hapus percakapan"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="text-text-muted justify-center"
      >
        Hapus semua riwayat
      </Button>
    </aside>
  )
}

export { ConversationHistory }
