# Distinct Data Feature

This document describes the new distinct data retrieval functionality that allows efficient querying of distinct rows with filtering and paging.

## Overview

The distinct data feature provides a way to retrieve unique rows from a table based on a set of columns, with support for:
- Filtering by column values
- Pagination for large datasets
- Custom ordering
- Performance optimization through database-level distinct operations

## Database Function

### `get_distinct_rows_with_filters`

This PostgreSQL function is the core of the distinct data feature.

**Parameters:**
- `table_name` (text): The name of the table to query
- `column_list` (text[]): Array of column names to select and use for distinctness
- `filters` (jsonb, optional): JSON object containing filter conditions
- `page_offset` (integer, optional): Number of rows to skip (default: 0)
- `page_limit` (integer, optional): Maximum number of rows to return (default: 1000, max: 10000)
- `order_by` (text, optional): Column name to order by (default: first column in column_list)

**Returns:**
- `row_data` (jsonb): The row data as a JSON object
- `total_count` (bigint): Total number of distinct rows matching the criteria

**Example SQL:**
```sql
SELECT * FROM get_distinct_rows_with_filters(
  'generic_drugs_wide_view',
  ARRAY['generic_name', 'route_type'],
  '{"route_type": "Oral"}'::jsonb,
  0,
  10,
  'generic_name'
);
```

## API Endpoint

### `POST /api/reports/distinct-data`

**Request Body:**
```json
{
  "tableName": "generic_drugs_wide_view",
  "columnList": ["generic_name", "route_type", "drug_class"],
  "filters": {
    "route_type": ["Oral", "Topical"],
    "approval_status": "Approved"
  },
  "offset": 0,
  "limit": 100,
  "orderBy": "generic_name"
}
```

**Response:**
```json
{
  "data": [
    {
      "generic_name": "Acetaminophen",
      "route_type": "Oral",
      "drug_class": "Analgesic"
    }
  ],
  "columns": [
    {
      "key": "generic_name",
      "displayName": "generic_name",
      "fieldName": "generic_name"
    }
  ],
  "totalRows": 150,
  "offset": 0,
  "limit": 100
}
```

## React Hook

### `useDistinctData`

A React hook that provides easy access to distinct data with built-in pagination and caching.

**Usage:**
```typescript
import { useDistinctData } from '@/hooks/useDistinctData';

function MyComponent() {
  const { data, columns, totalRows, isLoading, error, hasMore, fetchMore } = useDistinctData({
    tableName: 'generic_drugs_wide_view',
    columnList: ['generic_name', 'route_type'],
    filters: { route_type: 'Oral' },
    orderBy: 'generic_name'
  }, 1000);

  return (
    <div>
      {data.map((row, index) => (
        <div key={index}>
          {row.generic_name} - {row.route_type}
        </div>
      ))}
      {hasMore && (
        <button onClick={fetchMore}>Load More</button>
      )}
    </div>
  );
}
```

## Filter Syntax

### Single Value Filters
```json
{
  "route_type": "Oral"
}
```

### Array Filters (IN clause)
```json
{
  "route_type": ["Oral", "Topical", "Injectable"]
}
```

### Multiple Filters (AND logic)
```json
{
  "route_type": "Oral",
  "approval_status": "Approved",
  "drug_class": ["Analgesic", "Antibiotic"]
}
```

## Performance Considerations

### Optimizations
1. **Database-level distinct**: The function performs DISTINCT operations at the database level, reducing data transfer
2. **Efficient pagination**: Uses LIMIT/OFFSET with proper indexing
3. **Count optimization**: Separate count query for accurate pagination
4. **Parameter validation**: Input validation prevents invalid queries

### Best Practices
1. **Index your columns**: Ensure columns used in filters and ordering are indexed
2. **Limit page size**: Use reasonable page limits (100-1000 rows)
3. **Use specific columns**: Only select columns you need
4. **Cache results**: The React hook includes built-in caching and deduplication

### Limitations
1. **Maximum page size**: 10,000 rows per request
2. **Complex filters**: Only supports equality and IN conditions
3. **Single order column**: Only one column can be used for ordering

## Migration from Existing Data Retrieval

### Before (Regular Data API)
```typescript
// Old approach - fetches all rows, then deduplicates in JavaScript
const { data } = await fetch('/api/reports/data', {
  method: 'POST',
  body: JSON.stringify({ reportDefinition, offset, limit })
});

// Manual deduplication
const distinctData = data.filter((row, index, self) => 
  index === self.findIndex(r => 
    r.generic_name === row.generic_name && 
    r.route_type === row.route_type
  )
);
```

### After (Distinct Data API)
```typescript
// New approach - database handles distinctness
const { data } = await fetch('/api/reports/distinct-data', {
  method: 'POST',
  body: JSON.stringify({
    tableName: 'generic_drugs_wide_view',
    columnList: ['generic_name', 'route_type'],
    filters: reportDefinition.filters,
    offset,
    limit
  })
});

// Data is already distinct
const distinctData = data;
```

## Testing

### Database Function Tests
Run the database function tests:
```bash
npm run ts-node scripts/test_distinct_rows_function.ts
```

### API Endpoint Tests
Run the API endpoint tests:
```bash
npm run ts-node scripts/test_distinct_data_api.ts
```

## Security

The function includes several security measures:
1. **SQL injection prevention**: Uses parameterized queries and proper escaping
2. **Input validation**: Validates all parameters before execution
3. **Row-level security**: Respects existing RLS policies
4. **Authentication**: API endpoint requires user authentication

## Future Enhancements

Potential improvements for future versions:
1. **Complex filter operators**: Support for LIKE, >, <, etc.
2. **Multiple order columns**: Support for ORDER BY col1, col2
3. **Aggregation support**: COUNT, SUM, AVG on distinct groups
4. **Caching layer**: Redis-based caching for frequently accessed data
5. **Real-time updates**: WebSocket support for live data updates 