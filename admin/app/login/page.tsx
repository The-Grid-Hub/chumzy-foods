'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, Lock, Mail } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { ApiError } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, ready } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (ready && isAuthenticated) router.replace('/')
  }, [ready, isAuthenticated, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      router.replace('/')
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not log in. Try again.'
      )
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-green-dark">
      <div className="card w-full max-w-sm p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Leaf size={26} className="text-brand-green" />
          <div className="text-center">
            <p className="font-bold text-lg text-brand-dark">Chumzy Admin</p>
            <p className="text-xs text-brand-muted">Raw Foods</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
              />
              <input
                type="email"
                className="input-field pl-10"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@chumzy.com"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="label">Admin password</label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
              />
              <input
                type="password"
                className="input-field pl-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-sm text-brand-red">{error}</p>}

          <button type="submit" className="btn-green w-full" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
