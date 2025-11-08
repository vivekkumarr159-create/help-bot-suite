-- Fix nullable user_id security issue in bookings table
-- Step 1: Delete orphaned bookings with NULL user_id (these are invalid/insecure records)
DELETE FROM public.bookings WHERE user_id IS NULL;

-- Step 2: Add NOT NULL constraint to user_id column
ALTER TABLE public.bookings 
ALTER COLUMN user_id SET NOT NULL;

-- Step 3: Update the RLS policy to remove redundant NULL check
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON public.bookings;

CREATE POLICY "Authenticated users can create bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);