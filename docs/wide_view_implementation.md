# Generic Drugs Wide View Implementation

## Overview

This document describes the implementation of a comprehensive wide view that rolls up all the main drug tables into one denormalized view for easier querying and analysis.

## What Was Implemented

### 1. SQL View Definition (`ddl/08_generic_drugs_wide_view.sql`)

Created a PostgreSQL view that joins the following tables using `generic_key` as the joining key:

- **generic_drugs** (base table)
- **manu_drugs** (manufactured drugs)
- **generic_routes** (administration routes and dosing)
- **generic_approvals** (regulatory approvals)

The view includes all columns from all tables, with duplicate fields (like `generic_key`) appearing only once.

### 2. Database Model Integration (`src/model_instances/TheDBModel.ts`)

Added the wide view as a `DBTable` definition with:
- 40 fields total
- All fields marked as exportable
- Proper data types matching the SQL view
- Comprehensive field descriptions

### 3. UI Model Integration (`src/model_instances/TheUIModel.ts`)

Created a `UIAggregate` called `GenericDrugsWideView` with:
- Display name: "Complete Drug Information"
- 35 visible properties (excluding UIDs)
- All properties marked as read-only (not editable)
- Proper display names and control types
- Added to the `GenericDrugs` entity as an aggregate reference

### 4. Model Mapping Integration (`src/model_instances/TheModelMap.ts`)

Created an `AggregateMapping` that connects:
- UI aggregate type: `GenericDrugsWideView`
- Database table: `generic_drugs_wide_view`
- Parent key field: `generic_key`
- Complete property mappings for all 35 fields

### 5. Testing and Validation

Created comprehensive tests to verify:
- DB model integration
- UI model integration
- Entity integration
- Model map integration
- Field mapping consistency

## View Structure

The wide view contains the following field groups:

### Generic Drugs (Base Table)
- `generic_uid`, `generic_key`, `generic_name`
- `biologic`, `mech_of_action`, `class_or_type`, `target`

### Manufactured Drugs
- `manu_drug_uid`, `manu_drug_key`, `drug_name`
- `manufacturer`, `brandkey`, `biosimilar_suffix`, `biosimilar`, `biosimilar_originator`

### Generic Routes
- `route_uid`, `route_key`, `route_type`
- `load_measure`, `load_dose`, `load_reg`
- `maintain_dose`, `maintain_measure`, `maintain_reg`
- `montherapy`, `half_life`

### Generic Approvals
- `approval_uid`, `approval_route_type`, `country`
- `indication`, `populations`, `approval_date`
- `discon_date`, `box_warning`, `box_warning_date`

## Usage

### In the UI
The wide view appears as a "Complete Drug Information" tab in the Generic Drugs entity detail page, showing all drug information in a single table format. The tab is automatically generated based on the aggregate references in the UI model and will appear as the 5th tab in the interface.

### In SQL Queries
```sql
-- Basic query
SELECT * FROM generic_drugs_wide_view WHERE biologic = 'Yes';

-- Aggregation
SELECT 
    biologic,
    COUNT(*) as drug_count,
    COUNT(DISTINCT manufacturer) as manufacturer_count
FROM generic_drugs_wide_view 
GROUP BY biologic;

-- Filtering and sorting
SELECT 
    generic_name,
    drug_name,
    manufacturer,
    route_type,
    country
FROM generic_drugs_wide_view 
WHERE country = 'USA'
ORDER BY generic_name;
```

### In the Application
The wide view is available through the existing aggregate system:
- Entity: `GenericDrugs`
- Aggregate: `GenericDrugsWideView`
- Table: `generic_drugs_wide_view`

## Benefits

1. **Simplified Querying**: All drug information in one place
2. **Performance**: Pre-joined data reduces complex queries
3. **Consistency**: Ensures data integrity across related tables
4. **Analysis**: Easy to perform cross-table analysis
5. **Reporting**: Single source for comprehensive drug reports

## Technical Notes

- The view uses LEFT JOINs to ensure all generic drugs are included even if they don't have related data
- Duplicate fields (like `generic_key`) appear only once in the view
- UID fields are included but typically hidden in the UI
- The view is read-only and cannot be directly modified
- All existing indexes on the underlying tables will be used by the view

## Testing

Run the test scripts to verify the implementation:

```bash
# Test basic integration
npx tsx scripts/test_wide_view.ts

# Test API integration
npx tsx scripts/test_wide_view_api.ts
```

These will validate all integrations and show field mappings. 