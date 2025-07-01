# Drugissimo API Specification

This document describes the complete RESTful API for Drugissimo, including all endpoints, data types, and operations for managing pharmaceutical data.

## Base URL

All API endpoints are relative to the base URL of your Drugissimo application (e.g., `http://localhost:3000`).

## Authentication

Currently, Drugissimo uses simulated authentication. In production, endpoints would require proper authentication headers:

```http
Authorization: Bearer <access_token>
```

## Data Types

### Core UI Types

#### UIProperty
Represents a single property/field of an entity with metadata and optional value.

```typescript
interface UIProperty {
  propertyName: string;           // Internal field name
  controlType: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'boolean';
  isEditable: boolean;            // Whether users can modify this property
  isVisible: boolean;             // Whether this property should be shown in UI
  isId: boolean;                  // Whether this property is a primary key
  isRequired: boolean;            // Whether this property must have a value
  ordinal: number;                // Display order
  selectValues?: string[];        // Available options for select controls
  displayName?: string;           // Human-readable label
  placeholder?: string;           // Hint text for form fields
  propertyValue?: any;            // The actual value (for runtime instances)
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
}
```

#### UIAggregate
Represents a collection of related data rows (like a table or sub-collection).

```typescript
interface UIAggregate {
  aggregateType: string;          // Type identifier (e.g., "GenericRoute")
  displayName: string;            // Human-readable name
  isTable: boolean;               // Whether to display as table
  propertyDefs?: UIProperty[];    // Schema definitions for properties
  entityUid?: string;             // Entity this aggregate belongs to
  rows?: UIProperty[][];          // Data rows (2D array)
}
```

#### UIEntity
Represents a complete business object with properties and aggregates.

```typescript
interface UIEntity {
  entityUid?: string;             // Unique GUID identifier
  entityKey?: string;             // Business key for URLs/API calls
  entityType?: string;            // Type identifier
  displayName: string;            // Human-readable name
  pluralName?: string;            // Plural form of entity name
  propertyDefs?: UIProperty[];    // Schema definitions
  properties?: UIProperty[];      // Runtime property values
  aggregates?: UIAggregate[];     // Related data collections
  ancestors?: UIEntityRef[];      // Parent entities for navigation
  children?: UIEntityRef[];       // Child entities for navigation
  aggregateRefs?: AggregateRef[]; // References to available aggregates
}
```

#### UIEntityRef
Lightweight reference to an entity for hierarchical navigation.

```typescript
interface UIEntityRef {
  entityUid?: string;             // Unique identifier
  displayName: string;            // Human-readable name
  ancestors: UIEntityRef[];       // Ancestor entities
  children: UIEntityRef[];        // Child entities
}
```

### Request/Response Types

#### CreateEntityRequest
```typescript
interface CreateEntityRequest {
  displayName: string;            // Required: Human-readable name
  properties?: Record<string, any>; // Optional: Additional properties
}
```

#### UpdateEntityRequest
```typescript
interface UpdateEntityRequest {
  displayName?: string;           // Optional: Updated name
  properties?: Record<string, any>; // Optional: Updated properties
}
```

#### CreateChildRequest
```typescript
interface CreateChildRequest {
  parent_entity_key: string;      // Required: Parent entity key
  displayName: string;            // Required: Human-readable name
  properties?: Record<string, any>; // Optional: Additional properties
}
```

## API Endpoints

### Generic Drugs (Entities)

#### GET /api/entities
Retrieve all generic drugs or search by criteria.

**Query Parameters:**
- `search` (optional): Search term to filter drugs by name, class, target, etc.
- `format` (optional): Response format - `ui` for UI entities, `db` for database format

**Response:** `200 OK`
```json
[
  {
    "entityUid": "uuid-123",
    "entityKey": "adalimumab",
    "displayName": "Adalimumab",
    "properties": [
      {
        "propertyName": "generic_name",
        "displayName": "Generic Name",
        "propertyValue": "Adalimumab",
        "isEditable": true,
        "isVisible": true
      },
      {
        "propertyName": "target",
        "displayName": "Target",
        "propertyValue": "TNFi",
        "isEditable": true,
        "isVisible": true
      }
    ],
    "aggregates": [
      {
        "aggregateType": "GenericManuDrugs",
        "displayName": "Manufactured Drugs",
        "rows": []
      }
    ]
  }
]
```

