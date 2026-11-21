import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { addSecurityHeaders } from '@/lib/security';

export async function GET(request: Request) {
  try {
    const user = getAuthenticatedUser(request);
    const isAdminOrStaff = user && (user.role === 'ADMIN' || user.role === 'EDITOR');

    const all = db.getArticles();
    const published = all.filter(a => a.status === 'PUBLISHED');

    const totalViews = published.reduce((sum, a) => sum + (a.viewsCount || 0), 0);
    const totalShares = published.reduce((sum, a) => sum + (a.sharesCount || 0), 0);

    const categories = db.getCategories();
    const categoryStats = categories.map(cat => ({
      name: cat.name,
      slug: cat.slug,
      count: published.filter(a => a.categoryId === cat.id || a.categoryName.toLowerCase() === cat.name.toLowerCase()).length
    }));

    // Public metrics (safe for public dashboards)
    const publicStats = {
      totalPublishedArticles: published.length,
      totalViews,
      totalShares,
      categoryStats,
      topTrending: [...published].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 5)
    };

    // If authenticated admin/staff, enrich with internal workflow metrics
    if (isAdminOrStaff) {
      const pendingReview = all.filter(a => a.status === 'PENDING_REVIEW');
      const aiDrafts = pendingReview.filter(a => a.isAiGenerated);
      const humanPending = pendingReview.filter(a => !a.isAiGenerated);
      const drafts = all.filter(a => a.status === 'DRAFT');
      const rejected = all.filter(a => a.status === 'REJECTED');

      return addSecurityHeaders(
        NextResponse.json({
          success: true,
          stats: {
            ...publicStats,
            totalArticles: all.length,
            publishedCount: published.length,
            pendingReviewCount: pendingReview.length,
            aiDraftsCount: aiDrafts.length,
            humanPendingCount: humanPending.length,
            draftsCount: drafts.length,
            rejectedCount: rejected.length,
            activeReportersCount: db.getUsers().filter(u => u.role === 'REPORTER' && u.isActive).length
          }
        })
      );
    }

    return addSecurityHeaders(
      NextResponse.json({
        success: true,
        stats: publicStats
      })
    );
  } catch (error: any) {
    return addSecurityHeaders(
      NextResponse.json({ success: false, error: 'Internal stats error' }, { status: 500 })
    );
  }
}
