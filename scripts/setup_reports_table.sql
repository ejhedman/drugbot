-- Setup script for reports feature
-- Run this to create the reports table and add sample data

-- Create the reports table
\i ddl/09_reports_table.sql

-- Insert some sample reports for testing
-- Note: Replace 'your-user-id-here' with an actual user ID from your auth.users table

INSERT INTO reports (name, display_name, owner_uid, is_public, report_type, report_definition) VALUES
(
  'my_drug_report',
  'My Drug Report',
  'your-user-id-here', -- Replace with actual user ID
  false,
  'GenericDrugsWideView',
  '{"selectedColumns": ["generic_name", "manufacturer", "route_type", "country"], "filters": {}}'
),
(
  'public_drug_report',
  'Public Drug Report',
  'your-user-id-here', -- Replace with actual user ID
  true,
  'GenericDrugsWideView',
  '{"selectedColumns": ["generic_name", "class_or_type", "target", "approval_date"], "filters": {}}'
);

-- Show the created reports
SELECT * FROM reports; 