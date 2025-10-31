-- Fix security warnings by setting search_path for functions

-- Update generate_booking_reference function
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT 
LANGUAGE plpgsql 
VOLATILE
SET search_path = public
AS $$
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
$$;

-- Update set_booking_reference function
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference := generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$;