/**
 * Model Instances - Actual Schema Data and Instances
 * 
 * This file exports the actual schema instances and database definitions.
 * These are the concrete data structures used by the application.
 */

// ============================================================================
// DATABASE SCHEMA INSTANCES
// ============================================================================

// Export the complete database schema definition
export { drugBotDBSchema } from './thedb';

// ============================================================================
// UI SCHEMA INSTANCES
// ============================================================================

// Re-export core UI types from UIModel
export type { UIProperty, UIAggregate, UIEntity } from '../model_defs/UIModel';

export { 
  ENTITY_SCHEMAS, 
  ENTITY_SUB_COLLECTIONS,
  getSchemaByTableName,
  getFieldByName
} from './theuimodel'; 