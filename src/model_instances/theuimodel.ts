// Drug Database Schema - Refined from DDL
// This file defines the complete metadata for the drug database

import { UIAggregateMeta, UIEntityMeta, UIModel } from '../model_defs/UIModel';

// ============================================================================
// SUB-COLLECTION SCHEMAS (for tabs/aggregates)
// ============================================================================

// Sub-collection schemas (separate from main entities)
export const ENTITY_AGGREGATES: Record<string, UIAggregateMeta> = {
  GenericAlias: {
    aggregateType: 'GenericAlias',
    displayName: 'Generic Alias',
    // ordinal: 3,
    isTable: true,
    propertyDefs: [
      {
        propertyName: 'uid',
        ordinal: 1,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isKey: false,
        isId: true,
        displayName: 'ID',
        controlType: 'text'
      },{
        propertyName: 'generic_uid',
        ordinal: 2,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isKey: false,
        isId: false,
        displayName: 'Generic Drug ID',
        controlType: 'text'
      },{
        propertyName: 'generic_key',
        ordinal: 3,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isKey: true,
        isId: false,
        displayName: 'Generic Key',
        controlType: 'text'
      },{
        propertyName: 'alias',
        ordinal: 3,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Alias Name',
        controlType: 'text',
        placeholder: 'Enter alternative name'
      }
    ],
  },

  GenericRoute: {
    aggregateType: 'GenericRoute',
    displayName: 'Drug Route & Dosing',
    // ordinal: 2,
    isTable: true,
    propertyDefs: [
      {
        propertyName: 'uid',
        ordinal: 1,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isKey: false,
        isId: true,
        displayName: 'ID',
        controlType: 'text'
      },{
        propertyName: 'route_key',
        ordinal: 2,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isKey: true,
        isId: false,
        displayName: 'Route Key',
        controlType: 'text'
      },{
        propertyName: 'generic_uid',
        ordinal: 7,
        isEditable: false,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Generic Drug ID',
        controlType: 'text'
      },{
        propertyName: 'route_type',
        ordinal: 2,
        isEditable: true,
        isVisible: false,
        isRequired: false,
        isKey: false,
        isId: false,
        selectValues: ['Subcutaneous', 'Intravenous', 'Oral'],
        displayName: 'Route Type',
        controlType: 'select',
        placeholder: 'Select administration route'
      },{
        propertyName: 'load_dose',
        ordinal: 9,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Loading Dose',
        controlType: 'text',
        placeholder: 'Enter loading dose'
      },{
        propertyName: 'load_measure',
        ordinal: 9,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Loading Dose Unit',
        controlType: 'text',
        placeholder: 'Enter dose unit (mg, ml, etc.)'
      },{
        propertyName: 'maintain_dose',
        ordinal: 11,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Maintenance Dose',
        controlType: 'text',
        placeholder: 'Enter maintenance dose'
      },{
        propertyName: 'maintain_measure',
        ordinal: 11,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Maintenance Dose Unit',
        controlType: 'text',
        placeholder: 'Enter dose unit'
      },{
        propertyName: 'montherapy',
        ordinal: 13,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Monotherapy Status',
        controlType: 'text',
        placeholder: 'Enter monotherapy approval status'
      },{
        propertyName: 'half_life',
        ordinal: 13,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Half Life',
        controlType: 'textarea',
        placeholder: 'Enter drug half-life information'
      }
    ],
  },

  GenericApproval: {
    aggregateType: 'GenericApproval',
    displayName: 'Drug Approval',
    // ordinal: 1,
    isTable: true,
    propertyDefs: [
      {
        propertyName: 'uid',
        ordinal: 1,
        isEditable: true,
        isVisible: false,
        isRequired: false,
        isKey: false,
        isId: true,
        displayName: 'ID',
        controlType: 'text'
      },{
        propertyName: 'generic_uid',
        ordinal: 2,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isKey: false,
        isId: false,
        displayName: 'Generic Drug ID',
        controlType: 'text'
      },{
        propertyName: 'country',
        ordinal: 17,
        isEditable: true,
        isVisible: false,
        isRequired: false,
        isKey: false,
        isId: false,
        selectValues: ['USA', 'CAN', 'FRA', 'UK'],
        displayName: 'Country',
        controlType: 'select',
        placeholder: 'Select country'
      },{
        propertyName: 'indication',
        ordinal: 17,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Indication',
        controlType: 'textarea',
        placeholder: 'Enter medical indication'
      },{
        propertyName: 'approval_date',
        ordinal: 19,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Approval Date',
        controlType: 'date',
        placeholder: 'Select approval date'
      },{
        propertyName: 'box_warning',
        ordinal: 19,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Box Warning',
        controlType: 'textarea',
        placeholder: 'Enter black box warning information'
      }
    ],
  },

  GenericManuDrugs: {
    aggregateType: 'GenericManuDrugs',
    displayName: 'Manufactured Drugs',
    // ordinal: 4,
    isTable: true,
    propertyDefs: [
      {
        propertyName: 'uid',
        ordinal: 1,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isKey: false,
        isId: true,
        displayName: 'ID',
        controlType: 'text'
      },{
        propertyName: 'manu_drug_key',
        ordinal: 2,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isKey: true,
        isId: false,
        displayName: 'Product Key',
        controlType: 'text'
      },{
        propertyName: 'generic_uid',
        ordinal: 3,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isKey: false,
        isId: false,
        displayName: 'Generic Drug ID',
        controlType: 'text'
      },{
        propertyName: 'drug_name',
        ordinal: 4,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Brand Name',
        controlType: 'text',
        placeholder: 'Enter brand name'
      },{
        propertyName: 'manufacturer',
        ordinal: 5,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Manufacturer',
        controlType: 'text',
        placeholder: 'Enter manufacturer name'
      },{
        propertyName: 'biosimilar',
        ordinal: 6,
        isEditable: true,
        isVisible: true,
        isRequired: false,
        isKey: false,
        isId: false,
        displayName: 'Biosimilar',
        controlType: 'checkbox'
      },{
        propertyName: 'biosimilar_suffix',
        ordinal: 7,
        isEditable: true,
        isVisible: true,
        isRequired: false,
        isKey: false,
        isId: false,
        displayName: 'Biosimilar Suffix',
        controlType: 'text',
        placeholder: 'Enter FDA suffix (e.g., -aacf)'
      },{
        propertyName: 'biosimilar_originator',
        ordinal: 8,
        isEditable: true,
        isVisible: true,
        isRequired: false,
        isKey: false,
        isId: false,
        displayName: 'Biosimilar Originator',
        controlType: 'text',
        placeholder: 'Enter original brand name'
      }
    ],
  }
};

