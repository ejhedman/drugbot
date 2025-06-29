/**
 * Core UI Entity Types
 * 
 * This file defines the core UI entity types used for rendering business objects in the application.
 * 
 * The type system supports dual usage patterns:
 * 1. Schema Definitions: Static metadata describing the structure of entities and their properties
 * 2. Runtime Instances: Actual data objects with property values for display and editing
 * 
 * Key Concepts:
 * - UIProperty: Represents a single field/attribute of an entity with metadata and optional value
 * - UIAggregate: Represents a collection of related data rows (like a table or sub-collection)
 * - UIEntity: Represents a complete business object with properties and optional aggregates
 * - UIEntityRef: Lightweight reference to an entity for hierarchical navigation
 * 
 * This unified approach allows the same type definitions to be used for:
 * - Database schema introspection
 * - Form generation and validation
 * - Table rendering and editing
 * - API data transfer
 */

// ============================================================================
// CORE UI PROPERTY TYPES
// ============================================================================

/**
 * UIPropertyMeta - Base metadata interface for entity properties
 * 
 * This interface defines the core metadata for a property that applies both to schema
 * definitions and runtime instances. It contains information about how the property
 * should be displayed, validated, and interacted with in the UI.
 * 
 * Field Descriptions:
 * - propertyName: Internal field name (matches database column or API field)
 * - controlType: UI control type for rendering (text input, dropdown, etc.)
 * - isEditable: Whether users can modify this property value
 * - isVisible: Whether this property should be shown in the UI
 * - isKey: Whether this property serves as a business key (not primary key)
 * - isId: Whether this property is a primary key or unique identifier
 * - isRequired: Whether this property must have a value for validation
 * - ordinal: Sort order for consistent property display (lower numbers first)
 * - selectValues: Available options for 'select' control type
 * - displayName: Human-readable label for the property (overrides propertyName)
 * - placeholder: Hint text shown in empty form fields
 * - validation: Additional validation rules (min/max values, regex patterns, etc.)
 */
export interface UIPropertyMeta {
  /** Internal property name (typically matches database column name) */
  propertyName: string;
  
  /** UI control type determining how this property is rendered and edited */
  controlType: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'boolean';
  
  /** Whether this property can be edited by users in the UI */
  isEditable: boolean;
  
  /** Whether this property should be displayed in the UI (hidden fields are typically system fields) */
  isVisible: boolean;
  
  /** Whether this property serves as a business key (used for lookups, URLs, etc.) */
  isKey: boolean;
  
  /** Whether this property is a primary key or unique identifier */
  isId: boolean;
  
  /** Whether this property is required and must have a value */
  isRequired: boolean;
  
  /** Display order for this property (lower numbers appear first) */
  ordinal: number;

  /** Available options for select/dropdown controls */
  selectValues?: string[];
  
  /** Human-readable display name (defaults to formatted propertyName if not provided) */
  displayName?: string;
  
  /** Placeholder text shown in empty form fields */
  placeholder?: string;
  
  /** Additional validation rules for this property */
  validation?: {
    /** Minimum value for numeric fields or minimum length for strings */
    min?: number;
    /** Maximum value for numeric fields or maximum length for strings */
    max?: number;
    /** Regular expression pattern for string validation */
    pattern?: string;
    /** Custom validation rule identifier */
    custom?: string;
  };  
}

/**
 * UIProperty - Complete property definition with optional runtime value
 * 
 * Extends UIPropertyMeta to include the actual property value for runtime instances.
 * This is the primary interface used throughout the application for both schema
 * definitions (where propertyValue is undefined) and runtime data (where propertyValue
 * contains the actual field value).
 * 
 * Usage Examples:
 * - Schema: { propertyName: "user_name", controlType: "text", isEditable: true, ... }
 * - Runtime: { propertyName: "user_name", controlType: "text", propertyValue: "john_doe", ... }
 */
export interface UIProperty extends UIPropertyMeta {
  /** The actual value of this property (undefined for schema definitions, populated for runtime instances) */
  propertyValue?: any;
}

// ============================================================================
// CORE UI AGGREGATE TYPES
// ============================================================================

