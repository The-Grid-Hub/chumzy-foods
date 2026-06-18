import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import bulkOrdersRouter from './routes/bulk-orders.js'
import reviewsRouter from './routes/reviews.js'
import contactRouter from './routes/contact.js'

import adminAuthRouter from './routes/admin/auth.js'
import adminProductsRouter from './routes/admin/products.js'
import adminOrdersRouter from './routes/admin/orders.js'
import adminReviewsRouter from './routes/admin/reviews.js'
import adminBulkOrdersRouter from './routes/admin/bulk-orders.js'
import adminContactRouter from './routes/admin/contact.js'
import adminStatsRouter from './routes/admin/stats.js'
import adminUploadRouter from './routes/admin/upload.js'
import { requireAuth } from './middleware/requireAuth.js'

const app = new Hono()

// Normalize away any trailing slash — browsers send the Origin header without
// one, so an env value like `https://example.com/` would never match.
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  process.env.ADMIN_URL || 'http://localhost:3002',
  process.env.FRONTEND_URL_DEV || 'http://localhost:3001',
].map(origin => origin.replace(/\/$/, ''))

const isLocalhostOrigin = (origin: string) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)

app.use('*', logger())
app.use(
  '*',
  cors({
    // Reflect the request origin when it's explicitly allowed or any localhost
    // port (so local dev still works if web runs on a non-3000 port); prod stays
    // strict via FRONTEND_URL / ADMIN_URL.
    origin: origin =>
      allowedOrigins.includes(origin) || isLocalhostOrigin(origin)
        ? origin
        : allowedOrigins[0],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
)

app.get('/health', c => c.json({ status: 'ok', service: 'chumzy-server' }))

app.route('/api/products', productsRouter)
app.route('/api/orders', ordersRouter)
app.route('/api/bulk-orders', bulkOrdersRouter)
app.route('/api/reviews', reviewsRouter)
app.route('/api/contact', contactRouter)

// Admin API — login is public; everything else requires a valid JWT.
app.route('/api/admin/login', adminAuthRouter)
app.use('/api/admin/*', requireAuth)
app.route('/api/admin/products', adminProductsRouter)
app.route('/api/admin/orders', adminOrdersRouter)
app.route('/api/admin/reviews', adminReviewsRouter)
app.route('/api/admin/bulk-orders', adminBulkOrdersRouter)
app.route('/api/admin/contact', adminContactRouter)
app.route('/api/admin/stats', adminStatsRouter)
app.route('/api/admin/upload', adminUploadRouter)

const port = parseInt(process.env.PORT || '3001')

serve({ fetch: app.fetch, port }, info => {
  console.log(`Chumzy Server running on http://localhost:${info.port}`)
})
