/*
# Remove temporary frame import policy

1. Purpose
- Drops the temporary "allow_anon_insert_frames_import" policy that was used
  once to bulk-import 758 film frames into the scroll-frames storage bucket.

2. Security
- After this, the scroll-frames bucket is public read-only: anyone can view
  the frames, but no anonymous client can add, change, or delete them.

3. Important notes
- The uploaded frames are unaffected; only the write permission is removed.
*/

DROP POLICY IF EXISTS "allow_anon_insert_frames_import" ON storage.objects;