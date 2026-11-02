-- ==============================================================================
-- BlueFarm Account Deletion: Database Webhook / Trigger for send-deletion-email
-- ==============================================================================
-- This migration ensures that whenever a row is inserted into public.account_deletion_requests,
-- an automated notification email is dispatched directly from Supabase, completely independent
-- of client browser sessions, token revocation, or ad blockers.

-- Enable pg_net extension if not already enabled (standard in Supabase for async HTTP calls)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Function that invokes the send-deletion-email Edge Function
CREATE OR REPLACE FUNCTION public.handle_new_deletion_request_email()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, extensions
LANGUAGE plpgsql
AS $$
DECLARE
  v_url TEXT;
  v_anon_key TEXT;
  v_payload JSONB;
BEGIN
  -- Construct payload matching both direct invocation and webhook format
  v_payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'account_deletion_requests',
    'record', jsonb_build_object(
      'id', NEW.id,
      'user_id', NEW.user_id,
      'reference_code', NEW.reference_code,
      'account_type', NEW.account_type,
      'reason', NEW.reason,
      'contact_email', NEW.contact_email,
      'contact_phone', NEW.contact_phone,
      'requested_at', NEW.requested_at
    ),
    'reference_code', NEW.reference_code,
    'account_type', NEW.account_type,
    'reason', NEW.reason,
    'contact', COALESCE(NEW.contact_phone, NEW.contact_email, 'Not specified'),
    'user_email', NEW.contact_email,
    'requested_at', NEW.requested_at
  );

  -- Edge Function endpoint for BlueFarm project
  v_url := 'https://ttipwqpiwqwejvxtzqqn.supabase.co/functions/v1/send-deletion-email';
  v_anon_key := 'sb_publishable_2cW0EppUpaTpRhuumLGzMA_0JS00vKw';

  -- Asynchronously dispatch HTTP POST via pg_net (non-blocking for user transaction)
  PERFORM extensions.net_http_post(
    v_url,
    v_payload,
    '{}'::jsonb,
    jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', v_anon_key,
      'Authorization', 'Bearer ' || v_anon_key
    ),
    5000
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Never block the user deletion request if the email dispatch network fails
    RAISE WARNING 'handle_new_deletion_request_email failed: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS tr_send_deletion_email ON public.account_deletion_requests;

-- Create trigger on INSERT
CREATE TRIGGER tr_send_deletion_email
  AFTER INSERT ON public.account_deletion_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_deletion_request_email();

COMMENT ON FUNCTION public.handle_new_deletion_request_email() IS
  'Dispatches asynchronous email notification via Supabase pg_net whenever an account deletion request is recorded.';

