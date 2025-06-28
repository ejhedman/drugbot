// Drug Database Schema - Refined from DDL
// This file defines the complete metadata for the drug database

export interface EntityField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'json';
  sqlType?: string;
  isId?: boolean;
  isKey?: boolean;
  isRequired?: boolean;
  enumValues?: string[];
  
  ui: {
    visibility: 'visible' | 'hidden' | 'readonly';
    displayName: string;
    controlType: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox';
    placeholder?: string;
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
      custom?: string;
    };
  };
}

export interface EntityRelationship {
  type: '1-n' | 'm-n';
  targetEntity: string;
  foreignKey?: string;
  junctionTable?: string;
  displayName: string;
  isCollection: boolean;
}

export interface EntitySubCollection {
  id: string;
  displayName: string;
  type: 'properties' | 'collection' | 'custom';
  collectionEntity?: string;
  fields?: string[];
  customComponent?: string;
}

export interface EntitySchema {
  name: string;
  tableName: string;
  displayName: string;
  pluralName: string;
  comment?: string;
  fields: EntityField[];
  relationships: EntityRelationship[];
  subCollections: EntitySubCollection[];
  hierarchical?: {
    parentField: string;
    maxDepth?: number;
  };
}

// Sub-collection schemas (separate from main entities)
export const ENTITY_SUB_COLLECTIONS: Record<string, EntitySchema> = {
  generic_aliases: {
    name: 'generic_aliases',
    tableName: 'generic_aliases',
    displayName: 'Generic Alias',
    pluralName: 'Generic Aliases',
    comment: 'Alternative names and aliases for generic drugs',
    fields: [
      {
        name: 'uid',
        type: 'string',
        sqlType: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        isId: true,
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'ID',
          controlType: 'text'
        }
      },
      {
        name: 'generic_uid',
        type: 'string',
        sqlType: 'UUID',
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'Generic Drug ID',
          controlType: 'text'
        }
      },
      {
        name: 'generic_key',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'readonly',
          displayName: 'Generic Key',
          controlType: 'text'
        }
      },
      {
        name: 'alias',
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
    subCollections: [
      {
        id: 'details',
        displayName: 'Details',
        type: 'properties',
        fields: ['alias']
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
        name: 'uid',
        type: 'string',
        sqlType: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        isId: true,
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'ID',
          controlType: 'text'
        }
      },
      {
        name: 'route_key',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        isKey: true,
        ui: {
          visibility: 'readonly',
          displayName: 'Route Key',
          controlType: 'text'
        }
      },
      {
        name: 'generic_uid',
        type: 'string',
        sqlType: 'UUID',
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'Generic Drug ID',
          controlType: 'text'
        }
      },
      {
        name: 'route_type',
        type: 'enum',
        sqlType: 'VARCHAR(255)',
        enumValues: ['Subcutaneous', 'Intravenous', 'Oral'],
        ui: {
          visibility: 'visible',
          displayName: 'Route Type',
          controlType: 'select',
          placeholder: 'Select administration route'
        }
      },
      {
        name: 'load_dose',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Loading Dose',
          controlType: 'text',
          placeholder: 'Enter loading dose'
        }
      },
      {
        name: 'load_measure',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Loading Dose Unit',
          controlType: 'text',
          placeholder: 'Enter dose unit (mg, ml, etc.)'
        }
      },
      {
        name: 'maintain_dose',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Maintenance Dose',
          controlType: 'text',
          placeholder: 'Enter maintenance dose'
        }
      },
      {
        name: 'maintain_measure',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Maintenance Dose Unit',
          controlType: 'text',
          placeholder: 'Enter dose unit'
        }
      },
      {
        name: 'half_life',
        type: 'string',
        sqlType: 'TEXT',
        ui: {
          visibility: 'visible',
          displayName: 'Half Life',
          controlType: 'textarea',
          placeholder: 'Enter half-life information'
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
    subCollections: [
      {
        id: 'details',
        displayName: 'Details',
        type: 'properties',
        fields: ['route_type', 'load_dose', 'load_measure', 'maintain_dose', 'maintain_measure', 'half_life']
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
        name: 'uid',
        type: 'string',
        sqlType: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        isId: true,
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'ID',
          controlType: 'text'
        }
      },
      {
        name: 'generic_uid',
        type: 'string',
        sqlType: 'UUID',
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'Generic Drug ID',
          controlType: 'text'
        }
      },
      {
        name: 'country',
        type: 'enum',
        sqlType: 'VARCHAR(255)',
        enumValues: ['USA', 'CAN', 'FRA', 'UK'],
        ui: {
          visibility: 'visible',
          displayName: 'Country',
          controlType: 'select',
          placeholder: 'Select country'
        }
      },
      {
        name: 'indication',
        type: 'string',
        sqlType: 'TEXT',
        ui: {
          visibility: 'visible',
          displayName: 'Indication',
          controlType: 'textarea',
          placeholder: 'Enter medical indication'
        }
      },
      {
        name: 'approval_date',
        type: 'date',
        sqlType: 'DATE',
        ui: {
          visibility: 'visible',
          displayName: 'Approval Date',
          controlType: 'date',
          placeholder: 'Select approval date'
        }
      },
      {
        name: 'box_warning',
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
    subCollections: [
      {
        id: 'details',
        displayName: 'Details',
        type: 'properties',
        fields: ['country', 'indication', 'approval_date', 'box_warning']
      }
    ]
  }
};

