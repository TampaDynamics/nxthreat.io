/**
 * n8n Client
 *
 * Handles communication with n8n webhooks
 */

import axios from 'axios';

const N8N_BASE_URL = process.env.N8N_WEBHOOK_BASE || 'https://automation.tampadynamics.com/webhook';
const N8N_API_KEY = process.env.N8N_API_KEY;

/**
 * Call an n8n webhook
 */
export async function callN8nWebhook(endpoint: string, data: any): Promise<any> {
  try {
    const url = `${N8N_BASE_URL}${endpoint}`;

    console.error(`Calling n8n webhook: ${url}`);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add API key if configured
    if (N8N_API_KEY) {
      headers['Authorization'] = `Bearer ${N8N_API_KEY}`;
    }

    const response = await axios.post(url, data, {
      headers,
      timeout: 30000, // 30 second timeout
    });

    return response.data;
  } catch (error) {
    console.error('n8n webhook error:', error);

    // Return mock data for development
    if (process.env.NODE_ENV === 'development') {
      console.error('Development mode: returning mock data');
      return {
        success: true,
        mock: true,
        endpoint,
        data,
      };
    }

    throw error;
  }
}

/**
 * Log an event to n8n
 */
export async function logEvent(eventType: string, data: any): Promise<void> {
  try {
    await callN8nWebhook('/event-log', {
      timestamp: new Date().toISOString(),
      event_type: eventType,
      data,
    });
  } catch (error) {
    console.error('Failed to log event:', error);
    // Don't throw - logging failures shouldn't break functionality
  }
}

/**
 * Send notification to parent
 */
export async function notifyParent(message: string, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<void> {
  try {
    await callN8nWebhook('/alert-parent', {
      message,
      priority,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to send parent notification:', error);
  }
}
