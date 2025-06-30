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
 * - forExport: Whether this field should be included in exports (defaults to true)
 */
export interface DBField {
  name: string;
  datatype: string;
  is_nullable: boolean;
  is_primary_key: boolean;
  is_foreign_key: boolean;
  max_length?: number;
  default_value?: any;
  forExport?: boolean;
}

/**
 * DBTable - A database table definition
 * 
 * Properties:
 * - name: The name of the database table
 * - fields: Array of field definitions in this table
 * - description: Optional description of the table's purpose
 * - forExport: Whether this table should be included in exports (defaults to true)
 */
export interface DBTable {
  name: string;
  fields: DBField[];
  description?: string;
  forExport?: boolean;
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

/**
 * DBModelWrapper - Encapsulates database model definitions with utility methods
 * 
 * This class provides a unified interface for accessing database model metadata,
 * including tables, fields, and their properties. It includes all the utility 
 * functions needed to work with the database schema.
 */
export class DBModel {
  private tables: Map<string, DBTable>;
  private schema: DBSchema;

  constructor(schema: DBSchema) {
    this.schema = schema;
    this.tables = new Map();
    
    // Index tables by name for fast lookup
    for (const table of schema.tables) {
      this.tables.set(table.name, table);
    }
  }

  // ============================================================================
  // SCHEMA OPERATIONS
  // ============================================================================

  /**
   * Get the complete schema definition
   */
  getSchema(): DBSchema {
    return { ...this.schema };
  }

  /**
   * Get schema name
   */
  getSchemaName(): string {
    return this.schema.name;
  }

  /**
   * Get schema version
   */
  getSchemaVersion(): string {
    return this.schema.version;
  }

  /**
   * Get schema description
   */
  getSchemaDescription(): string | undefined {
    return this.schema.description;
  }

  // ============================================================================
  // TABLE OPERATIONS
  // ============================================================================

  /**
   * Get a table by name
   */
  getTable(tableName: string): DBTable | undefined {
    return this.tables.get(tableName);
  }

  /**
   * Get all table names
   */
  getTableNames(): string[] {
    return Array.from(this.tables.keys());
  }

  /**
   * Get all tables
   */
  getAllTables(): DBTable[] {
    return Array.from(this.tables.values());
  }

  /**
   * Check if a table exists
   */
  hasTable(tableName: string): boolean {
    return this.tables.has(tableName);
  }

  /**
   * Get table description
   */
  getTableDescription(tableName: string): string | undefined {
    const table = this.getTable(tableName);
    return table?.description;
  }

  /**
   * Get tables that match a pattern
   */
  findTablesByPattern(pattern: RegExp): DBTable[] {
    return this.getAllTables().filter(table => pattern.test(table.name));
  }

  // ============================================================================
  // FIELD OPERATIONS
  // ============================================================================

  /**
   * Get all fields for a table
   */
  getTableFields(tableName: string): DBField[] {
    const table = this.getTable(tableName);
    return table ? [...table.fields] : [];
  }

  /**
   * Get a specific field from a table
   */
  getTableField(tableName: string, fieldName: string): DBField | undefined {
    const table = this.getTable(tableName);
    if (!table) return undefined;
    
    return table.fields.find(field => field.name === fieldName);
  }

  /**
   * Check if a field exists in a table
   */
  hasTableField(tableName: string, fieldName: string): boolean {
    return this.getTableField(tableName, fieldName) !== undefined;
  }

  /**
   * Get field names for a table
   */
  getTableFieldNames(tableName: string): string[] {
    const fields = this.getTableFields(tableName);
    return fields.map(field => field.name);
  }

  /**
   * Find fields by name across all tables
   */
  findFieldsByName(fieldName: string): Array<{ table: string; field: DBField }> {
    const results: Array<{ table: string; field: DBField }> = [];
    
    for (const table of this.getAllTables()) {
      const field = table.fields.find(f => f.name === fieldName);
      if (field) {
        results.push({ table: table.name, field });
      }
    }
    
    return results;
  }

  /**
   * Find fields by data type across all tables
   */
  findFieldsByDataType(datatype: string): Array<{ table: string; field: DBField }> {
    const results: Array<{ table: string; field: DBField }> = [];
    
    for (const table of this.getAllTables()) {
      const matchingFields = table.fields.filter(f => f.datatype === datatype);
      for (const field of matchingFields) {
        results.push({ table: table.name, field });
      }
    }
    
    return results;
  }

