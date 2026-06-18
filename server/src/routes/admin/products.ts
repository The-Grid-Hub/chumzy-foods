import { Hono } from 'hono'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../db/client.js'
import { products } from '../../db/schema.js'
import type { NewProduct } from '../../db/schema.js'

const app = new Hono()

app.get('/', async c => {
  const rows = await db.select().from(products).orderBy(desc(products.createdAt))
  return c.json(rows)
})

app.post('/', async c => {
  const body = await c.req.json().catch(() => ({}))
  const {
    name,
    slug,
    description,
    category,
    packagingSize,
    priceNgn,
    priceUsd,
    priceGbp,
    inStock,
    imageUrl,
    featured,
  } = body

  if (!name || !slug || !description || !category || !packagingSize) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const values: NewProduct = {
    name,
    slug,
    description,
    category,
    packagingSize,
    priceNgn: priceNgn || null,
    priceUsd: priceUsd || null,
    priceGbp: priceGbp || null,
    inStock: inStock ?? true,
    imageUrl: imageUrl || null,
    featured: featured ?? false,
  }

  try {
    const [product] = await db.insert(products).values(values).returning()
    return c.json(product, 201)
  } catch (err) {
    if (isUniqueViolation(err)) {
      return c.json({ error: 'A product with this slug already exists' }, 409)
    }
    throw err
  }
})

app.put('/:id', async c => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  const body = await c.req.json().catch(() => ({}))
  const allowed: (keyof NewProduct)[] = [
    'name',
    'slug',
    'description',
    'category',
    'packagingSize',
    'priceNgn',
    'priceUsd',
    'priceGbp',
    'inStock',
    'imageUrl',
    'featured',
  ]

  const updates: Partial<NewProduct> = {}
  for (const key of allowed) {
    if (key in body) {
      // Normalize empty price/image strings to null
      const value = body[key]
      ;(updates as Record<string, unknown>)[key] =
        value === '' && key !== 'name' ? null : value
    }
  }

  if (Object.keys(updates).length === 0) {
    return c.json({ error: 'No valid fields to update' }, 400)
  }

  updates.updatedAt = new Date()

  try {
    const [product] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning()

    if (!product) return c.json({ error: 'Product not found' }, 404)
    return c.json(product)
  } catch (err) {
    if (isUniqueViolation(err)) {
      return c.json({ error: 'A product with this slug already exists' }, 409)
    }
    throw err
  }
})

app.delete('/:id', async c => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  try {
    const [product] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning()

    if (!product) return c.json({ error: 'Product not found' }, 404)
    return c.json({ message: 'Product deleted' })
  } catch (err) {
    if (isForeignKeyViolation(err)) {
      return c.json(
        { error: 'Cannot delete a product that is referenced by existing orders' },
        409
      )
    }
    throw err
  }
})

function isUniqueViolation(err: unknown): boolean {
  return isPgError(err) && err.code === '23505'
}

function isForeignKeyViolation(err: unknown): boolean {
  return isPgError(err) && err.code === '23503'
}

function isPgError(err: unknown): err is { code: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as { code: unknown }).code === 'string'
  )
}

export default app
