// Drug Database Schema - Refined from DDL
// This file defines the complete metadata for the drug database

import { UIProperty, UIAggregate, UIEntity } from '../model_defs/UIModel';

// ============================================================================
// SUB-COLLECTION SCHEMAS (for tabs/aggregates)
// ============================================================================

// Sub-collection schemas (separate from main entities)
export const ENTITY_SUB_COLLECTIONS: Record<string, UIEntity> = {
  generic_aliases: {
    name: 'generic_aliases',
    tableName: 'generic_aliases',
    displayName: 'Generic Alias',
    pluralName: 'Generic Aliases',
    comment: 'Alternative names and aliases for generic drugs',
    fields: [
      {
        property_name: 'uid',
        ordinal: 1,
        is_editable: false,
        is_visible: false,
        is_key: true,
        type: 'string',
        sqlType: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        isId: true,
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'ID',
          controlType: 'text'
        }
      },{
        property_name: 'generic_uid',
        ordinal: 2,
        is_editable: false,
        is_visible: false,
        is_key: false,
        type: 'string',
        sqlType: 'UUID',
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'Generic Drug ID',
          controlType: 'text'
        }
      },{
        property_name: 'generic_key',
        ordinal: 3,
        is_editable: true,
        is_visible: false,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'readonly',
          displayName: 'Generic Key',
          controlType: 'text'
        }
      },{
        property_name: 'alias',
        ordinal: 3,
        is_editable: false,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        isRequired: true,
        ui: {
          visibility: 'visible',
          displayName: 'Alias Name',
          controlType: 'text',
          placeholder: 'Enter alternative name'
        }
      }
    ],
    relationships: [
      {
        type: '1-n',
        targetEntity: 'generic_drugs',
        foreignKey: 'generic_uid',
        displayName: 'Generic Drug',
        isCollection: false
      }
    ],
    aggregates: [
      {
        id: 'details',
        displayName: 'Details',
        type: 'properties',
        fields: ['alias'],
        ordinal: 1
      }
    ]
  },

  generic_routes: {
    name: 'generic_routes',
    tableName: 'generic_routes',
    displayName: 'Drug Route & Dosing',
    pluralName: 'Drug Routes & Dosing',
    comment: 'Drug administration routes and dosing information',
    fields: [
      {
        property_name: 'uid',
        ordinal: 1,
        is_editable: false,
        is_visible: true,
        is_key: true,
        type: 'string',
        sqlType: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        isId: true,
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'ID',
          controlType: 'text'
        }
      },{
        property_name: 'route_key',
        ordinal: 2,
        is_editable: false,
        is_visible: false,
        is_key: true,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'readonly',
          displayName: 'Route Key',
          controlType: 'text'
        }
      },{
        property_name: 'generic_uid',
        ordinal: 7,
        is_editable: false,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'UUID',
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'Generic Drug ID',
          controlType: 'text'
        }
      },{
        property_name: 'route_type',
        ordinal: 2,
        is_editable: true,
        is_visible: false,
        is_key: false,
        type: 'enum',
        sqlType: 'VARCHAR(255)',
        enumValues: ['Subcutaneous', 'Intravenous', 'Oral'],
        ui: {
          visibility: 'visible',
          displayName: 'Route Type',
          controlType: 'select',
          placeholder: 'Select administration route'
        }
      },{
        property_name: 'load_dose',
        ordinal: 9,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Loading Dose',
          controlType: 'text',
          placeholder: 'Enter loading dose'
        }
      },{
        property_name: 'load_measure',
        ordinal: 9,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Loading Dose Unit',
          controlType: 'text',
          placeholder: 'Enter dose unit (mg, ml, etc.)'
        }
      },{
        property_name: 'maintain_dose',
        ordinal: 11,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Maintenance Dose',
          controlType: 'text',
          placeholder: 'Enter maintenance dose'
        }
      },{
        property_name: 'maintain_measure',
        ordinal: 11,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Maintenance Dose Unit',
          controlType: 'text',
          placeholder: 'Enter dose unit'
        }
      },{
        property_name: 'montherapy',
        ordinal: 13,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Monotherapy Status',
          controlType: 'text',
          placeholder: 'Enter monotherapy approval status'
        }
      },{
        property_name: 'half_life',
        ordinal: 13,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'TEXT',
        ui: {
          visibility: 'visible',
          displayName: 'Half Life',
          controlType: 'textarea',
          placeholder: 'Enter drug half-life information'
        }
      }
    ],
    relationships: [
      {
        type: '1-n',
        targetEntity: 'generic_drugs',
        foreignKey: 'generic_uid',
        displayName: 'Generic Drug',
        isCollection: false
      }
    ],
    aggregates: [
      {
        id: 'details',
        displayName: 'Details',
        type: 'properties',
        fields: ['route_type', 'load_dose', 'load_measure', 'maintain_dose', 'maintain_measure', 'montherapy', 'half_life'],
        ordinal: 1
      }
    ]
  },

  generic_approvals: {
    name: 'generic_approvals',
    tableName: 'generic_approvals',
    displayName: 'Drug Approval',
    pluralName: 'Drug Approvals',
    comment: 'Drug approval information by country and route',
    fields: [
      {
        property_name: 'uid',
        ordinal: 1,
        is_editable: true,
        is_visible: false,
        is_key: false,
        type: 'string',
        sqlType: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        isId: true,
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'ID',
          controlType: 'text'
        }
      },{
        property_name: 'generic_uid',
        ordinal: 2,
        is_editable: false,
        is_visible: false,
        is_key: false,
        type: 'string',
        sqlType: 'UUID',
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'Generic Drug ID',
          controlType: 'text'
        }
      },{
        property_name: 'country',
        ordinal: 17,
        is_editable: true,
        is_visible: false,
        is_key: false,
        type: 'enum',
        sqlType: 'VARCHAR(255)',
        enumValues: ['USA', 'CAN', 'FRA', 'UK'],
        ui: {
          visibility: 'visible',
          displayName: 'Country',
          controlType: 'select',
          placeholder: 'Select country'
        }
      },{
        property_name: 'indication',
        ordinal: 17,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'TEXT',
        ui: {
          visibility: 'visible',
          displayName: 'Indication',
          controlType: 'textarea',
          placeholder: 'Enter medical indication'
        }
      },{
        property_name: 'approval_date',
        ordinal: 19,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'date',
        sqlType: 'DATE',
        ui: {
          visibility: 'visible',
          displayName: 'Approval Date',
          controlType: 'date',
          placeholder: 'Select approval date'
        }
      },{
        property_name: 'box_warning',
        ordinal: 19,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'TEXT',
        ui: {
          visibility: 'visible',
          displayName: 'Box Warning',
          controlType: 'textarea',
          placeholder: 'Enter black box warning information'
        }
      }
    ],
    relationships: [
      {
        type: '1-n',
        targetEntity: 'generic_drugs',
        foreignKey: 'generic_uid',
        displayName: 'Generic Drug',
        isCollection: false
      }
    ],
    aggregates: [
      {
        id: 'details',
        displayName: 'Details',
        type: 'properties',
        fields: ['country', 'indication', 'approval_date', 'box_warning'],
        ordinal: 1
      }
    ]
  }
};

