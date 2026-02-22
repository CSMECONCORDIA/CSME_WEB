'use client'

import { CartItem } from '../types'

interface CheckoutCartProps {
  items: CartItem[]
  onRemoveItem: (barcode: string) => void
  onUpdateQuantity: (barcode: string, quantity: number) => void
  onCheckout: () => void
  isProcessing: boolean
}

export function CheckoutCart({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  isProcessing,
}: CheckoutCartProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const categoryLabels: Record<string, string> = {
    'hand-tools': 'Hand Tools',
    'power-tools': 'Power Tools',
    measuring: 'Measuring',
    safety: 'Safety',
    electronics: 'Electronics',
    microcontrollers: 'Microcontrollers',
    '3d-printing': '3D Printing',
    materials: 'Materials',
    consumables: 'Consumables',
    other: 'Other',
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      {/* Cart Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3
            className="text-lg font-bold text-slate-900 dark:text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Checkout Cart
          </h3>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {totalItems} item{totalItems !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Cart Items */}
      <div className="max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <p className="text-slate-500 dark:text-slate-400">
              Scan items to add to cart
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {items.map((cartItem) => (
              <div key={cartItem.item.barcode} className="p-4 flex items-start gap-4">
                {/* Item Image or Placeholder */}
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded flex-shrink-0 flex items-center justify-center">
                  {cartItem.item.image?.url ? (
                    <img
                      src={cartItem.item.image.url}
                      alt={cartItem.item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <svg
                      className="w-8 h-8 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 dark:text-white truncate">
                    {cartItem.item.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {categoryLabels[cartItem.item.category] || cartItem.item.category}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    Due in {cartItem.item.maxCheckoutDays} days
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        onUpdateQuantity(cartItem.item.barcode, cartItem.quantity - 1)
                      }
                      disabled={cartItem.quantity <= 1}
                      className="w-6 h-6 flex items-center justify-center rounded border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-slate-900 dark:text-white">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(cartItem.item.barcode, cartItem.quantity + 1)
                      }
                      disabled={cartItem.quantity >= cartItem.item.quantityAvailable}
                      className="w-6 h-6 flex items-center justify-center rounded border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">
                      ({cartItem.item.quantityAvailable} available)
                    </span>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveItem(cartItem.item.barcode)}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Button */}
      {items.length > 0 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onCheckout}
            disabled={isProcessing}
            className="w-full btn-primary py-3 text-base flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Complete Checkout ({totalItems} item{totalItems !== 1 ? 's' : ''})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
