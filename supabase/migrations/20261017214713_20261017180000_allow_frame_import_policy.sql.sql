/*
# Allow public uploads to scroll-frames bucket

1. Purpose
- This is a one-time migration used to bulk-import 758 film frames into the
  `scroll-frames` storage bucket via the storage API using the anon key.
- It grants anonymous INSERT permission on the bucket so the import can run.

2. Security
- Adds an INSERT policy on storage.objects for the scroll-frames bucket,
  scoped to the `frames/` path prefix only.
- Read access is already covered because the bucket is public.

3. Important notes
- This policy exists solely to enable the frame import and is intended to be
  dropped after the import completes. It does not allow reads, updates, or
  deletes by anonymous clients, and the bucket remains read-only for the
  public after the policy is removed.
*/

CREATE POLICY "allow_anon_insert_frames_import"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'scroll-frames' AND (storage.foldername(name))[1] = 'frames');