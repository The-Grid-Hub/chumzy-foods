import { Hono } from 'hono'
import { count, eq } from 'drizzle-orm'
import { db } from '../../db/client.js'
import {
  products,
  orders,
  reviews,
  contactMessages,
  bulkOrderRequests,
} from '../../db/schema.js'

const app = new Hono()

app.get('/', async c => {
  const [
    [productCount],
    [totalOrders],
    ordersByStatus,
    [pendingReviews],
    [unreadMessages],
    [newBulkRequests],
  ] = await Promise.all([
    db.select({ value: count() }).from(products),
    db.select({ value: count() }).from(orders),
    db
      .select({ status: orders.status, value: count() })
      .from(orders)
      .groupBy(orders.status),
    db.select({ value: count() }).from(reviews).where(eq(reviews.approved, false)),
    db
      .select({ value: count() })
      .from(contactMessages)
      .where(eq(contactMessages.read, false)),
    db
      .select({ value: count() })
      .from(bulkOrderRequests)
      .where(eq(bulkOrderRequests.status, 'new')),
  ])

  const statusCounts: Record<string, number> = {}
  for (const row of ordersByStatus) {
    statusCounts[row.status] = row.value
  }

  return c.json({
    products: productCount.value,
    orders: {
      total: totalOrders.value,
      byStatus: statusCounts,
    },
    pendingReviews: pendingReviews.value,
    unreadMessages: unreadMessages.value,
    newBulkRequests: newBulkRequests.value,
  })
})

export default app
