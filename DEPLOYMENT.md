# NXThreat Deployment Guide

This guide covers deploying all components of the NXThreat/Kali robot system.

## Repository Structure (Monorepo)

```
nxthreat/
├── mcp-server/          # MCP Server (Node.js/TypeScript)
├── nxthreat.io/         # Main website (Next.js)
├── raspberry-pi/        # Robot service (Python)
├── n8n-workflows/       # n8n workflow exports
├── docs/                # Documentation
├── package.json         # Root workspace configuration
├── amplify.yml          # AWS Amplify configuration
└── README.md
```

## Prerequisites

- Node.js 18+
- Python 3.9+ (for Raspberry Pi)
- Git
- AWS Account (for Amplify deployment)
- GitHub/GitLab account (for repository hosting)

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/nxthreat.git
cd nxthreat
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
npm install
```

### 3. Environment Variables

Copy example files and configure:

```bash
# MCP Server
cp mcp-server/.env.example mcp-server/.env
nano mcp-server/.env

# Raspberry Pi
cp raspberry-pi/config/.env.example raspberry-pi/config/.env
nano raspberry-pi/config/.env
```

## Component Deployment

### 1. Deploy Main Website to AWS Amplify

#### Option A: Console Deployment

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" → "Host web app"
3. Connect your Git repository
4. Configure build settings:
   - App root directory: `nxthreat.io`
   - Build command: `npm run build`
   - Output directory: `.next`
5. Use the provided `amplify.yml` configuration
6. Add environment variables in Amplify Console
7. Deploy!

#### Option B: Amplify CLI

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
cd nxthreat.io
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```

#### Custom Domain Setup

1. In Amplify Console → Domain management
2. Add custom domain: `nxthreat.io`
3. Add subdomains:
   - `robot.nxthreat.io` → Kid-friendly UI (to be built)
   - `command.nxthreat.io` → Command UI (to be built)
   - `api.nxthreat.io` → MCP Server (requires separate hosting)

### 2. Deploy MCP Server

The MCP Server needs to be accessible by Claude Code and the Raspberry Pi.

#### Option A: Run on Development Machine

For development/testing:

```bash
cd mcp-server
npm run build
npm start
```

#### Option B: Deploy to VPS/Cloud

**Using PM2 on a VPS:**

```bash
# On your server
git clone https://github.com/yourusername/nxthreat.git
cd nxthreat/mcp-server
npm install
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start build/index.js --name kali-mcp-server
pm2 save
pm2 startup
```

**Using Docker:**

```bash
cd mcp-server
docker build -t kali-mcp-server .
docker run -d -p 3000:3000 --name kali-mcp-server kali-mcp-server
```

#### Option C: Deploy to AWS Lambda (via API Gateway)

For serverless deployment, you'll need to adapt the MCP server to run as HTTP endpoints.

### 3. Deploy to Raspberry Pi

#### Prerequisites on Pi

- Kali Linux ARM installed
- Python 3.9+
- SSH access configured

#### Deployment Steps

**Method 1: Manual Copy**

```bash
# From your computer
scp -r raspberry-pi kali@<pi-ip>:~/nxthreat/

# SSH into Pi
ssh kali@<pi-ip>
cd ~/nxthreat/raspberry-pi

# Set up
chmod +x scripts/*.sh
./scripts/setup.sh
```

**Method 2: Git Pull (Recommended for updates)**

```bash
# On Raspberry Pi
ssh kali@<pi-ip>

# First time
cd ~
git clone https://github.com/yourusername/nxthreat.git
cd nxthreat/raspberry-pi
./scripts/setup.sh

# For updates
cd ~/nxthreat
git pull
cd raspberry-pi
source venv/bin/activate
pip install -r requirements.txt --upgrade
sudo systemctl restart kali-robot
```

**Method 3: Automated with npm script**

```bash
# From your computer (set PI_HOST environment variable)
export PI_HOST=<pi-ip>
npm run pi:deploy
```

#### Set up as System Service

```bash
# On Raspberry Pi
sudo cp deployment/systemd/kali-robot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable kali-robot
sudo systemctl start kali-robot
sudo systemctl status kali-robot
```