**Example:**
```bash
curl "http://localhost:3000/api/entities?search=adalimumab&format=ui"
```

#### POST /api/entities
Create a new generic drug.

**Request Body:**
```json
{
  "displayName": "New Drug",
  "properties": {
    "generic_name": "New Drug",
    "target": "TNFi",
    "class_or_type": "Biologic"
  }
}
```

**Response:** `201 Created`
```json
{
  "entityUid": "uuid-456",
  "entityKey": "new-drug",
  "displayName": "New Drug",
  "properties": [...]
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/entities" \
  -H "Content-Type: application/json" \
  -d '{"displayName": "New Drug", "properties": {"generic_name": "New Drug"}}'
```

#### GET /api/entities/{key}
Retrieve a specific generic drug by its key.

**Response:** `200 OK`
```json
{
  "entityUid": "uuid-123",
  "entityKey": "adalimumab",
  "displayName": "Adalimumab",
  "properties": [...],
  "aggregates": [...]
}
```

**Example:**
```bash
curl "http://localhost:3000/api/entities/adalimumab"
```

#### PATCH /api/entities/{key}
Update a specific generic drug.

**Request Body:**
```json
{
  "displayName": "Updated Drug Name",
  "properties": {
    "target": "Updated Target"
  }
}
```

**Response:** `200 OK`
```json
{
  "entityUid": "uuid-123",
  "entityKey": "adalimumab",
  "displayName": "Updated Drug Name",
  "properties": [...]
}
```

**Example:**
```bash
curl -X PATCH "http://localhost:3000/api/entities/adalimumab" \
  -H "Content-Type: application/json" \
  -d '{"displayName": "Updated Name"}'
```

#### DELETE /api/entities/{key}
Delete a specific generic drug.

**Response:** `200 OK`
```json
{
  "message": "Entity deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/entities/adalimumab"
```

### Manufactured Drugs (Children)

#### GET /api/children
Retrieve manufactured drug variants, optionally filtered by parent generic drug.

**Query Parameters:**
- `entityKey` (optional): Filter by parent generic drug key
- `search` (optional): Search term to filter by brand name, manufacturer, etc.
- `format` (optional): Response format - `ui` for UI entities, `db` for database format

**Response:** `200 OK`
```json
[
  {
    "entityUid": "uuid-789",
    "entityKey": "humira",
    "displayName": "Humira",
    "properties": [
      {
        "propertyName": "drug_name",
        "displayName": "Brand Name",
        "propertyValue": "Humira",
        "isEditable": true,
        "isVisible": true
      },
      {
        "propertyName": "manufacturer",
        "displayName": "Manufacturer",
        "propertyValue": "AbbVie",
        "isEditable": true,
        "isVisible": true
      }
    ],
    "ancestors": [
      {
        "displayName": "Adalimumab",
        "entityKey": "adalimumab"
      }
    ]
  }
]
```

**Example:**
```bash
curl "http://localhost:3000/api/children?entityKey=adalimumab&format=ui"
```

#### POST /api/children
Create a new manufactured drug variant.

**Request Body:**
```json
{
  "parent_entity_key": "adalimumab",
  "displayName": "New Brand",
  "properties": {
    "drug_name": "New Brand",
    "manufacturer": "Pharma Corp",
    "biosimilar": false
  }
}
```

**Response:** `201 Created`
```json
{
  "entityUid": "uuid-999",
  "entityKey": "new-brand",
  "displayName": "New Brand",
  "properties": [...],
  "ancestors": [...]
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/children" \
  -H "Content-Type: application/json" \
  -d '{"parent_entity_key": "adalimumab", "displayName": "New Brand"}'
```

#### GET /api/children/{key}
Retrieve a specific manufactured drug by its key.

**Query Parameters:**
- `format` (optional): Response format

**Response:** `200 OK`
```json
{
  "entityUid": "uuid-789",
  "entityKey": "humira",
  "displayName": "Humira",
  "properties": [...],
  "ancestors": [...]
}
```

