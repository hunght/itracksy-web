-- Add group column to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS "group" TEXT;

-- Optional: Create an index for faster queries when filtering by group
CREATE INDEX IF NOT EXISTS leads_group_idx ON public.leads ("group");
