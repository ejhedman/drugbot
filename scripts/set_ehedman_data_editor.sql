-- SQL Script to make ehedman@acm.org a data editor
-- Run this in your Supabase SQL editor

-- =============================================
-- STEP 1: Add user to approved_users table
-- =============================================

-- First, add the user to the approved_users table with data_editor role
INSERT INTO approved_users (email, role, approved_by, notes, is_active) 
VALUES ('ehedman@acm.org', 'data_editor', 'system', 'Primary data editor for drug database', true)
ON CONFLICT (email) 
DO UPDATE SET 
    role = 'data_editor',
    approved_by = 'system',
    notes = 'Primary data editor for drug database',
    is_active = true,
    updated_at = NOW();

-- =============================================
-- STEP 2: Find the user's UUID and set their role
-- =============================================

-- First, let's find the user's UUID
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get the user's UUID from auth.users
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'ehedman@acm.org';
    
    -- If user exists, set their role
    IF user_uuid IS NOT NULL THEN
        -- Set the user's role using the set_user_role function
        PERFORM set_user_role(user_uuid, 'data_editor');
        
        -- Also update the user metadata directly as a backup
        UPDATE auth.users 
        SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
            jsonb_build_object(
                'role', 'data_editor',
                'approved', true
            )
        WHERE id = user_uuid;
        
        RAISE NOTICE 'Successfully set role for user % (UUID: %)', 'ehedman@acm.org', user_uuid;
    ELSE
        RAISE NOTICE 'User % not found in auth.users table. They may need to sign up first.', 'ehedman@acm.org';
    END IF;
END $$;

-- =============================================
-- STEP 3: Verify the changes
-- =============================================

-- Check if user is in approved_users table
SELECT 
    email,
    role,
    is_active,
    approved_at,
    notes
FROM approved_users 
WHERE email = 'ehedman@acm.org';

-- Check user's role in auth.users (if they exist)
SELECT 
    email,
    raw_user_meta_data ->> 'role' as role,
    raw_user_meta_data ->> 'approved' as approved,
    created_at
FROM auth.users 
WHERE email = 'ehedman@acm.org';

-- =============================================
-- STEP 4: Test the approval functions
-- =============================================

-- Test if the user is approved
SELECT 
    'ehedman@acm.org' as email,
    is_user_approved('ehedman@acm.org') as is_approved,
    get_approved_user_role('ehedman@acm.org') as approved_role;

-- =============================================
-- NOTES
-- =============================================

/*
This script does the following:

1. Adds ehedman@acm.org to the approved_users table with data_editor role
2. Finds the user's UUID in auth.users (if they exist)
3. Sets their role using the set_user_role function
4. Updates their user metadata directly as a backup
5. Verifies all changes were applied correctly

If the user doesn't exist in auth.users yet, they'll need to:
1. Sign up through the app first
2. Run this script again to set their role

The user will have full data editor permissions once they sign in.
*/ 