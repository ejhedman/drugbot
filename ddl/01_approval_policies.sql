-- Enhanced RLS policies that check for user approval
-- Drop existing policies first
DROP POLICY IF EXISTS "Authenticated users can read all data" ON generic_drugs;
DROP POLICY IF EXISTS "Data editors can modify data" ON generic_drugs;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON generic_aliases;
DROP POLICY IF EXISTS "Data editors can modify data" ON generic_aliases;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON generic_routes;
DROP POLICY IF EXISTS "Data editors can modify data" ON generic_routes;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON generic_approvals;
DROP POLICY IF EXISTS "Data editors can modify data" ON generic_approvals;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON manu_drugs;
DROP POLICY IF EXISTS "Data editors can modify data" ON manu_drugs;

-- Function to check if current user is approved
CREATE OR REPLACE FUNCTION is_current_user_approved()
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user is authenticated and approved
    RETURN (
        auth.uid() IS NOT NULL 
        AND 
        is_user_approved(auth.email())
        AND
        COALESCE((auth.jwt() ->> 'user_metadata')::json ->> 'approved', 'false')::boolean = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user has data editor role
CREATE OR REPLACE FUNCTION is_current_user_data_editor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        is_current_user_approved()
        AND
        COALESCE((auth.jwt() ->> 'user_metadata')::json ->> 'role', 'readonly') = 'data_editor'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new policies for generic_drugs
CREATE POLICY "Approved users can read generic_drugs" ON generic_drugs
FOR SELECT USING (is_current_user_approved());

CREATE POLICY "Approved data editors can modify generic_drugs" ON generic_drugs
FOR ALL USING (is_current_user_data_editor());

-- Create new policies for generic_aliases
CREATE POLICY "Approved users can read generic_aliases" ON generic_aliases
FOR SELECT USING (is_current_user_approved());

CREATE POLICY "Approved data editors can modify generic_aliases" ON generic_aliases
FOR ALL USING (is_current_user_data_editor());

-- Create new policies for generic_routes
CREATE POLICY "Approved users can read generic_routes" ON generic_routes
FOR SELECT USING (is_current_user_approved());

CREATE POLICY "Approved data editors can modify generic_routes" ON generic_routes
FOR ALL USING (is_current_user_data_editor());

-- Create new policies for generic_approvals
CREATE POLICY "Approved users can read generic_approvals" ON generic_approvals
FOR SELECT USING (is_current_user_approved());

CREATE POLICY "Approved data editors can modify generic_approvals" ON generic_approvals
FOR ALL USING (is_current_user_data_editor());

-- Create new policies for manu_drugs
CREATE POLICY "Approved users can read manu_drugs" ON manu_drugs
FOR SELECT USING (is_current_user_approved());

CREATE POLICY "Approved data editors can modify manu_drugs" ON manu_drugs
FOR ALL USING (is_current_user_data_editor()); 