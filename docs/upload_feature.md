# Enhanced Upload Feature

## Overview

The upload feature has been enhanced to process Excel files and compare them with existing database data. When you upload an Excel file, the system will:

1. Extract each worksheet/tab into a separate CSV file
2. Add a "new" column to each CSV file
3. Compare each row with existing database data
4. Mark rows as "new" (true) or "existing" (false)

## How It Works

### 1. File Upload
- Upload Excel files (.xlsx or .xls) through the web interface
- Files are saved to the `uploads/` directory with a timestamp

### 2. Processing
- Each worksheet in the Excel file is processed separately
- The system attempts to match worksheets to database tables by:
  - Exact name match (e.g., "generic_drugs" worksheet → `generic_drugs` table)
  - Header similarity (if 50%+ of headers match table fields)

### 3. Database Comparison
- For each worksheet, the system fetches existing data from the matching database table
- Compares rows using primary key fields (or all exportable fields if no primary key)
- Case-insensitive string comparison for matching

### 4. CSV Generation
- Creates a timestamped subfolder under `uploads/` (e.g., `uploads/2025-06-30T19-19-19-004Z/`)
- Saves each worksheet as a CSV file named after the worksheet
- Adds a "new" column as the first column with values "true" or "false"

## File Structure

```
uploads/
├── original_file_2025-06-30T19-19-19-004Z.xlsx
└── 2025-06-30T19-19-19-004Z/
    ├── generic_drugs.csv
    ├── generic_aliases.csv
    └── generic_routes.csv
```

## CSV Format

Each generated CSV file includes:
- `new` column (first column) - "true" for new rows, "false" for existing rows
- All original columns from the Excel worksheet
- Proper CSV escaping for commas, quotes, and newlines

Example:
```csv
new,row,generic_key,generic_name,biologic,mech_of_action,class_or_type,target
true,1,test1,Test Drug 1,Yes,TNF Blocker,Biologic,TNFi
false,2,existing,Existing Drug,No,JAK inhibitor,Small molecule,JAKi
```

## Supported Database Tables

The system can process worksheets that match these database tables:
- `generic_drugs` - Generic drug information
- `generic_aliases` - Drug aliases and alternative names
- `generic_routes` - Drug administration routes
- `generic_approvals` - Drug approval information
- `manu_drugs` - Manufactured drug products

## User Interface

After uploading a file, you'll see:
- Success message with file count
- Processing results for each worksheet:
  - Worksheet name
  - Total rows processed
  - Number of new rows (green)
  - Number of existing rows (blue)
  - CSV filename

## Error Handling

- Worksheets that don't match any database table are skipped
- Database connection errors result in all rows being marked as "new"
- Invalid Excel files show appropriate error messages

## Testing

Use the test script to create sample Excel files:
```bash
npx tsx scripts/test_upload_processing.ts
```

This creates a test file with sample data for `generic_drugs` and `generic_aliases` tables.

## Technical Details

### Dependencies
- `xlsx` - Excel file processing
- `csv-parser` - CSV parsing (installed but not used in current implementation)
- `csv-writer` - CSV writing (installed but not used in current implementation)

### API Endpoint
- `POST /api/upload` - Enhanced to process Excel files

### Database Integration
- Uses Supabase client for database queries
- Leverages the existing `theDBModel` for table and field information
- Supports all exportable tables and fields

## Future Enhancements

Potential improvements:
- Batch processing for large files
- Progress indicators for long-running operations
- Direct database import of new rows
- Validation of data types and constraints
- Support for more file formats 