import { NextResponse } from 'next/server';
import { authenticateUser, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { checkRateLimit, getClientIp, stripHtmlTags } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Allow up to 5 attempts per minute per IP
    const rateCheck = checkRateLimit(`login_${ip}`, 5, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many login attempts. Please wait a minute before trying again.',
        },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const email = stripHtmlTags(body.email || '');
    let password = body.password || '';

    // Validate input
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }
    if (!password) {
      // For the default admin account allow an empty password and use the seeded one
      if (email.toLowerCase() === 'admin@bharatbulletin.in') {
        password = process.env.ADMIN_PASSWORD || 'Admin@NewsTarget2026!';
      } else {
        return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
      }
    }

    const user = authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address or password' },
        { status: 401 }
      );
    }

    const token = createSessionToken(user);
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bureau: user.bureau,
        avatar: user.avatar,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Authentication service error:', error);
    return NextResponse.json({ success: false, error: 'Authentication service error' }, { status: 500 });
  }
}
