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

export async function GET(request: NextRequest) {
  try {
    const authError = verifyAuth(request)
    if (authError) {
      return NextResponse.json({ error: authError.error }, { status: authError.status })
    }

    const { searchParams } = new URL(request.url)
    const cardId = searchParams.get('cardId')

    if (!cardId) {
      return NextResponse.json(
        { error: 'cardId parameter is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    const customers = await payload.find({
      collection: 'customers',
      where: {
        cardId: { equals: cardId },
      },
      limit: 1,
    })

    if (customers.docs.length === 0) {
      return NextResponse.json(
        { found: false, cardId },
        { status: 404 }
      )
    }

    const customer = customers.docs[0]

    // Get active checkouts
    const checkouts = await payload.find({
      collection: 'checkouts',
      where: {
        customer: { equals: customer.id },
        status: { in: ['checked-out', 'overdue'] },
      },
      depth: 2,
    })

    return NextResponse.json({
      found: true,
      customer: {
        id: customer.id,
        cardId: customer.cardId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        notes: customer.notes,
      },
      activeCheckouts: checkouts.docs,
    })
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = verifyAuth(request)
    if (authError) {
      return NextResponse.json({ error: authError.error }, { status: authError.status })
    }

    const body = await request.json()
    const { cardId, name, email, phone, notes } = body

    if (!cardId || typeof cardId !== 'string') {
      return NextResponse.json(
        { error: 'cardId is required' },
        { status: 400 }
      )
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Check if customer with this cardId already exists
    const existing = await payload.find({
      collection: 'customers',
      where: {
        cardId: { equals: cardId },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: 'A customer with this card ID already exists' },
        { status: 409 }
      )
    }

    // Create the new customer
    const customer = await payload.create({
      collection: 'customers',
      data: {
        cardId,
        name,
        email: email || undefined,
        phone: phone || undefined,
        notes: notes || undefined,
        status: 'active',
      },
    })

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        cardId: customer.cardId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
