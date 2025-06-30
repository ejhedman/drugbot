import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import * as XLSX from 'xlsx';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { theDBModel } from '@/model_instances/TheDBModel';

interface ProcessingResult {
  worksheetName: string;
  csvPath: string;
  totalRows: number;
  newRows: number;
  existingRows: number;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Only Excel files (.xlsx or .xls) are allowed' },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const originalName = file.name.replace(/\.(xlsx|xls)$/i, '');
    const extension = fileName.endsWith('.xlsx') ? '.xlsx' : '.xls';
    const uniqueFileName = `${originalName}_${timestamp}${extension}`;
    
    // Save original file to uploads directory
    const filePath = join(uploadsDir, uniqueFileName);
    await writeFile(filePath, buffer);

    // Create timestamped subfolder for processed files
    const processedDir = join(uploadsDir, timestamp);
    await mkdir(processedDir, { recursive: true });

    // Process the Excel file
    const processingResults = await processExcelFile(buffer, processedDir);

    return NextResponse.json({
      message: 'File uploaded and processed successfully',
      fileName: uniqueFileName,
      originalName: file.name,
      size: file.size,
      processedFiles: processingResults,
      timestamp: timestamp
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload and process file' },
      { status: 500 }
    );
  }
}

async function processExcelFile(buffer: Buffer, outputDir: string): Promise<ProcessingResult[]> {
  const results: ProcessingResult[] = [];
  
  try {
    // Read the Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // Get all worksheet names
    const worksheetNames = workbook.SheetNames;
    
    // Create Supabase client for database queries
    const supabase = await createServerSupabaseClient();
    
    // Process each worksheet
    for (const sheetName of worksheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert worksheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        continue; // Skip empty worksheets
      }
      
      // Get headers (first row)
      const headers = jsonData[0] as string[];
      const dataRows = jsonData.slice(1) as any[][];
      
      // Find matching database table
      const matchingTable = findMatchingTable(sheetName, headers);
      
      if (!matchingTable) {
        console.warn(`No matching table found for worksheet: ${sheetName}`);
        continue;
      }
      
      // Compare data with database and add "new" column
      const processedData = await compareWithDatabase(
        dataRows, 
        headers, 
        matchingTable, 
        supabase
      );
      
      // Create CSV content with "new" column
      const csvContent = createCSVContent(processedData, headers);
      
      // Save CSV file
      const csvFileName = `${sheetName}.csv`;
      const csvPath = join(outputDir, csvFileName);
      await writeFile(csvPath, csvContent, 'utf8');
      
      // Calculate statistics
      const totalRows = processedData.length;
      const newRows = processedData.filter(row => row.new === 'true').length;
      const existingRows = totalRows - newRows;
      
      results.push({
        worksheetName: sheetName,
        csvPath: csvPath,
        totalRows,
        newRows,
        existingRows
      });
    }
    
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw error;
  }
  
  return results;
}

function findMatchingTable(sheetName: string, headers: string[]): string | null {
  // Get all exportable tables from the model
  const exportableTables = theDBModel.getExportableTables();
  
  // Try to match by sheet name first
  const tableByName = exportableTables.find(table => 
    table.name.toLowerCase() === sheetName.toLowerCase()
  );
  
  if (tableByName) {
    return tableByName.name;
  }
  
  // Try to match by header similarity
  for (const table of exportableTables) {
    const exportableFields = theDBModel.getExportableFields(table.name);
    const fieldNames = exportableFields.map(field => field.name);
    
    // Check if most headers match the table fields
    const matchingHeaders = headers.filter(header => 
      fieldNames.some(fieldName => 
        fieldName.toLowerCase() === header.toLowerCase()
      )
    );
    
    // If more than 50% of headers match, consider it a match
    if (matchingHeaders.length >= Math.max(1, headers.length * 0.5)) {
      return table.name;
    }
  }
  
  return null;
}

