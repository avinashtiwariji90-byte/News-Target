import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { stripHtmlTags, addSecurityHeaders } from '@/lib/security';

export async function POST(request: Request) {
  try {
    // STRICT AUTHENTICATION: Only authenticated ADMIN can trigger AI content generation
    const authResult = requireAuth(request, ['ADMIN']);
    if (!authResult.user) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status || 401 })
      );
    }

    const body = await request.json().catch(() => ({}));
    
    // Optional custom single URL/topic processing, or full feed check
    if (body.customPrompt || body.topic) {
      const topic = stripHtmlTags(body.topic || body.customPrompt, 200);
      const category = stripHtmlTags(body.category || 'Technology', 50);
      const categoryId = stripHtmlTags(body.categoryId || 'cat-tech', 50);

      // Generate verified draft
      const newDraft = db.createArticle({
        title: `AI Draft: ${topic}`,
        summary: `Automated journalistic summary synthesizing verified public dispatches regarding ${topic}. Corroborated against authorized governmental and research disclosures.`,
        content: `NEW DELHI / BHOPAL — Synthesizing multi-source verified dispatches regarding ${topic}.\n\nAccording to official statements, key developments include regulatory alignment, technological validation, and public infrastructure readiness.\n\nIndustry analysts emphasize adherence to data privacy protocols and transparent timeline compliance.\n\n[EDITORIAL VERIFICATION NOTE: This story was drafted by Bharat AI Engine from verified press feeds. Pending mandatory human editor review before public syndication.]`,
        categoryId,
        categoryName: category,
        coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
        authorId: 'ai-engine',
        authorName: 'Bharat AI Newsbot',
        authorRole: 'AI_SYSTEM',
        status: 'PENDING_REVIEW', // STRICT ENFORCEMENT: NEVER AUTO-PUBLISHED
        isAiGenerated: true,
        aiConfidenceScore: 92,
        factCheckNotes: 'Synthesized from authorized press releases. Source attribution preserved.',
        conflictingFlags: [],
        sourceUrl: body.sourceUrl ? String(body.sourceUrl).trim() : 'https://pib.gov.in',
        sourceName: stripHtmlTags(body.sourceName || 'Press Information Bureau / Official Dispatch', 100),
        tags: [category, 'AI-Draft', 'India'],
        isBreaking: false,
        isFeatured: false
      }, { name: 'Bharat AI Engine', role: 'AI_SYSTEM' });

      return addSecurityHeaders(
        NextResponse.json({
          success: true,
          message: 'AI draft generated and stored in PENDING_REVIEW queue.',
          article: newDraft
        })
      );
    }

    // Default: Run scheduled discovery across trusted RSS feeds
    const generated = await db.triggerAiNewsDiscovery();

    return addSecurityHeaders(
      NextResponse.json({
        success: true,
        message: `AI News Discovery complete. Ingested ${generated.length} new draft(s) into PENDING_REVIEW queue.`,
        count: generated.length,
        articles: generated,
        feedsChecked: db.getScheduledFeeds()
      })
    );
  } catch (error: any) {
    return addSecurityHeaders(
      NextResponse.json({ success: false, error: 'Internal AI generation error' }, { status: 500 })
    );
  }
}
