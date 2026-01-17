#!/usr/bin/env node
/**
 * CSME Lab Printer Bridge Service
 *
 * This script runs on a local machine in your lab (e.g., Raspberry Pi)
 * and pushes printer status to your website every 15 seconds.
 *
 * Setup Instructions:
 * 1. Install Node.js on your local machine (Raspberry Pi, laptop, etc.)
 * 2. Copy this folder to your local machine
 * 3. Run: npm install
 * 4. Configure the .env file with your settings
 * 5. Run: npm start (or use PM2 for auto-restart: pm2 start bridge.js)
 *
 * The bridge will:
 * - Poll your Creality K1C printers via their local Moonraker API
 * - Push the status to your hosted website every 15 seconds
 * - Auto-retry on failures
 */

require('dotenv').config();

// Configuration
const CONFIG = {
  // Your website URL (where the printer-status API is hosted)
  websiteUrl: process.env.WEBSITE_URL || 'https://your-website.com',

  // Secret key for authenticating with the website API
  bridgeSecret: process.env.PRINTER_BRIDGE_SECRET,

  // How often to poll printers (in milliseconds)
  pollInterval: parseInt(process.env.POLL_INTERVAL) || 15000,

  // Timeout for printer requests (in milliseconds)
  printerTimeout: parseInt(process.env.PRINTER_TIMEOUT) || 5000,

  // Your Creality K1C printers (local IP addresses)
  printers: [
    { id: 'printer-1', name: 'Printer 1', ip: process.env.PRINTER_1_IP || '192.168.1.101' },
    { id: 'printer-2', name: 'Printer 2', ip: process.env.PRINTER_2_IP || '192.168.1.102' },
    { id: 'printer-3', name: 'Printer 3', ip: process.env.PRINTER_3_IP || '192.168.1.103' },
    { id: 'printer-4', name: 'Printer 4', ip: process.env.PRINTER_4_IP || '192.168.1.104' },
  ],
};

// Validate configuration
if (!CONFIG.bridgeSecret) {
  console.error('ERROR: PRINTER_BRIDGE_SECRET is not set in .env file');
  process.exit(1);
}

/**
 * Fetch status from a single printer using Moonraker API
 */
async function fetchPrinterStatus(printer) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.printerTimeout);

  try {
    // Moonraker API endpoint (K1C uses port 7125)
    const response = await fetch(
      `http://${printer.ip}:7125/printer/objects/query?print_stats&heater_bed&extruder&display_status`,
      {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const printStats = data.result?.status?.print_stats;
    const extruder = data.result?.status?.extruder;
    const heaterBed = data.result?.status?.heater_bed;
    const displayStatus = data.result?.status?.display_status;

    let status = 'idle';
    let progress;
    let currentJob;
    let timeRemaining;

    if (printStats) {
      switch (printStats.state) {
        case 'printing':
          status = 'printing';
          currentJob = printStats.filename || 'Unknown';
          // Use display_status for progress if available (more accurate)
          progress = displayStatus?.progress
            ? Math.round(displayStatus.progress * 100)
            : (printStats.progress ? Math.round(printStats.progress * 100) : 0);

          // Calculate time remaining
          if (printStats.print_duration > 0 && progress > 0) {
            const elapsed = printStats.print_duration;
            const totalEstimate = elapsed / (progress / 100);
            const remaining = Math.max(0, totalEstimate - elapsed);
            if (remaining > 0) {
              const hours = Math.floor(remaining / 3600);
              const minutes = Math.floor((remaining % 3600) / 60);
              timeRemaining = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
            }
          }
          break;
        case 'paused':
          status = 'printing';
          currentJob = printStats.filename || 'Paused';
          progress = displayStatus?.progress
            ? Math.round(displayStatus.progress * 100)
            : undefined;
          break;
        case 'complete':
        case 'standby':
        case 'ready':
          status = 'idle';
          break;
        case 'error':
          status = 'error';
          break;
        default:
          status = 'idle';
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
    };
  } catch (error) {
    clearTimeout(timeoutId);

    // Try alternative port (some K1C firmware uses different ports)
    try {
      const altController = new AbortController();
      const altTimeoutId = setTimeout(() => altController.abort(), 3000);

      const altResponse = await fetch(`http://${printer.ip}:4408/printer/objects/query?print_stats`, {
        signal: altController.signal,
      });

      clearTimeout(altTimeoutId);

      if (altResponse.ok) {
        const altData = await altResponse.json();
        const ps = altData.result?.status?.print_stats;
        return {
          id: printer.id,
          name: printer.name,
          status: ps?.state === 'printing' ? 'printing' : 'idle',
          progress: ps?.progress ? Math.round(ps.progress * 100) : undefined,
          currentJob: ps?.filename,
        };
      }
    } catch {
      // Silent fail
    }

    console.log(`  ${printer.name} (${printer.ip}): offline - ${error.message}`);
    return {
      id: printer.id,
      name: printer.name,
      status: 'offline',
    };
  }
}

/**
 * Push printer status to the website API
 */
async function pushToWebsite(printers) {
  try {
    const response = await fetch(`${CONFIG.websiteUrl}/api/printer-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.bridgeSecret}`,
      },
      body: JSON.stringify({ printers }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to push to website:', error.message);
    throw error;
  }
}

/**
 * Main polling loop
 */
async function poll() {
  const startTime = Date.now();
  console.log(`\n[${new Date().toLocaleTimeString()}] Polling printers...`);

  try {
    // Fetch status from all printers in parallel
    const statuses = await Promise.all(CONFIG.printers.map(fetchPrinterStatus));

    // Log status summary
    statuses.forEach(p => {
      const statusIcon = {
        idle: '🟢',
        printing: '🔵',
        offline: '⚫',
        error: '🔴',
      }[p.status];

      let info = `${statusIcon} ${p.name}: ${p.status}`;
      if (p.status === 'printing' && p.progress !== undefined) {
        info += ` (${p.progress}%${p.timeRemaining ? `, ${p.timeRemaining} remaining` : ''})`;
      }
      if (p.temperature) {
        info += ` - Nozzle: ${p.temperature.nozzle}°C, Bed: ${p.temperature.bed}°C`;
      }
      console.log(`  ${info}`);
    });

    // Push to website
    await pushToWebsite(statuses);
    console.log(`  ✅ Pushed to website (${Date.now() - startTime}ms)`);
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
  }
}

/**
 * Start the bridge service
 */
async function start() {
  console.log('='.repeat(50));
  console.log('CSME Lab Printer Bridge Service');
  console.log('='.repeat(50));
  console.log(`Website: ${CONFIG.websiteUrl}`);
  console.log(`Poll Interval: ${CONFIG.pollInterval / 1000}s`);
  console.log(`Printers:`);
  CONFIG.printers.forEach(p => console.log(`  - ${p.name}: ${p.ip}`));
  console.log('='.repeat(50));

  // Initial poll
  await poll();

  // Set up interval
  setInterval(poll, CONFIG.pollInterval);

  console.log('\nBridge service started. Press Ctrl+C to stop.');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down...');
  process.exit(0);
});

// Start the service
start().catch(error => {
  console.error('Failed to start:', error);
  process.exit(1);
});
