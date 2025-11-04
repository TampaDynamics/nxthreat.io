# Raspberry Pi Setup Guide

Quick guide to set up your Raspberry Pi with the NXThreat/Kali robot software.

## Prerequisites

- Raspberry Pi (3B+ or newer) with Kali Linux installed
- Network connection (WiFi or Ethernet)
- SSH access enabled

## Step 1: Find Your Pi's IP Address

### Option A: Check your router
Look for a device named "raspberrypi" or "kali"

### Option B: Use nmap (from your computer)
```bash
nmap -sn 192.168.1.0/24 | grep -B 2 "Raspberry"
```

### Option C: Use hostname
```bash
ping raspberrypi.local
# or
ping kali.local
```

## Step 2: SSH into Your Raspberry Pi

### Default Kali Linux credentials:
```bash
ssh kali@<pi-ip-address>
# Default password: kali
```

### Or default Raspberry Pi OS:
```bash
ssh pi@<pi-ip-address>
# Default password: raspberry
```

**Important**: Change the default password after first login!
```bash
passwd
```

## Step 3: Run the Setup Script

Once connected to your Pi:

```bash
# Download and run the setup script
curl -o setup.sh https://raw.githubusercontent.com/TampaDynamics/nxthreat.io/main/scripts/setup-pi.sh
chmod +x setup.sh
./setup.sh
```

**OR** do it manually:

```bash
# Install git if needed
sudo apt-get update
sudo apt-get install -y git

# Clone the repository
git clone https://github.com/TampaDynamics/nxthreat.io.git ~/nxthreat
cd ~/nxthreat/raspberry-pi

# Set up Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure
cp config/.env.example config/.env
nano config/.env  # Edit with your API keys
```

## Step 4: Configure Environment Variables

Edit the configuration file:

```bash
cd ~/nxthreat/raspberry-pi
nano config/.env
```

Required variables:
```bash
MCP_API_KEY=your_mcp_api_key
N8N_WEBHOOK_KEY=your_webhook_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
```

## Step 5: Test the Connection

```bash
cd ~/nxthreat/raspberry-pi
source venv/bin/activate
python3 scripts/test_connection.py
```

You should see:
```
✓ MCP Server - Connected
✓ n8n Instance - Connected
✓ Main Website - Connected
✓ AWS Polly - Connected
```

## Step 6: Run the Robot Service

```bash
cd ~/nxthreat/raspberry-pi
source venv/bin/activate
python3 src/main.py
```

## Step 7: Set Up as System Service (Optional)

To make Kali start automatically on boot:

```bash
# Copy systemd service file
sudo cp ~/nxthreat/deployment/systemd/kali-robot.service /etc/systemd/system/

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable kali-robot
sudo systemctl start kali-robot

# Check status
sudo systemctl status kali-robot

# View logs
journalctl -u kali-robot -f
```

## Updating the Code

To pull the latest changes from GitHub:

```bash
cd ~/nxthreat
git pull

# Update Python dependencies if needed
cd raspberry-pi
source venv/bin/activate
pip install -r requirements.txt --upgrade

# Restart service if running
sudo systemctl restart kali-robot
```

## Troubleshooting

### Can't SSH into Pi?
- Check Pi is powered on and connected to network
- Verify SSH is enabled: `sudo systemctl status ssh`
- Check firewall: `sudo ufw status`

### Git clone fails?
- Check internet connection: `ping google.com`
- Verify GitHub is accessible: `curl https://github.com`

### Python packages won't install?
```bash
# Update pip
pip install --upgrade pip

# Install system dependencies
sudo apt-get install -y python3-dev python3-pip
```

### Connection test fails?
- Verify network connectivity
- Check DNS resolution: `nslookup api.nxthreat.io`
- Try with curl: `curl https://automation.tampadynamics.com`

## Hardware Setup

### Display (HDMI)
Connect display to HDMI port. The robot face/UI will appear here.

### Speakers
Connect to 3.5mm audio jack or via USB. Used for AWS Polly voice output.

### Camera
- USB webcam: Plug into USB port
- Pi Camera: Connect to camera port (CSI)

### ALFA Wireless Card
Connect to USB port for penetration testing capabilities (cyber mode).

### LEDs (Optional)
Connect to GPIO pins as specified in config/config.yaml:
- Pin 18 (BCM): Mode indicator
- Pin 23 (BCM): Status indicator

## Quick Command Reference

```bash
# SSH into Pi
ssh kali@<pi-ip>

# Navigate to project
cd ~/nxthreat/raspberry-pi

# Activate Python environment
source venv/bin/activate

# Run robot service
python3 src/main.py

# Check service status
sudo systemctl status kali-robot

# View logs
journalctl -u kali-robot -f

# Restart service
sudo systemctl restart kali-robot

# Pull updates
cd ~/nxthreat && git pull
```

## Security Notes

- Change default password immediately
- Keep system updated: `sudo apt-get update && sudo apt-get upgrade`
- Configure firewall: `sudo ufw enable`
- Use SSH keys instead of passwords for production

## Getting Help

- Check main documentation: `README.md`
- View project status: `docs/PROJECT_STATUS.md`
- Architecture diagram: `docs/architecture.drawio`
- GitHub issues: https://github.com/TampaDynamics/nxthreat.io/issues

---

**Ready to bring Kali to life!** 🤖
