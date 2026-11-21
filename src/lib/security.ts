// Core Security Utilities: Input Sanitization, URL Validation, Rate Limiting, File Validation
import { NextResponse } from 'next/server';

// 1. SAFE URL VALIDATION (Mitigates XSS via javascript: or data:text/html)
export function isValidSafeUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return true; // empty is allowed where optional
  const trimmed = url.trim();
  if (trimmed === '') return true;

  // Disallow javascript:, vbscript:, and dangerous data URI schemes
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:') || lower.startsWith('data:text/html')) {
    return false;
  }

  // Allow standard web URLs
  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  }

  // Allow safe image/video data URIs
  if (lower.startsWith('data:image/') || lower.startsWith('data:video/')) {
    return true;
  }

  // Allow relative paths starting with /
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true;
  }

  return false;
}

// 2. TEXT SANITIZATION (Mitigates Stored & Reflected XSS)
export function sanitizeString(input?: string | null, maxLength = 10000): string {
  if (!input || typeof input !== 'string') return '';
  
  // Truncate to maximum reasonable length to prevent denial-of-service
  const truncated = input.slice(0, maxLength);

  // Strip script and iframe tags and malicious attributes
  const sanitized = truncated
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // remove onclick, onload, onerror, etc.
    .replace(/javascript:/gi, '');

  return sanitized.trim();
}

// Strip all HTML tags completely for plain text fields like titles, summaries, tags
export function stripHtmlTags(input?: string | null, maxLength = 1000): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .slice(0, maxLength)
    .replace(/<[^>]*>?/gm, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/javascript:/gi, '')
    .trim();
}

// 3. FILE UPLOAD & PAYLOAD VALIDATION
// Maximum allowed image base64 size: ~7MB (approx 5MB binary)
export const MAX_IMAGE_BASE64_SIZE = 7 * 1024 * 1024;
// Maximum allowed video base64 size: ~28MB (approx 20MB binary)
export const MAX_VIDEO_BASE64_SIZE = 28 * 1024 * 1024;

export function validateMediaDataUrl(dataUrl: string, type: 'image' | 'video'): { valid: boolean; error?: string } {
  if (!dataUrl || typeof dataUrl !== 'string') return { valid: true };

  // If it's a web URL, check safe protocol
  if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
    return { valid: isValidSafeUrl(dataUrl), error: isValidSafeUrl(dataUrl) ? undefined : 'Invalid or unsafe URL protocol' };
  }

  // If it's a base64 Data URL, validate size and mime type
  if (dataUrl.startsWith('data:')) {
    const maxSize = type === 'image' ? MAX_IMAGE_BASE64_SIZE : MAX_VIDEO_BASE64_SIZE;
    if (dataUrl.length > maxSize) {
      return { 
        valid: false, 
        error: `File size exceeds maximum permitted limit (${type === 'image' ? '5MB' : '20MB'}).` 
      };
    }

    if (type === 'image') {
      const allowedImageMimes = [
        'data:image/jpeg',
        'data:image/png',
        'data:image/webp',
        'data:image/gif',
        'data:image/svg+xml'
      ];
      const match = allowedImageMimes.some(mime => dataUrl.startsWith(mime));
      if (!match) {
        return { valid: false, error: 'Invalid image format. Allowed: JPG, PNG, WEBP, GIF.' };
      }
    } else if (type === 'video') {
      const allowedVideoMimes = [
        'data:video/mp4',
        'data:video/webm',
        'data:video/ogg'
      ];
      const match = allowedVideoMimes.some(mime => dataUrl.startsWith(mime));
      if (!match) {
        return { valid: false, error: 'Invalid video format. Allowed: MP4, WEBP, OGG.' };
      }
    }
  }

  return { valid: true };
}

// 4. IN-MEMORY SLIDING WINDOW RATE LIMITER
// Protects against brute-force login attempts and denial-of-service spam
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

export function checkRateLimit(
  identifier: string, 
  maxRequests: number, 
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs
    });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}

// Extract client IP address safely
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

// Standard security headers helper for API responses
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

