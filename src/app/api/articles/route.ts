import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ArticleStatus } from '@/lib/types';
import { getAuthenticatedUser, requireAuth } from '@/lib/auth';
import { 
  stripHtmlTags, 
  sanitizeString, 
  isValidSafeUrl, 
  validateMediaDataUrl,
  checkRateLimit, 
  getClientIp, 
  addSecurityHeaders 
} from '@/lib/security';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedStatus = searchParams.get('status') as ArticleStatus | 'ALL' | null;
    const category = searchParams.get('category') || undefined;
    const isAi = searchParams.get('isAi');
    const search = stripHtmlTags(searchParams.get('search') || undefined);
    const authorId = searchParams.get('authorId') || undefined;

    const user = getAuthenticatedUser(request);

    // SECURITY CHECK: Unauthenticated users are STRICTLY RESTRICTED to PUBLISHED articles only.
    let effectiveStatus: ArticleStatus | undefined = 'PUBLISHED';

    if (requestedStatus) {
      if (requestedStatus === 'PUBLISHED') {
        effectiveStatus = 'PUBLISHED';
      } else {
        // Internal status inspection requires authenticated ADMIN, EDITOR, or REPORTER
        if (!user) {
          return addSecurityHeaders(
            NextResponse.json(
              { success: false, error: 'Unauthorized to view unpublished editorial queues.' }, 
              { status: 401 }
            )
          );
        }

        if (requestedStatus === 'ALL') {
          effectiveStatus = undefined; // All for authenticated staff
        } else {
          effectiveStatus = requestedStatus;
        }
      }
    }

    const articles = db.getArticles({
      status: effectiveStatus,
      categoryId: category,
      isAiGenerated: isAi !== null ? isAi === 'true' : undefined,
      search,
      authorId
    });

    return addSecurityHeaders(
      NextResponse.json({ success: true, count: articles.length, articles })
    );
  } catch (error: any) {
    return addSecurityHeaders(
      NextResponse.json({ success: false, error: 'Failed to retrieve articles' }, { status: 500 })
    );
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate Limiting: Max 25 article submissions per 15 minutes per IP
    const rateCheck = checkRateLimit(`submit_${ip}`, 25, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return addSecurityHeaders(
        NextResponse.json(
          { success: false, error: 'Submission rate limit reached. Please wait before submitting more articles.' },
          { status: 429 }
        )
      );
    }

    // AUTHENTICATION CHECK: Only authenticated Staff (REPORTER, EDITOR, ADMIN) can create articles
    const authResult = requireAuth(request);
    if (!authResult.user) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status || 401 })
      );
    }

    const user = authResult.user;
    const body = await request.json().catch(() => ({}));

    // Mandatory Field Validation
    const title = stripHtmlTags(body.title || '', 300);
    const content = sanitizeString(body.content || '', 50000);
    const summary = stripHtmlTags(body.summary || title, 600);

    if (!title || title.length < 5) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: 'Valid headline is required (min 5 characters).' }, { status: 400 })
      );
    }

    if (!content || content.length < 10) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: 'Valid article content is required.' }, { status: 400 })
      );
    }

    // URL & Protocol Validation
    if (body.sourceUrl && !isValidSafeUrl(body.sourceUrl)) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: 'Invalid or unsafe source URL protocol.' }, { status: 400 })
      );
    }

    // Media Size & Format Validation
    if (body.coverImage) {
      const coverCheck = validateMediaDataUrl(body.coverImage, 'image');
      if (!coverCheck.valid) {
        return addSecurityHeaders(NextResponse.json({ success: false, error: coverCheck.error }, { status: 400 }));
      }
    }

    if (body.gallery && Array.isArray(body.gallery)) {
      for (const img of body.gallery.slice(0, 10)) {
        const check = validateMediaDataUrl(img, 'image');
        if (!check.valid) {
          return addSecurityHeaders(NextResponse.json({ success: false, error: `Gallery image: ${check.error}` }, { status: 400 }));
        }
      }
    }

    if (body.videoUrl) {
      const vidCheck = validateMediaDataUrl(body.videoUrl, 'video');
      if (!vidCheck.valid) {
        return addSecurityHeaders(NextResponse.json({ success: false, error: vidCheck.error }, { status: 400 }));
      }
    }

    // PRIVILEGE ESCALATION PREVENTION & ROLE ENFORCEMENT
    // A reporter can NEVER publish directly or mark as featured/breaking.
    let status: ArticleStatus = 'PENDING_REVIEW';
    let isFeatured = false;
    let isBreaking = false;

    if (user.role === 'ADMIN' || user.role === 'EDITOR') {
      if (body.status === 'PUBLISHED') status = 'PUBLISHED';
      else if (body.status === 'DRAFT') status = 'DRAFT';
      else if (body.status === 'REJECTED') status = 'REJECTED';
      isFeatured = Boolean(body.isFeatured);
      isBreaking = Boolean(body.isBreaking);
    }

    const sanitizedCategory = stripHtmlTags(body.categoryName || 'Madhya Pradesh', 50);
    const sanitizedCaption = stripHtmlTags(body.caption || '', 200);
    const sanitizedAuthor = stripHtmlTags(body.authorName || user.name, 100);

    const newArticle = db.createArticle({
      title,
      summary,
      content,
      categoryId: body.categoryId || 'cat-mp',
      categoryName: sanitizedCategory,
      coverImage: body.coverImage || '',
      caption: sanitizedCaption,
      gallery: Array.isArray(body.gallery) ? body.gallery.slice(0, 10) : [],
      videos: Array.isArray(body.videos) ? body.videos.slice(0, 5) : (body.videoUrl ? [body.videoUrl] : []),
      videoUrl: body.videoUrl || undefined,
      authorId: user.userId,
      authorName: sanitizedAuthor,
      authorRole: user.role,
      status,
      isAiGenerated: false,
      sourceUrl: body.sourceUrl ? body.sourceUrl.trim() : undefined,
      sourceName: stripHtmlTags(body.sourceName || '', 100) || undefined,
      tags: Array.isArray(body.tags) ? body.tags.map((t: string) => stripHtmlTags(t, 40)).filter(Boolean) : ['News'],
      isBreaking,
      isFeatured
    }, { name: user.name, role: user.role });

    return addSecurityHeaders(
      NextResponse.json({ success: true, article: newArticle }, { status: 201 })
    );
  } catch (error: any) {
    return addSecurityHeaders(
      NextResponse.json({ success: false, error: 'Internal submission processing error' }, { status: 500 })
    );
  }
}
