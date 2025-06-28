import { DetailField } from '@/components/entities/DetailCardProperties';
import { MetadataRepository } from './metadata-repository';
import { UIProperty } from '../model_defs/UIModel';
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
 * Generates DetailField array from entity data using schema metadata
 */
export function generateEntityFields(
  entityData: Record<string, any>,
  entityType: 'entity' | 'child'
): DetailField[] {
  const tableName = ENTITY_TYPE_TO_TABLE_MAP[entityType];
  const schemaEntityName = TABLE_TO_SCHEMA_MAP[tableName];
  
  if (!schemaEntityName) {
    console.warn(`No schema mapping found for entity type: ${entityType}`);
    return generateFallbackFields(entityData, entityType);
  }

  const schema = metadataRepo.getEntitySchema(schemaEntityName);
  if (!schema) {
    console.warn(`No schema found for entity: ${schemaEntityName}`);
    return generateFallbackFields(entityData, entityType);
  }

  const visibleFields = metadataRepo.getVisibleFields(schemaEntityName);
  const detailFields: DetailField[] = [];

  for (const field of visibleFields) {
    const value = getFieldValue(entityData, field, entityType);
    if (value !== undefined) {
      detailFields.push({
        key: field.property_name,
        label: field.ui?.displayName || field.property_name,
        value: value,
        type: mapFieldTypeToDetailType(field),
        editable: field.ui?.visibility !== 'readonly' && !field.isId
      });
    }
  }

  return detailFields;
}

/**
 * Gets the appropriate field value from entity data, handling the mapping
 * between the abstract schema fields and actual database/API fields
 */
function getFieldValue(
  entityData: Record<string, any>,
  field: UIProperty,
  entityType: 'entity' | 'child'
): any {
  // Handle mapping between schema field names and actual API field names
  if (entityType === 'entity') {
    switch (field.property_name) {
      case 'generic_key':
        return entityData.entity_key;
      case 'generic_name':
        return entityData.entity_name;
      case 'mech_of_action':
        return entityData.entity_property1;
      case 'biologic':
      case 'class_or_type':
      case 'target':
        // These fields might not be available in the current Entity type
        // Return empty string for now, but could be extended
        return '';
      default:
        return entityData[field.property_name];
    }
  } else if (entityType === 'child') {
    switch (field.property_name) {
      case 'manu_drug_key':
        return entityData.child_entity_key;
      case 'drug_name':
        return entityData.child_entity_name;
      case 'generic_uid':
        return entityData.entity_key;
      case 'manufacturer':
        return entityData.child_entity_property1 || '';
      default:
        return entityData[field.property_name];
    }
  }

  return entityData[field.property_name];
}

/**
 * Maps schema field types to DetailField types
 */
function mapFieldTypeToDetailType(field: UIProperty): DetailField['type'] {
  if (field.isId || field.ui?.visibility === 'readonly') {
    return 'readonly';
  }
  
  switch (field.type) {
    case 'number':
      return 'number';
    case 'string':
      return 'text';
    default:
      return 'text';
  }
}

/**
 * Fallback field generation when schema is not available
 */
function generateFallbackFields(
  entityData: Record<string, any>,
  entityType: 'entity' | 'child'
): DetailField[] {
  const fields: DetailField[] = [];
  
  if (entityType === 'entity') {
    if (entityData.entity_key) {
      fields.push({
        key: 'entity_key',
        label: 'Entity Key',
        value: entityData.entity_key,
        type: 'readonly'
      });
    }
    if (entityData.entity_name) {
      fields.push({
        key: 'entity_name',
        label: 'Entity Name',
        value: entityData.entity_name,
        type: 'text'
      });
    }
    if (entityData.entity_property1) {
      fields.push({
        key: 'entity_property1',
        label: 'Mechanism of Action',
        value: entityData.entity_property1,
        type: 'text'
      });
    }
  } else if (entityType === 'child') {
    if (entityData.child_entity_key) {
      fields.push({
        key: 'child_entity_key',
        label: 'Product Key',
        value: entityData.child_entity_key,
        type: 'readonly'
      });
    }
    if (entityData.child_entity_name) {
      fields.push({
        key: 'child_entity_name',
        label: 'Brand Name',
        value: entityData.child_entity_name,
        type: 'text'
      });
    }
    if (entityData.child_entity_property1) {
      fields.push({
        key: 'child_entity_property1',
        label: 'Manufacturer',
        value: entityData.child_entity_property1,
        type: 'text'
      });
    }
    if (entityData.entity_key) {
      fields.push({
        key: 'entity_key',
        label: 'Generic Drug ID',
        value: entityData.entity_key,
        type: 'readonly'
      });
    }
  }

  return fields;
}

/**
 * Generates schema-aware tab properties data for collections
 */
export function generateCollectionProperties(
  data: Record<string, any>,
  collectionType: string
): Record<string, any> {
  // For now, return the data as-is, but this could be extended
  // to use schema metadata for collection properties as well
  return data;
}

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