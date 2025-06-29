-- ============================================================================
-- Entity Relationships Migration
-- ============================================================================
-- This migration creates a table to track ancestor/child relationships
-- between entities in the system, specifically between generic_drugs (ancestors)
-- and manu_drugs (children).
-- 
-- Created: $(date)
-- Purpose: Normalize hierarchical relationships and improve query performance
-- ============================================================================

-- Create the entity_relationships table
CREATE TABLE entity_relationships (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ancestor_uid UUID NOT NULL,
    child_uid UUID NOT NULL,
    relationship_type VARCHAR(50) NOT NULL DEFAULT 'parent_child',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Foreign key constraints
    CONSTRAINT fk_ancestor_uid FOREIGN KEY (ancestor_uid) REFERENCES generic_drugs(uid) ON DELETE CASCADE,
    CONSTRAINT fk_child_uid FOREIGN KEY (child_uid) REFERENCES manu_drugs(uid) ON DELETE CASCADE,
    
    -- Ensure unique relationships
    CONSTRAINT unique_relationship UNIQUE (ancestor_uid, child_uid, relationship_type)
);

-- Create indexes for better query performance
CREATE INDEX idx_entity_relationships_ancestor ON entity_relationships(ancestor_uid);
CREATE INDEX idx_entity_relationships_child ON entity_relationships(child_uid);
CREATE INDEX idx_entity_relationships_type ON entity_relationships(relationship_type);

-- Add helpful comments
COMMENT ON TABLE entity_relationships IS 'Tracks hierarchical relationships between entities';
COMMENT ON COLUMN entity_relationships.ancestor_uid IS 'UID of the parent/ancestor entity (typically from generic_drugs)';
COMMENT ON COLUMN entity_relationships.child_uid IS 'UID of the child entity (typically from manu_drugs)';
COMMENT ON COLUMN entity_relationships.relationship_type IS 'Type of relationship (e.g., parent_child, generic_manufactured)';

-- ============================================================================
-- Populate the table with existing relationships
-- ============================================================================

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

-- Log the number of relationships created
DO $$
DECLARE
    relationship_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO relationship_count FROM entity_relationships;
    RAISE NOTICE 'Created % entity relationships', relationship_count;
END $$;

-- ============================================================================
-- Create a view for easier querying
-- ============================================================================

-- Create a view that provides a denormalized view of relationships with entity details
CREATE VIEW entity_relationships_detailed AS
SELECT 
    er.uid as relationship_uid,
    er.relationship_type,
    er.created_at as relationship_created,
    
    -- Ancestor (parent) details
    gd.uid as ancestor_uid,
    gd.generic_key as ancestor_key,
    gd.generic_name as ancestor_name,
    gd.mech_of_action as ancestor_mechanism,
    
    -- Child details  
    md.uid as child_uid,
    md.manu_drug_key as child_key,
    md.drug_name as child_name,
    md.manufacturer as child_manufacturer,
    md.biosimilar as child_biosimilar
    
FROM entity_relationships er
LEFT JOIN generic_drugs gd ON er.ancestor_uid = gd.uid
LEFT JOIN manu_drugs md ON er.child_uid = md.uid;

COMMENT ON VIEW entity_relationships_detailed IS 'Denormalized view of entity relationships with full entity details';

-- ============================================================================
-- Create helper functions for relationship queries
-- ============================================================================

-- Function to get all children of an ancestor
CREATE OR REPLACE FUNCTION get_entity_children(ancestor_entity_uid UUID)
RETURNS TABLE (
    child_uid UUID,
    child_key VARCHAR,
    child_name VARCHAR,
    relationship_type VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        md.uid,
        md.manu_drug_key,
        md.drug_name,
        er.relationship_type
    FROM entity_relationships er
    JOIN manu_drugs md ON er.child_uid = md.uid
    WHERE er.ancestor_uid = ancestor_entity_uid;
END;
$$ LANGUAGE plpgsql;

-- Function to get the ancestor of a child entity
CREATE OR REPLACE FUNCTION get_entity_ancestor(child_entity_uid UUID)
RETURNS TABLE (
    ancestor_uid UUID,
    ancestor_key VARCHAR,
    ancestor_name VARCHAR,
    relationship_type VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gd.uid,
        gd.generic_key,
        gd.generic_name,
        er.relationship_type
    FROM entity_relationships er
    JOIN generic_drugs gd ON er.ancestor_uid = gd.uid
    WHERE er.child_uid = child_entity_uid;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_entity_children IS 'Returns all children of a given ancestor entity';
COMMENT ON FUNCTION get_entity_ancestor IS 'Returns the ancestor of a given child entity';

-- ============================================================================
-- Migration Complete
-- ============================================================================

RAISE NOTICE 'Entity relationships migration completed successfully';
RAISE NOTICE 'Created table: entity_relationships';
RAISE NOTICE 'Created view: entity_relationships_detailed'; 
RAISE NOTICE 'Created functions: get_entity_children, get_entity_ancestor'; 