  // ============================================================================
  // PRIMARY KEY OPERATIONS
  // ============================================================================

  /**
   * Get primary key fields for a table
   */
  getPrimaryKeyFields(tableName: string): DBField[] {
    const fields = this.getTableFields(tableName);
    return fields.filter(field => field.is_primary_key);
  }

  /**
   * Get the primary key field names for a table
   */
  getPrimaryKeyFieldNames(tableName: string): string[] {
    const pkFields = this.getPrimaryKeyFields(tableName);
    return pkFields.map(field => field.name);
  }

  /**
   * Check if a table has a primary key
   */
  hasPrimaryKey(tableName: string): boolean {
    return this.getPrimaryKeyFields(tableName).length > 0;
  }

  /**
   * Get the single primary key field (assumes single-column primary key)
   */
  getPrimaryKeyField(tableName: string): DBField | undefined {
    const pkFields = this.getPrimaryKeyFields(tableName);
    return pkFields.length === 1 ? pkFields[0] : undefined;
  }

  // ============================================================================
  // FOREIGN KEY OPERATIONS
  // ============================================================================

  /**
   * Get foreign key fields for a table
   */
  getForeignKeyFields(tableName: string): DBField[] {
    const fields = this.getTableFields(tableName);
    return fields.filter(field => field.is_foreign_key);
  }

  /**
   * Get foreign key field names for a table
   */
  getForeignKeyFieldNames(tableName: string): string[] {
    const fkFields = this.getForeignKeyFields(tableName);
    return fkFields.map(field => field.name);
  }

  /**
   * Check if a table has foreign keys
   */
  hasForeignKeys(tableName: string): boolean {
    return this.getForeignKeyFields(tableName).length > 0;
  }

  /**
   * Find all foreign key relationships (field name must end with '_uid' or '_id')
   */
  findForeignKeyRelationships(): Array<{
    fromTable: string;
    fromField: string;
    toTable?: string;
    toField?: string;
  }> {
    const relationships: Array<{
      fromTable: string;
      fromField: string;
      toTable?: string;
      toField?: string;
    }> = [];

    for (const table of this.getAllTables()) {
      const fkFields = this.getForeignKeyFields(table.name);
      
      for (const field of fkFields) {
        relationships.push({
          fromTable: table.name,
          fromField: field.name,
          // Simple heuristic: if field ends with _uid, try to find matching table
          toTable: this.inferReferencedTable(field.name),
          toField: 'uid' // Most of our tables use 'uid' as primary key
        });
      }
    }

    return relationships;
  }

  /**
   * Infer referenced table from foreign key field name
   * This is a simple heuristic based on naming conventions
   */
  private inferReferencedTable(fieldName: string): string | undefined {
    // If field is generic_uid, try to find generic_drugs table
    if (fieldName.endsWith('_uid')) {
      const prefix = fieldName.replace('_uid', '');
      const possibleTableNames = [
        prefix,
        `${prefix}s`,
        `${prefix}_table`,
        `${prefix}_tables`
      ];
      
      for (const tableName of possibleTableNames) {
        if (this.hasTable(tableName)) {
          return tableName;
        }
      }
    }
    
    return undefined;
  }

  // ============================================================================
  // FIELD TYPE OPERATIONS
  // ============================================================================

  /**
   * Get nullable fields for a table
   */
  getNullableFields(tableName: string): DBField[] {
    const fields = this.getTableFields(tableName);
    return fields.filter(field => field.is_nullable);
  }

  /**
   * Get non-nullable fields for a table
   */
  getNonNullableFields(tableName: string): DBField[] {
    const fields = this.getTableFields(tableName);
    return fields.filter(field => !field.is_nullable);
  }

  /**
   * Get fields with default values for a table
   */
  getFieldsWithDefaults(tableName: string): DBField[] {
    const fields = this.getTableFields(tableName);
    return fields.filter(field => field.default_value !== undefined);
  }

  /**
   * Get string fields for a table
   */
  getStringFields(tableName: string): DBField[] {
    const fields = this.getTableFields(tableName);
    return fields.filter(field => 
      field.datatype === 'VARCHAR' || 
      field.datatype === 'TEXT' || 
      field.datatype === 'CHAR'
    );
  }

  /**
   * Get numeric fields for a table
   */
  getNumericFields(tableName: string): DBField[] {
    const fields = this.getTableFields(tableName);
    return fields.filter(field => 
      field.datatype === 'INTEGER' || 
      field.datatype === 'DECIMAL' || 
      field.datatype === 'NUMERIC' ||
      field.datatype === 'FLOAT' ||
      field.datatype === 'DOUBLE'
    );
  }

