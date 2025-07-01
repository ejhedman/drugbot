# Drugissimo - Pharmaceutical Database Management System

A comprehensive pharmaceutical database management system for tracking generic drugs, manufactured drugs, administration routes, regulatory approvals, and drug aliases. Built with modern web technologies, Drugissimo provides an intuitive interface for pharmaceutical professionals to manage complex drug information with rich relationships and metadata.

## Overview

Drugissimo is a specialized application designed to handle the complex data relationships in pharmaceutical research and regulatory management. It provides a hierarchical view of drug information, from generic compounds to their manufactured variants, including biosimilars, with comprehensive tracking of administration routes, regulatory approvals, and alternative names.

## Key Features

### 🏥 Core Drug Management
- **Generic Drug Database**: Comprehensive tracking of pharmaceutical compounds with mechanism of action, drug class, and target information
- **Manufactured Drug Tracking**: Link generic drugs to their commercial variants (originators and biosimilars)
- **Biosimilar Management**: Specialized tracking for biosimilar drugs with FDA suffix management and originator references
- **Drug Classification**: Support for Biologic, Small Molecule, and Biosimilar classifications

### 🛤️ Administration & Dosing
- **Route Management**: Track multiple administration routes (Subcutaneous, Intravenous, Oral)
- **Dosing Information**: Comprehensive dosing data including loading doses, maintenance doses, and regimens
- **Half-life Tracking**: Drug elimination half-life information
- **Monotherapy Status**: Track approval status for monotherapy use

### 📋 Regulatory Compliance
- **Multi-Country Approvals**: Track regulatory approvals across USA, Canada, France, and UK
- **Indication Management**: Store approved medical indications and target populations
- **Box Warning Tracking**: Manage black box warnings with dates and details
- **Approval Timeline**: Complete approval and discontinuation date tracking

### 🔍 Data Discovery & Search
- **Advanced Search**: Search across all drug data with real-time filtering
- **Hierarchical Navigation**: Tree-based navigation from generic drugs to manufactured variants
- **Alias Management**: Track alternative names, brand names, and technical abbreviations
- **Relationship Mapping**: Visual representation of drug relationships

### 💾 Data Operations
- **Excel Export**: Export complete drug database to Excel format
- **Data Import**: Upload Excel files for bulk data operations
- **Real-time Updates**: Live data synchronization across all users
- **Audit Trail**: Track changes and modifications

### 🔐 Security & Access Control
- **User Authentication**: Secure login system with role-based access
- **Approval Workflows**: Multi-level approval processes for data changes
- **Row-Level Security**: Database-level security policies
- **Admin Management**: User management and system administration

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router for optimal performance
- **TypeScript**: Type-safe development with comprehensive type definitions
- **Tailwind CSS**: Utility-first styling with responsive design
- **Shadcn/ui**: Modern component library for consistent UI
- **React Hook Form**: Efficient form management with validation
- **Zod**: Schema validation and type inference

### Backend
- **Supabase**: PostgreSQL database with real-time capabilities
- **PostgreSQL**: Robust relational database with advanced features
- **Row Level Security**: Database-level access control
- **Real-time Subscriptions**: Live data updates across clients

### Development Tools
- **ESLint**: Code quality and consistency
- **TypeScript**: Static type checking
- **Feature Flags**: Runtime feature toggling for development
- **Repository Pattern**: Clean data access layer

## Data Model

### Core Entities

#### Generic Drugs (`generic_drugs`)
The foundation entity representing pharmaceutical compounds:
- **Generic Name**: Official generic drug name
- **Mechanism of Action**: Detailed description of how the drug works
- **Drug Class**: Classification (Biologic, Small Molecule, Biosimilar)
- **Target**: Molecular target (e.g., TNFi, JAKi, IL6i)
- **Biologic Information**: Detailed biologic classification data

#### Manufactured Drugs (`manu_drugs`)
Commercial versions of generic drugs:
- **Brand Name**: Commercial name (e.g., Humira, Remicade)
- **Manufacturer**: Pharmaceutical company information
- **Biosimilar Status**: Originator (false) or biosimilar (true)
- **Biosimilar Suffix**: FDA suffix for biosimilars (e.g., -aacf, -aqvh)
- **Originator Reference**: For biosimilars, reference to original brand

#### Routes (`generic_routes`)
Administration and dosing information:
- **Route Type**: Subcutaneous, Intravenous, Oral
- **Loading Dose**: Initial dosing regimen with units
- **Maintenance Dose**: Ongoing dosing schedule
- **Half-life**: Drug elimination half-life information
- **Monotherapy Status**: Approval status for monotherapy use

#### Approvals (`generic_approvals`)
Regulatory approval information:
- **Country**: Approval jurisdiction (USA, CAN, FRA, UK)
- **Indication**: Approved medical use and conditions
- **Population**: Target patient population details
- **Approval Date**: Regulatory approval date
- **Box Warnings**: Safety warnings with issuance dates

#### Aliases (`generic_aliases`)
Alternative names and references:
- **Alias**: Alternative name, brand name, or technical abbreviation
- **Generic Reference**: Link to parent generic drug

### Database Schema

The application uses a normalized PostgreSQL schema with:

- **Lookup Tables**: `drug_classes`, `route_types`, `countries`
- **Main Tables**: `generic_drugs`, `manu_drugs`, `generic_routes`, `generic_approvals`, `generic_aliases`
- **Relationship Tables**: `entity_relationships` for hierarchical mapping
- **User Management**: `approved_users`, approval policies, and role management

## Demo Data

