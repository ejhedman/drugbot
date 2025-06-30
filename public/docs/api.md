# API Specification

This document describes the complete API for the Repository System, including all endpoints, operations, and data types.

## Base URL

All API endpoints are relative to the base URL of your application (e.g., `http://localhost:3000`).

## Data Types

### Core Entities

#### Entity
The primary entity type representing main business objects.

```typescript
interface Entity {
  entity_key: string;        // Unique identifier (primary key)
  entity_name: string;       // Human-readable name
  entity_property1: string;  // Additional metadata
}
```

#### ChildEntity
Child entities that belong to a parent Entity.

```typescript
interface ChildEntity {
  child_entity_key: string;        // Unique identifier (primary key)
  entity_key: string;              // Foreign key to parent Entity
  child_entity_name: string;       // Human-readable name
  child_entity_property1: string;  // Additional metadata
}
```

### Collections

#### EntityColl1
Collection data associated with Entity.

```typescript
interface EntityColl1 {
  entity_key: string;      // Foreign key to parent Entity
  coll1_property1: string; // String property
  coll1_property2: string; // String property
  coll1_property3: number; // Numeric property
}
```

#### ChildEntityColl1
Collection data associated with ChildEntity.

```typescript
interface ChildEntityColl1 {
  child_entity_key: string; // Foreign key to parent ChildEntity
  coll1_property1: string;  // String property
  coll1_property2: number;  // Numeric property
}
```

#### ChildEntityColl2
Additional collection data associated with ChildEntity.

```typescript
interface ChildEntityColl2 {
  child_entity_key: string; // Foreign key to parent ChildEntity
  coll2_property1: string;  // String property
  coll2_property2: boolean; // Boolean property
}
```

## API Endpoints

### Entities

#### GET /api/entities
Retrieve all entities or search entities by name/property.

**Query Parameters:**
- `search` (optional): Search term to filter entities by name or property1

**Response:**
```json
[
  {
    "entity_key": "entity_001",
    "entity_name": "Acetaminophen",
    "entity_property1": "Pain reliever and fever reducer"
  }
]
```

**Example:**
```bash
curl "http://localhost:3000/api/entities?search=acetaminophen"
```

#### POST /api/entities
Create a new entity.

**Request Body:**
```json
{
  "entity_name": "New Entity",
  "entity_property1": "Description of the entity"
}
```

**Response:** `201 Created`
```json
{
  "entity_key": "entity_1703123456789_abc123def",
  "entity_name": "New Entity",
  "entity_property1": "Description of the entity"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/entities" \
  -H "Content-Type: application/json" \
  -d '{"entity_name": "New Entity", "entity_property1": "Description"}'
```

#### GET /api/entities/{key}
Retrieve a specific entity by its key.

**Response:**
```json
{
  "entity_key": "entity_001",
  "entity_name": "Acetaminophen",
  "entity_property1": "Pain reliever and fever reducer"
}
```

**Example:**
```bash
curl "http://localhost:3000/api/entities/entity_001"
```

#### PATCH /api/entities/{key}
Update a specific entity.

**Request Body:**
```json
{
  "entity_name": "Updated Entity Name",
  "entity_property1": "Updated description"
}
```

**Response:**
```json
{
  "entity_key": "entity_001",
  "entity_name": "Updated Entity Name",
  "entity_property1": "Updated description"
}
```

**Example:**
```bash
curl -X PATCH "http://localhost:3000/api/entities/entity_001" \
  -H "Content-Type: application/json" \
  -d '{"entity_name": "Updated Name"}'
```

#### DELETE /api/entities/{key}
Delete a specific entity.

**Response:** `200 OK`
```json
{
  "message": "Entity deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/entities/entity_001"
```

### Child Entities

#### GET /api/children
Retrieve all child entities, filter by parent entity, or search.

**Query Parameters:**
- `entityKey` (optional): Filter children by parent entity key
- `search` (optional): Search term to filter children by name or property1

**Response:**
```json
[
  {
    "child_entity_key": "child_001",
    "entity_key": "entity_001",
    "child_entity_name": "Tylenol",
    "child_entity_property1": "Brand name for acetaminophen"
  }
]
```

**Examples:**
```bash
# Get all children
curl "http://localhost:3000/api/children"

# Get children for specific entity
curl "http://localhost:3000/api/children?entityKey=entity_001"

# Search children
curl "http://localhost:3000/api/children?search=tylenol"
```

#### POST /api/children
Create a new child entity.

