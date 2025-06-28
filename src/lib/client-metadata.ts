// // Generated client metadata - 2025-06-27T16:35:44.254Z
// // This file contains UI metadata for the browser

// export const CLIENT_METADATA = {
//   "entities": {
//     "generic_drugs": {
//       "displayName": "Generic Drug",
//       "pluralName": "Generic Drugs",
//       "fields": {
//         "generic_name": {
//           "displayName": "Generic Name",
//           "controlType": "text",
//           "visibility": "visible",
//           "placeholder": "Enter generic drug name",
//           "isRequired": true
//         },
//         "biologic": {
//           "displayName": "Biologic Classification",
//           "controlType": "textarea",
//           "visibility": "visible",
//           "placeholder": "Enter biologic information"
//         },
//         "mech_of_action": {
//           "displayName": "Mechanism of Action",
//           "controlType": "text",
//           "visibility": "visible",
//           "placeholder": "Enter mechanism of action"
//         }
//       },
//       "tabs": [
//         {
//           "id": "details",
//           "displayName": "Details",
//           "type": "properties"
//         },
//         {
//           "id": "aliases",
//           "displayName": "Aliases",
//           "type": "collection"
//         },
//         {
//           "id": "routes",
//           "displayName": "Routes & Dosing",
//           "type": "collection"
//         },
//         {
//           "id": "approvals",
//           "displayName": "Approvals",
//           "type": "collection"
//         },
//         {
//           "id": "products",
//           "displayName": "Manufactured Products",
//           "type": "collection"
//         }
//       ]
//     },
//     "generic_aliases": {
//       "displayName": "Generic Alias",
//       "pluralName": "Generic Aliases",
//       "fields": {
//         "alias": {
//           "displayName": "Alias Name",
//           "controlType": "text",
//           "visibility": "visible",
//           "placeholder": "Enter alternative name",
//           "isRequired": true
//         }
//       },
//       "tabs": [
//         {
//           "id": "details",
//           "displayName": "Details",
//           "type": "properties"
//         }
//       ]
//     },
//     "generic_routes": {
//       "displayName": "Drug Route & Dosing",
//       "pluralName": "Drug Routes & Dosing",
//       "fields": {
//         "route_type": {
//           "displayName": "Route Type",
//           "controlType": "select",
//           "visibility": "visible",
//           "placeholder": "Select administration route",
//           "enumValues": [
//             "Subcutaneous",
//             "Intravenous",
//             "Oral"
//           ]
//         },
//         "load_dose": {
//           "displayName": "Loading Dose",
//           "controlType": "text",
//           "visibility": "visible",
//           "placeholder": "Enter loading dose"
//         },
//         "maintain_dose": {
//           "displayName": "Maintenance Dose",
//           "controlType": "text",
//           "visibility": "visible",
//           "placeholder": "Enter maintenance dose"
//         }
//       },
//       "tabs": [
//         {
//           "id": "details",
//           "displayName": "Details",
//           "type": "properties"
//         }
//       ]
//     },
//     "generic_approvals": {
//       "displayName": "Drug Approval",
//       "pluralName": "Drug Approvals",
//       "fields": {
//         "country": {
//           "displayName": "Country",
//           "controlType": "select",
//           "visibility": "visible",
//           "placeholder": "Select country",
//           "enumValues": [
//             "USA",
//             "CAN",
//             "FRA",
//             "UK"
//           ]
//         },
//         "indication": {
//           "displayName": "Indication",
//           "controlType": "textarea",
//           "visibility": "visible",
//           "placeholder": "Enter medical indication"
//         },
//         "approval_date": {
//           "displayName": "Approval Date",
//           "controlType": "date",
//           "visibility": "visible",
//           "placeholder": "Select approval date"
//         }
//       },
//       "tabs": [
//         {
//           "id": "details",
//           "displayName": "Details",
//           "type": "properties"
//         }
//       ]
//     },
//     "manu_drugs": {
//       "displayName": "Manufactured Drug",
//       "pluralName": "Manufactured Drugs",
//       "fields": {
//         "drug_name": {
//           "displayName": "Brand Name",
//           "controlType": "text",
//           "visibility": "visible",
//           "placeholder": "Enter brand name",
//           "isRequired": true
//         },
//         "manufacturer": {
//           "displayName": "Manufacturer",
//           "controlType": "text",
//           "visibility": "visible",
//           "placeholder": "Enter manufacturer name"
//         },
//         "biosimilar": {
//           "displayName": "Biosimilar",
//           "controlType": "checkbox",
//           "visibility": "visible"
//         }
//       },
//       "tabs": [
//         {
//           "id": "details",
//           "displayName": "Details",
//           "type": "properties"
//         }
//       ]
//     }
//   }
// };

// export function getEntityMetadata(entityName: string) {
//   return CLIENT_METADATA.entities[entityName as keyof typeof CLIENT_METADATA.entities];
// }

// export function getFieldMetadata(entityName: string, fieldName: string) {
//   const entity = getEntityMetadata(entityName);
//   return entity?.properties[fieldName as keyof typeof entity.properties];
// }

// export function getEntityTabs(entityName: string) {
//   const entity = getEntityMetadata(entityName);
//   return entity?.tabs || [];
// }
