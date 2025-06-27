-- Supabase RLS Policies for Drug Database with Role-Based Access Control
-- Run this after creating the tables from table_ddl.sql

-- =============================================
-- USER ROLES SETUP
-- =============================================

-- Create a function to get user role from auth metadata
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Get role from user metadata, default to 'readonly'
    RETURN COALESCE(
        (auth.jwt() ->> 'user_metadata' ->> 'role'),
        'readonly'
    );
END;
$$;

-- Function to check if user is data editor
CREATE OR REPLACE FUNCTION is_data_editor()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN get_user_role() = 'data_editor';
END;
$$;

-- Function to check if user is authenticated (readonly or data_editor)
CREATE OR REPLACE FUNCTION is_authenticated_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN auth.role() = 'authenticated';
END;
$$;

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE drug_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE generic_drugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE generic_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE generic_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE generic_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE manu_drugs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- LOOKUP TABLES POLICIES (AUTHENTICATED READ, DATA_EDITOR WRITE)
-- =============================================

-- Drug Classes Policies
CREATE POLICY "Allow authenticated read access to drug_classes" ON drug_classes
    FOR SELECT USING (is_authenticated_user());

CREATE POLICY "Allow data editors to insert drug_classes" ON drug_classes
    FOR INSERT WITH CHECK (is_data_editor());

CREATE POLICY "Allow data editors to update drug_classes" ON drug_classes
    FOR UPDATE USING (is_data_editor());

CREATE POLICY "Allow data editors to delete drug_classes" ON drug_classes
    FOR DELETE USING (is_data_editor());

-- Route Types Policies
CREATE POLICY "Allow authenticated read access to route_types" ON route_types
    FOR SELECT USING (is_authenticated_user());

CREATE POLICY "Allow data editors to insert route_types" ON route_types
    FOR INSERT WITH CHECK (is_data_editor());

CREATE POLICY "Allow data editors to update route_types" ON route_types
    FOR UPDATE USING (is_data_editor());

CREATE POLICY "Allow data editors to delete route_types" ON route_types
    FOR DELETE USING (is_data_editor());

-- Countries Policies
CREATE POLICY "Allow authenticated read access to countries" ON countries
    FOR SELECT USING (is_authenticated_user());

CREATE POLICY "Allow data editors to insert countries" ON countries
    FOR INSERT WITH CHECK (is_data_editor());

CREATE POLICY "Allow data editors to update countries" ON countries
    FOR UPDATE USING (is_data_editor());

CREATE POLICY "Allow data editors to delete countries" ON countries
    FOR DELETE USING (is_data_editor());

-- =============================================
-- MAIN TABLES POLICIES (AUTHENTICATED READ, DATA_EDITOR WRITE)
-- =============================================

-- Generic Drugs Policies
CREATE POLICY "Allow authenticated read access to generic_drugs" ON generic_drugs
    FOR SELECT USING (is_authenticated_user());

CREATE POLICY "Allow data editors to insert generic_drugs" ON generic_drugs
    FOR INSERT WITH CHECK (is_data_editor());

CREATE POLICY "Allow data editors to update generic_drugs" ON generic_drugs
    FOR UPDATE USING (is_data_editor());

CREATE POLICY "Allow data editors to delete generic_drugs" ON generic_drugs
    FOR DELETE USING (is_data_editor());

-- Generic Aliases Policies
CREATE POLICY "Allow authenticated read access to generic_aliases" ON generic_aliases
    FOR SELECT USING (is_authenticated_user());

CREATE POLICY "Allow data editors to insert generic_aliases" ON generic_aliases
    FOR INSERT WITH CHECK (is_data_editor());

CREATE POLICY "Allow data editors to update generic_aliases" ON generic_aliases
    FOR UPDATE USING (is_data_editor());

CREATE POLICY "Allow data editors to delete generic_aliases" ON generic_aliases
    FOR DELETE USING (is_data_editor());

-- Generic Routes Policies
CREATE POLICY "Allow authenticated read access to generic_routes" ON generic_routes
    FOR SELECT USING (is_authenticated_user());

CREATE POLICY "Allow data editors to insert generic_routes" ON generic_routes
    FOR INSERT WITH CHECK (is_data_editor());

CREATE POLICY "Allow data editors to update generic_routes" ON generic_routes
    FOR UPDATE USING (is_data_editor());

CREATE POLICY "Allow data editors to delete generic_routes" ON generic_routes
    FOR DELETE USING (is_data_editor());

-- Generic Approvals Policies
CREATE POLICY "Allow authenticated read access to generic_approvals" ON generic_approvals
    FOR SELECT USING (is_authenticated_user());

CREATE POLICY "Allow data editors to insert generic_approvals" ON generic_approvals
    FOR INSERT WITH CHECK (is_data_editor());

CREATE POLICY "Allow data editors to update generic_approvals" ON generic_approvals
    FOR UPDATE USING (is_data_editor());

CREATE POLICY "Allow data editors to delete generic_approvals" ON generic_approvals
    FOR DELETE USING (is_data_editor());

-- Manufactured Drugs Policies
CREATE POLICY "Allow authenticated read access to manu_drugs" ON manu_drugs
    FOR SELECT USING (is_authenticated_user());