// Main entity schemas (only contains the actual entities, not sub-collections)
export const ENTITY_SCHEMAS: Record<string, EntitySchema> = {
  generic_drugs: {
    name: 'generic_drugs',
    tableName: 'generic_drugs',
    displayName: 'Generic Drug',
    pluralName: 'Generic Drugs',
    comment: 'Generic drug information including mechanism of action and classification',
    fields: [
      {
        name: 'uid',
        type: 'string',
        sqlType: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        isId: true,
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'ID',
          controlType: 'text'
        }
      },
      {
        name: 'generic_key',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        isKey: true,
        isRequired: true,
        ui: {
          visibility: 'readonly',
          displayName: 'Generic Key',
          controlType: 'text',
          placeholder: 'Auto-generated key'
        }
      },
      {
        name: 'generic_name',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        isRequired: true,
        ui: {
          visibility: 'visible',
          displayName: 'Generic Name',
          controlType: 'text',
          placeholder: 'Enter generic drug name'
        }
      },
      {
        name: 'biologic',
        type: 'string',
        sqlType: 'TEXT',
        ui: {
          visibility: 'visible',
          displayName: 'Biologic Classification',
          controlType: 'textarea',
          placeholder: 'Enter biologic information'
        }
      },
      {
        name: 'mech_of_action',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Mechanism of Action',
          controlType: 'text',
          placeholder: 'Enter mechanism of action'
        }
      },
      {
        name: 'class_or_type',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Drug Class/Type',
          controlType: 'text',
          placeholder: 'Enter drug class or type'
        }
      },
      {
        name: 'target',
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
    subCollections: [
      {
        id: 'details',
        displayName: 'Details',
        type: 'properties',
        fields: ['generic_name', 'biologic', 'mech_of_action', 'class_or_type', 'target']
      },
      {
        id: 'aliases',
        displayName: 'Aliases',
        type: 'collection',
        collectionEntity: 'generic_aliases'
      },
      {
        id: 'routes',
        displayName: 'Routes & Dosing',
        type: 'collection',
        collectionEntity: 'generic_routes'
      },
      {
        id: 'approvals',
        displayName: 'Approvals',
        type: 'collection',
        collectionEntity: 'generic_approvals'
      },
      {
        id: 'products',
        displayName: 'Manufactured Products',
        type: 'collection',
        collectionEntity: 'manu_drugs'
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
        name: 'uid',
        type: 'string',
        sqlType: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
        isId: true,
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'ID',
          controlType: 'text'
        }
      },
      {
        name: 'manu_drug_key',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        isKey: true,
        ui: {
          visibility: 'readonly',
          displayName: 'Product Key',
          controlType: 'text'
        }
      },
      {
        name: 'generic_uid',
        type: 'string',
        sqlType: 'UUID',
        isRequired: true,
        ui: {
          visibility: 'hidden',
          displayName: 'Generic Drug ID',
          controlType: 'text'
        }
      },
      {
        name: 'drug_name',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        isRequired: true,
        ui: {
          visibility: 'visible',
          displayName: 'Brand Name',
          controlType: 'text',
          placeholder: 'Enter brand name'
        }
      },
      {
        name: 'manufacturer',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Manufacturer',
          controlType: 'text',
          placeholder: 'Enter manufacturer name'
        }
      },
      {
        name: 'biosimilar',
        type: 'boolean',
        sqlType: 'INTEGER',
        ui: {
          visibility: 'visible',
          displayName: 'Biosimilar',
          controlType: 'checkbox'
        }
      },
      {
        name: 'biosimilar_suffix',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Biosimilar Suffix',
          controlType: 'text',
          placeholder: 'Enter FDA suffix (e.g., -aacf)'
        }
      },
      {
        name: 'biosimilar_originator',
        type: 'string',
        sqlType: 'VARCHAR(255)',
        ui: {
          visibility: 'visible',
          displayName: 'Original Brand',
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
    subCollections: [
      {
        id: 'details',
        displayName: 'Details',
        type: 'properties',
        fields: ['drug_name', 'manufacturer', 'biosimilar', 'biosimilar_suffix', 'biosimilar_originator']
      }
    ]
  }
};

// Helper function to get schema by table name
export function getSchemaByTableName(tableName: string): EntitySchema | undefined {
  return Object.values(ENTITY_SCHEMAS).find(schema => schema.tableName === tableName);
}

// Helper function to get field by name
export function getFieldByName(schema: EntitySchema, fieldName: string): EntityField | undefined {
  return schema.fields.find(field => field.name === fieldName);
}

// Generate TypeScript types from schema
export type EntityData<T extends keyof typeof ENTITY_SCHEMAS> = {
  [K in typeof ENTITY_SCHEMAS[T]['fields'][number]['name']]: 
    (typeof ENTITY_SCHEMAS[T]['fields'][number] & { name: K })['type'] extends 'string'
      ? string
      : (typeof ENTITY_SCHEMAS[T]['fields'][number] & { name: K })['type'] extends 'number'
      ? number
      : (typeof ENTITY_SCHEMAS[T]['fields'][number] & { name: K })['type'] extends 'boolean'
      ? boolean
      : (typeof ENTITY_SCHEMAS[T]['fields'][number] & { name: K })['type'] extends 'date'
      ? Date
      : string;
}; 