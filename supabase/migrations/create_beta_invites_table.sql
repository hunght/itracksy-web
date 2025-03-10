create table public.beta_invites (
    id uuid default gen_random_uuid() primary key,
    lead_id uuid references public.leads(id) on delete cascade,
    email text not null,
    name text not null,
    invite_message text not null,
    sent_at timestamptz not null default now(),
    status text not null default 'sent' check (status in ('sent', 'opened', 'clicked', 'registered')),
    opened_at timestamptz,
    clicked_at timestamptz,
    registered_at timestamptz
);

-- Set up Row Level Security (RLS)
alter table public.beta_invites enable row level security;

-- Create policies
create policy "Allow authenticated insert" on public.beta_invites
    for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated read" on public.beta_invites
    for select using (auth.role() = 'authenticated');