/**
 * UIAggregateMeta - Base metadata interface for entity aggregates (collections/sub-tables)
 * 
 * An aggregate represents a collection of related data that belongs to an entity.
 * For example, a "Drug" entity might have aggregates like "Routes & Dosing", "Approvals",
 * and "Aliases" - each containing multiple rows of related data.
 * 
 * Field Descriptions:
 * - aggregateType: Type identifier for the aggregate (e.g., "GenericRoute", "GenericApproval")
 * - displayName: Human-readable name shown in tabs or section headers
 * - propertyDefs: Schema definitions for the properties that appear in each row
 * - ordinal: Display order for multiple aggregates (lower numbers first)
 */
export interface UIAggregateMeta {
  /** Type identifier for this aggregate (used for API routing and type checking) */
  aggregateType: string; 
  
  /** Human-readable display name (shown in tabs, section headers, etc.) */
  displayName: string;
  
  /** Property schema definitions for this aggregate (defines the "columns" of the collection) */
  propertyDefs?: UIPropertyMeta[];
  
  /** Display order when multiple aggregates are present (lower numbers appear first) */
  ordinal: number;
}

/**
 * UIAggregate - Complete aggregate definition with optional runtime data
 * 
 * Represents a collection of related data rows that belong to an entity. This is conceptually
 * similar to a sub-table or related collection in database terms. Each aggregate contains
 * multiple rows of data, where each row consists of the same set of properties.
 * 
 * The key insight is that an aggregate represents the entire collection, not individual rows.
 * For example, instead of having multiple "Route" objects, you have one "Routes & Dosing"
 * aggregate containing multiple rows of route data.
 * 
 * Data Structure:
 * - rows: 2D array where each inner array represents one row of data
 * - Each row contains UIProperty objects with the same propertyNames but different values
 * 
 * Usage Examples:
 * - Schema: { aggregateType: "GenericRoute", displayName: "Routes & Dosing", propertyDefs: [...] }
 * - Runtime: { aggregateType: "GenericRoute", displayName: "Routes & Dosing", rows: [[...], [...]] }
 */
export interface UIAggregate extends UIAggregateMeta {
  /** Entity identifier that this aggregate belongs to (optional for schema definitions) */
  entityUid?: string; 
  
  /** 
   * Array of data rows, where each row is an array of UIProperty objects.
   * This creates a 2D structure: rows[rowIndex][propertyIndex]
   * All rows in the same aggregate have the same property structure (same propertyNames)
   * but different propertyValues.
   */
  rows?: UIProperty[][];
}

// ============================================================================
// CORE UI ENTITY REFERENCE TYPES
// ============================================================================

/**
 * UIEntityRef - Lightweight reference to an entity for hierarchical navigation
 * 
 * Used to represent entity relationships and hierarchical structures without
 * loading the complete entity data. This is particularly useful for tree views,
 * breadcrumbs, and parent-child navigation.
 * 
 * Field Descriptions:
 * - entityUid: Unique identifier for the referenced entity (optional for schema refs)
 * - displayName: Human-readable name for display in navigation UI
 * - ancestors: Chain of parent entities leading to the root
 * - children: Direct child entities (for expandable tree views)
 * 
 * Note: The ancestors and children arrays contain UIEntityRef objects, creating
 * a recursive structure that can represent arbitrarily deep hierarchies.
 */
export interface UIEntityRef {
  /** Unique identifier for the referenced entity (undefined for schema-only references) */
  entityUid?: string;
  
  /** Human-readable name displayed in navigation, breadcrumbs, tree views, etc. */
  displayName: string;
  
  /** Array of ancestor entities from root to immediate parent (for breadcrumb navigation) */
  ancestors: UIEntityRef[];
  
  /** Array of direct child entities (for expandable tree views and drill-down navigation) */
  children: UIEntityRef[];
}

// ============================================================================
// CORE UI ENTITY TYPES
// ============================================================================

/**
 * UIEntityMeta - Base metadata interface for entity definitions
 * 
 * Contains the core metadata that applies to both schema definitions and runtime instances.
 * This includes display information, property schemas, and aggregate schemas.
 * 
 * Field Descriptions:
 * - entityType: Type identifier for the entity (optional, used for polymorphic scenarios)
 * - displayName: Human-readable name for the entity type or instance
 * - pluralName: Plural form for collections and lists
 * - propertyDefs: Schema definitions for the entity's properties
 * - aggregateDefs: Schema definitions for the entity's aggregates/sub-collections
 * - tableName: Database table name (for schema definitions only)
 */
