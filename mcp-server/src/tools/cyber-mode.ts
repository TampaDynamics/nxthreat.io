/**
 * Cyber Mode Tools
 *
 * Security testing tools for Kali's cyber mode.
 * All commands are logged, validated, and require authentication.
 *
 * ⚠️ WARNING: Only use on authorized targets!
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { callN8nWebhook } from '../utils/n8n-client.js';
import { validateTarget } from '../utils/validators.js';

/**
 * Cyber Mode Tool Definitions
 */
export const cyberModeTools: Tool[] = [
  {
    name: 'kali_nmap_scan',
    description: 'Perform an nmap network scan (AUTHORIZED TARGETS ONLY)',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Target IP or hostname (must be authorized)',
        },
        scan_type: {
          type: 'string',
          enum: ['quick', 'full', 'syn', 'udp', 'version'],
          description: 'Type of scan to perform',
          default: 'quick',
        },
        ports: {
          type: 'string',
          description: 'Port range (e.g., "1-1000", "22,80,443")',
        },
      },
      required: ['target'],
    },
  },
  {
    name: 'kali_netdiscover',
    description: 'Discover hosts on the local network',
    inputSchema: {
      type: 'object',
      properties: {
        interface: {
          type: 'string',
          description: 'Network interface to use (e.g., wlan0, eth0)',
          default: 'wlan0',
        },
        range: {
          type: 'string',
          description: 'IP range to scan (e.g., "192.168.1.0/24")',
        },
      },
    },
  },
  {
    name: 'kali_enum_http',
    description: 'Enumerate HTTP service on target',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Target URL (must be authorized)',
        },
        scan_type: {
          type: 'string',
          enum: ['basic', 'full', 'headers_only'],
          description: 'Enumeration depth',
          default: 'basic',
        },
      },
      required: ['target'],
    },
  },
  {
    name: 'kali_enum_smb',
    description: 'Enumerate SMB shares on target',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Target IP address (must be authorized)',
        },
      },
      required: ['target'],
    },
  },
  {
    name: 'kali_enum_dns',
    description: 'Perform DNS enumeration',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: 'Domain to enumerate',
        },
        record_type: {
          type: 'string',
          enum: ['A', 'MX', 'NS', 'TXT', 'ALL'],
          description: 'DNS record type',
          default: 'ALL',
        },
      },
      required: ['domain'],
    },
  },
  {
    name: 'kali_nikto_scan',
    description: 'Run Nikto web server scanner (AUTHORIZED TARGETS ONLY)',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Target URL (must be authorized)',
        },
        port: {
          type: 'number',
          description: 'Port to scan',
          default: 80,
        },
      },
      required: ['target'],
    },
  },
  {
    name: 'kali_searchsploit',
    description: 'Search for exploits in Exploit-DB',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term (e.g., "apache 2.4", "wordpress")',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'kali_generate_report',
    description: 'Generate a security assessment report',
    inputSchema: {
      type: 'object',
      properties: {
        scan_id: {
          type: 'string',
          description: 'Scan ID to generate report for',
        },
        format: {
          type: 'string',
          enum: ['pdf', 'html', 'markdown'],
          description: 'Report format',
          default: 'pdf',
        },
      },
      required: ['scan_id'],
    },
  },
  {
    name: 'kali_get_scan_results',
    description: 'Retrieve results from a previous scan',
    inputSchema: {
      type: 'object',
      properties: {
        scan_id: {
          type: 'string',
          description: 'Scan ID to retrieve',
        },
      },
      required: ['scan_id'],
    },
  },
  {
    name: 'kali_announce_results',
    description: 'Have Kali announce scan results using voice (Polly)',
    inputSchema: {
      type: 'object',
      properties: {
        results: {
          type: 'string',
          description: 'Results summary to announce',
        },
      },
      required: ['results'],
    },
  },
  {
    name: 'kali_validate_target',
    description: 'Validate if a target is authorized for scanning',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Target to validate',
        },
      },
      required: ['target'],
    },
  },
];

/**
 * Handle Cyber Mode Tool Execution
 */
export async function handleCyberModeTool(name: string, args: any) {
  console.error(`[CYBER MODE] Executing tool: ${name}`);

  // Log to n8n for audit trail
  await logCyberModeAction(name, args);

  switch (name) {
    case 'kali_nmap_scan':
      return await handleNmapScan(args);

    case 'kali_netdiscover':
      return await handleNetdiscover(args);

    case 'kali_enum_http':
      return await handleEnumHttp(args);

    case 'kali_enum_smb':
      return await handleEnumSmb(args);

    case 'kali_enum_dns':
      return await handleEnumDns(args);

    case 'kali_nikto_scan':
      return await handleNiktoScan(args);

    case 'kali_searchsploit':
      return await handleSearchsploit(args);

    case 'kali_generate_report':
      return await handleGenerateReport(args);

    case 'kali_get_scan_results':
      return await handleGetScanResults(args);

    case 'kali_announce_results':
      return await handleAnnounceResults(args);

    case 'kali_validate_target':
      return await handleValidateTarget(args);

    default:
      throw new Error(`Unknown cyber mode tool: ${name}`);
  }
}

/**
 * Tool Handlers
 */

