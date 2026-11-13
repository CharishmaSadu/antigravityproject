# AgriAssist AI — Intelligent Crop Advisory & Precision Agronomy Assistant

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![Google Gemini 2.5](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-4285F4?style=flat&logo=google)](https://ai.google.dev/)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node%20Express-339933?style=flat&logo=nodedotjs)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20RLS-4169E1?style=flat&logo=postgresql)](https://www.postgresql.org/)

**AgriAssist AI** is a production-grade, enterprise-ready crop health intelligence platform designed for farmers, agronomists, and agricultural extension workers. Powered by **Google Gemini 2.5 Flash**, it provides multimodal plant disease diagnosis from leaf photographs, balanced organic and chemical treatment schedules, fertilizer nutrition plans, dynamic yield projections, and localized agro-meteorological forecasting with spray window indicators.

---

## 🌟 Key Capabilities

1. **Multimodal Plant Pathology Vision**
   - Upload high-resolution leaf and canopy photographs (JPEG, PNG, WebP up to 5MB).
   - Instant visual diagnostic inference identifying fungal, bacterial, viral, pest, and nutrient deficiency markers.
   - Confidence scoring ($0-100\%$) and severity level classification (*Low*, *Moderate*, *High*, *Critical*).

2. **Dual Organic & Conventional Therapeutic Protocols**
   - **Organic Remedies**: Bio-fungicides (e.g., *Bacillus subtilis*), botanical oils (*Neem Azadirachtin*), copper soaps, and beneficial parasitoids.
   - **Targeted Chemical Remedies**: Active ingredients, trade names, FRAC rotation guidance, application rates, and strict Pre-Harvest Intervals (PHI).

3. **Preventative Cultural Practices & Interactive Field Checklist**
   - Actionable sanitation, drip irrigation scheduling, canopy aeration, and multi-year Solanaceae crop rotation.
   - Checkbox checklist to track operational completion directly in the field.

4. **Dynamic Yield & Weather Calculator**
   - Real-time 7-day agro-meteorological forecasting (temperature, humidity, precipitation probability, wind speed).
   - Disease risk trajectory and safe spray window alerts (wind $< 15\text{ km/h}$, low immediate rain probability).
   - Interactive Recharts bar and area visualizations simulating yield recovery under recommended treatment protocols.

5. **Multi-Tenant PostgreSQL Architecture & Resilient Persistence**
   - Complete schema migrations with Row-Level Security (RLS) data isolation by `user_id`.
   - Embedded storage failover for preview environments and offline local testing.

6. **Multilingual Field Accessibility**
   - Instant UI language switching supporting **English**, **Spanish** (Español), **Hindi** (हिन्दी), **French** (Français), and **Swahili** (Kiswahili).

7. **Export & Print Ready**
   - One-click print-optimized advisory reports and clipboard summary sharing.

---

## 🏗️ System Architecture

```
agriassist-ai/
├── api/
│   └── index.js             # Vercel Serverless Function entry point
├── server/
│   ├── app.js               # Express application configuration & routing
│   ├── index.js             # Local standalone server runner
│   ├── db.js                # PostgreSQL Pool & automated schema migrations
│   ├── migrate.sql          # Production SQL DDL schema
│   ├── routes/
│   │   ├── farms.js         # Farm profiles API
│   │   └── advisories.js    # Multer upload & Gemini consultation API
│   ├── services/
│   │   ├── gemini.js        # Google GenAI SDK (gemini-2.5-flash) & Fallback Engine
│   │   └── weather.js       # Agro-meteorological & yield forecast engine
│   └── validators/
│       └── index.js         # Zod schemas for farms & advisory payloads
├── client/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, WeatherWidget, YieldAnalytics,
│   │   │                    # FarmSetupWizard, AdvisoryRequestForm, AdvisoryResultCard, HistoryTable
│   │   ├── pages/           # LandingPage, DashboardPage, FarmSetupPage,
│   │   │                    # AdvisoryNewPage, AdvisoryDetailPage, HistoryPage
│   │   ├── context/         # AppContext (Language i18n & Toast alerts)
│   │   ├── services/        # Frontend API client
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx          # React Router configuration
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts       # Vite proxy and production build setup
│   └── tailwind.config.js   # Custom agricultural design system
├── vercel.json              # Vercel deployment configuration
├── package.json             # Root monorepo scripts & dependencies
└── .env.example
```

---

## 🚀 Quickstart (Local Development)

### 1. Prerequisites
- Node.js `v18+` or `v20+` (v24 supported)
- npm `v9+` or `v12+`

### 2. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 3. Environment Variables Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your environment variables (see `.env.example` for detailed guidelines):
```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_google_gemini_api_key_here

# Supabase Connection Pooler (Transaction Mode, Port 6543)
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:6543/postgres?pgbouncer=true

# Optional Supabase API keys
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```
> *Note: If `DATABASE_URL` is omitted, AgriAssist AI automatically uses its resilient embedded fallback so you can test all features immediately.*
> *If `GEMINI_API_KEY` is not set, AgriAssist AI activates its built-in Expert Agronomic Knowledge Base with validated real-world crop pathologies.*

---

## ⚡ Supabase Setup & Migrations

AgriAssist AI is optimized for **Supabase PostgreSQL** with automated connection pooling and Row-Level Security (RLS).

### Option 1: Apply via Supabase Dashboard SQL Editor (Quickest)
1. Open your Supabase Project: **SQL Editor** -> **New query**.
2. Copy the contents of [`supabase/migrations/20261113000000_create_farms_and_advisories.sql`](file:///c:/Project/supabase/migrations/20261113000000_create_farms_and_advisories.sql).
3. Click **Run**.
4. *(Optional)* Run [`supabase/seed.sql`](file:///c:/Project/supabase/seed.sql) to populate demo farm and advisory records.

### Option 2: Apply via Supabase CLI
```bash
supabase db push
# or to reset and seed
supabase db reset
```

### Option 3: Auto-Migration on Boot
When `DATABASE_URL` is configured, AgriAssist AI's database service automatically verifies the connection and runs migrations from `server/migrate.sql` upon server startup!

### 4. Running the Development Servers
Run both backend Express server and Vite React frontend concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/health`

---

## ☁️ Deploying to Vercel

The application is pre-configured for **seamless zero-configuration deployment on Vercel**:

### Option A: Deploy with Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B: Deploy via GitHub / GitLab / Bitbucket
1. Push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), select **Import Project**.
3. Vercel automatically detects the root configuration:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`
4. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key
   - `DATABASE_URL`: Your PostgreSQL connection string (from Neon, Supabase, Vercel Postgres, or Railway)
5. Click **Deploy**.

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check reporting DB, model, and server status |
| `GET` | `/api/farms` | List all farm profiles for authenticated user |
| `POST` | `/api/farms` | Register new farm with soil & irrigation specifications |
| `GET` | `/api/farms/:id` | Retrieve farm profile and associated advisories |
| `POST` | `/api/advisories` | Submit photo & symptoms for Gemini diagnosis |
| `GET` | `/api/advisories` | Search & filter historical crop advisory reports |
| `GET` | `/api/advisories/:id` | Get full detailed diagnostic treatment protocol |
| `GET` | `/api/weather` | 7-day agro-meteorological forecast & spray window |
| `GET` | `/api/analytics/yield` | Interactive yield impact & recovery calculation |

---

## 🔬 Scientific Disclaimer

Recommendations provided by AgriAssist AI are generated through multimodal agronomic intelligence models trained on agriscience literature. Crop managers, farmers, and extension specialists should always inspect local field conditions and adhere to national pesticide registration labels, protective equipment guidelines, and regulated application rates.

