# Kali Robot - Raspberry Pi Service

This is the core service that runs on the Raspberry Pi, bringing Kali to life!

## Overview

The Raspberry Pi service is the "brain" of Kali, the physical robot. It:
- Connects to the MCP server (api.nxthreat.io)
- Manages hardware (display, audio, camera, sensors)
- Executes commands in both KID and CYBER modes
- Provides real-time feedback through voice, display, and LED indicators

## Hardware Requirements

- **Raspberry Pi** (3B+ or newer, 4 recommended)
- **OS**: Kali Linux ARM
- **GPT Dongle** (for AI processing)
- **HDMI Display** (for robot face/UI)
- **Speakers** (for AWS Polly voice output)
- **Camera** (USB webcam or Pi Camera v2)
- **ALFA Wireless Card** (for penetration testing)
- **LEDs** (optional - for mode indicators)

## SSH Access

```bash
# SSH into the Raspberry Pi
ssh pi@<raspberry-pi-ip>
# or if using default Kali user:
ssh kali@<raspberry-pi-ip>

# Default password (change this!)
# Raspberry Pi OS: raspberry
# Kali Linux: kali
```

### Find Your Pi on the Network

```bash
# From your computer, scan for Pi
nmap -sn 192.168.1.0/24 | grep -B 2 "Raspberry"

# Or use hostname
ping raspberrypi.local
# or for Kali:
ping kali.local
```

## Project Structure

```
raspberry-pi/
├── src/
│   ├── main.py              # Main robot service entry point
│   ├── config.py            # Configuration management
│   ├── modes/
│   │   ├── __init__.py
│   │   ├── kid_mode.py      # Kid mode logic
│   │   └── cyber_mode.py    # Cyber mode logic
│   ├── hardware/
│   │   ├── __init__.py
│   │   ├── display.py       # HDMI display management
│   │   ├── audio.py         # Speaker/audio output
│   │   ├── camera.py        # Camera/vision
│   │   ├── sensors.py       # Additional sensors
│   │   └── leds.py          # LED indicators
│   ├── kali/
│   │   ├── __init__.py
│   │   ├── executor.py      # Safe Kali command execution
│   │   └── validators.py    # Command validation
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── api_client.py    # MCP server communication
│   │   ├── logger.py        # Logging utilities
│   │   └── helpers.py       # Helper functions
│   └── robot.py             # Core robot class
├── config/
│   ├── config.yaml          # Main configuration
│   ├── kid_mode.yaml        # Kid mode settings
│   └── cyber_mode.yaml      # Cyber mode settings
├── tests/
│   ├── test_hardware.py
│   ├── test_modes.py
│   └── test_kali.py
├── scripts/
│   ├── setup.sh             # Initial setup script
│   ├── install_deps.sh      # Install dependencies
│   └── start_robot.sh       # Start the robot service
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Initial Setup

### 1. Clone the Repository to Your Pi

```bash
# SSH into your Pi
ssh kali@<pi-ip>

# Clone the repo
cd ~
git clone <your-repo-url> nxthreat
cd nxthreat/raspberry-pi
```

### 2. Run Setup Script

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run the setup script
sudo ./scripts/setup.sh
```

### 3. Configure the Service

Edit the configuration file:

```bash
nano config/config.yaml
```

Required settings:
```yaml
robot:
  name: "Kali"
  mode: "kid"  # kid, cyber, or locked

mcp_server:
  url: "wss://api.nxthreat.io"
  api_key: "your-api-key"

n8n:
  webhook_base: "https://automation.tampadynamics.com/webhook"

hardware:
  display:
    enabled: true
    resolution: [1920, 1080]
  audio:
    enabled: true
    device: "default"
  camera:
    enabled: true
    device: 0  # /dev/video0
  leds:
    enabled: true
    kid_mode_color: [0, 0, 255]  # Blue
    cyber_mode_color: [255, 0, 0]  # Red

aws:
  region: "us-east-1"
  polly:
    kid_voice: "Joanna"
    cyber_voice: "Matthew"
```

### 4. Install Python Dependencies

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 5. Test Hardware

```bash
# Test all hardware components
python3 -m pytest tests/test_hardware.py -v
```

## Running the Robot Service

### Manual Start

```bash
# Activate virtual environment
source venv/bin/activate

# Run the robot service
python3 src/main.py
```

### Run as System Service

Create a systemd service:

```bash
sudo nano /etc/systemd/system/kali-robot.service
```

```ini
[Unit]
Description=Kali Robot Service
After=network.target

[Service]
Type=simple
User=kali
WorkingDirectory=/home/kali/nxthreat/raspberry-pi
ExecStart=/home/kali/nxthreat/raspberry-pi/venv/bin/python3 src/main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable kali-robot
sudo systemctl start kali-robot
sudo systemctl status kali-robot
```

## Hardware Setup

### Display (HDMI)

