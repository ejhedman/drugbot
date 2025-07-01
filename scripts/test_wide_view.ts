/**
 * Test script for the Generic Drugs Wide View
 * 
 * This script tests the integration of the wide view with the model system
 * to ensure everything is working correctly.
 */

import { theDBModel, theUIModel, drugBotModelMap } from '../src/model_instances';

console.log('=== Testing Generic Drugs Wide View Integration ===\n');

// Test 1: Verify the wide view table is in the DB model
console.log('1. Testing DB Model Integration:');
const wideViewTable = theDBModel.getTable('generic_drugs_wide_view');
if (wideViewTable) {
  console.log('✅ Wide view table found in DB model');
  console.log(`   - Table name: ${wideViewTable.name}`);
  console.log(`   - Description: ${wideViewTable.description}`);
  console.log(`   - Field count: ${wideViewTable.fields.length}`);
  console.log(`   - For export: ${wideViewTable.forExport}`);
} else {
  console.log('❌ Wide view table NOT found in DB model');
}

// Test 2: Verify the wide view aggregate is in the UI model
console.log('\n2. Testing UI Model Integration:');
const wideViewAggregate = theUIModel.getAggregate('GenericDrugsWideView');
if (wideViewAggregate) {
  console.log('✅ Wide view aggregate found in UI model');
  console.log(`   - Aggregate type: ${wideViewAggregate.aggregateType}`);
  console.log(`   - Display name: ${wideViewAggregate.displayName}`);
  console.log(`   - Is table: ${wideViewAggregate.isTable}`);
  console.log(`   - Property count: ${wideViewAggregate.propertyDefs?.length || 0}`);
} else {
  console.log('❌ Wide view aggregate NOT found in UI model');
}

// Test 3: Verify the wide view aggregate is referenced in GenericDrugs entity
console.log('\n3. Testing Entity Integration:');
const genericDrugsEntity = theUIModel.getEntity('GenericDrugs');
if (genericDrugsEntity) {
  const wideViewRef = genericDrugsEntity.aggregateRefs?.find(ref => ref.aggregateType === 'GenericDrugsWideView');
  if (wideViewRef) {
    console.log('✅ Wide view aggregate referenced in GenericDrugs entity');
    console.log(`   - Display name: ${wideViewRef.displayName}`);
    console.log(`   - Ordinal: ${wideViewRef.ordinal}`);
  } else {
    console.log('❌ Wide view aggregate NOT referenced in GenericDrugs entity');
  }
} else {
  console.log('❌ GenericDrugs entity NOT found');
}

// Test 4: Verify the wide view mapping is in the model map
console.log('\n4. Testing Model Map Integration:');
const wideViewMapping = drugBotModelMap.aggregateMappings['GenericDrugsWideView'];
if (wideViewMapping) {
  console.log('✅ Wide view mapping found in model map');
  console.log(`   - Aggregate type: ${wideViewMapping.aggregateType}`);
  console.log(`   - Table name: ${wideViewMapping.tableName}`);
  console.log(`   - Parent key field: ${wideViewMapping.parentKeyField}`);
  console.log(`   - Property mapping count: ${wideViewMapping.propertyMappings.length}`);
} else {
  console.log('❌ Wide view mapping NOT found in model map');
}

// Test 5: Verify field mapping consistency
console.log('\n5. Testing Field Mapping Consistency:');
if (wideViewTable && wideViewAggregate && wideViewMapping) {
  const dbFieldNames = wideViewTable.fields.map(f => f.name).sort();
  const uiPropertyNames = wideViewAggregate.propertyDefs?.map(p => p.propertyName).sort() || [];
  const mappedFieldNames = wideViewMapping.propertyMappings.map(m => m.fieldName).sort();
  
  console.log(`   - DB fields: ${dbFieldNames.length}`);
  console.log(`   - UI properties: ${uiPropertyNames.length}`);
  console.log(`   - Mapped fields: ${mappedFieldNames.length}`);
  
  // Check if all UI properties have corresponding DB fields
  const missingFields = uiPropertyNames.filter(prop => !dbFieldNames.includes(prop));
  if (missingFields.length === 0) {
    console.log('✅ All UI properties have corresponding DB fields');
  } else {
    console.log(`❌ Missing DB fields for UI properties: ${missingFields.join(', ')}`);
  }
  
  // Check if all mapped fields exist in DB
  const invalidMappings = mappedFieldNames.filter(field => !dbFieldNames.includes(field));
  if (invalidMappings.length === 0) {
    console.log('✅ All mapped fields exist in DB table');
  } else {
    console.log(`❌ Invalid field mappings: ${invalidMappings.join(', ')}`);
  }
}

// Test 6: List all fields in the wide view
console.log('\n6. Wide View Field Summary:');
if (wideViewTable) {
  console.log('Fields in generic_drugs_wide_view:');
  wideViewTable.fields.forEach((field, index) => {
    console.log(`   ${index + 1}. ${field.name} (${field.datatype})`);
  });
}

console.log('\n=== Test Complete ==='); 