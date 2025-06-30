-- PostgreSQL DDL generated from drugs.xlsx
-- Created: 2025-06-26

-- =============================================
-- LOOKUP TABLES
-- =============================================

-- =============================================
-- Table: drug_classes
-- Lookup table for drug classifications
-- =============================================
CREATE TABLE drug_classes (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value VARCHAR(255) NOT NULL UNIQUE
);

-- Add comments for drug_classes
COMMENT ON TABLE drug_classes IS 'Lookup table for drug class/type classifications';
COMMENT ON COLUMN drug_classes.uid IS 'Primary key - unique identifier (GUID)';
COMMENT ON COLUMN drug_classes.value IS 'Drug class name or type';

-- =============================================
-- Table: route_types
-- Lookup table for administration routes
-- =============================================
CREATE TABLE route_types (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value VARCHAR(255) NOT NULL UNIQUE
);

-- Add comments for route_types
COMMENT ON TABLE route_types IS 'Lookup table for drug administration routes';
COMMENT ON COLUMN route_types.uid IS 'Primary key - unique identifier (GUID)';
COMMENT ON COLUMN route_types.value IS 'Route of administration type';

-- =============================================
-- Table: countries
-- Lookup table for country codes/names
-- =============================================
CREATE TABLE countries (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value VARCHAR(255) NOT NULL UNIQUE
);

-- Add comments for countries
COMMENT ON TABLE countries IS 'Lookup table for countries where drugs are approved';
COMMENT ON COLUMN countries.uid IS 'Primary key - unique identifier (GUID)';
COMMENT ON COLUMN countries.value IS 'Country code or name';

-- =============================================
-- POPULATE LOOKUP TABLES WITH STATIC DATA
-- =============================================

-- Insert countries
INSERT INTO countries (value) VALUES 
    ('USA'),
    ('CAN'),
    ('FRA'),
    ('UK');

-- Insert route types
INSERT INTO route_types (value) VALUES 
    ('Subcutaneous'),
    ('Intravenous'),
    ('Oral');

-- Insert drug classes (based on data observed in the spreadsheet)
INSERT INTO drug_classes (value) VALUES 
    ('Biologic'),
    ('Small Molecule'),
    ('Biosimilar');

-- =============================================
-- Table: generic_drugs
-- Source: generic_drugs sheet (19 rows)
-- =============================================
-- Source: generic_drugs sheet (19 rows)
-- =============================================
CREATE TABLE generic_drugs (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    row INTEGER,
    generic_key VARCHAR(255),
    generic_name VARCHAR(255),
    biologic TEXT,
    mech_of_action VARCHAR(255),
    class_or_type VARCHAR(255),
    target VARCHAR(255)
);

-- Add comments for generic_drugs
COMMENT ON TABLE generic_drugs IS 'Generic drug information including mechanism of action and classification';
COMMENT ON COLUMN generic_drugs.uid IS 'Primary key - unique identifier (GUID)';
COMMENT ON COLUMN generic_drugs.row IS 'Row number from source data';
COMMENT ON COLUMN generic_drugs.generic_key IS 'Unique key identifier for generic drug';
COMMENT ON COLUMN generic_drugs.generic_name IS 'Generic name of the drug';
COMMENT ON COLUMN generic_drugs.biologic IS 'Biologic classification information';
COMMENT ON COLUMN generic_drugs.mech_of_action IS 'Mechanism of action description';
COMMENT ON COLUMN generic_drugs.class_or_type IS 'Drug class or type classification';
COMMENT ON COLUMN generic_drugs.target IS 'Target designation (e.g., TNFi)';

-- =============================================
-- Table: generic_aliases
-- Source: generic_aliases sheet (346 rows)
-- =============================================
CREATE TABLE generic_aliases (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    row INTEGER,
    generic_key VARCHAR(255),
    generic_uid UUID,
    alias VARCHAR(255)
);

-- Add comments for generic_aliases
COMMENT ON TABLE generic_aliases IS 'Alternative names and aliases for generic drugs';
COMMENT ON COLUMN generic_aliases.uid IS 'Primary key - unique identifier (GUID)';
COMMENT ON COLUMN generic_aliases.row IS 'Row number from source data';
COMMENT ON COLUMN generic_aliases.generic_key IS 'Reference to generic drug key';
COMMENT ON COLUMN generic_aliases.generic_uid IS 'Foreign key reference to generic_drugs.uid';
COMMENT ON COLUMN generic_aliases.alias IS 'Alternative name or alias for the drug';

-- =============================================
-- Table: generic_routes
-- Source: generic_routes sheet (20 rows)
-- =============================================
CREATE TABLE generic_routes (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    row INTEGER,
    route_key VARCHAR(255),
    generic_key VARCHAR(255),
    generic_uid UUID,
    route_type VARCHAR(255),
    load_measure VARCHAR(255),
    load_dose VARCHAR(255),
    load_measure_2 VARCHAR(255), -- Note: duplicate column name in source
    load_reg VARCHAR(255),
    maintain_dose VARCHAR(255),
    maintain_measure VARCHAR(255),
    maintain_reg VARCHAR(255),
    montherapy VARCHAR(255),
    half_life TEXT
);