### 4. Deploy n8n Workflows

#### SSH into n8n Instance

```bash
ssh -i ~/.ssh/your-key.pem ubuntu@automation.tampadynamics.com
```

#### Import Workflows

```bash
# On n8n server
cd /path/to/nxthreat
git pull

# Import workflows
n8n import:workflow --input=./n8n-workflows/kid-mode/polly-speech.json
n8n import:workflow --input=./n8n-workflows/shared/mode-change-logger.json
# ... import others as needed
```

## Environment Configuration

### Production Environment Variables

#### MCP Server (.env)

```bash
NODE_ENV=production
PORT=3000
N8N_WEBHOOK_BASE=https://automation.tampadynamics.com/webhook
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
JWT_SECRET=<strong-secret>
```

#### Raspberry Pi (config/.env)

```bash
MCP_API_KEY=<your-mcp-key>
N8N_WEBHOOK_KEY=<your-webhook-key>
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
KALI_DEBUG=false
```

## DNS Configuration

Set up DNS records for nxthreat.io:

```
A     @                    → <amplify-ip>
CNAME www                  → <amplify-domain>
A     api                  → <mcp-server-ip>
A     robot                → <amplify-ip>
A     command              → <amplify-ip>
CNAME automation           → automation.tampadynamics.com
```

## CI/CD Pipeline (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build:web
      # Amplify handles deployment automatically

  deploy-mcp:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd mcp-server && npm ci && npm run build
      # Add deployment steps for your MCP server

  deploy-pi:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          echo "${{ secrets.PI_SSH_KEY }}" > pi_key
          chmod 600 pi_key
          scp -i pi_key -r raspberry-pi kali@${{ secrets.PI_HOST }}:~/nxthreat/
          ssh -i pi_key kali@${{ secrets.PI_HOST }} 'cd ~/nxthreat/raspberry-pi && ./scripts/update.sh'
```

## Monitoring & Maintenance

### Logs

**MCP Server:**
```bash
pm2 logs kali-mcp-server
```

**Raspberry Pi:**
```bash
journalctl -u kali-robot -f
```

**n8n:**
```bash
pm2 logs n8n
```

### Health Checks

```bash
# Check MCP Server
curl https://api.nxthreat.io/health

# Check website
curl https://nxthreat.io

# Check Pi status (from MCP)
# Use kali_get_status tool in Claude Code
```

### Updates

**Update all components:**

```bash
# Pull latest changes
git pull

# Update MCP Server
cd mcp-server
npm install
npm run build
pm2 restart kali-mcp-server

# Update website (Amplify auto-deploys)

# Update Pi
npm run pi:deploy
```

## Backup & Recovery

### Backup Configuration

```bash
# Backup environment files
tar -czf nxthreat-config-backup.tar.gz \
  mcp-server/.env \
  raspberry-pi/config/.env \
  n8n-workflows/*.json

# Store securely (not in git!)
```

### Recovery

```bash
# Restore from backup
tar -xzf nxthreat-config-backup.tar.gz

# Redeploy components as needed
```

## Security Checklist

- [ ] All `.env` files excluded from git
- [ ] Strong JWT secrets generated
- [ ] AWS credentials properly configured
- [ ] SSH keys secured
- [ ] Firewall rules configured on Pi
- [ ] HTTPS enabled on all domains
- [ ] Cyber mode authentication enabled
- [ ] Target validation active
- [ ] Audit logging to n8n working

## Troubleshooting

### Website not deploying?
- Check Amplify build logs
- Verify amplify.yml configuration
- Check environment variables in Amplify Console

### MCP Server not accessible?
- Check firewall rules
- Verify DNS configuration
- Check PM2 process status
- Review server logs

### Raspberry Pi not connecting?
- Verify network connectivity
- Check MCP server URL in config
- Test n8n webhooks manually
- Review Pi service logs

## Support

- Documentation: [`README.md`](README.md)
- Architecture: [`docs/architecture.drawio`](docs/architecture.drawio)
- Quick Start: [`QUICKSTART.md`](QUICKSTART.md)

---

**Happy deploying! 🚀**
