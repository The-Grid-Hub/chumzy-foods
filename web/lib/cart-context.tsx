'use client'
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import type { CartItem, Product } from './types'
import type { CurrencyCode } from './constants'

interface CartState {
  items: CartItem[]
  currency: CurrencyCode
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; currency: CurrencyCode }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'UPDATE_QTY'; productId: number; quantity: number }
  | { type: 'SET_CURRENCY'; currency: CurrencyCode }
  | { type: 'CLEAR' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.product.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1, currency: action.currency }],
      }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.product.id !== action.productId) }
    case 'UPDATE_QTY':
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.product.id !== action.productId) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      }
    case 'SET_CURRENCY':
      return { ...state, currency: action.currency }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

interface CartContextValue extends CartState {
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  updateQty: (productId: number, quantity: number) => void
  setCurrency: (currency: CurrencyCode) => void
  clearCart: () => void
  totalItems: number
  totalPrice: string
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], currency: 'USD' })

  useEffect(() => {
    const stored = localStorage.getItem('chumzy-cart')
    if (stored) {
      const parsed = JSON.parse(stored)
      parsed.items?.forEach((item: CartItem) => {
        dispatch({ type: 'ADD_ITEM', product: item.product, currency: parsed.currency || 'USD' })
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('chumzy-cart', JSON.stringify(state))
  }, [state])

  const getPrice = (product: Product) => {
    if (state.currency === 'NGN') return parseFloat(product.priceNgn || '0')
    if (state.currency === 'GBP') return parseFloat(product.priceGbp || '0')
    return parseFloat(product.priceUsd || '0')
  }

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = state.items
    .reduce((s, i) => s + getPrice(i.product) * i.quantity, 0)
    .toFixed(2)

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem: (product) => dispatch({ type: 'ADD_ITEM', product, currency: state.currency }),
        removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', productId }),
        updateQty: (productId, quantity) => dispatch({ type: 'UPDATE_QTY', productId, quantity }),
        setCurrency: (currency) => dispatch({ type: 'SET_CURRENCY', currency }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
