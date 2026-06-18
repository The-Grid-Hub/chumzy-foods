import { Hono } from 'hono'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../db/client.js'
import { orders, orderItems, orderStatusEnum } from '../../db/schema.js'

const app = new Hono()

const ORDER_STATUSES = orderStatusEnum.enumValues

app.get('/', async c => {
  const { status } = c.req.query()
  let query = db.select().from(orders).$dynamic()

  if (status && (ORDER_STATUSES as readonly string[]).includes(status)) {
    query = query.where(
      eq(orders.status, status as (typeof ORDER_STATUSES)[number])
    )
  }

  const rows = await query.orderBy(desc(orders.createdAt))
  return c.json(rows)
})

app.get('/:id', async c => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)
  if (!order) return c.json({ error: 'Order not found' }, 404)

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id))

  return c.json({ ...order, items })
})

app.patch('/:id/status', async c => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  const body = await c.req.json().catch(() => ({}))
  const { status } = body

  if (!status || !(ORDER_STATUSES as readonly string[]).includes(status)) {
    return c.json(
      { error: `Status must be one of: ${ORDER_STATUSES.join(', ')}` },
      400
    )
  }

  const [order] = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning()

  if (!order) return c.json({ error: 'Order not found' }, 404)
  return c.json(order)
})

export default app
