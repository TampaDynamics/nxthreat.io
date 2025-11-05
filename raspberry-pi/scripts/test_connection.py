#!/usr/bin/env python3
"""
Quick test script to verify Raspberry Pi can connect to all services
Run this after initial setup to verify connectivity
"""

import requests
import sys
import os
from pathlib import Path
from colorama import init, Fore, Style

# Load environment variables
from dotenv import load_dotenv
config_dir = Path(__file__).parent.parent / "config"
load_dotenv(config_dir / ".env")

init(autoreset=True)

def test_connection(name, url, method="GET", timeout=5):
    """Test connection to a service"""
    print(f"Testing {name}...", end=" ")
    try:
        if method == "GET":
            response = requests.get(url, timeout=timeout)
        else:
            response = requests.head(url, timeout=timeout)

        if response.status_code < 400:
            print(f"{Fore.GREEN}✓ Connected (Status: {response.status_code}){Style.RESET_ALL}")
            return True
        else:
            print(f"{Fore.YELLOW}⚠ Warning (Status: {response.status_code}){Style.RESET_ALL}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}✗ Failed - {str(e)}{Style.RESET_ALL}")
        return False

def test_aws_polly():
    """Test AWS Polly with actual credentials"""
    print(f"Testing AWS Polly...", end=" ")
    try:
        import boto3

        client = boto3.client('polly', region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1'))
        # Try to list voices as a lightweight test
        response = client.describe_voices(LanguageCode='en-US')
        print(f"{Fore.GREEN}✓ Connected ({len(response['Voices'])} voices available){Style.RESET_ALL}")
        return True
    except Exception as e:
        error_name = type(e).__name__
        if 'NoCredentials' in error_name:
            print(f"{Fore.RED}✗ Failed - No AWS credentials found{Style.RESET_ALL}")
        else:
            print(f"{Fore.RED}✗ Failed - {str(e)}{Style.RESET_ALL}")
        return False

def main():
    print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}Kali Robot - Connection Test{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")

    services = [
        ("n8n Instance", "https://automation.tampadynamics.com", "HEAD"),
        ("Main Website", "https://nxthreat.io", "HEAD"),
    ]

    results = []
    for name, url, method in services:
        result = test_connection(name, url, method)
        results.append(result)

    # Test AWS Polly separately with real credentials
    results.append(test_aws_polly())

    print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")

    if all(results):
        print(f"{Fore.GREEN}✓ All services are reachable!{Style.RESET_ALL}")
        print(f"{Fore.GREEN}You can proceed with Kali robot setup.{Style.RESET_ALL}")
        return 0
    else:
        print(f"{Fore.RED}✗ Some services are unreachable.{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Please check your network connection and DNS settings.{Style.RESET_ALL}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
