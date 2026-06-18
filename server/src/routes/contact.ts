import { Hono } from 'hono'
import { db } from '../db/client.js'
import { contactMessages } from '../db/schema.js'

const app = new Hono()

app.post('/', async c => {
  const body = await c.req.json()
  const { name, email, phone, subject, message } = body

  if (!name || !email || !subject || !message) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const [msg] = await db
    .insert(contactMessages)
    .values({
      name,
      email,
      phone: phone || null,
      subject,
      message,
    })
    .returning()

  return c.json({ id: msg.id, message: 'Message received. We will get back to you soon!' }, 201)
})

export default app
