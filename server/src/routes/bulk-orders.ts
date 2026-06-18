import { Hono } from 'hono'
import { db } from '../db/client.js'
import { bulkOrderRequests } from '../db/schema.js'

const app = new Hono()

app.post('/', async c => {
  const body = await c.req.json()
  const {
    businessName,
    contactName,
    email,
    phone,
    country,
    productRequests,
    estimatedQuantity,
    deliveryTimeline,
    additionalNotes,
  } = body

  if (!contactName || !email || !phone || !country || !productRequests || !estimatedQuantity) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const [request] = await db
    .insert(bulkOrderRequests)
    .values({
      businessName: businessName || null,
      contactName,
      email,
      phone,
      country,
      productRequests,
      estimatedQuantity,
      deliveryTimeline: deliveryTimeline || null,
      additionalNotes: additionalNotes || null,
    })
    .returning()

  return c.json({ id: request.id, message: 'Bulk order request submitted successfully' }, 201)
})

export default app
