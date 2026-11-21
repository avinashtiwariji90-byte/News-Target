import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { addSecurityHeaders } from '@/lib/security';

export async function GET(request: Request) {
  try {
    // STRICT ACCESS CONTROL: Audit logs are accessible ONLY to verified ADMIN accounts
    const authResult = requireAuth(request, ['ADMIN']);
    if (!authResult.user) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status || 401 })
      );
    }

    const logs = db.getAuditLogs();
    return addSecurityHeaders(
      NextResponse.json({ success: true, count: logs.length, logs })
    );
  } catch (error: any) {
    return addSecurityHeaders(
      NextResponse.json({ success: false, error: 'Internal audit retrieval error' }, { status: 500 })
    );
  }
}
