"""
Display Service
Manages the robot's face/UI on HDMI display using pygame
Full-screen, edge-to-edge stunning visual interface
"""

import pygame
import math
import time
from loguru import logger

class DisplayService:
    """Display/UI service for robot face"""

    def __init__(self):
        self.screen = None
        self.theme = "kid"
        self.initialized = False
        self.width = 1920  # Full HD
        self.height = 1080
        self.clock = pygame.time.Clock()

        # Animation state
        self.blink_timer = 0
        self.is_blinking = False
        self.eye_openness = 1.0
        self.speaking = False
        self.mouth_animation = 0

        # Colors for themes
        self.themes = {
            "kid": {
                "bg": (135, 206, 250),  # Sky blue
                "eye": (50, 50, 50),     # Dark gray eyes
                "pupil": (0, 0, 0),      # Black pupils
                "accent": (255, 192, 203) # Pink
            },
            "cyber": {
                "bg": (10, 10, 15),      # Almost black
                "eye": (0, 255, 100),    # Matrix green
                "pupil": (0, 200, 80),   # Bright green
                "accent": (255, 0, 0)    # Red accent
            }
        }

    async def initialize(self):
        """Initialize pygame display"""
        try:
            pygame.init()
            pygame.font.init()

            # Try fullscreen first, fallback to windowed
            try:
                self.screen = pygame.display.set_mode((0, 0), pygame.FULLSCREEN)
                info = pygame.display.Info()
                self.width = info.current_w
                self.height = info.current_h
                logger.info(f"✓ Display initialized (Fullscreen {self.width}x{self.height})")
            except pygame.error:
                self.screen = pygame.display.set_mode((self.width, self.height))
                logger.info(f"✓ Display initialized (Windowed {self.width}x{self.height})")

            pygame.display.set_caption("Kali Robot")
            pygame.mouse.set_visible(False)  # Hide cursor for clean look
            self.initialized = True

        except Exception as e:
            logger.error(f"Failed to initialize display: {e}")
            self.initialized = False

    def set_theme(self, theme: str):
        """Set display theme (kid/cyber)"""
        self.theme = theme
        logger.info(f"Display theme set to: {theme}")

    def set_speaking(self, speaking: bool):
        """Set speaking state for mouth animation"""
        self.speaking = speaking

    def draw_eye(self, center_x, center_y, size):
        """Draw an animated eye"""
        colors = self.themes[self.theme]

        # Eye white/background
        eye_height = int(size * self.eye_openness)
        if eye_height > 5:
            pygame.draw.ellipse(
                self.screen,
                (255, 255, 255),
                (center_x - size, center_y - eye_height, size * 2, eye_height * 2)
            )

            # Iris
            iris_size = int(size * 0.6)
            pygame.draw.circle(
                self.screen,
                colors["eye"],
                (center_x, center_y),
                iris_size
            )

            # Pupil
            pupil_size = int(size * 0.3)
            pygame.draw.circle(
                self.screen,
                colors["pupil"],
                (center_x, center_y),
                pupil_size
            )

            # Highlight (makes eyes look alive)
            highlight_size = int(size * 0.15)
            pygame.draw.circle(
                self.screen,
                (255, 255, 255),
                (center_x - pupil_size // 3, center_y - pupil_size // 3),
                highlight_size
            )

    def draw_mouth(self, center_x, center_y, width):
        """Draw animated mouth"""
        colors = self.themes[self.theme]

        if self.speaking:
            # Animate mouth when speaking
            mouth_open = abs(math.sin(self.mouth_animation * 0.3)) * 30
            self.mouth_animation += 1
        else:
            # Smile when not speaking
            mouth_open = 0

        # Draw mouth arc
        mouth_rect = pygame.Rect(
            center_x - width // 2,
            center_y - int(mouth_open),
            width,
            int(40 + mouth_open)
        )

        pygame.draw.arc(
            self.screen,
            colors["accent"],
            mouth_rect,
            0,
            math.pi,
            5
        )

    def draw_status_bar(self, mode: str, status: str):
        """Draw status bar at bottom"""
        colors = self.themes[self.theme]
        font = pygame.font.Font(None, 36)

        # Status bar background
        bar_height = 60
        pygame.draw.rect(
            self.screen,
            (0, 0, 0, 128),
            (0, self.height - bar_height, self.width, bar_height)
        )

        # Mode text
        mode_text = font.render(f"MODE: {mode.upper()}", True, colors["accent"])
        self.screen.blit(mode_text, (20, self.height - bar_height + 15))

        # Status text
        status_text = font.render(status, True, (255, 255, 255))
        self.screen.blit(
            status_text,
            (self.width - status_text.get_width() - 20, self.height - bar_height + 15)
        )

    def update_blink(self):
        """Update blinking animation"""
        current_time = time.time()

        # Blink every 3-5 seconds
        if not self.is_blinking and current_time - self.blink_timer > 4:
            self.is_blinking = True
            self.blink_timer = current_time

        if self.is_blinking:
            # Close eyes quickly
            self.eye_openness -= 0.2
            if self.eye_openness <= 0:
                self.eye_openness = 0
                # Start opening
            if self.eye_openness == 0:
                self.eye_openness = 0.1  # Start opening
        else:
            # Open eyes
            if self.eye_openness < 1.0:
                self.eye_openness += 0.2
            if self.eye_openness >= 1.0:
                self.eye_openness = 1.0
                self.is_blinking = False

    async def update(self, mode="kid", status="Ready"):
        """Update display (main loop)"""
        if not self.initialized:
            return

        try:
            # Handle pygame events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    return
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        return

            # Fill background
            colors = self.themes[self.theme]
            self.screen.fill(colors["bg"])

            # Update animations
            self.update_blink()

            # Calculate positions
            center_x = self.width // 2
            center_y = self.height // 2
            eye_size = 80
            eye_spacing = 200

            # Draw face
            # Left eye
            self.draw_eye(center_x - eye_spacing, center_y - 50, eye_size)
            # Right eye
            self.draw_eye(center_x + eye_spacing, center_y - 50, eye_size)
            # Mouth
            self.draw_mouth(center_x, center_y + 120, 300)

            # Draw status bar
            self.draw_status_bar(mode, status)

            # Update display
            pygame.display.flip()
            self.clock.tick(60)  # 60 FPS

        except Exception as e:
            logger.error(f"Display update error: {e}")

    async def shutdown(self):
        """Cleanup display"""
        if self.initialized:
            pygame.quit()
        logger.info("Display service shut down")
