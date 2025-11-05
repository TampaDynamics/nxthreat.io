"""
Voice Service
Handles AWS Polly text-to-speech synthesis and audio playback
"""

import os
import boto3
import subprocess
from pathlib import Path
from loguru import logger

class VoiceService:
    """AWS Polly voice synthesis service"""

    def __init__(self):
        self.polly_client = None
        self.current_voice = "Joanna"  # Default to kid-friendly voice
        self.audio_dir = Path(__file__).parent.parent.parent / "tmp" / "audio"
        self.audio_dir.mkdir(parents=True, exist_ok=True)

    async def initialize(self):
        """Initialize AWS Polly client"""
        try:
            self.polly_client = boto3.client(
                'polly',
                region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1')
            )
            logger.info("✓ AWS Polly client initialized")
        except Exception as e:
            logger.error(f"Failed to initialize Polly client: {e}")
            raise

    def set_voice(self, voice_id: str):
        """Set the current voice (Joanna for kid, Matthew for cyber)"""
        self.current_voice = voice_id
        logger.info(f"Voice changed to: {voice_id}")

    async def speak(self, text: str, voice_id: str = None):
        """
        Synthesize and play speech

        Args:
            text: Text to speak
            voice_id: Optional voice override (uses current_voice if not specified)
        """
        voice = voice_id or self.current_voice

        try:
            logger.debug(f"Synthesizing: '{text}' with {voice}")

            # Request speech synthesis
            response = self.polly_client.synthesize_speech(
                Text=text,
                OutputFormat='mp3',
                VoiceId=voice,
                Engine='neural'
            )

            # Save audio to temporary file
            audio_file = self.audio_dir / f"speech_{hash(text)}.mp3"
            with open(audio_file, 'wb') as f:
                f.write(response['AudioStream'].read())

            # Play audio using mpg123
            await self._play_audio(audio_file)

            # Clean up temporary file
            audio_file.unlink()

        except Exception as e:
            logger.error(f"Failed to speak: {e}")
            raise

    async def _play_audio(self, audio_file: Path):
        """Play audio file using mpg123"""
        try:
            # Check if mpg123 is installed
            result = subprocess.run(
                ['which', 'mpg123'],
                capture_output=True,
                text=True
            )

            if result.returncode == 0:
                # Play audio with better buffering and HDMI output
                # -a hw:0,0 forces HDMI audio
                # --buffer 8192 increases buffer size for smoother playback
                subprocess.run(
                    ['mpg123', '-q', '-a', 'hw:0,0', '--buffer', '8192', str(audio_file)],
                    check=True
                )
            else:
                logger.warning("mpg123 not installed, cannot play audio")
                logger.info(f"Audio saved to: {audio_file}")

        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to play audio: {e}")
        except Exception as e:
            logger.error(f"Unexpected error playing audio: {e}")

    async def shutdown(self):
        """Cleanup voice service"""
        logger.info("Voice service shutting down")
        # Clean up any remaining audio files
        for audio_file in self.audio_dir.glob("*.mp3"):
            audio_file.unlink()
