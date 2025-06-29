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
 * - Map entities to their contained aggregates for complete data retrieval
 * - Build dynamic queries that include all tables needed to render an entity
 * 
 * Key Features:
 * - Entity Mappings: Map UI entities to primary database tables and their properties
 * - Aggregate Mappings: Map UI aggregates (sub-collections) to database tables
 * - Aggregate References: Connect entities to their contained aggregates
 * - Complete Query Info: Generate comprehensive query information for API endpoints
 * 
 * Usage Example:
 * ```typescript
 * // Get complete query information for a generic drug entity
 * const queryInfo = getEntityCompleteQueryInfo('generic_drugs');
 * // Result includes main table, aggregate tables, and relationships
 * // {
 * //   entityTable: 'generic_drugs',
 * //   entityKeyField: 'generic_key',
 * //   aggregates: [
 * //     { aggregateType: 'GenericAlias', tableName: 'generic_aliases', parentKeyField: 'generic_uid' },
 * //     { aggregateType: 'GenericRoute', tableName: 'generic_routes', parentKeyField: 'generic_uid' },
 * //     { aggregateType: 'GenericApproval', tableName: 'generic_approvals', parentKeyField: 'generic_uid' }
 * //   ],
 * //   allTables: ['generic_drugs', 'generic_aliases', 'generic_routes', 'generic_approvals']
 * // }
 * ```
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
  ],
  aggregateReferences: [
    'GenericAlias',
    'GenericRoute', 
    'GenericApproval',
    'GenericManuDrugs'
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
  ],
  aggregateReferences: []
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

/**
 * Generic Manufactured Drugs Aggregate Mapping
 * Maps the GenericManuDrugs UI aggregate to the manu_drugs database table
 */
const genericManuDrugsMapping: AggregateMapping = {
  aggregateType: 'GenericManuDrugs',
  tableName: 'manu_drugs',
  parentKeyField: 'generic_uid',
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
    GenericApproval: genericApprovalsMapping,
    GenericManuDrugs: genericManuDrugsMapping
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

// ============================================================================
// AGGREGATE REFERENCE UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all aggregate mappings for a specific entity
 */
export function getEntityAggregateMappings(entityType: string): AggregateMapping[] {
  const entityMapping = getEntityMapping(entityType);
  if (!entityMapping || !entityMapping.aggregateReferences) {
    return [];
  }
  
  return entityMapping.aggregateReferences
    .map(aggregateType => getAggregateMapping(aggregateType))
    .filter((mapping): mapping is AggregateMapping => mapping !== undefined);
}

/**
 * Get all aggregate types for a specific entity
 */
export function getEntityAggregateTypes(entityType: string): string[] {
  const entityMapping = getEntityMapping(entityType);
  return entityMapping?.aggregateReferences || [];
}

/**
 * Get all table names that need to be queried for a complete entity (entity table + aggregate tables)
 */
export function getEntityAllTableNames(entityType: string): string[] {
  const entityTableName = getEntityTableName(entityType);
  const aggregateMappings = getEntityAggregateMappings(entityType);
  const aggregateTableNames = aggregateMappings.map(mapping => mapping.tableName);
  
  const allTables = entityTableName ? [entityTableName, ...aggregateTableNames] : aggregateTableNames;
  return Array.from(new Set(allTables)); // Remove duplicates
}

/**
 * Get complete query information for an entity, including all tables, key fields, and relationships
 */
export function getEntityCompleteQueryInfo(entityType: string): {
  entityTable: string;
  entityKeyField: string;
  entityDisplayField: string;
  aggregates: Array<{
    aggregateType: string;
    tableName: string;
    parentKeyField: string;
  }>;
  allTables: string[];
} | undefined {
  const entityMapping = getEntityMapping(entityType);
  if (!entityMapping) {
    return undefined;
  }
  
  const aggregateMappings = getEntityAggregateMappings(entityType);
  
  return {
    entityTable: entityMapping.tableName,
    entityKeyField: entityMapping.keyField,
    entityDisplayField: entityMapping.displayNameField,
    aggregates: aggregateMappings.map(mapping => ({
      aggregateType: mapping.aggregateType,
      tableName: mapping.tableName,
      parentKeyField: mapping.parentKeyField
    })),
    allTables: getEntityAllTableNames(entityType)
  };
}

/**
 * Check if an entity has any aggregates
 */
export function entityHasAggregates(entityType: string): boolean {
  const aggregateTypes = getEntityAggregateTypes(entityType);
  return aggregateTypes.length > 0;
}

/**
 * Check if a specific aggregate belongs to an entity
 */
export function entityHasAggregate(entityType: string, aggregateType: string): boolean {
  const aggregateTypes = getEntityAggregateTypes(entityType);
  return aggregateTypes.includes(aggregateType);
}

// Export the main model map as default
export default drugBotModelMap; 