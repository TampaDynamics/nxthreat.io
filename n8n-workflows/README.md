# n8n Workflows for NXThreat / Kali Robot

This directory contains n8n workflow exports for the Kali robot system.

## n8n Instance

- **URL**: https://automation.tampadynamics.com
- **Access**: CLI access available via SSH to Lightsail instance

## Directory Structure

```
n8n-workflows/
├── kid-mode/           # Kid mode workflows
│   ├── polly-speech.json
│   ├── learning-tracker.json
│   └── story-fetcher.json
├── cyber-mode/         # Cyber mode workflows
│   ├── scan-processor.json
│   ├── report-generator.json
│   └── alert-notifier.json
└── shared/             # Shared workflows
    ├── mode-change-logger.json
    └── parent-notification.json
```

## Accessing Your n8n Instance

### SSH into Lightsail

To SSH into your Lightsail instance where n8n is hosted:

```bash
# Download your Lightsail SSH key from AWS console if not already downloaded
# Default location: ~/.ssh/LightsailDefaultKey-*.pem

# Set proper permissions on the key
chmod 400 ~/.ssh/LightsailDefaultKey-*.pem

# SSH into the instance
ssh -i ~/.ssh/LightsailDefaultKey-*.pem ubuntu@automation.tampadynamics.com

# Or if using a different key name:
ssh -i ~/.ssh/your-key-name.pem ubuntu@<your-lightsail-ip>
```

### Alternative: Use AWS Lightsail Browser-based SSH

1. Go to AWS Lightsail Console
2. Select your instance
3. Click "Connect using SSH" button
4. Browser-based terminal opens

### Finding Your SSH Key

If you need to locate your SSH key:

```bash
# List all keys in SSH directory
ls -la ~/.ssh/

# Common Lightsail key patterns:
# LightsailDefaultKey-*.pem
# LightsailDefaultPrivateKey-*.pem
```

If you don't have the key locally:
1. Go to AWS Lightsail Console
2. Account → SSH Keys
3. Download the default key pair

## n8n CLI Commands

Once connected via SSH to your Lightsail instance:

### List Workflows
```bash
n8n list:workflow
```

### Export Workflow
```bash
# Export single workflow
n8n export:workflow --id=<workflow_id> --output=./workflow.json

# Export all workflows
n8n export:workflow --all --output=./workflows/
```

### Import Workflow
```bash
n8n import:workflow --input=./workflow.json
```

### List Credentials
```bash
n8n list:credentials
```

### Start n8n (if needed)
```bash
# Check if n8n is running
pm2 list

# Start n8n
pm2 start n8n

# Restart n8n
pm2 restart n8n

# View logs
pm2 logs n8n
```

## Webhooks to Create

For the NXThreat/Kali system, we need these webhooks:

1. **`/webhook/polly-speak`** - Text → Polly → Audio URL
   - Input: `{ text, voice, emotion }`
   - Output: `{ audioUrl, duration }`

2. **`/webhook/learning-log`** - Log kid's progress
   - Input: `{ activity, success, duration, timestamp }`
   - Output: `{ logged: true, progressId }`

3. **`/webhook/scan-result`** - Log Kali scan results
   - Input: `{ scanType, target, results, timestamp }`
   - Output: `{ logged: true, scanId }`

4. **`/webhook/mode-change`** - Log mode switches
   - Input: `{ fromMode, toMode, user, timestamp }`
   - Output: `{ logged: true, sessionId }`

5. **`/webhook/alert-parent`** - Send notifications
   - Input: `{ type, message, priority }`
   - Output: `{ sent: true, channels: [] }`

## AWS Polly Configuration

For text-to-speech via AWS Polly, you'll need:

### AWS Credentials in n8n

1. Go to n8n → Credentials
2. Add "AWS" credential type
3. Add your AWS Access Key ID and Secret Access Key
4. Select region (e.g., `us-east-1`)

### Polly Voices

**Kid Mode:**
- `Joey` (child voice - male)
- `Joanna` (warm female)
- `Salli` (friendly female)

**Cyber Mode:**
- `Matthew` (professional male)
- `Brian` (British male - formal)
- `Ivy` (professional female)

## Example n8n Flow: Polly Speech

```
Webhook Trigger (POST /webhook/polly-speak)
  ↓
[Validate Input]
  ↓
AWS Polly Node
  - Text: {{$json.text}}
  - Voice: {{$json.voice || "Joanna"}}
  - OutputFormat: mp3
  - Engine: neural (for better quality)
  ↓
[Store Audio] (optional - S3 or local storage)
  ↓
Return Response
  - audioUrl: <polly-audio-url>
  - duration: <audio-duration>
```

## Testing Webhooks

Once webhooks are set up, test from command line:

```bash
# Test Polly Speech
curl -X POST https://automation.tampadynamics.com/webhook/polly-speak \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello! I am Kali, your robot assistant!", "voice": "Joanna"}'

# Test Learning Log
curl -X POST https://automation.tampadynamics.com/webhook/learning-log \
  -H "Content-Type: application/json" \
  -d '{"activity": "color_recognition", "success": true, "duration": 120}'
```

## Next Steps

1. SSH into Lightsail instance
2. Export existing n8n workflows (if any)
3. Create Polly speech workflow
4. Set up webhook endpoints
5. Test with Kali robot service

## Troubleshooting

### Can't connect via SSH
- Verify security group allows SSH (port 22) from your IP
- Check key file permissions: `chmod 400 ~/.ssh/your-key.pem`
- Verify username is `ubuntu` or `bitnami` depending on instance type

### n8n not responding
```bash
# Check if running
pm2 list

# Check logs
pm2 logs n8n

# Restart
pm2 restart n8n
```

### Webhook not working
- Check n8n workflow is active (not paused)
- Verify webhook URL is correct
- Check n8n logs for errors
- Test webhook trigger manually in n8n UI