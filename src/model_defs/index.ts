/**
 * Data Types for the Repository System
 * 
 * This document defines all data types used in the application.
 * These types are shared between the server-side API and client-side components.
 */

// ============================================================================
// CORE UI ENTITY TYPES (imported from separate file)
// ============================================================================

import type { UIProperty, UIAggregate, UIEntity, UIEntityRef } from './UIModel';
export type { UIProperty, UIAggregate, UIEntity, UIEntityRef } from './UIModel';
export { isUIProperty, isUIAggregate, isUIEntity } from './UIModel';

// ============================================================================
// CORE DATABASE TYPES (imported from separate file)
// ============================================================================

import type { DBField, DBTable, DBSchema } from './DBModel';
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

// Note: Schema instances are now exported from ../model_instances/
// This file only contains type definitions and conversion functions

// ============================================================================
// LEGACY TYPES (for backward compatibility during migration)
// ============================================================================

/**
 * @deprecated Use the new unified Entity type instead
 * Legacy Entity type - kept for backward compatibility
 */
export interface LegacyEntity {
  entity_key: string;
  entity_name: string;
  entity_property1: string;
}

/**
 * @deprecated Use the new unified Entity type instead
 * Legacy ChildEntity type - kept for backward compatibility
 */
export interface LegacyChildEntity {
  child_entity_key: string;
  entity_key: string;
  child_entity_name: string;
  child_entity_property1: string;
}

/**
 * @deprecated 
 */
export interface LegacyEntityColl1 {
  entity_key: string;
  coll1_property1: string;
  coll1_property2: string;
  coll1_property3: number;
}

/**
 * @deprecated 
 */
export interface LegacyChildEntityColl1 {
  child_entity_key: string;
  coll1_property1: string;
  coll1_property2: number;
}

/**
 * @deprecated 
 */
