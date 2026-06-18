'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { CURRENCIES, API_BASE, WHATSAPP_NUMBER } from '@/lib/constants'
import type { CurrencyCode } from '@/lib/constants'

function buildWhatsAppMessage(items: ReturnType<typeof useCart>['items'], currency: string, total: string): string {
  const currInfo = CURRENCIES.find(c => c.code === currency)!
  const lines = items.map(item => {
    const price = currency === 'NGN' ? item.product.priceNgn : currency === 'GBP' ? item.product.priceGbp : item.product.priceUsd
    return `• ${item.product.name} x${item.quantity} (${currInfo.symbol}${parseFloat(price || '0').toLocaleString()} each)`
  })
  const msg = [
    'Hello Chumzy! 👋 I would like to place an order:',
    '',
    ...lines,
    '',
    `Total: ${currInfo.symbol}${parseFloat(total).toLocaleString()} (${currency})`,
    '',
    'Please confirm availability and delivery details. Thank you!',
  ].join('\n')
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export default function CartPage() {
  const { items, currency, setCurrency, updateQty, removeItem, totalPrice, clearCart } = useCart()
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', phone: '', country: '', address: '', paymentMethod: 'bank_transfer' })
  const [submitting, setSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState<number | null>(null)

  const currInfo = CURRENCIES.find(c => c.code === currency)!

  const getPrice = (product: ReturnType<typeof useCart>['items'][0]['product']) => {
    const p = currency === 'NGN' ? product.priceNgn : currency === 'GBP' ? product.priceGbp : product.priceUsd
    return parseFloat(p || '0')
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: checkoutForm,
          items: items.map(i => ({
            productId: i.product.id,
            productName: i.product.name,
            quantity: i.quantity,
            unitPrice: getPrice(i.product).toFixed(2),
            currency,
          })),
          paymentMethod: checkoutForm.paymentMethod,
        }),
      })
      const data = await res.json()
      setOrderPlaced(data.orderId)
      clearCart()
    } catch {
      alert('Could not place order. Please order via WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-brand-cream py-20">
        <div className="content-wrap max-w-lg mx-auto text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-brand-dark mb-4">Order #{orderPlaced} Placed!</h1>
          <p className="text-brand-muted mb-8">
            Thank you for your order! We will contact you via WhatsApp or email to confirm delivery details and payment.
          </p>
          <Link href="/" className="btn-green">Continue Shopping</Link>
        </div>
      </main>
    )
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
            {/* Currency selector */}
            <div className="card p-4 flex items-center gap-3">
              <span className="text-sm font-medium text-brand-dark">Display prices in:</span>
              <div className="flex gap-2">
                {CURRENCIES.map(c => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code as CurrencyCode)}
                    className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={currency === c.code
                      ? { background: '#1A5C2A', color: 'white' }
                      : { background: '#f5f5f4', color: '#78716C' }
                    }
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            {items.map(({ product, quantity }) => (
              <div key={product.id} className="card p-5 flex gap-4 items-start">
                <div
                  className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl"
                  style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fef3e2 100%)' }}
                >
                  🥫
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
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-brand-green text-lg">
                    {currInfo.symbol}{(getPrice(product) * quantity).toLocaleString()}
                  </div>
                  <div className="text-xs text-brand-muted">{currInfo.symbol}{getPrice(product).toLocaleString()} ea</div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="mt-2 text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: summary + checkout */}
          <div className="space-y-4">
            {/* Summary */}
            <div className="card p-6">
              <h2 className="font-bold text-brand-dark text-lg mb-4">Order Summary</h2>
              <div className="flex justify-between text-sm text-brand-muted mb-2">
                <span>Subtotal</span>
                <span>{currInfo.symbol}{parseFloat(totalPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-brand-muted mb-4">
                <span>Delivery</span>
                <span className="text-brand-green font-medium">Confirmed after order</span>
              </div>
              <div className="border-t border-stone-100 pt-4 flex justify-between font-bold text-brand-dark">
                <span>Total</span>
                <span className="text-brand-green text-xl">{currInfo.symbol}{parseFloat(totalPrice).toLocaleString()}</span>
              </div>
            </div>

            {/* WhatsApp shortcut */}
            <a
              href={buildWhatsAppMessage(items, currency, totalPrice)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full text-white font-semibold py-3.5 rounded-xl transition-colors"
              style={{ background: '#25D366' }}
            >
              <span>📱</span> Order via WhatsApp instead
            </a>

            {/* Checkout form */}
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
                <button type="submit" disabled={submitting} className="btn-green w-full py-3.5 disabled:opacity-60">
                  {submitting ? 'Placing order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
