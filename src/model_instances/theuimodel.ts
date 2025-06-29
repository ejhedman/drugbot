// Drug Database Schema - Refined from DDL
// This file defines the complete metadata for the drug database

import { UIAggregate, UIEntity } from '../model_defs/UIModel';

// ============================================================================
// SUB-COLLECTION SCHEMAS (for tabs/aggregates)
// ============================================================================

// Sub-collection schemas (separate from main entities)
export const ENTITY_AGGREGATES: Record<string, UIAggregate> = {
  generic_aliases: {
    aggregate_type: 'GenericAlias',
    displayName: 'Generic Alias',
    ordinal: 3,
    properties: [
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
        visibility: 'hidden',
        displayName: 'ID',
        controlType: 'text'
      },{
        property_name: 'generic_uid',
        ordinal: 2,
        is_editable: false,
        is_visible: false,
        is_key: false,
        type: 'string',
        sqlType: 'UUID',
        isRequired: true,
        visibility: 'hidden',
        displayName: 'Generic Drug ID',
        controlType: 'text'
      },{
        property_name: 'generic_key',
        ordinal: 3,
        is_editable: true,
        is_visible: false,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        visibility: 'readonly',
        displayName: 'Generic Key',
        controlType: 'text'
      },{
        property_name: 'alias',
        ordinal: 3,
        is_editable: false,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        isRequired: true,
        visibility: 'visible',
        displayName: 'Alias Name',
        controlType: 'text',
        placeholder: 'Enter alternative name'
      }
    ],
  },

  generic_routes: {
    aggregate_type: 'GenericRoute',
    displayName: 'Drug Route & Dosing',
    ordinal: 2,
    properties: [
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
        visibility: 'hidden',
        displayName: 'ID',
        controlType: 'text'
      },{
        property_name: 'route_key',
        ordinal: 2,
        is_editable: false,
        is_visible: false,
        is_key: true,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        visibility: 'readonly',
        displayName: 'Route Key',
        controlType: 'text'
      },{
        property_name: 'generic_uid',
        ordinal: 7,
        is_editable: false,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'UUID',
        isRequired: true,
        visibility: 'hidden',
        displayName: 'Generic Drug ID',
        controlType: 'text'
      },{
        property_name: 'route_type',
        ordinal: 2,
        is_editable: true,
        is_visible: false,
        is_key: false,
        type: 'enum',
        sqlType: 'VARCHAR(255)',
        enumValues: ['Subcutaneous', 'Intravenous', 'Oral'],
        visibility: 'visible',
        displayName: 'Route Type',
        controlType: 'select',
        placeholder: 'Select administration route'
      },{
        property_name: 'load_dose',
        ordinal: 9,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        visibility: 'visible',
        displayName: 'Loading Dose',
        controlType: 'text',
        placeholder: 'Enter loading dose'
      },{
        property_name: 'load_measure',
        ordinal: 9,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        visibility: 'visible',
        displayName: 'Loading Dose Unit',
        controlType: 'text',
        placeholder: 'Enter dose unit (mg, ml, etc.)'
      },{
        property_name: 'maintain_dose',
        ordinal: 11,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        visibility: 'visible',
        displayName: 'Maintenance Dose',
        controlType: 'text',
        placeholder: 'Enter maintenance dose'
      },{
        property_name: 'maintain_measure',
        ordinal: 11,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        visibility: 'visible',
        displayName: 'Maintenance Dose Unit',
        controlType: 'text',
        placeholder: 'Enter dose unit'
      },{
        property_name: 'montherapy',
        ordinal: 13,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        visibility: 'visible',
        displayName: 'Monotherapy Status',
        controlType: 'text',
        placeholder: 'Enter monotherapy approval status'
      },{
        property_name: 'half_life',
        ordinal: 13,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'TEXT',
        visibility: 'visible',
        displayName: 'Half Life',
        controlType: 'textarea',
        placeholder: 'Enter drug half-life information'
      }
    ],
  },

  generic_approvals: {
    aggregate_type: 'GenericApproval',
    displayName: 'Drug Approval',
    ordinal: 1,
    properties: [
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
        visibility: 'hidden',
        displayName: 'ID',
        controlType: 'text'
      },{
        property_name: 'generic_uid',
        ordinal: 2,
        is_editable: false,
        is_visible: false,
        is_key: false,
        type: 'string',
        sqlType: 'UUID',
        isRequired: true,
        visibility: 'hidden',
        displayName: 'Generic Drug ID',
        controlType: 'text'
      },{
        property_name: 'country',
        ordinal: 17,
        is_editable: true,
        is_visible: false,
        is_key: false,
        type: 'enum',
        sqlType: 'VARCHAR(255)',
        enumValues: ['USA', 'CAN', 'FRA', 'UK'],
        visibility: 'visible',
        displayName: 'Country',
        controlType: 'select',
        placeholder: 'Select country'
      },{
        property_name: 'indication',
        ordinal: 17,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'TEXT',
        visibility: 'visible',
        displayName: 'Indication',
        controlType: 'textarea',
        placeholder: 'Enter medical indication'
      },{
        property_name: 'approval_date',
        ordinal: 19,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'date',
        sqlType: 'DATE',
        visibility: 'visible',
        displayName: 'Approval Date',
        controlType: 'date',
        placeholder: 'Select approval date'
      },{
        property_name: 'box_warning',
        ordinal: 19,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'TEXT',
        visibility: 'visible',
        displayName: 'Box Warning',
        controlType: 'textarea',
        placeholder: 'Enter black box warning information'
      }
    ],
  }
};

