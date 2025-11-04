# NXThreat - Dual-Purpose Educational & CyberSec Assistant

> "The robot that teaches colors by day, runs pentests by night"

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/python-%3E%3D3.9-blue)](https://www.python.org/)

## 🤖 Meet Kali

**Kali** is a Raspberry Pi-based robot with dual personalities:
- **Kid Mode**: Educational assistant for children (games, learning, stories)
- **Cyber Mode**: Penetration testing assistant running Kali Linux commands

## 📦 Repository

**GitHub**: https://github.com/TampaDynamics/nxthreat.io

This is a monorepo containing all components of the NXThreat system.

## 🏗️ Project Identity

- **Project Name**: NXThreat (nxthreat.io)
- **Robot/Agent Name**: Kali
- **Architecture**: Monorepo with workspaces

## 🎯 Quick Start

```bash
# Clone repository
git clone https://github.com/TampaDynamics/nxthreat.io.git
cd nxthreat.io

# Install all dependencies
npm install

# Start development servers
npm run dev

# Build all projects
npm run build
```

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

## 📁 Monorepo Structure

```
nxthreat/
├── mcp-server/          # MCP Server (Node.js/TypeScript)
│   ├── src/
│   │   ├── tools/       # Kid & Cyber mode tools
│   │   └── utils/       # Utilities & validators
│   └── README.md
├── nxthreat.io/         # Main website (Next.js)
├── raspberry-pi/        # Robot service (Python)
│   ├── src/
│   ├── config/
│   └── README.md
├── n8n-workflows/       # n8n workflow exports
│   └── README.md
├── docs/                # Documentation
│   ├── architecture.drawio
│   └── README.pdf
├── package.json         # Workspace configuration
├── amplify.yml          # AWS Amplify config
├── QUICKSTART.md        # Quick start guide
└── DEPLOYMENT.md        # Deployment guide
```

## 🚀 Features

### Kid Mode Tools (9 total)
- 🗣️ `kali_speak` - Voice with emotions
- 📚 `kali_teach_lesson` - Educational lessons
- 🎮 `kali_play_game` - Interactive games
- 📖 `kali_tell_story` - Storytelling
- 😊 `kali_show_emotion` - Display emotions
- ❓ `kali_ask_question` - Ask questions
- 🌟 `kali_give_praise` - Encouragement
- 📊 `kali_learning_progress` - Track progress
- 📷 `kali_camera_game` - Vision-based games

### Cyber Mode Tools (11 total) - ⚠️ Authorized Use Only
- 🔍 `kali_nmap_scan` - Network scanning
- 🌐 `kali_netdiscover` - Host discovery
- 🌍 `kali_enum_http` - HTTP enumeration
- 📁 `kali_enum_smb` - SMB enumeration
- 🔎 `kali_enum_dns` - DNS enumeration
- 🕷️ `kali_nikto_scan` - Web vulnerability scanning
- 💾 `kali_searchsploit` - Exploit database search
- 📄 `kali_generate_report` - Report generation
- 📊 `kali_get_scan_results` - Retrieve scan results
- 🔊 `kali_announce_results` - Voice announcements
- ✅ `kali_validate_target` - Target authorization check

### Shared Tools (3 total)
- 📡 `kali_get_status` - Robot status
- 🔄 `kali_switch_mode` - Mode switching
- ℹ️ `kali_get_mode` - Current mode info

## 🖥️ Hardware

- **Raspberry Pi** (3B+ or newer, running Kali Linux)
- **Display** (HDMI output for robot face/UI)
- **Speakers** (AWS Polly voice output)
- **Camera** (USB or Pi Camera v2)
- **ALFA Wireless Card** (for penetration testing)
- **LEDs** (optional mode indicators)

## 🌐 Infrastructure

- **Domain**: nxthreat.io
- **MCP Server**: api.nxthreat.io
- **n8n Instance**: automation.tampadynamics.com
- **Kid UI**: robot.nxthreat.io (planned)
- **Command UI**: command.nxthreat.io (planned)
- **AWS Services**: Polly (text-to-speech)

## 🎨 Architecture

```
Claude Code → MCP Server → n8n + Web UIs → Raspberry Pi (Kali)
      ↓            ↓              ↓              ↓
  MCP Client   Kid/Cyber    AWS Polly     Hardware Control
               Mode Tools   Webhooks      Display/Audio/Camera
```

View detailed architecture: [docs/architecture.drawio](./docs/architecture.drawio)

## 🔐 Security & Modes

### Kid Mode 👶
- **LED**: Blue
- **Voice**: Joanna (friendly)
- **Access**: Educational tools only
- **Safety**: No system/network access

### Cyber Mode 🔒
- **LED**: Red
- **Voice**: Matthew (professional)
- **Access**: Security testing tools
- **Security**: All commands logged, target validation, authentication required

### Locked Mode 🔐
- **LED**: White
- **Purpose**: System maintenance
- **Access**: Admin only

## 🚢 Deployment

### Deploy Website to AWS Amplify

```bash
# Amplify will automatically detect amplify.yml and build nxthreat.io/
# Just connect your GitHub repo in AWS Amplify Console
```

### Deploy to Raspberry Pi

```bash
# On your Pi
git clone https://github.com/TampaDynamics/nxthreat.io.git
cd nxthreat.io/raspberry-pi
./scripts/setup.sh
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

## 📚 Documentation

- **Quick Start**: [QUICKSTART.md](./QUICKSTART.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **MCP Server**: [mcp-server/README.md](./mcp-server/README.md)
- **Raspberry Pi**: [raspberry-pi/README.md](./raspberry-pi/README.md)
- **n8n Integration**: [n8n-workflows/README.md](./n8n-workflows/README.md)
- **Architecture Diagram**: [docs/architecture.drawio](./docs/architecture.drawio)
- **Complete PDF**: [docs/README.pdf](./docs/README.pdf)

## 🛠️ Development

### Workspace Commands

```bash
# Install all dependencies
npm install

# Development mode (all workspaces)
npm run dev

# Build all projects
npm run build

# Test all projects
npm run test

# Clean build artifacts
npm run clean

# Deploy to Raspberry Pi
npm run pi:deploy
```

### MCP Server Development

```bash
cd mcp-server
npm run dev        # Watch mode
npm run build      # Build TypeScript
npm run start      # Run production
```

### Website Development

```bash
cd nxthreat.io
npm run dev        # Development server
npm run build      # Production build
```

## ⚖️ Legal & Ethics

⚠️ **IMPORTANT DISCLAIMER**

This software includes security testing tools. These tools are provided for:
- ✅ Educational purposes
- ✅ Authorized security assessments
- ✅ Testing your own systems
- ❌ **NOT for malicious activities**

**Penetration testing without authorization is ILLEGAL.**

Always obtain explicit written permission before testing any system you don't own.

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

This is primarily a father-son learning project, but contributions are welcome!

## 🎓 Educational Value

### For Kids (Age 5+)
- Interactive learning (colors, numbers, shapes)
- Voice-guided activities
- Camera-based games
- Progress tracking

### For Adults/Students
- Modern MCP server development
- n8n workflow automation
- AWS service integration (Polly)
- Raspberry Pi hardware control
- Security best practices
- TypeScript/Python full-stack

## 🔗 Links

- **GitHub**: https://github.com/TampaDynamics/nxthreat.io
- **MCP Protocol**: https://modelcontextprotocol.io
- **AWS Polly**: https://aws.amazon.com/polly/
- **n8n**: https://n8n.io/
- **Kali Linux**: https://www.kali.org/

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check the documentation in each component's README
- Review the architecture diagram

---

**"Teaching colors by day, running pentests by night."** 🤖🎨🔒

Built with ❤️ as a father-son learning project.
