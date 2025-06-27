// Generated schema from DDL - 2025-06-27T16:27:20.670Z
// This is a template - you should review and customize the UI metadata

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

export interface EntityTab {
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
  tabs: EntityTab[];
  hierarchical?: {
    parentField: string;
    maxDepth?: number;
  };
}

export const ENTITY_SCHEMAS: Record<string, EntitySchema> = {
  generic_drug:   {
      "name": "generic_drug",
      "tableName": "generic_drugs",
      "displayName": "Generic Drug",
      "pluralName": "Generic Drugs",
      "comment": "Generic drug information including mechanism of action and classification",
      "fields": [
          {
              "name": "uid",
              "type": "string",
              "sqlType": "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Uid",
                  "controlType": "text",
                  "placeholder": "Enter uid"
              }
          },
          {
              "name": "generic_key",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": true,
              "isRequired": false,
              "ui": {
                  "visibility": "readonly",
                  "displayName": "Generic Key",
                  "controlType": "text",
                  "placeholder": "Enter generic key"
              }
          },
          {
              "name": "generic_name",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Generic Name",
                  "controlType": "text",
                  "placeholder": "Enter generic name"
              }
          },
          {
              "name": "biologic",
              "type": "string",
              "sqlType": "TEXT",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Biologic",
                  "controlType": "textarea",
                  "placeholder": "Enter biologic"
              }
          },
          {
              "name": "mech_of_action",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Mech Of Action",
                  "controlType": "text",
                  "placeholder": "Enter mech of action"
              }
          },
          {
              "name": "class_or_type",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Class Or Type",
                  "controlType": "text",
                  "placeholder": "Enter class or type"
              }
          },
          {
              "name": "target",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Target",
                  "controlType": "text",
                  "placeholder": "Enter target"
              }
          }
      ],
      "relationships": [
          {
              "type": "1-n",
              "targetEntity": "generic_aliases",
              "foreignKey": "generic_uid",
              "displayName": "Generic Aliases",
              "isCollection": true
          },
          {
              "type": "1-n",
              "targetEntity": "generic_routes",
              "foreignKey": "generic_uid",
              "displayName": "Generic Routes",
              "isCollection": true
          },
          {
              "type": "1-n",
              "targetEntity": "generic_approvals",
              "foreignKey": "generic_uid",
              "displayName": "Generic Approvals",
              "isCollection": true
          },
          {
              "type": "1-n",
              "targetEntity": "manu_drugs",
              "foreignKey": "generic_uid",
              "displayName": "Manu Drugs",
              "isCollection": true
          }
      ],
      "tabs": [
          {
              "id": "details",
              "displayName": "Details",
              "type": "properties",
              "fields": [
                  "uid",
                  "generic_name",
                  "biologic",
                  "mech_of_action",
                  "class_or_type",
                  "target"
              ]
          },
          {
              "id": "generic_aliases",
              "displayName": "Generic Aliases",
              "type": "collection",
              "collectionEntity": "generic_aliases"
          },
          {
              "id": "generic_routes",
              "displayName": "Generic Routes",
              "type": "collection",
              "collectionEntity": "generic_routes"
          },
          {
              "id": "generic_approvals",
              "displayName": "Generic Approvals",
              "type": "collection",
              "collectionEntity": "generic_approvals"
          },
          {
              "id": "manu_drugs",
              "displayName": "Manu Drugs",
              "type": "collection",
              "collectionEntity": "manu_drugs"
          }
      ]
  },
  generic_aliase:   {
      "name": "generic_aliase",
      "tableName": "generic_aliases",
      "displayName": "Generic Aliase",
      "pluralName": "Generic Aliases",
      "comment": "Alternative names and aliases for generic drugs",
      "fields": [
          {
              "name": "uid",
              "type": "string",
              "sqlType": "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Uid",
                  "controlType": "text",
                  "placeholder": "Enter uid"
              }
          },
          {
              "name": "generic_key",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": true,
              "isRequired": false,
              "ui": {
                  "visibility": "readonly",
                  "displayName": "Generic Key",
                  "controlType": "text",
                  "placeholder": "Enter generic key"
              }
          },
          {
              "name": "generic_uid",
              "type": "string",
              "sqlType": "UUID",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "readonly",
                  "displayName": "Generic Uid",
                  "controlType": "text",
                  "placeholder": "Enter generic uid"
              }
          },
          {
              "name": "alias",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Alias",
                  "controlType": "text",
                  "placeholder": "Enter alias"
              }
          }
      ],
      "relationships": [
          {
              "type": "1-n",
              "targetEntity": "generic_drugs",
              "foreignKey": "generic_uid",
              "displayName": "Generic Drugs",
              "isCollection": false
          }
      ],
      "tabs": [
          {
              "id": "details",
              "displayName": "Details",
              "type": "properties",
              "fields": [
                  "uid",
                  "alias"
              ]
          }
      ]
  },
  generic_route:   {
      "name": "generic_route",
      "tableName": "generic_routes",
      "displayName": "Generic Route",
      "pluralName": "Generic Routes",
      "comment": "Drug administration routes and dosing information",
      "fields": [
          {
              "name": "uid",
              "type": "string",
              "sqlType": "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Uid",
                  "controlType": "text",
                  "placeholder": "Enter uid"
              }
          },
          {
              "name": "route_key",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": true,
              "isRequired": false,
              "ui": {
                  "visibility": "readonly",
                  "displayName": "Route Key",
                  "controlType": "text",
                  "placeholder": "Enter route key"
              }
          },
          {
              "name": "generic_key",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": true,
              "isRequired": false,
              "ui": {
                  "visibility": "readonly",
                  "displayName": "Generic Key",
                  "controlType": "text",
                  "placeholder": "Enter generic key"
              }
          },
          {
              "name": "generic_uid",
              "type": "string",
              "sqlType": "UUID",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "readonly",
                  "displayName": "Generic Uid",
                  "controlType": "text",
                  "placeholder": "Enter generic uid"
              }
          },
          {
              "name": "route_type",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Route Type",
                  "controlType": "text",
                  "placeholder": "Enter route type"
              }
          },
          {
              "name": "load_measure",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Load Measure",
                  "controlType": "text",
                  "placeholder": "Enter load measure"
              }
          },
          {
              "name": "load_dose",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Load Dose",
                  "controlType": "text",
                  "placeholder": "Enter load dose"
              }
          },
          {
              "name": "load_measure_2",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Load Measure 2",
                  "controlType": "text",
                  "placeholder": "Enter load measure 2"
              }
          },
          {
              "name": "maintain_dose",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Maintain Dose",
                  "controlType": "text",
                  "placeholder": "Enter maintain dose"
              }
          },
          {
              "name": "maintain_measure",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Maintain Measure",
                  "controlType": "text",
                  "placeholder": "Enter maintain measure"
              }
          },
          {
              "name": "maintain_reg",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Maintain Reg",
                  "controlType": "text",
                  "placeholder": "Enter maintain reg"
              }
          },
          {
              "name": "montherapy",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Montherapy",
                  "controlType": "text",
                  "placeholder": "Enter montherapy"
              }
          },
          {
              "name": "half_life",
              "type": "string",
              "sqlType": "TEXT",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Half Life",
                  "controlType": "textarea",
                  "placeholder": "Enter half life"
              }
          }
      ],
      "relationships": [
          {
              "type": "1-n",
              "targetEntity": "generic_drugs",
              "foreignKey": "generic_uid",
              "displayName": "Generic Drugs",
              "isCollection": false
          }
      ],
      "tabs": [
          {
              "id": "details",
              "displayName": "Details",
              "type": "properties",
              "fields": [
                  "uid",
                  "route_type",
                  "load_measure",
                  "load_dose",
                  "load_measure_2",
                  "maintain_dose",
                  "maintain_measure",
                  "maintain_reg",
                  "montherapy",
                  "half_life"
              ]
          }
      ]
  },
  generic_approval:   {
      "name": "generic_approval",
      "tableName": "generic_approvals",
      "displayName": "Generic Approval",
      "pluralName": "Generic Approvals",
      "comment": "Drug approval information by country and route",
      "fields": [
          {
              "name": "uid",
              "type": "string",
              "sqlType": "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Uid",
                  "controlType": "text",
                  "placeholder": "Enter uid"
              }
          },
          {
              "name": "generic_key",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": true,
              "isRequired": false,
              "ui": {
                  "visibility": "readonly",
                  "displayName": "Generic Key",
                  "controlType": "text",
                  "placeholder": "Enter generic key"
              }
          },
          {
              "name": "generic_uid",
              "type": "string",
              "sqlType": "UUID",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "readonly",
                  "displayName": "Generic Uid",
                  "controlType": "text",
                  "placeholder": "Enter generic uid"
              }
          },
          {
              "name": "route_type",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Route Type",
                  "controlType": "text",
                  "placeholder": "Enter route type"
              }
          },
          {
              "name": "country",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Country",
                  "controlType": "text",
                  "placeholder": "Enter country"
              }
          },
          {
              "name": "indication",
              "type": "string",
              "sqlType": "TEXT",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Indication",
                  "controlType": "textarea",
                  "placeholder": "Enter indication"
              }
          },
          {
              "name": "populations",
              "type": "string",
              "sqlType": "TEXT",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Populations",
                  "controlType": "textarea",
                  "placeholder": "Enter populations"
              }
          },
          {
              "name": "approval_date",
              "type": "date",
              "sqlType": "DATE",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Approval Date",
                  "controlType": "date",
                  "placeholder": "Enter approval date"
              }
          },
          {
              "name": "discon_date",
              "type": "string",
              "sqlType": "TEXT",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Discon Date",
                  "controlType": "date",
                  "placeholder": "Enter discon date"
              }
          },
          {
              "name": "box_warning",
              "type": "string",
              "sqlType": "TEXT",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Box Warning",
                  "controlType": "textarea",
                  "placeholder": "Enter box warning"
              }
          },
          {
              "name": "box_warning_date",
              "type": "string",
              "sqlType": "TEXT",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Box Warning Date",
                  "controlType": "date",
                  "placeholder": "Enter box warning date"
              }
          }
      ],
      "relationships": [
          {
              "type": "1-n",
              "targetEntity": "generic_drugs",
              "foreignKey": "generic_uid",
              "displayName": "Generic Drugs",
              "isCollection": false
          }
      ],
      "tabs": [
          {
              "id": "details",
              "displayName": "Details",
              "type": "properties",
              "fields": [
                  "uid",
                  "route_type",
                  "country",
                  "indication",
                  "populations",
                  "approval_date",
                  "discon_date",
                  "box_warning",
                  "box_warning_date"
              ]
          }
      ]
  },
  manu_drug:   {
      "name": "manu_drug",
      "tableName": "manu_drugs",
      "displayName": "Manu Drug",
      "pluralName": "Manu Drugs",
      "comment": "Manufactured drug products including brand names and biosimilar information",
      "fields": [
          {
              "name": "uid",
              "type": "string",
              "sqlType": "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Uid",
                  "controlType": "text",
                  "placeholder": "Enter uid"
              }
          },
          {
              "name": "manu_drug_key",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": true,
              "isRequired": false,
              "ui": {
                  "visibility": "readonly",
                  "displayName": "Manu Drug Key",
                  "controlType": "text",
                  "placeholder": "Enter manu drug key"
              }
          },
          {
              "name": "generic_key",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": true,
              "isRequired": false,
              "ui": {
                  "visibility": "readonly",
                  "displayName": "Generic Key",
                  "controlType": "text",
                  "placeholder": "Enter generic key"
              }
          },
          {
              "name": "generic_uid",
              "type": "string",
              "sqlType": "UUID",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "readonly",
                  "displayName": "Generic Uid",
                  "controlType": "text",
                  "placeholder": "Enter generic uid"
              }
          },
          {
              "name": "drug_name",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Drug Name",
                  "controlType": "text",
                  "placeholder": "Enter drug name"
              }
          },
          {
              "name": "manufacturer",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Manufacturer",
                  "controlType": "text",
                  "placeholder": "Enter manufacturer"
              }
          },
          {
              "name": "brandkey",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Brandkey",
                  "controlType": "text",
                  "placeholder": "Enter brandkey"
              }
          },
          {
              "name": "biosimilar_suffix",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Biosimilar Suffix",
                  "controlType": "text",
                  "placeholder": "Enter biosimilar suffix"
              }
          },
          {
              "name": "biosimilar",
              "type": "number",
              "sqlType": "INTEGER",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Biosimilar",
                  "controlType": "checkbox",
                  "placeholder": "Enter biosimilar"
              }
          },
          {
              "name": "biosimilar_originator",
              "type": "string",
              "sqlType": "VARCHAR(255)",
              "isId": false,
              "isKey": false,
              "isRequired": false,
              "ui": {
                  "visibility": "visible",
                  "displayName": "Biosimilar Originator",
                  "controlType": "text",
                  "placeholder": "Enter biosimilar originator"
              }
          }
      ],
      "relationships": [
          {
              "type": "1-n",
              "targetEntity": "generic_drugs",
              "foreignKey": "generic_uid",
              "displayName": "Generic Drugs",
              "isCollection": false
          }
      ],
      "tabs": [
          {
              "id": "details",
              "displayName": "Details",
              "type": "properties",
              "fields": [
                  "uid",
                  "drug_name",
                  "manufacturer",
                  "brandkey",
                  "biosimilar_suffix",
                  "biosimilar",
                  "biosimilar_originator"
              ]
          }
      ]
  }
};
