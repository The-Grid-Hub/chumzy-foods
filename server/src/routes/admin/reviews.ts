import { Hono } from 'hono'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../db/client.js'
import { reviews } from '../../db/schema.js'

const app = new Hono()

app.get('/', async c => {
  const rows = await db.select().from(reviews).orderBy(desc(reviews.createdAt))
  return c.json(rows)
})

app.patch('/:id', async c => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  const body = await c.req.json().catch(() => ({}))
  const { approved } = body

  if (typeof approved !== 'boolean') {
    return c.json({ error: 'approved must be a boolean' }, 400)
  }

  const [review] = await db
    .update(reviews)
    .set({ approved })
    .where(eq(reviews.id, id))
    .returning()

  if (!review) return c.json({ error: 'Review not found' }, 404)
  return c.json(review)
})

app.delete('/:id', async c => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  const [review] = await db
    .delete(reviews)
    .where(eq(reviews.id, id))
    .returning()

  if (!review) return c.json({ error: 'Review not found' }, 404)
  return c.json({ message: 'Review deleted' })
})

export default app
