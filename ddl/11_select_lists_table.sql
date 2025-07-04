-- =============================================
-- Table: select_lists
-- Stores select list definitions (all public)
-- =============================================
CREATE TABLE select_lists (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for select_lists
COMMENT ON TABLE select_lists IS 'Select list definitions for dropdown values (all public)';
COMMENT ON COLUMN select_lists.uid IS 'Primary key - unique identifier (GUID)';
COMMENT ON COLUMN select_lists.name IS 'Internal name for the select list (used for API calls)';
COMMENT ON COLUMN select_lists.display_name IS 'Human-readable name displayed in the UI';
COMMENT ON COLUMN select_lists.items IS 'JSON array of select list items with text, code, and ordinal properties';
COMMENT ON COLUMN select_lists.created_at IS 'Timestamp when the select list was created';
COMMENT ON COLUMN select_lists.updated_at IS 'Timestamp when the select list was last modified';

-- Create indexes
CREATE INDEX idx_select_lists_name ON select_lists(name);
CREATE INDEX idx_select_lists_created_at ON select_lists(created_at);

-- Create updated_at trigger (reuse existing function)
CREATE TRIGGER update_select_lists_updated_at 
    BEFORE UPDATE ON select_lists 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE select_lists ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view all select lists
CREATE POLICY "Users can view all select lists" ON select_lists
    FOR SELECT USING (auth.role() = 'authenticated');

-- All authenticated users can create select lists
CREATE POLICY "Users can create select lists" ON select_lists
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- All authenticated users can update all select lists
CREATE POLICY "Users can update all select lists" ON select_lists
    FOR UPDATE USING (auth.role() = 'authenticated');

-- All authenticated users can delete all select lists
CREATE POLICY "Users can delete all select lists" ON select_lists
    FOR DELETE USING (auth.role() = 'authenticated'); 