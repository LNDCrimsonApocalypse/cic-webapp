-- =============================================================================
-- add_request_attachments_bucket.sql
--
-- Creates the Supabase Storage bucket used by the Social Media request form to
-- persist user-uploaded attachments (PNG / JPEG / PDF) and exposes them via
-- public URLs so they're viewable on the submission detail page.
--
-- Run once in Supabase → SQL Editor. Safe to re-run — both statements are
-- conditionally guarded.
--
-- What this does:
--   1. Creates a public Storage bucket named `request-attachments`.
--      Files placed here are readable by anyone with the URL.
--   2. Allows any authenticated user to UPLOAD files to that bucket.
--      (Read access is implicitly granted by the bucket being public.)
-- =============================================================================

-- 1) Create the bucket (idempotent).
INSERT INTO storage.buckets (id, name, public)
VALUES ('request-attachments', 'request-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- 2) Allow authenticated users to upload into this bucket.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload request attachments'
  ) THEN
    CREATE POLICY "Authenticated users can upload request attachments"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'request-attachments');
  END IF;
END $$;

-- Public read is already covered by `public = true` on the bucket itself,
-- which generates anonymous-readable URLs via `storage.objects` implicit policy.
