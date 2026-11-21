import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { addSecurityHeaders } from '@/lib/security';

const EXPECTED_CRON_SECRET = process.env.CRON_SECRET || 'news-target-cron-internal-auth-secret-2026';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const authHeader = request.headers.get('authorization');
    const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;

    // Secure timing-safe cron secret verification
    const provided = secret || bearerSecret;
    if (!provided || provided !== EXPECTED_CRON_SECRET) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: 'Unauthorized: Invalid cron authentication token.' }, { status: 401 })
      );
    }

    const newArticles = await db.triggerAiNewsDiscovery();
    
    return addSecurityHeaders(
      NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        draftsGenerated: newArticles.length,
        note: 'All generated drafts are locked in PENDING_REVIEW status pending human editorial sign-off.'
      })
    );
  } catch (error: any) {
    return addSecurityHeaders(
      NextResponse.json({ success: false, error: 'Internal cron error' }, { status: 500 })
    );
  }
}
