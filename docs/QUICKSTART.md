# NXThreat / Kali Robot - Quick Start Guide

Welcome to the Kali robot project! This guide will help you get started quickly.

## What We've Built So Far

✅ **Project Structure** - Complete directory structure for all components
✅ **Documentation** - Architecture diagrams and comprehensive READMEs
✅ **MCP Server** - Full MCP server with kid & cyber mode tools
✅ **Raspberry Pi Service Structure** - Ready for deployment
✅ **n8n Integration** - Documented webhook endpoints

## Project Overview

- **Project Name**: NXThreat (nxthreat.io)
- **Robot Name**: Kali
- **Tagline**: "The robot that teaches colors by day, runs pentests by night"

## Quick Navigation

| Component | Location | Status |
|-----------|----------|--------|
| Main Documentation | [`README.md`](README.md) | ✅ Complete |
| Architecture Diagram | [`docs/architecture.drawio`](docs/architecture.drawio) | ✅ Complete |
| MCP Server | [`mcp-server/`](mcp-server/) | ✅ Built & Ready |
| Raspberry Pi Service | [`raspberry-pi/`](raspberry-pi/) | ✅ Structure Ready |
| n8n Workflows | [`n8n-workflows/`](n8n-workflows/) | ⏳ To be created |
| Web Interfaces | [`nxthreat.io/`](nxthreat.io/) | ⏳ Starter site |

## Next Steps

### 1. Test the MCP Server Locally

```bash
cd mcp-server
npm run dev
```

### 2. Connect MCP Server to Claude Code

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "kali-robot": {
      "command": "npx",
      "args": ["-y", "tsx", "/Users/mattsantucci/Projects/nxthreat/mcp-server/src/index.ts"]
    }
  }
}
```

Then restart Claude Code.

### 3. Try Kid Mode Tools

In Claude Code, try these commands:
- "Use kali_speak to have Kali say hello"
- "Start a color_hunt game with kali_play_game"
- "Have Kali teach a lesson about numbers"

### 4. Set Up n8n Workflows

SSH into your Lightsail instance:
```bash
ssh -i ~/.ssh/your-key.pem ubuntu@automation.tampadynamics.com
```

Create the AWS Polly webhook (see [`n8n-workflows/README.md`](n8n-workflows/README.md))

### 5. Deploy to Raspberry Pi

```bash
# Copy files to Pi
scp -r raspberry-pi kali@<pi-ip>:~/nxthreat/

# SSH into Pi
ssh kali@<pi-ip>

# Set up and run
cd ~/nxthreat/raspberry-pi
python3 scripts/test_connection.py
```

## Architecture Quick Reference

```
Claude Code → MCP Server → n8n + Web UIs → Raspberry Pi (Kali)
                ↓                              ↓
          Kid/Cyber Tools              Hardware Control
```

## Available Tools

### Kid Mode (9 tools)
- `kali_speak` - Make Kali talk
- `kali_teach_lesson` - Educational lessons
- `kali_play_game` - Interactive games
- `kali_tell_story` - Storytelling
- `kali_show_emotion` - Display emotions
- `kali_ask_question` - Ask questions
- `kali_give_praise` - Encouragement
- `kali_learning_progress` - View progress
- `kali_camera_game` - Camera-based games

### Cyber Mode (11 tools) - ⚠️ Authorized Use Only
- `kali_nmap_scan` - Network scanning
- `kali_netdiscover` - Host discovery
- `kali_enum_http` - HTTP enumeration
- `kali_enum_smb` - SMB enumeration
- `kali_enum_dns` - DNS enumeration
- `kali_nikto_scan` - Web scanning
- `kali_searchsploit` - Exploit search
- `kali_generate_report` - Report generation
- `kali_get_scan_results` - Retrieve results
- `kali_announce_results` - Voice announcements
- `kali_validate_target` - Target validation

### Shared Tools (3 tools)
- `kali_get_status` - Robot status
- `kali_switch_mode` - Mode switching
- `kali_get_mode` - Current mode

## Hardware Requirements

- **Raspberry Pi** (3B+ or newer)
- **Kali Linux ARM** (OS)
- **Display** (HDMI)
- **Speakers** (for Polly voice)
- **Camera** (USB or Pi Camera)
- **ALFA Wireless Card** (for cyber mode)
- **LEDs** (optional, for mode indicators)

## Key Concepts

### Modes

**Kid Mode** 👶
- Blue LED
- Friendly voice (Joanna)
- Educational tools only
- No system access
- Safe for children

**Cyber Mode** 🔒
- Red LED
- Professional voice (Matthew)
- Security testing tools
- All commands logged
- Requires authentication

**Locked Mode** 🔐
- White LED
- Maintenance only
- No user interaction

### Voice Personas

**Kid Mode**: Joanna (AWS Polly)
- "Hi! I'm Kali! Let's learn together!"
- Warm, encouraging, patient

**Cyber Mode**: Matthew (AWS Polly)
- "Kali cyber mode activated. Ready for security assessment."
- Professional, technical, precise

## Troubleshooting

### MCP Server not showing in Claude Code?
1. Check file paths in config
2. Restart Claude Code
3. Check logs: `~/Library/Logs/Claude/mcp.log`

### Can't SSH into Raspberry Pi?
```bash
# Find Pi on network
nmap -sn 192.168.1.0/24 | grep -B 2 "Raspberry"

# Or use hostname
ping raspberrypi.local
```

### n8n webhooks not working?
```bash
# Test webhook manually
curl -X POST https://automation.tampadynamics.com/webhook/polly-speak \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from Kali!", "voice": "Joanna"}'
```

## Resources

- **Architecture Diagram**: [`docs/architecture.drawio`](docs/architecture.drawio)
- **MCP Server README**: [`mcp-server/README.md`](mcp-server/README.md)
- **Raspberry Pi README**: [`raspberry-pi/README.md`](raspberry-pi/README.md)
- **n8n Integration**: [`n8n-workflows/README.md`](n8n-workflows/README.md)
- **Full Documentation**: [`docs/README.pdf`](docs/README.pdf)

## Development Workflow

1. **Develop** - Write code, test locally
2. **Build** - `npm run build` (MCP server)
3. **Test** - Test tools in Claude Code
4. **Deploy** - Push to Pi, deploy to production
5. **Iterate** - Add features, improve

## Legal & Ethics

⚠️ **IMPORTANT**: Only use cyber mode on authorized targets. Penetration testing without permission is illegal.

This robot is for:
- ✅ Educational purposes
- ✅ Testing your own systems
- ✅ Authorized security assessments
- ❌ NOT for malicious activities

## Getting Help

- Check the detailed READMEs in each directory
- Review the architecture diagram
- Read the full project documentation
- Test components individually

## What's Next?

1. **Create n8n workflows** - AWS Polly integration
2. **Build Python Pi service** - Hardware control
3. **Test kid mode end-to-end** - First "Hello World"
4. **Add cyber mode auth** - JWT tokens
5. **Build web interfaces** - robot.nxthreat.io, command.nxthreat.io

---

**Ready to bring Kali to life!** 🤖

Let's start with testing the MCP server in Claude Code, then create the first n8n workflow for Kali's voice!
