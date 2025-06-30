-- Demo Data: Update Relationships and UIDs
-- Run after all data inserts to establish foreign key relationships

BEGIN;

-- =============================================
-- UPDATE FOREIGN KEY RELATIONSHIPS
-- =============================================

-- Update generic_uid columns to establish proper foreign key relationships
-- This matches generic_key values to their corresponding UIDs in generic_drugs

UPDATE generic_aliases 
SET generic_uid = gd.uid 
FROM generic_drugs gd 
WHERE generic_aliases.generic_key = gd.generic_key;

UPDATE generic_routes 
SET generic_uid = gd.uid 
FROM generic_drugs gd 
WHERE generic_routes.generic_key = gd.generic_key;

UPDATE generic_approvals 
SET generic_uid = gd.uid 
FROM generic_drugs gd 
WHERE generic_approvals.generic_key = gd.generic_key;

UPDATE manu_drugs 
SET generic_uid = gd.uid 
FROM generic_drugs gd 
WHERE manu_drugs.generic_key = gd.generic_key;

-- =============================================
-- POPULATE ENTITY RELATIONSHIPS
-- =============================================

-- Insert relationships between generic_drugs (ancestors) and manu_drugs (children)
-- This uses the existing generic_uid foreign key in manu_drugs
INSERT INTO entity_relationships (ancestor_uid, child_uid, relationship_type)
SELECT 
    gd.uid as ancestor_uid,
    md.uid as child_uid,
    'parent_child' as relationship_type
FROM generic_drugs gd
INNER JOIN manu_drugs md ON gd.uid = md.generic_uid
WHERE md.generic_uid IS NOT NULL;

-- =============================================
-- VERIFICATION AND SUMMARY
-- =============================================

-- Log the number of relationships created
DO $$
DECLARE
    relationship_count INTEGER;
    generic_count INTEGER;
    manu_count INTEGER;
    alias_count INTEGER;
    route_count INTEGER;
    approval_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO relationship_count FROM entity_relationships;
    SELECT COUNT(*) INTO generic_count FROM generic_drugs;
    SELECT COUNT(*) INTO manu_count FROM manu_drugs;
    SELECT COUNT(*) INTO alias_count FROM generic_aliases;
    SELECT COUNT(*) INTO route_count FROM generic_routes;
    SELECT COUNT(*) INTO approval_count FROM generic_approvals;
    
    RAISE NOTICE 'Demo Data Summary:';
    RAISE NOTICE '- Generic Drugs: %', generic_count;
    RAISE NOTICE '- Manufactured Drugs: %', manu_count;
    RAISE NOTICE '- Generic Aliases: %', alias_count;
    RAISE NOTICE '- Generic Routes: %', route_count;
    RAISE NOTICE '- Generic Approvals: %', approval_count;
    RAISE NOTICE '- Entity Relationships: %', relationship_count;
END $$;

-- =============================================
-- DATA INTEGRITY CHECKS
-- =============================================

-- Check that foreign key relationships were established correctly
-- These queries should return 0 if all relationships are properly set up

-- Check for orphaned records (should return 0)
SELECT COUNT(*) as orphaned_aliases FROM generic_aliases WHERE generic_uid IS NULL;
SELECT COUNT(*) as orphaned_routes FROM generic_routes WHERE generic_uid IS NULL;
SELECT COUNT(*) as orphaned_approvals FROM generic_approvals WHERE generic_uid IS NULL;
SELECT COUNT(*) as orphaned_manu_drugs FROM manu_drugs WHERE generic_uid IS NULL;

-- Summary counts by table
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
UNION ALL
SELECT 'drug_classes', COUNT(*) FROM drug_classes
UNION ALL
SELECT 'route_types', COUNT(*) FROM route_types
UNION ALL
SELECT 'countries', COUNT(*) FROM countries;

-- =============================================
-- SAMPLE QUERIES FOR TESTING
-- =============================================

-- Sample query: Get all manufactured drugs for a specific generic
-- SELECT md.drug_name, md.manufacturer, md.biosimilar 
-- FROM manu_drugs md 
-- JOIN generic_drugs gd ON md.generic_uid = gd.uid 
-- WHERE gd.generic_name = 'Adalimumab';

-- Sample query: Get all routes for a specific generic
-- SELECT gr.route_type, gr.load_dose, gr.maintain_dose, gr.maintain_reg 
-- FROM generic_routes gr 
-- JOIN generic_drugs gd ON gr.generic_uid = gd.uid 
-- WHERE gd.generic_name = 'Adalimumab';

-- Sample query: Get all approvals for a specific generic
-- SELECT ga.country, ga.indication, ga.approval_date 
-- FROM generic_approvals ga 
-- JOIN generic_drugs gd ON ga.generic_uid = gd.uid 
-- WHERE gd.generic_name = 'Adalimumab';

-- Sample query: Get all aliases for a specific generic
-- SELECT ga.alias 
-- FROM generic_aliases ga 
-- JOIN generic_drugs gd ON ga.generic_uid = gd.uid 
-- WHERE gd.generic_name = 'Adalimumab';

-- Sample query: Get entity relationships
-- SELECT 
--     gd.generic_name as ancestor_name,
--     md.drug_name as child_name,
--     er.relationship_type
-- FROM entity_relationships er
-- JOIN generic_drugs gd ON er.ancestor_uid = gd.uid
-- JOIN manu_drugs md ON er.child_uid = md.uid
-- LIMIT 10;

COMMIT;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE 'Demo data setup completed successfully!';
    RAISE NOTICE 'All foreign key relationships have been established.';
    RAISE NOTICE 'Entity relationships have been populated.';
    RAISE NOTICE 'You can now query the database with rich, varied data for testing.';
END $$; 