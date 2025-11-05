#!/bin/bash
#
# Auto WiFi Connection Script
# Automatically connects to Matt Santucci's iPhone hotspot
# Runs on startup to ensure Kali always has connectivity
#

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Kali Auto WiFi Connection${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Primary network: Matt's iPhone
IPHONE_SSID="Matt Santucci's iPhone"
IPHONE_PRIORITY=100

# Secondary network: Home WiFi
HOME_SSID="Frontier0720"
HOME_PRIORITY=50

# Function to check if already connected
check_connection() {
    if ping -c 1 -W 2 8.8.8.8 &> /dev/null; then
        CURRENT_SSID=$(iwgetid -r)
        echo -e "${GREEN}✓ Already connected to: $CURRENT_SSID${NC}"
        return 0
    fi
    return 1
}

# Function to connect to WiFi
connect_wifi() {
    local SSID=$1
    local PRIORITY=$2

    echo -e "${BLUE}Attempting to connect to: $SSID${NC}"

    # Check if network is available
    if nmcli device wifi list | grep -q "$SSID"; then
        echo -e "${GREEN}✓ Network found: $SSID${NC}"

        # Try to connect (will use saved password if available)
        if nmcli connection up "$SSID" 2>/dev/null; then
            echo -e "${GREEN}✓ Connected to $SSID${NC}"
            return 0
        elif nmcli device wifi connect "$SSID" 2>/dev/null; then
            echo -e "${GREEN}✓ Connected to $SSID${NC}"

            # Set priority
            nmcli connection modify "$SSID" connection.autoconnect-priority $PRIORITY 2>/dev/null
            return 0
        else
            echo -e "${RED}✗ Failed to connect to $SSID${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ Network not in range: $SSID${NC}"
        return 1
    fi
}

# Function to rescan networks
rescan_networks() {
    echo -e "${BLUE}Scanning for WiFi networks...${NC}"
    nmcli device wifi rescan 2>/dev/null || true
    sleep 3
}

# Main connection logic
main() {
    # Check if already connected
    if check_connection; then
        exit 0
    fi

    echo -e "${BLUE}Not connected, searching for networks...${NC}"

    # Rescan for networks
    rescan_networks

    # Try iPhone first (highest priority)
    if connect_wifi "$IPHONE_SSID" $IPHONE_PRIORITY; then
        echo -e "${GREEN}✓ Connected to Matt's iPhone${NC}"
        echo -e "${GREEN}✓ Alpha WiFi card active${NC}"
        exit 0
    fi

    # Fallback to home network
    if connect_wifi "$HOME_SSID" $HOME_PRIORITY; then
        echo -e "${GREEN}✓ Connected to home network${NC}"
        exit 0
    fi

    echo -e "${RED}✗ Unable to connect to any network${NC}"
    echo -e "${BLUE}Available networks:${NC}"
    nmcli device wifi list

    exit 1
}

# Run main function
main