**Example:**
```bash
curl "http://localhost:3000/api/children/humira?format=ui"
```

#### PATCH /api/children/{key}
Update a specific manufactured drug.

**Request Body:**
```json
{
  "displayName": "Updated Brand Name",
  "properties": {
    "manufacturer": "Updated Manufacturer"
  }
}
```

**Response:** `200 OK`
```json
{
  "entityUid": "uuid-789",
  "entityKey": "humira",
  "displayName": "Updated Brand Name",
  "properties": [...]
}
```

**Example:**
```bash
curl -X PATCH "http://localhost:3000/api/children/humira" \
  -H "Content-Type: application/json" \
  -d '{"displayName": "Updated Brand"}'
```

#### DELETE /api/children/{key}
Delete a specific manufactured drug.

**Response:** `200 OK`
```json
{
  "message": "Child entity deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/children/humira"
```

### Drug Routes

#### GET /api/generic-routes
Retrieve administration routes for a specific generic drug.

**Query Parameters:**
- `entityKey` (required): Generic drug key to get routes for

**Response:** `200 OK`
```json
{
  "aggregateType": "GenericRoute",
  "displayName": "Drug Route & Dosing",
  "isTable": true,
  "propertyDefs": [
    {
      "propertyName": "route_type",
      "displayName": "Route Type",
      "controlType": "select",
      "selectValues": ["Subcutaneous", "Intravenous", "Oral"]
    }
  ],
  "rows": [
    [
      {
        "propertyName": "route_type",
        "propertyValue": "Subcutaneous",
        "displayName": "Route Type"
      },
      {
        "propertyName": "load_dose",
        "propertyValue": "160",
        "displayName": "Loading Dose"
      },
      {
        "propertyName": "load_measure",
        "propertyValue": "mg",
        "displayName": "Loading Dose Unit"
      }
    ]
  ]
}
```

**Example:**
```bash
curl "http://localhost:3000/api/generic-routes?entityKey=adalimumab"
```

#### POST /api/generic-routes
Add a new route for a generic drug.

**Request Body:**
```json
{
  "entityKey": "adalimumab",
  "route_type": "Subcutaneous",
  "load_dose": "160",
  "load_measure": "mg",
  "maintain_dose": "40",
  "maintain_measure": "mg",
  "montherapy": "Approved",
  "half_life": "14 days"
}
```

**Response:** `201 Created`
```json
{
  "message": "Route added successfully",
  "routeId": "uuid-route-123"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/generic-routes" \
  -H "Content-Type: application/json" \
  -d '{"entityKey": "adalimumab", "route_type": "Subcutaneous"}'
```

### Drug Approvals

#### GET /api/generic-approvals
Retrieve regulatory approvals for a specific generic drug.

**Query Parameters:**
- `entityKey` (required): Generic drug key to get approvals for

**Response:** `200 OK`
```json
{
  "aggregateType": "GenericApproval",
  "displayName": "Drug Approval",
  "isTable": true,
  "propertyDefs": [
    {
      "propertyName": "country",
      "displayName": "Country",
      "controlType": "select",
      "selectValues": ["USA", "CAN", "FRA", "UK"]
    }
  ],
  "rows": [
    [
      {
        "propertyName": "country",
        "propertyValue": "USA",
        "displayName": "Country"
      },
      {
        "propertyName": "indication",
        "propertyValue": "Rheumatoid Arthritis",
        "displayName": "Indication"
      },
      {
        "propertyName": "approval_date",
        "propertyValue": "2002-12-31",
        "displayName": "Approval Date"
      }
    ]
  ]
}
```

**Example:**
```bash
curl "http://localhost:3000/api/generic-approvals?entityKey=adalimumab"
```

#### POST /api/generic-approvals
Add a new approval for a generic drug.

**Request Body:**
```json
{
  "entityKey": "adalimumab",
  "country": "USA",
  "indication": "Rheumatoid Arthritis",
  "approval_date": "2002-12-31",
  "box_warning": "Increased risk of serious infections"
}
```

