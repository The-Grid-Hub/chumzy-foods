import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProductForm from '@/components/ProductForm'

export default function NewProductPage() {
  return (
    <div>
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-brand-muted hover:text-brand-dark mb-4"
      >
        <ArrowLeft size={16} /> Back to products
      </Link>
      <h1 className="text-2xl font-bold text-brand-dark mb-6">New product</h1>
      <ProductForm />
    </div>
  )
}
