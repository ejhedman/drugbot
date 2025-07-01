-- Test script for the Generic Drugs Wide View
-- This script tests the SQL view creation and basic queries

-- Test 1: Create the view
\echo '=== Testing Generic Drugs Wide View ==='

-- Drop the view if it exists
DROP VIEW IF EXISTS generic_drugs_wide_view;

-- Create the wide view
CREATE VIEW generic_drugs_wide_view AS
SELECT 
    -- Generic Drugs table (base table)
    gd.uid as generic_uid,
    gd.row as generic_row,
    gd.generic_key,
    gd.generic_name,
    gd.biologic,
    gd.mech_of_action,
    gd.class_or_type,
    gd.target,
    
    -- Manufactured Drugs table (joined on generic_key)
    md.uid as manu_drug_uid,
    md.row as manu_drug_row,
    md.manu_drug_key,
    md.drug_name,
    md.manufacturer,
    md.brandkey,
    md.biosimilar_suffix,
    md.biosimilar,
    md.biosimilar_originator,
    
    -- Generic Routes table (joined on generic_key)
    gr.uid as route_uid,
    gr.row as route_row,
    gr.route_key,
    gr.route_type,
    gr.load_measure,
    gr.load_dose,
    gr.load_measure_2,
    gr.load_reg,
    gr.maintain_dose,
    gr.maintain_measure,
    gr.maintain_reg,
    gr.montherapy,
    gr.half_life,
    
    -- Generic Approvals table (joined on generic_key)
    ga.uid as approval_uid,
    ga.row as approval_row,
    ga.route_type as approval_route_type,
    ga.country,
    ga.indication,
    ga.populations,
    ga.approval_date,
    ga.discon_date,
    ga.box_warning,
    ga.box_warning_date

FROM generic_drugs gd
LEFT JOIN manu_drugs md ON gd.generic_key = md.generic_key
LEFT JOIN generic_routes gr ON gd.generic_key = gr.generic_key
LEFT JOIN generic_approvals ga ON gd.generic_key = ga.generic_key;

\echo '✅ View created successfully'

-- Test 2: Check view structure
\echo '\n=== View Structure ==='
\d generic_drugs_wide_view

-- Test 3: Count total rows
\echo '\n=== Row Count ==='
SELECT COUNT(*) as total_rows FROM generic_drugs_wide_view;

-- Test 4: Sample data
\echo '\n=== Sample Data (first 3 rows) ==='
SELECT 
    generic_key,
    generic_name,
    biologic,
    mech_of_action,
    drug_name,
    manufacturer,
    route_type,
    country
FROM generic_drugs_wide_view 
LIMIT 3;

-- Test 5: Test filtering
\echo '\n=== Test Filtering ==='
SELECT 
    generic_key,
    generic_name,
    biologic,
    drug_name,
    manufacturer
FROM generic_drugs_wide_view 
WHERE biologic = 'Yes'
LIMIT 5;

-- Test 6: Test aggregation
\echo '\n=== Test Aggregation ==='
SELECT 
    biologic,
    COUNT(*) as drug_count,
    COUNT(DISTINCT manufacturer) as manufacturer_count
FROM generic_drugs_wide_view 
WHERE biologic IS NOT NULL
GROUP BY biologic;

\echo '\n=== Test Complete ===' 