// Entity shapes mirror the server's Drizzle-inferred types.
// Prices/totals are Postgres `numeric` → serialized as strings (or null).

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  category: string
  priceNgn: string | null
  priceUsd: string | null
  priceGbp: string | null
  packagingSize: string
  inStock: boolean
  imageUrl: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductInput {
  name: string
  slug: string
  description: string
  category: string
  packagingSize: string
  priceNgn: string | null
  priceUsd: string | null
  priceGbp: string | null
  inStock: boolean
  imageUrl: string | null
  featured: boolean
}

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  productName: string
  quantity: number
  unitPrice: string
  currency: string
}

export interface Order {
  id: number
  customerName: string
  customerEmail: string
  customerPhone: string
  country: string
  address: string
  totalNgn: string | null
  totalUsd: string | null
  totalGbp: string | null
  status: OrderStatus
  paymentMethod: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
}

export interface Review {
  id: number
  customerName: string
  country: string
  rating: number
  comment: string
  productsPurchased: string | null
  approved: boolean
  createdAt: string
}

export const BULK_STATUSES = ['new', 'contacted', 'closed'] as const
export type BulkStatus = (typeof BULK_STATUSES)[number]

export interface BulkOrderRequest {
  id: number
  businessName: string | null
  contactName: string
  email: string
  phone: string
  country: string
  productRequests: string
  estimatedQuantity: string
  deliveryTimeline: string | null
  additionalNotes: string | null
  status: string
  createdAt: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export interface DashboardStats {
  products: number
  orders: {
    total: number
    byStatus: Record<string, number>
  }
  pendingReviews: number
  unreadMessages: number
  newBulkRequests: number
}