The application includes comprehensive demo data with:
- **500+ Generic Drugs**: Realistic pharmaceutical compounds with complete metadata
- **1-20 Manufactured Drugs per Generic**: Originators and biosimilars with detailed information
- **3-30 Aliases per Generic**: Brand names, technical terms, and abbreviations
- **5-50 Routes per Generic**: Various administration methods and dosing regimens
- **3-40 Approvals per Generic**: Multi-country regulatory data with indications

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (via Supabase)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd drugbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up the database**
   ```bash
   # Run the DDL scripts in order
   psql -d your_database -f ddl/00_table_ddl.sql
   psql -d your_database -f ddl/01_approval_policies.sql
   psql -d your_database -f ddl/02_supabase_policies.sql
   psql -d your_database -f ddl/03_approved_users.sql
   psql -d your_database -f ddl/04_approved_users_functions.sql
   psql -d your_database -f ddl/05_approval_policies.sql
   psql -d your_database -f ddl/06_data.sql
   psql -d your_database -f ddl/07a_generic_drugs.sql
   psql -d your_database -f ddl/07b_manu_drugs.sql
   psql -d your_database -f ddl/07c_generic_aliases.sql
   psql -d your_database -f ddl/07d_generic_routes.sql
   psql -d your_database -f ddl/07e_generic_approvals.sql
   psql -d your_database -f ddl/07f_update_relationships.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Authentication
- Enter any valid email address to access the application
- The system simulates authentication for demo purposes
- User roles and permissions are managed through the database

### Navigating the Interface
1. **Entity Tree**: Browse generic drugs in the left panel
2. **Search**: Use the search box to find specific drugs
3. **Details**: Select a drug to view comprehensive information
4. **Collections**: View related data in tabs (Routes, Approvals, Aliases, Manufactured Drugs)
5. **Children**: Expand entities to see manufactured drug variants

### Data Operations
- **View**: Browse all drug information with hierarchical navigation
- **Search**: Find drugs by name, class, target, or other properties
- **Export**: Download complete database as Excel file
- **Add**: Create new generic drugs and manufactured variants
- **Edit**: Modify existing drug information
- **Delete**: Remove drugs from the database

## API Documentation

The application provides comprehensive RESTful APIs for all data operations:

- **Entities**: `/api/entities` - Generic drug management
- **Children**: `/api/children` - Manufactured drug management
- **Collections**: Various endpoints for routes, approvals, and aliases
- **Export**: `/api/export` - Excel export functionality
- **Upload**: `/api/upload` - File upload capabilities
- **Admin**: User management and approval workflows

For detailed API documentation, see [API Specification](api.md).

## Architecture

### Frontend Architecture
- **Component-Based**: Modular React components with clear separation of concerns
- **Type Safety**: Comprehensive TypeScript definitions for all data structures
- **State Management**: React Context API for global state
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Shadcn/ui for consistent design system

### Backend Architecture
- **Repository Pattern**: Clean data access layer with type safety
- **API Routes**: Next.js API routes for server-side operations
- **Database Layer**: Supabase with PostgreSQL for data persistence
- **Authentication**: Supabase Auth with role-based access control
- **Real-time**: Supabase subscriptions for live updates

### Data Flow
1. **Authentication**: Supabase handles user authentication and session management
2. **API Requests**: Next.js API routes process client requests
3. **Repository Layer**: Type-safe data access through repository pattern
4. **Database**: PostgreSQL stores all application data with RLS policies
5. **Real-time Updates**: Supabase subscriptions provide live data synchronization

## Development

### Project Structure
```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # RESTful API endpoints
│   ├── auth/              # Authentication pages
│   └── docs/              # Documentation pages
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── content/           # Main content components
│   ├── entities/          # Entity management components
│   ├── layout/            # Layout components
│   ├── metadata/          # Metadata management
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts for state management
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
├── model_defs/            # TypeScript type definitions
├── model_instances/       # Model implementations
└── repository/            # Data access layer
```

### Key Components
- **Layout**: Main application layout with header, footer, and navigation
- **Entity Management**: CRUD operations for generic drugs with validation
- **Child Management**: Manufactured drug operations with relationship tracking
- **Search and Filtering**: Advanced data exploration with real-time results
- **Authentication**: Login system with role-based access control
- **Export/Import**: Excel file operations for data portability

### Development Features
- **Feature Flags**: Runtime feature toggling for development and testing
- **Type Safety**: Comprehensive TypeScript coverage throughout the application
- **Error Handling**: Robust error handling with user-friendly messages
- **Loading States**: Skeleton loaders and loading indicators
- **Responsive Design**: Mobile-friendly interface with adaptive layouts

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the existing code style and patterns
4. **Add tests**: Include tests for new functionality if applicable
5. **Submit a pull request**: Provide clear description of changes

### Development Guidelines
- Follow TypeScript best practices
- Use the existing component library (Shadcn/ui)
- Maintain responsive design principles
- Add proper error handling
- Include loading states for async operations
- Follow the repository pattern for data access

## Support

For questions and support:
- Check the [FAQ](faq.md) for common questions and answers
- Review the [API Specification](api.md) for technical details
- Examine the [Architecture Document](architecture.md) for system design
- Review the [Design Document](design.md) for UI/UX decisions

## License

This project is licensed under the MIT License.

## Roadmap

### Planned Features
- **Advanced Analytics**: Drug comparison and analysis tools
- **Regulatory Tracking**: Enhanced approval workflow management
- **Data Visualization**: Charts and graphs for drug relationships
- **Mobile App**: Native mobile application for field use
- **Integration APIs**: Connect with external pharmaceutical databases
- **Audit Logging**: Comprehensive change tracking and reporting 