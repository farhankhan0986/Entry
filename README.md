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
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

</div>

---

## ✦ What is Entry?

**Entry** is a full-stack journaling and blogging platform built for those who believe the written word still matters. It blends the editorial feel of Medium with the raw simplicity of a personal diary — giving writers a clean, distraction-free space to publish stories, ideas, and reflections, while giving readers a beautiful, curated feed to explore.

Unlike generic blogging tools, Entry was designed **from the ground up** with a focus on:

- 🖋️ **Typography-first design** — Playfair Display headings, Arvo body text, Saira Stencil for brand moments
- 🌗 **Seamless dark/light theming** — CSS variable-driven, flicker-free SSR theme switching
- ⚡ **Performance by default** — Server Components for data fetching, Client Components only where interactivity is needed
- 🎞️ **Cinematic animations** — Framer Motion `AnimatePresence` for staggered reveals and layout transitions

---

## ✦ Feature Showcase

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   HOME           →  Hero section + Hot Entries feed        │
│   /journal       →  Full searchable + filterable archive   │
│   /blog/:slug    →  Full article with related stories      │
│   /write         →  Guest-friendly article submission      │
│   /terms         →  Terms of Service                       │
│   /privacy       →  Privacy Policy                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

| Feature | Description |
|---|---|
| 📝 **Rich Blog Feed** | 3-column responsive grid with animated BlogCards |
| 🔍 **Live Search** | Instant client-side search across title, content, category & author |
| 🏷️ **Category Filters** | Tag pills + overflow dropdown for filtering by category |
| 💬 **Comments System** | Users can post reflections on any published entry |
| ✍️ **Write Page** | Clean markdown-friendly submission form for new entries |
| 🌐 **Static + DB Hybrid** | Curated static posts merged with live MongoDB entries |
| 🌙 **Theme Toggle** | Dark / Light mode with `next-themes` and CSS variables |
| 📱 **Fully Responsive** | Mobile-first horizontal card layout + desktop vertical cards |
| 🔔 **Toast Notifications** | `sonner` toasts in Arvo font for a consistent feel |

---

## ✦ Tech Stack

```
 ┌────────────────────┬──────────────────────────────────────────┐
 │  Layer             │  Technology                              │
 ├────────────────────┼──────────────────────────────────────────┤
 │  Framework         │  Next.js 16 (App Router)                 │
 │  UI Library        │  React 19                                │
 │  Styling           │  Tailwind CSS v4 + Vanilla CSS Variables │
 │  Animations        │  Framer Motion 12                        │
 │  Database          │  MongoDB (via Mongoose 9)                │
 │  Fonts             │  Arvo · Playfair Display · Saira Stencil │
 │  Icons             │  Lucide React + React Icons              │
 │  Notifications     │  Sonner                                  │
 │  Theming           │  next-themes                             │
 └────────────────────┴──────────────────────────────────────────┘
```

---

## ✦ Project Architecture

```
entry/
├── app/
│   ├── page.js               ← Home page (Hero + Hot Entries)
│   ├── layout.js             ← Root layout (fonts, theme, navbar)
│   ├── globals.css           ← CSS variables & global styles
│   ├── journal/
│   │   └── page.jsx          ← Server Component: fetches all blogs
│   ├── blog/[slug]/
│   │   └── page.jsx          ← Server Component: single article view
│   ├── write/
│   │   └── page.jsx          ← Blog submission form
│   ├── privacy/page.jsx
│   └── terms/page.jsx
│
├── components/
│   ├── Navbar.jsx            ← Global navigation with theme toggle
│   ├── BlogsGrid.jsx         ← "use client" — search, filter, grid
│   ├── BlogCard.jsx          ← Responsive dual-layout card
│   ├── Blogs.jsx             ← Hot entries wrapper
│   ├── CommentsSection.jsx   ← Comment form + display
│   ├── RenderContent.jsx     ← Markdown/HTML content renderer
│   ├── Subscribe.jsx         ← Newsletter subscribe UI
│   └── ThemeProvider.jsx     ← next-themes wrapper
│
├── lib/
│   ├── db.js                 ← MongoDB connection singleton
│   ├── staticData.js         ← Hardcoded curated blog posts
│   └── actions/
│       └── blogActions.jsx   ← Server Actions (CRUD + comments)
│
└── models/
    ├── Blog.js               ← Mongoose Blog schema
    └── Comment.js            ← Mongoose Comment schema
```

---

## ✦ Data Architecture

Entry uses a **hybrid data model** — combining hand-crafted static content with live database entries to ensure the site is never empty:

```
getAllBlogs()
    │
    ├── staticBlogs (lib/staticData.js)
    │       └── Enriched with readTime, publishedAt
    │
    └── MongoDB (Blog collection)
            └── Fetched as lean() plain objects
    │
    └── Merged → sorted by createdAt (newest first) → returned
```

**Blog Schema:**
```js
{
  title:       String   // required
  slug:        String   // unique, auto-generated from title
  content:     String   // required (markdown-friendly)
  category:    String   // default: 'General'
  authorName:  String   // default: 'Anonymous'
  authorId:    ObjectId // ref: 'User' (for future OAuth)
  bannerImage: String   // URL
  stats: {
    likes: Number        // default: 0
    views: Number        // default: 0
  }
  createdAt, updatedAt  // auto via timestamps: true
}
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
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/entry
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

Entry's color system is built entirely on **CSS custom properties**, giving instant, flicker-free dark/light switching:

```css
:root {
  --background:        /* Page background   */
  --foreground:        /* Primary text      */
  --card:              /* Card surfaces     */
  --muted:             /* Secondary text    */
  --border:            /* Borders & dividers*/
  --accent:            /* Brand accent      */
  --primary:           /* Interactive primary */
  --primary-foreground:/* Text on primary   */
}
```

Theming is managed by `next-themes` with `suppressHydrationWarning` on both `<html>` and `<body>` to prevent SSR mismatches.

---

## ✦ Key Design Decisions

**Why Server Components for data fetching?**
Pages like `/journal` and `/blog/[slug]` are Server Components. They `await` database calls directly — no client-side loading spinners, no `useEffect`, no CORS. Data arrives with the HTML.

**Why `AnimatePresence` on the grid?**
The journal's category filter replaces the list of blogs dynamically. Using Framer Motion's `AnimatePresence` with `mode="popLayout"` ensures exiting cards animate out, remaining cards slide to fill the gap, and entering cards fade in — all without jarring jumps.

**Why a hybrid static + DB data model?**
To guarantee the site is populated with quality content from day one. Static posts are curated, enriched (read time, publish date), and merged with DB posts at the server layer — invisible to the frontend.

---

## ✦ Roadmap

- [ ] OAuth authentication (Google / GitHub)
- [ ] User profiles and dashboards
- [ ] Rich text editor (replace plain textarea with Tiptap or MDX)
- [ ] Likes / reactions system
- [ ] View count tracking
- [ ] Image upload (Cloudinary / S3 integration)
- [ ] RSS feed generation
- [ ] PWA support

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
