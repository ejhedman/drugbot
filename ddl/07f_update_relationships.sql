
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