**Response:** `201 Created`
```json
{
  "message": "Approval added successfully",
  "approvalId": "uuid-approval-123"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/generic-approvals" \
  -H "Content-Type: application/json" \
  -d '{"entityKey": "adalimumab", "country": "USA", "indication": "RA"}'
```

### Drug Aliases

#### GET /api/generic-aliases
Retrieve aliases for a specific generic drug.

**Query Parameters:**
- `entityKey` (required): Generic drug key to get aliases for

**Response:** `200 OK`
```json
{
  "aggregateType": "GenericAlias",
  "displayName": "Generic Alias",
  "isTable": true,
  "propertyDefs": [
    {
      "propertyName": "alias",
      "displayName": "Alias Name",
      "controlType": "text"
    }
  ],
  "rows": [
    [
      {
        "propertyName": "alias",
        "propertyValue": "D2E7",
        "displayName": "Alias Name"
      }
    ],
    [
      {
        "propertyName": "alias",
        "propertyValue": "Anti-TNF",
        "displayName": "Alias Name"
      }
    ]
  ]
}
```

**Example:**
```bash
curl "http://localhost:3000/api/generic-aliases?entityKey=adalimumab"
```

#### POST /api/generic-aliases
Add a new alias for a generic drug.

**Request Body:**
```json
{
  "entityKey": "adalimumab",
  "alias": "New Alias"
}
```

**Response:** `201 Created`
```json
{
  "message": "Alias added successfully",
  "aliasId": "uuid-alias-123"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/generic-aliases" \
  -H "Content-Type: application/json" \
  -d '{"entityKey": "adalimumab", "alias": "New Alias"}'
```

### Manufactured Drug Collections

#### GET /api/generic-manu-drugs
Retrieve manufactured drug variants for a specific generic drug.

**Query Parameters:**
- `entityKey` (required): Generic drug key to get manufactured variants for

**Response:** `200 OK`
```json
{
  "aggregateType": "GenericManuDrugs",
  "displayName": "Manufactured Drugs",
  "isTable": true,
  "propertyDefs": [
    {
      "propertyName": "drug_name",
      "displayName": "Brand Name",
      "controlType": "text"
    }
  ],
  "rows": [
    [
      {
        "propertyName": "drug_name",
        "propertyValue": "Humira",
        "displayName": "Brand Name"
      },
      {
        "propertyName": "manufacturer",
        "propertyValue": "AbbVie",
        "displayName": "Manufacturer"
      },
      {
        "propertyName": "biosimilar",
        "propertyValue": false,
        "displayName": "Biosimilar"
      }
    ]
  ]
}
```

**Example:**
```bash
curl "http://localhost:3000/api/generic-manu-drugs?entityKey=adalimumab"
```

### Data Export

#### GET /api/export
Export all drug data to Excel format.

**Response:** `200 OK`
- **Content-Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Content-Disposition**: `attachment; filename="drugbot_export.xlsx"`

**Example:**
```bash
curl "http://localhost:3000/api/export" --output drugbot_export.xlsx
```

### File Upload

#### POST /api/upload
Upload Excel files for data import (development feature).

**Request Body:** `multipart/form-data`
- `file`: Excel file (.xlsx or .xls)

**Response:** `200 OK`
```json
{
  "message": "File uploaded successfully",
  "fileName": "upload_2024-01-15T10-30-00-000Z.xlsx",
  "originalName": "drug_data.xlsx",
  "size": 1024000
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/upload" \
  -F "file=@drug_data.xlsx"
```

### User Feedback

#### POST /api/help-feedback
Submit user feedback or bug reports.

**Request Body:**
```json
{
  "type": "bug_report" | "feature_request" | "general_feedback",
  "subject": "Brief description",
  "message": "Detailed feedback or bug report",
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "Feedback submitted successfully"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/help-feedback" \
  -H "Content-Type: application/json" \
  -d '{"type": "bug_report", "subject": "Search not working", "message": "Detailed description"}'
```

### Login Help

#### POST /api/login-help
Submit login assistance requests.

**Request Body:**
```json
{
  "email": "user@example.com",
  "issue": "forgot_password" | "account_locked" | "other",
  "description": "Detailed description of the issue"
}
```

