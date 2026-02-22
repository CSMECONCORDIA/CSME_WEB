export interface Customer {
  id: string
  cardId: string
  name: string
  email?: string
  phone?: string
  status: 'active' | 'suspended' | 'inactive'
  notes?: string
}

export interface InventoryItem {
  id: string
  name: string
  barcode: string
  description?: string
  category: string
  quantityAvailable: number
  quantityTotal: number
  location?: string
  maxCheckoutDays: number
  image?: {
    url: string
    alt: string
  }
}

export interface Checkout {
  id: string
  customer: Customer | string
  item: InventoryItem | string
  quantity: number
  status: 'checked-out' | 'returned' | 'overdue' | 'lost' | 'damaged'
  checkedOutAt: string
  dueDate: string
  returnedAt?: string
  notes?: string
}

export interface CartItem {
  item: InventoryItem
  quantity: number
}

export interface ScanResult {
  type: 'customer' | 'item' | 'unknown'
  customer?: Customer
  activeCheckouts?: Checkout[]
  item?: InventoryItem
  barcode?: string
  message?: string
}
