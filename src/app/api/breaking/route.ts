import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { stripHtmlTags, isValidSafeUrl, addSecurityHeaders } from '@/lib/security';

export async function GET() {
  try {
    const breaking = db.getBreakingNews();
    return addSecurityHeaders(
      NextResponse.json({ success: true, count: breaking.length, items: breaking })
    );
  } catch (error: any) {
    return addSecurityHeaders(
      NextResponse.json({ success: false, error: 'Failed to retrieve breaking news' }, { status: 500 })
    );
  }
}

export async function POST(request: Request) {
  try {
    // SECURITY CHECK: Only ADMIN or EDITOR can publish breaking news alerts
    const authResult = requireAuth(request, ['ADMIN', 'EDITOR']);
    if (!authResult.user) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status || 401 })
      );
    }

    const body = await request.json().catch(() => ({}));
    const title = stripHtmlTags(body.title || '', 300);

    if (!title) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: 'Valid breaking headline is required' }, { status: 400 })
      );
    }

    if (body.url && !isValidSafeUrl(body.url)) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: 'Invalid or unsafe link URL protocol' }, { status: 400 })
      );
    }

    const priority = ['FLASH', 'URGENT', 'HIGH'].includes(body.priority) ? body.priority : 'HIGH';
    const category = stripHtmlTags(body.category || 'National', 50);

    const created = db.addBreakingNews({
      title,
      category,
      priority,
      url: body.url ? body.url.trim() : '',
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      expiresAt: body.expiresAt
    });

    return addSecurityHeaders(
      NextResponse.json({ success: true, item: created }, { status: 201 })
    );
  } catch (error: any) {
    return addSecurityHeaders(
      NextResponse.json({ success: false, error: 'Internal breaking news error' }, { status: 500 })
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // SECURITY CHECK: Only ADMIN or EDITOR can remove breaking news
    const authResult = requireAuth(request, ['ADMIN', 'EDITOR']);
    if (!authResult.user) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status || 401 })
      );
    }

    const { searchParams } = new URL(request.url);
    const id = stripHtmlTags(searchParams.get('id') || '', 100);
    if (!id) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: 'Valid breaking news ID is required' }, { status: 400 })
      );
    }

    const deleted = db.deleteBreakingNews(id);
    return addSecurityHeaders(NextResponse.json({ success: deleted }));
  } catch (error: any) {
    return addSecurityHeaders(
      NextResponse.json({ success: false, error: 'Internal deletion error' }, { status: 500 })
    );
  }
}
