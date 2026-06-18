import { API_BASE, TOKEN_KEY } from './constants'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: boolean // attach Bearer token (default true)
}

/**
 * Thin fetch wrapper for the admin API. Injects the Bearer token, parses JSON,
 * and surfaces server `{ error }` messages as ApiError. On 401 it clears the
 * stored token and redirects to /login so an expired session can't get stuck.
 */
export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options
  const headers: Record<string, string> = {}

  if (body !== undefined) headers['Content-Type'] = 'application/json'

  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (auth) handleUnauthorized(res)

  return parseResponse<T>(res)
}

/**
 * Upload a single image file to the admin upload endpoint. Sends multipart
 * form-data (no manual Content-Type so the browser sets the boundary) with the
 * Bearer token, and reuses the same 401 / ApiError handling as apiFetch.
 */
export async function uploadFile(
  file: File
): Promise<{ url: string; publicId: string }> {
  const headers: Record<string, string> = {}
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE}/api/admin/upload`, {
    method: 'POST',
    headers,
    body: formData,
  })

  handleUnauthorized(res)

  return parseResponse<{ url: string; publicId: string }>(res)
}

/** Clear the session and redirect to /login on a 401 from an authed request. */
function handleUnauthorized(res: Response): void {
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    throw new ApiError('Session expired. Please log in again.', 401)
  }
}

/** Parse a JSON response, surfacing server `{ error }` messages as ApiError. */
async function parseResponse<T>(res: Response): Promise<T> {
  let data: unknown = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : `Request failed (${res.status})`
    throw new ApiError(message, res.status)
  }

  return data as T
}
