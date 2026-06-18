import { Hono } from 'hono'
import { db } from '../db/client.js'
import { orders, orderItems } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const app = new Hono()

app.post('/', async c => {
  const body = await c.req.json()
  const { customer, items, paymentMethod, notes } = body

  if (!customer || !items?.length || !paymentMethod) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  let totalUsd = 0

  for (const item of items) {
    totalUsd += parseFloat(item.unitPrice || '0') * item.quantity
  }

  const [order] = await db
    .insert(orders)
    .values({
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      country: customer.country,
      address: customer.address,
      totalUsd: totalUsd.toFixed(2),
      paymentMethod,
      notes: notes || null,
    })
    .returning()

  const itemRows = items.map((item: {
    productId: number
    productName: string
    quantity: number
    unitPrice: string
    currency: string
  }) => ({
    orderId: order.id,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    currency: item.currency || 'USD',
  }))

  await db.insert(orderItems).values(itemRows)

  return c.json({ orderId: order.id, status: order.status }, 201)
})

app.get('/:id', async c => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)
  if (!order) return c.json({ error: 'Order not found' }, 404)

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id))

  return c.json({ ...order, items })
})

export default app
