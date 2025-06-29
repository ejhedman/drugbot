# UIAggregate Structure Changes

## Summary

The UIAggregate implementation has been corrected to properly represent collections of data rows, rather than individual row objects. This aligns with the intended design where a UIAggregate represents a "table" or "collection" containing multiple rows of related data.

## Problem

**Before**: The repository methods returned `UIAggregate[]` - creating one UIAggregate object per database row, which conceptually represented individual rows rather than collections.

**After**: The repository methods now return `UIAggregate` - a single object representing the entire collection with multiple rows of data.

## Key Changes

### 1. UIModel.ts Updates

```typescript
// NEW: Added rows property for 2D array structure
export interface UIAggregate extends UIAggregateMeta {
  entityUid?: string; 
  rows?: UIProperty[][]; // Array of rows, where each row is an array of properties
  properties?: UIProperty[]; // Deprecated - kept for backward compatibility
}
```

### 2. Repository Layer Changes

**Before**:
```typescript
async getGenericRouteAggregatesByEntityKey(entityKey: string): Promise<UIAggregate[]>
```

**After**:
```typescript
async getGenericRouteAggregatesByEntityKey(entityKey: string): Promise<UIAggregate>
```

The repository now:
- Returns a single UIAggregate object per aggregate type
- Converts database rows into a `rows` array containing property arrays
- Uses consistent naming (`displayName: 'Routes & Dosing'` instead of dynamic names)

### 3. API Endpoint Changes

All API endpoints now return single UIAggregate objects instead of arrays:
- `/api/generic-routes` returns `UIAggregate`
- `/api/generic-approvals` returns `UIAggregate`
- `/api/generic-aliases` returns `UIAggregate`

### 4. Component Updates

The EntityDetailPage component has been updated to:
- Handle single UIAggregate objects instead of arrays
- Convert the new `rows` structure to table data format
- Maintain backward compatibility with the old `properties` structure

## Data Structure Comparison

### Old Structure (Incorrect)
```typescript
// Multiple UIAggregate objects - one per database row
[
  {
    entityUid: "entity1",
    aggregateType: "GenericRoute", 
    displayName: "Subcutaneous Route",
    properties: [
      { propertyName: "route_type", propertyValue: "Subcutaneous", ... },
      { propertyName: "load_dose", propertyValue: "10mg", ... }
    ]
  },
  {
    entityUid: "entity1",
    aggregateType: "GenericRoute",
    displayName: "Intravenous Route", 
    properties: [
      { propertyName: "route_type", propertyValue: "Intravenous", ... },
      { propertyName: "load_dose", propertyValue: "5mg", ... }
    ]
  }
]
```

### New Structure (Correct)
```typescript
// Single UIAggregate object containing multiple rows
{
  entityUid: "entity1",
  aggregateType: "GenericRoute",
  displayName: "Routes & Dosing",
  ordinal: 1,
  rows: [
    [
      { propertyName: "route_type", propertyValue: "Subcutaneous", ... },
      { propertyName: "load_dose", propertyValue: "10mg", ... }
    ],
    [
      { propertyName: "route_type", propertyValue: "Intravenous", ... },
      { propertyName: "load_dose", propertyValue: "5mg", ... }
    ]
  ]
}
```

## Backward Compatibility (Removed)

~~The implementation maintains backward compatibility:~~
- ~~The deprecated `properties` field is still supported during the transition~~
- ~~The conversion helper functions handle both old and new structures~~
- ~~Type guards have been updated to validate both formats~~

**UPDATE**: The deprecated `properties` field has been completely removed from UIAggregate. All code now uses the new `rows` structure exclusively.

## Benefits

1. **Conceptual Clarity**: UIAggregate now correctly represents a collection/table rather than individual rows
2. **Better Organization**: Related data is grouped under a single aggregate object
3. **Simplified API**: Single object per aggregate type instead of arrays
4. **Consistent Naming**: Aggregate names are now consistent and descriptive
5. **Maintainability**: Easier to reason about and extend the data structure

## Usage Examples

### Working with the New Structure

```typescript
// Fetching aggregate data
const routesAggregate: UIAggregate = await aggregateRepository.getGenericRouteAggregatesByEntityKey(entityKey);

// Accessing rows
if (routesAggregate.rows) {
  routesAggregate.rows.forEach((row, index) => {
    console.log(`Row ${index}:`);
    row.forEach(property => {
      console.log(`  ${property.propertyName}: ${property.propertyValue}`);
    });
  });
}

// Converting to table data
const tableData = routesAggregate.rows?.map(row => {
  const obj: Record<string, any> = {};
  row.forEach(prop => {
    obj[prop.propertyName] = prop.propertyValue;
  });
  return obj;
}) || [];
```

## Migration Notes

- ~~No breaking changes for existing consumers due to backward compatibility~~
- ~~New code should use the `rows` property instead of `properties`~~
- ~~The old `properties` field will be removed in a future version~~
- Repository methods now return single objects - update calling code accordingly

**UPDATE**: 
- **BREAKING CHANGE**: The `properties` field has been completely removed from UIAggregate
- All code must now use the `rows` property exclusively  
- Any code accessing `uiAggregate.properties` will need to be updated to use `uiAggregate.rows`
- Type safety will catch these issues at compile time 