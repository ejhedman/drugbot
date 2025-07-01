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
    canEdit: true,
    propertyDefs: [
      {
        propertyName: 'uid',
        ordinal: 1,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: true,
        displayName: 'ID',
        controlType: 'text'
      },{
        propertyName: 'generic_uid',
        ordinal: 2,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: false,
        displayName: 'Generic Drug ID',
        controlType: 'text'
      },{
        propertyName: 'generic_key',
        ordinal: 3,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: false,
        displayName: 'Generic Key',
        controlType: 'text'
      },{
        propertyName: 'alias',
        ordinal: 3,
        isEditable: true,
        isVisible: true,
        isRequired: true,
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
    canEdit: true,
    propertyDefs: [
      {
        propertyName: 'uid',
        ordinal: 1,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: true,
        displayName: 'ID',
        controlType: 'text'
      },{
        propertyName: 'route_key',
        ordinal: 2,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: false,
        displayName: 'Route Key',
        controlType: 'text'
      },{
        propertyName: 'generic_uid',
        ordinal: 7,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: false,
        displayName: 'Generic Drug ID',
        controlType: 'text'
      },{
        propertyName: 'route_type',
        ordinal: 2,
        isEditable: true,
        isVisible: false,
        isRequired: false,
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
    canEdit: true,
    propertyDefs: [
      {
        propertyName: 'uid',
        ordinal: 1,
        isEditable: true,
        isVisible: false,
        isRequired: false,
        isId: true,
        displayName: 'ID',
        controlType: 'text'
      },{
        propertyName: 'generic_uid',
        ordinal: 2,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: false,
        displayName: 'Generic Drug ID',
        controlType: 'text'
      },{
        propertyName: 'country',
        ordinal: 17,
        isEditable: true,
        isVisible: false,
        isRequired: false,
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
    canEdit: true,
    propertyDefs: [
      {
        propertyName: 'uid',
        ordinal: 1,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: true,
        displayName: 'ID',
        controlType: 'text'
      },{
        propertyName: 'manu_drug_key',
        ordinal: 2,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: false,
        displayName: 'Product Key',
        controlType: 'text'
      },{
        propertyName: 'generic_uid',
        ordinal: 3,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: false,
        displayName: 'Generic Drug ID',
        controlType: 'text'
      },{
        propertyName: 'drug_name',
        ordinal: 4,
        isEditable: true,
        isVisible: true,
        isRequired: true,
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
        isId: false,
        displayName: 'Biosimilar',
        controlType: 'text'
      },{
        propertyName: 'biosimilar_suffix',
        ordinal: 7,
        isEditable: true,
        isVisible: true,
        isRequired: false,
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
        isId: false,
        displayName: 'Biosimilar Originator',
        controlType: 'text',
        placeholder: 'Enter original brand name'
      }
    ],
  },

  GenericDrugsWideView: {
    aggregateType: 'GenericDrugsWideView',
    displayName: 'Complete Drug Information',
    isTable: true,
    canEdit: false,
    propertyDefs: [
      // Generic Drugs table (base table)
      {
        propertyName: 'generic_uid',
        ordinal: 1,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: true,
        displayName: 'Generic UID',
        controlType: 'text'
      },
      {
        propertyName: 'generic_key',
        ordinal: 2,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Generic Key',
        controlType: 'text'
      },
      {
        propertyName: 'generic_name',
        ordinal: 3,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Generic Name',
        controlType: 'text'
      },
      {
        propertyName: 'biologic',
        ordinal: 4,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Biologic',
        controlType: 'text'
      },
      {
        propertyName: 'mech_of_action',
        ordinal: 5,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Mechanism of Action',
        controlType: 'text'
      },
      {
        propertyName: 'class_or_type',
        ordinal: 6,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Class/Type',
        controlType: 'text'
      },
      {
        propertyName: 'target',
        ordinal: 7,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Target',
        controlType: 'text'
      },
      
      // Manufactured Drugs table
      {
        propertyName: 'manu_drug_uid',
        ordinal: 8,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: false,
        displayName: 'Manufactured Drug UID',
        controlType: 'text'
      },
      {
        propertyName: 'manu_drug_key',
        ordinal: 9,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Manufactured Drug Key',
        controlType: 'text'
      },
      {
        propertyName: 'drug_name',
        ordinal: 10,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Drug Name',
        controlType: 'text'
      },
      {
        propertyName: 'manufacturer',
        ordinal: 11,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Manufacturer',
        controlType: 'text'
      },
      {
        propertyName: 'brandkey',
        ordinal: 12,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Brand Key',
        controlType: 'text'
      },
      {
        propertyName: 'biosimilar_suffix',
        ordinal: 13,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Biosimilar Suffix',
        controlType: 'text'
      },
      {
        propertyName: 'biosimilar',
        ordinal: 14,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Biosimilar',
        controlType: 'text'
      },
      {
        propertyName: 'biosimilar_originator',
        ordinal: 15,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Biosimilar Originator',
        controlType: 'text'
      },
      
      // Generic Routes table
      {
        propertyName: 'route_uid',
        ordinal: 16,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: false,
        displayName: 'Route UID',
        controlType: 'text'
      },
      {
        propertyName: 'route_key',
        ordinal: 17,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Route Key',
        controlType: 'text'
      },
      {
        propertyName: 'route_type',
        ordinal: 18,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Route Type',
        controlType: 'text'
      },
      {
        propertyName: 'load_measure',
        ordinal: 19,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Load Measure',
        controlType: 'text'
      },
      {
        propertyName: 'load_dose',
        ordinal: 20,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Load Dose',
        controlType: 'text'
      },
      {
        propertyName: 'load_reg',
        ordinal: 21,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Load Regimen',
        controlType: 'text'
      },
      {
        propertyName: 'maintain_dose',
        ordinal: 22,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Maintain Dose',
        controlType: 'text'
      },
      {
        propertyName: 'maintain_measure',
        ordinal: 23,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Maintain Measure',
        controlType: 'text'
      },
      {
        propertyName: 'maintain_reg',
        ordinal: 24,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Maintain Regimen',
        controlType: 'text'
      },
      {
        propertyName: 'montherapy',
        ordinal: 25,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Monotherapy',
        controlType: 'text'
      },
      {
        propertyName: 'half_life',
        ordinal: 26,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Half Life',
        controlType: 'text'
      },
      
      // Generic Approvals table
      {
        propertyName: 'approval_uid',
        ordinal: 27,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: false,
        displayName: 'Approval UID',
        controlType: 'text'
      },
      {
        propertyName: 'approval_route_type',
        ordinal: 28,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Approval Route Type',
        controlType: 'text'
      },
      {
        propertyName: 'country',
        ordinal: 29,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Country',
        controlType: 'text'
      },
      {
        propertyName: 'indication',
        ordinal: 30,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Indication',
        controlType: 'text'
      },
      {
        propertyName: 'populations',
        ordinal: 31,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Populations',
        controlType: 'text'
      },
      {
        propertyName: 'approval_date',
        ordinal: 32,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Approval Date',
        controlType: 'date'
      },
      {
        propertyName: 'discon_date',
        ordinal: 33,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Discontinuation Date',
        controlType: 'text'
      },
      {
        propertyName: 'box_warning',
        ordinal: 34,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Box Warning',
        controlType: 'text'
      },
      {
        propertyName: 'box_warning_date',
        ordinal: 35,
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isId: false,
        displayName: 'Box Warning Date',
        controlType: 'text'
      }
    ],
  }
};

// Main entity schemas (only contains the actual entities, not sub-collections)
export const ENTITIES: Record<string, UIEntityMeta> = {
  GenericDrugs: {
    entityType: 'GenericDrugs',
    displayName: 'Generic',
    pluralName: 'Generic Drugs',
    propertyDefs: [
      {
        propertyName: 'uid',
        ordinal: 1,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: true,
        displayName: 'ID',
        controlType: 'text'
      },{
        propertyName: 'generic_key',
        ordinal: 2,
        isEditable: false,
        isVisible: false,
        isRequired: false,
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
      {
        aggregateType: 'GenericDrugsWideView',
        displayName: 'Complete Drug Information',
        ordinal: 5
      },
    ]
  },

  ManuDrugs: {
    entityType: 'ManuDrugs',
    displayName: 'Branded Drug',
    pluralName: 'Manufactured Drugs',
    propertyDefs: [
      {
        propertyName: 'uid',
        ordinal: 27,
        isEditable: true,
        isVisible: true,
        isRequired: true,
        isId: true,
        displayName: 'ID',
        controlType: 'text'
      },{
        propertyName: 'manu_drug_key',
        ordinal: 2,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: false,
        displayName: 'Product Key',
        controlType: 'text'
      },{
        propertyName: 'generic_key',
        ordinal: 3,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: false,
        displayName: 'Generic Key',
        controlType: 'text'
      },{
        propertyName: 'generic_uid',
        ordinal: 30,
        isEditable: false,
        isVisible: false,
        isRequired: false,
        isId: true,
        displayName: 'Generic Drug ID',
        controlType: 'text'
      },{
        propertyName: 'drug_name',
        ordinal: 2,
        isEditable: true,
        isVisible: false,
        isRequired: false,
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
        isId: false,
        displayName: 'Biosimilar',
        controlType: 'text'
      },{
        propertyName: 'biosimilar_suffix',
        ordinal: 34,
        isEditable: true,
        isVisible: true,
        isRequired: true,
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
 * The complete UI model wrapper instance for the Drugissimo application
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
