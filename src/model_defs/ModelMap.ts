/**
 * Model Mapping System
 * 
 * This file defines the mapping interfaces and types that connect UI models and database models.
 * It enables resolution of UI properties to specific database tables and fields, facilitating data transformation between the UI layer and the database layer.
 * 
 * Key Concepts:
 * - PropertyMapping: Maps a UIProperty to a specific database table and field
 * - EntityMapping: Maps a UIEntity to a primary database table
 * - AggregateMapping: Maps a UIAggregate to a database table (for sub-collections)
 * - ModelMap: Complete mapping configuration for the entire application
 */

// ============================================================================
// CORE MAPPING TYPES
// ============================================================================

/**
 * PropertyMapping - Maps a UI property to a database table and field
 * 
 * This is the fundamental mapping unit that connects a UIProperty (with its UI metadata)
 * to a specific database table and field. This enables the system to know exactly
 * where to read/write data for each property.
 * 
 * Field Descriptions:
 * - propertyName: The UI property name (matches UIProperty.propertyName)
 * - tableName: The database table name where this property's data is stored
 * - fieldName: The specific database field name within the table
 * - isComputed: Whether this property is calculated rather than stored directly
 * - transform: Optional data transformation rules for complex mappings
 */
export interface PropertyMapping {
  /** UI property name (must match UIProperty.propertyName) */
  propertyName: string;
  
  /** Database table name where this property's data is stored */
  tableName: string;
  
  /** Database field name within the table */
  fieldName: string;
  
  /** Whether this property is computed/calculated rather than directly stored */
  isComputed?: boolean;
  
  /** Optional transformation rules for complex data mappings */
  transform?: {
    /** Transform function name for reading data from DB to UI */
    fromDB?: string;
    /** Transform function name for writing data from UI to DB */
    toDB?: string;
    /** Additional parameters for transformation functions */
    params?: { [key: string]: any };
  };
}

/**
 * EntityMapping - Maps a UI entity to its primary database table
 * 
 * Defines the primary database table that stores the main data for a UIEntity.
 * Each entity has one primary table, though it may also use aggregate tables
 * for sub-collections.
 * 
 * Field Descriptions:
 * - entityType: The UI entity type identifier (optional, matches UIEntity.entityType)
 * - tableName: The primary database table for this entity
 * - keyField: The database field that serves as the business key
 * - displayNameField: The database field used for display names
 * - propertyMappings: Array of property mappings for this entity's properties
 */
export interface EntityMapping {
  /** UI entity type identifier (matches UIEntity.entityType if present) */
  entityType?: string;
  
  /** Primary database table name for this entity */
  tableName: string;
  
  /** Database field that serves as the business key (for URLs, references) */
  keyField: string;
  
  /** Database field used for entity display names */
  displayNameField: string;
  
  /** Property mappings for all properties belonging to this entity */
  propertyMappings: PropertyMapping[];
}

/**
 * AggregateMapping - Maps a UI aggregate to its database table
 * 
 * Defines how a UIAggregate (sub-collection like "Routes & Dosing") maps to
 * a specific database table. Aggregates represent collections of related data
 * that belong to an entity.
 * 
 * Field Descriptions:
 * - aggregateType: The UI aggregate type identifier (matches UIAggregate.aggregateType)
 * - tableName: The database table that stores this aggregate's data
 * - parentKeyField: The field that links back to the parent entity
 * - propertyMappings: Array of property mappings for this aggregate's properties
 */
export interface AggregateMapping {
  /** UI aggregate type identifier (matches UIAggregate.aggregateType) */
  aggregateType: string;
  
  /** Database table name for this aggregate */
  tableName: string;
  
  /** Database field that links back to the parent entity (foreign key) */
  parentKeyField: string;
  
  /** Property mappings for all properties belonging to this aggregate */
  propertyMappings: PropertyMapping[];
}

/**
 * ModelMap - Complete mapping configuration
 * 
 * The top-level mapping configuration that contains all entity mappings and
 * aggregate mappings for the entire application. This serves as the central
 * registry for UI-to-database mappings.
 * 
 * Field Descriptions:
 * - name: Descriptive name for this model mapping configuration
 * - version: Version identifier for tracking mapping changes
 * - entityMappings: All entity mappings keyed by entity identifier
 * - aggregateMappings: All aggregate mappings keyed by aggregate type
 */
export interface ModelMap {
  /** Descriptive name for this mapping configuration */
  name: string;
  
  /** Version identifier for tracking changes */
  version: string;
  
