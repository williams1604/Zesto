/*
# Promote user to admin by email

## Overview
Creates a SECURITY DEFINER function that allows promoting a user to admin role
by their email address. This is needed because the first user who signs up
will be a 'customer' by default, and we need a way to grant them admin access
to the admin dashboard.

## Function: promote_to_admin(email text)
- Looks up the user in auth.users by email.
- Updates their profile role to 'admin'.
- SECURITY DEFINER so it can access auth.users (which profiles table RLS doesn't expose).
- Only callable by authenticated users (for security).
*/

CREATE OR REPLACE FUNCTION promote_to_admin(target_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_uid uuid;
BEGIN
  SELECT id INTO target_uid FROM auth.users WHERE email = target_email;
  IF target_uid IS NULL THEN
    RETURN 'user not found';
  END IF;

  UPDATE profiles SET role = 'admin' WHERE id = target_uid;
  RETURN 'promoted to admin';
END;
$$;

GRANT EXECUTE ON FUNCTION promote_to_admin(text) TO authenticated;