-- Add comments for generic_routes
COMMENT ON TABLE generic_routes IS 'Drug administration routes and dosing information';
COMMENT ON COLUMN generic_routes.uid IS 'Primary key - unique identifier (GUID)';
COMMENT ON COLUMN generic_routes.row IS 'Row number from source data';
COMMENT ON COLUMN generic_routes.route_key IS 'Unique identifier for route';
COMMENT ON COLUMN generic_routes.generic_key IS 'Reference to generic drug key';
COMMENT ON COLUMN generic_routes.generic_uid IS 'Foreign key reference to generic_drugs.uid';
COMMENT ON COLUMN generic_routes.route_type IS 'Route of administration (e.g., Subcutaneous, Intravenous)';
COMMENT ON COLUMN generic_routes.load_measure IS 'Unit of measurement for loading dose';
COMMENT ON COLUMN generic_routes.load_dose IS 'Loading dose amount';
COMMENT ON COLUMN generic_routes.load_measure_2 IS 'Second load measure column (duplicate in source)';
COMMENT ON COLUMN generic_routes.load_reg IS 'Loading dose regimen description';
COMMENT ON COLUMN generic_routes.maintain_dose IS 'Maintenance dose amount';
COMMENT ON COLUMN generic_routes.maintain_measure IS 'Unit of measurement for maintenance dose';
COMMENT ON COLUMN generic_routes.maintain_reg IS 'Maintenance dose regimen description';
COMMENT ON COLUMN generic_routes.montherapy IS 'Monotherapy approval status';
COMMENT ON COLUMN generic_routes.half_life IS 'Drug half-life information';

-- =============================================
-- Table: generic_approvals
-- Source: generic_approvals sheet (346 rows)
-- =============================================
CREATE TABLE generic_approvals (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    row INTEGER,
    generic_key VARCHAR(255),
    generic_uid UUID,
    route_type VARCHAR(255),
    country VARCHAR(255),
    indication TEXT,
    populations TEXT,
    approval_date DATE,
    discon_date TEXT,
    box_warning TEXT,
    box_warning_date TEXT
);

-- Add comments for generic_approvals
COMMENT ON TABLE generic_approvals IS 'Drug approval information by country and route';
COMMENT ON COLUMN generic_approvals.uid IS 'Primary key - unique identifier (GUID)';
COMMENT ON COLUMN generic_approvals.row IS 'Row number from source data';
COMMENT ON COLUMN generic_approvals.generic_key IS 'Reference to generic drug key';
COMMENT ON COLUMN generic_approvals.generic_uid IS 'Foreign key reference to generic_drugs.uid';
COMMENT ON COLUMN generic_approvals.route_type IS 'Route of administration for this approval';
COMMENT ON COLUMN generic_approvals.country IS 'Country where drug is approved (e.g., USA)';
COMMENT ON COLUMN generic_approvals.indication IS 'Medical indication for approval';
COMMENT ON COLUMN generic_approvals.populations IS 'Specific populations covered by approval';
COMMENT ON COLUMN generic_approvals.approval_date IS 'Date of regulatory approval';
COMMENT ON COLUMN generic_approvals.discon_date IS 'Discontinuation date if applicable';
COMMENT ON COLUMN generic_approvals.box_warning IS 'Black box warning information';
COMMENT ON COLUMN generic_approvals.box_warning_date IS 'Date of box warning issuance';

-- =============================================
-- Table: manu_drugs
-- Source: manu_drugs sheet (40 rows)
-- =============================================
CREATE TABLE manu_drugs (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    row INTEGER,
    manu_drug_key VARCHAR(255),
    generic_key VARCHAR(255),
    generic_uid UUID,
    drug_name VARCHAR(255),
    manufacturer VARCHAR(255),
    brandkey VARCHAR(255),
    biosimilar_suffix VARCHAR(255),
    biosimilar INTEGER,
    biosimilar_originator VARCHAR(255)
);

