-- Approved Users Table for Pre-Authorization
CREATE TABLE approved_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    github_username TEXT,
    role TEXT NOT NULL DEFAULT 'readonly' CHECK (role IN ('readonly', 'data_editor')),
    approved_by TEXT,
    approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE approved_users ENABLE ROW LEVEL SECURITY;

-- Only service role can manage approved users
CREATE POLICY "Only service role can manage approved users" ON approved_users
FOR ALL USING (false);

-- Create indexes
CREATE INDEX idx_approved_users_email ON approved_users(email);
CREATE INDEX idx_approved_users_github ON approved_users(github_username);
CREATE INDEX idx_approved_users_active ON approved_users(is_active);

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

-- Insert initial approved users (replace with your actual emails)
INSERT INTO approved_users (email, role, approved_by, notes) VALUES
('your-email@example.com', 'data_editor', 'system', 'Initial admin user'),
('colleague@example.com', 'readonly', 'system', 'Read-only access user');

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_approved_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_approved_users_updated_at
    BEFORE UPDATE ON approved_users
    FOR EACH ROW
    EXECUTE FUNCTION update_approved_users_updated_at(); 