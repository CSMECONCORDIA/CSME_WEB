# CSME Printer Bridge Service

This service runs on a local machine in your lab and pushes 3D printer status to your hosted website.

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR LAB                                 │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Printer 1│  │ Printer 2│  │ Printer 3│  │ Printer 4│        │
│  │ K1C      │  │ K1C      │  │ K1C      │  │ K1C      │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │             │             │               │
│       └─────────────┴──────┬──────┴─────────────┘               │
│                            │                                     │
│                    ┌───────▼───────┐                            │
│                    │ Bridge Service│  (Raspberry Pi or PC)      │
│                    │  (this script)│                            │
│                    └───────┬───────┘                            │
│                            │                                     │
└────────────────────────────┼────────────────────────────────────┘
                             │ HTTPS POST every 15s
                             ▼
              ┌──────────────────────────────┐
              │    Your Website (Vercel)     │
              │  /api/printer-status         │
              └──────────────────────────────┘
```

## Setup Instructions

### 1. Prerequisites

- A computer that's always on in your lab (Raspberry Pi recommended)
- Node.js 18 or later installed
- Network access to your printers (same WiFi/LAN)

### 2. Install

```bash
# Copy this folder to your local machine
cd printer-bridge
npm install
```

### 3. Configure

```bash
# Copy the example env file
cp .env.example .env

# Edit with your values
nano .env
```

Required settings:
- `WEBSITE_URL`: Your hosted website URL (e.g., `https://csme.vercel.app`)
- `PRINTER_BRIDGE_SECRET`: A secret key (generate with `openssl rand -hex 32`)
- `PRINTER_X_IP`: IP addresses of your printers

**Important:** The `PRINTER_BRIDGE_SECRET` must match the one in your website's `.env` file!

### 4. Find Your Printer IPs

Your Creality K1C printers are on your local network. Find their IPs by:
- Checking your router's DHCP client list
- Looking at the printer's display (Network settings)
- Using a network scanner like `nmap -sn 192.168.1.0/24`

### 5. Run

```bash
# Test run
npm start

# You should see output like:
# ==================================================
# CSME Lab Printer Bridge Service
# ==================================================
# Website: https://csme.vercel.app
# Poll Interval: 15s
# Printers:
#   - Printer 1: 192.168.1.101
#   - Printer 2: 192.168.1.102
#   ...
```

### 6. Run on Startup (Optional)

To keep the bridge running permanently, use PM2:

```bash
# Install PM2
npm install -g pm2

# Start the bridge
pm2 start bridge.js --name csme-printer-bridge

# Save the process list
pm2 save

# Set up auto-start on boot
pm2 startup
# (follow the instructions it gives you)
```

## Troubleshooting

### Printers showing as "offline"

1. Check the IP addresses are correct
2. Make sure the bridge machine can reach the printers:
   ```bash
   curl http://192.168.1.101:7125/printer/info
   ```
3. Some K1C firmware uses port 4408 instead of 7125

### "Unauthorized" error when pushing to website

1. Check that `PRINTER_BRIDGE_SECRET` matches in both:
   - `printer-bridge/.env`
   - Your website's environment variables (Vercel dashboard)

### Website shows "stale" data

The bridge hasn't pushed updates for > 2 minutes. Check:
1. Bridge is running (`pm2 status`)
2. Internet connection from lab machine
3. Website URL is correct