export interface UIEntityMeta {
  /** Type identifier for this entity (useful for polymorphic entities or type checking) */
  entityType?: string;
  
  /** Human-readable display name (for entity types: "Generic Drug", for instances: "Aspirin") */
  displayName: string;
  
  /** Plural form of the entity name (used in collection headers, navigation: "Generic Drugs") */
  pluralName?: string; 
  
  /** Property schema definitions (the "columns" or "fields" that this entity type has) */
  propertyDefs?: UIPropertyMeta[];
  
  /** Aggregate schema definitions (the sub-collections that this entity type can have) */
  aggregateDefs?: UIAggregateMeta[];
}

/**
 * UIEntity - Complete entity definition with optional runtime data
 * 
 * The primary interface for representing business objects in the application.
 * Supports dual usage as both schema definitions and runtime instances.
 * 
 * SCHEMA DEFINITION USAGE:
 * Used to define the structure, validation rules, and UI metadata for an entity type.
 * Contains propertyDefs, aggregateDefs, tableName, and display information.
 * Example: Definition of what a "Generic Drug" entity looks like
 * 
 * RUNTIME INSTANCE USAGE:
 * Used to represent actual entity instances with data values.
 * Contains entityUid, entityKey, properties with values, aggregates with data.
 * Example: A specific drug like "Aspirin" with its actual property values
 * 
 * HIERARCHICAL RELATIONSHIPS:
 * Entities can participate in parent-child relationships through ancestors and children.
 * This enables tree views, breadcrumb navigation, and drill-down scenarios.
 * 
 * AGGREGATES:
 * Entities can contain aggregates (sub-collections) like "Routes & Dosing" or "Approvals".
 * Each aggregate contains multiple rows of related data.
 */
export interface UIEntity extends UIEntityMeta {
  // ============================================================================
  // RUNTIME INSTANCE IDENTIFICATION
  // ============================================================================
  
  /** Unique GUID identifier for this specific entity instance (undefined for schema definitions) */
  entityUid?: string;
  
  /** 
   * Business key for this entity instance (used in URLs, API calls, human-readable references)
   * Example: "aspirin" or "drug_12345"
   */
  entityKey?: string;
  
  // ============================================================================
  // RUNTIME INSTANCE DATA
  // ============================================================================
  
  /** 
   * Array of properties with actual values for this entity instance
   * Each UIProperty contains both metadata (from schema) and the current value
   * Example: [{ propertyName: "drug_name", propertyValue: "Aspirin", isEditable: true, ... }]
   */
  properties?: UIProperty[];
  
  /** 
   * Array of aggregates (sub-collections) containing related data rows
   * Each UIAggregate represents a collection like "Routes & Dosing" with multiple data rows
   * Example: [{ displayName: "Routes & Dosing", rows: [[route1_props], [route2_props]] }]
   */
  aggregates?: UIAggregate[];
  
  // ============================================================================
  // HIERARCHICAL RELATIONSHIPS
  // ============================================================================
  
  /** 
   * Array of ancestor entities from root to immediate parent
   * Used for breadcrumb navigation and understanding entity context
   * Example: [{ displayName: "Pharmaceuticals" }, { displayName: "Pain Relievers" }]
   */
  ancestors?: UIEntityRef[];
  
  /** 
   * Array of direct child entities
   * Used for tree view expansion and drill-down navigation
   * Example: [{ displayName: "Bayer Aspirin" }, { displayName: "Generic Aspirin" }]
   */
  children?: UIEntityRef[];
}

// ============================================================================
// TYPE GUARD FUNCTIONS
// ============================================================================

/**
 * Type guard to check if an object is a valid UIProperty
 * 
 * Validates that an object conforms to the UIProperty interface by checking
 * required fields and their types. Used for runtime type checking and
 * data validation when processing API responses or user input.
 * 
 * @param obj - Object to validate
 * @returns True if object is a valid UIProperty, false otherwise
 */
