/**
 * Database Schema Definition
 * 
 * This file contains the complete database schema definition based on the PostgreSQL DDL.
 * Generated from ddl/00_table_ddl.sql
 */

import { DBSchema, DBTable, DBModel } from '../model_defs/DBModel';

// ============================================================================
// LOOKUP TABLES
// ============================================================================

const drugClassesTable: DBTable = {
  name: 'drug_classes',
  description: 'Lookup table for drug class/type classifications',
  fields: [
    {
      name: 'uid',
      datatype: 'UUID',
      is_nullable: false,
      is_primary_key: true,
      is_foreign_key: false,
      default_value: 'gen_random_uuid()'
    },
    {
      name: 'value',
      datatype: 'VARCHAR',
      is_nullable: false,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    }
  ]
};

const routeTypesTable: DBTable = {
  name: 'route_types',
  description: 'Lookup table for drug administration routes',
  fields: [
    {
      name: 'uid',
      datatype: 'UUID',
      is_nullable: false,
      is_primary_key: true,
      is_foreign_key: false,
      default_value: 'gen_random_uuid()'
    },
    {
      name: 'value',
      datatype: 'VARCHAR',
      is_nullable: false,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    }
  ]
};

const countriesTable: DBTable = {
  name: 'countries',
  description: 'Lookup table for countries where drugs are approved',
  fields: [
    {
      name: 'uid',
      datatype: 'UUID',
      is_nullable: false,
      is_primary_key: true,
      is_foreign_key: false,
      default_value: 'gen_random_uuid()'
    },
    {
      name: 'value',
      datatype: 'VARCHAR',
      is_nullable: false,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    }
  ]
};

// ============================================================================
// MAIN DRUG TABLES
// ============================================================================

const genericDrugsTable: DBTable = {
  name: 'generic_drugs',
  description: 'Generic drug information including mechanism of action and classification',
  fields: [
    {
      name: 'uid',
      datatype: 'UUID',
      is_nullable: false,
      is_primary_key: true,
      is_foreign_key: false,
      default_value: 'gen_random_uuid()'
    },
    {
      name: 'row',
      datatype: 'INTEGER',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false
    },
    {
      name: 'generic_key',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'generic_name',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'biologic',
      datatype: 'TEXT',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false
    },
    {
      name: 'mech_of_action',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'class_or_type',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'target',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    }
  ]
};

const genericAliasesTable: DBTable = {
  name: 'generic_aliases',
  description: 'Alternative names and aliases for generic drugs',
  fields: [
    {
      name: 'uid',
      datatype: 'UUID',
      is_nullable: false,
      is_primary_key: true,
      is_foreign_key: false,
      default_value: 'gen_random_uuid()'
    },
    {
      name: 'row',
      datatype: 'INTEGER',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false
    },
    {
      name: 'generic_key',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'generic_uid',
      datatype: 'UUID',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: true
    },
    {
      name: 'alias',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    }
  ]
};

const genericRoutesTable: DBTable = {
  name: 'generic_routes',
  description: 'Drug administration routes and dosing information',
  fields: [
    {
      name: 'uid',
      datatype: 'UUID',
      is_nullable: false,
      is_primary_key: true,
      is_foreign_key: false,
      default_value: 'gen_random_uuid()'
    },
    {
      name: 'row',
      datatype: 'INTEGER',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false
    },
    {
      name: 'route_key',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'generic_key',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'generic_uid',
      datatype: 'UUID',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: true
    },
    {
      name: 'route_type',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'load_measure',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'load_dose',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'load_measure_2',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'load_reg',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'maintain_dose',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'maintain_measure',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'maintain_reg',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'montherapy',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'half_life',
      datatype: 'TEXT',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false
    }
  ]
};

const genericApprovalsTable: DBTable = {
  name: 'generic_approvals',
  description: 'Drug approval information by country and route',
  fields: [
    {
      name: 'uid',
      datatype: 'UUID',
      is_nullable: false,
      is_primary_key: true,
      is_foreign_key: false,
      default_value: 'gen_random_uuid()'
    },
    {
      name: 'row',
      datatype: 'INTEGER',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false
    },
    {
      name: 'generic_key',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'generic_uid',
      datatype: 'UUID',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: true
    },
    {
      name: 'route_type',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'country',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'indication',
      datatype: 'TEXT',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false
    },
    {
      name: 'populations',
      datatype: 'TEXT',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false
    },
    {
      name: 'approval_date',
      datatype: 'DATE',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false
    },
    {
      name: 'discon_date',
      datatype: 'TEXT',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false
    },
    {
      name: 'box_warning',
      datatype: 'TEXT',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false
    },
    {
      name: 'box_warning_date',
      datatype: 'TEXT',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false
    }
  ]
};

