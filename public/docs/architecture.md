# DrugBot Architecture Document

## System Overview

DrugBot is built as a modern web application following a layered architecture pattern with clear separation of concerns. The system is designed for scalability, maintainability, and type safety throughout the entire stack.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                   │
├─────────────────────────────────────────────────────────────┤
│  React Components │  State Management │  UI Components      │
│  (TypeScript)     │  (Context API)    │  (Shadcn/ui)        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js App Router                        │
├─────────────────────────────────────────────────────────────┤
│  Pages & Layout │  API Routes │  Middleware │  Static Assets │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Repository Layer                           │
├─────────────────────────────────────────────────────────────┤
│  Entity Repo │  Aggregate Repo │  Base Repo │  Unified Repo │
│  (TypeScript) │  (TypeScript)   │  (TypeScript) │  (TypeScript) │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Supabase Layer                             │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL │  Auth │  RLS │  Real-time │  Storage │  Edge │
└─────────────────────────────────────────────────────────────┘
```

## Database Architecture

### Database Schema Overview

The DrugBot database is built on PostgreSQL with a normalized schema designed for pharmaceutical data management. The schema follows a hierarchical structure with clear relationships between entities.

```
┌─────────────────────────────────────────────────────────────┐
│                    Database Schema                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Lookup Tables │    │   Main Tables   │                │
│  │                 │    │                 │                │
│  │ • drug_classes  │    │ • generic_drugs │                │
│  │ • route_types   │    │ • manu_drugs    │                │
│  │ • countries     │    │ • generic_routes│                │
│  └─────────────────┘    │ • generic_approvals│              │
│                         │ • generic_aliases│                │
│                         └─────────────────┘                │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ Relationship    │    │   User Mgmt     │                │
│  │ Tables          │    │                 │                │
│  │                 │    │ • approved_users│                │
│  │ • entity_relationships│ • approval_policies│            │
│  └─────────────────┘    └─────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Core Tables

#### 1. Generic Drugs (`generic_drugs`)
The primary entity representing pharmaceutical compounds.

```sql
CREATE TABLE generic_drugs (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    row INTEGER,
    generic_key VARCHAR(255),
    generic_name VARCHAR(255),
    biologic TEXT,
    mech_of_action VARCHAR(255),
    class_or_type VARCHAR(255),
    target VARCHAR(255)
);
```

**Key Relationships:**
- One-to-Many with `manu_drugs` (via `generic_key`)
- One-to-Many with `generic_routes` (via `generic_key`)
- One-to-Many with `generic_approvals` (via `generic_key`)
- One-to-Many with `generic_aliases` (via `generic_key`)

#### 2. Manufactured Drugs (`manu_drugs`)
Commercial versions of generic drugs, including originators and biosimilars.

```sql
CREATE TABLE manu_drugs (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    row INTEGER,
    manu_drug_key VARCHAR(255),
    generic_key VARCHAR(255),
    generic_uid UUID,
    drug_name VARCHAR(255),
    manufacturer VARCHAR(255),
    biosimilar BOOLEAN,
    biosimilar_suffix VARCHAR(255),
    biosimilar_originator VARCHAR(255)
);
```

**Key Relationships:**
- Many-to-One with `generic_drugs` (via `generic_key`)

#### 3. Generic Routes (`generic_routes`)
Administration routes and dosing information for drugs.

```sql
CREATE TABLE generic_routes (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    row INTEGER,
    route_key VARCHAR(255),
    generic_key VARCHAR(255),
    generic_uid UUID,
    route_type VARCHAR(255),
    load_measure VARCHAR(255),
    load_dose VARCHAR(255),
    maintain_dose VARCHAR(255),
    maintain_measure VARCHAR(255),
    montherapy VARCHAR(255),
    half_life TEXT
);
```

#### 4. Generic Approvals (`generic_approvals`)
Regulatory approval information by country and route.

