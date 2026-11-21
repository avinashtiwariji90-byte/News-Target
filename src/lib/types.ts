export type UserRole = 'ADMIN' | 'REPORTER' | 'EDITOR';

export type ArticleStatus = 
  | 'DRAFT' 
  | 'PENDING_REVIEW' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'PUBLISHED' 
  | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bureau: string;
  avatar: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  order: number;
  isVisible: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  titleHi?: string;
  summaryHi?: string;
  contentHi?: string;
  categoryId: string;
  categoryName: string;
  coverImage: string;
  caption?: string;
  videoUrl?: string;
  gallery?: string[];
  videos?: string[];
  authorId: string;
  authorName: string;
  authorRole: UserRole | 'AI_SYSTEM';
  status: ArticleStatus;
  isAiGenerated: boolean;
  state?: string;
  division?: string;

  aiConfidenceScore?: number;
  factCheckNotes?: string;
  conflictingFlags?: string[];
  sourceUrl?: string;
  sourceName?: string;
  tags: string[];
  rejectionReason?: string;
  editorialNotes?: string;
  viewsCount: number;
  sharesCount: number;
  isBreaking: boolean;
  isFeatured: boolean;
  readingTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  reviewedBy?: string;
}

export interface BreakingNews {
  id: string;
  title: string;
  category: string;
  priority: 'HIGH' | 'URGENT' | 'FLASH';
  url?: string;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetId?: string;
  targetTitle?: string;
  details: string;
}

export interface ScheduledFeed {
  id: string;
  name: string;
  feedUrl: string;
  category: string;
  frequencyMinutes: number;
  lastFetchedAt: string;
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
  itemsProcessed: number;
}