  /** Entity mappings keyed by entity identifier (e.g., 'generic_drugs') */
  entityMappings: { [entityKey: string]: EntityMapping };
  
  /** Aggregate mappings keyed by aggregate type (e.g., 'GenericRoute') */
  aggregateMappings: { [aggregateType: string]: AggregateMapping };
}

// ============================================================================
// MAPPING UTILITY TYPES
// ============================================================================

/**
 * MappingContext - Runtime context for mapping operations
 * 
 * Provides additional context needed for complex mapping operations,
 * such as user permissions, tenant information, or runtime parameters.
 */
export interface MappingContext {
  /** Current user identifier (for permission-based field access) */
  userId?: string;
  
  /** Tenant/organization identifier (for multi-tenant scenarios) */
  tenantId?: string;
  
  /** Additional runtime parameters for mapping operations */
  params?: { [key: string]: any };
}

/**
 * MappingResult - Result of a mapping operation
 * 
 * Standardized result type for mapping operations that includes
 * success status, mapped data, and any errors or warnings.
 */
export interface MappingResult<T = any> {
  /** Whether the mapping operation was successful */
  success: boolean;
  
  /** The mapped data (if successful) */
  data?: T;
  
  /** Error message (if unsuccessful) */
  error?: string;
  
  /** Warning messages (non-fatal issues) */
  warnings?: string[];
}

// ============================================================================
// TYPE GUARD FUNCTIONS
// ============================================================================

/**
 * Type guard to check if an object is a valid PropertyMapping
 */
export function isPropertyMapping(obj: any): obj is PropertyMapping {
  return obj && 
    typeof obj.propertyName === 'string' &&
    typeof obj.tableName === 'string' &&
    typeof obj.fieldName === 'string';
}

/**
 * Type guard to check if an object is a valid EntityMapping
 */
export function isEntityMapping(obj: any): obj is EntityMapping {
  return obj && 
    typeof obj.tableName === 'string' &&
    typeof obj.keyField === 'string' &&
    typeof obj.displayNameField === 'string' &&
    Array.isArray(obj.propertyMappings) &&
    obj.propertyMappings.every((mapping: any) => isPropertyMapping(mapping));
}

/**
 * Type guard to check if an object is a valid AggregateMapping
 */
export function isAggregateMapping(obj: any): obj is AggregateMapping {
  return obj && 
    typeof obj.aggregateType === 'string' &&
    typeof obj.tableName === 'string' &&
    typeof obj.parentKeyField === 'string' &&
    Array.isArray(obj.propertyMappings) &&
    obj.propertyMappings.every((mapping: any) => isPropertyMapping(mapping));
}

/**
 * Type guard to check if an object is a valid ModelMap
 */
export function isModelMap(obj: any): obj is ModelMap {
  return obj && 
    typeof obj.name === 'string' &&
    typeof obj.version === 'string' &&
    obj.entityMappings &&
    obj.aggregateMappings &&
    Object.values(obj.entityMappings).every((mapping: any) => isEntityMapping(mapping)) &&
    Object.values(obj.aggregateMappings).every((mapping: any) => isAggregateMapping(mapping));
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Find property mapping by property name within an entity mapping
 */
export function findPropertyMapping(entityMapping: EntityMapping, propertyName: string): PropertyMapping | undefined {
  return entityMapping.propertyMappings.find(mapping => mapping.propertyName === propertyName);
}

/**
 * Find property mapping by property name within an aggregate mapping
 */
export function findAggregatePropertyMapping(aggregateMapping: AggregateMapping, propertyName: string): PropertyMapping | undefined {
  return aggregateMapping.propertyMappings.find(mapping => mapping.propertyName === propertyName);
}

/**
 * Get all unique table names referenced in a model map
 */
export function getReferencedTables(modelMap: ModelMap): string[] {
  const tables = new Set<string>();
  
  // Add tables from entity mappings
  Object.values(modelMap.entityMappings).forEach(entityMapping => {
    tables.add(entityMapping.tableName);
    entityMapping.propertyMappings.forEach(propMapping => {
      tables.add(propMapping.tableName);
    });
  });
  
  // Add tables from aggregate mappings
  Object.values(modelMap.aggregateMappings).forEach(aggregateMapping => {
    tables.add(aggregateMapping.tableName);
    aggregateMapping.propertyMappings.forEach(propMapping => {
      tables.add(propMapping.tableName);
    });
  });
  
  return Array.from(tables);
} 