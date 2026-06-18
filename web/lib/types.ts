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

export interface CartItem {
  product: Product
  quantity: number
  currency: 'USD' | 'GBP' | 'NGN'
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

export interface BulkOrderForm {
  businessName?: string
  contactName: string
  email: string
  phone: string
  country: string
  productRequests: string
  estimatedQuantity: string
  deliveryTimeline?: string
  additionalNotes?: string
}

export interface ContactForm {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}