// Main entity schemas (only contains the actual entities, not sub-collections)
export const ENTITY_SCHEMAS: Record<string, UIEntity> = {
  generic_drugs: {
    name: 'generic_drugs',
    tableName: 'generic_drugs',
    displayName: 'Generic Drug',
    pluralName: 'Generic Drugs',
    comment: 'Generic drug information including mechanism of action and classification',
    fields: [
      {
        property_name: 'uid',
        ordinal: 1,
        is_editable: false,
        is_visible: true,
        is_key: true,
        type: 'string',
        sqlType: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        isId: true,
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'ID',
          controlType: 'text'
        }
      },{
        property_name: 'generic_key',
        ordinal: 2,
        is_editable: false,
        is_visible: false,
        is_key: true,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        isRequired: true,
        ui: {
          visibility: 'readonly',
          displayName: 'Generic Key',
          controlType: 'text',
          placeholder: 'Auto-generated key'
        }
      },{
        property_name: 'generic_name',
        ordinal: 23,
        is_editable: false,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        isRequired: true,
        ui: {
          visibility: 'visible',
          displayName: 'Generic Name',
          controlType: 'text',
          placeholder: 'Enter generic drug name'
        }
      },{
        property_name: 'biologic',
        ordinal: 23,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'TEXT',
        ui: {
          visibility: 'visible',
          displayName: 'Biologic Classification',
          controlType: 'textarea',
          placeholder: 'Enter biologic information'
        }
      },{
        property_name: 'mech_of_action',
        ordinal: 25,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Mechanism of Action',
          controlType: 'text',
          placeholder: 'Enter mechanism of action'
        }
      },{
        property_name: 'class_or_type',
        ordinal: 25,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Drug Class/Type',
          controlType: 'text',
          placeholder: 'Enter drug class or type'
        }
      },{
        property_name: 'target',
        ordinal: 27,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Target',
          controlType: 'text',
          placeholder: 'Enter drug target (e.g., TNFi)'
        }
      }
    ],
    relationships: [
      {
        type: '1-n',
        targetEntity: 'generic_aliases',
        foreignKey: 'generic_uid',
        displayName: 'Aliases',
        isCollection: true
      },
      {
        type: '1-n',
        targetEntity: 'generic_routes',
        foreignKey: 'generic_uid',
        displayName: 'Routes & Dosing',
        isCollection: true
      },
      {
        type: '1-n',
        targetEntity: 'generic_approvals',
        foreignKey: 'generic_uid',
        displayName: 'Approvals',
        isCollection: true
      },
      {
        type: '1-n',
        targetEntity: 'manu_drugs',
        foreignKey: 'generic_uid',
        displayName: 'Manufactured Products',
        isCollection: true
      }
    ],
    aggregates: [
      {
        id: 'details',
        displayName: 'Details',
        type: 'properties',
        fields: ['generic_name', 'biologic', 'mech_of_action', 'class_or_type', 'target'],
        ordinal: 1
      },
      {
        id: 'aliases',
        displayName: 'Aliases',
        type: 'collection',
        collectionEntity: 'generic_aliases',
        ordinal: 2
      },
      {
        id: 'routes',
        displayName: 'Routes & Dosing',
        type: 'collection',
        collectionEntity: 'generic_routes',
        ordinal: 3
      },
      {
        id: 'approvals',
        displayName: 'Approvals',
        type: 'collection',
        collectionEntity: 'generic_approvals',
        ordinal: 4
      },
      {
        id: 'products',
        displayName: 'Manufactured Products',
        type: 'collection',
        collectionEntity: 'manu_drugs',
        ordinal: 5
      }
    ]
  },

  manu_drugs: {
    name: 'manu_drugs',
    tableName: 'manu_drugs',
    displayName: 'Manufactured Drug',
    pluralName: 'Manufactured Drugs',
    comment: 'Manufactured drug products including brand names and biosimilar information',
    fields: [
      {
        property_name: 'uid',
        ordinal: 27,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        isId: true,
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'ID',
          controlType: 'text'
        }
      },{
        property_name: 'manu_drug_key',
        ordinal: 2,
        is_editable: false,
        is_visible: false,
        is_key: true,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'readonly',
          displayName: 'Product Key',
          controlType: 'text'
        }
      },{
        property_name: 'generic_uid',
        ordinal: 30,
        is_editable: false,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'UUID',
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'Generic Drug ID',
          controlType: 'text'
        }
      },{
        property_name: 'drug_name',
        ordinal: 2,
        is_editable: true,
        is_visible: false,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        isRequired: true,
        ui: {
          visibility: 'visible',
          displayName: 'Brand Name',
          controlType: 'text',
          placeholder: 'Enter brand name'
        }
      },{
        property_name: 'manufacturer',
        ordinal: 32,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Manufacturer',
          controlType: 'text',
          placeholder: 'Enter manufacturer name'
        }
      },{
        property_name: 'biosimilar',
        ordinal: 32,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'boolean',
        sqlType: 'INTEGER',
        ui: {
          visibility: 'visible',
          displayName: 'Biosimilar',
          controlType: 'checkbox'
        }
      },{
        property_name: 'biosimilar_suffix',
        ordinal: 34,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Biosimilar Suffix',
          controlType: 'text',
          placeholder: 'Enter FDA suffix (e.g., -aacf)'
        }
      },{
        property_name: 'biosimilar_originator',
        ordinal: 34,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Biosimilar Originator',
          controlType: 'text',
          placeholder: 'Enter original brand name'
        }
      }
    ],
    relationships: [
      {
        type: '1-n',
        targetEntity: 'generic_drugs',
        foreignKey: 'generic_uid',
        displayName: 'Generic Drug',
        isCollection: false
      }
    ],
    aggregates: [
      {
        id: 'details',
        displayName: 'Details',
        type: 'properties',
        fields: ['drug_name', 'manufacturer', 'biosimilar', 'biosimilar_suffix', 'biosimilar_originator'],
        ordinal: 1
      }
    ]
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get schema by table name
 */
export function getSchemaByTableName(tableName: string): UIEntity | undefined {
  return Object.values(ENTITY_SCHEMAS).find(schema => schema.tableName === tableName) || 
         Object.values(ENTITY_SUB_COLLECTIONS).find(schema => schema.tableName === tableName);
}

/**
 * Get field by name from schema
 */
export function getFieldByName(uiEntity: UIEntity, fieldName: string): UIProperty | undefined {
  return (uiEntity.properties || []).find(field => field.property_name === fieldName);
}

// ============================================================================
// BACKWARD COMPATIBILITY (deprecated, use UIModel types instead)
// ============================================================================

/**
 * @deprecated Use UIAggregate from UIModel instead
 */
export type EntityAggregate = UIAggregate; 