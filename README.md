<!-- ============================================================
     E N T R Y  —  README
     Font: Arvo (serif) · Stack: Next.js 16 / MongoDB / Tailwind v4
     ============================================================ -->

<div align="center">
```
  ███████╗ ███╗   ██╗ ████████╗ ██████╗  ██╗   ██╗
  ██╔════╝ ████╗  ██║ ╚══██╔══╝ ██╔══██╗ ╚██╗ ██╔╝
  █████╗   ██╔██╗ ██║    ██║    ██████╔╝  ╚████╔╝
  ██╔══╝   ██║╚██╗██║    ██║    ██╔══██╗   ╚██╔╝
  ███████╗ ██║ ╚████║    ██║    ██║  ██║    ██║
  ╚══════╝ ╚═╝  ╚═══╝    ╚═╝    ╚═╝  ╚═╝    ╚═╝
```

> *A place where words live, breathe, and find their readers.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![NextAuth](https://img.shields.io/badge/NextAuth-v5-6C47FF?style=for-the-badge&logo=auth0&logoColor=white)](https://authjs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

[![Entry](https://img.shields.io/badge/Live-06B6D4?style=for-the-badge&logo=live&logoColor=white)](https://entry-azure.vercel.app/)
</div>

---

## ✦ What is Entry?

**Entry** is a full-stack editorial platform for writers, thinkers, and creators. It combines the polish of premium publications with the intimacy of a personal journal — giving anyone a distraction-free space to publish stories, ideas, and reflections, while giving readers a beautiful, curated feed to explore.

Beyond writing, Entry ships with a suite of **productivity tools** — a personality discovery quiz, an AI prompt optimizer, a Pomodoro focus timer, a salary benchmarking tool, and a text converter — all under one roof.

**What makes Entry different:**

- 🖋️ **Typography-first design** — Playfair Display headings, Arvo body text, Saira Stencil for brand moments
- 🎨 **6-theme system** — Light, Dark, Red, Blue, Green, Purple — all CSS variable-driven with flicker-free SSR switching
- ⚡ **Performance by default** — React 19 + React Compiler, Server Components for data, Client Components only where needed
- 🔐 **OAuth authentication** — Google & GitHub sign-in via NextAuth v5 with MongoDB Adapter
- 📊 **Full writer dashboard** — Manage posts, edit your author profile, track stats
- 🤖 **AI-powered tools** — Prompt optimizer backed by Groq (Llama 3.3 70B)
- ☁️ **Cloudinary image pipeline** — Server-side signed uploads for blog banners and inline images

---

## ✦ Feature Showcase

```
┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│   HOME               →  Hero section + Hot Entries feed              │
│   /journal           →  Full searchable + filterable archive         │
│   /blog/:slug        →  Full article with likes, views, comments     │
│   /write             →  Rich markdown editor (auth-gated)            │
│   /dashboard         →  Writer dashboard + profile editor            │
│   /authors/:slug     →  Public author portfolio page                 │
│   /login             →  Google / GitHub OAuth sign-in                │
│   /discovery         →  15-question personality quiz                 │
│   /prompt-optimizer  →  AI prompt refinement tool (Groq)             │
│   /focus-timer       →  Pomodoro timer with session tracking         │
│   /daily-entry       →  Daily journaling habit tracker               │
│   /salary-check      →  Tech salary benchmarking (India + Global)    │
│   /converter         →  Multi-format text converter + stats          │
│   /technology        →  Technology category page                     │
│   /science           →  Science category page                        │
│   /psychology        →  Psychology category page                     │
│   /philosophy        →  Philosophy category page                     │
│   /culture           →  Culture category page                        │
│   /biographies       →  Biographies category page                    │
│   /mysteries         →  Mysteries category page                      │
│   /facts             →  Facts category page                          │
│   /countries         →  Countries category page                      │
│   /about             →  About page                                   │
│   /contact           →  Contact form (Resend email API)              │
│   /privacy           →  Privacy Policy                               │
│   /terms             →  Terms of Service                             │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

| Feature | Description |
|---|---|
| 📝 **Rich Blog Feed** | 3-column responsive grid with animated BlogCards, dual card layouts for mobile/desktop |
| 🔍 **Live Search** | Instant client-side search across title, content, category & author |
| 🏷️ **Category Filters** | Tag pills + overflow dropdown for filtering by category |
| 💬 **Comments System** | Authenticated users can post reflections on any published entry |
| ❤️ **Likes & Views** | Per-article engagement tracking with IP-based deduplication |
| ✍️ **Markdown Editor** | Full formatting toolbar with live preview, word count, undo/redo, image & link modals |
| ☁️ **Image Uploads** | Server-side Cloudinary signed uploads — for banners and inline content images |
| 🔐 **OAuth Auth** | Google + GitHub via NextAuth v5, JWT sessions, MongoDB Adapter |
| 👤 **Writer Dashboard** | Manage entries, edit profile (bio, tagline, socials, tags, accent color) |
| 📄 **Author Profiles** | Public author portfolio pages with stats, followers, and social links |
| 🧑‍🤝‍🧑 **Follow System** | Follow any author with IP-deduplicated follower counts |
| 📊 **Polls** | Interactive reader polls embedded in category/content pages |
| 🎨 **6 Themes** | Light · Dark · Red · Blue · Green · Purple — one-click cycling |
| 🧠 **Discovery Tool** | 15-question personality quiz across 6 trait axes with animated results |
| 🤖 **Prompt Optimizer** | AI-powered prompt engineering tool (Groq / Llama 3.3 70B) |
| ⏱️ **Focus Timer** | Pomodoro timer with focus/break modes, session tracking, audio alerts |
| 📔 **Daily Entry** | Habit tracker with streak counting and local storage persistence |
| 💰 **Salary Check** | Tech salary benchmarking for 12 roles across India + Global markets |
| 🔤 **Text Converter** | Case conversion, slug generator, Base64 encode/decode, find & replace, stats |
| 📰 **Newsletter CTA** | Email subscription with free PDF download (2026 Tech Career Roadmap) |
| 📈 **Reading Progress** | Scroll-driven progress bar on article pages |
| 🔔 **Toast Notifications** | `sonner` toasts in Arvo font for a consistent feel |
| 🌐 **SEO Optimized** | Dynamic sitemap, robots.txt, Open Graph, Twitter Cards, JSON-LD ready |
| ⚡ **Vercel Analytics** | Speed Insights + Web Analytics built-in |
| 📱 **Fully Responsive** | Mobile-first with skeleton loading states across all pages |

---

## ✦ Tech Stack

```
 ┌─────────────────────┬───────────────────────────────────────────────┐
 │  Layer              │  Technology                                   │
 ├─────────────────────┼───────────────────────────────────────────────┤
 │  Framework          │  Next.js 16 (App Router)                      │
 │  UI Library         │  React 19 + React Compiler                    │
 │  Styling            │  Tailwind CSS v4 + CSS Custom Properties      │
 │  Animations         │  Framer Motion 12                             │
 │  Database           │  MongoDB (via Mongoose 9)                     │
 │  Authentication     │  NextAuth v5 (Google + GitHub OAuth)          │
 │  Image CDN          │  Cloudinary (signed server-side uploads)      │
 │  AI / LLM           │  Groq SDK (Llama 3.3 70B Versatile)          │
 │  Email              │  Resend                                       │
 │  Fonts              │  Arvo · Playfair Display · Saira Stencil One  │
 │  Icons              │  Lucide React + React Icons                   │
 │  Notifications      │  Sonner                                       │
 │  Theming            │  next-themes (6 color modes)                  │
 │  Analytics          │  Vercel Analytics + Speed Insights            │
 │  Deployment         │  Vercel                                       │
 └─────────────────────┴───────────────────────────────────────────────┘
```

---

## ✦ Project Architecture

```
entry/
├── app/
│   ├── page.jsx                ← Home page (Hero + Hot Entries)
│   ├── layout.js               ← Root layout (fonts, providers, navbar, footer)
│   ├── globals.css              ← CSS variables & 6 theme palettes
│   ├── not-found.jsx            ← Custom 404 page
│   ├── sitemap.js               ← Dynamic sitemap generation
│   ├── robots.js                ← Robots.txt configuration
│   │
│   ├── journal/page.jsx         ← Full searchable + filterable archive
│   ├── blog/[slug]/page.jsx     ← Single article (views, likes, comments, share)
│   ├── write/page.jsx           ← Auth-gated entry submission
│   ├── dashboard/               ← Writer dashboard + profile editor
│   │   ├── page.jsx
│   │   └── loading.jsx          ← Skeleton loading state
│   ├── login/page.jsx           ← OAuth sign-in (Google + GitHub)
│   ├── authors/[slug]/          ← Public author portfolio pages
│   │
│   ├── discovery/page.jsx       ← Personality quiz tool
│   ├── prompt-optimizer/        ← AI prompt refinement tool
│   ├── focus-timer/page.jsx     ← Pomodoro timer
│   ├── daily-entry/page.jsx     ← Daily journaling tracker
│   ├── salary-check/page.jsx    ← Salary benchmarking tool
│   ├── converter/page.jsx       ← Text converter / manipulator
│   │
│   ├── technology/              ← Category pages (static + filtered content)
│   ├── science/
│   ├── psychology/
│   ├── philosophy/
│   ├── culture/
│   ├── biographies/
│   ├── mysteries/
│   ├── facts/
│   ├── countries/
│   │
│   ├── about/page.jsx
│   ├── contact/page.jsx
│   ├── privacy/page.jsx
│   ├── terms/page.jsx
│   │
│   └── api/
│       ├── auth/[...nextauth]/   ← NextAuth route handlers
│       ├── upload/route.js       ← Cloudinary signed upload proxy
│       ├── optimize-prompt/      ← Groq AI prompt optimizer
│       ├── author-stats/         ← Author follower stats API
│       └── contact/route.js      ← Contact form email (Resend)
│
├── components/
│   ├── Navbar.jsx               ← Global nav with auth state + theme cycling
│   ├── Footer.jsx               ← 6-column footer with newsletter CTA
│   ├── BlogsGrid.jsx            ← "use client" — search, filter, animated grid
│   ├── BlogCard.jsx             ← Responsive dual-layout card
│   ├── Blogs.jsx                ← Hot entries wrapper
│   ├── CommentsSection.jsx      ← Comment form + display
│   ├── BlogInteractions.jsx     ← Like + view buttons with optimistic UI
│   ├── ReadingProgressBar.jsx   ← Scroll-driven progress bar
│   ├── Share.jsx                ← Native share / copy-to-clipboard
│   ├── RenderContent.jsx        ← Markdown/HTML content renderer
│   ├── Subscribe.jsx            ← Newsletter subscribe UI
│   ├── GenericPoll.jsx          ← Animated reader polls
│   ├── Follow.jsx               ← Follow button for authors
│   ├── FollowerCount.jsx        ← Live follower count display
│   ├── AuthorFollowButton.jsx   ← Author-page follow button
│   ├── DashboardClient.jsx      ← Full dashboard UI (entries + profile editor)
│   ├── WriteForm.jsx            ← Blog submission form with Cloudinary upload
│   ├── FormattedTextarea.jsx    ← Rich markdown editor with toolbar + preview
│   ├── DiscoveryTool.jsx        ← 15-question personality quiz
│   ├── PromptOptimizer.jsx      ← AI prompt optimizer UI
│   ├── FocusTimerTool.jsx       ← Pomodoro timer with circular SVG progress
│   ├── DailyEntryTool.jsx       ← Daily entry habit tracker
│   ├── SalaryTool.jsx           ← Salary benchmarking calculator
│   ├── TextForm.jsx             ← Text converter (40+ transformations)
│   ├── SocialButton.jsx         ← Social media button component
│   ├── Button.jsx               ← Reusable CTA button
│   ├── ThemeProvider.jsx        ← next-themes wrapper
│   └── Providers.jsx            ← NextAuth SessionProvider
│
├── lib/
│   ├── db.js                    ← MongoDB dual-connection singleton
│   │                               (Mongoose for models, MongoClient for Auth)
│   ├── authorUtils.js           ← Author slug generation
│   ├── staticData.js            ← 683KB of curated static blog content
│   └── actions/
│       ├── blogActions.jsx      ← Server Actions (create, read, getAllBlogs)
│       ├── blogStatsActions.js  ← View + Like tracking with IP deduplication
│       ├── authorActions.js     ← Author profile CRUD + follow system
│       └── userActions.js       ← User dashboard actions (delete blog, etc.)
│
├── models/
│   ├── Blog.js                  ← Mongoose blog schema (title, slug, content, status...)
│   ├── Comment.js               ← Mongoose comment schema (blogId, body, author...)
│   ├── BlogStats.js             ← Per-slug view + like counts with IP tracking
│   ├── AuthorStats.js           ← Per-author follower counts with IP deduplication
│   └── UserProfile.js           ← Author profile (bio, tagline, socials, tags, accentColor)
│
├── auth.js                      ← NextAuth v5 config (Google + GitHub, JWT, MongoDB Adapter)
├── next.config.mjs              ← Next.js config (React Compiler, image remotePatterns)
└── public/
    ├── og-default.jpg            ← Open Graph fallback image
    ├── 2026_Tech_Career_Roadmap.pdf  ← Newsletter free PDF download
    ├── discovery.png, focus.png, ...  ← Tool page hero images
    └── site.webmanifest          ← PWA manifest
```

---

## ✦ Data Architecture

Entry uses a **hybrid data model** — combining hand-crafted static content with live database entries:

```
getAllBlogs()
    │
    ├── staticBlogs (lib/staticData.js — 683KB of curated editorial content)
    │       └── Enriched with readTime, publishedAt, authorId
    │
    └── MongoDB (Blog collection)
            └── Fetched as lean() plain objects
    │
    └── Merged → sorted by createdAt (newest first) → returned
```

**Mongoose Models:**

```
Blog         →  title, slug, content, category, authorName, authorId,
                 authorEmail, authorImage, bannerImage, status, timestamps

Comment      →  blogId, body, authorName, authorId, authorImage, timestamps

BlogStats    →  slug, views, likes, viewedIps[], likedIps[]

AuthorStats  →  authorId, followers, followerIps[]

UserProfile  →  authorId, tagline, bio, location, website,
                 twitter, linkedin, instagram, github,
                 tags[], accentColor
```

---

## ✦ Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** or **pnpm**

### 1 · Clone the repository

```bash
git clone https://github.com/farhankhan0986/Entry.git
cd Entry
```

### 2 · Install dependencies

```bash
npm install
```

### 3 · Configure environment variables

Create a `.env` file in the root:

```env
# ── Database ────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/entry

# ── NextAuth ────────────────────────────────────
AUTH_SECRET=your-random-secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret

# ── Cloudinary (Image Uploads) ──────────────────
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ── Groq (AI Prompt Optimizer) ──────────────────
GROQ_API_KEY=your-groq-api-key

# ── Resend (Contact Form) ──────────────────────
RESEND_API_KEY=your-resend-api-key
```

### 4 · Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✦ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the codebase |

---

## ✦ Typography System

Entry uses a carefully chosen **three-font system** loaded via `next/font/google`:

```
  ┌───────────────────────┬──────────────────────────────────────┐
  │  Variable             │  Usage                               │
  ├───────────────────────┼──────────────────────────────────────┤
  │  --font-saira         │  Brand logo (Saira Stencil One)      │
  │  --font-playfair      │  Headlines & article titles          │
  │  --font-arvo          │  Body text, inputs, UI labels        │
  └───────────────────────┴──────────────────────────────────────┘
```

All fonts are zero-layout-shift, subsetted to `latin`, and applied via CSS utility classes (`font-arvo`, `font-playfair`, `font-saira`).

---

## ✦ Theming

Entry's color system is built on **CSS custom properties** with **6 distinct themes**:

```
  ┌──────────┬───────────────────────────────────────────────────┐
  │  Theme   │  Vibe                                             │
  ├──────────┼───────────────────────────────────────────────────┤
  │  Light   │  Warm cream (#FFF8EC) + amber accent              │
  │  Dark    │  Deep grey (#454040) + golden amber accent        │
  │  Red     │  Midnight black (#121212) + crimson red accent    │
  │  Blue    │  Ocean midnight (#0a1220) + sky blue accent       │
  │  Green   │  Emerald night (#08130d) + fresh green accent     │
  │  Purple  │  Elegant lavender (#f1e8f5) + violet accent       │
  └──────────┴───────────────────────────────────────────────────┘
```

Theme switching is managed by `next-themes` with `suppressHydrationWarning` on `<html>` and `<body>`. The navbar's theme toggle cycles through all 6 modes with a single click and uses contextual icons (Sun, Moon, Flame, Droplets, Leaf, Palette).

---

## ✦ Authentication

Entry uses **NextAuth v5** (Auth.js) with the MongoDB Adapter for persistent sessions:

- **Providers:** Google OAuth + GitHub OAuth
- **Strategy:** JWT (stateless, no DB session lookup per request)
- **Custom login page:** `/login`
- **Auth-gated pages:** `/write`, `/dashboard`
- **Session data:** User ID, name, email, and image are exposed to the client

---

## ✦ Key Design Decisions

**Why Server Components for data fetching?**
Pages like `/journal`, `/blog/[slug]`, and `/dashboard` are Server Components. They `await` database calls directly — no client-side loading spinners, no `useEffect`, no CORS. Data arrives with the HTML.

**Why `AnimatePresence` on the grid?**
The journal's category filter replaces the list of blogs dynamically. Using Framer Motion's `AnimatePresence` with `mode="popLayout"` ensures exiting cards animate out, remaining cards slide to fill the gap, and entering cards fade in — all without jarring jumps.

**Why a hybrid static + DB data model?**
To guarantee the site is populated with quality content from day one. Static posts are curated, enriched (read time, publish date), and merged with DB posts at the server layer — invisible to the frontend.

**Why dual MongoDB connections?**
NextAuth's MongoDB Adapter requires a raw `MongoClient` promise, while the app's models use Mongoose. Both share a `globalThis`-cached singleton pattern to survive hot-reloads in dev and prevent connection exhaustion in serverless production (Vercel).

**Why server-side Cloudinary uploads?**
Direct client-to-Cloudinary uploads expose API secrets. The `/api/upload` route acts as a signed proxy — the client sends a `FormData` blob, the server generates a SHA-1 signature and forwards the upload, then returns the `secure_url`.

**Why React Compiler?**
Entry opts into the React 19 Compiler (`babel-plugin-react-compiler`) via `next.config.mjs`. This automatically memoizes components and eliminates unnecessary re-renders without manual `useMemo`/`useCallback` usage.

---

## ✦ Roadmap

- ✅ OAuth authentication (Google / GitHub)
- ✅ User profiles and dashboards
- ✅ Image upload (Cloudinary integration)
- ✅ Likes / views tracking system
- ✅ Author portfolio pages with follow system
- ✅ AI-powered prompt optimizer
- ✅ Productivity tools (Focus Timer, Daily Entry, Salary Check)
- ✅ Multi-theme system (6 themes)
- ✅ Skeleton loading states
- ✅ Category pages with editorial content
- 🔵 Rich text editor (replace markdown with Tiptap or ProseMirror)
- 🔵 Email notifications for followers
- 🔵 RSS feed generation
- 🔵 PWA support with push notifications
- 🔵 Draft preview / scheduled publishing
- 🔵 Search Engine — full-text search via Atlas Search

---

## ✦ Contributing

Contributions are what make open source meaningful. If you have a suggestion, bug fix, or new feature in mind:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## ✦ License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">

*Built with obsessive attention to typography and a love for the written word.*

**[Entry](https://github.com/farhankhan0986/Entry)** · Made by [Farhan Khan](https://github.com/farhankhan0986)

</div>
