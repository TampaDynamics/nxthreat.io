#!/bin/bash

# Setup script for Raspberry Pi
# Run this after SSHing into your Raspberry Pi

set -e  # Exit on error

echo "================================"
echo "NXThreat Raspberry Pi Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Checking if git is installed...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git not found. Installing...${NC}"
    sudo apt-get update
    sudo apt-get install -y git
else
    echo -e "${GREEN}✓ Git is installed${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Cloning NXThreat repository...${NC}"

# Remove existing directory if present
if [ -d ~/nxthreat ]; then
    echo "Existing nxthreat directory found. Backing up..."
    mv ~/nxthreat ~/nxthreat.backup.$(date +%Y%m%d_%H%M%S)
fi

# Clone the repository
git clone https://github.com/TampaDynamics/nxthreat.io.git ~/nxthreat

echo -e "${GREEN}✓ Repository cloned to ~/nxthreat${NC}"

echo ""
echo -e "${BLUE}Step 3: Setting up Raspberry Pi service...${NC}"

cd ~/nxthreat/raspberry-pi

# Check Python version
echo "Checking Python version..."
python3 --version

# Install Python dependencies
echo "Installing Python dependencies..."
if ! command -v pip3 &> /dev/null; then
    echo "Installing pip3..."
    sudo apt-get install -y python3-pip
fi

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment and install dependencies
echo "Installing Python packages..."
source venv/bin/activate
pip install -r requirements.txt

echo -e "${GREEN}✓ Python environment set up${NC}"

echo ""
echo -e "${BLUE}Step 4: Creating configuration files...${NC}"

# Copy environment template
if [ ! -f config/.env ]; then
    cp config/.env.example config/.env
    echo -e "${RED}⚠ Please edit config/.env with your API keys${NC}"
    echo "  nano config/.env"
fi

# Copy config template if needed
if [ ! -f config/config.local.yaml ]; then
    cp config/config.yaml config/config.local.yaml
    echo -e "${GREEN}✓ Created config/config.local.yaml${NC}"
    echo "  You can customize this for your local setup"
fi

echo ""
echo -e "${BLUE}Step 5: Testing connection to services...${NC}"

# Test connectivity
python3 scripts/test_connection.py || true

echo ""
echo "================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Configure environment variables:"
echo "   nano ~/nxthreat/raspberry-pi/config/.env"
echo ""
echo "2. Test the robot service:"
echo "   cd ~/nxthreat/raspberry-pi"
echo "   source venv/bin/activate"
echo "   python3 src/main.py"
echo ""
echo "3. Set up as system service (optional):"
echo "   sudo cp deployment/systemd/kali-robot.service /etc/systemd/system/"
echo "   sudo systemctl enable kali-robot"
echo "   sudo systemctl start kali-robot"
echo ""
echo "Repository location: ~/nxthreat"
echo "GitHub: https://github.com/TampaDynamics/nxthreat.io"
echo ""
