-- Create table for Android beta signups
CREATE TABLE IF NOT EXISTS android_beta_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_android_beta_signups_email ON android_beta_signups(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_android_beta_signups_created_at ON android_beta_signups(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE android_beta_signups ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for public signup form)
CREATE POLICY "Allow public insert" ON android_beta_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can read (for admin dashboard if needed)
CREATE POLICY "Allow authenticated read" ON android_beta_signups
  FOR SELECT
  TO authenticated
  USING (true);

