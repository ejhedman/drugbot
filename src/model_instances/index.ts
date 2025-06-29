/**
 * Model Instances - Actual Schema Data and Instances
 * 
 * This file exports the actual schema instances and database definitions.
 * These are the concrete data structures used by the application.
 */

// ============================================================================
// PRIMARY MODEL INTERFACES (Use these!)
// ============================================================================

/**
 * Primary UI Model Interface - Use this for all UI model operations
 * Provides convenient methods for querying entities, aggregates, and properties
 */
export { theUIModel } from './TheUIModel';
export { default as TheUIModel } from './TheUIModel';

/**
 * Primary DB Model Interface - Use this for all database model operations
 * Provides convenient methods for querying tables, fields, and relationships
 */
export { theDBModel } from './TheDBModel';
export { default as TheDBModel } from './TheDBModel';

// ============================================================================
// RAW CONSTANTS (For backward compatibility and advanced usage)
// ============================================================================
export { ENTITIES, ENTITY_AGGREGATES } from './TheUIModel';

// ============================================================================
// DATABASE SCHEMA INSTANCES
// ============================================================================
export { 
  drugBotDBSchema,
  genericDrugsTable,
  genericAliasesTable,
  genericRoutesTable,
  genericApprovalsTable,
  manuDrugsTable,
  entityRelationshipsTable
} from './TheDBModel';

// ============================================================================
// MODEL MAPPING INSTANCES
// ============================================================================
export { 
  drugBotModelMap,
  getEntityMapping,
  getAggregateMapping,
  getEntityPropertyMappings,
  getAggregatePropertyMappings,
  findEntityPropertyMapping,
  findAggregatePropertyMapping,
  getEntityTableName,
  getAggregateTableName,
  getEntityKeyField,
  getAggregateParentKeyField
} from './TheModelMap';

export { default as TheModelMap } from './TheModelMap'; 