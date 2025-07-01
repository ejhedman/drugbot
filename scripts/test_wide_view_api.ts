/**
 * Test script for the Generic Drugs Wide View API Integration
 * 
 * This script tests that the wide view aggregate can be properly accessed
 * through the model mapping system.
 */

import { getAggregateMapping, getEntityAggregateTypes } from '../src/model_instances/TheModelMap';
import { theUIModel } from '../src/model_instances/TheUIModel';

console.log('=== Testing Generic Drugs Wide View API Integration ===\n');

// Test 1: Verify the aggregate mapping is accessible
console.log('1. Testing Aggregate Mapping Access:');
const wideViewMapping = getAggregateMapping('GenericDrugsWideView');
if (wideViewMapping) {
  console.log('✅ Wide view aggregate mapping is accessible');
  console.log(`   - Aggregate type: ${wideViewMapping.aggregateType}`);
  console.log(`   - Table name: ${wideViewMapping.tableName}`);
  console.log(`   - Parent key field: ${wideViewMapping.parentKeyField}`);
  console.log(`   - Property mappings: ${wideViewMapping.propertyMappings.length}`);
} else {
  console.log('❌ Wide view aggregate mapping is NOT accessible');
}

// Test 2: Verify the aggregate is included in entity aggregate types
console.log('\n2. Testing Entity Aggregate Types:');
const aggregateTypes = getEntityAggregateTypes('GenericDrugs');
if (aggregateTypes.includes('GenericDrugsWideView')) {
  console.log('✅ Wide view aggregate is included in GenericDrugs entity aggregate types');
  console.log(`   - All aggregate types: ${aggregateTypes.join(', ')}`);
} else {
  console.log('❌ Wide view aggregate is NOT included in GenericDrugs entity aggregate types');
  console.log(`   - Current aggregate types: ${aggregateTypes.join(', ')}`);
}

// Test 3: Verify the aggregate is accessible through UI model
console.log('\n3. Testing UI Model Access:');
const wideViewAggregate = theUIModel.getAggregate('GenericDrugsWideView');
if (wideViewAggregate) {
  console.log('✅ Wide view aggregate is accessible through UI model');
  console.log(`   - Display name: ${wideViewAggregate.displayName}`);
  console.log(`   - Is table: ${wideViewAggregate.isTable}`);
  console.log(`   - Property count: ${wideViewAggregate.propertyDefs?.length || 0}`);
} else {
  console.log('❌ Wide view aggregate is NOT accessible through UI model');
}

// Test 4: Verify the aggregate is referenced in the entity
console.log('\n4. Testing Entity Reference:');
const genericDrugsEntity = theUIModel.getEntity('GenericDrugs');
if (genericDrugsEntity) {
  const wideViewRef = genericDrugsEntity.aggregateRefs?.find(ref => ref.aggregateType === 'GenericDrugsWideView');
  if (wideViewRef) {
    console.log('✅ Wide view aggregate is referenced in GenericDrugs entity');
    console.log(`   - Display name: ${wideViewRef.displayName}`);
    console.log(`   - Ordinal: ${wideViewRef.ordinal}`);
  } else {
    console.log('❌ Wide view aggregate is NOT referenced in GenericDrugs entity');
  }
} else {
  console.log('❌ GenericDrugs entity not found');
}

// Test 5: Test API endpoint simulation
console.log('\n5. Testing API Endpoint Simulation:');
if (wideViewMapping) {
  console.log('✅ API endpoint would work with these parameters:');
  console.log(`   - URL: /api/dynamic-aggregate?entityUid=<uid>&aggregateType=GenericDrugsWideView`);
  console.log(`   - Table: ${wideViewMapping.tableName}`);
  console.log(`   - Parent key field: ${wideViewMapping.parentKeyField}`);
  console.log(`   - Property mappings: ${wideViewMapping.propertyMappings.length} fields`);
} else {
  console.log('❌ API endpoint would fail - no aggregate mapping found');
}

console.log('\n=== Test Complete ==='); 