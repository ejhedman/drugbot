/**
 * Static Model Map Configuration
 * 
 * This file contains the complete static mapping configuration that connects
 * the UI model definitions (from theuimodel.ts) to the database model 
 * definitions (from thedb.ts).
 * 
 * This mapping enables the application to:
 * - Resolve UI properties to specific database table/field combinations
 * - Transform data between UI representation and database storage
 * - Generate queries based on UI model requests
 * - Validate UI model changes against database constraints
 */

import { ModelMap, EntityMapping, AggregateMapping, PropertyMapping } from '../model_defs/ModelMap';

// ============================================================================
// ENTITY MAPPINGS
// ============================================================================

/**
 * Generic Drugs Entity Mapping
 * Maps the generic_drugs UI entity to the generic_drugs database table
 */
const genericDrugsMapping: EntityMapping = {
  entityType: 'generic_drugs',
  tableName: 'generic_drugs',
  keyField: 'generic_key',
  displayNameField: 'generic_name',
  propertyMappings: [
    {
      propertyName: 'uid',
      tableName: 'generic_drugs',
      fieldName: 'uid'
    },
    {
      propertyName: 'generic_key',
      tableName: 'generic_drugs',
      fieldName: 'generic_key'
    },
    {
      propertyName: 'generic_name',
      tableName: 'generic_drugs',
      fieldName: 'generic_name'
    },
    {
      propertyName: 'biologic',
      tableName: 'generic_drugs',
      fieldName: 'biologic'
    },
    {
      propertyName: 'mech_of_action',
      tableName: 'generic_drugs',
      fieldName: 'mech_of_action'
    },
    {
      propertyName: 'class_or_type',
      tableName: 'generic_drugs',
      fieldName: 'class_or_type'
    },
    {
      propertyName: 'target',
      tableName: 'generic_drugs',
      fieldName: 'target'
    }
  ]
};

/**
 * Manufactured Drugs Entity Mapping
 * Maps the manu_drugs UI entity to the manu_drugs database table
 */
const manuDrugsMapping: EntityMapping = {
  entityType: 'manu_drugs',
  tableName: 'manu_drugs',
  keyField: 'manu_drug_key',
  displayNameField: 'drug_name',
  propertyMappings: [
    {
      propertyName: 'uid',
      tableName: 'manu_drugs',
      fieldName: 'uid'
    },
    {
      propertyName: 'manu_drug_key',
      tableName: 'manu_drugs',
      fieldName: 'manu_drug_key'
    },
    {
      propertyName: 'generic_uid',
      tableName: 'manu_drugs',
      fieldName: 'generic_uid'
    },
    {
      propertyName: 'drug_name',
      tableName: 'manu_drugs',
      fieldName: 'drug_name'
    },
    {
      propertyName: 'manufacturer',
      tableName: 'manu_drugs',
      fieldName: 'manufacturer'
    },
    {
      propertyName: 'biosimilar',
      tableName: 'manu_drugs',
      fieldName: 'biosimilar',
      transform: {
        fromDB: 'integerToBoolean',
        toDB: 'booleanToInteger'
      }
    },
    {
      propertyName: 'biosimilar_suffix',
      tableName: 'manu_drugs',
      fieldName: 'biosimilar_suffix'
    },
    {
      propertyName: 'biosimilar_originator',
      tableName: 'manu_drugs',
      fieldName: 'biosimilar_originator'
    }
  ]
};

// ============================================================================
// AGGREGATE MAPPINGS
// ============================================================================

/**
 * Generic Aliases Aggregate Mapping
 * Maps the GenericAlias UI aggregate to the generic_aliases database table
 */
const genericAliasesMapping: AggregateMapping = {
  aggregateType: 'GenericAlias',
  tableName: 'generic_aliases',
  parentKeyField: 'generic_uid',
  propertyMappings: [
    {
      propertyName: 'uid',
      tableName: 'generic_aliases',
      fieldName: 'uid'
    },
    {
      propertyName: 'generic_uid',
      tableName: 'generic_aliases',
      fieldName: 'generic_uid'
    },
    {
      propertyName: 'generic_key',
      tableName: 'generic_aliases',
      fieldName: 'generic_key'
    },
    {
      propertyName: 'alias',
      tableName: 'generic_aliases',
      fieldName: 'alias'
    }
  ]
};

/**
 * Generic Routes Aggregate Mapping
 * Maps the GenericRoute UI aggregate to the generic_routes database table
 */
const genericRoutesMapping: AggregateMapping = {
  aggregateType: 'GenericRoute',
  tableName: 'generic_routes',
  parentKeyField: 'generic_uid',
  propertyMappings: [
    {
      propertyName: 'uid',
      tableName: 'generic_routes',
      fieldName: 'uid'
    },
    {
      propertyName: 'route_key',
      tableName: 'generic_routes',
      fieldName: 'route_key'
    },
    {
      propertyName: 'generic_uid',
      tableName: 'generic_routes',
      fieldName: 'generic_uid'
    },
    {
      propertyName: 'route_type',
      tableName: 'generic_routes',
      fieldName: 'route_type'
    },
    {
      propertyName: 'load_dose',
      tableName: 'generic_routes',
      fieldName: 'load_dose'
    },
    {
      propertyName: 'load_measure',
      tableName: 'generic_routes',
      fieldName: 'load_measure'
    },
    {
      propertyName: 'maintain_dose',
      tableName: 'generic_routes',
      fieldName: 'maintain_dose'
    },
    {
      propertyName: 'maintain_measure',
      tableName: 'generic_routes',
      fieldName: 'maintain_measure'
    },
    {
      propertyName: 'montherapy',
      tableName: 'generic_routes',
      fieldName: 'montherapy'
    },
    {
      propertyName: 'half_life',
      tableName: 'generic_routes',
      fieldName: 'half_life'
    }
  ]
};

