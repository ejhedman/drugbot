# Reports Feature

The reports feature allows users to create, configure, and customize reports from the drug database. Users can select which columns to include, save their configurations, and share reports with others.

## Features

- **Three-column layout**: Reports list, column configuration, and data preview
- **User ownership**: Users can create private reports or make them public
- **Column selection**: Choose which columns to include in reports
- **Report types**: Support for different report types (currently GenericDrugsWideView)
- **Visual indicators**: Icons show report ownership (user initials vs globe for public)

## Database Setup

To set up the reports feature, run the database migration:

```sql
-- Run the reports table creation script
\i ddl/09_reports_table.sql
```

Or use the setup script with sample data:

```sql
-- Run the complete setup script
\i scripts/setup_reports_table.sql
```

**Note**: Before running the setup script, replace `'your-user-id-here'` with an actual user ID from your `auth.users` table.

## API Endpoints

The reports feature includes the following API endpoints:

- `GET /api/reports` - List all reports (user's reports first, then public reports)
- `POST /api/reports` - Create a new report
- `PUT /api/reports` - Update an existing report
- `DELETE /api/reports?uid={uid}` - Delete a report

## Database Schema

The `reports` table has the following structure:

```sql
CREATE TABLE reports (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    owner_uid UUID NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    report_type VARCHAR(100) NOT NULL,
    report_definition JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)

The table includes RLS policies that ensure:
- Users can only view their own reports and public reports
- Users can only create, update, and delete their own reports

## Report Definition Structure

Reports store their configuration as JSON in the `report_definition` column:

```json
{
  "selectedColumns": ["generic_name", "manufacturer", "route_type"],
  "filters": {}
}
```

## Usage

1. **Creating a Report**:
   - Click the "+" button in the Reports column
   - Select a report type from the dropdown
   - Choose which columns to include
   - Enter a name and click "Create Report"

2. **Editing a Report**:
   - Select a report from the list
   - Click the edit icon next to the report name
   - Modify the name and click the checkmark to save

3. **Column Configuration**:
   - Select a report type to see available columns
   - Check/uncheck columns to include/exclude them
   - Changes are automatically saved when editing existing reports

## Future Enhancements

- **Report data preview**: Display actual data in the third column
- **Filtering**: Add filter options to reports
- **Export**: Allow exporting reports to CSV/Excel
- **Sharing**: Enhanced sharing controls and permissions
- **Templates**: Pre-built report templates
- **Scheduling**: Automated report generation and delivery

## Components

- `ReportsPage`: Main component with three-column layout
- `useReports`: Custom hook for managing reports state and API calls
- API routes: Server-side endpoints for CRUD operations

## Dependencies

- Supabase for database and authentication
- Lucide React for icons
- Shadcn/ui components for UI elements
- Next.js for API routes and client-side functionality 