```sql
CREATE TABLE generic_approvals (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    row INTEGER,
    generic_key VARCHAR(255),
    generic_uid UUID,
    route_type VARCHAR(255),
    country VARCHAR(255),
    indication TEXT,
    populations TEXT,
    approval_date DATE,
    discon_date TEXT,
    box_warning TEXT,
    box_warning_date TEXT
);
```

#### 5. Generic Aliases (`generic_aliases`)
Alternative names and references for drugs.

```sql
CREATE TABLE generic_aliases (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    row INTEGER,
    generic_key VARCHAR(255),
    generic_uid UUID,
    alias VARCHAR(255)
);
```

### Lookup Tables

#### Drug Classes (`drug_classes`)
```sql
CREATE TABLE drug_classes (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value VARCHAR(255) NOT NULL UNIQUE
);
```

#### Route Types (`route_types`)
```sql
CREATE TABLE route_types (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value VARCHAR(255) NOT NULL UNIQUE
);
```

#### Countries (`countries`)
```sql
CREATE TABLE countries (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value VARCHAR(255) NOT NULL UNIQUE
);
```

### Relationship Management

#### Entity Relationships (`entity_relationships`)
Manages hierarchical relationships between entities for navigation and tree structures.

```sql
CREATE TABLE entity_relationships (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ancestor_uid UUID NOT NULL,
    child_uid UUID NOT NULL,
    relationship_type VARCHAR(50) NOT NULL,
    relationship_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes and Performance

The database includes comprehensive indexing for optimal query performance:

```sql
-- Primary key indexes (automatic)
-- Foreign key indexes
CREATE INDEX idx_generic_aliases_generic_key ON generic_aliases(generic_key);
CREATE INDEX idx_generic_routes_generic_key ON generic_routes(generic_key);
CREATE INDEX idx_generic_approvals_generic_key ON generic_approvals(generic_key);
CREATE INDEX idx_manu_drugs_generic_key ON manu_drugs(generic_key);

-- Search and filtering indexes
CREATE INDEX idx_generic_drugs_generic_name ON generic_drugs(generic_name);
CREATE INDEX idx_manu_drugs_drug_name ON manu_drugs(drug_name);
CREATE INDEX idx_generic_approvals_country ON generic_approvals(country);
CREATE INDEX idx_generic_approvals_approval_date ON generic_approvals(approval_date);
```

## Application Architecture

### Frontend Architecture

#### Component Hierarchy
```
App
├── AuthProvider (Context)
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   ├── Main Content
│   │   ├── UnauthenticatedContent (Welcome)
│   │   └── AuthenticatedContent
│   │       ├── EntityTreeList
│   │       └── DetailView
│   │           ├── EntityDetailPage
│   │           └── FormCard (for creation)
│   └── Footer
└── Modals
    ├── LoginForm
    ├── LoginHelpForm
    ├── HelpFeedbackPage
    └── ReleaseNotesPage
```

#### State Management
- **React Context API**: Global state management for authentication and user preferences
- **Local State**: Component-level state for UI interactions
- **Server State**: Data fetching and caching through API calls

#### Type Safety
- **TypeScript**: Comprehensive type definitions throughout the application
- **Model Definitions**: Centralized type definitions in `model_defs/`
- **Runtime Validation**: Zod schemas for API request/response validation

### Backend Architecture

#### API Layer (Next.js App Router)
```
/api/
├── entities/           # Generic drug management
│   ├── route.ts       # GET, POST /api/entities
│   └── [key]/
│       └── route.ts   # GET, PATCH, DELETE /api/entities/[key]
├── children/          # Manufactured drug management
│   ├── route.ts       # GET, POST /api/children
│   └── [key]/
│       └── route.ts   # GET, PATCH, DELETE /api/children/[key]
├── generic-routes/    # Route management
├── generic-approvals/ # Approval management
├── generic-aliases/   # Alias management
├── generic-manu-drugs/ # Manufactured drug collections
├── export/           # Excel export functionality
├── upload/           # File upload capabilities
├── admin/            # User management
├── help-feedback/    # User feedback
└── login-help/       # Login assistance
```

#### Repository Pattern
The application implements a clean repository pattern for data access:

```
Repository Layer
├── BaseRepository
│   ├── Supabase client management
│   ├── Common utilities
│   └── Error handling
├── EntityRepository
│   ├── Generic drug operations
│   ├── Search and filtering
│   └── CRUD operations
├── AggregateRepository
│   ├── Collection operations
│   ├── Bulk operations
│   └── Relationship management
└── UnifiedRepository
    ├── Combined interface
    ├── Transaction management
    └── Cross-repository operations
