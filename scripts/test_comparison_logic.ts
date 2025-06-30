import * as XLSX from 'xlsx';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Test script to create an Excel file with existing and modified data to test comparison logic
 */

async function createTestComparisonFile() {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Create test data for generic_drugs table
    // Row 1: Existing data (should be marked as existing)
    // Row 2: Modified data (should be marked as new)
    // Row 3: New data (should be marked as new)
    const genericDrugsData = [
      ['row', 'generic_key', 'generic_name', 'biologic', 'mech_of_action', 'class_or_type', 'target'],
      [1, 'adalimumab', 'Adalimumab', 'Yes', 'TNF Blocker', 'Biologic', 'TNFi'], // Existing - should be false
      [2, 'adalimumab', 'Adalimumab Modified', 'Yes', 'TNF Blocker', 'Biologic', 'TNFi'], // Modified - should be true
      [3, 'test-new-drug', 'Test New Drug', 'No', 'Test Mechanism', 'Small Molecule', 'TestTarget'], // New - should be true
      [4, 'infliximab', 'Infliximab', 'Yes', 'TNF Blocker', 'Biologic', 'TNFi'], // Existing - should be false
      [5, 'infliximab', 'Infliximab', 'No', 'TNF Blocker', 'Biologic', 'TNFi'], // Modified (biologic changed) - should be true
    ];
    
    // Create test data for generic_aliases table
    const genericAliasesData = [
      ['row', 'generic_key', 'alias'],
      [1, 'adalimumab', 'Humira'], // Existing - should be false
      [2, 'adalimumab', 'Humira Modified'], // Modified - should be true
      [3, 'test-new-alias', 'Test New Alias'], // New - should be true
    ];
    
    // Create worksheets
    const genericDrugsSheet = XLSX.utils.aoa_to_sheet(genericDrugsData);
    const genericAliasesSheet = XLSX.utils.aoa_to_sheet(genericAliasesData);
    
    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(workbook, genericDrugsSheet, 'generic_drugs');
    XLSX.utils.book_append_sheet(workbook, genericAliasesSheet, 'generic_aliases');
    
    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // Save the Excel file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const testFileName = `test_comparison_${timestamp}.xlsx`;
    const filePath = join(uploadsDir, testFileName);
    
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    await writeFile(filePath, excelBuffer);
    
    console.log(`Test comparison Excel file created: ${filePath}`);
    console.log('');
    console.log('Test Data Summary:');
    console.log('');
    console.log('generic_drugs worksheet:');
    console.log('- Row 1: adalimumab (existing data) - should be marked as existing (false)');
    console.log('- Row 2: adalimumab with modified name - should be marked as new (true)');
    console.log('- Row 3: test-new-drug (completely new) - should be marked as new (true)');
    console.log('- Row 4: infliximab (existing data) - should be marked as existing (false)');
    console.log('- Row 5: infliximab with modified biologic field - should be marked as new (true)');
    console.log('');
    console.log('generic_aliases worksheet:');
    console.log('- Row 1: adalimumab -> Humira (existing data) - should be marked as existing (false)');
    console.log('- Row 2: adalimumab -> Humira Modified (modified alias) - should be marked as new (true)');
    console.log('- Row 3: test-new-alias (completely new) - should be marked as new (true)');
    console.log('');
    console.log('Expected Results:');
    console.log('- generic_drugs: 2 existing, 3 new');
    console.log('- generic_aliases: 1 existing, 2 new');
    console.log('');
    console.log('Upload this file through the web interface to test the comparison logic.');
    
  } catch (error) {
    console.error('Error creating test comparison file:', error);
  }
}

// Run the test
createTestComparisonFile(); 