The display shows:
- **Kid Mode**: Friendly robot face, colorful UI, educational content
- **Cyber Mode**: Terminal interface, scan results, professional UI

Test display:
```bash
python3 -c "from src.hardware.display import Display; d = Display(); d.test_pattern()"
```

### Audio/Speakers

Audio plays:
- AWS Polly voice responses
- Sound effects
- Music (kid mode)

Test audio:
```bash
python3 -c "from src.hardware.audio import Audio; a = Audio(); a.test_beep()"
```

### Camera

Camera used for:
- **Kid Mode**: Color recognition, object detection, games
- **Cyber Mode**: QR code scanning, document capture

Test camera:
```bash
python3 -c "from src.hardware.camera import Camera; c = Camera(); c.capture_test_image()"
```

### LEDs (Optional)

Visual mode indicators:
- **Blue**: Kid mode active
- **Red**: Cyber mode active
- **Green**: System ready
- **Yellow**: Processing
- **White**: Locked/maintenance mode

## Mode Management

### Switching Modes

Modes can be switched via:
1. Web interface (command.nxthreat.io)
2. Physical button on Pi
3. MCP server command
4. Voice command (if enabled)

Mode switch sequence:
```python
# Kid → Cyber transformation
1. Announce mode change (kid voice)
2. LED fade (blue → red)
3. Display animation (friendly face → terminal)
4. Authenticate user
5. Confirm switch (cyber voice)
6. Log to n8n
```

### Kid Mode Safety

In kid mode, the robot:
- ✅ Can speak and show emotions
- ✅ Can play educational games
- ✅ Can use the camera for learning
- ✅ Can track progress
- ❌ Cannot access system commands
- ❌ Cannot access network tools
- ❌ Cannot execute Kali tools
- ❌ Cannot modify files

### Cyber Mode Capabilities

In cyber mode, the robot can:
- Execute whitelisted Kali commands
- Perform network scans
- Run security assessments
- Generate reports
- All actions are logged

## Development

### Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_modes.py -v

# Run with coverage
pytest --cov=src tests/
```

### Debugging

Enable debug logging:

```bash
# Set environment variable
export KALI_DEBUG=1

# Or edit config.yaml
debug: true
log_level: "DEBUG"
```

View logs:
```bash
# Live logs
tail -f /var/log/kali-robot/robot.log

# Or if using systemd
journalctl -u kali-robot -f
```

### Hardware Diagnostic

```bash
# Run hardware diagnostic
python3 scripts/diagnose.py

# This will check:
# - Display connection
# - Audio output
# - Camera availability
# - Network connectivity
# - MCP server connection
# - n8n webhook availability
```

## Security

### Network Configuration

```bash
# Check network interfaces
ip addr

# ALFA card should be visible
iwconfig

# Put ALFA in monitor mode (cyber mode only)
sudo airmon-ng start wlan1
```

### Firewall Rules

```bash
# Allow only necessary connections
sudo ufw enable
sudo ufw allow from <your-network>/24 to any port 22
sudo ufw allow out to api.nxthreat.io
sudo ufw allow out to automation.tampadynamics.com
```

### API Key Management

Never commit API keys! Use environment variables:

```bash
# Add to ~/.bashrc or ~/.zshrc
export MCP_API_KEY="your-api-key"
export N8N_WEBHOOK_KEY="your-webhook-key"
```

Or use a `.env` file (git-ignored):
```bash
cp config/.env.example config/.env
nano config/.env
```

## Troubleshooting

### Robot Won't Start

```bash
# Check Python version
python3 --version  # Should be 3.9+

# Check dependencies
pip list

# Check logs
journalctl -u kali-robot -n 50
```

### Can't Connect to MCP Server

```bash
# Test connection
curl https://api.nxthreat.io/health

# Check DNS
nslookup api.nxthreat.io

# Test WebSocket
python3 -c "import websockets; print('WebSocket support OK')"
```

### Display Not Working

```bash
# Check HDMI connection
tvservice -s

# List displays
xrandr

# Test display
DISPLAY=:0 xrandr
```

### Camera Not Found

```bash
# List video devices
ls -l /dev/video*

# Test camera
raspistill -o test.jpg  # For Pi Camera
fswebcam test.jpg       # For USB camera
```

### Audio Not Working

```bash
# List audio devices
aplay -l

# Test audio
speaker-test -t wav -c 2

# Check volume
alsamixer
```

## Updating

```bash
# Pull latest changes
cd ~/nxthreat
git pull

# Update dependencies
cd raspberry-pi
source venv/bin/activate
pip install -r requirements.txt --upgrade

# Restart service
sudo systemctl restart kali-robot
```

## Next Steps

1. Complete initial setup
2. Test all hardware components
3. Connect to MCP server
4. Test kid mode activities
5. Set up cyber mode (with proper authorization!)
6. Create first demo: "Hello, I'm Kali!"

---

**Remember**: This robot is a learning tool. Always use cyber mode responsibly and legally!
