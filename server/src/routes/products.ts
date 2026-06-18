import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../db/client.js'
import { products } from '../db/schema.js'

const app = new Hono()

app.get('/', async c => {
  const { featured, category } = c.req.query()
  let query = db.select().from(products).$dynamic()

  if (featured === 'true') {
    query = query.where(eq(products.featured, true))
  } else if (category) {
    query = query.where(eq(products.category, category))
  }

  const rows = await query
  return c.json(rows)
})

app.get('/:slug', async c => {
  const slug = c.req.param('slug')
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)

  if (!product) return c.json({ error: 'Product not found' }, 404)
  return c.json(product)
})

export default app
