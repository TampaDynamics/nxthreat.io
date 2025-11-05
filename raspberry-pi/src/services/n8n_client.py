"""
n8n Client
Client for communicating with n8n workflows
"""

import os
import aiohttp
from loguru import logger

class N8NClient:
    """Client for n8n workflow communication"""

    def __init__(self):
        self.base_url = "https://automation.tampadynamics.com"
        self.webhook_key = os.getenv('N8N_WEBHOOK_KEY', '')

    async def test_connection(self):
        """Test connection to n8n instance"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(self.base_url, timeout=5) as response:
                    if response.status == 200:
                        logger.info("✓ n8n connection successful")
                        return True
                    else:
                        logger.warning(f"n8n returned status {response.status}")
                        return False
        except Exception as e:
            logger.error(f"Failed to connect to n8n: {e}")
            return False

    async def trigger_workflow(self, workflow_name: str, data: dict):
        """
        Trigger an n8n workflow

        Args:
            workflow_name: Name of the workflow
            data: Data to send to workflow
        """
        webhook_url = f"{self.base_url}/webhook/{workflow_name}"

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(webhook_url, json=data) as response:
                    if response.status == 200:
                        result = await response.json()
                        logger.info(f"Workflow '{workflow_name}' triggered successfully")
                        return result
                    else:
                        logger.error(f"Workflow trigger failed: {response.status}")
                        return None

        except Exception as e:
            logger.error(f"Failed to trigger workflow: {e}")
            return None

    async def log_event(self, event_type: str, mode: str, data: dict):
        """Log an event to n8n for tracking"""
        payload = {
            "event_type": event_type,
            "mode": mode,
            "data": data,
            "robot": "Kali"
        }

        result = await self.trigger_workflow("kali-logger", payload)
        logger.debug(f"Event logged: {event_type}")
        return result
