# Key vs UID Design Pattern

## Overview

This document clarifies the proper usage of `_key` and `_uid` fields in the DrugBot system to ensure consistent database querying and relationship management.

## Design Rules

### 1. Key Fields (`_key`)
- **Purpose**: Human-readable identifiers for display and user interaction
- **Examples**: `generic_key`, `manu_drug_key`, `route_key`
- **Usage**: 
  - Display in UI
  - User input/selection
  - API parameters for user-facing operations
  - **NEVER used for database queries**

### 2. UID Fields (`_uid`)
- **Purpose**: Database identifiers for all database operations
- **Examples**: `uid`, `generic_uid`, `ancestor_uid`, `child_uid`
- **Usage**:
  - All database queries
  - Foreign key relationships
  - Primary key lookups
  - Relationship tracking

## Database Schema Pattern

```sql
-- Example table structure
CREATE TABLE generic_drugs (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),           -- Database identifier
    generic_key VARCHAR(255),                                 -- Human-readable key
    generic_name VARCHAR(255),                                -- Display name
    -- ... other fields
);

CREATE TABLE generic_aliases (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),           -- Database identifier
    generic_uid UUID REFERENCES generic_drugs(uid),           -- Foreign key using UID
    generic_key VARCHAR(255),                                 -- Informational only
    alias VARCHAR(255)
);
```

## Repository Pattern

### ✅ Correct Pattern
```typescript
// 1. Accept key from user/API
async getEntityByKey(entityKey: string): Promise<UIEntity> {
  // 2. Look up UID from key (if needed)
  const { data: entityData } = await supabase
    .from('generic_drugs')
    .select('uid')
    .eq('generic_key', entityKey)
    .single();
  
  const entityUid = entityData.uid;
  
  // 3. Use UID for all database operations
  const { data } = await supabase
    .from('generic_aliases')
    .select('*')
    .eq('generic_uid', entityUid); // ✅ Use UID for foreign key
}
```

### ❌ Incorrect Pattern
```typescript
// ❌ WRONG - Using key for database query
const { data } = await supabase
  .from('generic_aliases')
  .select('*')
  .eq('generic_key', entityKey); // ❌ Don't use key for foreign key
```

## API Design

### Input Parameters
- APIs should accept `_key` values for user convenience
- Repository methods should handle key → UID conversion internally

### Response Objects
- Include both `entityKey` and `entityUid` in responses
- Use `entityKey` for display and user interaction
- Use `entityUid` for internal operations

## Migration Strategy

When updating existing code:

1. **Identify key-based queries**: Look for `.eq('*_key', value)` patterns
2. **Add UID lookup**: Query the parent table to get UID from key
3. **Update foreign key queries**: Use UID instead of key
4. **Update logging**: Include both key and UID in log messages for debugging

## Benefits

1. **Performance**: UID queries are faster than string key queries
2. **Consistency**: All relationships use the same identifier type
3. **Flexibility**: Keys can be changed without breaking relationships
4. **Security**: UIDs are not predictable or guessable
5. **Standards**: Follows database normalization best practices

## Examples

### Entity Lookup
```typescript
// Input: "ASPIRIN_001" (key)
// Process: Look up UID from generic_drugs table
// Query: Use UID for all subsequent operations
```

### Aggregate Queries
```typescript
// Input: "ASPIRIN_001" (key)
// Process: Convert to UID, then query aggregates
// Query: generic_aliases WHERE generic_uid = <uid>
```

### Relationship Queries
```typescript
// Input: "ASPIRIN_001" (key)
// Process: Convert to UID, then query relationships
// Query: entity_relationships WHERE ancestor_uid = <uid>
```

## Testing

When writing tests:
1. Use realistic key values (e.g., "ASPIRIN_001")
2. Verify that UID lookups work correctly
3. Ensure foreign key relationships use UIDs
4. Test both key and UID in response objects 