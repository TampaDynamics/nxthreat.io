#!/usr/bin/env python3
"""
Kali Robot - Main Service
Dual-purpose robot: Kid Mode (educational) and Cyber Mode (penetration testing)
"""

import asyncio
import os
import sys
from pathlib import Path
from loguru import logger

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
from src.core.robot import KaliRobot
from src.core.modes import RobotMode

# Load configuration
config_dir = Path(__file__).parent.parent / "config"
load_dotenv(config_dir / ".env")

# Configure logging
log_dir = Path(__file__).parent.parent / "logs"
log_dir.mkdir(exist_ok=True)

logger.add(
    log_dir / "kali_{time}.log",
    rotation="1 day",
    retention="7 days",
    level=os.getenv("KALI_LOG_LEVEL", "INFO")
)

async def main():
    """Main entry point for Kali robot service"""
    logger.info("=" * 60)
    logger.info("🤖 Kali Robot Starting...")
    logger.info("=" * 60)

    try:
        # Initialize robot
        robot = KaliRobot()

        # Start in kid mode by default
        await robot.initialize()
        await robot.set_mode(RobotMode.KID)

        logger.info("✓ Kali robot initialized successfully")
        logger.info(f"Current mode: {robot.current_mode.value}")

        # Say hello
        await robot.speak("Hello! My name is Kali. I am ready!")

        # Main event loop
        logger.info("Entering main event loop...")
        await robot.run()

    except KeyboardInterrupt:
        logger.info("Shutdown requested by user")
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        import traceback
        traceback.print_exc()
        return 1
    finally:
        logger.info("Shutting down Kali robot...")
        if 'robot' in locals():
            await robot.shutdown()
        logger.info("Goodbye!")

    return 0

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