-- Add comments for manu_drugs
COMMENT ON TABLE manu_drugs IS 'Manufactured drug products including brand names and biosimilar information';
COMMENT ON COLUMN manu_drugs.uid IS 'Primary key - unique identifier (GUID)';
COMMENT ON COLUMN manu_drugs.row IS 'Row number from source data';
COMMENT ON COLUMN manu_drugs.manu_drug_key IS 'Unique identifier for manufactured drug product';
COMMENT ON COLUMN manu_drugs.generic_key IS 'Reference to generic drug key';
COMMENT ON COLUMN manu_drugs.generic_uid IS 'Foreign key reference to generic_drugs.uid';
COMMENT ON COLUMN manu_drugs.drug_name IS 'Full brand name including generic name in parentheses';
COMMENT ON COLUMN manu_drugs.manufacturer IS 'Pharmaceutical company manufacturing the drug';
COMMENT ON COLUMN manu_drugs.brandkey IS 'Brand name identifier';
COMMENT ON COLUMN manu_drugs.biosimilar_suffix IS 'FDA biosimilar suffix (e.g., -aacf, -aqvh)';
COMMENT ON COLUMN manu_drugs.biosimilar IS 'Biosimilar flag (0=originator, 1=biosimilar)';
COMMENT ON COLUMN manu_drugs.biosimilar_originator IS 'Original brand name for biosimilars';

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Primary key-like indexes on main identifier columns
CREATE INDEX idx_generic_drugs_generic_key ON generic_drugs(generic_key);
CREATE INDEX idx_generic_aliases_generic_key ON generic_aliases(generic_key);
CREATE INDEX idx_generic_aliases_generic_uid ON generic_aliases(generic_uid);
CREATE INDEX idx_generic_routes_generic_key ON generic_routes(generic_key);
CREATE INDEX idx_generic_routes_generic_uid ON generic_routes(generic_uid);
CREATE INDEX idx_generic_routes_route_key ON generic_routes(route_key);
CREATE INDEX idx_generic_approvals_generic_key ON generic_approvals(generic_key);
CREATE INDEX idx_generic_approvals_generic_uid ON generic_approvals(generic_uid);
CREATE INDEX idx_manu_drugs_generic_key ON manu_drugs(generic_key);
CREATE INDEX idx_manu_drugs_generic_uid ON manu_drugs(generic_uid);
CREATE INDEX idx_manu_drugs_manu_drug_key ON manu_drugs(manu_drug_key);

-- Lookup table indexes
CREATE INDEX idx_drug_classes_value ON drug_classes(value);
CREATE INDEX idx_route_types_value ON route_types(value);
CREATE INDEX idx_countries_value ON countries(value);

-- Additional useful indexes
CREATE INDEX idx_generic_approvals_country ON generic_approvals(country);
CREATE INDEX idx_generic_approvals_approval_date ON generic_approvals(approval_date);
CREATE INDEX idx_manu_drugs_manufacturer ON manu_drugs(manufacturer);
CREATE INDEX idx_manu_drugs_biosimilar ON manu_drugs(biosimilar);

-- =============================================
-- FOREIGN KEY CONSTRAINTS
-- =============================================

ALTER TABLE generic_aliases 
    ADD CONSTRAINT fk_generic_aliases_generic_uid 
    FOREIGN KEY (generic_uid) REFERENCES generic_drugs(uid);

ALTER TABLE generic_routes 
    ADD CONSTRAINT fk_generic_routes_generic_uid 
    FOREIGN KEY (generic_uid) REFERENCES generic_drugs(uid);

ALTER TABLE generic_approvals 
    ADD CONSTRAINT fk_generic_approvals_generic_uid 
    FOREIGN KEY (generic_uid) REFERENCES generic_drugs(uid);

ALTER TABLE manu_drugs 
    ADD CONSTRAINT fk_manu_drugs_generic_uid 
    FOREIGN KEY (generic_uid) REFERENCES generic_drugs(uid);

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

-- =============================================
-- NOTES AND RECOMMENDATIONS
-- =============================================

/*
NOTES:
1. Added three lookup tables with UUID primary keys and static data:
   - drug_classes: Contains drug classification values
   - route_types: Contains administration route types
   - countries: Contains country codes for approvals
2. Each table now has a UUID primary key column named 'uid' with auto-generation
3. Tables with 'generic_key' now also have 'generic_uid' columns with foreign key constraints
4. The 'row' column appears to be just a row number from Excel - consider if you need this
5. The generic_routes table has duplicate 'load_measure' columns in the source
6. Some columns like 'biologic', 'indication', 'populations' are mostly empty in the source data
7. Date columns were detected based on format - verify date parsing during data import
8. The 'biosimilar' column in manu_drugs uses 0/1 integers for boolean values

RECOMMENDATIONS:
1. Primary keys are now UUID with auto-generation using gen_random_uuid()
2. Foreign key relationships are enforced through generic_uid columns
3. Keep both generic_key (for data import/reference) and generic_uid (for proper FK relationships)
4. Consider adding foreign key relationships to the lookup tables for normalization:
   - Link generic_routes.route_type to route_types.value
   - Link generic_approvals.country to countries.value
   - Link generic_drugs.class_or_type to drug_classes.value
5. Add NOT NULL constraints where appropriate after data validation
6. Consider normalizing some of the text fields if they contain repeated values
7. Validate date formats during data import
8. Consider adding CHECK constraints for boolean-like integer columns
9. Review and potentially standardize text case (some mixed case in source data)

DATA IMPORT CONSIDERATIONS:
- Import lookup tables first (already populated with static data)
- Import generic_drugs table second to establish UIDs
- Create a mapping between generic_key and generic_uid for related table imports
- Handle NULL/empty values appropriately during import
- Consider data validation rules for key fields
- Date parsing may need adjustment based on your locale settings
- Some text fields contain special characters and may need encoding consideration
- The generic_uid fields will need to be populated during import by looking up the corresponding generic_drugs.uid based on generic_key values
- Consider using the lookup tables to normalize text values during import
*/