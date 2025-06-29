/**
 * Data Types for the Repository System
 * 
 * This document defines all data types used in the application.
 * These types are shared between the server-side API and client-side components.
 */

// ============================================================================
// CORE UI ENTITY TYPES (imported from separate file)
// ============================================================================

export type { UIProperty, UIAggregate, UIEntity, UIEntityRef } from './UIModel';
export { isUIProperty, isUIAggregate, isUIEntity } from './UIModel';

// ============================================================================
// CORE DATABASE TYPES (imported from separate file)
// ============================================================================

export type { DBField, DBTable, DBSchema } from './DBModel';
export { 
  isDBField, 
  isDBTable, 
  isDBSchema, 
  findTableByName, 
  findFieldByName, 
  getPrimaryKeyFields, 
  getForeignKeyFields 
} from './DBModel';

// ============================================================================
// CREATE/UPDATE TYPES
// ============================================================================

/**
 * Data required to create a new Entity
 */
export interface CreateEntityRequest {
  displayName: string;
  entity_property1: string;
}

/**
 * Data required to update an existing Entity
 */
export interface UpdateEntityRequest {
  displayName?: string;
  entity_property1?: string;
}

/**
 * Data required to create a new ChildEntity
 */
export interface CreateChildEntityRequest {
  parent_entity_key: string;
  displayName: string;
  child_entity_property1: string;
}

/**
 * Data required to update an existing ChildEntity
 */
export interface UpdateChildEntityRequest {
  displayName?: string;
  child_entity_property1?: string;
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
    property_name: string;
    property_value: string;
    ordinal: number;
    is_editable: boolean;
    is_visible: boolean;
    is_key: boolean;
  }[];
}

/**
 * Data required to update an existing UIAggregate
 */
export interface UpdateUIAggregateRequest {
  displayName?: string;
  ordinal?: number;
  properties?: {
    property_name: string;
    property_value: string;
    ordinal: number;
    is_editable: boolean;
    is_visible: boolean;
    is_key: boolean;
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
    property_name: string;
    property_value: string;
    ordinal: number;
    is_editable: boolean;
    is_visible: boolean;
    is_key: boolean;
  }[];
}

/**
 * Data required to update an existing child UIAggregate
 */
export interface UpdateChildUIAggregateRequest {
  displayName?: string;
  ordinal?: number;
  properties?: {
    property_name: string;
    property_value: string;
    ordinal: number;
    is_editable: boolean;
    is_visible: boolean;
    is_key: boolean;
  }[];
}



 