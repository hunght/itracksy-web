create table public.feedback (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    name text not null,
    email text not null,
    feedback_type text not null check (feedback_type in ('general', 'bug', 'feature', 'other')),
    message text not null
);

-- Set up Row Level Security (RLS)
alter table public.feedback enable row level security;

-- Create policies
create policy "Allow anonymous insert" on public.feedback
    for insert with check (true);

create policy "Allow authenticated read" on public.feedback
    for select using (auth.role() = 'authenticated');
