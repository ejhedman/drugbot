-- =============================================
-- Table: reports
-- Stores user-created report definitions
-- =============================================
CREATE TABLE reports (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    owner_uid UUID NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    report_type VARCHAR(100) NOT NULL,
    report_definition JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for reports
COMMENT ON TABLE reports IS 'User-created report definitions and configurations';
COMMENT ON COLUMN reports.uid IS 'Primary key - unique identifier (GUID)';
COMMENT ON COLUMN reports.name IS 'Internal name for the report (used for API calls)';
COMMENT ON COLUMN reports.display_name IS 'Human-readable name displayed in the UI';
COMMENT ON COLUMN reports.owner_uid IS 'User ID who created this report';
COMMENT ON COLUMN reports.is_public IS 'Whether this report is visible to all users';
COMMENT ON COLUMN reports.report_type IS 'Type of report (e.g., GenericDrugsWideView)';
COMMENT ON COLUMN reports.report_definition IS 'JSON configuration defining the report columns and filters';
COMMENT ON COLUMN reports.created_at IS 'Timestamp when the report was created';
COMMENT ON COLUMN reports.updated_at IS 'Timestamp when the report was last modified';

-- Create indexes
CREATE INDEX idx_reports_owner_uid ON reports(owner_uid);
CREATE INDEX idx_reports_is_public ON reports(is_public);
CREATE INDEX idx_reports_report_type ON reports(report_type);
CREATE INDEX idx_reports_created_at ON reports(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reports_updated_at 
    BEFORE UPDATE ON reports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Users can view their own reports and public reports
CREATE POLICY "Users can view own reports" ON reports
    FOR SELECT USING (owner_uid = auth.uid() OR is_public = true);

-- Users can insert their own reports
CREATE POLICY "Users can create own reports" ON reports
    FOR INSERT WITH CHECK (owner_uid = auth.uid());

-- Users can update their own reports
CREATE POLICY "Users can update own reports" ON reports
    FOR UPDATE USING (owner_uid = auth.uid());

-- Users can delete their own reports
CREATE POLICY "Users can delete own reports" ON reports
    FOR DELETE USING (owner_uid = auth.uid()); 