// Simple In-Memory Rate Limiter for Login Protection
// Tracks failed login attempts per key (e.g. client IP or identifier)

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const loginAttemptsMap = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5; // Max 5 failed attempts
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window

export function checkRateLimit(key: string): { allowed: boolean; remainingAttempts: number; retryAfterSeconds: number } {
  const now = Date.now();
  const record = loginAttemptsMap.get(key);

  if (!record || now > record.resetTime) {
    // Reset window
    loginAttemptsMap.set(key, { count: 0, resetTime: now + WINDOW_MS });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS, retryAfterSeconds: 0 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - record.count, retryAfterSeconds: 0 };
}

export function recordFailedAttempt(key: string) {
  const now = Date.now();
  const record = loginAttemptsMap.get(key);

  if (!record || now > record.resetTime) {
    loginAttemptsMap.set(key, { count: 1, resetTime: now + WINDOW_MS });
  } else {
    record.count += 1;
  }
}

export function resetRateLimit(key: string) {
  loginAttemptsMap.delete(key);
}
