#!/usr/bin/env python3
"""
Quick test script to verify Raspberry Pi can connect to all services
Run this after initial setup to verify connectivity
"""

import requests
import sys
from colorama import init, Fore, Style

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

def main():
    print(f"\n{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}Kali Robot - Connection Test{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")

    services = [
        ("MCP Server", "https://api.nxthreat.io", "HEAD"),
        ("n8n Instance", "https://automation.tampadynamics.com", "HEAD"),
        ("Main Website", "https://nxthreat.io", "HEAD"),
        ("AWS Polly (via boto3)", "https://polly.us-east-1.amazonaws.com", "HEAD"),
    ]

    results = []
    for name, url, method in services:
        result = test_connection(name, url, method)
        results.append(result)

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