**Request Body:**
```json
{
  "entity_key": "entity_001",
  "child_entity_name": "New Child Entity",
  "child_entity_property1": "Description of the child entity"
}
```

**Response:** `201 Created`
```json
{
  "child_entity_key": "child_1703123456789_xyz789ghi",
  "entity_key": "entity_001",
  "child_entity_name": "New Child Entity",
  "child_entity_property1": "Description of the child entity"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/children" \
  -H "Content-Type: application/json" \
  -d '{"entity_key": "entity_001", "child_entity_name": "New Child", "child_entity_property1": "Description"}'
```

#### GET /api/children/{key}
Retrieve a specific child entity by its key.

**Response:**
```json
{
  "child_entity_key": "child_001",
  "entity_key": "entity_001",
  "child_entity_name": "Tylenol",
  "child_entity_property1": "Brand name for acetaminophen"
}
```

**Example:**
```bash
curl "http://localhost:3000/api/children/child_001"
```

#### PATCH /api/children/{key}
Update a specific child entity.

**Request Body:**
```json
{
  "child_entity_name": "Updated Child Name",
  "child_entity_property1": "Updated description"
}
```

**Response:**
```json
{
  "child_entity_key": "child_001",
  "entity_key": "entity_001",
  "child_entity_name": "Updated Child Name",
  "child_entity_property1": "Updated description"
}
```

**Example:**
```bash
curl -X PATCH "http://localhost:3000/api/children/child_001" \
  -H "Content-Type: application/json" \
  -d '{"child_entity_name": "Updated Name"}'
```

#### DELETE /api/children/{key}
Delete a specific child entity.

**Response:** `200 OK`
```json
{
  "message": "Child entity deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/children/child_001"
```

### Entity Collections (EntityColl1)

#### GET /api/entity-coll1
Retrieve all entity collection items or filter by entity key.

**Query Parameters:**
- `entityKey` (optional): Filter items by entity key

**Response:**
```json
[
  {
    "entity_key": "entity_001",
    "coll1_property1": "Value 1A",
    "coll1_property2": "Value 1B",
    "coll1_property3": 123
  }
]
```

**Examples:**
```bash
# Get all items
curl "http://localhost:3000/api/entity-coll1"

# Get items for specific entity
curl "http://localhost:3000/api/entity-coll1?entityKey=entity_001"
```

#### POST /api/entity-coll1
Create a new entity collection item.

**Request Body:**
```json
{
  "entity_key": "entity_001",
  "coll1_property1": "New Value A",
  "coll1_property2": "New Value B",
  "coll1_property3": 456
}
```

**Response:** `201 Created`
```json
{
  "entity_key": "entity_001",
  "coll1_property1": "New Value A",
  "coll1_property2": "New Value B",
  "coll1_property3": 456
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/entity-coll1" \
  -H "Content-Type: application/json" \
  -d '{"entity_key": "entity_001", "coll1_property1": "Value A", "coll1_property2": "Value B", "coll1_property3": 456}'
```

#### PATCH /api/entity-coll1/{entityKey}/{index}
Update a specific entity collection item by entity key and index.

**Request Body:**
```json
{
  "coll1_property1": "Updated Value A",
  "coll1_property2": "Updated Value B",
  "coll1_property3": 789
}
```

**Response:**
```json
{
  "entity_key": "entity_001",
  "coll1_property1": "Updated Value A",
  "coll1_property2": "Updated Value B",
  "coll1_property3": 789
}
```

**Example:**
```bash
curl -X PATCH "http://localhost:3000/api/entity-coll1/entity_001/0" \
  -H "Content-Type: application/json" \
  -d '{"coll1_property1": "Updated Value"}'
```

#### DELETE /api/entity-coll1/{entityKey}/{index}
Delete a specific entity collection item by entity key and index.

**Response:** `200 OK`
```json
{
  "message": "Item deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/entity-coll1/entity_001/0"
```

### Child Entity Collections (ChildEntityColl1)

#### GET /api/child-entity-coll1
Retrieve all child entity collection items or filter by child entity key.

**Query Parameters:**
- `childKey` (optional): Filter items by child entity key

**Response:**
```json
[
  {
    "child_entity_key": "child_001",
    "coll1_property1": "Child1A",
    "coll1_property2": 10
  }
]
```

**Examples:**
```bash
# Get all items
curl "http://localhost:3000/api/child-entity-coll1"

# Get items for specific child entity
curl "http://localhost:3000/api/child-entity-coll1?childKey=child_001"
```

