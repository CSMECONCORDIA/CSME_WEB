'use client'

import { Customer, Checkout } from '../types'

interface CustomerCardProps {
  customer: Customer
  activeCheckouts: Checkout[]
  onLogout: () => void
  onReturnItem: (checkoutId: string) => void
}

export function CustomerCard({
  customer,
  activeCheckouts,
  onLogout,
  onReturnItem,
}: CustomerCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    inactive: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400',
  }

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date()

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      {/* Student Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-navy dark:bg-navy-light flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {customer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3
                className="text-xl font-bold text-slate-900 dark:text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {customer.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Card ID: {customer.cardId}
              </p>
              {customer.email && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {customer.email}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${statusColors[customer.status]}`}
            >
              {customer.status}
            </span>
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Switch student"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Active Checkouts */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Active Checkouts ({activeCheckouts.length})
        </h4>

        {activeCheckouts.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm py-4 text-center">
            No items currently checked out
          </p>
        ) : (
          <div className="space-y-3">
            {activeCheckouts.map((checkout) => {
              const item = typeof checkout.item === 'object' ? checkout.item : null
              const overdue = isOverdue(checkout.dueDate)

              return (
                <div
                  key={checkout.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    overdue
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">
                      {item?.name || 'Unknown Item'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Qty: {checkout.quantity}</span>
                      <span className={overdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                        Due: {new Date(checkout.dueDate).toLocaleDateString()}
                        {overdue && ' (OVERDUE)'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onReturnItem(checkout.id)}
                    className="ml-4 px-3 py-1.5 text-sm font-medium text-navy dark:text-navy-light hover:bg-navy/10 dark:hover:bg-navy-light/10 rounded transition-colors"
                  >
                    Return
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
