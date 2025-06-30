import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { theDBModel } from '@/model_instances/TheDBModel';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createServerSupabaseClient();

    // Get exportable tables from the model
    const exportableTables = theDBModel.getExportableTables();
    
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Process each exportable table
    for (const table of exportableTables) {
      // Get exportable fields for this table
      const exportableFields = theDBModel.getExportableFields(table.name);
      const fieldNames = exportableFields.map(field => field.name);

      if (fieldNames.length === 0) {
        continue; // Skip tables with no exportable fields
      }

      // Query all data from the table
      const { data: tableData, error } = await supabase
        .from(table.name)
        .select('*');

      if (error) {
        console.error(`Error fetching data from ${table.name}:`, error);
        continue; // Skip this table if there's an error
      }

      if (!tableData || tableData.length === 0) {
        // Create empty sheet with headers
        const emptyData = [fieldNames];
        const worksheet = XLSX.utils.aoa_to_sheet(emptyData);
        XLSX.utils.book_append_sheet(workbook, worksheet, table.name);
        continue;
      }

      // Transform data to include only exportable fields
      const transformedData = tableData.map((row: any) => {
        const transformedRow: any = {};
        fieldNames.forEach(fieldName => {
          transformedRow[fieldName] = row[fieldName] || '';
        });
        return transformedRow;
      });

      // Create worksheet from the data
      const worksheet = XLSX.utils.json_to_sheet(transformedData);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, table.name);
    }

    // Generate the Excel file buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Create response with the Excel file
    const response = new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="drugbot_export.xlsx"',
      },
    });

    return response;

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate export file' },
      { status: 500 }
    );
  }
} 