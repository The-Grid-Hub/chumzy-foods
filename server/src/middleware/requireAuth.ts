import type { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

export interface AdminTokenPayload {
  sub: number
  email: string
  role: string
}

export function signAdminToken(user: {
  id: number
  email: string
  role: string
}): string {
  const payload: AdminTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export async function requireAuth(c: Context, next: Next) {
  const header = c.req.header('Authorization')
  if (!header || !header.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = header.slice('Bearer '.length).trim()
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as AdminTokenPayload
    c.set('admin', decoded)
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }

  await next()
}
