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

export async function POST(request: NextRequest) {
  try {
    const authError = verifyAuth(request)
    if (authError) {
      return NextResponse.json({ error: authError.error }, { status: authError.status })
    }

    const body = await request.json()
    const { checkoutId, itemBarcode, customerId, condition, notes } = body

    const payload = await getPayload({ config })

    let checkout

    // Find checkout by ID directly
    if (checkoutId) {
      checkout = await payload.findByID({
        collection: 'checkouts',
        id: checkoutId,
        depth: 2,
      })
    }
    // Or find by item barcode and customer
    else if (itemBarcode && customerId) {
      // First find the item by barcode
      const items = await payload.find({
        collection: 'inventory-items',
        where: {
          barcode: { equals: itemBarcode },
        },
        limit: 1,
      })

      if (items.docs.length === 0) {
        return NextResponse.json(
          { error: 'Item not found with this barcode' },
          { status: 404 }
        )
      }

      const item = items.docs[0]

      // Find active checkout for this customer and item
      const checkouts = await payload.find({
        collection: 'checkouts',
        where: {
          customer: { equals: customerId },
          item: { equals: item.id },
          status: { in: ['checked-out', 'overdue'] },
        },
        depth: 2,
        limit: 1,
        sort: '-checkedOutAt', // Most recent first
      })

      if (checkouts.docs.length > 0) {
        checkout = checkouts.docs[0]
      }
    }
    // Or find by just item barcode (return the oldest active checkout for this item)
    else if (itemBarcode) {
      const items = await payload.find({
        collection: 'inventory-items',
        where: {
          barcode: { equals: itemBarcode },
        },
        limit: 1,
      })

      if (items.docs.length === 0) {
        return NextResponse.json(
          { error: 'Item not found with this barcode' },
          { status: 404 }
        )
      }

      const item = items.docs[0]

      const checkouts = await payload.find({
        collection: 'checkouts',
        where: {
          item: { equals: item.id },
          status: { in: ['checked-out', 'overdue'] },
        },
        depth: 2,
        limit: 1,
        sort: 'checkedOutAt', // Oldest first (FIFO)
      })

      if (checkouts.docs.length > 0) {
        checkout = checkouts.docs[0]
      }
    }

    if (!checkout) {
      return NextResponse.json(
        { error: 'No active checkout found' },
        { status: 404 }
      )
    }

    if (checkout.status === 'returned') {
      return NextResponse.json(
        { error: 'This item has already been returned' },
        { status: 400 }
      )
    }

    // Determine return status based on condition
    let returnStatus: 'returned' | 'damaged' | 'lost' = 'returned'
    if (condition === 'damaged') {
      returnStatus = 'damaged'
    } else if (condition === 'lost') {
      returnStatus = 'lost'
    }

    const returnedAt = new Date()

    // Update the checkout record
    await payload.update({
      collection: 'checkouts',
      id: checkout.id,
      data: {
        status: returnStatus,
        returnedAt: returnedAt.toISOString(),
        notes: notes ? `${checkout.notes || ''}\n[Return Note] ${notes}`.trim() : checkout.notes,
      },
    })

    // Get the item ID (handle both populated and unpopulated cases)
    const itemId = typeof checkout.item === 'object' ? checkout.item.id : checkout.item

    // Update item availability (only if not lost)
    if (returnStatus !== 'lost') {
      const item = await payload.findByID({
        collection: 'inventory-items',
        id: itemId,
      })

      if (item) {
        await payload.update({
          collection: 'inventory-items',
          id: itemId,
          data: {
            quantityAvailable: (item.quantityAvailable ?? 0) + checkout.quantity,
          },
        })
      }
    }

    // Get customer info
    const customerId2 = typeof checkout.customer === 'object' ? checkout.customer.id : checkout.customer
    const customer = await payload.findByID({
      collection: 'customers',
      id: customerId2,
    })

    const item = typeof checkout.item === 'object' ? checkout.item : await payload.findByID({
      collection: 'inventory-items',
      id: itemId,
    })

    return NextResponse.json({
      success: true,
      return: {
        checkoutId: checkout.id,
        status: returnStatus,
        returnedAt,
        item: {
          id: item?.id,
          name: item?.name,
          barcode: item?.barcode,
        },
        customer: {
          id: customer?.id,
          name: customer?.name,
        },
        quantity: checkout.quantity,
      },
    })
  } catch (error) {
    console.error('Error processing checkin:', error)
    return NextResponse.json(
      { error: 'Failed to process checkin' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
