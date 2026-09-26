-- Contact form submissions from the portfolio site.
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null
);

alter table public.contact_submissions enable row level security;

-- Per-demo run counters, shown as "N runs so far" on each /demos/* page.
create table if not exists public.demo_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  demo_slug text not null,
  event_type text not null default 'run'
);

create index if not exists demo_events_slug_idx on public.demo_events (demo_slug);

alter table public.demo_events enable row level security;

-- Simulated scheduled-workflow run history for the Ops Automation dashboard demo.
create table if not exists public.workflow_runs (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  workflow_name text not null,
  status text not null check (status in ('success', 'failed')),
  duration_ms integer not null,
  source text not null default 'manual trigger'
);

create index if not exists workflow_runs_created_at_idx on public.workflow_runs (created_at desc);

alter table public.workflow_runs enable row level security;

insert into public.workflow_runs (workflow_name, status, duration_ms, source, created_at)
values
  ('job-board-crawler', 'success', 2140, 'cron: */30 * * * *', now() - interval '2 days'),
  ('resume-keyword-sync', 'success', 980, 'manual trigger', now() - interval '2 days' + interval '3 hours'),
  ('notion-pipeline-sync', 'failed', 640, 'webhook: notion.page_updated', now() - interval '1 day 20 hours'),
  ('gmail-followup-drafts', 'success', 3120, 'cron: 0 8 * * *', now() - interval '1 day 12 hours'),
  ('crm-lead-enrichment', 'success', 1780, 'cron: */30 * * * *', now() - interval '1 day 6 hours'),
  ('interview-scheduler', 'success', 1420, 'manual trigger', now() - interval '1 day 2 hours'),
  ('job-board-crawler', 'success', 2280, 'cron: */30 * * * *', now() - interval '20 hours'),
  ('resume-keyword-sync', 'failed', 510, 'manual trigger', now() - interval '16 hours'),
  ('notion-pipeline-sync', 'success', 700, 'webhook: notion.page_updated', now() - interval '12 hours'),
  ('gmail-followup-drafts', 'success', 2960, 'cron: 0 8 * * *', now() - interval '8 hours'),
  ('crm-lead-enrichment', 'success', 1650, 'cron: */30 * * * *', now() - interval '4 hours'),
  ('interview-scheduler', 'success', 1390, 'manual trigger', now() - interval '90 minutes');