  /**
   * Get date fields for a table
   */
  getDateFields(tableName: string): DBField[] {
    const fields = this.getTableFields(tableName);
    return fields.filter(field => 
      field.datatype === 'DATE' || 
      field.datatype === 'TIMESTAMP' || 
      field.datatype === 'TIMESTAMP WITH TIME ZONE'
    );
  }

  // ============================================================================
  // UTILITY OPERATIONS
  // ============================================================================

  /**
   * Get a summary of the database model
   */
  getModelSummary(): {
    schemaName: string;
    schemaVersion: string;
    tableCount: number;
    totalFieldCount: number;
    tables: Array<{
      name: string;
      fieldCount: number;
      hasPrimaryKey: boolean;
      foreignKeyCount: number;
    }>;
  } {
    const tables = this.getAllTables();
    
    return {
      schemaName: this.schema.name,
      schemaVersion: this.schema.version,
      tableCount: tables.length,
      totalFieldCount: tables.reduce((sum, table) => sum + table.fields.length, 0),
      tables: tables.map(table => ({
        name: table.name,
        fieldCount: table.fields.length,
        hasPrimaryKey: this.hasPrimaryKey(table.name),
        foreignKeyCount: this.getForeignKeyFields(table.name).length
      }))
    };
  }

  /**
   * Validate the database model for common issues
   */
  validateModel(): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const table of this.getAllTables()) {
      // Check for primary keys
      if (!this.hasPrimaryKey(table.name)) {
        warnings.push(`Table '${table.name}' has no primary key`);
      }

      // Check for duplicate field names (should not happen, but good to check)
      const fieldNames = table.fields.map(f => f.name);
      const uniqueFieldNames = new Set(fieldNames);
      if (fieldNames.length !== uniqueFieldNames.size) {
        errors.push(`Table '${table.name}' has duplicate field names`);
      }

      // Check for fields with no datatype
      for (const field of table.fields) {
        if (!field.datatype || field.datatype.trim() === '') {
          errors.push(`Field '${field.name}' in table '${table.name}' has no datatype`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Generate SQL CREATE TABLE statement for a table (basic implementation)
   */
  generateCreateTableSQL(tableName: string): string | undefined {
    const table = this.getTable(tableName);
    if (!table) return undefined;

    const fieldDefinitions = table.fields.map(field => {
      let definition = `  ${field.name} ${field.datatype}`;
      
      if (field.max_length) {
        definition += `(${field.max_length})`;
      }
      
      if (!field.is_nullable) {
        definition += ' NOT NULL';
      }
      
      if (field.default_value !== undefined) {
        definition += ` DEFAULT ${field.default_value}`;
      }
      
      return definition;
    });

    const primaryKeyFields = this.getPrimaryKeyFieldNames(tableName);
    if (primaryKeyFields.length > 0) {
      fieldDefinitions.push(`  PRIMARY KEY (${primaryKeyFields.join(', ')})`);
    }

    return `CREATE TABLE ${tableName} (\n${fieldDefinitions.join(',\n')}\n);`;
  }

  // ============================================================================
  // EXPORT OPERATIONS
  // ============================================================================

  /**
   * Get tables that should be included in exports
   */
  getExportableTables(): DBTable[] {
    return this.getAllTables().filter(table => table.forExport !== false);
  }

  /**
   * Get exportable table names
   */
  getExportableTableNames(): string[] {
    return this.getExportableTables().map(table => table.name);
  }

  /**
   * Get fields that should be included in exports for a specific table
   */
  getExportableFields(tableName: string): DBField[] {
    const table = this.getTable(tableName);
    if (!table) return [];
    
    return table.fields.filter(field => field.forExport !== false);
  }

  /**
   * Get exportable field names for a specific table
   */
  getExportableFieldNames(tableName: string): string[] {
    return this.getExportableFields(tableName).map(field => field.name);
  }

  /**
   * Get export configuration for all tables
   */
  getExportConfiguration(): {
    tables: Array<{
      name: string;
      forExport: boolean;
      fieldCount: number;
      exportableFieldCount: number;
    }>;
  } {
    return {
      tables: this.getAllTables().map(table => ({
        name: table.name,
        forExport: table.forExport !== false,
        fieldCount: table.fields.length,
        exportableFieldCount: this.getExportableFields(table.name).length
      }))
    };
  }
} 

 