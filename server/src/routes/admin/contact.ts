import { Hono } from 'hono'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../db/client.js'
import { contactMessages } from '../../db/schema.js'

const app = new Hono()

app.get('/', async c => {
  const rows = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt))
  return c.json(rows)
})

app.patch('/:id/read', async c => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  const body = await c.req.json().catch(() => ({}))
  const { read } = body

  if (typeof read !== 'boolean') {
    return c.json({ error: 'read must be a boolean' }, 400)
  }

  const [message] = await db
    .update(contactMessages)
    .set({ read })
    .where(eq(contactMessages.id, id))
    .returning()

  if (!message) return c.json({ error: 'Message not found' }, 404)
  return c.json(message)
})

app.delete('/:id', async c => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  const [message] = await db
    .delete(contactMessages)
    .where(eq(contactMessages.id, id))
    .returning()

  if (!message) return c.json({ error: 'Message not found' }, 404)
  return c.json({ message: 'Message deleted' })
})

export default app