CREATE POLICY "Allow data editors to insert manu_drugs" ON manu_drugs
    FOR INSERT WITH CHECK (is_data_editor());

CREATE POLICY "Allow data editors to update manu_drugs" ON manu_drugs
    FOR UPDATE USING (is_data_editor());

CREATE POLICY "Allow data editors to delete manu_drugs" ON manu_drugs
    FOR DELETE USING (is_data_editor());

-- =============================================
-- ENABLE REALTIME (OPTIONAL)
-- =============================================

-- Enable realtime for tables you want to subscribe to changes
ALTER PUBLICATION supabase_realtime ADD TABLE generic_drugs;
ALTER PUBLICATION supabase_realtime ADD TABLE generic_aliases;
ALTER PUBLICATION supabase_realtime ADD TABLE generic_routes;
ALTER PUBLICATION supabase_realtime ADD TABLE generic_approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE manu_drugs;

-- =============================================
-- HELPFUL VIEWS (OPTIONAL)
-- =============================================

-- Create a view that joins drug data with related information
CREATE OR REPLACE VIEW drug_summary AS
SELECT 
    gd.uid as drug_id,
    gd.generic_key,
    gd.generic_name,
    gd.biologic,
    gd.mech_of_action,
    gd.class_or_type,
    gd.target,
    COUNT(DISTINCT ga.uid) as alias_count,
    COUNT(DISTINCT gr.uid) as route_count,
    COUNT(DISTINCT gapp.uid) as approval_count,
    COUNT(DISTINCT md.uid) as product_count
FROM generic_drugs gd
LEFT JOIN generic_aliases ga ON gd.uid = ga.generic_uid
LEFT JOIN generic_routes gr ON gd.uid = gr.generic_uid
LEFT JOIN generic_approvals gapp ON gd.uid = gapp.generic_uid
LEFT JOIN manu_drugs md ON gd.uid = md.generic_uid
GROUP BY gd.uid, gd.generic_key, gd.generic_name, gd.biologic, gd.mech_of_action, gd.class_or_type, gd.target;

-- Note: Views inherit RLS policies from their underlying tables
-- No need to create policies on views directly

-- =============================================
-- STORAGE POLICIES (IF YOU NEED FILE UPLOADS)
-- =============================================

-- Uncomment if you plan to store drug images/documents
-- CREATE POLICY "Allow public read access to drug files" ON storage.objects
--     FOR SELECT USING (bucket_id = 'drug-files');

-- CREATE POLICY "Allow authenticated users to upload drug files" ON storage.objects
--     FOR INSERT WITH CHECK (
--         bucket_id = 'drug-files' AND 
--         auth.role() = 'authenticated'
--     );

-- =============================================
-- FUNCTIONS FOR COMMON OPERATIONS (OPTIONAL)
-- =============================================

-- Function to get drug with all related data
CREATE OR REPLACE FUNCTION get_drug_details(drug_uid UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'drug', row_to_json(gd.*),
        'aliases', COALESCE(array_agg(DISTINCT ga.*) FILTER (WHERE ga.uid IS NOT NULL), ARRAY[]::generic_aliases[]),
        'routes', COALESCE(array_agg(DISTINCT gr.*) FILTER (WHERE gr.uid IS NOT NULL), ARRAY[]::generic_routes[]),
        'approvals', COALESCE(array_agg(DISTINCT gapp.*) FILTER (WHERE gapp.uid IS NOT NULL), ARRAY[]::generic_approvals[]),
        'products', COALESCE(array_agg(DISTINCT md.*) FILTER (WHERE md.uid IS NOT NULL), ARRAY[]::manu_drugs[])
    ) INTO result
    FROM generic_drugs gd
    LEFT JOIN generic_aliases ga ON gd.uid = ga.generic_uid
    LEFT JOIN generic_routes gr ON gd.uid = gr.generic_uid
    LEFT JOIN generic_approvals gapp ON gd.uid = gapp.generic_uid
    LEFT JOIN manu_drugs md ON gd.uid = md.generic_uid
    WHERE gd.uid = drug_uid
    GROUP BY gd.uid;
    
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION get_drug_details(UUID) TO authenticated;

-- =============================================
-- USER ROLE MANAGEMENT FUNCTIONS
-- =============================================

-- Function to set user role (admin only - call from server-side)
CREATE OR REPLACE FUNCTION set_user_role(user_id UUID, new_role TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update user metadata with new role
    UPDATE auth.users 
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', new_role)
    WHERE id = user_id;
END;
$$;

-- Function to get all users with their roles (data editors only)
CREATE OR REPLACE FUNCTION get_users_with_roles()
RETURNS TABLE(user_id UUID, email TEXT, role TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only allow data editors to see user list
    IF NOT is_data_editor() THEN
        RAISE EXCEPTION 'Access denied: Only data editors can view user roles';
    END IF;
    
    RETURN QUERY
    SELECT 
        au.id as user_id,
        au.email,
        COALESCE(au.raw_user_meta_data ->> 'role', 'readonly') as role,
        au.created_at
    FROM auth.users au
    ORDER BY au.created_at DESC;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION set_user_role(UUID, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION get_users_with_roles() TO authenticated; 