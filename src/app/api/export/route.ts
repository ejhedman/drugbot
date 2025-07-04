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

      // Fetch all data from the table using pagination
      const allTableData = await fetchAllTableData(supabase, table.name);

      if (allTableData.length === 0) {
        // Create empty sheet with headers
        const emptyData = [fieldNames];
        const worksheet = XLSX.utils.aoa_to_sheet(emptyData);
        XLSX.utils.book_append_sheet(workbook, worksheet, table.name);
        continue;
      }

      // Transform data to include only exportable fields
      const transformedData = allTableData.map((row: any) => {
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

/**
 * Fetch all data from a table using pagination to handle large datasets
 * @param supabase - Supabase client
 * @param tableName - Name of the table to fetch data from
 * @returns Promise<any[]> - All data from the table
 */
async function fetchAllTableData(supabase: any, tableName: string): Promise<any[]> {
  const allData: any[] = [];
  const pageSize = 1000; // Supabase default limit
  let from = 0;
  let hasMore = true;

  // console.log(`Fetching all data from table: ${tableName}`);

  while (hasMore) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .range(from, from + pageSize - 1);

      if (error) {
        console.error(`Error fetching data from ${tableName} (range ${from}-${from + pageSize - 1}):`, error);
        break;
      }

      if (!data || data.length === 0) {
        hasMore = false;
        break;
      }

      // Add the fetched data to our collection
      allData.push(...data);
      // console.log(`Fetched ${data.length} rows from ${tableName} (total so far: ${allData.length})`);

      // Check if we've fetched all data
      if (count !== null && allData.length >= count) {
        hasMore = false;
        // console.log(`Completed fetching all ${count} rows from ${tableName}`);
      } else if (data.length < pageSize) {
        // If we got fewer rows than requested, we've reached the end
        hasMore = false;
        // console.log(`Reached end of data for ${tableName} (fetched ${allData.length} total rows)`);
      } else {
        // Move to next page
        from += pageSize;
      }
    } catch (error) {
      console.error(`Unexpected error fetching data from ${tableName}:`, error);
      break;
    }
  }

  // console.log(`Total rows fetched from ${tableName}: ${allData.length}`);
  return allData;
} 