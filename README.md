# Tool Smith

**PCPartPicker, but for Grainger.**

Tool Smith is an AI-powered procurement tool that helps construction and industrial professionals build optimized project plans using real products from [Grainger.com](https://www.grainger.com). Describe your project, set a budget, and let AI recommend the best tools and materials, all with live pricing, images, and direct links to purchase.

---

## How it runs:

### 1. Create a Project

Start by filling out your project details on the homepage:

- **Project Name** - e.g. "Bathroom Renovation"
- **Budget** - your spending limit
- **Timeline** — project deadline
- **Category** — Renovation, Electrical, Plumbing, etc.
- **Description** — Description of project needs(e.g. *"I need to renovate my bathroom — looking for a new sink, faucet, and shower fixtures under $500"*)

### 2. Generate an AI Plan

Click **"Generate AI Plan"** and Tool Smith will:

1. Parse your description to extract key product terms (e.g. "sink", "faucet", "shower")
2. Search the Grainger product database for matching items within your budget
3. Use **Google Gemini AI** to intelligently rank and select the **6 best-fit products**, explaining *why* each one was chosen

### 3. Review Recommendations

The build page displays:

- An **AI summary** of the recommendations
- **Product cards** with images, names, prices, AI reasoning, and direct **"View on Grainger"** links
- A **budget tracker** showing estimated cost vs. budget with a progress bar

### 4. Build Your Purchase List

Click **"Generate Purchase List"** to move your recommended products into an editable cart:

- Adjust **quantities** for each item - line totals update in real time
- Remove items you don't need
- View a **cost breakdown** with subtotal, tax (8%), total, and remaining budget
- See a **category breakdown chart** showing spending distribution
- Over-budget items are highlighted in red

### 5. Save & Manage Projects

- **Save Project** — persists your project and all cart items so you can come back later
- **Saved Projects** — view all your saved projects from the homepage, click to reload them
- **New Project** — reset everything and start fresh
- **Delete** — remove saved projects you no longer need

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org/) | React framework with API routes (Turbopack) |
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [Supabase](https://supabase.com/) | Product database (PostgreSQL) |
| [Google Gemini 2.5 Flash](https://ai.google.dev/) | AI product selection & reasoning |
| [Framer Motion](https://www.framer.com/motion/) | Page transitions |
| [Recharts](https://recharts.org/) | Data visualization |
| [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) | Component library |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project with a `grainger_products` table
- A [Google AI Studio](https://aistudio.google.com/) API key

### 1. Clone the repo

```bash
git clone https://github.com/your-username/GraingerGang.git
cd GraingerGang/graingergang
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the `graingergang/` directory:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_API_KEY=your_google_gemini_api_key
```

### 4. Set up the database

Your Supabase `grainger_products` table should have the following columns:

| Column | Type | Description |
|---|---|---|
| `id` | int | Primary key |
| `product` | text | Product name/title |
| `price` | float | Product price |
| `label` | text | Category label (e.g. "Sinks", "Power Drills") |
| `image_url` | text | Product image URL |
| `grainger_url` | text | Link to the product on Grainger.com |

You can populate it with the included `products.json` file.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
graingergang/
├── app/
│   ├── page.tsx              # Homepage — project form + saved projects
│   ├── generating/page.tsx   # AI loading transition screen
│   ├── build/page.tsx        # AI recommendations display
│   ├── cart/page.tsx         # Purchase list with quantities & cost breakdown
│   ├── products/page.tsx     # Manual product browsing
│   ├── context/
│   │   └── ProjectContext.tsx # Global state (project, cart, saved projects)
│   └── backend/
│       ├── ai/route.ts       # AI endpoint — keyword extraction + Supabase + Gemini
│       ├── route.ts          # Direct product query endpoint
│       └── supabase.ts       # Supabase client
├── components/
│   ├── ProductCard.tsx       # Product display card with image, price, link
│   └── ui/                   # shadcn/ui components
├── products.json             # Seed data for Grainger products
└── .env.local                # Environment variables (not committed)
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |

---

## The Vision

Tool Smith aims to be the **PCPartPicker for industrial procurement**. Just like PCPartPicker lets you build a custom PC by picking compatible parts within a budget, Tool Smith lets you:

- **Describe a project** in plain English and get AI-curated product recommendations
- **Compare products** side-by-side with real pricing from Grainger
- **Track your budget** in real time as you add, remove, and adjust quantities
- **Save and revisit** project builds anytime
- **Go straight to purchase** — every product links directly to its Grainger page

Whether you're a contractor planning a plumbing job, a facilities manager stocking up on tools, or a project lead building out a materials list - Tool Smith turns hours of catalog browsing into minutes.

---

## Team

Built by the Grainger Gang !!

---

## License

This project is for SparkHacks and educational purposes only.
