import { NextResponse, NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const INVENTORY_API_SECRET = process.env.INVENTORY_API_SECRET

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')

  if (!INVENTORY_API_SECRET) {
    return { error: 'Inventory API not configured', status: 503 }
  }

  if (!authHeader || authHeader !== `Bearer ${INVENTORY_API_SECRET}`) {
    return { error: 'Unauthorized', status: 401 }
  }

  return null
}

interface CheckoutItem {
  itemId: string
  quantity: number
}

export async function POST(request: NextRequest) {
  try {
    const authError = verifyAuth(request)
    if (authError) {
      return NextResponse.json({ error: authError.error }, { status: authError.status })
    }

    const body = await request.json()
    const { customerId, items, notes } = body as {
      customerId: string
      items: CheckoutItem[]
      notes?: string
    }

    if (!customerId) {
      return NextResponse.json(
        { error: 'customerId is required' },
        { status: 400 }
      )
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'items array is required and must not be empty' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Verify customer exists and is active
    const customer = await payload.findByID({
      collection: 'customers',
      id: customerId,
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    if (customer.status !== 'active') {
      return NextResponse.json(
        { error: `Customer account is ${customer.status}` },
        { status: 403 }
      )
    }

    const checkouts = []
    const errors = []

    for (const checkoutItem of items) {
      const { itemId, quantity = 1 } = checkoutItem

      // Fetch the inventory item
      const item = await payload.findByID({
        collection: 'inventory-items',
        id: itemId,
      })

      if (!item) {
        errors.push({ itemId, error: 'Item not found' })
        continue
      }

      if ((item.quantityAvailable ?? 0) < quantity) {
        errors.push({
          itemId,
          error: `Insufficient quantity. Available: ${item.quantityAvailable}, Requested: ${quantity}`,
        })
        continue
      }

      // Calculate due date
      const checkedOutAt = new Date()
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + (item.maxCheckoutDays || 7))

      // Create checkout record
      const checkout = await payload.create({
        collection: 'checkouts',
        data: {
          customer: Number(customerId),
          item: Number(itemId),
          quantity,
          status: 'checked-out',
          checkedOutAt: checkedOutAt.toISOString(),
          dueDate: dueDate.toISOString(),
          notes: notes || undefined,
        },
      })

      // Update item availability
      await payload.update({
        collection: 'inventory-items',
        id: itemId,
        data: {
          quantityAvailable: (item.quantityAvailable ?? 0) - quantity,
        },
      })

      checkouts.push({
        id: checkout.id,
        item: {
          id: item.id,
          name: item.name,
          barcode: item.barcode,
        },
        quantity,
        checkedOutAt,
        dueDate,
      })
    }

    if (checkouts.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { error: 'All checkout items failed', errors },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      checkouts,
      errors: errors.length > 0 ? errors : undefined,
      customer: {
        id: customer.id,
        name: customer.name,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error processing checkout:', error)
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
