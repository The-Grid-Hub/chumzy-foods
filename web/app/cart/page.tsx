'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { WHATSAPP_NUMBER } from '@/lib/constants'

interface CheckoutForm {
  name: string
  email: string
  phone: string
  country: string
  address: string
  paymentMethod: string
}

const PAYMENT_LABELS: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  cash: 'Cash on Delivery',
  stripe: 'Card (Stripe)',
  paypal: 'PayPal',
}

function buildWhatsAppUrl(
  items: ReturnType<typeof useCart>['items'],
  delivery?: CheckoutForm,
): string {
  const lines = items.map(item => `• ${item.product.name} x${item.quantity}`)
  const msg = [
    'Hello Chumzy! 👋 I would like to place an order:',
    '',
    ...lines,
    ...(delivery
      ? [
          '',
          'Delivery details:',
          `Name: ${delivery.name}`,
          `Email: ${delivery.email}`,
          `Phone: ${delivery.phone}`,
          `Country: ${delivery.country}`,
          `Address: ${delivery.address}`,
          `Payment: ${PAYMENT_LABELS[delivery.paymentMethod] ?? delivery.paymentMethod}`,
        ]
      : []),
    '',
    'Please confirm availability, pricing, and delivery details. Thank you!',
  ].join('\n')
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export default function CartPage() {
  const { items, updateQty, removeItem } = useCart()
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    name: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    paymentMethod: 'bank_transfer',
  })

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    window.open(buildWhatsAppUrl(items, checkoutForm), '_blank', 'noopener,noreferrer')
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-brand-cream py-20">
        <div className="content-wrap max-w-lg mx-auto text-center">
          <ShoppingBag size={64} className="text-stone-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-brand-dark mb-3">Your cart is empty</h1>
          <p className="text-brand-muted mb-8">Add some products to get started!</p>
          <Link href="/#products" className="btn-green">Browse Products</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-brand-cream py-10">
      <div className="content-wrap">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-green text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to shopping
        </Link>
        <h1 className="text-3xl font-bold text-brand-dark mb-2">Your Cart</h1>
        <p className="text-brand-muted mb-8">{items.length} item{items.length !== 1 ? 's' : ''}</p>

        <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
          {/* Items */}
          <div className="space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="card p-5 flex gap-4 items-start">
                <div
                  className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fef3e2 100%)' }}
                >
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    '🥫'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-brand-dark truncate">{product.name}</h3>
                  <p className="text-xs text-brand-muted mb-3">{product.packagingSize}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQty(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQty(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(product.id)}
                  className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Right: summary + checkout */}
          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="font-bold text-brand-dark text-lg mb-4">Order Summary</h2>
              <div className="flex justify-between text-sm text-brand-muted mb-2">
                <span>Items</span>
                <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-brand-muted mb-2">
                <span>Pricing</span>
                <span className="text-brand-green font-medium">Confirmed on WhatsApp</span>
              </div>
              <div className="flex justify-between text-sm text-brand-muted">
                <span>Delivery</span>
                <span className="text-brand-green font-medium">Confirmed after order</span>
              </div>
            </div>

            <a
              href={buildWhatsAppUrl(items)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full text-white font-semibold py-3.5 rounded-xl transition-colors"
              style={{ background: '#25D366' }}
            >
              <span>📱</span> Order via WhatsApp
            </a>

            <div className="card p-6">
              <h2 className="font-bold text-brand-dark text-lg mb-4">Delivery Details</h2>
              <form onSubmit={handleCheckout} className="space-y-3">
                <input required className="input-field" placeholder="Full name *" value={checkoutForm.name} onChange={e => setCheckoutForm(f => ({ ...f, name: e.target.value }))} />
                <input required type="email" className="input-field" placeholder="Email *" value={checkoutForm.email} onChange={e => setCheckoutForm(f => ({ ...f, email: e.target.value }))} />
                <input required className="input-field" placeholder="Phone / WhatsApp *" value={checkoutForm.phone} onChange={e => setCheckoutForm(f => ({ ...f, phone: e.target.value }))} />
                <input required className="input-field" placeholder="Country *" value={checkoutForm.country} onChange={e => setCheckoutForm(f => ({ ...f, country: e.target.value }))} />
                <textarea required rows={2} className="input-field resize-none" placeholder="Delivery address *" value={checkoutForm.address} onChange={e => setCheckoutForm(f => ({ ...f, address: e.target.value }))} />
                <select className="input-field" value={checkoutForm.paymentMethod} onChange={e => setCheckoutForm(f => ({ ...f, paymentMethod: e.target.value }))}>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash on Delivery</option>
                  <option value="stripe">Card (Stripe)</option>
                  <option value="paypal">PayPal</option>
                </select>
                <button type="submit" className="btn-green w-full py-3.5">
                  Order via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
