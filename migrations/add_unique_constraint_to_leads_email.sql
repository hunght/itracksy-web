-- Step 1: Find duplicate emails (if any)
WITH duplicate_emails AS (
  SELECT email
  FROM public.leads
  GROUP BY email
  HAVING COUNT(*) > 1
)
SELECT * FROM duplicate_emails;

-- Step 2: Handle duplicates (if needed)
-- This approach keeps only the newest record for each duplicate email
DELETE FROM public.leads
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           email,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as row_num
    FROM public.leads
  ) ranked
  WHERE row_num > 1
);

-- Option B (Alternative): Make duplicate emails unique by adding a suffix
-- Uncomment this if you prefer to keep all records but make emails unique
/*
UPDATE public.leads l
SET email = CONCAT(email, '-', id)
WHERE EXISTS (
  SELECT 1
  FROM public.leads l2
  WHERE l2.email = l.email
  AND l2.id != l.id
  AND l2.created_at > l.created_at
);
*/

-- Step 3: Add the unique constraint after handling duplicates
ALTER TABLE public.leads ADD CONSTRAINT leads_email_unique UNIQUE (email);
