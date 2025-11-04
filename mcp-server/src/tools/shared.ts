/**
 * Shared Tools
 *
 * Tools available in both kid and cyber modes
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * Shared Tool Definitions
 */
export const sharedTools: Tool[] = [
  {
    name: 'kali_get_status',
    description: 'Get current status of Kali robot',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'kali_switch_mode',
    description: 'Switch Kali between kid, cyber, or locked mode (requires authentication for cyber mode)',
    inputSchema: {
      type: 'object',
      properties: {
        mode: {
          type: 'string',
          enum: ['kid', 'cyber', 'locked'],
          description: 'Mode to switch to',
        },
        auth_token: {
          type: 'string',
          description: 'Authentication token (required for cyber mode)',
        },
      },
      required: ['mode'],
    },
  },
  {
    name: 'kali_get_mode',
    description: 'Get current operational mode',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

/**
 * Handle Shared Tool Execution
 */
export async function handleSharedTool(name: string, args: any) {
  console.error(`[SHARED] Executing tool: ${name}`);

  switch (name) {
    case 'kali_get_status':
      return await handleGetStatus();

    case 'kali_switch_mode':
      return await handleSwitchMode(args);

    case 'kali_get_mode':
      return await handleGetMode();

    default:
      throw new Error(`Unknown shared tool: ${name}`);
  }
}

/**
 * Tool Handlers
 */

async function handleGetStatus() {
  // In production, this would query the actual Raspberry Pi
  const status = {
    robot_name: 'Kali',
    mode: process.env.CURRENT_MODE || 'kid',
    uptime: '2 hours 34 minutes',
    hardware: {
      display: 'online',
      audio: 'online',
      camera: 'online',
      leds: 'online',
    },
    last_activity: '2 minutes ago',
    session_active: true,
  };

  return {
    content: [
      {
        type: 'text',
        text: `🤖 Kali Robot Status:\n\n` +
              `Mode: ${status.mode}\n` +
              `Uptime: ${status.uptime}\n` +
              `Display: ${status.hardware.display}\n` +
              `Audio: ${status.hardware.audio}\n` +
              `Camera: ${status.hardware.camera}\n` +
              `LEDs: ${status.hardware.leds}\n` +
              `Last Activity: ${status.last_activity}\n` +
              `Session Active: ${status.session_active ? 'Yes' : 'No'}`,
      },
    ],
  };
}

async function handleSwitchMode(args: { mode: string; auth_token?: string }) {
  const { mode, auth_token } = args;

  // Validate mode switch
  if (mode === 'cyber' && !auth_token) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Authentication required to switch to cyber mode.\n\n` +
                `Please provide a valid auth_token.`,
        },
      ],
      isError: true,
    };
  }

  // In production, validate auth_token for cyber mode
  if (mode === 'cyber' && auth_token) {
    // TODO: Implement JWT validation
    console.error('Validating auth token for cyber mode...');
  }

  // Simulate mode switch
  const modeEmojis: Record<string, string> = {
    kid: '👶',
    cyber: '🔒',
    locked: '🔐',
  };

  const modeDescriptions: Record<string, string> = {
    kid: 'Educational mode - Safe, fun, and interactive learning!',
    cyber: 'Cyber mode - Professional security testing (authorized use only)',
    locked: 'Locked mode - System maintenance and configuration',
  };

  return {
    content: [
      {
        type: 'text',
        text: `${modeEmojis[mode]} Switching Kali to ${mode.toUpperCase()} mode...\n\n` +
              `${modeDescriptions[mode]}\n\n` +
              `Mode switch complete! Kali is now in ${mode} mode.`,
      },
    ],
  };
}

async function handleGetMode() {
  const currentMode = process.env.CURRENT_MODE || 'kid';

  const modeInfo: Record<string, any> = {
    kid: {
      name: 'Kid Mode',
      emoji: '👶',
      description: 'Educational and fun!',
      led_color: 'Blue',
      voice: 'Joanna (friendly)',
      available_tools: 9,
    },
    cyber: {
      name: 'Cyber Mode',
      emoji: '🔒',
      description: 'Security testing',
      led_color: 'Red',
      voice: 'Matthew (professional)',
      available_tools: 11,
    },
    locked: {
      name: 'Locked Mode',
      emoji: '🔐',
      description: 'System maintenance',
      led_color: 'White',
      voice: 'None',
      available_tools: 0,
    },
  };

  const info = modeInfo[currentMode];

  return {
    content: [
      {
        type: 'text',
        text: `${info.emoji} Current Mode: ${info.name}\n\n` +
              `Description: ${info.description}\n` +
              `LED Color: ${info.led_color}\n` +
              `Voice: ${info.voice}\n` +
              `Available Tools: ${info.available_tools}`,
      },
    ],
  };
}
