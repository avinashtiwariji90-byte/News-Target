import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedUser, requireAuth } from '@/lib/auth';
import { 
  stripHtmlTags, 
  sanitizeString, 
  isValidSafeUrl, 
  validateMediaDataUrl,
  addSecurityHeaders 
} from '@/lib/security';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sanitizedId = stripHtmlTags(id, 100);
    const article = db.getArticleBySlug(sanitizedId) || db.getArticleById(sanitizedId);

    if (!article) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
      );
    }

    // ACCESS CONTROL CHECK FOR UNPUBLISHED ARTICLES
    if (article.status !== 'PUBLISHED') {
      const user = getAuthenticatedUser(request);
      if (!user) {
        return addSecurityHeaders(
          NextResponse.json({ success: false, error: 'Article not found or pending verification.' }, { status: 404 })
        );
      }

      // Only Admin, Editor, or the article author can view unapproved articles
      const isPrivileged = user.role === 'ADMIN' || user.role === 'EDITOR';
      const isAuthor = user.userId === article.authorId;

      if (!isPrivileged && !isAuthor) {
        return addSecurityHeaders(
          NextResponse.json({ success: false, error: 'Unauthorized to view this draft.' }, { status: 403 })
        );
      }
    }

    // Increment view count on legitimate read
    db.incrementViews(article.id);

    return addSecurityHeaders(NextResponse.json({ success: true, article }));
  } catch (error: any) {
    return addSecurityHeaders(
      NextResponse.json({ success: false, error: 'Internal retrieval error' }, { status: 500 })
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sanitizedId = stripHtmlTags(id, 100);
    const existing = db.getArticleById(sanitizedId) || db.getArticleBySlug(sanitizedId);

    if (!existing) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
      );
    }

    // AUTHENTICATION CHECK
    const authResult = requireAuth(request);
    if (!authResult.user) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status || 401 })
      );
    }

    const user = authResult.user;
    const body = await request.json().catch(() => ({}));

    // AUTHORIZATION / PERMISSION BOUNDARY CHECK
    const isAdminOrEditor = user.role === 'ADMIN' || user.role === 'EDITOR';
    const isAuthor = user.userId === existing.authorId;

    if (!isAdminOrEditor && !isAuthor) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: 'Access denied: You cannot edit another reporter’s article.' }, { status: 403 })
      );
    }

    // Reporters cannot modify already published articles without admin intervention
    if (!isAdminOrEditor && existing.status === 'PUBLISHED') {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: 'Published stories can only be modified by an Editor or Administrator.' }, { status: 403 })
      );
    }

    // Sanitize and validate inputs
    const updates: Record<string, any> = {};

    if (body.title !== undefined) updates.title = stripHtmlTags(body.title, 300);
    if (body.summary !== undefined) updates.summary = stripHtmlTags(body.summary, 600);
    if (body.content !== undefined) updates.content = sanitizeString(body.content, 50000);
    if (body.caption !== undefined) updates.caption = stripHtmlTags(body.caption, 200);
    if (body.authorName !== undefined) updates.authorName = stripHtmlTags(body.authorName, 100);

    // URL & Media validation
    if (body.coverImage !== undefined) {
      const check = validateMediaDataUrl(body.coverImage, 'image');
      if (!check.valid) {
        return addSecurityHeaders(NextResponse.json({ success: false, error: check.error }, { status: 400 }));
      }
      updates.coverImage = body.coverImage;
    }

    if (body.gallery && Array.isArray(body.gallery)) {
      for (const img of body.gallery.slice(0, 10)) {
        const check = validateMediaDataUrl(img, 'image');
        if (!check.valid) {
          return addSecurityHeaders(NextResponse.json({ success: false, error: `Gallery image: ${check.error}` }, { status: 400 }));
        }
      }
      updates.gallery = body.gallery.slice(0, 10);
    }

    if (body.videos && Array.isArray(body.videos)) {
      for (const vid of body.videos.slice(0, 5)) {
        const check = validateMediaDataUrl(vid, 'video');
        if (!check.valid) {
          return addSecurityHeaders(NextResponse.json({ success: false, error: `Video: ${check.error}` }, { status: 400 }));
        }
      }
      updates.videos = body.videos.slice(0, 5);
      updates.videoUrl = body.videos[0] || undefined;
    }

    if (body.videoUrl !== undefined) {
      const check = validateMediaDataUrl(body.videoUrl, 'video');
      if (!check.valid) {
        return addSecurityHeaders(NextResponse.json({ success: false, error: check.error }, { status: 400 }));
      }
      updates.videoUrl = body.videoUrl;
    }

    if (body.sourceUrl !== undefined) {
      if (!isValidSafeUrl(body.sourceUrl)) {
        return addSecurityHeaders(NextResponse.json({ success: false, error: 'Invalid source URL protocol' }, { status: 400 }));
      }
      updates.sourceUrl = body.sourceUrl;
    }

    // PRIVILEGE CHECKS FOR STATUS & FEATURED PROMOTIONS
    if (body.status !== undefined) {
      if (!isAdminOrEditor) {
        // Reporters cannot approve or unpublish
        return addSecurityHeaders(
          NextResponse.json({ success: false, error: 'Only Editors and Administrators can approve or change story status.' }, { status: 403 })
        );
      }
      updates.status = body.status;
      if (body.status === 'PUBLISHED') {
        updates.publishedAt = new Date().toISOString();
        updates.reviewedBy = user.name;
      }
    }

    if (body.isFeatured !== undefined) {
      if (!isAdminOrEditor) {
        return addSecurityHeaders(
          NextResponse.json({ success: false, error: 'Only Administrators can set top featured stories.' }, { status: 403 })
        );
      }
      updates.isFeatured = Boolean(body.isFeatured);
    }

    if (body.rejectionReason !== undefined && isAdminOrEditor) {
      updates.rejectionReason = stripHtmlTags(body.rejectionReason, 500);
    }

    const updated = db.updateArticle(existing.id, updates, { name: user.name, role: user.role });

    return addSecurityHeaders(NextResponse.json({ success: true, article: updated }));
  } catch (error: any) {
    return addSecurityHeaders(
      NextResponse.json({ success: false, error: 'Internal update processing error' }, { status: 500 })
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sanitizedId = stripHtmlTags(id, 100);

    // STRICT ROLE CHECK: Only ADMIN can delete articles
    const authResult = requireAuth(request, ['ADMIN']);
    if (!authResult.user) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status || 401 })
      );
    }

    const user = authResult.user;
    const existing = db.getArticleById(sanitizedId) || db.getArticleBySlug(sanitizedId);
    if (!existing) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
      );
    }

    const success = db.deleteArticle(existing.id, { name: user.name, role: user.role });

    return addSecurityHeaders(
      NextResponse.json({ success: true, message: 'Article permanently deleted' })
    );
  } catch (error: any) {
    return addSecurityHeaders(
      NextResponse.json({ success: false, error: 'Internal deletion error' }, { status: 500 })
    );
  }
}
