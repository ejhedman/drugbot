# Shared Reports Feature

The shared reports feature allows users to create shareable, read-only views of their reports that can be accessed via direct URLs.

## Overview

Shared reports provide a clean, focused view of report data without the complexity of the full application interface. They are perfect for:

- Sharing reports with stakeholders who don't need edit access
- Embedding reports in other applications
- Creating bookmarks for frequently accessed reports
- Providing a simplified interface for report viewing

## Features

- **Direct URL Access**: Each shared report has its own URL (e.g., `localhost:3000/reports/my_report`)
- **Read-Only View**: No editing capabilities - only viewing and downloading
- **Clean Interface**: Simplified header and footer without sidebar navigation
- **Download Support**: Full download functionality (CSV, Excel, JSON, PDF)
- **Authentication Required**: Users must be logged in to access shared reports
- **Access Control**: Users can only access their own reports or public reports

## URL Structure

Shared reports are accessed via the following URL pattern:

```
/reports/{report_name}
```

Where `{report_name}` is the slugified name of the report (lowercase, underscores instead of spaces).

## Components

### API Endpoint
- `GET /api/reports/[slug]` - Retrieves a report by its name/slug

### Layout Components
- `SharedReportHeader` - Simplified header with logo and user info
- `SharedReportFooter` - Minimal footer with copyright
- `SharedReportLayout` - Main layout wrapper for shared reports
- `SharedReportBody` - Report display component with download controls
- `SharedReportAuth` - Authentication component for unauthenticated users

### UI Components
- `ShareDialog` - Popup dialog for sharing report URLs with copy and open functionality

### Page Component
- `src/app/reports/[slug]/page.tsx` - Dynamic route page for shared reports

## Usage

### For Report Owners

1. **Create a Report**: Use the main reports interface to create and configure a report
2. **Share the Report**: Click the "Share" button (📤) in either:
   - The report list (next to each report name)
   - The report view (in the report body header)
3. **Share Dialog**: A popup dialog will appear showing:
   - The complete share URL
   - A "Copy" button to copy the URL to clipboard
   - An "Open in New Tab" button to test the link
4. **Distribute the URL**: Share the URL with others who need access

### For Report Viewers

1. **Access the URL**: Navigate to the shared report URL
2. **Authenticate**: If not already logged in, you'll see a focused login page with the report name
3. **Sign In**: Use your email and password to authenticate
4. **View the Report**: After successful authentication, the report data will be displayed in a clean, read-only interface
5. **Download Data**: Use the download button to export data in various formats

## Access Control

Shared reports follow the same access control rules as the main application:

- **Private Reports**: Only accessible to the report owner
- **Public Reports**: Accessible to all authenticated users
- **Authentication Required**: Users must be logged in to access any shared report

## Technical Implementation

### Database
The feature uses the existing `reports` table with the `name` field serving as the URL slug.

### Authentication
Shared reports require authentication through the existing Supabase auth system.

### Data Loading
Reports are loaded using the existing report data APIs, ensuring consistency with the main application.

## Security Considerations

- All shared report access requires authentication
- Users can only access reports they own or public reports
- No sensitive data is exposed in URLs (report names are used as slugs)
- The same row-level security policies apply to shared reports

## Future Enhancements

Potential improvements for the shared reports feature:

- **Public Access**: Allow truly public reports (no authentication required)
- **Embedding**: Support for embedding reports in iframes
- **Custom Styling**: Allow report owners to customize the appearance
- **Analytics**: Track report views and downloads
- **Expiration**: Set expiration dates for shared reports
- **Password Protection**: Add optional password protection for sensitive reports

## Troubleshooting

### Common Issues

1. **Report Not Found**: Ensure the report name in the URL matches exactly
2. **Access Denied**: Verify you have permission to view the report
3. **Authentication Required**: You'll be prompted to sign in if not authenticated
4. **Server Not Running**: Start the development server with `npm run dev`

### Testing

Use the test script to verify the API endpoint:

```bash
npx tsx scripts/test_shared_report_api.ts
```

## API Reference

### GET /api/reports/[slug]

Retrieves a report by its name/slug.

**Parameters:**
- `slug` (path): The report name/slug

**Response:**
```json
{
  "report": {
    "uid": "uuid",
    "name": "report_name",
    "display_name": "Report Display Name",
    "owner_uid": "uuid",
    "is_public": true,
    "report_type": "GenericDrugsWideView",
    "report_definition": {...},
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated
- `404 Not Found`: Report not found or access denied
- `500 Internal Server Error`: Server error 