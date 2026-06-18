'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { apiFetch } from './api'
import { TOKEN_KEY } from './constants'

interface AuthContextValue {
  token: string | null
  isAuthenticated: boolean
  ready: boolean // true once we've read localStorage (avoids redirect flash)
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setToken(window.localStorage.getItem(TOKEN_KEY))
    setReady(true)
  }, [])

  async function login(email: string, password: string) {
    const { token: newToken } = await apiFetch<{ token: string }>(
      '/api/admin/login',
      { method: 'POST', body: { email, password }, auth: false }
    )
    window.localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
  }

  function logout() {
    window.localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, ready, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