// Main entity schemas (only contains the actual entities, not sub-collections)
export const ENTITIES: Record<string, UIEntityMeta> = {
  GenericDrugs: {
    entityType: 'GenericDrugs',
    displayName: 'Generic Drug',
    pluralName: 'Generic Drugs',
    propertyDefs: [
      {
        propertyName: 'uid',
        ordinal: 1,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isKey: false,
        isId: true,
        displayName: 'ID',
        controlType: 'text'
      },{
        propertyName: 'generic_key',
        ordinal: 2,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isKey: true,
        isId: false,
        displayName: 'Generic Key',
        controlType: 'text',
        placeholder: 'Auto-generated key'
      },{
        propertyName: 'generic_name',
        ordinal: 23,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Generic Name',
        controlType: 'text',
        placeholder: 'Enter generic drug name'
      },{
        propertyName: 'biologic',
        ordinal: 23,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Biologic Classification',
        controlType: 'textarea',
        placeholder: 'Enter biologic information'
      },{
        propertyName: 'mech_of_action',
        ordinal: 25,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Mechanism of Action',
        controlType: 'text',
        placeholder: 'Enter mechanism of action'
      },{
        propertyName: 'class_or_type',
        ordinal: 25,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Drug Class/Type',
        controlType: 'text',
        placeholder: 'Enter drug class or type'
      },{
        propertyName: 'target',
        ordinal: 27,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Target',
        controlType: 'text',
        placeholder: 'Enter drug target (e.g., TNFi)'
      }
    ],
    aggregateRefs: [
      {
        aggregateType: 'GenericManuDrugs',
        displayName: 'Manufactured Drugs',
        ordinal: 1
      },
      {
        aggregateType: 'GenericRoute',
        displayName: 'Drug Route & Dosing',
        ordinal: 2
      },
      {
        aggregateType: 'GenericApproval',
        displayName: 'Drug Approval',
        ordinal: 3
      },
      {
        aggregateType: 'GenericAlias',
        displayName: 'Aliases',
        ordinal: 4
      },
    ]
  },

  ManuDrugs: {
    entityType: 'ManuDrugs',
    displayName: 'Manufactured Drug',
    pluralName: 'Manufactured Drugs',
    propertyDefs: [
      {
        propertyName: 'uid',
        ordinal: 27,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: true,
        displayName: 'ID',
        controlType: 'text'
      },{
        propertyName: 'manu_drug_key',
        ordinal: 2,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isKey: true,
        isId: false,
        displayName: 'Product Key',
        controlType: 'text'
      },{
        propertyName: 'generic_key',
        ordinal: 3,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isKey: false,
        isId: false,
        displayName: 'Generic Key',
        controlType: 'text'
      },{
        propertyName: 'generic_uid',
        ordinal: 30,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isKey: false,
        isId: true,
        displayName: 'Generic Drug ID',
        controlType: 'text'
      },{
        propertyName: 'drug_name',
        ordinal: 2,
        isEditable: true,
        isVisible: false,
        isRequired: false,
        isKey: false,
        isId: false,
        displayName: 'Brand Name',
        controlType: 'text',
        placeholder: 'Enter brand name'
      },{
        propertyName: 'manufacturer',
        ordinal: 32,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Manufacturer',
        controlType: 'text',
        placeholder: 'Enter manufacturer name'
      },{
        propertyName: 'biosimilar',
        ordinal: 32,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Biosimilar',
        controlType: 'checkbox'
      },{
        propertyName: 'biosimilar_suffix',
        ordinal: 34,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Biosimilar Suffix',
        controlType: 'text',
        placeholder: 'Enter FDA suffix (e.g., -aacf)'
      },{
        propertyName: 'biosimilar_originator',
        ordinal: 34,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isKey: false,
        isId: false,
        displayName: 'Biosimilar Originator',
        controlType: 'text',
        placeholder: 'Enter original brand name'
      }
    ],
  }
};

// ============================================================================
// UI MODEL WRAPPER INSTANCE
// ============================================================================

/**
 * The complete UI model wrapper instance for the DrugBot application
 * 
 * This is the primary interface for accessing UI model information.
 * Instead of working directly with the ENTITIES and ENTITY_AGGREGATES constants,
 * consumers should use this wrapper instance which provides convenient methods
 * for querying the UI model.
 * 
 * Usage Examples:
 * - theUIModel.getEntity('GenericDrugs')
 * - theUIModel.getEntityVisibleProperties('GenericDrugs')
 * - theUIModel.getAggregate('GenericRoute')
 * - theUIModel.getAggregateEditableProperties('GenericRoute')
 * - theUIModel.findEntityProperty('GenericDrugs', 'generic_name')
 */
export const theUIModel = new UIModel(ENTITIES, ENTITY_AGGREGATES);

// Export as default for convenience
export default theUIModel;
