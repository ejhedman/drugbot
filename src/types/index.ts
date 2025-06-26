/**
 * Data Types for the Repository System
 * 
 * This document defines all data types used in the application.
 * These types are shared between the server-side API and client-side components.
 */

// ============================================================================
// CORE ENTITY TYPES
// ============================================================================

/**
 * Entity - The primary entity type representing main business objects
 * 
 * Properties:
 * - entity_key: Unique identifier for the entity (primary key)
 * - entity_name: Human-readable name for the entity
 * - entity_property1: Additional property for entity metadata
 * 
 * Relationships:
 * - Has many ChildEntity (one-to-many)
 * - Has many EntityColl1 (one-to-many)
 */
export interface Entity {
  entity_key: string;
  entity_name: string;
  entity_property1: string;
}

/**
 * ChildEntity - Child entities that belong to a parent Entity
 * 
 * Properties:
 * - child_entity_key: Unique identifier for the child entity (primary key)
 * - entity_key: Foreign key reference to parent Entity
 * - child_entity_name: Human-readable name for the child entity
 * - child_entity_property1: Additional property for child entity metadata
 * 
 * Relationships:
 * - Belongs to Entity (many-to-one)
 * - Has many ChildEntityColl1 (one-to-many)
 * - Has many ChildEntityColl2 (one-to-many)
 */
export interface ChildEntity {
  child_entity_key: string;
  entity_key: string;
  child_entity_name: string;
  child_entity_property1: string;
}

// ============================================================================
// COLLECTION TYPES
// ============================================================================

/**
 * EntityColl1 - Collection data associated with Entity
 * 
 * Properties:
 * - entity_key: Foreign key reference to parent Entity
 * - coll1_property1: String property for collection data
 * - coll1_property2: String property for collection data
 * - coll1_property3: Numeric property for collection data
 * 
 * Relationships:
 * - Belongs to Entity (many-to-one)
 */
export interface EntityColl1 {
  entity_key: string;
  coll1_property1: string;
  coll1_property2: string;
  coll1_property3: number;
}

/**
 * ChildEntityColl1 - Collection data associated with ChildEntity
 * 
 * Properties:
 * - child_entity_key: Foreign key reference to parent ChildEntity
 * - coll1_property1: String property for collection data
 * - coll1_property2: Numeric property for collection data
 * 
 * Relationships:
 * - Belongs to ChildEntity (many-to-one)
 */
export interface ChildEntityColl1 {
  child_entity_key: string;
  coll1_property1: string;
  coll1_property2: number;
}

/**
 * ChildEntityColl2 - Additional collection data associated with ChildEntity
 * 
 * Properties:
 * - child_entity_key: Foreign key reference to parent ChildEntity
 * - coll2_property1: String property for collection data
 * - coll2_property2: Boolean property for collection data
 * 
 * Relationships:
 * - Belongs to ChildEntity (many-to-one)
 */
export interface ChildEntityColl2 {
  child_entity_key: string;
  coll2_property1: string;
  coll2_property2: boolean;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * API Response wrapper for consistent error handling
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Search parameters for entity queries
 */
export interface EntitySearchParams {
  search?: string;
}

/**
 * Search parameters for child entity queries
 */
export interface ChildEntitySearchParams {
  entityKey?: string;
  search?: string;
}

/**
 * Qualified query parameters for collection data
 */
export interface CollectionQueryParams {
  entityKey?: string;
  childKey?: string;
}

// ============================================================================
// CREATE/UPDATE TYPES
// ============================================================================

/**
 * Data required to create a new Entity
 */
export interface CreateEntityRequest {
  entity_name: string;
  entity_property1: string;
}

/**
 * Data required to update an existing Entity
 */
export interface UpdateEntityRequest {
  entity_name?: string;
  entity_property1?: string;
}

/**
 * Data required to create a new ChildEntity
 */
export interface CreateChildEntityRequest {
  entity_key: string;
  child_entity_name: string;
  child_entity_property1: string;
}

/**
 * Data required to update an existing ChildEntity
 */
export interface UpdateChildEntityRequest {
  child_entity_name?: string;
  child_entity_property1?: string;
}

/**
 * Data required to create a new EntityColl1
 */
export interface CreateEntityColl1Request {
  entity_key: string;
  coll1_property1: string;
  coll1_property2: string;
  coll1_property3: number;
}

/**
 * Data required to update an existing EntityColl1
 */
export interface UpdateEntityColl1Request {
  coll1_property1?: string;
  coll1_property2?: string;
  coll1_property3?: number;
}

/**
 * Data required to create a new ChildEntityColl1
 */
export interface CreateChildEntityColl1Request {
  child_entity_key: string;
  coll1_property1: string;
  coll1_property2: number;
}

/**
 * Data required to update an existing ChildEntityColl1
 */
export interface UpdateChildEntityColl1Request {
  coll1_property1?: string;
  coll1_property2?: number;
}

/**
 * Data required to create a new ChildEntityColl2
 */
export interface CreateChildEntityColl2Request {
  child_entity_key: string;
  coll2_property1: string;
  coll2_property2: boolean;
}

/**
 * Data required to update an existing ChildEntityColl2
 */
export interface UpdateChildEntityColl2Request {
  coll2_property1?: string;
  coll2_property2?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Type guard to check if an object is an Entity
 */
export function isEntity(obj: any): obj is Entity {
  return obj && 
         typeof obj.entity_key === 'string' &&
         typeof obj.entity_name === 'string' &&
         typeof obj.entity_property1 === 'string';
}

/**
 * Type guard to check if an object is a ChildEntity
 */
export function isChildEntity(obj: any): obj is ChildEntity {
  return obj && 
         typeof obj.child_entity_key === 'string' &&
         typeof obj.entity_key === 'string' &&
         typeof obj.child_entity_name === 'string' &&
         typeof obj.child_entity_property1 === 'string';
}

/**
 * Type guard to check if an object is an EntityColl1
 */
export function isEntityColl1(obj: any): obj is EntityColl1 {
  return obj && 
         typeof obj.entity_key === 'string' &&
         typeof obj.coll1_property1 === 'string' &&
         typeof obj.coll1_property2 === 'string' &&
         typeof obj.coll1_property3 === 'number';
}

/**
 * Type guard to check if an object is a ChildEntityColl1
 */
export function isChildEntityColl1(obj: any): obj is ChildEntityColl1 {
  return obj && 
         typeof obj.child_entity_key === 'string' &&
         typeof obj.coll1_property1 === 'string' &&
         typeof obj.coll1_property2 === 'number';
}

/**
 * Type guard to check if an object is a ChildEntityColl2
 */
export function isChildEntityColl2(obj: any): obj is ChildEntityColl2 {
  return obj && 
         typeof obj.child_entity_key === 'string' &&
         typeof obj.coll2_property1 === 'string' &&
         typeof obj.coll2_property2 === 'boolean';
} 