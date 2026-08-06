import { NextResponse, NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Secret key for Discord bot authentication
const DISCORD_BOT_SECRET = process.env.DISCORD_BOT_SECRET

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const labStatus = await payload.findGlobal({
      slug: 'lab-status',
    })

    return NextResponse.json({
      isOpen: labStatus.isOpen ?? false,
      lastUpdated: labStatus.updatedAt || new Date().toISOString(),
      message: labStatus.message || 'Lab status will be updated when a team member checks in.',
      updatedBy: labStatus.updatedBy,
    })
  } catch (error) {
    console.error('Error fetching lab status:', error)
    return NextResponse.json({
      isOpen: false,
      lastUpdated: new Date().toISOString(),
      message: 'Lab status will be updated when a team member checks in.',
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from the Discord bot
    const authHeader = request.headers.get('Authorization')

    if (!DISCORD_BOT_SECRET) {
      return NextResponse.json(
        { error: 'Lab status updates are not configured' },
        { status: 503 }
      )
    }

    if (!authHeader || authHeader !== `Bearer ${DISCORD_BOT_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    if (typeof body.isOpen !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request: isOpen must be a boolean' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })
    const labStatus = await payload.updateGlobal({
      slug: 'lab-status',
      data: {
        isOpen: body.isOpen,
        message: body.message || (body.isOpen
          ? 'The lab is open! Come visit us.'
          : 'The lab is currently closed.'),
        updatedBy: body.updatedBy || 'Discord Bot',
      },
    })

    return NextResponse.json({
      success: true,
      status: {
        isOpen: labStatus.isOpen,
        lastUpdated: labStatus.updatedAt,
        message: labStatus.message,
        updatedBy: labStatus.updatedBy,
      },
    })
  } catch (error) {
    console.error('Error updating lab status:', error)
    return NextResponse.json(
      { error: 'Failed to update lab status' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  return POST(request)
}

export const dynamic = 'force-dynamic'