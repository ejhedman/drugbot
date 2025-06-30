-- Script to set user role to data_editor
-- Run this in your Supabase SQL editor or via psql

-- Set the role for the current user (replace with your user ID)
-- You can find your user ID in the server logs: c8c042ee-0e33-49fd-a391-1db9d3881a21

SELECT set_user_role('c8c042ee-0e33-49fd-a391-1db9d3881a21', 'data_editor');

-- Verify the role was set
SELECT 
    id,
    email,
    raw_user_meta_data ->> 'role' as role
FROM auth.users 
WHERE id = 'c8c042ee-0e33-49fd-a391-1db9d3881a21'; 