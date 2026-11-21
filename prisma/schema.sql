-- =========================================================
-- BHARAT BULLETIN - AI-POWERED DIGITAL NEWS CHANNEL
-- PRODUCTION POSTGRESQL SCHEMA DDL
-- =========================================================

-- ENUMS
CREATE TYPE user_role AS ENUM ('ADMIN', 'REPORTER', 'EDITOR');
CREATE TYPE article_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'UNDER_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED');
CREATE TYPE breaking_priority AS ENUM ('FLASH', 'URGENT', 'HIGH', 'NORMAL');

-- 1. USERS & AUTHORIZATION
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'REPORTER' NOT NULL,
    bureau VARCHAR(150) DEFAULT 'National Desk',
    avatar TEXT,
    phone VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. NEWS CATEGORIES
CREATE TABLE categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(20) DEFAULT '#dc2626',
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. NEWS ARTICLES
CREATE TABLE articles (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    caption TEXT,
    
    category_id VARCHAR(64) REFERENCES categories(id) ON DELETE RESTRICT,
    author_id VARCHAR(64) REFERENCES users(id) ON DELETE RESTRICT,
    status article_status DEFAULT 'DRAFT' NOT NULL,
    
    -- AI Generation Flags & Safeguards
    is_ai_generated BOOLEAN DEFAULT FALSE NOT NULL,
    ai_confidence_score INT,
    fact_check_notes TEXT,
    conflicting_flags JSONB DEFAULT '[]'::jsonb,
    source_url TEXT,
    source_name VARCHAR(255),
    
    tags JSONB DEFAULT '[]'::jsonb,
    rejection_reason TEXT,
    editorial_notes TEXT,
    
    -- Metrics & Engagement
    views_count INT DEFAULT 0 NOT NULL,
    shares_count INT DEFAULT 0 NOT NULL,
    is_breaking BOOLEAN DEFAULT FALSE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    reading_time_minutes INT DEFAULT 3 NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    reviewed_by VARCHAR(255)
);

CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_is_breaking ON articles(is_breaking);
CREATE INDEX idx_articles_is_ai ON articles(is_ai_generated);

-- 4. ARTICLE REVISIONS
CREATE TABLE article_revisions (
    id VARCHAR(64) PRIMARY KEY,
    article_id VARCHAR(64) REFERENCES articles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    edited_by_id VARCHAR(64) REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. EDITORIAL APPROVAL & REJECTION HISTORY
CREATE TABLE approval_history (
    id VARCHAR(64) PRIMARY KEY,
    article_id VARCHAR(64) REFERENCES articles(id) ON DELETE CASCADE,
    reviewer_id VARCHAR(64) REFERENCES users(id),
    previous_status article_status NOT NULL,
    new_status article_status NOT NULL,
    comments TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. AI GENERATION LOGS
CREATE TABLE ai_generation_logs (
    id VARCHAR(64) PRIMARY KEY,
    article_id VARCHAR(64) REFERENCES articles(id) ON DELETE SET NULL,
    feed_url TEXT NOT NULL,
    raw_headline TEXT NOT NULL,
    confidence_score INT,
    has_flags BOOLEAN DEFAULT FALSE,
    flag_details TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. BREAKING NEWS BULLETINS
CREATE TABLE breaking_news (
    id VARCHAR(64) PRIMARY KEY,
    title TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'National',
    priority breaking_priority DEFAULT 'HIGH' NOT NULL,
    url TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 8. SCHEDULED RSS & API FEEDS
CREATE TABLE scheduled_feeds (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    feed_url TEXT UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    frequency_minutes INT DEFAULT 15 NOT NULL,
    last_fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL,
    items_processed INT DEFAULT 0 NOT NULL
);

-- 9. AUDIT LOGS
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_id VARCHAR(64),
    target_title TEXT,
    details TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
