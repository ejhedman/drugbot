-- Functions for the approved users system
-- Run this since you already have the approved_users table

-- Function to check if user is approved
CREATE OR REPLACE FUNCTION is_user_approved(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM approved_users 
        WHERE email = user_email 
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's approved role
CREATE OR REPLACE FUNCTION get_approved_user_role(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM approved_users 
    WHERE email = user_email 
    AND is_active = true;
    
    RETURN COALESCE(user_role, 'readonly');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add your email address to test the system
-- REPLACE 'your-email@example.com' with your actual email
INSERT INTO approved_users (email, role, approved_by, notes) VALUES
('your-email@example.com', 'data_editor', 'system', 'Initial admin user')
ON CONFLICT (email) DO NOTHING; 