/**
 * Generic Approvals Aggregate Mapping
 * Maps the GenericApproval UI aggregate to the generic_approvals database table
 */
const genericApprovalsMapping: AggregateMapping = {
  aggregateType: 'GenericApproval',
  tableName: 'generic_approvals',
  parentKeyField: 'generic_uid',
  propertyMappings: [
    {
      propertyName: 'uid',
      tableName: 'generic_approvals',
      fieldName: 'uid'
    },
    {
      propertyName: 'generic_uid',
      tableName: 'generic_approvals',
      fieldName: 'generic_uid'
    },
    {
      propertyName: 'country',
      tableName: 'generic_approvals',
      fieldName: 'country'
    },
    {
      propertyName: 'indication',
      tableName: 'generic_approvals',
      fieldName: 'indication'
    },
    {
      propertyName: 'approval_date',
      tableName: 'generic_approvals',
      fieldName: 'approval_date'
    },
    {
      propertyName: 'box_warning',
      tableName: 'generic_approvals',
      fieldName: 'box_warning'
    }
  ]
};

// ============================================================================
// COMPLETE MODEL MAP
// ============================================================================

/**
 * The complete static model map for the DrugBot application
 * 
 * This is the central mapping configuration that connects all UI model
 * definitions to their corresponding database representations. It serves
 * as the authoritative source for data transformation and query generation.
 */
export const drugBotModelMap: ModelMap = {
  name: 'DrugBot Model Map',
  version: '1.0.0',
  
  entityMappings: {
    generic_drugs: genericDrugsMapping,
    manu_drugs: manuDrugsMapping
  },
  
  aggregateMappings: {
    GenericAlias: genericAliasesMapping,
    GenericRoute: genericRoutesMapping,
    GenericApproval: genericApprovalsMapping
  }
};

// ============================================================================
// UTILITY FUNCTIONS FOR DRUGBOT MAPPINGS
// ============================================================================

/**
 * Get entity mapping by entity type
 */
export function getEntityMapping(entityType: string): EntityMapping | undefined {
  return drugBotModelMap.entityMappings[entityType];
}

/**
 * Get aggregate mapping by aggregate type
 */
export function getAggregateMapping(aggregateType: string): AggregateMapping | undefined {
  return drugBotModelMap.aggregateMappings[aggregateType];
}

/**
 * Get all property mappings for a specific entity
 */
export function getEntityPropertyMappings(entityType: string): PropertyMapping[] {
  const entityMapping = getEntityMapping(entityType);
  return entityMapping ? entityMapping.propertyMappings : [];
}

/**
 * Get all property mappings for a specific aggregate
 */
export function getAggregatePropertyMappings(aggregateType: string): PropertyMapping[] {
  const aggregateMapping = getAggregateMapping(aggregateType);
  return aggregateMapping ? aggregateMapping.propertyMappings : [];
}

/**
 * Find property mapping for a specific entity property
 */
export function findEntityPropertyMapping(entityType: string, propertyName: string): PropertyMapping | undefined {
  const entityMapping = getEntityMapping(entityType);
  if (!entityMapping) return undefined;
  
  return entityMapping.propertyMappings.find(mapping => mapping.propertyName === propertyName);
}

/**
 * Find property mapping for a specific aggregate property
 */
export function findAggregatePropertyMapping(aggregateType: string, propertyName: string): PropertyMapping | undefined {
  const aggregateMapping = getAggregateMapping(aggregateType);
  if (!aggregateMapping) return undefined;
  
  return aggregateMapping.propertyMappings.find(mapping => mapping.propertyName === propertyName);
}

/**
 * Get the database table name for an entity
 */
export function getEntityTableName(entityType: string): string | undefined {
  const entityMapping = getEntityMapping(entityType);
  return entityMapping?.tableName;
}

/**
 * Get the database table name for an aggregate
 */
export function getAggregateTableName(aggregateType: string): string | undefined {
  const aggregateMapping = getAggregateMapping(aggregateType);
  return aggregateMapping?.tableName;
}

/**
 * Get the key field name for an entity
 */
export function getEntityKeyField(entityType: string): string | undefined {
  const entityMapping = getEntityMapping(entityType);
  return entityMapping?.keyField;
}

/**
 * Get the parent key field name for an aggregate
 */
export function getAggregateParentKeyField(aggregateType: string): string | undefined {
  const aggregateMapping = getAggregateMapping(aggregateType);
  return aggregateMapping?.parentKeyField;
}

// Export the main model map as default
export default drugBotModelMap; 