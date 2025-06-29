/**
 * Core UI Entity Types
 * 
 * This file defines the core UI entity types used for rendering in the application.
 * These types represent the unified structure for displaying any business object in the UI.
 */

// ============================================================================
// CORE UI ENTITY TYPES
// ============================================================================

/**
 * UIPropertyMeta - Unified interface for both runtime data and schema definitions
 * 
 * - propertyName: The name/label of the property
 * - ordinal: Sort order for displaying property order
 * - isEditable: Whether this property can be edited in the UI
 * - isVisible: Whether this property should be displayed in the UI
 * - isKey: Whether this property serves as a key/identifier
 * 
 * Schema Definition Usage (without propertyValue):
 * - All the above plus schema metadata for configuration
 */
export interface UIPropertyMeta {
  propertyName: string;
  controlType: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'boolean';
  isEditable: boolean;
  isVisible: boolean;
  isKey: boolean;
  isId: boolean;
  isRequired: boolean;
  ordinal: number;

  selectValues?: string[];
  displayName?: string;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };  
}

export interface UIProperty extends UIPropertyMeta {
  propertyValue?: any;
}

/**
 * UIAggregate - Unified interface for both runtime aggregates and schema definitions
 * 
 * Runtime Usage (with entityUid and properties):
 * - displayName: The name to display in the tab
 * - ordinal: Sort order for displaying tabs
 * - properties: Array of actual property instances
 * 
 * Schema Definition Usage (with id and schema metadata):
 * - id: Schema identifier for the sub-collection type
 * - All the above plus schema metadata for configuration
 */
export interface UIAggregateMeta {
  aggregateType: string; 
  displayName: string;
  propertyDefs?: UIPropertyMeta[]; // Optional for schema definitions
  ordinal: number;
}

export interface UIAggregate extends UIAggregateMeta {
  entityUid?: string; 
  properties?: UIProperty[]; // Optional for schema definitions
}

/**
 * UIEntityRef - A Reference to an entity (that can be used in a tree view)
 * 
 * Properties:
 * - entityUid: The id of the entity
 * - displayName: The name to display
 * - ancestors: Array of ancestors (Entity Refs)
 * - children: Array of children (Entity Refs)
 */
export interface UIEntityRef {
  entityUid?: string;
  displayName: string;
  ancestors: UIEntityRef[];
  children: UIEntityRef[];
}


/**
 * UIEntity - Unified interface for both runtime entity instances and schema definitions
 * 
 * Runtime Usage (with entityUid, entityKey, properties with values):
 * - entityUid: Unique GUID identifier for the instance
 * - entityKey: String key identifier (for URLs, references, etc.)
 * - displayName: Human-readable name for the entity instance
 * - properties: Array of properties with actual values
 * - aggregates: Array of sub-collections with runtime data
 * - ancestors: Array of ancestors for hierarchical display
 * - children: Array of children for hierarchical display
 * 
 * Schema Definition Usage (with name, tableName, properties):
 * - name: Schema identifier
 * - tableName: Database table name
 * - displayName: Human-readable name for the entity type
 * - pluralName: Plural name for collections
 * - comment: Optional documentation
 * - properties: Array of property definitions (UIProperty without values)
 * - relationships: Array of child entity references (UIEntityRef objects)
 * - aggregates: Array of sub-collection definitions
 * - hierarchical: Optional hierarchical configuration
 */
export interface UIEntityMeta {
  entityType?: string;
  displayName: string;
  pluralName?: string; 
  propertyDefs?: UIPropertyMeta[]; // Runtime: properties with values
  aggregateDefs?: UIAggregateMeta[]; // Runtime: aggregates with data

  tableName?: string; // Database table name
}

export interface UIEntity extends UIEntityMeta {
  // Runtime instance identification (optional for schema definitions)
  entityUid?: string;
  entityKey?: string;
  
  // Runtime data (optional for schema definitions)
  properties?: UIProperty[]; // Runtime: properties with values
  aggregates?: UIAggregate[]; // Runtime: aggregates with data
  ancestors?: UIEntityRef[];
  children?: UIEntityRef[];
}

// ============================================================================
// TYPE GUARD FUNCTIONS
// ============================================================================

/**
 * Type guard to check if an object is a UIProperty
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
 * Type guard to check if an object is a UIAggregate
 */
export function isUIAggregate(obj: any): obj is UIAggregate {
  return obj && 
  typeof obj.displayName === 'string' &&
  (obj.aggregateType === undefined || typeof obj.aggregateType === 'string') &&
  typeof obj.ordinal === 'number' &&
    // Runtime aggregate checks
    (obj.entityUid === undefined || typeof obj.entityUid === 'string') &&
    (obj.properties === undefined || (Array.isArray(obj.properties) && obj.properties.every((prop: any) => isUIProperty(prop)))) &&
    // Schema definition checks
    (obj.id === undefined || typeof obj.id === 'string') &&
    (obj.type === undefined || ['properties', 'collection', 'custom'].includes(obj.type));
}

/**
 * Type guard to check if an object is a UIEntity (runtime or schema)
 */
export function isUIEntity(obj: any): obj is UIEntity {
  return obj && 
    typeof obj.displayName === 'string' &&
    // Runtime entity checks
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
 */
export function isUIEntitySchema(obj: UIEntity): obj is UIEntity & { name: string; tableName: string; properties: UIProperty[] } {
  return obj.tableName !== undefined && obj.properties !== undefined;
}

/**
 * Type guard to check if a UIEntity is being used as a runtime instance
 */
export function isUIEntityInstance(obj: UIEntity): obj is UIEntity & { entityUid: string; entityKey: string; properties: UIProperty[] } {
  return obj.entityUid !== undefined && obj.entityKey !== undefined && obj.properties !== undefined;
} 
