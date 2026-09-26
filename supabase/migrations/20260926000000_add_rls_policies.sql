-- contact_submissions: public can insert (send a message), nobody can read
-- back through the API. Kept private, viewable only from the Supabase
-- dashboard with an authenticated project login.
create policy "public can submit contact form"
  on public.contact_submissions
  for insert
  to anon
  with check (true);

-- demo_events: public can insert (track a demo run) and read (the
-- "N runs so far" counter on each demo page). Aggregate counts only, no
-- identifying data, safe to expose.
create policy "public can log a demo event"
  on public.demo_events
  for insert
  to anon
  with check (true);

create policy "public can read demo event counts"
  on public.demo_events
  for select
  to anon
  using (true);

-- workflow_runs: fully public read/insert. This is simulated ops data with
-- a "trigger a workflow run" button on the live demo, an intentional,
-- narrowly-scoped open policy rather than an oversight.
create policy "public can read workflow runs"
  on public.workflow_runs
  for select
  to anon
  using (true);

create policy "public can trigger a workflow run"
  on public.workflow_runs
  for insert
  to anon
  with check (true);
