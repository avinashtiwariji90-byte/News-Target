import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { addSecurityHeaders, stripHtmlTags } from '@/lib/security';

export async function GET() {
  try {
    const categories = db.getCategories();
    return addSecurityHeaders(NextResponse.json({ success: true, categories }));
  } catch (error: any) {
    return addSecurityHeaders(NextResponse.json({ success: false, error: 'Internal categories error' }, { status: 500 }));
  }
}

export async function POST(request: Request) {
  try {
    // STRICT ACCESS CONTROL: Only ADMIN can modify news categories
    const authResult = requireAuth(request, ['ADMIN']);
    if (!authResult.user) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status || 401 })
      );
    }

    const body = await request.json().catch(() => ({}));
    if (!body.id) {
      return addSecurityHeaders(NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 }));
    }

    const sanitizedId = stripHtmlTags(body.id, 50);
    const sanitizedUpdates: Record<string, any> = {};
    if (body.name) sanitizedUpdates.name = stripHtmlTags(body.name, 100);
    if (body.description) sanitizedUpdates.description = stripHtmlTags(body.description, 300);
    if (body.color) sanitizedUpdates.color = stripHtmlTags(body.color, 30);
    if (body.isVisible !== undefined) sanitizedUpdates.isVisible = Boolean(body.isVisible);

    const updated = db.updateCategory(sanitizedId, sanitizedUpdates);
    return addSecurityHeaders(NextResponse.json({ success: !!updated, category: updated }));
  } catch (error: any) {
    return addSecurityHeaders(NextResponse.json({ success: false, error: 'Internal category update error' }, { status: 500 }));
  }
}
