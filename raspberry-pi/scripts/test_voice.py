#!/usr/bin/env python3
"""
Test AWS Polly voice synthesis - Kali's first words!
This script tests both kid mode (Joanna) and cyber mode (Matthew) voices
"""

import os
import sys
from pathlib import Path
import boto3
from dotenv import load_dotenv

# Load environment variables
config_dir = Path(__file__).parent.parent / "config"
load_dotenv(config_dir / ".env")

def speak(text, voice_id="Joanna", output_file="speech.mp3"):
    """
    Synthesize speech using AWS Polly

    Args:
        text: Text to speak
        voice_id: Polly voice ID (Joanna for kid, Matthew for cyber)
        output_file: Output MP3 file path
    """
    print(f"\n🎤 Synthesizing speech with {voice_id} voice...")
    print(f"   Text: '{text}'")

    try:
        # Create Polly client
        polly = boto3.client(
            'polly',
            region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1')
        )

        # Request speech synthesis
        response = polly.synthesize_speech(
            Text=text,
            OutputFormat='mp3',
            VoiceId=voice_id,
            Engine='neural'  # Use neural engine for better quality
        )

        # Save audio to file
        output_path = Path(__file__).parent.parent / "tmp" / output_file
        output_path.parent.mkdir(exist_ok=True)

        with open(output_path, 'wb') as file:
            file.write(response['AudioStream'].read())

        print(f"✓ Audio saved to: {output_path}")
        print(f"\nTo play on Raspberry Pi, run:")
        print(f"   mpg123 {output_path}")

        return str(output_path)

    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    print("=" * 60)
    print("Kali Robot - Voice Test")
    print("=" * 60)

    # Test Kid Mode voice (Joanna)
    print("\n[Kid Mode - Joanna]")
    kid_text = "Hello! My name is Kali. I'm excited to learn and play with you!"
    kid_audio = speak(kid_text, voice_id="Joanna", output_file="kid_greeting.mp3")

    # Test Cyber Mode voice (Matthew)
    print("\n[Cyber Mode - Matthew]")
    cyber_text = "System initialized. Kali cyber mode activated. Ready for security operations."
    cyber_audio = speak(cyber_text, voice_id="Matthew", output_file="cyber_greeting.mp3")

    print("\n" + "=" * 60)
    if kid_audio and cyber_audio:
        print("✓ Voice test complete! Both modes working.")
        print("\nNext: Install mpg123 to play audio on Pi:")
        print("   sudo apt-get install -y mpg123")
        return 0
    else:
        print("✗ Voice test failed. Check AWS credentials.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
