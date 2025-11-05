#!/usr/bin/env python3
"""
Test different AWS Polly voices to find the most badass one
"""

import os
import sys
import boto3
import subprocess
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
config_dir = Path(__file__).parent.parent / "config"
load_dotenv(config_dir / ".env")

def test_voice(voice_id: str, text: str):
    """Test a specific voice"""
    print(f"\nTesting {voice_id}...")

    polly = boto3.client('polly', region_name='us-east-1')

    response = polly.synthesize_speech(
        Text=text,
        OutputFormat='mp3',
        VoiceId=voice_id,
        Engine='neural'
    )

    audio_file = f"/tmp/{voice_id}.mp3"
    with open(audio_file, 'wb') as f:
        f.write(response['AudioStream'].read())

    subprocess.run(['mpg123', '-q', '-a', 'hw:0,0', audio_file])

def main():
    print("=" * 60)
    print("Testing Badass Female Voices for Kali")
    print("=" * 60)

    text = "Hello. My name is Kali. I am your cybersecurity companion. Let's hack the planet."

    voices = [
        ('Kimberly', 'US - Strong, assertive'),
        ('Kendra', 'US - Confident, professional'),
        ('Emma', 'British - Authoritative'),
        ('Salli', 'US - Casual but intelligent'),
        ('Amy', 'British - Sophisticated'),
        ('Olivia', 'Australian - Strong'),
    ]

    for voice_id, description in voices:
        print(f"\n{voice_id} - {description}")
        input("Press Enter to hear this voice...")
        try:
            test_voice(voice_id, text)
        except Exception as e:
            print(f"Error with {voice_id}: {e}")

    print("\n" + "=" * 60)
    print("Which voice sounds most badass?")
    print("Update config to use your favorite!")

if __name__ == "__main__":
    main()
