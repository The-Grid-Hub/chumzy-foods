import { Hono } from 'hono'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../db/client.js'
import { bulkOrderRequests } from '../../db/schema.js'

const app = new Hono()

const BULK_STATUSES = ['new', 'contacted', 'closed']

app.get('/', async c => {
  const rows = await db
    .select()
    .from(bulkOrderRequests)
    .orderBy(desc(bulkOrderRequests.createdAt))
  return c.json(rows)
})

app.patch('/:id/status', async c => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  const body = await c.req.json().catch(() => ({}))
  const { status } = body

  if (!status || !BULK_STATUSES.includes(status)) {
    return c.json(
      { error: `Status must be one of: ${BULK_STATUSES.join(', ')}` },
      400
    )
  }

  const [request] = await db
    .update(bulkOrderRequests)
    .set({ status })
    .where(eq(bulkOrderRequests.id, id))
    .returning()

  if (!request) return c.json({ error: 'Bulk order request not found' }, 404)
  return c.json(request)
})

app.delete('/:id', async c => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  const [request] = await db
    .delete(bulkOrderRequests)
    .where(eq(bulkOrderRequests.id, id))
    .returning()

  if (!request) return c.json({ error: 'Bulk order request not found' }, 404)
  return c.json({ message: 'Bulk order request deleted' })
})

export default app
