# WiFi Auto-Connection Setup

Configure Kali to automatically connect to Matt's iPhone hotspot on startup.

## One-Time Setup

SSH into the Raspberry Pi and run these commands:

```bash
cd ~/nxthreat/raspberry-pi

# Make script executable
chmod +x scripts/auto_connect_wifi.sh

# Add iPhone hotspot credentials to NetworkManager
sudo nmcli device wifi connect "Matt Santucci's iPhone" password "oozingpig"

# Set high priority for iPhone connection
sudo nmcli connection modify "Matt Santucci's iPhone" connection.autoconnect-priority 100

# Install systemd service
sudo cp deployment/systemd/wifi-auto-connect.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable wifi-auto-connect
sudo systemctl start wifi-auto-connect

# Check status
sudo systemctl status wifi-auto-connect
```

## How It Works

1. On boot, the service runs `auto_connect_wifi.sh`
2. Script checks if already connected
3. If not, scans for networks
4. Tries to connect to iPhone first (priority 100)
5. Falls back to home WiFi if iPhone not available
6. Logs results to system journal

## Manual Testing

Test the connection script manually:

```bash
cd ~/nxthreat/raspberry-pi
./scripts/auto_connect_wifi.sh
```

## View Connection Logs

```bash
# View service logs
sudo journalctl -u wifi-auto-connect -f

# Check current connection
nmcli connection show --active
iwgetid -r
```

## Troubleshooting

### iPhone not connecting

```bash
# List saved connections
nmcli connection show

# Delete and re-add iPhone connection
sudo nmcli connection delete "Matt Santucci's iPhone"
sudo nmcli device wifi connect "Matt Santucci's iPhone" password "oozingpig"
```

### Check Alpha WiFi card

```bash
# List wireless interfaces
iw dev

# Check card status
iwconfig

# Ensure wlan0 (or wlan1 for Alpha) is up
sudo ip link set wlan0 up
```

## Network Priorities

- **Matt's iPhone**: Priority 100 (preferred)
- **Home WiFi (Frontier0720)**: Priority 50 (fallback)

Networks with higher priority connect first when available.