export function isUIProperty(obj: any): obj is UIProperty {
  return obj && 
    typeof obj.propertyName === 'string' &&
    typeof obj.ordinal === 'number' &&
    typeof obj.isEditable === 'boolean' &&
    typeof obj.isVisible === 'boolean' &&
    typeof obj.isKey === 'boolean' &&
    // Optional schema metadata checks
    (obj.type === undefined || typeof obj.type === 'string') &&
    (obj.ui === undefined || (obj.ui && typeof obj.displayName === 'string'));
}

/**
 * Type guard to check if an object is a valid UIAggregate
 * 
 * Validates that an object conforms to the UIAggregate interface by checking
 * required fields, optional runtime data, and the structure of the rows array.
 * Ensures that if rows are present, they form a valid 2D array of UIProperty objects.
 * 
 * @param obj - Object to validate
 * @returns True if object is a valid UIAggregate, false otherwise
 */
export function isUIAggregate(obj: any): obj is UIAggregate {
  return obj && 
  typeof obj.displayName === 'string' &&
  (obj.aggregateType === undefined || typeof obj.aggregateType === 'string') &&
  typeof obj.ordinal === 'number' &&
    // Runtime aggregate checks
    (obj.entityUid === undefined || typeof obj.entityUid === 'string') &&
    // Validate rows structure: must be 2D array of UIProperty objects
    (obj.rows === undefined || (Array.isArray(obj.rows) && obj.rows.every((row: any) => Array.isArray(row) && row.every((prop: any) => isUIProperty(prop))))) &&
    // Schema definition checks
    (obj.propertyDefs === undefined || (Array.isArray(obj.propertyDefs) && obj.propertyDefs.every((prop: any) => isUIProperty(prop))));
}

/**
 * Type guard to check if an object is a valid UIEntity
 * 
 * Validates that an object conforms to the UIEntity interface by checking
 * required fields and validating nested structures (properties and aggregates).
 * Handles both schema definitions and runtime instances.
 * 
 * @param obj - Object to validate
 * @returns True if object is a valid UIEntity, false otherwise
 */
export function isUIEntity(obj: any): obj is UIEntity {
  return obj && 
    typeof obj.displayName === 'string' &&
    // Runtime entity instance checks
    (obj.entityUid === undefined || typeof obj.entityUid === 'string') &&
    (obj.entityKey === undefined || typeof obj.entityKey === 'string') &&
    (obj.entity_type === undefined || typeof obj.entity_type === 'string') &&
    (obj.properties === undefined || (Array.isArray(obj.properties) && obj.properties.every((prop: any) => isUIProperty(prop)))) &&
    (obj.aggregates === undefined || (Array.isArray(obj.aggregates) && obj.aggregates.every((coll: any) => isUIAggregate(coll)))) &&
    // Schema definition checks
    (obj.name === undefined || typeof obj.name === 'string') &&
    (obj.tableName === undefined || typeof obj.tableName === 'string') &&
    (obj.properties === undefined || (Array.isArray(obj.properties) && obj.properties.every((field: any) => isUIProperty(field)))) &&
    (obj.aggregates === undefined || (Array.isArray(obj.aggregates) && obj.aggregates.every((coll: any) => isUIAggregate(coll))));
}

/**
 * Type guard to check if a UIEntity is being used as a schema definition
 * 
 * Determines whether a UIEntity object represents a schema definition rather than
 * a runtime instance. Schema definitions have tableName and properties defined,
 * while runtime instances have entityUid and entityKey.
 * 
 * @param obj - UIEntity object to check
 * @returns True if the entity is a schema definition, false if it's a runtime instance
 */
export function isUIEntitySchema(obj: UIEntity): obj is UIEntity & { name: string; tableName: string; properties: UIProperty[] } {
  return obj.properties !== undefined;
}

/**
 * Type guard to check if a UIEntity is being used as a runtime instance
 * 
 * Determines whether a UIEntity object represents a runtime instance with actual
 * data rather than a schema definition. Runtime instances have entityUid, entityKey,
 * and properties with values.
 * 
 * @param obj - UIEntity object to check
 * @returns True if the entity is a runtime instance, false if it's a schema definition
 */
export function isUIEntityInstance(obj: UIEntity): obj is UIEntity & { entityUid: string; entityKey: string; properties: UIProperty[] } {
  return obj.entityUid !== undefined && obj.entityKey !== undefined && obj.properties !== undefined;
} 
