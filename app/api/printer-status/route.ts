import { NextResponse, NextRequest } from 'next/server'

interface PrinterStatus {
  id: string
  name: string
  status: 'idle' | 'printing' | 'offline' | 'error'
  progress?: number
  currentJob?: string
  timeRemaining?: string
  temperature?: {
    nozzle: number
    bed: number
  }
}

interface PrinterData {
  printers: PrinterStatus[]
  lastUpdated: string
}

// In-memory storage for printer status (pushed from local bridge)
// In production, consider using a database or KV store like Vercel KV
let printerData: PrinterData = {
  printers: [
    { id: 'printer-1', name: 'Printer 1', status: 'offline' },
    { id: 'printer-2', name: 'Printer 2', status: 'offline' },
    { id: 'printer-3', name: 'Printer 3', status: 'offline' },
    { id: 'printer-4', name: 'Printer 4', status: 'offline' },
  ],
  lastUpdated: new Date().toISOString(),
}

// Secret key for bridge service authentication
const PRINTER_BRIDGE_SECRET = process.env.PRINTER_BRIDGE_SECRET

// GET - Fetch current printer status (called by website)
export async function GET() {
  // Check if data is stale (older than 2 minutes = bridge might be offline)
  const lastUpdate = new Date(printerData.lastUpdated)
  const now = new Date()
  const isStale = (now.getTime() - lastUpdate.getTime()) > 120000 // 2 minutes

  if (isStale) {
    // Mark all printers as offline if bridge hasn't updated recently
    return NextResponse.json({
      printers: printerData.printers.map(p => ({ ...p, status: 'offline' as const })),
      timestamp: printerData.lastUpdated,
      stale: true,
    })
  }

  return NextResponse.json({
    printers: printerData.printers,
    timestamp: printerData.lastUpdated,
    stale: false,
  })
}

// POST - Update printer status (called by local bridge service)
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from the bridge service
    const authHeader = request.headers.get('Authorization')

    if (!PRINTER_BRIDGE_SECRET) {
      return NextResponse.json(
        { error: 'Printer bridge not configured' },
        { status: 503 }
      )
    }

    if (!authHeader || authHeader !== `Bearer ${PRINTER_BRIDGE_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate the request body
    if (!Array.isArray(body.printers)) {
      return NextResponse.json(
        { error: 'Invalid request: printers must be an array' },
        { status: 400 }
      )
    }

    // Update the printer data
    printerData = {
      printers: body.printers,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      timestamp: printerData.lastUpdated,
    })
  } catch (error) {
    console.error('Error updating printer status:', error)
    return NextResponse.json(
      { error: 'Failed to update printer status' },
      { status: 500 }
    )
  }
}

// Allow revalidation every 5 seconds
export const revalidate = 5
