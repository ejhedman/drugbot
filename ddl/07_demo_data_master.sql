-- Demo Data Master Script
-- This script runs all demo data files in the correct order
-- Run this after the DDL scripts (00_table_ddl.sql, etc.)

-- =============================================
-- IMPORTANT: Run this script after the DDL setup
-- =============================================

-- Check if tables exist before proceeding
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'generic_drugs') THEN
        RAISE EXCEPTION 'Tables do not exist. Please run the DDL scripts first (00_table_ddl.sql, etc.)';
    END IF;
END $$;

-- =============================================
-- STEP 1: Insert Generic Drugs (500 entries)
-- =============================================

\echo 'Step 1: Inserting 500 generic drugs...'
\i ddl/07a_generic_drugs.sql

-- =============================================
-- STEP 2: Insert Manufactured Drugs (1-20 per generic)
-- =============================================

\echo 'Step 2: Inserting manufactured drugs...'
\i ddl/07b_manu_drugs.sql

-- =============================================
-- STEP 3: Insert Generic Aliases (3-30 per generic)
-- =============================================

\echo 'Step 3: Inserting generic aliases...'
\i ddl/07c_generic_aliases.sql

-- =============================================
-- STEP 4: Insert Generic Routes (5-50 per generic)
-- =============================================

\echo 'Step 4: Inserting generic routes...'
\i ddl/07d_generic_routes.sql

-- =============================================
-- STEP 5: Insert Generic Approvals (3-40 per generic)
-- =============================================

\echo 'Step 5: Inserting generic approvals...'
\i ddl/07e_generic_approvals.sql

-- =============================================
-- STEP 6: Update Relationships and UIDs
-- =============================================

\echo 'Step 6: Updating relationships and UIDs...'
\i ddl/07f_update_relationships.sql

-- =============================================
-- FINAL VERIFICATION
-- =============================================

\echo 'Demo data setup completed!'
\echo 'Summary of data loaded:'

SELECT 'generic_drugs' as table_name, COUNT(*) as row_count FROM generic_drugs
UNION ALL
SELECT 'generic_aliases', COUNT(*) FROM generic_aliases
UNION ALL
SELECT 'generic_routes', COUNT(*) FROM generic_routes
UNION ALL
SELECT 'generic_approvals', COUNT(*) FROM generic_approvals
UNION ALL
SELECT 'manu_drugs', COUNT(*) FROM manu_drugs
UNION ALL
SELECT 'entity_relationships', COUNT(*) FROM entity_relationships
ORDER BY table_name;

\echo 'Demo data is ready for testing!' 