// Main entity schemas (only contains the actual entities, not sub-collections)
export const ENTITIES: Record<string, UIEntity> = {
  generic_drugs: {
    name: 'generic_drugs',
    tableName: 'generic_drugs',
    displayName: 'Generic Drug',
    pluralName: 'Generic Drugs',
    comment: 'Generic drug information including mechanism of action and classification',
    properties: [
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
        visibility: 'hidden',
        displayName: 'ID',
        controlType: 'text'
      },{
        property_name: 'generic_key',
        ordinal: 2,
        is_editable: false,
        is_visible: false,
        is_key: true,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        isRequired: true,
        visibility: 'readonly',
        displayName: 'Generic Key',
        controlType: 'text',
        placeholder: 'Auto-generated key'
      },{
        property_name: 'generic_name',
        ordinal: 23,
        is_editable: false,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        isRequired: true,
        visibility: 'visible',
        displayName: 'Generic Name',
        controlType: 'text',
        placeholder: 'Enter generic drug name'
      },{
        property_name: 'biologic',
        ordinal: 23,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'TEXT',
        visibility: 'visible',
        displayName: 'Biologic Classification',
        controlType: 'textarea',
        placeholder: 'Enter biologic information'
      },{
        property_name: 'mech_of_action',
        ordinal: 25,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        visibility: 'visible',
        displayName: 'Mechanism of Action',
        controlType: 'text',
        placeholder: 'Enter mechanism of action'
      },{
        property_name: 'class_or_type',
        ordinal: 25,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        visibility: 'visible',
        displayName: 'Drug Class/Type',
        controlType: 'text',
        placeholder: 'Enter drug class or type'
      },{
        property_name: 'target',
        ordinal: 27,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        visibility: 'visible',
        displayName: 'Target',
        controlType: 'text',
        placeholder: 'Enter drug target (e.g., TNFi)'
      }
    ],
    children: [
      {
        entity_id: 'generic_aliases',
        displayName: 'Aliases',
        ancestors: [],
        children: []
      },
      {
        entity_id: 'generic_routes',
        displayName: 'Routes & Dosing',
        ancestors: [],
        children: []
      },
      {
        entity_id: 'generic_approvals',
        displayName: 'Approvals',
        ancestors: [],
        children: []
      },
      {
        entity_id: 'manu_drugs',
        displayName: 'Manufactured Products',
        ancestors: [],
        children: []
      }
    ],
    aggregates: [
      {
        id: 'details',
        displayName: 'Details',
        type: 'properties',
        properties: [
          {
            property_name: 'generic_name',
            ordinal: 1,
            is_editable: true,
            is_visible: true,
            is_key: false
          },
          {
            property_name: 'biologic',
            ordinal: 2,
            is_editable: true,
            is_visible: true,
            is_key: false
          },
          {
            property_name: 'mech_of_action',
            ordinal: 3,
            is_editable: true,
            is_visible: true,
            is_key: false
          },
          {
            property_name: 'class_or_type',
            ordinal: 4,
            is_editable: true,
            is_visible: true,
            is_key: false
          },
          {
            property_name: 'target',
            ordinal: 5,
            is_editable: true,
            is_visible: true,
            is_key: false
          }
        ],
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
    properties: [
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
          visibility: 'hidden',
          displayName: 'ID',
          controlType: 'text'
      },{
        property_name: 'manu_drug_key',
        ordinal: 2,
        is_editable: false,
        is_visible: false,
        is_key: true,
        type: 'string',
        sqlType: 'VARCHAR(255)',
          visibility: 'readonly',
          displayName: 'Product Key',
          controlType: 'text'
      },{
        property_name: 'generic_uid',
        ordinal: 30,
        is_editable: false,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'UUID',
        isRequired: true,
          visibility: 'hidden',
          displayName: 'Generic Drug ID',
          controlType: 'text'
      },{
        property_name: 'drug_name',
        ordinal: 2,
        is_editable: true,
        is_visible: false,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        isRequired: true,
        visibility: 'visible',
        displayName: 'Brand Name',
        controlType: 'text',
        placeholder: 'Enter brand name'
      },{
        property_name: 'manufacturer',
        ordinal: 32,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        visibility: 'visible',
        displayName: 'Manufacturer',
        controlType: 'text',
        placeholder: 'Enter manufacturer name'
      },{
        property_name: 'biosimilar',
        ordinal: 32,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'boolean',
        sqlType: 'INTEGER',
        visibility: 'visible',
        displayName: 'Biosimilar',
        controlType: 'checkbox'
      },{
        property_name: 'biosimilar_suffix',
        ordinal: 34,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        visibility: 'visible',
        displayName: 'Biosimilar Suffix',
        controlType: 'text',
        placeholder: 'Enter FDA suffix (e.g., -aacf)'
      },{
        property_name: 'biosimilar_originator',
        ordinal: 34,
        is_editable: true,
        is_visible: true,
        is_key: false,
        type: 'string',
        sqlType: 'VARCHAR(255)',
        visibility: 'visible',
        displayName: 'Biosimilar Originator',
        controlType: 'text',
        placeholder: 'Enter original brand name'
      }
    ],
    children: [
      {
        entity_id: 'generic_drugs',
        displayName: 'Generic Drug',
        ancestors: [],
        children: []
      }
    ],
    aggregates: [
      {
        id: 'details',
        displayName: 'Details',
        type: 'properties',
        properties: [
          {
            property_name: 'drug_name',
            ordinal: 1,
            is_editable: true,
            is_visible: true,
            is_key: false
          },
          {
            property_name: 'manufacturer',
            ordinal: 2,
            is_editable: true,
            is_visible: true,
            is_key: false
          },
          {
            property_name: 'biosimilar',
            ordinal: 3,
            is_editable: true,
            is_visible: true,
            is_key: false
          },
          {
            property_name: 'biosimilar_suffix',
            ordinal: 4,
            is_editable: true,
            is_visible: true,
            is_key: false
          },
          {
            property_name: 'biosimilar_originator',
            ordinal: 5,
            is_editable: true,
            is_visible: true,
            is_key: false
          }
        ],
        ordinal: 1
      }
    ]
  }
};
