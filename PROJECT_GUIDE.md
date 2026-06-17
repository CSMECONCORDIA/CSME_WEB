# CSME Website Project Guide

This document explains the CSME website in plain English: what the code does, what tech it uses, how to run it, and how to deploy it with Vercel, Turso, and a custom domain.

## 1. What This Project Is

This project is the website and admin system for CSME.

It has two main parts:

1. The public website that visitors see.
2. The admin dashboard where the team can manage content like events, projects, inventory, lab status, and media.

The site is built with Next.js, and the admin/content system is built with Payload CMS. Payload stores its data in a SQLite-style database hosted on Turso.

In simple terms:

- Next.js displays the website pages.
- Payload CMS gives you an admin panel.
- Turso hosts the database online.
- Vercel hosts the website.
- Vercel Blob stores uploaded media files.

## 2. Tech Stack

Here is the tech stack used in this project.

### Frontend

- Next.js: The main web framework.
- React: Used to build the UI components.
- TypeScript: JavaScript with types, which helps catch mistakes while coding.
- Tailwind CSS: Used for styling the pages.
- Framer Motion: Used for animations.
- Three.js, React Three Fiber, and Drei: Used for the 3D/exploded-view visuals on the homepage.

### Backend

- Next.js API Routes: Used for custom backend endpoints like inventory checkout, lab status, Discord, and printer status.
- Payload CMS: The admin dashboard and content management system.
- GraphQL: Payload provides GraphQL routes for querying data if needed.

### Database and Storage

- Turso: Hosts the SQLite database.
- Payload SQLite adapter: Lets Payload talk to the Turso database using `DATABASE_URL` and `TURSO_AUTH_TOKEN`.
- Vercel Blob: Stores uploaded media files from Payload, like event images and project thumbnails.

### Deployment

- Vercel: Hosts the live website.
- Custom domain through Vercel: Used to connect your real domain to the Vercel project.

## 3. Important Folders and Files

### `app/(frontend)`

This is the public-facing website.

Important pages include:

- Home page
- About page
- Events page
- Projects page
- Contact page
- Inventory pages
- Lab status page

The homepage pulls featured projects and upcoming events from Payload CMS.

### `app/(payload)`

This contains the Payload admin routes.

The admin panel is available at:

```text
/admin
```

This is where admins can log in and manage the website content.

### `collections`

This folder defines the database collections for Payload CMS.

The main collections are:

- `Users`: Admin users who can log in to Payload.
- `Media`: Uploaded images and files.
- `Projects`: Projects shown on the website.
- `Events`: Events shown on the website.
- `Customers`: Students or lab users who can check out equipment.
- `InventoryItems`: Tools, equipment, and lab items.
- `Checkouts`: Checkout records for borrowed items.

### `globals`

This folder contains Payload globals.

Right now it includes:

- `LabStatus`: Stores whether the lab is open or closed, plus a message.

### `app/api`

This folder contains custom API routes.

Important routes include:

- `/api/lab-status`: Gets or updates the lab open/closed status.
- `/api/inventory/scan`: Looks up students or inventory items by barcode.
- `/api/inventory/checkout`: Checks out equipment.
- `/api/inventory/checkin`: Returns equipment.
- `/api/inventory/customer`: Creates or manages inventory customers.
- `/api/printer-status`: Receives printer status from the local printer bridge.
- `/api/discord`: Handles Discord interaction requests.

### `printer-bridge`

This is a separate small Node.js service that can run locally in the lab.

Its job is to check local printer IP addresses and send printer status updates to the website. This is needed because Vercel cannot directly access printers on the lab network.

### `payload.config.ts`

This is the main Payload CMS configuration file.

It connects:

- Payload collections
- Payload globals
- Turso database
- Vercel Blob media storage
- Admin settings

### `package.json`

This file lists project dependencies and scripts.

