import { NextResponse, NextRequest } from 'next/server'

interface LabStatus {
  isOpen: boolean
  lastUpdated: string
  message?: string
  updatedBy?: string
}

// In-memory storage for lab status (in production, use a database or KV store)
// This will persist across requests but reset on server restart
let labStatus: LabStatus = {
  isOpen: false,
  lastUpdated: new Date().toISOString(),
  message: 'Lab status will be updated when a team member checks in.',
}

// Secret key for Discord bot authentication
// Set this in your .env file: DISCORD_BOT_SECRET=your-secret-key
const DISCORD_BOT_SECRET = process.env.DISCORD_BOT_SECRET

export async function GET() {
  return NextResponse.json(labStatus)
}

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from the Discord bot
    const authHeader = request.headers.get('Authorization')

    if (!DISCORD_BOT_SECRET) {
      // If no secret is configured, reject all POST requests
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

    // Validate the request body
    if (typeof body.isOpen !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request: isOpen must be a boolean' },
        { status: 400 }
      )
    }

    // Update the lab status
    labStatus = {
      isOpen: body.isOpen,
      lastUpdated: new Date().toISOString(),
      message: body.message || (body.isOpen
        ? 'The lab is open! Come visit us.'
        : 'The lab is currently closed.'),
      updatedBy: body.updatedBy || 'Discord Bot',
    }

    return NextResponse.json({
      success: true,
      status: labStatus,
    })
  } catch (error) {
    console.error('Error updating lab status:', error)
    return NextResponse.json(
      { error: 'Failed to update lab status' },
      { status: 500 }
    )
  }
}

// Also support webhook-style updates from Discord
export async function PATCH(request: NextRequest) {
  // Discord webhook verification
  const signature = request.headers.get('X-Signature-Ed25519')
  const timestamp = request.headers.get('X-Signature-Timestamp')

  if (!signature || !timestamp) {
    // Allow simple PATCH updates with Bearer token
    return POST(request)
  }

  // For Discord interactions, handle separately if needed
  // This would require the discord-interactions library for signature verification
  // For now, fall back to Bearer token auth
  return POST(request)
}

// Allow revalidation every 5 seconds for near real-time updates
export const revalidate = 5
