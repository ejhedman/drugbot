import { theUIModel } from '../src/model_instances/TheUIModel';

console.log('Testing new form controlType enforcement...\n');

// Test 1: Check UIEntity schemas for controlType definitions
console.log('=== UIEntity Schemas with controlType ===');
const entitySchemas = ['generic_drugs', 'manufacturer_drugs', 'generic_aliases', 'generic_routes', 'generic_approvals'];

entitySchemas.forEach(schemaName => {
  const schema = theUIModel.getEntity(schemaName);
  if (schema && schema.propertyDefs) {
    console.log(`\n${schemaName}:`);
    schema.propertyDefs.forEach(prop => {
      if (prop.controlType) {
        console.log(`  ${prop.propertyName}: ${prop.controlType}${prop.selectValues ? ` (${prop.selectValues.join(', ')})` : ''}`);
      }
    });
  }
});

// Test 2: Check UIAggregate schemas for controlType definitions
console.log('\n=== UIAggregate Schemas with controlType ===');
const aggregateSchemas = ['GenericAlias', 'GenericRoute', 'GenericApproval', 'GenericManuDrugs'];

aggregateSchemas.forEach(schemaName => {
  const schema = theUIModel.getAggregate(schemaName);
  if (schema && schema.propertyDefs) {
    console.log(`\n${schemaName}:`);
    schema.propertyDefs.forEach(prop => {
      if (prop.controlType) {
        console.log(`  ${prop.propertyName}: ${prop.controlType}${prop.selectValues ? ` (${prop.selectValues.join(', ')})` : ''}`);
      }
    });
  }
});

// Test 3: Test controlType detection functions
console.log('\n=== Testing controlType detection ===');

const testFields = [
  'route_type',
  'country', 
  'is_active',
  'approval_date',
  'dosage_strength',
  'generic_name'
];

testFields.forEach(fieldName => {
  // Simulate the getControlType function logic
  let controlType = 'text'; // default
  let selectValues: string[] = [];
  
  // Check in entity schemas
  for (const schemaName of entitySchemas) {
    const schema = theUIModel.getEntity(schemaName);
    if (schema?.propertyDefs) {
      const prop = schema.propertyDefs.find(p => p.propertyName === fieldName);
      if (prop?.controlType) {
        controlType = prop.controlType;
        selectValues = prop.selectValues || [];
        break;
      }
    }
  }
  
  // Check in aggregate schemas if not found
  if (controlType === 'text') {
    for (const schemaName of aggregateSchemas) {
      const schema = theUIModel.getAggregate(schemaName);
      if (schema?.propertyDefs) {
        const prop = schema.propertyDefs.find(p => p.propertyName === fieldName);
        if (prop?.controlType) {
          controlType = prop.controlType;
          selectValues = prop.selectValues || [];
          break;
        }
      }
    }
  }
  
  console.log(`${fieldName}: ${controlType}${selectValues.length > 0 ? ` (${selectValues.join(', ')})` : ''}`);
});

console.log('\n=== Expected Behavior ===');
console.log('1. TabTable "new" form should render:');
console.log('   - Checkboxes for boolean fields (is_active)');
console.log('   - Dropdowns for select fields (route_type, country)');
console.log('   - Date pickers for date fields (approval_date)');
console.log('   - Number inputs for numeric fields (dosage_strength)');
console.log('   - Text inputs for text fields (generic_name)');

console.log('\n2. FormCard should render:');
console.log('   - Same control types as TabTable based on schema definitions');
console.log('   - Validation with red borders for invalid values');
console.log('   - Proper placeholder text and required field handling');

console.log('\nTest completed!'); 