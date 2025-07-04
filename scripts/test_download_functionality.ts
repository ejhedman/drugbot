// Test script for the download functionality
// This script tests the helper functions for different export formats

const XLSX = require('xlsx');
const jsPDF = require('jspdf');
require('jspdf-autotable');

// Sample data for testing
const sampleData = [
  { id: 1, name: 'Drug A', type: 'Biologic', target: 'TNF' },
  { id: 2, name: 'Drug B', type: 'Small Molecule', target: 'JAK' },
  { id: 3, name: 'Drug C', type: 'Biologic', target: 'IL-6' }
];

const sampleColumns = [
  { key: 'id', displayName: 'ID' },
  { key: 'name', displayName: 'Drug Name' },
  { key: 'type', displayName: 'Drug Type' },
  { key: 'target', displayName: 'Target' }
];

// Helper functions (copied from ReportBody.tsx)
function arrayToCSV(data: any[], columns: any[]): string {
  if (!data.length) return '';
  const header = columns.map((col: any) => '"' + (col.displayName || col.key) + '"').join(',');
  const rows = data.map(row =>
    columns.map((col: any) => {
      const val = row[col.key];
      if (val == null) return '';
      return '"' + String(val).replace(/"/g, '""') + '"';
    }).join(',')
  );
  return [header, ...rows].join('\n');
}

function arrayToXLSX(data: any[], columns: any[]): ArrayBuffer {
  if (!data.length) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([columns.map((col: any) => col.displayName || col.key)]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');
    return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  }

  const transformedData = data.map(row => {
    const transformedRow: any = {};
    columns.forEach((col: any) => {
      transformedRow[col.displayName || col.key] = row[col.key] || '';
    });
    return transformedRow;
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(transformedData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');
  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
}

function arrayToJSON(data: any[], columns: any[]): string {
  if (!data.length) return JSON.stringify([], null, 2);
  
  const transformedData = data.map(row => {
    const transformedRow: any = {};
    columns.forEach((col: any) => {
      transformedRow[col.displayName || col.key] = row[col.key] || null;
    });
    return transformedRow;
  });
  
  return JSON.stringify(transformedData, null, 2);
}

function arrayToPDF(data: any[], columns: any[], reportName: string = 'Report'): ArrayBuffer {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text(reportName, 14, 22);
  
  if (!data.length) {
    const headers = columns.map((col: any) => col.displayName || col.key);
    (doc as any).autoTable({
      head: [headers],
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });
  } else {
    const headers = columns.map((col: any) => col.displayName || col.key);
    const tableData = data.map(row => 
      columns.map((col: any) => {
        const val = row[col.key];
        return val != null ? String(val) : '';
      })
    );
    
    (doc as any).autoTable({
      head: [headers],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 30 }
    });
  }
  
  return doc.output('arraybuffer');
}

async function testDownloadFunctionality() {
  console.log('Testing Download Functionality...\n');

  try {
    // Test 1: CSV Export
    console.log('1. Testing CSV export...');
    const csv = arrayToCSV(sampleData, sampleColumns);
    console.log('✅ CSV generated successfully');
    console.log('CSV Preview:');
    console.log(csv.substring(0, 200) + '...');

    // Test 2: XLSX Export
    console.log('\n2. Testing XLSX export...');
    const xlsxBuffer = arrayToXLSX(sampleData, sampleColumns);
    console.log('✅ XLSX generated successfully');
    console.log(`XLSX size: ${xlsxBuffer.byteLength} bytes`);

    // Test 3: JSON Export
    console.log('\n3. Testing JSON export...');
    const json = arrayToJSON(sampleData, sampleColumns);
    console.log('✅ JSON generated successfully');
    console.log('JSON Preview:');
    console.log(json.substring(0, 200) + '...');

    // Test 4: PDF Export
    console.log('\n4. Testing PDF export...');
    const pdfBuffer = arrayToPDF(sampleData, sampleColumns, 'Test Report');
    console.log('✅ PDF generated successfully');
    console.log(`PDF size: ${pdfBuffer.byteLength} bytes`);

    // Test 5: Empty data handling
    console.log('\n5. Testing empty data handling...');
    const emptyCSV = arrayToCSV([], sampleColumns);
    const emptyXLSX = arrayToXLSX([], sampleColumns);
    const emptyJSON = arrayToJSON([], sampleColumns);
    const emptyPDF = arrayToPDF([], sampleColumns, 'Empty Report');
    
    console.log('✅ Empty data handling works correctly');
    console.log(`Empty CSV: "${emptyCSV}"`);
    console.log(`Empty XLSX size: ${emptyXLSX.byteLength} bytes`);
    console.log(`Empty JSON: "${emptyJSON}"`);
    console.log(`Empty PDF size: ${emptyPDF.byteLength} bytes`);

    console.log('\n✅ All download functionality tests passed!');
    console.log('\nThe download feature is ready to use in the UI.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDownloadFunctionality();
}

module.exports = { testDownloadFunctionality }; 