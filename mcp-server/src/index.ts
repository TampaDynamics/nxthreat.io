#!/usr/bin/env node

/**
 * Kali MCP Server
 *
 * Model Context Protocol server for the Kali robot.
 * Provides tools for both kid mode (educational) and cyber mode (security testing).
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';

// Import tool handlers
import { kidModeTools, handleKidModeTool } from './tools/kid-mode.js';
import { cyberModeTools, handleCyberModeTool } from './tools/cyber-mode.js';
import { sharedTools, handleSharedTool } from './tools/shared.js';

// Load environment variables
dotenv.config();

// Current mode state (should be managed by authentication in production)
let currentMode: 'kid' | 'cyber' | 'locked' = 'kid' as 'kid' | 'cyber' | 'locked';

/**
 * Initialize MCP Server
 */
const server = new Server(
  {
    name: 'kali-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Get available tools based on current mode
 */
function getAvailableTools(): Tool[] {
  const tools: Tool[] = [...sharedTools];

  if (currentMode === 'kid') {
    tools.push(...kidModeTools);
  } else if (currentMode === 'cyber') {
    tools.push(...cyberModeTools);
  }

  return tools;
}

/**
 * Handle list_tools request
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: getAvailableTools(),
  };
});

/**
 * Handle call_tool request
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Check if tool is shared
    if (sharedTools.find(t => t.name === name)) {
      const result = await handleSharedTool(name, args || {});
      return result;
    }

    // Handle kid mode tools
    if (currentMode === 'kid' && kidModeTools.find(t => t.name === name)) {
      const result = await handleKidModeTool(name, args || {});
      return result;
    }

    // Handle cyber mode tools
    if (currentMode === 'cyber' && cyberModeTools.find(t => t.name === name)) {
      const result = await handleCyberModeTool(name, args || {});
      return result;
    }

    // Tool not available in current mode
    return {
      content: [
        {
          type: 'text',
          text: `Tool "${name}" is not available in ${currentMode} mode.`,
        },
      ],
      isError: true,
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool "${name}": ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Kali MCP Server running on stdio');
  console.error(`Current mode: ${currentMode}`);
  console.error(`Available tools: ${getAvailableTools().length}`);
}

main().catch((error) => {
  console.error('Fatal error starting server:', error);
  process.exit(1);
});
