'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ScannerInput } from '../components/ScannerInput'
import { CustomerCard } from '../components/CustomerCard'
import { CheckoutCart } from '../components/CheckoutCart'
import { NewCustomerForm } from '../components/NewCustomerForm'
import { FadeIn } from '../../components/ScrollAnimations'
import { GearDecoration } from '../../components/GearDecoration'
import { Customer, InventoryItem, Checkout, CartItem, ScanResult } from '../types'

const API_SECRET = process.env.NEXT_PUBLIC_INVENTORY_API_SECRET || ''

type StationState = 'idle' | 'customer-logged-in' | 'new-customer' | 'checkout-complete'

interface CheckoutResult {
  id: string
  item: { id: string; name: string; barcode: string }
  quantity: number
  checkedOutAt: string
  dueDate: string
}

export function CheckoutStation() {
  const [state, setState] = useState<StationState>('idle')
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [activeCheckouts, setActiveCheckouts] = useState<Checkout[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [pendingCardId, setPendingCardId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [completedCheckouts, setCompletedCheckouts] = useState<CheckoutResult[]>([])

  const clearMessages = () => {
    setError(null)
    setSuccessMessage(null)
  }

  const handleScan = useCallback(async (barcode: string) => {
    clearMessages()
    setIsProcessing(true)

    try {
      const response = await fetch('/api/inventory/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_SECRET}`,
        },
        body: JSON.stringify({ barcode }),
      })

      const data: ScanResult = await response.json()

      if (!response.ok) {
        throw new Error((data as { error?: string }).error || 'Scan failed')
      }

      if (data.type === 'customer') {
        if (state === 'customer-logged-in' && customer) {
          // Already logged in, maybe they scanned their card again
          if (data.customer?.cardId === customer.cardId) {
            setSuccessMessage('You are already logged in!')
            return
          }
          // Different customer, switch
          setCustomer(data.customer!)
          setActiveCheckouts(data.activeCheckouts || [])
          setCart([])
          setSuccessMessage(`Switched to ${data.customer!.name}`)
        } else {
          // Log in customer
          setCustomer(data.customer!)
          setActiveCheckouts(data.activeCheckouts || [])
          setState('customer-logged-in')
          setSuccessMessage(`Welcome, ${data.customer!.name}!`)
        }
      } else if (data.type === 'item') {
        if (state !== 'customer-logged-in') {
          setError('Please scan your student card first')
          return
        }

        const item = data.item!
        if (item.quantityAvailable <= 0) {
          setError(`${item.name} is not available for checkout`)
          return
        }

        // Check if item is already in cart
        const existingIndex = cart.findIndex((c) => c.item.barcode === item.barcode)
        if (existingIndex >= 0) {
          const existing = cart[existingIndex]
          if (existing.quantity >= item.quantityAvailable) {
            setError(`Maximum available quantity (${item.quantityAvailable}) already in cart`)
            return
          }
          // Increment quantity
          const newCart = [...cart]
          newCart[existingIndex] = { ...existing, quantity: existing.quantity + 1 }
          setCart(newCart)
          setSuccessMessage(`Added another ${item.name} to cart`)
        } else {
          // Add new item to cart
          setCart([...cart, { item, quantity: 1 }])
          setSuccessMessage(`Added ${item.name} to cart`)
        }
      } else if (data.type === 'unknown') {
        if (state === 'idle') {
          // Unknown barcode in idle state = new customer
          setPendingCardId(barcode)
          setState('new-customer')
        } else {
          setError(`Unknown barcode: ${barcode}`)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }, [state, customer, cart])

  const handleCreateCustomer = async (data: { name: string; email?: string; phone?: string }) => {
    if (!pendingCardId) return

    clearMessages()
    setIsProcessing(true)

    try {
      const response = await fetch('/api/inventory/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_SECRET}`,
        },
        body: JSON.stringify({
          cardId: pendingCardId,
          ...data,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register student')
      }

      setCustomer(result.customer)
      setActiveCheckouts([])
      setState('customer-logged-in')
      setPendingCardId(null)
      setSuccessMessage(`Welcome, ${result.customer.name}! Your account has been created.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register student')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelNewCustomer = () => {
    setPendingCardId(null)
    setState('idle')
    clearMessages()
  }

  const handleLogout = () => {
    setCustomer(null)
    setActiveCheckouts([])
    setCart([])
    setState('idle')
    clearMessages()
  }

  const handleRemoveFromCart = (barcode: string) => {
    setCart(cart.filter((item) => item.item.barcode !== barcode))
  }

  const handleUpdateQuantity = (barcode: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(barcode)
      return
    }

    setCart(
      cart.map((item) =>
        item.item.barcode === barcode
          ? { ...item, quantity: Math.min(quantity, item.item.quantityAvailable) }
          : item
      )
    )
  }

  const handleCheckout = async () => {
    if (!customer || cart.length === 0) return

    clearMessages()
    setIsProcessing(true)

    try {
      const response = await fetch('/api/inventory/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_SECRET}`,
        },
        body: JSON.stringify({
          customerId: customer.id,
          items: cart.map((c) => ({ itemId: c.item.id, quantity: c.quantity })),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Checkout failed')
      }

      setCompletedCheckouts(result.checkouts)
      setCart([])
      setState('checkout-complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReturnItem = async (checkoutId: string) => {
    clearMessages()
    setIsProcessing(true)

    try {
      const response = await fetch('/api/inventory/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_SECRET}`,
        },
        body: JSON.stringify({ checkoutId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Return failed')
      }

      // Remove from active checkouts
      setActiveCheckouts(activeCheckouts.filter((c) => c.id !== checkoutId))
      setSuccessMessage(`${result.return.item.name} has been returned successfully!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Return failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNewCheckout = () => {
    setCompletedCheckouts([])
    setState('customer-logged-in')
    // Refresh active checkouts
    if (customer) {
      fetch(`/api/inventory/customer?cardId=${customer.cardId}`, {
        headers: { Authorization: `Bearer ${API_SECRET}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.activeCheckouts) {
            setActiveCheckouts(data.activeCheckouts)
          }
        })
        .catch(console.error)
    }
  }

  const handleDone = () => {
    setCustomer(null)
    setActiveCheckouts([])
    setCart([])
    setCompletedCheckouts([])
    setState('idle')
    clearMessages()
  }

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 overflow-hidden">
        <div className="absolute top-0 right-0 text-slate-200/50 dark:text-white/5">
          <GearDecoration size={300} spin />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <div>
                <Link
                  href="/inventory"
                  className="text-sm text-navy dark:text-navy-light hover:underline mb-2 inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Inventory
                </Link>
                <h1
                  className="text-4xl font-bold text-slate-900 dark:text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Checkout Station
                </h1>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    state === 'idle'
                      ? 'bg-amber-500 animate-pulse'
                      : state === 'customer-logged-in'
                      ? 'bg-green-500'
                      : state === 'checkout-complete'
                      ? 'bg-blue-500'
                      : 'bg-slate-400'
                  }`}
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {state === 'idle' && 'Waiting for card scan...'}
                  {state === 'customer-logged-in' && 'Ready to scan items'}
                  {state === 'new-customer' && 'New student registration'}
                  {state === 'checkout-complete' && 'Checkout complete'}
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Messages */}
          {error && (
            <FadeIn>
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-700 dark:text-red-400">{error}</p>
                <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </FadeIn>
          )}

          {successMessage && (
            <FadeIn>
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-700 dark:text-green-400">{successMessage}</p>
                <button onClick={() => setSuccessMessage(null)} className="ml-auto text-green-500 hover:text-green-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Idle State - Waiting for card scan */}
          {state === 'idle' && (
            <FadeIn>
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 mx-auto mb-6 bg-navy/10 dark:bg-navy-light/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-navy dark:text-navy-light"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                      />
                    </svg>
                  </div>
                  <h2
                    className="text-2xl font-bold text-slate-900 dark:text-white mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Scan Your Student Card
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Place your student card on the scanner to begin checkout
                  </p>
                </div>

                <ScannerInput
                  onScan={handleScan}
                  placeholder="Scan student card barcode..."
                  disabled={isProcessing}
                  autoFocus
                />
              </div>
            </FadeIn>
          )}

          {/* New Student Registration */}
          {state === 'new-customer' && pendingCardId && (
            <FadeIn>
              <div className="max-w-lg mx-auto">
                <NewCustomerForm
                  cardId={pendingCardId}
                  onSubmit={handleCreateCustomer}
                  onCancel={handleCancelNewCustomer}
                  isSubmitting={isProcessing}
                />
              </div>
            </FadeIn>
          )}

          {/* Student Logged In - Scanning Items */}
          {state === 'customer-logged-in' && customer && (
            <FadeIn>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Scanner & Student Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Scanner Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Scan Items to Add
                    </label>
                    <ScannerInput
                      onScan={handleScan}
                      placeholder="Scan item barcode..."
                      disabled={isProcessing}
                      autoFocus
                    />
                  </div>

                  {/* Student Card */}
                  <CustomerCard
                    customer={customer}
                    activeCheckouts={activeCheckouts}
                    onLogout={handleLogout}
                    onReturnItem={handleReturnItem}
                  />
                </div>

                {/* Right Column - Cart */}
                <div>
                  <CheckoutCart
                    items={cart}
                    onRemoveItem={handleRemoveFromCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onCheckout={handleCheckout}
                    isProcessing={isProcessing}
                  />
                </div>
              </div>
            </FadeIn>
          )}

          {/* Checkout Complete */}
          {state === 'checkout-complete' && (
            <FadeIn>
              <div className="max-w-2xl mx-auto text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2
                  className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Checkout Complete!
                </h2>

                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  You have successfully checked out {completedCheckouts.length} item
                  {completedCheckouts.length !== 1 ? 's' : ''}.
                </p>

                {/* Checked Out Items Summary */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-medium text-slate-900 dark:text-white mb-4">Items Checked Out:</h3>
                  <div className="space-y-3">
                    {completedCheckouts.map((checkout) => (
                      <div
                        key={checkout.id}
                        className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{checkout.item.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Qty: {checkout.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600 dark:text-slate-400">Due:</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {new Date(checkout.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button onClick={handleNewCheckout} className="btn-outline">
                    Check Out More Items
                  </button>
                  <button onClick={handleDone} className="btn-primary">
                    Done
                  </button>
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  )
}
