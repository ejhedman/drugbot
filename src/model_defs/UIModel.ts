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
 * UIProperty - Unified interface for both runtime data and schema definitions
 * 
 * Runtime Usage (with property_value):
 * - property_name: The name/label of the property
 * - property_value: The actual value (can be any type)
 * - ordinal: Sort order for displaying property order
 * - is_editable: Whether this property can be edited in the UI
 * - is_visible: Whether this property should be displayed in the UI
 * - is_key: Whether this property serves as a key/identifier
 * 
 * Schema Definition Usage (without property_value):
 * - All the above plus schema metadata for configuration
 */
export interface UIProperty {
  // Core identification and runtime data
  property_name: string;
  property_value?: any; // Optional for schema definitions
  ordinal: number;
  is_editable: boolean;
  is_visible: boolean;
  is_key: boolean;
  
  // Schema metadata (optional, used for field definitions)
  type?: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'json';
  sqlType?: string;
  isId?: boolean;
  isRequired?: boolean;
  enumValues?: string[];

  displayName?: string;   // EJH: Make required
  visibility?: 'visible' | 'hidden' | 'readonly';  // EJH: Make required
  placeholder?: string;
  controlType?: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox';  // EJH: Make required
  validation?: {  // EJH: Make required
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };  


}

/**
 * UIAggregate - Unified interface for both runtime aggregates and schema definitions
 * 
 * Runtime Usage (with entity_id and properties):
 * - entity_id: The id of the entity owning the aggregate
 * - displayName: The name to display in the tab
 * - ordinal: Sort order for displaying tabs
 * - properties: Array of actual property instances
 * 
 * Schema Definition Usage (with id and schema metadata):
 * - id: Schema identifier for the sub-collection type
 * - All the above plus schema metadata for configuration
 */
export interface UIAggregate {
  // Core identification and runtime data
  entity_id?: string; // Optional for schema definitions
  aggregate_type?: string; // Optional for schema definitions, required for runtime usage
  displayName: string;
  ordinal: number;
  properties?: UIProperty[]; // Optional for schema definitions
  
  // Schema metadata (optional, used for sub-collection definitions)
  id?: string; // Schema identifier
  type?: 'properties' | 'collection' | 'custom';
  collectionEntity?: string;
  customComponent?: string;
}



/**
 * UIEntityRef - A Reference to an entity (that can be used in a tree view)
 * 
 * Properties:
 * - entity_id: The id of the entity
 * - display_name: The name to display
 * - ancestors: Array of ancestors (Entity Refs)
 * - children: Array of children (Entity Refs)
 */
export interface UIEntityRef {
  entity_id: string;
  displayName: string;
  ancestors: UIEntityRef[];
  children: UIEntityRef[];
}

/**
 * UIEntity - Unified interface for both runtime entity instances and schema definitions
 * 
 * Runtime Usage (with entity_id, entity_key, properties with values):
 * - entity_id: Unique GUID identifier for the instance
 * - entity_key: String key identifier (for URLs, references, etc.)
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
export interface UIEntity {
  // Runtime instance identification (optional for schema definitions)
  entity_id?: string;
  entity_key?: string;
  entity_type?: string;
  
  // Core display information (required for both)
  displayName: string;
  
  // Runtime data (optional for schema definitions)
  properties?: UIProperty[]; // Runtime: properties with values
  aggregates?: UIAggregate[]; // Runtime: aggregates with data
  ancestors?: UIEntityRef[];
  children?: UIEntityRef[];
  
  // Schema metadata (optional, used for entity type definitions)
  name?: string; // Schema identifier
  tableName?: string; // Database table name
  pluralName?: string; // Plural name for collections
  comment?: string; // Documentation
  // children?: UIEntityRef[]; // Schema: child entity references
  // hierarchical?: {
  //   parentField: string;
  //   maxDepth?: number;
  // };
}

// ============================================================================
// TYPE GUARD FUNCTIONS
// ============================================================================

/**
 * Type guard to check if an object is a UIProperty
 */
export function isUIProperty(obj: any): obj is UIProperty {
  return obj && 
    typeof obj.property_name === 'string' &&
    typeof obj.ordinal === 'number' &&
    typeof obj.is_editable === 'boolean' &&
    typeof obj.is_visible === 'boolean' &&
    typeof obj.is_key === 'boolean' &&
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
  (obj.aggregate_type === undefined || typeof obj.aggregate_type === 'string') &&
  typeof obj.ordinal === 'number' &&
    // Runtime aggregate checks
    (obj.entity_id === undefined || typeof obj.entity_id === 'string') &&
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
    (obj.entity_id === undefined || typeof obj.entity_id === 'string') &&
    (obj.entity_key === undefined || typeof obj.entity_key === 'string') &&
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
  return obj.name !== undefined && obj.tableName !== undefined && obj.properties !== undefined;
}

/**
 * Type guard to check if a UIEntity is being used as a runtime instance
 */
export function isUIEntityInstance(obj: UIEntity): obj is UIEntity & { entity_id: string; entity_key: string; properties: UIProperty[] } {
  return obj.entity_id !== undefined && obj.entity_key !== undefined && obj.properties !== undefined;
} 
