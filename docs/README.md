# Drug Database Application

A comprehensive pharmaceutical database system for managing generic drugs, manufactured drugs, routes, approvals, and aliases. This application provides a modern web interface for exploring and managing drug information with rich relationships and metadata.

## Overview

The Drug Database Application is built to handle complex pharmaceutical data with hierarchical relationships between generic drugs and their manufactured variants. It supports biosimilar tracking, approval management, and comprehensive drug information storage.

## Features

### Core Functionality
- **Generic Drug Management**: Store and manage generic drug information including mechanism of action, drug class, and target
- **Manufactured Drug Tracking**: Link generic drugs to their manufactured variants (originators and biosimilars)
- **Route Management**: Track administration routes, dosing regimens, and half-life information
- **Approval Tracking**: Manage regulatory approvals across multiple countries with indication and population data
- **Alias Management**: Store alternative names, brand names, and technical abbreviations
- **Relationship Mapping**: Hierarchical relationships between generic and manufactured drugs

### Technical Features
- **Modern Web Interface**: Built with Next.js, React, and TypeScript
- **Database Integration**: PostgreSQL with Supabase backend
- **Authentication**: Secure user authentication and authorization
- **Real-time Updates**: Live data synchronization
- **Search and Filtering**: Advanced search capabilities across all drug data
- **Responsive Design**: Mobile-friendly interface

## Data Model

### Core Entities

#### Generic Drugs
The primary entity representing pharmaceutical compounds:
- **Generic Name**: Official generic drug name
- **Mechanism of Action**: How the drug works
- **Drug Class**: Classification (Biologic, Small Molecule, Biosimilar)
- **Target**: Molecular target (TNFi, JAKi, IL6i, etc.)
- **Biologic Flag**: Whether the drug is a biologic

#### Manufactured Drugs
Branded versions of generic drugs:
- **Brand Name**: Commercial name (e.g., Humira, Remicade)
- **Manufacturer**: Pharmaceutical company
- **Biosimilar Status**: Originator (0) or biosimilar (1)
- **Biosimilar Suffix**: FDA suffix for biosimilars (e.g., -aacf, -aqvh)
- **Originator Reference**: For biosimilars, reference to original brand

#### Routes
Administration and dosing information:
- **Route Type**: Subcutaneous, Intravenous, Oral
- **Loading Dose**: Initial dosing regimen
- **Maintenance Dose**: Ongoing dosing schedule
- **Half-life**: Drug elimination half-life
- **Monotherapy Status**: Whether approved as monotherapy

#### Approvals
Regulatory approval information:
- **Country**: Approval jurisdiction (USA, CAN, FRA, UK)
- **Indication**: Approved medical use
- **Population**: Target patient population
- **Approval Date**: Regulatory approval date
- **Box Warnings**: Safety warnings and dates

#### Aliases
Alternative names and references:
- **Alias**: Alternative name, brand name, or abbreviation
- **Type**: Classification of the alias

## Database Schema

The application uses a normalized PostgreSQL schema with:

- **Lookup Tables**: `drug_classes`, `route_types`, `countries`
- **Main Tables**: `generic_drugs`, `manu_drugs`, `generic_routes`, `generic_approvals`, `generic_aliases`
- **Relationship Tables**: `entity_relationships` for hierarchical mapping
- **User Management**: Approval policies and user roles

## API Endpoints

The application provides RESTful APIs for all data operations:

- **Entities**: `/api/entities` - Generic drug management
- **Children**: `/api/children` - Manufactured drug management
- **Collections**: Various endpoints for routes, approvals, and aliases
- **Admin**: User management and approval workflows

For detailed API documentation, see [API Specification](api.md).

## Demo Data

The application includes comprehensive demo data with:
- **500 Generic Drugs**: Realistic pharmaceutical compounds
- **1-20 Manufactured Drugs per Generic**: Originators and biosimilars
- **3-30 Aliases per Generic**: Brand names and technical terms
- **5-50 Routes per Generic**: Various administration methods
- **3-40 Approvals per Generic**: Multi-country regulatory data

See the `ddl/` folder for demo data scripts and setup instructions.

## Documentation

### Core Documentation
- **[API Specification](api.md)**: Complete API reference with endpoints, data types, and examples
- **[Key/UID Design](KEY_UID_DESIGN.md)**: Database design decisions and relationship mapping
- **[Questions](questions.md)**: Common questions and answers about the system

### Technical Documentation
- **Database Schema**: See `ddl/00_table_ddl.sql` for complete schema definition
- **Demo Data**: See `ddl/07_*` files for comprehensive test data
- **Authentication**: User management and approval workflows

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Supabase account (for backend services)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `\i ddl/00_table_ddl.sql`
5. Load demo data: `\i ddl/07_demo_data_master.sql`
6. Start the development server: `npm run dev`

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Architecture

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Component library
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Backend
- **Supabase**: PostgreSQL database and authentication
- **PostgreSQL**: Primary database
- **Row Level Security**: Data access control
- **Real-time subscriptions**: Live data updates

### Data Flow
1. **Authentication**: Supabase handles user authentication
2. **API Routes**: Next.js API routes handle data operations
3. **Database**: PostgreSQL stores all application data
4. **Real-time**: Supabase subscriptions provide live updates

## Development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── model_defs/         # TypeScript type definitions
├── model_instances/    # Model implementations
└── repository/         # Data access layer
```

### Key Components
- **Layout**: Main application layout with header and footer
- **Entity Management**: CRUD operations for generic drugs
- **Child Management**: Manufactured drug operations
- **Search and Filtering**: Advanced data exploration
- **Authentication**: Login and user management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions and support:
- Check the [Questions](questions.md) document
- Review the [API Specification](api.md)
- Examine the [Key/UID Design](KEY_UID_DESIGN.md) for technical details 