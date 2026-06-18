import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '../../db/client.js'
import { adminUsers } from '../../db/schema.js'
import { signAdminToken } from '../../middleware/requireAuth.js'

const app = new Hono()

app.post('/', async c => {
  const body = await c.req.json().catch(() => ({}))
  const { email, password } = body

  if (!email || !password) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1)

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  return c.json({ token: signAdminToken(user) })
})

export default app