const manuDrugsTable: DBTable = {
  name: 'manu_drugs',
  description: 'Manufactured drug products including brand names and biosimilar information',
  fields: [
    {
      name: 'uid',
      datatype: 'UUID',
      is_nullable: false,
      is_primary_key: true,
      is_foreign_key: false,
      default_value: 'gen_random_uuid()'
    },
    {
      name: 'row',
      datatype: 'INTEGER',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false
    },
    {
      name: 'manu_drug_key',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'generic_key',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'generic_uid',
      datatype: 'UUID',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: true
    },
    {
      name: 'drug_name',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'manufacturer',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'brandkey',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'biosimilar_suffix',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    },
    {
      name: 'biosimilar',
      datatype: 'INTEGER',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false
    },
    {
      name: 'biosimilar_originator',
      datatype: 'VARCHAR',
      is_nullable: true,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 255
    }
  ]
};

// ============================================================================
// RELATIONSHIP TABLES
// ============================================================================

const entityRelationshipsTable: DBTable = {
  name: 'entity_relationships',
  description: 'Tracks hierarchical relationships between entities (ancestors and children)',
  fields: [
    {
      name: 'uid',
      datatype: 'UUID',
      is_nullable: false,
      is_primary_key: true,
      is_foreign_key: false,
      default_value: 'gen_random_uuid()'
    },
    {
      name: 'ancestor_uid',
      datatype: 'UUID',
      is_nullable: false,
      is_primary_key: false,
      is_foreign_key: true
    },
    {
      name: 'child_uid',
      datatype: 'UUID',
      is_nullable: false,
      is_primary_key: false,
      is_foreign_key: true
    },
    {
      name: 'relationship_type',
      datatype: 'VARCHAR',
      is_nullable: false,
      is_primary_key: false,
      is_foreign_key: false,
      max_length: 50,
      default_value: 'parent_child'
    },
    {
      name: 'created_at',
      datatype: 'TIMESTAMP WITH TIME ZONE',
      is_nullable: false,
      is_primary_key: false,
      is_foreign_key: false,
      default_value: 'NOW()'
    },
    {
      name: 'updated_at',
      datatype: 'TIMESTAMP WITH TIME ZONE',
      is_nullable: false,
      is_primary_key: false,
      is_foreign_key: false,
      default_value: 'NOW()'
    }
  ]
};

// ============================================================================
// COMPLETE DATABASE SCHEMA
// ============================================================================

export const drugBotDBSchema: DBSchema = {
  name: 'drugbot_schema',
  version: '1.0.0',
  description: 'Complete database schema for the DrugBot application, including drug information, approvals, routes, and manufacturer data',
  tables: [
    // Lookup tables
    drugClassesTable,
    routeTypesTable,
    countriesTable,
    // Main drug tables
    genericDrugsTable,
    genericAliasesTable,
    genericRoutesTable,
    genericApprovalsTable,
    manuDrugsTable,
    // Relationship tables
    entityRelationshipsTable
  ]
};

// Export individual tables for convenience
export {
  drugClassesTable,
  routeTypesTable,
  countriesTable,
  genericDrugsTable,
  genericAliasesTable,
  genericRoutesTable,
  genericApprovalsTable,
  manuDrugsTable,
  entityRelationshipsTable
};

// ============================================================================
// DATABASE MODEL WRAPPER INSTANCE
// ============================================================================

/**
 * The complete database model wrapper instance for the DrugBot application
 * 
 * This is the primary interface for accessing database model information.
 * Instead of working directly with the schema and tables, consumers should
 * use this wrapper instance which provides convenient methods for querying
 * the database model.
 * 
 * Usage Examples:
 * - theDBModel.getTable('generic_drugs')
 * - theDBModel.getTableField('generic_drugs', 'generic_name')
 * - theDBModel.getPrimaryKeyFields('generic_drugs')
 * - theDBModel.getForeignKeyFields('generic_aliases')
 */
export const theDBModel = new DBModel(drugBotDBSchema);

// Export as default for convenience
export default theDBModel; 