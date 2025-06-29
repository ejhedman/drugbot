/**
 * Core Database Model Types
 * 
 * This file defines the core database model types used for representing database uiEntity.
 * These types represent the structure of tables, fields, and schema definitions in the database.
 */

// ============================================================================
// CORE DATABASE TYPES
// ============================================================================

/**
 * DBField - A database field definition
 * 
 * Properties:
 * - name: The name of the database field
 * - datatype: The database data type (e.g., 'VARCHAR', 'INTEGER', 'BOOLEAN', etc.)
 * - is_nullable: Whether the field can contain null values
 * - is_primary_key: Whether this field is part of the primary key
 * - is_foreign_key: Whether this field is a foreign key reference
 * - max_length: Maximum length for string types (optional)
 * - default_value: Default value for the field (optional)
 */
export interface DBField {
  name: string;
  datatype: string;
  is_nullable: boolean;
  is_primary_key: boolean;
  is_foreign_key: boolean;
  max_length?: number;
  default_value?: any;
}

/**
 * DBTable - A database table definition
 * 
 * Properties:
 * - name: The name of the database table
 * - fields: Array of field definitions in this table
 * - description: Optional description of the table's purpose
 */
export interface DBTable {
  name: string;
  fields: DBField[];
  description?: string;
}

/**
 * DBSchema - Complete database schema definition
 * 
 * Properties:
 * - name: The name of the database schema
 * - version: Schema version for tracking changes
 * - tables: Array of table definitions in this schema
 * - description: Optional description of the schema
 */
export interface DBSchema {
  name: string;
  version: string;
  tables: DBTable[];
  description?: string;
}

// ============================================================================
// TYPE GUARD FUNCTIONS
// ============================================================================

/**
 * Type guard to check if an object is a DBField
 */
export function isDBField(obj: any): obj is DBField {
  return obj && 
    typeof obj.name === 'string' &&
    typeof obj.datatype === 'string' &&
    typeof obj.is_nullable === 'boolean' &&
    typeof obj.is_primary_key === 'boolean' &&
    typeof obj.is_foreign_key === 'boolean';
}

/**
 * Type guard to check if an object is a DBTable
 */
export function isDBTable(obj: any): obj is DBTable {
  return obj && 
    typeof obj.name === 'string' &&
    Array.isArray(obj.fields) &&
    obj.fields.every((field: any) => isDBField(field));
}

/**
 * Type guard to check if an object is a DBSchema
 */
export function isDBSchema(obj: any): obj is DBSchema {
  return obj && 
    typeof obj.name === 'string' &&
    typeof obj.version === 'string' &&
    Array.isArray(obj.tables) &&
    obj.tables.every((table: any) => isDBTable(table));
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Find a table by name in a schema
 */
export function findTableByName(schema: DBSchema, tableName: string): DBTable | undefined {
  return schema.tables.find(table => table.name === tableName);
}

/**
 * Find a field by name in a table
 */
export function findFieldByName(table: DBTable, fieldName: string): DBField | undefined {
  return table.fields.find(field => field.name === fieldName);
}

/**
 * Get primary key fields from a table
 */
export function getPrimaryKeyFields(table: DBTable): DBField[] {
  return table.fields.filter(field => field.is_primary_key);
}

/**
 * Get foreign key fields from a table
 */
export function getForeignKeyFields(table: DBTable): DBField[] {
  return table.fields.filter(field => field.is_foreign_key);
} 


// ============================================================================
// CREATE/UPDATE TYPES
// ============================================================================

/**
 * Data required to create a new Entity
 */
export interface CreateEntityRequest {
  displayName: string;
  properties?: { [key: string]: any };
}

/**
 * Data required to update an existing Entity
 */
export interface UpdateEntityRequest {
  displayName?: string;
  properties?: { [key: string]: any };
}

/**
 * Data required to create a new ChildEntity
 */
export interface CreateChildEntityRequest {
  parent_entity_key: string;
  displayName: string;
  properties?: { [key: string]: any };
}

/**
 * Data required to update an existing ChildEntity
 */
export interface UpdateChildEntityRequest {
  displayName?: string;
  properties?: { [key: string]: any };
}

// ============================================================================
// UIAGGREGATE REQUEST TYPES (replacing legacy collection request types)
// ============================================================================

/**
 * Data required to create a new UIAggregate for entity collections
 */
export interface CreateUIAggregateRequest {
  entity_key: string;
  displayName: string;
  ordinal: number;
  properties: {
    propertyName: string;
    propertyValue: string;
    ordinal: number;
    isEditable: boolean;
    isVisible: boolean;
    isKey: boolean;
  }[];
}

/**
 * Data required to update an existing UIAggregate
 */
export interface UpdateUIAggregateRequest {
  displayName?: string;
  ordinal?: number;
  properties?: {
    propertyName: string;
    propertyValue: string;
    ordinal: number;
    isEditable: boolean;
    isVisible: boolean;
    isKey: boolean;
  }[];
}

/**
 * Data required to create a new UIAggregate for child entity collections
 */
export interface CreateChildUIAggregateRequest {
  child_entity_key: string;
  displayName: string;
  ordinal: number;
  properties: {
    propertyName: string;
    propertyValue: string;
    ordinal: number;
    isEditable: boolean;
    isVisible: boolean;
    isKey: boolean;
  }[];
}

/**
 * Data required to update an existing child UIAggregate
 */
export interface UpdateChildUIAggregateRequest {
  displayName?: string;
  ordinal?: number;
  properties?: {
    propertyName: string;
    propertyValue: string;
    ordinal: number;
    isEditable: boolean;
    isVisible: boolean;
    isKey: boolean;
  }[];
}


 