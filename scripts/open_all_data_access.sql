-- SQL Script to open all data for reading and writing to all authenticated users
-- WARNING: This removes all role-based access control and allows any authenticated user full access
-- Run this in your Supabase SQL editor

-- =============================================
-- STEP 1: Drop existing restrictive policies
-- =============================================

-- Drop all existing RLS policies that restrict access
DROP POLICY IF EXISTS "Allow authenticated read access to drug_classes" ON drug_classes;
DROP POLICY IF EXISTS "Allow data editors to insert drug_classes" ON drug_classes;
DROP POLICY IF EXISTS "Allow data editors to update drug_classes" ON drug_classes;
DROP POLICY IF EXISTS "Allow data editors to delete drug_classes" ON drug_classes;

DROP POLICY IF EXISTS "Allow authenticated read access to route_types" ON route_types;
DROP POLICY IF EXISTS "Allow data editors to insert route_types" ON route_types;
DROP POLICY IF EXISTS "Allow data editors to update route_types" ON route_types;
DROP POLICY IF EXISTS "Allow data editors to delete route_types" ON route_types;

DROP POLICY IF EXISTS "Allow authenticated read access to countries" ON countries;
DROP POLICY IF EXISTS "Allow data editors to insert countries" ON countries;
DROP POLICY IF EXISTS "Allow data editors to update countries" ON countries;
DROP POLICY IF EXISTS "Allow data editors to delete countries" ON countries;

DROP POLICY IF EXISTS "Allow authenticated read access to generic_drugs" ON generic_drugs;
DROP POLICY IF EXISTS "Allow data editors to insert generic_drugs" ON generic_drugs;
DROP POLICY IF EXISTS "Allow data editors to update generic_drugs" ON generic_drugs;
DROP POLICY IF EXISTS "Allow data editors to delete generic_drugs" ON generic_drugs;

DROP POLICY IF EXISTS "Allow authenticated read access to generic_aliases" ON generic_aliases;
DROP POLICY IF EXISTS "Allow data editors to insert generic_aliases" ON generic_aliases;
DROP POLICY IF EXISTS "Allow data editors to update generic_aliases" ON generic_aliases;
DROP POLICY IF EXISTS "Allow data editors to delete generic_aliases" ON generic_aliases;

DROP POLICY IF EXISTS "Allow authenticated read access to generic_routes" ON generic_routes;
DROP POLICY IF EXISTS "Allow data editors to insert generic_routes" ON generic_routes;
DROP POLICY IF EXISTS "Allow data editors to update generic_routes" ON generic_routes;
DROP POLICY IF EXISTS "Allow data editors to delete generic_routes" ON generic_routes;

DROP POLICY IF EXISTS "Allow authenticated read access to generic_approvals" ON generic_approvals;
DROP POLICY IF EXISTS "Allow data editors to insert generic_approvals" ON generic_approvals;
DROP POLICY IF EXISTS "Allow data editors to update generic_approvals" ON generic_approvals;
DROP POLICY IF EXISTS "Allow data editors to delete generic_approvals" ON generic_approvals;

DROP POLICY IF EXISTS "Allow authenticated read access to manu_drugs" ON manu_drugs;
DROP POLICY IF EXISTS "Allow data editors to insert manu_drugs" ON manu_drugs;
DROP POLICY IF EXISTS "Allow data editors to update manu_drugs" ON manu_drugs;
DROP POLICY IF EXISTS "Allow data editors to delete manu_drugs" ON manu_drugs;

-- Drop approval-based policies if they exist
DROP POLICY IF EXISTS "Approved users can read generic_drugs" ON generic_drugs;
DROP POLICY IF EXISTS "Approved data editors can modify generic_drugs" ON generic_drugs;
DROP POLICY IF EXISTS "Approved users can read generic_aliases" ON generic_aliases;
DROP POLICY IF EXISTS "Approved data editors can modify generic_aliases" ON generic_aliases;
DROP POLICY IF EXISTS "Approved users can read generic_routes" ON generic_routes;
DROP POLICY IF EXISTS "Approved data editors can modify generic_routes" ON generic_routes;
DROP POLICY IF EXISTS "Approved users can read generic_approvals" ON generic_approvals;
DROP POLICY IF EXISTS "Approved data editors can modify generic_approvals" ON generic_approvals;
DROP POLICY IF EXISTS "Approved users can read manu_drugs" ON manu_drugs;
DROP POLICY IF EXISTS "Approved data editors can modify manu_drugs" ON manu_drugs;

-- =============================================
-- STEP 2: Create open access policies for all tables
-- =============================================

