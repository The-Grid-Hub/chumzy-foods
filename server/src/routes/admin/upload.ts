import { Hono } from 'hono'
import { uploadImage } from '../../lib/cloudinary.js'

const app = new Hono()

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

app.post('/', async c => {
  const body = await c.req.parseBody()
  const file = body['file']

  if (!(file instanceof File)) {
    return c.json({ error: 'Missing image file' }, 400)
  }

  if (!file.type.startsWith('image/')) {
    return c.json({ error: 'File must be an image' }, 400)
  }

  if (file.size > MAX_BYTES) {
    return c.json({ error: 'Image must be 5MB or smaller' }, 400)
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const { url, publicId } = await uploadImage(buffer)
    return c.json({ url, publicId })
  } catch (err) {
    console.error('Cloudinary upload failed:', err)
    return c.json({ error: 'Image upload failed' }, 500)
  }
})

export default app
