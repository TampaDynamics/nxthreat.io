"""
Kali Robot Core
Main robot controller with mode switching and service coordination
"""

import asyncio
from pathlib import Path
from loguru import logger
from .modes import RobotMode
from .voice import VoiceService
from .display import DisplayService
from ..services.mcp_client import MCPClient
from ..services.n8n_client import N8NClient

class KaliRobot:
    """
    Main robot controller
    Coordinates all services and handles mode switching
    """

    def __init__(self):
        self.current_mode = RobotMode.LOCKED
        self.voice_service = None
        self.display_service = None
        self.mcp_client = None
        self.n8n_client = None
        self.running = False

    async def initialize(self):
        """Initialize all robot services"""
        logger.info("Initializing robot services...")

        try:
            # Initialize voice service (AWS Polly)
            self.voice_service = VoiceService()
            await self.voice_service.initialize()
            logger.info("✓ Voice service initialized")

            # Initialize display service (pygame)
            self.display_service = DisplayService()
            await self.display_service.initialize()
            logger.info("✓ Display service initialized")

            # Initialize MCP client
            self.mcp_client = MCPClient()
            # await self.mcp_client.connect()  # TODO: Enable when MCP server deployed
            logger.info("⚠ MCP client (not connected - server not deployed yet)")

            # Initialize n8n client
            self.n8n_client = N8NClient()
            await self.n8n_client.test_connection()
            logger.info("✓ n8n client initialized")

            self.running = True
            logger.info("All services initialized successfully")

        except Exception as e:
            logger.error(f"Failed to initialize services: {e}")
            raise

    async def set_mode(self, mode: RobotMode):
        """Switch robot mode (kid/cyber/locked)"""
        logger.info(f"Switching mode: {self.current_mode.value} -> {mode.value}")

        # Update voice based on mode
        if mode == RobotMode.KID:
            self.voice_service.set_voice("Joanna")  # Friendly female voice
            self.display_service.set_theme("kid")
        elif mode == RobotMode.CYBER:
            self.voice_service.set_voice("Matthew")  # Professional male voice
            self.display_service.set_theme("cyber")
        elif mode == RobotMode.LOCKED:
            # Robot is locked, minimal functionality
            pass

        self.current_mode = mode
        logger.info(f"✓ Mode switched to: {mode.value}")

    async def speak(self, text: str):
        """Make robot speak using current voice"""
        logger.info(f"Speaking: '{text}'")
        await self.voice_service.speak(text)

        # Log to n8n
        if self.n8n_client:
            await self.n8n_client.log_event(
                "speech",
                self.current_mode.value,
                {"text": text, "voice": self.voice_service.current_voice}
            )

    async def run(self):
        """Main event loop"""
        logger.info("Kali robot is running...")

        while self.running:
            try:
                # Main loop - process events, handle inputs, etc.
                await asyncio.sleep(0.1)

                # Update display
                if self.display_service:
                    await self.display_service.update()

            except KeyboardInterrupt:
                logger.info("Keyboard interrupt received")
                break
            except Exception as e:
                logger.error(f"Error in main loop: {e}")
                # Continue running unless critical

    async def shutdown(self):
        """Graceful shutdown"""
        logger.info("Shutting down robot services...")
        self.running = False

        if self.voice_service:
            await self.voice_service.shutdown()

        if self.display_service:
            await self.display_service.shutdown()

        if self.mcp_client:
            await self.mcp_client.disconnect()

        logger.info("✓ All services shut down")
