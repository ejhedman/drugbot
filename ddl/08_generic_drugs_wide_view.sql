-- ============================================================================
-- Generic Drugs Wide View
-- ============================================================================
-- This view creates a comprehensive wide table that rolls up all the main drug tables
-- into one view for easier querying and analysis.
-- 
-- Created: 2025-01-27
-- Purpose: Provide a denormalized view of all drug information for reporting and analysis
-- ============================================================================

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

-- Add comments for the view
COMMENT ON VIEW generic_drugs_wide_view IS 'Comprehensive wide view of all drug information including generic drugs, manufactured drugs, routes, and approvals';
COMMENT ON COLUMN generic_drugs_wide_view.generic_uid IS 'Primary key from generic_drugs table';
COMMENT ON COLUMN generic_drugs_wide_view.generic_key IS 'Business key for generic drugs (used for joins)';
COMMENT ON COLUMN generic_drugs_wide_view.generic_name IS 'Generic name of the drug';
COMMENT ON COLUMN generic_drugs_wide_view.biologic IS 'Biologic classification information';
COMMENT ON COLUMN generic_drugs_wide_view.mech_of_action IS 'Mechanism of action description';
COMMENT ON COLUMN generic_drugs_wide_view.class_or_type IS 'Drug class or type classification';
COMMENT ON COLUMN generic_drugs_wide_view.target IS 'Target designation (e.g., TNFi)';
COMMENT ON COLUMN generic_drugs_wide_view.manu_drug_uid IS 'Primary key from manu_drugs table';
COMMENT ON COLUMN generic_drugs_wide_view.manu_drug_key IS 'Business key for manufactured drugs';
COMMENT ON COLUMN generic_drugs_wide_view.drug_name IS 'Full brand name including generic name in parentheses';
COMMENT ON COLUMN generic_drugs_wide_view.manufacturer IS 'Pharmaceutical company manufacturing the drug';
COMMENT ON COLUMN generic_drugs_wide_view.brandkey IS 'Brand name identifier';
COMMENT ON COLUMN generic_drugs_wide_view.biosimilar_suffix IS 'FDA biosimilar suffix (e.g., -aacf, -aqvh)';
COMMENT ON COLUMN generic_drugs_wide_view.biosimilar IS 'Biosimilar flag (0=originator, 1=biosimilar)';
COMMENT ON COLUMN generic_drugs_wide_view.biosimilar_originator IS 'Original brand name for biosimilars';
COMMENT ON COLUMN generic_drugs_wide_view.route_uid IS 'Primary key from generic_routes table';
COMMENT ON COLUMN generic_drugs_wide_view.route_key IS 'Unique identifier for route';
COMMENT ON COLUMN generic_drugs_wide_view.route_type IS 'Route of administration (e.g., Subcutaneous, Intravenous)';
COMMENT ON COLUMN generic_drugs_wide_view.load_measure IS 'Unit of measurement for loading dose';
COMMENT ON COLUMN generic_drugs_wide_view.load_dose IS 'Loading dose amount';
COMMENT ON COLUMN generic_drugs_wide_view.load_measure_2 IS 'Second load measure column (duplicate in source)';
COMMENT ON COLUMN generic_drugs_wide_view.load_reg IS 'Loading dose regimen description';
COMMENT ON COLUMN generic_drugs_wide_view.maintain_dose IS 'Maintenance dose amount';
COMMENT ON COLUMN generic_drugs_wide_view.maintain_measure IS 'Unit of measurement for maintenance dose';
COMMENT ON COLUMN generic_drugs_wide_view.maintain_reg IS 'Maintenance dose regimen description';
COMMENT ON COLUMN generic_drugs_wide_view.montherapy IS 'Monotherapy approval status';
COMMENT ON COLUMN generic_drugs_wide_view.half_life IS 'Drug half-life information';
COMMENT ON COLUMN generic_drugs_wide_view.approval_uid IS 'Primary key from generic_approvals table';
COMMENT ON COLUMN generic_drugs_wide_view.approval_route_type IS 'Route of administration for this approval';
COMMENT ON COLUMN generic_drugs_wide_view.country IS 'Country where drug is approved (e.g., USA)';
COMMENT ON COLUMN generic_drugs_wide_view.indication IS 'Medical indication for approval';
COMMENT ON COLUMN generic_drugs_wide_view.populations IS 'Specific populations covered by approval';
COMMENT ON COLUMN generic_drugs_wide_view.approval_date IS 'Date of regulatory approval';
COMMENT ON COLUMN generic_drugs_wide_view.discon_date IS 'Discontinuation date if applicable';
COMMENT ON COLUMN generic_drugs_wide_view.box_warning IS 'Black box warning information';
COMMENT ON COLUMN generic_drugs_wide_view.box_warning_date IS 'Date of box warning issuance';

-- Create indexes for better query performance on the view
-- Note: Indexes on views are limited in PostgreSQL, but we can create indexes on the underlying tables
-- that will be used by the view queries

-- The view will automatically use existing indexes on:
-- - generic_drugs.generic_key (already exists)
-- - manu_drugs.generic_key (already exists)
-- - generic_routes.generic_key (already exists)
-- - generic_approvals.generic_key (already exists) 