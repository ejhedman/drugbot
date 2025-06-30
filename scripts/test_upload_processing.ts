import * as XLSX from 'xlsx';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Test script to create a sample Excel file and verify the upload processing functionality
 */

async function createTestExcelFile() {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Create sample data for generic_drugs table
    const genericDrugsData = [
      ['row', 'generic_key', 'generic_name', 'biologic', 'mech_of_action', 'class_or_type', 'target'],
      [1, 'test1', 'Test Drug 1', 'Yes', 'TNF Blocker', 'Biologic', 'TNFi'],
      [2, 'test2', 'Test Drug 2', 'No', 'JAK inhibitor', 'Small molecule', 'JAKi'],
      [3, 'test3', 'Test Drug 3', 'Yes', 'IL-6 Blocker', 'Biologic', 'IL6i']
    ];
    
    // Create sample data for generic_aliases table
    const genericAliasesData = [
      ['row', 'generic_key', 'alias'],
      [1, 'test1', 'Test Alias 1'],
      [2, 'test2', 'Test Alias 2'],
      [3, 'test3', 'Test Alias 3']
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
    const testFileName = `test_upload_${timestamp}.xlsx`;
    const filePath = join(uploadsDir, testFileName);
    
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    await writeFile(filePath, excelBuffer);
    
    console.log(`Test Excel file created: ${filePath}`);
    console.log('Worksheets:');
    console.log('- generic_drugs (3 data rows)');
    console.log('- generic_aliases (3 data rows)');
    console.log('');
    console.log('You can now test the upload functionality by uploading this file through the web interface.');
    
  } catch (error) {
    console.error('Error creating test Excel file:', error);
  }
}

// Run the test
createTestExcelFile(); 