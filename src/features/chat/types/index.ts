type ChatRole = 'user' | 'assistant' | 'system'

interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  sources?: string[]
}

interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
}

interface AskRequest {
  question: string
  use_cache?: boolean
  use_hybrid?: boolean
}

interface AskResponse {
  answer: string
  source_urls: string[]
  metadata?: Record<string, unknown>
}

interface ApiErrorDetail {
  status: number
  message: string
  code?: string
  cause?: unknown
}

export type { ApiErrorDetail, AskRequest, AskResponse, ChatMessage, ChatRole, Conversation }
