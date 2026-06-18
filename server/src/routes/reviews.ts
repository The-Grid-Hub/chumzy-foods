import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../db/client.js'
import { reviews } from '../db/schema.js'

const app = new Hono()

app.get('/', async c => {
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.approved, true))
  return c.json(rows)
})

app.post('/', async c => {
  const body = await c.req.json()
  const { customerName, country, rating, comment, productsPurchased } = body

  if (!customerName || !country || !rating || !comment) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  if (rating < 1 || rating > 5) {
    return c.json({ error: 'Rating must be between 1 and 5' }, 400)
  }

  const [review] = await db
    .insert(reviews)
    .values({
      customerName,
      country,
      rating,
      comment,
      productsPurchased: productsPurchased || null,
      approved: false,
    })
    .returning()

  return c.json(
    { id: review.id, message: 'Review submitted and pending approval' },
    201
  )
})

export default app
