export interface Product {
  id: number
  name: string
  slug: string
  description: string
  category: string
  packagingSize: string
  inStock: boolean
  imageUrl: string | null
  featured: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Review {
  id: number
  customerName: string
  country: string
  rating: number
  comment: string
  productsPurchased: string | null
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