#### POST /api/child-entity-coll1
Create a new child entity collection item.

**Request Body:**
```json
{
  "child_entity_key": "child_001",
  "coll1_property1": "New Child Value",
  "coll1_property2": 25
}
```

**Response:** `201 Created`
```json
{
  "child_entity_key": "child_001",
  "coll1_property1": "New Child Value",
  "coll1_property2": 25
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/child-entity-coll1" \
  -H "Content-Type: application/json" \
  -d '{"child_entity_key": "child_001", "coll1_property1": "New Value", "coll1_property2": 25}'
```

#### PATCH /api/child-entity-coll1/{childKey}/{index}
Update a specific child entity collection item by child entity key and index.

**Request Body:**
```json
{
  "coll1_property1": "Updated Child Value",
  "coll1_property2": 30
}
```

**Response:**
```json
{
  "child_entity_key": "child_001",
  "coll1_property1": "Updated Child Value",
  "coll1_property2": 30
}
```

**Example:**
```bash
curl -X PATCH "http://localhost:3000/api/child-entity-coll1/child_001/0" \
  -H "Content-Type: application/json" \
  -d '{"coll1_property1": "Updated Value"}'
```

#### DELETE /api/child-entity-coll1/{childKey}/{index}
Delete a specific child entity collection item by child entity key and index.

**Response:** `200 OK`
```json
{
  "message": "Item deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/child-entity-coll1/child_001/0"
```

### Child Entity Collections (ChildEntityColl2)

#### GET /api/child-entity-coll2
Retrieve all child entity collection items or filter by child entity key.

**Query Parameters:**
- `childKey` (optional): Filter items by child entity key

**Response:**
```json
[
  {
    "child_entity_key": "child_001",
    "coll2_property1": "Extra1A",
    "coll2_property2": true
  }
]
```

**Examples:**
```bash
# Get all items
curl "http://localhost:3000/api/child-entity-coll2"

# Get items for specific child entity
curl "http://localhost:3000/api/child-entity-coll2?childKey=child_001"
```

#### POST /api/child-entity-coll2
Create a new child entity collection item.

**Request Body:**
```json
{
  "child_entity_key": "child_001",
  "coll2_property1": "New Extra Value",
  "coll2_property2": false
}
```

**Response:** `201 Created`
```json
{
  "child_entity_key": "child_001",
  "coll2_property1": "New Extra Value",
  "coll2_property2": false
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/child-entity-coll2" \
  -H "Content-Type: application/json" \
  -d '{"child_entity_key": "child_001", "coll2_property1": "New Value", "coll2_property2": false}'
```

#### PATCH /api/child-entity-coll2/{childKey}/{index}
Update a specific child entity collection item by child entity key and index.

**Request Body:**
```json
{
  "coll2_property1": "Updated Extra Value",
  "coll2_property2": true
}
```

**Response:**
```json
{
  "child_entity_key": "child_001",
  "coll2_property1": "Updated Extra Value",
  "coll2_property2": true
}
```

**Example:**
```bash
curl -X PATCH "http://localhost:3000/api/child-entity-coll2/child_001/0" \
  -H "Content-Type: application/json" \
  -d '{"coll2_property1": "Updated Value"}'
```

#### DELETE /api/child-entity-coll2/{childKey}/{index}
Delete a specific child entity collection item by child entity key and index.

**Response:** `200 OK`
```json
{
  "message": "Item deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/child-entity-coll2/child_001/0"
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
Invalid request data or missing required fields.

```json
{
  "error": "entity_name and entity_property1 are required"
}
```

### 404 Not Found
The requested resource was not found.

```json
{
  "error": "Entity not found"
}
```

### 500 Internal Server Error
An unexpected error occurred on the server.

```json
{
  "error": "Failed to fetch entities"
}
```

## HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Data Relationships

The API supports the following relationships:

1. **Entity → ChildEntity**: One-to-many (one entity can have multiple child entities)
2. **Entity → EntityColl1**: One-to-many (one entity can have multiple collection items)
3. **ChildEntity → ChildEntityColl1**: One-to-many (one child entity can have multiple collection items)
4. **ChildEntity → ChildEntityColl2**: One-to-many (one child entity can have multiple collection items)

## Notes

- All collection items are identified by their parent key (entity_key or child_entity_key) and an index within that parent's collection
- Keys are automatically generated when creating new entities and child entities
- The API does not support bulk operations at this time
- All timestamps and IDs are generated server-side
- Foreign key relationships are validated before creating related records 