```

### Data Flow Architecture

#### Request Flow
```
1. User Action (Click, Form Submit)
   ↓
2. React Component Handler
   ↓
3. API Call (fetch/axios)
   ↓
4. Next.js API Route
   ↓
5. Repository Method
   ↓
6. Supabase Query
   ↓
7. PostgreSQL Database
   ↓
8. Response (JSON)
   ↓
9. Component Update
   ↓
10. UI Re-render
```

#### Real-time Updates
```
1. Database Change (INSERT/UPDATE/DELETE)
   ↓
2. Supabase Real-time Trigger
   ↓
3. WebSocket Message
   ↓
4. Client Subscription Handler
   ↓
5. State Update
   ↓
6. Component Re-render
```

## Security Architecture

### Authentication & Authorization
- **Supabase Auth**: Handles user authentication and session management
- **Row Level Security (RLS)**: Database-level access control policies
- **Role-based Access**: Different permissions for different user types
- **Approval Workflows**: Multi-level approval processes for data changes

### Data Protection
- **Input Validation**: Zod schemas for all API inputs
- **SQL Injection Prevention**: Parameterized queries through Supabase
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: Next.js built-in CSRF protection

## Performance Architecture

### Frontend Performance
- **Code Splitting**: Next.js automatic code splitting
- **Lazy Loading**: Component lazy loading for better initial load times
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: Browser caching for static assets

### Backend Performance
- **Database Indexing**: Comprehensive indexing strategy
- **Query Optimization**: Optimized SQL queries with proper joins
- **Connection Pooling**: Supabase connection pooling
- **Caching**: Application-level caching for frequently accessed data

### Scalability Considerations
- **Horizontal Scaling**: Stateless API design for easy scaling
- **Database Scaling**: Supabase automatic scaling capabilities
- **CDN**: Global content delivery through Supabase Edge Functions
- **Load Balancing**: Supabase built-in load balancing

## Deployment Architecture

### Development Environment
```
Local Development
├── Next.js Dev Server (localhost:3000)
├── Supabase Local (optional)
└── PostgreSQL Local (optional)
```

### Production Environment
```
Production Deployment
├── Vercel/Netlify (Frontend)
├── Supabase (Backend)
│   ├── PostgreSQL Database
│   ├── Authentication
│   ├── Real-time Subscriptions
│   └── Edge Functions
└── CDN (Static Assets)
```

## Monitoring & Observability

### Error Tracking
- **Client-side Errors**: Console logging and user feedback
- **Server-side Errors**: Structured logging and error responses
- **Database Errors**: Supabase error handling and logging

### Performance Monitoring
- **Frontend Metrics**: Core Web Vitals tracking
- **API Performance**: Response time monitoring
- **Database Performance**: Query performance analysis

## Future Architecture Considerations

### Microservices Migration
- **API Gateway**: Centralized API management
- **Service Decomposition**: Split by domain (Drugs, Approvals, Users)
- **Event-driven Architecture**: Message queues for async operations

### Advanced Features
- **GraphQL**: More flexible data querying
- **Real-time Collaboration**: Multi-user editing capabilities
- **Offline Support**: Service workers for offline functionality
- **Mobile App**: React Native or Flutter mobile application

### Data Analytics
- **Data Warehouse**: Separate analytics database
- **ETL Pipelines**: Automated data processing
- **Business Intelligence**: Advanced reporting and analytics
- **Machine Learning**: Drug recommendation and analysis features 