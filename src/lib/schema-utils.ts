import { MetadataRepository } from './metadata-repository';
import { UIEntity } from '../model_defs/UIModel';

const metadataRepo = new MetadataRepository();

/**
 * Maps database table names to schema entity names
 */
const TABLE_TO_SCHEMA_MAP: Record<string, string> = {
  'generic_drugs': 'generic_drugs',
  'generic_aliases': 'generic_aliases',
  'generic_routes': 'generic_routes',
  'generic_approvals': 'generic_approvals',
  'manu_drugs': 'manu_drugs'
};

/**
 * Maps entity types to their corresponding table names
 */
const ENTITY_TYPE_TO_TABLE_MAP: Record<string, string> = {
  'entity': 'generic_drugs',
  'child': 'manu_drugs'
};

/**
 * Gets schema metadata for a given entity type
 */
export function getEntitySchema(entityType: 'entity' | 'child'): UIEntity | undefined {
  const tableName = ENTITY_TYPE_TO_TABLE_MAP[entityType];
  const schemaEntityName = TABLE_TO_SCHEMA_MAP[tableName];
  
  if (!schemaEntityName) {
    return undefined;
  }

  return metadataRepo.getEntitySchema(schemaEntityName);
} 