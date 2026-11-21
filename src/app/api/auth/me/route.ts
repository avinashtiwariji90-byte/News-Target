import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: Request) {
  const user = getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      bureau: user.bureau
    }
  });
}