**Response:** `200 OK`
```json
{
  "message": "Help request submitted successfully"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/login-help" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "issue": "forgot_password"}'
```

### Admin Endpoints

#### GET /api/admin/approved-users
Retrieve list of approved users (admin only).

**Response:** `200 OK`
```json
[
  {
    "uid": "uuid-user-123",
    "email": "admin@company.com",
    "role": "admin",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

**Example:**
```bash
curl "http://localhost:3000/api/admin/approved-users"
```

## Error Handling

### Standard Error Response
All endpoints return consistent error responses:

```json
{
  "error": "Error message description",
  "details": "Additional error details (optional)",
  "code": "ERROR_CODE (optional)"
}
```

### Common HTTP Status Codes
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Examples

#### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": "displayName is required",
  "code": "VALIDATION_ERROR"
}
```

#### 404 Not Found
```json
{
  "error": "Entity not found",
  "details": "No entity found with key 'invalid-key'",
  "code": "ENTITY_NOT_FOUND"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Database connection failed",
  "details": "Unable to connect to database",
  "code": "DB_CONNECTION_ERROR"
}
```

## Rate Limiting

Currently, Drugissimo does not implement rate limiting. In production, rate limiting should be implemented to prevent abuse:

- **Default**: 100 requests per minute per IP
- **Search endpoints**: 50 requests per minute per IP
- **Export endpoints**: 10 requests per minute per IP

## Pagination

For endpoints that return large datasets, pagination is supported:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)

**Response Headers:**
- `X-Total-Count`: Total number of items
- `X-Page-Count`: Total number of pages
- `X-Current-Page`: Current page number

**Example:**
```bash
curl "http://localhost:3000/api/entities?page=2&limit=25"
```

## Filtering and Sorting

### Search
Most endpoints support text search across relevant fields:

```bash
curl "http://localhost:3000/api/entities?search=adalimumab"
```

### Advanced Filtering (Planned)
Future versions will support advanced filtering:

```bash
curl "http://localhost:3000/api/entities?filter[target]=TNFi&filter[class]=Biologic"
```

### Sorting (Planned)
Future versions will support sorting:

```bash
curl "http://localhost:3000/api/entities?sort=displayName&order=asc"
```

## Webhooks (Planned)

Future versions will support webhooks for real-time notifications:

```bash
POST /api/webhooks
{
  "url": "https://your-app.com/webhook",
  "events": ["entity.created", "entity.updated", "entity.deleted"],
  "secret": "webhook_secret"
}
```

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install drugbot-sdk
```

```typescript
import { DrugBotClient } from 'drugbot-sdk';

const client = new DrugBotClient({
  baseUrl: 'http://localhost:3000',
  apiKey: 'your-api-key'
});

const drugs = await client.entities.search('adalimumab');
```

### Python
```bash
pip install drugbot-python
```

```python
from drugbot import DrugBotClient

client = DrugBotClient(
    base_url='http://localhost:3000',
    api_key='your-api-key'
)

drugs = client.entities.search('adalimumab')
```

## Testing

### Test Data
Drugissimo includes comprehensive test data for development and testing:

```bash
# Load test data
curl "http://localhost:3000/api/test/load-data"

# Reset test data
curl "http://localhost:3000/api/test/reset-data"
```

### API Testing
Use the provided test endpoints to verify API functionality:

```bash
# Health check
curl "http://localhost:3000/api/health"

# API status
curl "http://localhost:3000/api/status"
```

## Versioning

API versioning is handled through URL paths:

- **Current version**: `/api/v1/` (default)
- **Future versions**: `/api/v2/`, `/api/v3/`, etc.

**Example:**
```bash
curl "http://localhost:3000/api/v1/entities"
```

## Deprecation Policy

- **Deprecation notice**: 6 months advance notice
- **Breaking changes**: Only in major version releases
- **Backward compatibility**: Maintained for at least 12 months

## Support

For API support and questions:
- **Documentation**: This API specification
- **Examples**: See the examples in this document
- **Testing**: Use the test endpoints for validation
- **Feedback**: Submit through the feedback endpoint 