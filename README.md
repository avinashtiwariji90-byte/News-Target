# 🇮🇳 Bharat Bulletin (भारत बुलेटिन)
### AI-Assisted, Human-Verified Digital News Media Network

**Bharat Bulletin** is a production-oriented digital news portal engineered with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and a **PostgreSQL-compatible Prisma data tier**. It delivers verified coverage across **Madhya Pradesh**, **Bhopal**, **National Politics**, **Sovereign AI & Deep Tech**, and **Global Affairs**.

---

## 🌟 Key Architecture & Highlights

### 1. Public News Portal (`/`)
- **Branding & Identity**: Dual-language Hindi-English channel identity, live broadcast radar pulse.
- **Top Utility Bar**: Real-time IST clock, live Sensex/Nifty financial index ticker, local bureau weather widget (Bhopal & Delhi).
- **Breaking News Flash Ticker**: Red beacon alerts with manual step navigation and pause-on-hover.
- **Hero Editorial Spotlight**: High-impact lead story with badges, reading time, author byline, and side spotlight stories.
- **Dedicated Regional Desks**:
  - *Madhya Pradesh & Bhopal State Bureau* (Bhopal Metro, Upper Lake Bhojtal conservation, Smart City).
  - *Frontier AI & Deep Tech India* (BharatGen compute grid, semiconductors, robotics).
- **Interactive Reading Suite**:
  - **Audio Speech Player**: Built-in voice synthesizer to listen to stories hands-free.
  - **Font Zoom Controls**: Accessible reading with A / A+ / A++ dynamic sizing.
  - **1-Click WhatsApp Sharing**: Pre-formatted WhatsApp broadcast links + X/Twitter + Copy Link with toast confirmation.
  - **Attribution & Fact-Checking Card**: Displays original source wire, verification confidence score, and fact-checking records.
- **Instant Search (⌘K / Ctrl+K)**: Debounced modal search across headlines, tags, and story excerpts.

### 2. Reporter Dashboard (`/reporter`)
- **Role**: `REPORTER` (Demo User: `Priya Nair`, Bhopal City Bureau).
- **KPI Metrics**: Total stories, Live published, Under Review, Drafts, and Rejections.
- **Ground Story Editor**:
  - Full article composition with category selection, cover image, and sources.
  - **AI Headline Polish**: Suggests 3 journalistic variations to sharpen clarity and engagement.
  - **Editorial Notes**: Direct communication field with the Central Editorial Desk.
  - Save as `DRAFT` or submit for approval (`PENDING_REVIEW`).
- **Editorial Feedback & Rejection Tracking**: Shows editorial rejection reasons with clear guidance for re-filing.

### 3. Central Editorial Admin Portal (`/admin`)
- **Role**: `ADMIN` (Demo User: `Rajesh Sharma`, Editor-in-Chief).
- **Decision Desk Modal**:
  - Review story side-by-side with source URLs and fact-check notes.
  - Direct on-the-fly editorial copyediting of headlines, summaries, and body paragraphs.
  - **Approve & Publish**: Instantly broadcasts the story to the front page.
  - **Reject with Mandatory Feedback**: Enforces clear feedback reason stored in the audit log.
- **AI News Ingestion Engine**:
  - One-click **Trigger AI News Discovery** button polling configured RSS feeds:
    - *Press Information Bureau (PIB) India*
    - *Madhya Pradesh Info Bureau (MPPR)*
    - *DD News Science & National Wire*
    - *Bhopal Municipal Urban Affairs*
  - **Golden Guardrail**: AI drafts are strictly locked in `PENDING_REVIEW`. Automated publication is structurally prohibited.
- **Breaking News Manager**: Add, toggle, or delete active breaking tickers.
- **Traceability Audit Logs**: Comprehensive chronological history of editorial approvals, rejections, AI ingestions, and breaking news updates.

---

## 🗄️ Database Design

The system includes complete schema definitions for PostgreSQL and Prisma:
- `prisma/schema.prisma`: Prisma client schema with enums, indexes, and relations.
- `prisma/schema.sql`: Production PostgreSQL DDL statements ready for deployment.

### Tables:
1. `users` (id, name, email, password_hash, role, bureau, is_active)
2. `categories` (id, name, slug, color, order, is_visible)
3. `articles` (id, slug, title, summary, content, cover_image, category_id, author_id, status, is_ai_generated, ai_confidence_score, fact_check_notes, conflicting_flags, source_url, source_name, tags, rejection_reason, editorial_notes, views_count, shares_count, is_breaking, is_featured, reading_time_minutes, published_at)
4. `article_revisions` (revision history per article)
5. `approval_history` (reviewer_id, previous_status, new_status, comments, timestamp)
6. `ai_generation_logs` (feed_url, raw_headline, confidence_score, flags, timestamp)
7. `breaking_news` (title, category, priority, is_active, created_at, expires_at)
8. `scheduled_feeds` (name, feed_url, category, frequency_minutes, last_fetched_at, status)
9. `audit_logs` (actor_name, actor_role, action, target_title, details, timestamp)

---


