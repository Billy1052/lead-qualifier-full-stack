# AI Lead Qualifier — Full Stack

## Project Overview

An AI-powered lead qualification tool. You fill out a form with information about a prospect, click **Analyze**, and Claude AI scores and qualifies the lead. The frontend is a Next.js app deployed on Vercel. It triggers a background job on trigger.dev, which calls the Claude API, then displays the qualification result back in the UI.

---

## WAT Framework

This project is organized around the **WAT** framework, which defines how the workflow is built and maintained:

| Letter | Stands For | Role | Folder |
|--------|-----------|------|--------|
| **W** | Workflows / Instructions | trigger.dev job definitions, step-by-step process logic, AI prompts | `Workflows/` |
| **A** | Agent | Claude Code (you — the AI assistant helping build this) | *(no folder)* |
| **T** | Tools | Scripts, utilities, and shared helpers used by the workflow | `Tools/` |

---

## Architecture

```
User fills lead form (Next.js / Vercel)
        │
        │  POST /api/trigger  (Next.js API route)
        ▼
trigger.dev background job
        │
        │  Anthropic SDK → Claude API
        ▼
AI qualifies the lead (score + reasoning)
        │
        │  Result polled or returned via trigger.dev realtime
        ▼
Result displayed in the frontend (Next.js)
```

**Frontend → Backend communication:**
- The Next.js API route calls trigger.dev's SDK to enqueue the job.
- The frontend polls or subscribes to the job run using trigger.dev's `useRealtimeRun` hook (or equivalent) to display results as they stream in.

---

## Tech Stack

| Layer | Technology | Deployment |
|-------|-----------|------------|
| Frontend | Next.js (TypeScript) | Vercel (via GitHub) |
| Background jobs | trigger.dev v3 | trigger.dev Cloud |
| AI model | Claude (Anthropic SDK) | Anthropic API |
| Language | TypeScript | — |

---

## Lead Schema

The form collects the following fields. These map directly to the payload sent to the trigger.dev job.

```ts
interface LeadPayload {
  companyName: string;       // Name of the company
  companySize: string;       // e.g. "1-10", "11-50", "51-200", "200+"
  industry: string;          // e.g. "SaaS", "E-commerce", "Healthcare"
  budgetRange: string;       // e.g. "< $1k", "$1k-$5k", "$5k-$20k", "$20k+"
  painPoints: string;        // Free-text: what problem they need solved
}
```

The AI returns:

```ts
interface QualificationResult {
  score: number;             // 1–10 qualification score
  tier: "Hot" | "Warm" | "Cold";
  summary: string;           // 2–3 sentence executive summary
  strengths: string[];       // Why this lead looks good
  concerns: string[];        // Red flags or gaps
  recommendedAction: string; // e.g. "Schedule discovery call", "Send nurture email"
}
```

---

## Folder Guide

```
Lead Qualifier -Full Stack/
├── CLAUDE.md                        ← This file
│
├── Workflows/                       ← W: All workflow logic lives here
│   ├── README.md                    ← How to add / modify jobs
│   ├── lead-qualifier.job.ts        ← Main trigger.dev task
│   └── prompts/
│       └── qualify-lead.md         ← System prompt used by Claude
│
├── Tools/                           ← T: Scripts and shared utilities
│   ├── README.md                    ← How to use the scripts
│   ├── scripts/
│   │   └── test-workflow.ts        ← Run the job locally without the UI
│   └── lib/
│       └── trigger-client.ts       ← Shared trigger.dev client setup
│
└── frontend/                        ← Next.js app (Vercel)
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx            ← Lead form + result display
    │   │   └── api/
    │   │       └── trigger/
    │   │           └── route.ts    ← API route that enqueues the job
    │   └── components/
    │       ├── LeadForm.tsx        ← Form UI
    │       └── QualificationResult.tsx
    ├── package.json
    └── next.config.ts
```

---

## Environment Variables

Create a `.env.local` in `frontend/` and a `.env` at the root for trigger.dev:

```bash
# Anthropic (used inside the trigger.dev job)
ANTHROPIC_API_KEY=sk-ant-...

# trigger.dev (used in both the job and the Next.js API route)
TRIGGER_SECRET_KEY=tr_...           # Server-side — never expose to browser
NEXT_PUBLIC_TRIGGER_API_URL=https://api.trigger.dev  # Public base URL
```

> Never commit `.env` files. Add them to `.gitignore`.

---

## Development Workflow

### Run the frontend locally
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

### Run trigger.dev jobs locally (CLI dev mode)
```bash
# From the root of the project
npx trigger.dev@latest dev
# Connects to trigger.dev cloud but runs jobs on your local machine
```

### Test a job without the UI
```bash
cd Tools
npx tsx scripts/test-workflow.ts
```

---

## Deployment

### Frontend → Vercel
1. Push to GitHub.
2. Connect the repo in Vercel → set root directory to `frontend/`.
3. Add environment variables in the Vercel dashboard.
4. Every push to `main` triggers an automatic deploy.

### Backend → trigger.dev Cloud
```bash
npx trigger.dev@latest deploy
# Deploys all jobs in Workflows/ to trigger.dev cloud
```

Add `ANTHROPIC_API_KEY` and `TRIGGER_SECRET_KEY` in the trigger.dev project dashboard under **Environment Variables**.

---

## Key Conventions

- All trigger.dev tasks live in `Workflows/` and are named `*.job.ts`.
- The Claude system prompt lives in `Workflows/prompts/qualify-lead.md` — edit the prompt there, not inside the job file.
- Shared utilities (API clients, type definitions) go in `Tools/lib/`.
- One-off scripts (seed data, local test runners) go in `Tools/scripts/`.
- The frontend does **not** call the Claude API directly — all AI work happens inside trigger.dev jobs.