async function compareWithDatabase(
  dataRows: any[][], 
  headers: string[], 
  tableName: string, 
  supabase: any
): Promise<any[]> {
  const processedRows: any[] = [];
  
  // Get exportable fields for the table
  const exportableFields = theDBModel.getExportableFields(tableName);
  const fieldNames = exportableFields.map(field => field.name);
  
  // Get primary key fields for finding matching rows
  const primaryKeyFields = theDBModel.getPrimaryKeyFields(tableName);
  const primaryKeyFieldNames = primaryKeyFields.map(field => field.name);
  
  // Fetch existing data from database
  const { data: existingData, error } = await supabase
    .from(tableName)
    .select('*');
  
  if (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    // If we can't fetch existing data, mark all rows as new
    return dataRows.map(row => {
      const rowData: any = { new: 'true' };
      headers.forEach((header, index) => {
        rowData[header] = row[index] || '';
      });
      return rowData;
    });
  }
  
  // Process each row
  for (const row of dataRows) {
    const rowData: any = {};
    
    // Add all headers to rowData
    headers.forEach((header, index) => {
      rowData[header] = row[index] || '';
    });
    
    // Find the best matching row in the database
    let bestMatch: any = null;
    let bestMatchScore = 0;
    
    for (const existingRow of existingData) {
      let matchScore = 0;
      let totalComparableFields = 0;
      
      // Compare each field that exists in both the upload and database
      for (const header of headers) {
        const headerIndex = headers.indexOf(header);
        const uploadValue = row[headerIndex];
        
        // Find corresponding database field
        const dbField = fieldNames.find(fieldName => 
          fieldName.toLowerCase() === header.toLowerCase()
        );
        
        if (dbField && existingRow[dbField] !== undefined) {
          totalComparableFields++;
          const existingValue = existingRow[dbField];
          
          // Normalize values for comparison
          const normalizedUpload = String(uploadValue || '').toLowerCase().trim();
          const normalizedExisting = String(existingValue || '').toLowerCase().trim();
          
          if (normalizedUpload === normalizedExisting) {
            matchScore++;
          }
        }
      }
      
      // Calculate match percentage
      const matchPercentage = totalComparableFields > 0 ? matchScore / totalComparableFields : 0;
      
      // If this is a better match, update bestMatch
      if (matchPercentage > bestMatchScore) {
        bestMatchScore = matchPercentage;
        bestMatch = existingRow;
      }
    }
    
    // Determine if this row is new or existing
    // If we have a very good match (90%+ of fields match), consider it existing
    // Otherwise, mark it as new
    const isExisting = bestMatchScore >= 0.9 && bestMatch !== null;
    
    // If it's marked as existing, double-check by comparing all values
    if (isExisting && bestMatch) {
      let hasDifferences = false;
      
      for (const header of headers) {
        const headerIndex = headers.indexOf(header);
        const uploadValue = row[headerIndex];
        
        // Find corresponding database field
        const dbField = fieldNames.find(fieldName => 
          fieldName.toLowerCase() === header.toLowerCase()
        );
        
        if (dbField && bestMatch[dbField] !== undefined) {
          const existingValue = bestMatch[dbField];
          
          // Normalize values for comparison
          const normalizedUpload = String(uploadValue || '').toLowerCase().trim();
          const normalizedExisting = String(existingValue || '').toLowerCase().trim();
          
          if (normalizedUpload !== normalizedExisting) {
            hasDifferences = true;
            break; // Found a difference, no need to check further
          }
        }
      }
      
      // If there are any differences, mark as new
      if (hasDifferences) {
        rowData.new = 'true';
      } else {
        rowData.new = 'false';
      }
    } else {
      // No good match found, mark as new
      rowData.new = 'true';
    }
    
    processedRows.push(rowData);
  }
  
  return processedRows;
}

function createCSVContent(data: any[], headers: string[]): string {
  // Add "new" column to headers
  const allHeaders = ['new', ...headers];
  
  // Create CSV header row
  const csvRows = [allHeaders.join(',')];
  
  // Add data rows
  for (const row of data) {
    const csvRow = allHeaders.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes in CSV
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(csvRow.join(','));
  }
  
  return csvRows.join('\n');
} 