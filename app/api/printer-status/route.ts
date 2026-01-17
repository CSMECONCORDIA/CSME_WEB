import { NextResponse } from 'next/server'

interface PrinterConfig {
  id: string
  name: string
  ip: string
}

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

// Configure your Creality K1C printers here
// Update these IPs to match your actual printer network configuration
const PRINTERS: PrinterConfig[] = [
  { id: 'printer-1', name: 'Printer 1', ip: process.env.PRINTER_1_IP || '192.168.1.101' },
  { id: 'printer-2', name: 'Printer 2', ip: process.env.PRINTER_2_IP || '192.168.1.102' },
  { id: 'printer-3', name: 'Printer 3', ip: process.env.PRINTER_3_IP || '192.168.1.103' },
  { id: 'printer-4', name: 'Printer 4', ip: process.env.PRINTER_4_IP || '192.168.1.104' },
]

async function fetchPrinterStatus(printer: PrinterConfig): Promise<PrinterStatus> {
  try {
    // Creality K1C uses a LAN API - typically on port 7125 (Moonraker) or 80
    // The exact endpoint depends on firmware version
    // Common endpoints: /printer/info, /server/info, /printer/objects/query

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    // Try Moonraker API first (most common for Klipper-based printers)
    const response = await fetch(`http://${printer.ip}:7125/printer/objects/query?print_stats&heater_bed&extruder`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    const printStats = data.result?.status?.print_stats
    const extruder = data.result?.status?.extruder
    const heaterBed = data.result?.status?.heater_bed

    let status: PrinterStatus['status'] = 'idle'
    let progress: number | undefined
    let currentJob: string | undefined
    let timeRemaining: string | undefined

    if (printStats) {
      switch (printStats.state) {
        case 'printing':
          status = 'printing'
          currentJob = printStats.filename || 'Unknown'
          progress = printStats.progress ? Math.round(printStats.progress * 100) : 0
          if (printStats.print_duration && printStats.total_duration) {
            const remaining = printStats.total_duration - printStats.print_duration
            if (remaining > 0) {
              const hours = Math.floor(remaining / 3600)
              const minutes = Math.floor((remaining % 3600) / 60)
              timeRemaining = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
            }
          }
          break
        case 'paused':
          status = 'printing' // Show as printing but paused
          break
        case 'complete':
        case 'standby':
        case 'ready':
          status = 'idle'
          break
        case 'error':
          status = 'error'
          break
        default:
          status = 'idle'
      }
    }

    return {
      id: printer.id,
      name: printer.name,
      status,
      progress,
      currentJob,
      timeRemaining,
      temperature: extruder && heaterBed ? {
        nozzle: Math.round(extruder.temperature || 0),
        bed: Math.round(heaterBed.temperature || 0),
      } : undefined,
    }
  } catch (error) {
    // If we can't connect, try alternative API endpoint or mark as offline
    try {
      // Try alternative Creality Cloud API endpoint
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const altResponse = await fetch(`http://${printer.ip}/api/printer/status`, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (altResponse.ok) {
        const altData = await altResponse.json()
        return {
          id: printer.id,
          name: printer.name,
          status: altData.printing ? 'printing' : 'idle',
          progress: altData.progress,
          currentJob: altData.filename,
          temperature: altData.temperatures ? {
            nozzle: Math.round(altData.temperatures.nozzle || 0),
            bed: Math.round(altData.temperatures.bed || 0),
          } : undefined,
        }
      }
    } catch {
      // Silent fail, will return offline
    }

    return {
      id: printer.id,
      name: printer.name,
      status: 'offline',
    }
  }
}

export async function GET() {
  try {
    // Fetch all printer statuses in parallel
    const statuses = await Promise.all(PRINTERS.map(fetchPrinterStatus))

    return NextResponse.json({
      printers: statuses,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching printer status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch printer status' },
      { status: 500 }
    )
  }
}

// Allow revalidation every 10 seconds
export const revalidate = 10
