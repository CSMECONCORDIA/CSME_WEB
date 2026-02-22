import { NextResponse, NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const INVENTORY_API_SECRET = process.env.INVENTORY_API_SECRET

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')

    if (!INVENTORY_API_SECRET) {
      return NextResponse.json(
        { error: 'Inventory API not configured' },
        { status: 503 }
      )
    }

    if (!authHeader || authHeader !== `Bearer ${INVENTORY_API_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { barcode } = body

    if (!barcode || typeof barcode !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: barcode is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // First, try to find a customer with this card ID
    const customers = await payload.find({
      collection: 'customers',
      where: {
        cardId: { equals: barcode },
      },
      limit: 1,
    })

    if (customers.docs.length > 0) {
      const customer = customers.docs[0]

      // Fetch active checkouts for this customer
      const checkouts = await payload.find({
        collection: 'checkouts',
        where: {
          customer: { equals: customer.id },
          status: { in: ['checked-out', 'overdue'] },
        },
        depth: 2,
      })

      return NextResponse.json({
        type: 'customer',
        customer: {
          id: customer.id,
          cardId: customer.cardId,
          name: customer.name,
          email: customer.email,
          status: customer.status,
        },
        activeCheckouts: checkouts.docs,
      })
    }

    // If not a customer, try to find an inventory item
    const items = await payload.find({
      collection: 'inventory-items',
      where: {
        barcode: { equals: barcode },
      },
      limit: 1,
      depth: 1,
    })

    if (items.docs.length > 0) {
      const item = items.docs[0]
      return NextResponse.json({
        type: 'item',
        item: {
          id: item.id,
          name: item.name,
          barcode: item.barcode,
          description: item.description,
          category: item.category,
          quantityAvailable: item.quantityAvailable,
          quantityTotal: item.quantityTotal,
          location: item.location,
          maxCheckoutDays: item.maxCheckoutDays,
          image: item.image,
        },
      })
    }

    // Neither customer nor item found
    return NextResponse.json({
      type: 'unknown',
      barcode,
      message: 'Barcode not found in system',
    })
  } catch (error) {
    console.error('Error processing scan:', error)
    return NextResponse.json(
      { error: 'Failed to process scan' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
