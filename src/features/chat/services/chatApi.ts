import type { ApiErrorDetail, AskRequest, AskResponse } from '@/features/chat/types'

const resolvedEndpoint = import.meta.env.VITE_CHAT_API_URL as string | undefined
const API_ENDPOINT: string =
  typeof resolvedEndpoint === 'string' && resolvedEndpoint.length > 0
    ? resolvedEndpoint
    : 'http://localhost:8000/api/v1/ask'

class ChatApiError extends Error {
  public readonly detail: ApiErrorDetail

  constructor(detail: ApiErrorDetail) {
    super(detail.message)
    this.name = 'ChatApiError'
    this.detail = detail
  }
}

const toApiErrorDetail = async (response: Response): Promise<ApiErrorDetail> => {
  try {
    const body = (await response.json()) as Partial<ApiErrorDetail> & {
      message?: string
      detail?: string
    }
    return {
      status: response.status,
      code: body.code,
      message: body.message ?? body.detail ?? friendlyHttpMessage(response.status),
      cause: body,
    }
  } catch (error) {
    return {
      status: response.status,
      message: friendlyHttpMessage(response.status),
      cause: error,
    }
  }
}

const friendlyHttpMessage = (status: number): string => {
  if (status >= 500) {
    return 'The assistant service is unavailable. Please try again in a moment.'
  }

  if (status === 429) {
    return 'Too many requests right now. Give it a second and try again.'
  }

  if (status === 404) {
    return 'The assistant endpoint could not be reached.'
  }

  if (status === 400) {
    return 'The assistant could not understand that request.'
  }

  return 'We could not complete that request. Please retry.'
}

const askQuestion = async (payload: AskRequest, signal?: AbortSignal): Promise<AskResponse> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        use_cache: true,
        use_hybrid: false,
        ...payload,
      }),
      signal,
    })

    if (!response.ok) {
      throw new ChatApiError(await toApiErrorDetail(response))
    }

    const data = (await response.json()) as AskResponse

    if (!Array.isArray(data.source_urls)) {
      throw new ChatApiError({
        status: 200,
        message: 'Assistant response was missing supporting sources.',
      })
    }

    return data
  } catch (error) {
    if (error instanceof ChatApiError) {
      throw error
    }

    throw new ChatApiError({
      status: 0,
      message: 'Unable to reach the assistant service. Check your connection and retry.',
      cause: error,
    })
  }
}

export { askQuestion, ChatApiError }
