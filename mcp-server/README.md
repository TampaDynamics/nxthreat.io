# Kali MCP Server

Model Context Protocol server for the Kali robot, providing tools for both educational (kid mode) and security testing (cyber mode) operations.

## Overview

The MCP server is the communication bridge between Claude Code and the Kali robot. It exposes context-aware tools that change based on the robot's operational mode.

## Features

- **Mode-based tool availability**: Different tools for kid vs cyber mode
- **Authentication & Authorization**: JWT-based auth for cyber mode
- **Audit logging**: All cyber mode commands logged to n8n
- **Target validation**: Prevent unauthorized scanning
- **Command sanitization**: Protection against command injection
- **n8n integration**: AWS Polly speech, notifications, data storage

## Installation

```bash
cd mcp-server
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
nano .env
```

Required environment variables:
- `N8N_WEBHOOK_BASE`: Your n8n instance URL
- `AWS_ACCESS_KEY_ID`: AWS credentials for Polly
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `JWT_SECRET`: Secret for authentication tokens

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Run built server
npm start

# Run with MCP inspector
npm run inspector
```

## Connecting to Claude Code

Add to your Claude Code MCP settings (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "kali-robot": {
      "command": "node",
      "args": ["/path/to/nxthreat/mcp-server/build/index.js"]
    }
  }
}
```

Or for development:

```json
{
  "mcpServers": {
    "kali-robot": {
      "command": "npx",
      "args": ["-y", "tsx", "/path/to/nxthreat/mcp-server/src/index.ts"]
    }
  }
}
```

## Available Tools

### Kid Mode Tools (Educational)

1. **kali_speak** - Make Kali speak with emotion
2. **kali_teach_lesson** - Start educational lesson
3. **kali_play_game** - Interactive games
4. **kali_tell_story** - Tell age-appropriate stories
5. **kali_show_emotion** - Display emotions on screen
6. **kali_ask_question** - Ask educational questions
7. **kali_give_praise** - Encouraging feedback
8. **kali_learning_progress** - View learning progress
9. **kali_camera_game** - Camera-based learning games

### Cyber Mode Tools (Security Testing)

⚠️ **AUTHORIZED USE ONLY**

1. **kali_nmap_scan** - Network scanning
2. **kali_netdiscover** - Host discovery
3. **kali_enum_http** - HTTP service enumeration
4. **kali_enum_smb** - SMB enumeration
5. **kali_enum_dns** - DNS enumeration
6. **kali_nikto_scan** - Web server scanning
7. **kali_searchsploit** - Exploit database search
8. **kali_generate_report** - Generate reports
9. **kali_get_scan_results** - Retrieve scan results
10. **kali_announce_results** - Voice announcement of results
11. **kali_validate_target** - Check target authorization

### Shared Tools

1. **kali_get_status** - Get robot status
2. **kali_switch_mode** - Switch between modes
3. **kali_get_mode** - Get current mode

## Mode Management

### Kid Mode (Default)
- Blue LED indicator
- Friendly voice (Joanna)
- No system access
- Educational tools only
- Safe for children

### Cyber Mode (Authenticated)
- Red LED indicator
- Professional voice (Matthew)
- Full Kali Linux tools
- All commands logged
- Requires authentication

### Locked Mode
- White LED indicator
- System maintenance only
- No user interaction

## Security

### Target Validation

Cyber mode includes target validation to prevent unauthorized scanning:

```typescript
// Whitelist authorized targets
TARGET_WHITELIST=192.168.1.100,testlab.local,*.example.com

// Blacklist specific targets
TARGET_BLACKLIST=localhost,127.0.0.1,*.internal.com

// Allow localhost scans (disabled by default)
ALLOW_LOCALHOST_SCANS=false

// Allow private IP ranges (disabled by default)
ALLOW_PRIVATE_RANGES=false
```

### Command Validation

All cyber mode commands are:
1. Validated against whitelist
2. Sanitized for injection attacks
3. Logged to n8n with timestamp and user
4. Rate limited

### Authentication

Cyber mode requires JWT authentication:

```typescript
// Generate token (implement your own auth)
const token = jwt.sign({ user: 'admin', mode: 'cyber' }, JWT_SECRET);

// Use token when switching to cyber mode
kali_switch_mode({ mode: 'cyber', auth_token: token });
```

## n8n Integration

The MCP server integrates with n8n for:

### AWS Polly (Text-to-Speech)
```
POST /webhook/polly-speak
{
  "text": "Hello! I'm Kali!",
  "voice": "Joanna",
  "emotion": "happy"
}
```

### Logging
```
POST /webhook/event-log
{
  "timestamp": "2025-11-04T12:00:00Z",
  "event_type": "mode_change",
  "data": { ... }
}
```

### Parent Notifications
```
POST /webhook/alert-parent
{
  "message": "Learning session complete!",
  "priority": "low"
}
```

### Scan Execution
```
POST /webhook/scan-execute
{
  "command": "nmap -T4 -F 192.168.1.100",
  "target": "192.168.1.100",
  "scan_type": "quick"
}
```

## Testing

```bash
# Run tests
npm test

# With coverage
npm test -- --coverage

# Specific test file
npm test -- validators.test.ts
```

## Project Structure

```
mcp-server/
├── src/
│   ├── index.ts              # Main MCP server
│   ├── tools/
│   │   ├── kid-mode.ts       # Kid mode tools
│   │   ├── cyber-mode.ts     # Cyber mode tools
│   │   └── shared.ts         # Shared tools
│   ├── middleware/
│   │   ├── auth.ts           # Authentication
│   │   └── rate-limit.ts     # Rate limiting
│   └── utils/
│       ├── n8n-client.ts     # n8n integration
│       ├── validators.ts     # Input validation
│       └── logger.ts         # Logging utilities
├── config/
│   └── default.json          # Default configuration
├── tests/                    # Unit tests
├── package.json
├── tsconfig.json
└── README.md
```

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
# Build
npm run build

# Run
npm start

# Or use PM2
pm2 start build/index.js --name kali-mcp-server
```

### Docker
```bash
# Build image
docker build -t kali-mcp-server .

# Run container
docker run -d \
  --name kali-mcp-server \
  -p 3000:3000 \
  --env-file .env \
  kali-mcp-server
```

## Troubleshooting

### MCP Server Not Showing in Claude Code

1. Check Claude Code MCP settings
2. Verify file paths are absolute
3. Check server logs: `~/.config/Claude/logs/mcp.log`
4. Restart Claude Code

### Tools Not Available

1. Verify current mode: `kali_get_mode`
2. Check if mode switch required
3. Verify authentication for cyber mode

### n8n Webhook Errors

1. Check n8n instance is accessible
2. Verify webhook URLs in `.env`
3. Check n8n logs
4. Test webhook manually with curl

### Target Validation Failures

1. Check target whitelist/blacklist
2. Verify `ALLOW_LOCALHOST_SCANS` setting
3. Review validation logs

## Legal & Ethics

⚠️ **IMPORTANT**

This software is designed for:
- Educational purposes
- Authorized security testing
- Personal lab environments

**Illegal Uses:**
- Scanning systems without permission
- Unauthorized penetration testing
- Malicious activities

Always obtain explicit written authorization before testing any system you don't own.

## Contributing

This is a personal father-son project, but contributions are welcome!

## License

MIT License - See LICENSE file

---

**"Teaching colors by day, running pentests by night."** 🤖
