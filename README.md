# Kumail Rizvi, portfolio

A portfolio where every project is a live, running thing, not a screenshot. Built with Next.js
on the frontend and real Go, Python, and TypeScript backends, deployed on Vercel with Supabase
for anything that needs to persist.

**Live:** _deployed on Vercel, see the live demo links below_
**Resume:** [`/resume-kumail-rizvi.pdf`](./public/resume-kumail-rizvi.pdf)

## Why it's built this way

Most portfolios describe projects. This one runs them. Each card on the homepage links to a page
that actually executes real backend code when you interact with it:

| Demo | Route | Backend | What it proves |
|---|---|---|---|
| Cluster Pulse | `/demos/cluster-pulse` | `api/fleet-status.go` (Go) | A real Go service simulating fleet health, latency, and rollout risk, with an interactive load-spike trigger |
| Qmail | `/demos/qmail` | `api/scam-classify.py` (Python) | A real weighted heuristic scam classifier, mirroring the shape of the LLM-based one in the original hackathon project |
| PawPass | `/demos/pawpass` | `api/rag-chat.py` (Python) | Real retrieval (keyword scoring over a seeded dataset) grounding a chat answer, the same retrieve-then-ground shape as the production RAG pipeline |
| Ops Automation | `/demos/workflow-automation` | `src/app/api/workflow-status` (TypeScript + Supabase) | A dashboard reading and writing real rows in Postgres, with a button that inserts a live run |
| UP2DATE | `/demos/up2date` | `src/app/api/predict-window` (TypeScript) | Domain-grounded internship posting-window prediction plus a resume keyword matcher |

None of the demos need a paid LLM API key to run publicly (see "On simulation" below), but every
line of backend logic behind them is real, inspectable code, not a mock.

## Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion, Chart.js
- **Backend:** a genuinely polyglot `/api` directory: Go, Python, and TypeScript serverless
  functions side by side, all deployed by Vercel's zero-config multi-runtime support
- **Database:** Supabase (Postgres), row-level security policies scoped per table, no service-role
  key anywhere in the app (see `supabase/migrations/`)
- **Hosting:** Vercel

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in your own Supabase project's URL + anon key
npm run dev
```

The Go and Python functions under `api/` are Vercel-specific serverless functions and don't run
under `next dev`; the fastest way to exercise them locally is `vercel dev`, or just deploy a
preview and test there.

To regenerate the resume PDF from the structured content in `src/lib/data.ts` and
`scripts/generate_resume.py`:

```bash
npm run resume
```

## Database

Schema and RLS policies live in `supabase/migrations/` and are applied in order. There is no
service-role key in this codebase on purpose: every table the app touches has a narrow policy for
exactly the operation the app needs (see the migration files for the reasoning per table).

## On simulation

The four AI-flavored demos (Qmail, PawPass, UP2DATE, and Ops Automation's scheduled-workflow
history) are built to be publicly clickable without an API key, a rate limit, or a per-request
cost. Each demo page has a "How this demo actually works" section that's specific about what's
real (the retrieval, the heuristics, the database writes) and what's simulated (the underlying
LLM call the production version would make). Cluster Pulse's Go service simulates the fleet it
monitors the same way: real Go code, a real API contract, telemetry that isn't backed by an
actual Kubernetes cluster.