export interface LegacyChildEntityColl2 {
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
 * Data required to create a new LegacyEntityColl1
 */
export interface CreateLegacyEntityColl1Request {
  entity_key: string;
  coll1_property1: string;
  coll1_property2: string;
  coll1_property3: number;
}

/**
 * Data required to update an existing LegacyEntityColl1
 */
export interface UpdateLegacyEntityColl1Request {
  coll1_property1?: string;
  coll1_property2?: string;
  coll1_property3?: number;
}

/**
 * Data required to create a new LegacyChildEntityColl1
 */
export interface CreateLegacyChildEntityColl1Request {
  child_entity_key: string;
  coll1_property1: string;
  coll1_property2: number;
}

/**
 * Data required to update an existing LegacyChildEntityColl1
 */
export interface UpdateLegacyChildEntityColl1Request {
  coll1_property1?: string;
  coll1_property2?: number;
}

/**
 * Data required to create a new LegacyChildEntityColl2
 */
export interface CreateLegacyChildEntityColl2Request {
  child_entity_key: string;
  coll2_property1: string;
  coll2_property2: boolean;
}

/**
 * Data required to update an existing LegacyChildEntityColl2
 */
export interface UpdateLegacyChildEntityColl2Request {
  coll2_property1?: string;
  coll2_property2?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================



/**
 * Type guard to check if an object is a Legacy Entity
 */
export function isLegacyEntity(obj: any): obj is LegacyEntity {
  return obj && 
         typeof obj.entity_key === 'string' &&
         typeof obj.entity_name === 'string' &&
         typeof obj.entity_property1 === 'string';
}

/**
 * Type guard to check if an object is a Legacy ChildEntity
 */
export function isLegacyChildEntity(obj: any): obj is LegacyChildEntity {
  return obj && 
         typeof obj.child_entity_key === 'string' &&
         typeof obj.entity_key === 'string' &&
         typeof obj.child_entity_name === 'string' &&
         typeof obj.child_entity_property1 === 'string';
}

// ============================================================================
// MIGRATION UTILITIES
// ============================================================================

/**
 * Convert a legacy Entity to the new unified UIEntity type
 */
export function convertLegacyEntityToUIEntity(legacyEntity: LegacyEntity): UIEntity {
  return {
    entity_id: crypto.randomUUID(), // Generate new GUID
    entity_key: legacyEntity.entity_key,
    displayName: legacyEntity.entity_name,
    properties: [
      {
        property_name: 'entity_key',
        property_value: legacyEntity.entity_key,
        ordinal: 1,
        is_editable: false,
        is_visible: true,
        is_key: true
      },
      {
        property_name: 'entity_name',
        property_value: legacyEntity.entity_name,
        ordinal: 2,
        is_editable: true,
        is_visible: true,
        is_key: false
      },
      {
        property_name: 'entity_property1',
        property_value: legacyEntity.entity_property1,
        ordinal: 3,
        is_editable: true,
        is_visible: true,
        is_key: false
      }
    ],
    aggregates: [],
    ancestors: [],
    children: []
  };
}

/**
 * Convert a legacy ChildEntity to the new unified UIEntity type
 */
export function convertLegacyChildEntityToUIEntity(legacyChildEntity: LegacyChildEntity): UIEntity {
  return {
    entity_id: crypto.randomUUID(), // Generate new GUID
    entity_key: legacyChildEntity.child_entity_key,
    displayName: legacyChildEntity.child_entity_name,
    properties: [
      {
        property_name: 'child_entity_key',
        property_value: legacyChildEntity.child_entity_key,
        ordinal: 1,
        is_editable: false,
        is_visible: true,
        is_key: true
      },
      {
        property_name: 'entity_key',
        property_value: legacyChildEntity.entity_key,
        ordinal: 2,
        is_editable: false,
        is_visible: true,
        is_key: false
      },
      {
        property_name: 'child_entity_name',
        property_value: legacyChildEntity.child_entity_name,
        ordinal: 3,
        is_editable: true,
        is_visible: true,
        is_key: false
      },
      {
        property_name: 'child_entity_property1',
        property_value: legacyChildEntity.child_entity_property1,
        ordinal: 4,
        is_editable: true,
        is_visible: true,
        is_key: false
      }
    ],
    aggregates: [],
    ancestors: [],
    children: []
  };
}

/**
 * Convert a unified UIEntity back to legacy Entity format (for API compatibility)
 */
export function convertUIEntityToLegacyEntity(entity: UIEntity): LegacyEntity {
  const entityKeyProp = entity.properties?.find((p: UIProperty) => p.property_name === 'entity_key');
  const entityNameProp = entity.properties?.find((p: UIProperty) => p.property_name === 'entity_name');
  const entityProperty1Prop = entity.properties?.find((p: UIProperty) => p.property_name === 'entity_property1');
  
  return {
    entity_key: entityKeyProp?.property_value || entity.entity_key,
    entity_name: entityNameProp?.property_value || entity.displayName,
    entity_property1: entityProperty1Prop?.property_value || ''
  };
}

/**
 * Convert a unified UIEntity back to legacy ChildEntity format (for API compatibility)
 */
export function convertUIEntityToLegacyChildEntity(entity: UIEntity): LegacyChildEntity {
  const childKeyProp = entity.properties?.find((p: UIProperty) => p.property_name === 'child_entity_key');
  const entityKeyProp = entity.properties?.find((p: UIProperty) => p.property_name === 'entity_key');
  const childNameProp = entity.properties?.find((p: UIProperty) => p.property_name === 'child_entity_name');
  const childProperty1Prop = entity.properties?.find((p: UIProperty) => p.property_name === 'child_entity_property1');
  
  return {
    child_entity_key: childKeyProp?.property_value || entity.entity_key,
    entity_key: entityKeyProp?.property_value || '',
    child_entity_name: childNameProp?.property_value || entity.displayName,
    child_entity_property1: childProperty1Prop?.property_value || ''
  };
}

/**
 * Convert a LegacyEntityColl1 (generic_routes) to UIEntity with proper schema field names
 */
export function convertLegacyEntityColl1ToUIEntity(legacyColl: LegacyEntityColl1): UIEntity {
  return {
    entity_id: crypto.randomUUID(),
    entity_key: legacyColl.entity_key,
    displayName: `Route ${legacyColl.coll1_property1}`, // Use route_type as display name
    properties: [
      {
        property_name: 'route_type',
        property_value: legacyColl.coll1_property1,
        ordinal: 1,
        is_editable: true,
        is_visible: true,
        is_key: false
      },
      {
        property_name: 'load_dose',
        property_value: legacyColl.coll1_property2,
        ordinal: 2,
        is_editable: true,
        is_visible: true,
        is_key: false
      },
      {
        property_name: 'maintain_dose',
        property_value: legacyColl.coll1_property3.toString(),
        ordinal: 3,
        is_editable: true,
        is_visible: true,
        is_key: false
      }
    ],
    aggregates: [],
    ancestors: [],
    children: []
  };
}

/**
 * Convert a LegacyChildEntityColl1 to UIEntity with proper schema field names
 */
export function convertLegacyChildEntityColl1ToUIEntity(legacyColl: LegacyChildEntityColl1): UIEntity {
  return {
    entity_id: crypto.randomUUID(),
    entity_key: legacyColl.child_entity_key,
    displayName: `Collection Item ${legacyColl.coll1_property1}`,
    properties: [
      {
        property_name: 'coll1_property1',
        property_value: legacyColl.coll1_property1,
        ordinal: 1,
        is_editable: true,
        is_visible: true,
        is_key: false
      },
      {
        property_name: 'coll1_property2',
        property_value: legacyColl.coll1_property2.toString(),
        ordinal: 2,
        is_editable: true,
        is_visible: true,
        is_key: false
      }
    ],
    aggregates: [],
    ancestors: [],
    children: []
  };
}

/**
 * Convert a LegacyChildEntityColl2 to UIEntity with proper schema field names
 */
export function convertLegacyChildEntityColl2ToUIEntity(legacyColl: LegacyChildEntityColl2): UIEntity {
  return {
    entity_id: crypto.randomUUID(),
    entity_key: legacyColl.child_entity_key,
    displayName: `Collection Item ${legacyColl.coll2_property1}`,
    properties: [
      {
        property_name: 'coll2_property1',
        property_value: legacyColl.coll2_property1,
        ordinal: 1,
        is_editable: true,
        is_visible: true,
        is_key: false
      },
      {
        property_name: 'coll2_property2',
        property_value: legacyColl.coll2_property2.toString(),
        ordinal: 2,
        is_editable: true,
        is_visible: true,
        is_key: false
      }
    ],
    aggregates: [],
    ancestors: [],
    children: []
  };
}

/**
 * Interface for generic aliases data from database
 */
export interface GenericAlias {
  uid: string;
  row: number;
  generic_key: string;
  generic_uid: string | null;
  alias: string;
}

/**
 * Convert a GenericAlias to UIEntity with proper schema field names
 */
export function convertGenericAliasToUIEntity(aliasData: GenericAlias): UIEntity {
  return {
    entity_id: crypto.randomUUID(),
    entity_key: aliasData.generic_key,
    displayName: aliasData.alias,
    properties: [
      {
        property_name: 'alias',
        property_value: aliasData.alias,
        ordinal: 1,
        is_editable: true,
        is_visible: true,
        is_key: false
      }
    ],
    aggregates: [],
    ancestors: [],
    children: []
  };
}

/**
 * Type guard to check if an object is a LegacyEntityColl1
 */
export function isLegacyEntityColl1(obj: any): obj is LegacyEntityColl1 {
  return obj && 
         typeof obj.entity_key === 'string' &&
         typeof obj.coll1_property1 === 'string' &&
         typeof obj.coll1_property2 === 'string' &&
         typeof obj.coll1_property3 === 'number';
}

/**
 * Type guard to check if an object is a LegacyChildEntityColl1
 */
export function isLegacyChildEntityColl1(obj: any): obj is LegacyChildEntityColl1 {
  return obj && 
         typeof obj.child_entity_key === 'string' &&
         typeof obj.coll1_property1 === 'string' &&
         typeof obj.coll1_property2 === 'number';
}

/**
 * Type guard to check if an object is a LegacyChildEntityColl2
 */
export function isLegacyChildEntityColl2(obj: any): obj is LegacyChildEntityColl2 {
  return obj && 
         typeof obj.child_entity_key === 'string' &&
         typeof obj.coll2_property1 === 'string' &&
         typeof obj.coll2_property2 === 'boolean';
}

export interface GenericApproval {
  uid: string;
  row: number;
  generic_key: string;
  generic_uid: string | null;
  route_type: string;
  country: string;
  indication: string | null;
  populations: string | null;
  approval_date: string | null;
  discon_date: string | null;
  box_warning: string | null;
  box_warning_date: string | null;
}

export const convertGenericApprovalToUIEntity = (approval: GenericApproval): UIEntity => {
  return {
    entity_id: approval.uid,
    entity_key: approval.generic_key,
    displayName: `${approval.country} - ${approval.route_type} (${approval.approval_date || 'N/A'})`,
    properties: [
      {
        property_name: 'generic_key',
        property_value: approval.generic_key,
        is_editable: false,
        is_visible: true,
        is_key: true,
        ordinal: 1
      },
      {
        property_name: 'route_type',
        property_value: approval.route_type,
        is_editable: true,
        is_visible: true,
        is_key: false,
        ordinal: 2
      },
      {
        property_name: 'country',
        property_value: approval.country,
        is_editable: true,
        is_visible: true,
        is_key: false,
        ordinal: 3
      },
      {
        property_name: 'indication',
        property_value: approval.indication || '',
        is_editable: true,
        is_visible: true,
        is_key: false,
        ordinal: 4
      },
      {
        property_name: 'populations',
        property_value: approval.populations || '',
        is_editable: true,
        is_visible: true,
        is_key: false,
        ordinal: 5
      },
      {
        property_name: 'approval_date',
        property_value: approval.approval_date || '',
        is_editable: true,
        is_visible: true,
        is_key: false,
        ordinal: 6
      },
      {
        property_name: 'discon_date',
        property_value: approval.discon_date || '',
        is_editable: true,
        is_visible: true,
        is_key: false,
        ordinal: 7
      },
      {
        property_name: 'box_warning',
        property_value: approval.box_warning || '',
        is_editable: true,
        is_visible: true,
        is_key: false,
        ordinal: 8
      },
      {
        property_name: 'box_warning_date',
        property_value: approval.box_warning_date || '',
        is_editable: true,
        is_visible: true,
        is_key: false,
        ordinal: 9
      }
    ],
    aggregates: [],
    ancestors: [],
    children: []
  };
}; 