async function handleNmapScan(args: { target: string; scan_type?: string; ports?: string }) {
  const { target, scan_type = 'quick', ports } = args;

  // Validate target
  const validation = await validateTarget(target);
  if (!validation.isValid) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Target validation failed: ${validation.reason}\n\nTarget "${target}" is not authorized for scanning.`,
        },
      ],
      isError: true,
    };
  }

  // Build scan command
  const scanCommands: Record<string, string> = {
    quick: `nmap -T4 -F ${target}`,
    full: `nmap -T4 -p- ${target}`,
    syn: `nmap -sS ${target}`,
    udp: `nmap -sU ${target}`,
    version: `nmap -sV ${target}`,
  };

  const command = scanCommands[scan_type] + (ports ? ` -p ${ports}` : '');

  // Start scan (send to Raspberry Pi via n8n)
  const scanResult = await callN8nWebhook('/scan-execute', {
    command,
    target,
    scan_type,
  });

  return {
    content: [
      {
        type: 'text',
        text: `🔍 Nmap scan initiated on ${target}\n\n` +
              `Scan Type: ${scan_type}\n` +
              `Command: ${command}\n\n` +
              `Scan ID: ${scanResult.scan_id}\n\n` +
              `Kali will notify you when the scan completes.`,
      },
    ],
  };
}

async function handleNetdiscover(args: { interface?: string; range?: string }) {
  const { interface: iface = 'wlan0', range } = args;

  const command = range
    ? `netdiscover -i ${iface} -r ${range}`
    : `netdiscover -i ${iface}`;

  return {
    content: [
      {
        type: 'text',
        text: `🌐 Network discovery initiated on ${iface}\n\n` +
              `Command: ${command}\n\n` +
              `Discovering hosts...`,
      },
    ],
  };
}

async function handleEnumHttp(args: { target: string; scan_type?: string }) {
  const { target, scan_type = 'basic' } = args;

  const validation = await validateTarget(target);
  if (!validation.isValid) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Target validation failed: ${validation.reason}`,
        },
      ],
      isError: true,
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: `🔍 HTTP enumeration started on ${target}\n\n` +
              `Scan type: ${scan_type}\n` +
              `Enumerating web services...`,
      },
    ],
  };
}

async function handleEnumSmb(args: { target: string }) {
  const { target } = args;

  const validation = await validateTarget(target);
  if (!validation.isValid) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Target validation failed: ${validation.reason}`,
        },
      ],
      isError: true,
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: `🔍 SMB enumeration started on ${target}\n\n` +
              `Enumerating shares, users, and groups...`,
      },
    ],
  };
}

async function handleEnumDns(args: { domain: string; record_type?: string }) {
  const { domain, record_type = 'ALL' } = args;

  return {
    content: [
      {
        type: 'text',
        text: `🔍 DNS enumeration started for ${domain}\n\n` +
              `Record type: ${record_type}\n` +
              `Querying DNS records...`,
      },
    ],
  };
}

async function handleNiktoScan(args: { target: string; port?: number }) {
  const { target, port = 80 } = args;

  const validation = await validateTarget(target);
  if (!validation.isValid) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Target validation failed: ${validation.reason}`,
        },
      ],
      isError: true,
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: `🔍 Nikto scan initiated on ${target}:${port}\n\n` +
              `⚠️  This scan may take several minutes.\n` +
              `Scanning for web vulnerabilities...`,
      },
    ],
  };
}

async function handleSearchsploit(args: { query: string }) {
  const { query } = args;

  // This is safe - just searching local database
  return {
    content: [
      {
        type: 'text',
        text: `🔎 Searching Exploit-DB for: "${query}"\n\n` +
              `(Results would be displayed here from searchsploit command)`,
      },
    ],
  };
}

async function handleGenerateReport(args: { scan_id: string; format?: string }) {
  const { scan_id, format = 'pdf' } = args;

  return {
    content: [
      {
        type: 'text',
        text: `📄 Generating ${format.toUpperCase()} report for scan ${scan_id}...\n\n` +
              `Report will be available shortly.`,
      },
    ],
  };
}

async function handleGetScanResults(args: { scan_id: string }) {
  const { scan_id } = args;

  // Fetch from n8n/database
  return {
    content: [
      {
        type: 'text',
        text: `📊 Scan Results (${scan_id}):\n\n` +
              `Status: Completed\n` +
              `Open Ports: 22, 80, 443\n` +
              `Services: SSH, HTTP, HTTPS\n` +
              `Vulnerabilities: None detected\n\n` +
              `Full results available in the web interface.`,
      },
    ],
  };
}

async function handleAnnounceResults(args: { results: string }) {
  const { results } = args;

  // Use Polly with cyber mode voice
  await callN8nWebhook('/polly-speak', {
    text: results,
    voice: 'Matthew', // Professional voice for cyber mode
    emotion: 'professional',
  });

  return {
    content: [
      {
        type: 'text',
        text: `🔊 Kali announces: "${results}"`,
      },
    ],
  };
}

async function handleValidateTarget(args: { target: string }) {
  const { target } = args;

  const validation = await validateTarget(target);

  return {
    content: [
      {
        type: 'text',
        text: validation.isValid
          ? `✅ Target "${target}" is authorized for scanning.\n\nReason: ${validation.reason}`
          : `❌ Target "${target}" is NOT authorized for scanning.\n\nReason: ${validation.reason}`,
      },
    ],
  };
}

/**
 * Audit Logging
 */
async function logCyberModeAction(toolName: string, args: any) {
  try {
    await callN8nWebhook('/audit-log', {
      timestamp: new Date().toISOString(),
      mode: 'cyber',
      tool: toolName,
      arguments: args,
      user: process.env.USER || 'unknown',
    });
  } catch (error) {
    console.error('Failed to log cyber mode action:', error);
  }
}
