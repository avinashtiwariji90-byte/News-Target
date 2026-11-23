// Comprehensive Authentication & Role-Based Authorization Engine
import crypto from 'crypto';
import { User, UserRole } from './types';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'news-target-super-secure-production-secret-key-2026!@#$';
const SESSION_COOKIE_NAME = 'nt_session_token';

// 1. SECURE PASSWORD HASHING (PBKDF2 with unique salts & 100,000 iterations)
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const checkHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(checkHash, 'hex'));
  } catch {
    return false;
  }
}

// 2. IN-MEMORY USER CREDENTIAL STORE WITH PRE-SEEDED ENCRYPTED HASHES
interface StoredUserCredentials {
  email: string;
  hash: string;
  salt: string;
}

// Pre-compute secure hashes for initial authorized accounts
const defaultAdminPass = process.env.ADMIN_PASSWORD || 'Admin@NewsTarget2026!';
const defaultReporterPass = process.env.REPORTER_PASSWORD || 'Reporter@NewsTarget2026!';

const userCredentialStore = new Map<string, StoredUserCredentials>();

function initUserCredentials() {
  if (userCredentialStore.size > 0) return;

  const adminCred = hashPassword(defaultAdminPass);
  userCredentialStore.set('admin@bharatbulletin.in', {
    email: 'admin@bharatbulletin.in',
    hash: adminCred.hash,
    salt: adminCred.salt
  });

  const reporterCred = hashPassword(defaultReporterPass);
  userCredentialStore.set('reporter@bharatbulletin.in', {
    email: 'reporter@bharatbulletin.in',
    hash: reporterCred.hash,
    salt: reporterCred.salt
  });

  const vikramCred = hashPassword(defaultReporterPass);
  userCredentialStore.set('vikram@bharatbulletin.in', {
    email: 'vikram@bharatbulletin.in',
    hash: vikramCred.hash,
    salt: vikramCred.salt
  });
}

initUserCredentials();

// 3. CRYPTOGRAPHIC SESSION TOKEN CREATION & VERIFICATION
export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  bureau: string;
  iat: number;
  exp: number; // 7 days expiration
}

export function createSessionToken(user: User): string {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    bureau: user.bureau,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };

  const headerStr = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerStr}.${payloadStr}`)
    .digest('base64url');

  return `${headerStr}.${payloadStr}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerStr, payloadStr, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${headerStr}.${payloadStr}`)
      .digest('base64url');

    // Timing-safe signature check against timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      return null; // Expired token
    }

    return payload;
  } catch {
    return null;
  }
}

// 4. USER AUTHENTICATION VALIDATION
export function authenticateUser(email: string, password: string): User | null {
  initUserCredentials();
  const normalizedEmail = email.trim().toLowerCase();
  const creds = userCredentialStore.get(normalizedEmail);
  if (!creds) return null;

  const valid = verifyPassword(password, creds.hash, creds.salt);
  if (!valid) return null;

  const user = db.getUsers().find(u => u.email.toLowerCase() === normalizedEmail && u.isActive);
  return user || null;
}

export function registerReporter(name: string, email: string, password: string, phone?: string): User {
  initUserCredentials();
  const normalizedEmail = email.trim().toLowerCase();
  let user = db.getUsers().find(u => u.email.toLowerCase() === normalizedEmail);
  
  if (!user) {
    user = db.createUser({
      id: `user-rep-${Date.now()}`,
      name: name.trim() || email.split('@')[0],
      email: normalizedEmail,
      role: 'REPORTER',
      bureau: phone ? `Bureau (${phone})` : 'News Target Field Bureau',
      phone: phone || ''
    });
  }

  const { hash, salt } = hashPassword(password);
  userCredentialStore.set(normalizedEmail, { email: normalizedEmail, hash, salt });

  return user;
}

// 5. EXTRACT AUTHENTICATED USER FROM REQUEST
export function getAuthenticatedUser(request: Request): SessionPayload | null {
  // Check Authorization Bearer Header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const session = verifySessionToken(token);
    if (session) return session;
  }

  // Check HTTP-only Cookie
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    const sessionCookie = cookies.find(c => c.startsWith(`${SESSION_COOKIE_NAME}=`));
    if (sessionCookie) {
      const token = sessionCookie.split('=')[1];
      const session = verifySessionToken(token);
      if (session) return session;
    }
  }

  return null;
}

// 6. ENFORCE ROLE-BASED ACCESS CONTROL (RBAC)
export function requireAuth(
  request: Request, 
  allowedRoles?: UserRole[]
): { user: SessionPayload | null; error?: string; status?: number } {
  const user = getAuthenticatedUser(request);

  if (!user) {
    return {
      user: null,
      error: 'Authentication required. Please sign in to access this resource.',
      status: 401
    };
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return {
        user,
        error: `Access denied. Requires one of [${allowedRoles.join(', ')}] role privileges.`,
        status: 403
      };
    }
  }

  return { user };
}

export { SESSION_COOKIE_NAME };