Main scripts:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
```

## 4. How the Code Works

When someone visits the website, Next.js loads the page they asked for.

For example:

- `/` loads the homepage.
- `/events` loads the events page.
- `/projects` loads the projects page.
- `/inventory` loads the inventory dashboard.

Some pages ask Payload CMS for data. For example, the homepage asks Payload for featured projects and upcoming events.

Payload then reads the data from Turso and sends it back to the page.

The admin dashboard works through Payload CMS. When an admin adds an event or project, Payload saves it into the Turso database. The website can then display that new content.

Media uploads, like images, are handled by Payload but stored in Vercel Blob. This matters because Vercel deployments do not keep local uploaded files forever. Blob storage keeps uploaded files somewhere permanent.

## 5. Environment Variables

Environment variables are private settings that should not be hard-coded in the code.

You need these in Vercel and usually in your local `.env` file too.

```text
DATABASE_URL=
TURSO_AUTH_TOKEN=
PAYLOAD_SECRET=
BLOB_READ_WRITE_TOKEN=
INVENTORY_API_SECRET=
NEXT_PUBLIC_INVENTORY_API_SECRET=
DISCORD_BOT_SECRET=
DISCORD_PUBLIC_KEY=
DISCORD_LAB_CHANNEL_ID=
DISCORD_LAB_ROLE_ID=
PRINTER_BRIDGE_SECRET=
```

Optional Discord command registration variables:

```text
DISCORD_BOT_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=
```

Printer bridge variables, used in `printer-bridge`:

```text
WEBSITE_URL=
PRINTER_BRIDGE_SECRET=
PRINTER_1_IP=
PRINTER_2_IP=
PRINTER_3_IP=
PRINTER_4_IP=
POLL_INTERVAL=
PRINTER_TIMEOUT=
```

### What the important variables mean

`DATABASE_URL`

The Turso database connection URL.

`TURSO_AUTH_TOKEN`

The Turso token that allows the app to access the database.

`PAYLOAD_SECRET`

A secret key used by Payload CMS. Make this long and random.

`BLOB_READ_WRITE_TOKEN`

The Vercel Blob token used for file uploads.

`INVENTORY_API_SECRET`

Private secret used by the inventory API routes.

`NEXT_PUBLIC_INVENTORY_API_SECRET`

This is used by the checkout station frontend. Because it starts with `NEXT_PUBLIC`, it can be seen in browser-side code. Do not treat it like a super private server-only password.

`DISCORD_BOT_SECRET`

Secret used so only your Discord bot can update lab status.

`PRINTER_BRIDGE_SECRET`

Secret shared between the website and the local printer bridge.

## 6. Running the Project Locally

First install dependencies:

```bash
npm install
```

Then create a `.env` file in the project root and add the environment variables.

After that, start the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The admin panel is:

```text
http://localhost:3000/admin
```

Before deploying, it is a good idea to run:

```bash
npm run lint
npm run type-check
npm run build
```

These commands check for code issues and make sure the site can build.

## 7. Turso Database Setup

Turso is used to host the SQLite database online.

The basic idea is:

1. Create a Turso account.
2. Create a database.
3. Get the database URL.
4. Create an auth token.
5. Add both values to Vercel environment variables.

Your Vercel environment variables should include:

```text
DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token
```

The code connects to Turso in `payload.config.ts` using Payload's SQLite adapter:

```ts
db: sqliteAdapter({
  client: {
    url: process.env.DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
})
```

That means the app does not need a local database file in production. It connects to the hosted Turso database instead.

## 8. Deploying to Vercel

Vercel is the easiest place to deploy this project because it is a Next.js app.

### Step 1: Push the code to GitHub

Make sure the project is in a GitHub repo.

### Step 2: Import the project in Vercel

In Vercel:

1. Click `Add New`.
2. Click `Project`.
3. Choose the GitHub repo.
4. Import it.

### Step 3: Set build settings

For this project, the normal Vercel settings should work:

```text
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: leave default
```

### Step 4: Add environment variables

In Vercel:

1. Open the project.
2. Go to `Settings`.
3. Go to `Environment Variables`.
4. Add the variables from the environment variable section.
5. Add them for Production, Preview, and Development if needed.

At minimum, production needs:

```text
DATABASE_URL
TURSO_AUTH_TOKEN
PAYLOAD_SECRET
BLOB_READ_WRITE_TOKEN
```

If using inventory, Discord, or printer status, also add those related secrets.

### Step 5: Deploy

After the env vars are set, deploy the project.

Vercel will run:

```bash
npm run build
```

If the build passes, Vercel gives you a live URL like:

```text
https://your-project-name.vercel.app
```

## 9. Setting a Custom Domain in Vercel

After the Vercel deployment works, connect your real domain.

### Step 1: Add the domain in Vercel

In Vercel:

1. Open your project.
2. Go to `Settings`.
3. Go to `Domains`.
4. Type your domain, for example:

```text
csme.ca
```

or:

```text
www.csme.ca
```

5. Click `Add`.

### Step 2: Update DNS records

Vercel will show you the DNS records to add at your domain provider.

For a root domain like:

```text
csme.ca
```

Vercel usually asks for an `A` record pointing to Vercel's IP address.

For a subdomain like:

```text
www.csme.ca
```

Vercel usually asks for a `CNAME` record pointing to:

```text
cname.vercel-dns.com
```

Use the exact values Vercel shows, because they can change depending on the domain setup.

### Step 3: Wait for DNS

DNS changes can take a few minutes, but sometimes they take a few hours.

Once Vercel sees the correct DNS records, it will mark the domain as valid and automatically set up HTTPS.

### Step 4: Choose the main domain

In the Vercel domains page, choose which domain should be the main one.

For example, you might want:

```text
www.csme.ca
```

to be the main domain, and:

```text
csme.ca
```

to redirect to it.

## 10. Vercel Blob Setup

This project uses Vercel Blob for uploaded media.

To set it up:

1. Open the Vercel project.
2. Go to `Storage`.
3. Create or connect a Blob store.
4. Copy the read/write token.
5. Add it as an environment variable:

```text
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

Payload uses this token to upload and read media files.

## 11. Admin Workflow

Admins use the Payload admin panel at:

```text
/admin
```

From there, admins can:

- Add and edit projects.
- Add and edit events.
- Upload images.
- Manage inventory items.
- Manage lab users/customers.
- View checkout records.
- Update lab status.

When an event or project changes, the code revalidates the website pages so visitors see fresh content.

## 12. Inventory System

The inventory system lets students check out lab equipment.

The basic flow is:

1. A student scans their student card.
2. The checkout station finds or creates their customer record.
3. The student scans equipment barcodes.
4. The system checks if the equipment is available.
5. The system creates checkout records.
6. The available quantity goes down.
7. When items are returned, the checkout record is updated and quantity goes back up.

The main collections involved are:

- `customers`
- `inventory-items`
- `checkouts`

The main API routes involved are:

- `/api/inventory/scan`
- `/api/inventory/checkout`
- `/api/inventory/checkin`
- `/api/inventory/customer`

## 13. Lab Status and Discord

The lab status system stores whether the lab is open or closed.

The website reads this from:

```text
/api/lab-status
```

Discord can update it if the Discord bot sends a valid request using `DISCORD_BOT_SECRET`.

This is useful if the team wants lab status to be controlled from Discord instead of manually editing the admin panel.

## 14. Printer Bridge

The printer bridge is separate from the Vercel website.

Why?

Because the 3D printers are on a local lab network, and Vercel cannot directly connect to local IP addresses like `192.168.x.x`.

So the bridge runs inside the lab network. It checks the printers, then sends updates to:

```text
/api/printer-status
```

The website can then show the latest known printer status.

## 15. Common Maintenance Tasks

### Add a new event

1. Go to `/admin`.
2. Open `Events`.
3. Create a new event.
4. Add title, slug, date, location, description, and image.
5. Save.

### Add a new project

1. Go to `/admin`.
2. Open `Projects`.
3. Create a new project.
4. Add title, slug, description, team members, status, and thumbnail.
5. Save.

### Add an inventory item

1. Go to `/admin`.
2. Open `Inventory Items`.
3. Add name, barcode, category, total quantity, available quantity, and checkout length.
4. Save.

### Add an admin user

1. Go to `/admin`.
2. Open `Users`.
3. Create a new user.
4. Set their email and password.

## 16. Quick Troubleshooting

### The site builds locally but fails on Vercel

Check that all required environment variables are set in Vercel.

Most likely missing variables:

```text
DATABASE_URL
TURSO_AUTH_TOKEN
PAYLOAD_SECRET
BLOB_READ_WRITE_TOKEN
```

### The admin panel loads but data is missing

Check the Turso database URL and auth token.

Also make sure you are looking at the same Turso database in local development and production.

### Image uploads do not work

Check `BLOB_READ_WRITE_TOKEN` in Vercel.

### Inventory API gives `Unauthorized`

Check that the request is sending:

```text
Authorization: Bearer your_secret_here
```

Also check that `INVENTORY_API_SECRET` is set.

### Lab status does not update from Discord

Check:

```text
DISCORD_BOT_SECRET
DISCORD_PUBLIC_KEY
DISCORD_LAB_CHANNEL_ID
DISCORD_LAB_ROLE_ID
```

### Custom domain is not working

Check the domain in Vercel under:

```text
Project Settings > Domains
```

Then check the DNS records at your domain provider. Use the exact records that Vercel gives you.

## 17. Simple Summary

This project is a Next.js website with Payload CMS built in.

The public site shows CSME content like projects, events, lab status, and inventory pages. The admin panel lets the team edit that content without touching code.

Vercel hosts the website. Turso hosts the SQLite database. Vercel Blob stores uploaded media.

For deployment, the most important thing is setting the correct environment variables in Vercel. After that, Vercel can build and host the site, and you can connect your custom domain from the Vercel Domains settings.
