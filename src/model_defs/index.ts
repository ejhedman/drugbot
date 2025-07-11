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
// MODEL MAPPING TYPES (imported from separate file)
// ============================================================================

export type { 
  PropertyMapping, 
  EntityMapping, 
  AggregateMapping, 
  ModelMap, 
  MappingContext, 
  MappingResult 
} from './ModelMap';

export { 
  isPropertyMapping, 
  isEntityMapping, 
  isAggregateMapping, 
  isModelMap, 
  findPropertyMapping, 
  findAggregatePropertyMapping, 
  getReferencedTables 
} from './ModelMap';
