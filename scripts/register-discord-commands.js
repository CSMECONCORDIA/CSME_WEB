#!/usr/bin/env node
/**
 * Register Discord Slash Commands
 *
 * Run this script ONCE to register your slash commands with Discord.
 * You only need to run it again if you change the command definitions.
 *
 * Usage:
 *   node scripts/register-discord-commands.js
 *
 * Required environment variables:
 *   DISCORD_BOT_TOKEN - Your bot token from Discord Developer Portal
 *   DISCORD_CLIENT_ID - Your application's client ID
 *   DISCORD_GUILD_ID  - (Optional) Your server ID for guild-specific commands
 */

require('dotenv').config();

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!DISCORD_BOT_TOKEN || !DISCORD_CLIENT_ID) {
  console.error('Error: DISCORD_BOT_TOKEN and DISCORD_CLIENT_ID are required');
  console.error('Add them to your .env file');
  process.exit(1);
}

const commands = [
  {
    name: 'lab-open',
    description: 'Mark the CSME lab as OPEN',
    options: [
      {
        name: 'message',
        description: 'Optional message to display on the website',
        type: 3, // STRING
        required: false,
      },
    ],
  },
  {
    name: 'lab-close',
    description: 'Mark the CSME lab as CLOSED',
    options: [
      {
        name: 'message',
        description: 'Optional message to display on the website',
        type: 3, // STRING
        required: false,
      },
    ],
  },
  {
    name: 'lab-status',
    description: 'Check the current CSME lab status',
  },
];

async function registerCommands() {
  // Use guild commands for faster updates during development
  // Use global commands for production (takes up to 1 hour to propagate)
  const url = DISCORD_GUILD_ID
    ? `https://discord.com/api/v10/applications/${DISCORD_CLIENT_ID}/guilds/${DISCORD_GUILD_ID}/commands`
    : `https://discord.com/api/v10/applications/${DISCORD_CLIENT_ID}/commands`;

  console.log(`Registering ${commands.length} commands...`);
  console.log(`Mode: ${DISCORD_GUILD_ID ? 'Guild-specific' : 'Global'}`);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Discord API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    console.log('\n✅ Commands registered successfully!\n');
    result.forEach(cmd => {
      console.log(`  /${cmd.name} - ${cmd.description}`);
    });

    console.log('\n📝 Next steps:');
    console.log('1. Go to Discord Developer Portal > Your App > General Information');
    console.log('2. Copy your "Public Key"');
    console.log('3. Add it to your .env as DISCORD_PUBLIC_KEY');
    console.log('4. Set "Interactions Endpoint URL" to: https://your-site.vercel.app/api/discord');
    console.log('5. Deploy your site to Vercel');
    console.log('6. Discord will verify the endpoint - once verified, your commands work!');
  } catch (error) {
    console.error('Failed to register commands:', error.message);
    process.exit(1);
  }
}

registerCommands();
