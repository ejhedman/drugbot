
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
