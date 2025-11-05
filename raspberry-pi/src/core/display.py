"""
Display Service
Manages the robot's face/UI on HDMI display using pygame
"""

import pygame
from loguru import logger

class DisplayService:
    """Display/UI service for robot face"""

    def __init__(self):
        self.screen = None
        self.theme = "kid"
        self.initialized = False

    async def initialize(self):
        """Initialize pygame display"""
        try:
            # Initialize pygame (will be headless if no display)
            pygame.init()

            # Try to create display
            try:
                self.screen = pygame.display.set_mode((800, 600))
                pygame.display.set_caption("Kali Robot")
                self.initialized = True
                logger.info("✓ Display initialized (800x600)")
            except pygame.error:
                logger.warning("No display available (headless mode)")
                self.initialized = False

        except Exception as e:
            logger.error(f"Failed to initialize display: {e}")
            self.initialized = False

    def set_theme(self, theme: str):
        """Set display theme (kid/cyber)"""
        self.theme = theme
        logger.info(f"Display theme set to: {theme}")

    async def update(self):
        """Update display (main loop)"""
        if not self.initialized:
            return

        try:
            # Handle pygame events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    return

            # Draw based on theme
            if self.theme == "kid":
                self.screen.fill((135, 206, 250))  # Sky blue
            elif self.theme == "cyber":
                self.screen.fill((20, 20, 20))  # Dark gray

            # TODO: Draw robot face, eyes, expressions

            pygame.display.flip()

        except Exception as e:
            logger.error(f"Display update error: {e}")

    async def shutdown(self):
        """Cleanup display"""
        if self.initialized:
            pygame.quit()
        logger.info("Display service shut down")
