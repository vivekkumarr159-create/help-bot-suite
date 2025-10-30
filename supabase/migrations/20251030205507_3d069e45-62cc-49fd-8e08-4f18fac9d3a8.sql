-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('museum', 'library', 'sports', 'movie', 'event')),
  booking_data JSONB NOT NULL,
  qr_code_data TEXT NOT NULL,
  booking_reference TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'used')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (users can view all bookings)
CREATE POLICY "Anyone can view bookings" 
ON public.bookings 
FOR SELECT 
USING (true);

-- Create policy for inserting bookings
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_bookings_reference ON public.bookings(booking_reference);
CREATE INDEX idx_bookings_type ON public.bookings(booking_type);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Trigger to auto-generate booking reference
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference := generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_reference_trigger
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION set_booking_reference();