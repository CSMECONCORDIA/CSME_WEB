import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Discord Interactions Webhook Handler
 *
 * This handles Discord slash commands via HTTP webhooks.
 * No persistent bot connection needed - works perfectly on Vercel!
 *
 * Setup:
 * 1. Create a Discord application at https://discord.com/developers/applications
 * 2. Set the "Interactions Endpoint URL" to: https://your-site.vercel.app/api/discord
 * 3. Add slash commands using the register-commands script
 * 4. Add the bot to your server with applications.commands scope
 */

// Discord interaction types
const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
} as const

const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
} as const

// Restrict commands to specific channel and role
// Set these in your .env file
const ALLOWED_CHANNEL_ID = process.env.DISCORD_LAB_CHANNEL_ID
const ALLOWED_ROLE_ID = process.env.DISCORD_LAB_ROLE_ID

// Verify Discord request signature
async function verifyDiscordRequest(request: NextRequest, body: string): Promise<boolean> {
  const signature = request.headers.get('X-Signature-Ed25519')
  const timestamp = request.headers.get('X-Signature-Timestamp')
  const publicKey = process.env.DISCORD_PUBLIC_KEY

  if (!signature || !timestamp || !publicKey) {
    return false
  }

  try {
    // Use Web Crypto API for Ed25519 verification
    const encoder = new TextEncoder()
    const message = encoder.encode(timestamp + body)

    // Convert hex signature to Uint8Array
    const signatureBytes = new Uint8Array(
      signature.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    )

    // Convert hex public key to Uint8Array
    const publicKeyBytes = new Uint8Array(
      publicKey.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    )

    // Import the public key
    const key = await crypto.subtle.importKey(
      'raw',
      publicKeyBytes,
      { name: 'Ed25519' },
      false,
      ['verify']
    )

    // Verify the signature
    const isValid = await crypto.subtle.verify(
      'Ed25519',
      key,
      signatureBytes,
      message
    )

    return isValid
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

// Type for Discord command options
interface CommandOption {
  name: string
  value: string
}

export async function POST(request: NextRequest) {
  const body = await request.text()

  // Verify the request is from Discord
  const isValid = await verifyDiscordRequest(request, body)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const interaction = JSON.parse(body)

  // Handle Discord's verification ping
  if (interaction.type === InteractionType.PING) {
    return NextResponse.json({ type: InteractionResponseType.PONG })
  }

  // Handle slash commands
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = interaction.data
    const user = interaction.member?.user || interaction.user
    const channelId = interaction.channel_id
    const memberRoles: string[] = interaction.member?.roles || []

    // Check channel restriction (if configured)
    if (ALLOWED_CHANNEL_ID && channelId !== ALLOWED_CHANNEL_ID) {
      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `❌ This command can only be used in the designated lab channel.`,
          flags: 64, // Ephemeral - only visible to the user
        },
      })
    }

    // Check role restriction (if configured)
    if (ALLOWED_ROLE_ID && !memberRoles.includes(ALLOWED_ROLE_ID)) {
      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `❌ You don't have permission to use this command. Required role: <@&${ALLOWED_ROLE_ID}>`,
          flags: 64, // Ephemeral - only visible to the user
        },
      })
    }

    switch (name) {
      case 'lab-open': {
        const message = (options as CommandOption[] | undefined)?.find((o) => o.name === 'message')?.value || 'The lab is open! Come visit us.'

        try {
          const payload = await getPayload({ config })
          await payload.updateGlobal({
            slug: 'lab-status',
            data: {
              isOpen: true,
              message,
              updatedBy: user.username,
            },
          })
        } catch (error) {
          console.error('Failed to update lab status:', error)
          return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `❌ Failed to update lab status. Please try again.`,
            },
          })
        }

        return NextResponse.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `✅ **Lab is now OPEN!**\n📝 Message: ${message}\n👤 Updated by: ${user.username}`,
          },
        })
      }

      case 'lab-close': {
        const message = (options as CommandOption[] | undefined)?.find((o) => o.name === 'message')?.value || 'The lab is currently closed.'

        try {
          const payload = await getPayload({ config })
          await payload.updateGlobal({
            slug: 'lab-status',
            data: {
              isOpen: false,
              message,
              updatedBy: user.username,
            },
          })
        } catch (error) {
          console.error('Failed to update lab status:', error)
          return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `❌ Failed to update lab status. Please try again.`,
            },
          })
        }

        return NextResponse.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `🔒 **Lab is now CLOSED**\n📝 Message: ${message}\n👤 Updated by: ${user.username}`,
          },
        })
      }

      case 'lab-status': {
        try {
          const payload = await getPayload({ config })
          const status = await payload.findGlobal({
            slug: 'lab-status',
          })

          const statusEmoji = status.isOpen ? '✅' : '🔒'
          const statusText = status.isOpen ? 'OPEN' : 'CLOSED'
          const lastUpdated = status.updatedAt ? new Date(status.updatedAt).toLocaleString() : 'Never'

          return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${statusEmoji} **Lab Status: ${statusText}**\n📝 ${status.message || 'No message'}\n🕒 Last updated: ${lastUpdated}`,
            },
          })
        } catch {
          return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: '❌ Failed to fetch lab status. Please try again.',
            },
          })
        }
      }

      default:
        return NextResponse.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '❓ Unknown command',
          },
        })
    }
  }

  return NextResponse.json({ error: 'Unknown interaction type' }, { status: 400 })
}