-- Drug Classes - Full access for authenticated users
CREATE POLICY "Allow full access to drug_classes for authenticated users" ON drug_classes
    FOR ALL USING (auth.role() = 'authenticated');

-- Route Types - Full access for authenticated users
CREATE POLICY "Allow full access to route_types for authenticated users" ON route_types
    FOR ALL USING (auth.role() = 'authenticated');

-- Countries - Full access for authenticated users
CREATE POLICY "Allow full access to countries for authenticated users" ON countries
    FOR ALL USING (auth.role() = 'authenticated');

-- Generic Drugs - Full access for authenticated users
CREATE POLICY "Allow full access to generic_drugs for authenticated users" ON generic_drugs
    FOR ALL USING (auth.role() = 'authenticated');

-- Generic Aliases - Full access for authenticated users
CREATE POLICY "Allow full access to generic_aliases for authenticated users" ON generic_aliases
    FOR ALL USING (auth.role() = 'authenticated');

-- Generic Routes - Full access for authenticated users
CREATE POLICY "Allow full access to generic_routes for authenticated users" ON generic_routes
    FOR ALL USING (auth.role() = 'authenticated');

-- Generic Approvals - Full access for authenticated users
CREATE POLICY "Allow full access to generic_approvals for authenticated users" ON generic_approvals
    FOR ALL USING (auth.role() = 'authenticated');

-- Manufactured Drugs - Full access for authenticated users
CREATE POLICY "Allow full access to manu_drugs for authenticated users" ON manu_drugs
    FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- STEP 3: Update or create simplified role functions
-- =============================================

-- Simplify the get_user_role function to always return 'data_editor'
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Return data_editor for all authenticated users
    RETURN 'data_editor';
END;
$$;

-- Simplify the is_data_editor function to always return true for authenticated users
CREATE OR REPLACE FUNCTION is_data_editor()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Return true for all authenticated users
    RETURN auth.role() = 'authenticated';
END;
$$;

-- Simplify the is_authenticated_user function
CREATE OR REPLACE FUNCTION is_authenticated_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN auth.role() = 'authenticated';
END;
$$;

-- Simplify approval functions to always return true for authenticated users
CREATE OR REPLACE FUNCTION is_user_approved(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Return true for any authenticated user
    RETURN auth.role() = 'authenticated';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_approved_user_role(user_email TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Return data_editor for any authenticated user
    RETURN 'data_editor';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_current_user_approved()
RETURNS BOOLEAN AS $$
BEGIN
    -- Return true for any authenticated user
    RETURN auth.role() = 'authenticated';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_current_user_data_editor()
RETURNS BOOLEAN AS $$
BEGIN
    -- Return true for any authenticated user
    RETURN auth.role() = 'authenticated';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- STEP 4: Grant permissions to authenticated role
-- =============================================

-- Grant all permissions to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant specific permissions for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;

-- =============================================
-- STEP 5: Verify the changes
-- =============================================

-- Show all policies for each table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Test the role functions
SELECT 
    'get_user_role()' as function_name,
    get_user_role() as result
UNION ALL
SELECT 
    'is_data_editor()' as function_name,
    is_data_editor()::text as result
UNION ALL
SELECT 
    'is_authenticated_user()' as function_name,
    is_authenticated_user()::text as result;

-- =============================================
-- STEP 6: Optional - Set all existing users as data_editors
-- =============================================

-- Update all existing users to have data_editor role
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
        'role', 'data_editor',
        'approved', true
    )
WHERE raw_user_meta_data ->> 'role' IS NULL 
   OR raw_user_meta_data ->> 'role' = 'readonly';

-- =============================================
-- WARNING AND NOTES
-- =============================================

/*
⚠️  WARNING: This script removes all role-based access control!

What this script does:
1. Drops all existing restrictive RLS policies
2. Creates new policies that allow full access to all authenticated users
3. Updates all role-checking functions to return permissive values
4. Grants all database permissions to authenticated users
5. Sets all existing users as data_editors

SECURITY IMPLICATIONS:
- Any authenticated user can now read, write, update, and delete ALL data
- No approval process is required
- No role checking is performed
- This essentially makes the database "open" to all users

To reverse these changes:
1. Restore the original DDL scripts (02_supabase_policies.sql, etc.)
2. Re-run the role-based access control setup
3. Re-set specific user roles as needed

This is useful for:
- Development environments
- Testing scenarios
- Open collaboration projects
- When you want to remove all access restrictions

NOT recommended for production environments with sensitive data!
*/ 