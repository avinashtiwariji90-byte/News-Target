# 🇮🇳 News Target (न्यूज़ टारगेट)
### AI-Assisted, Human-Verified Digital News & Media Network

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Favinashtiwariji90-byte%2FNews-Target)

**News Target** is a modern, production-grade digital news portal engineered with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and high-performance server-side APIs. It delivers real-time verified coverage across **Madhya Pradesh**, **Bhopal**, **National Politics**, **Sovereign AI & Deep Tech**, and **Global Affairs**.

---

## 🌟 Key Architecture & Highlights

### 1. Public News Portal (`/`)
- **Branding & Identity**: Dual-language Hindi-English channel identity, live broadcast radar pulse.
- **Top Utility Bar**: Real-time IST clock, live Sensex/Nifty financial index ticker, local bureau weather widget (Bhopal & Delhi).
- **Breaking News Flash Ticker**: Red beacon alerts with manual step navigation and pause-on-hover.
- **Hero Editorial Spotlight**: High-impact lead story with badges, reading time, author byline, and side spotlight stories.
- **Top Stories Showcase**: Editorially selected Top Stories with full media support (photos, video embed/playback).
- **Interactive Reading Suite**:
  - **Audio Speech Player**: Built-in voice synthesizer to listen to stories hands-free.
  - **Font Zoom Controls**: Accessible reading with A / A+ / A++ dynamic sizing.
  - **1-Click WhatsApp Sharing**: Pre-formatted WhatsApp broadcast links + X/Twitter + Copy Link with toast confirmation.
  - **Attribution & Fact-Checking Card**: Displays original source wire, verification confidence score, and fact-checking records.
- **Instant Search (⌘K / Ctrl+K)**: Debounced modal search across headlines, tags, and story excerpts.

### 2. Reporter Dashboard (`/reporter`)
- **Ground Story Dispatch Filing**:
  - Full article composition with category selection, cover image upload, photo gallery, and video upload (up to 20MB).
  - Submissions are strictly saved in `PENDING_REVIEW` status and hidden from the public portal until an Administrator reviews and approves them.
- **My Submissions Tracking**:
  - Real-time status tracker (प्रतीक्षारत / प्रकाशित / अस्वीकृत).

### 3. Central Editorial Admin Portal (`/admin`)
- **Access**: Secure Admin Login (`Avinash@123` / `Avinash@123`).
- **Dedicated Reporter Reports Tab**:
  - Located directly beside Audit Logs.
  - Instant approval workflow: 1-Click "स्वीकृत कर तुरंत लाइव करें (Approve & Publish)".
  - Full preview of photos, videos, and ground reporter details.
- **Pending Approval Queue**:
  - Split view for AI Ingested Drafts vs. Human Reporter Submissions.
- **Top Alert Notification Banner**:
  - Automatically notifies the Administrator when new reporter dispatches require approval.
- **Top Stories Manager**:
  - Pin, feature, and prioritize lead stories on the homepage.
- **Breaking News Manager**:
  - Add, toggle, or delete active breaking tickers.
- **Traceability Audit Logs**:
  - Comprehensive chronological history of editorial approvals, rejections, and breaking news updates.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Security**: Built-in HTTP security headers, role-based access control (RBAC), and sanitization.

---

## 🚀 Getting Started

```bash
# 1. Clone repository
git clone https://github.com/avinashtiwariji90-byte/News-Target.git
cd News-Target

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev -- -p 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Main Public News Portal**: `http://localhost:3000/`
- **Reporter Filing Desk**: `http://localhost:3000/reporter`
- **Admin Portal**: `http://localhost:3000/admin` (Credentials: `Avinash@123` / `Avinash@123`)

---
© 2026 News Target Digital Network. All rights reserved.
