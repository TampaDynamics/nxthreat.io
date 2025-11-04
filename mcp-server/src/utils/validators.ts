/**
 * Validators
 *
 * Security validation functions for cyber mode
 */

/**
 * Target validation result
 */
export interface ValidationResult {
  isValid: boolean;
  reason: string;
}

/**
 * Private IP ranges (RFC 1918)
 */
const PRIVATE_IP_RANGES = [
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^127\./,
  /^localhost$/i,
];

/**
 * Validate target for scanning
 */
export async function validateTarget(target: string): Promise<ValidationResult> {
  // Check if target is localhost
  if (target === 'localhost' || target === '127.0.0.1' || target === '::1') {
    if (process.env.ALLOW_LOCALHOST_SCANS === 'true') {
      return {
        isValid: true,
        reason: 'Localhost scanning explicitly enabled',
      };
    }
    return {
      isValid: false,
      reason: 'Localhost scanning not allowed',
    };
  }

  // Check if target is in private IP range
  const isPrivateIP = PRIVATE_IP_RANGES.some(range => range.test(target));
  if (isPrivateIP && process.env.ALLOW_PRIVATE_RANGES !== 'true') {
    return {
      isValid: false,
      reason: 'Private IP range scanning requires explicit authorization',
    };
  }

  // Check whitelist (if configured)
  const whitelist = process.env.TARGET_WHITELIST?.split(',') || [];
  if (whitelist.length > 0) {
    const isWhitelisted = whitelist.some(pattern => {
      // Support wildcards
      const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
      return regex.test(target);
    });

    if (!isWhitelisted) {
      return {
        isValid: false,
        reason: 'Target not in whitelist',
      };
    }
  }

  // Check blacklist
  const blacklist = process.env.TARGET_BLACKLIST?.split(',') || [];
  const isBlacklisted = blacklist.some(pattern => {
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    return regex.test(target);
  });

  if (isBlacklisted) {
    return {
      isValid: false,
      reason: 'Target is blacklisted',
    };
  }

  // All checks passed
  return {
    isValid: true,
    reason: 'Target authorized for scanning',
  };
}

/**
 * Validate command for execution
 */
export function validateCommand(command: string, allowedCommands: string[]): ValidationResult {
  const commandName = command.split(' ')[0];

  if (!allowedCommands.includes(commandName)) {
    return {
      isValid: false,
      reason: `Command "${commandName}" not in allowed list`,
    };
  }

  // Check for command injection attempts
  const dangerousPatterns = [
    /;/,     // Command chaining
    /\|/,    // Pipes
    /`/,     // Command substitution
    /\$\(/,  // Command substitution
    /&&/,    // AND operator
    /\|\|/,  // OR operator
  ];

  const hasDangerousPattern = dangerousPatterns.some(pattern => pattern.test(command));
  if (hasDangerousPattern) {
    return {
      isValid: false,
      reason: 'Command contains potentially dangerous patterns',
    };
  }

  return {
    isValid: true,
    reason: 'Command validated',
  };
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/[;&|`$()]/g, '')
    .trim();
}
