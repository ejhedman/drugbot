/**
 * Core UI Entity Types
 * 
 * This file defines the core UI entity types used for rendering business objects in the application.
 * 
 * The type system supports dual usage patterns:
 * 1. Schema Definitions: Static metadata describing the structure of entities and their properties
 * 2. Runtime Instances: Actual data objects with property values for display and editing
 * 
 * Key Concepts:
 * - UIProperty: Represents a single field/attribute of an entity with metadata and optional value
 * - UIAggregate: Represents a collection of related data rows (like a table or sub-collection)
 * - UIEntity: Represents a complete business object with properties and optional aggregates
 * - UIEntityRef: Lightweight reference to an entity for hierarchical navigation
 * 
 * This unified approach allows the same type definitions to be used for:
 * - Database schema introspection
 * - Form generation and validation
 * - Table rendering and editing
 * - API data transfer
 */

// ============================================================================
// CORE UI PROPERTY TYPES
// ============================================================================

/**
 * UIPropertyMeta - Base metadata interface for entity properties
 * 
 * This interface defines the core metadata for a property that applies both to schema
 * definitions and runtime instances. It contains information about how the property
 * should be displayed, validated, and interacted with in the UI.
 * 
 * Field Descriptions:
 * - propertyName: Internal field name (matches database column or API field)
 * - controlType: UI control type for rendering (text input, dropdown, etc.)
 * - isEditable: Whether users can modify this property value
 * - isVisible: Whether this property should be shown in the UI
 * - isId: Whether this property is a primary key or unique identifier
 * - isRequired: Whether this property must have a value for validation
 * - ordinal: Sort order for consistent property display (lower numbers first)
 * - selectValues: Available options for 'select' control type
 * - displayName: Human-readable label for the property (overrides propertyName)
 * - placeholder: Hint text shown in empty form fields
 * - validation: Additional validation rules (min/max values, regex patterns, etc.)
 */
export interface UIPropertyMeta {
  /** Internal property name (typically matches database column name) */
  propertyName: string;
  
  /** UI control type determining how this property is rendered and edited */
  controlType: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'boolean';
  
  /** Whether this property can be edited by users in the UI */
  isEditable: boolean;
  
  /** Whether this property should be displayed in the UI (hidden fields are typically system fields) */
  isVisible: boolean;
  
  /** Whether this property is a primary key or unique identifier */
  isId: boolean;
  
  /** Whether this property is required and must have a value */
  isRequired: boolean;
  
  /** Display order for this property (lower numbers appear first) */
  ordinal: number;

  /** Available options for select/dropdown controls */
  selectValues?: string[];
  
  /** Human-readable display name (defaults to formatted propertyName if not provided) */
  displayName?: string;
  
  /** Placeholder text shown in empty form fields */
  placeholder?: string;
  
  /** Additional validation rules for this property */
  validation?: {
    /** Minimum value for numeric fields or minimum length for strings */
    min?: number;
    /** Maximum value for numeric fields or maximum length for strings */
    max?: number;
    /** Regular expression pattern for string validation */
    pattern?: string;
    /** Custom validation rule identifier */
    custom?: string;
  };  
}

/**
 * UIProperty - Complete property definition with optional runtime value
 * 
 * Extends UIPropertyMeta to include the actual property value for runtime instances.
 * This is the primary interface used throughout the application for both schema
 * definitions (where propertyValue is undefined) and runtime data (where propertyValue
 * contains the actual field value).
 * 
 * Usage Examples:
 * - Schema: { propertyName: "user_name", controlType: "text", isEditable: true, ... }
 * - Runtime: { propertyName: "user_name", controlType: "text", propertyValue: "john_doe", ... }
 */
export interface UIProperty extends UIPropertyMeta {
  /** The actual value of this property (undefined for schema definitions, populated for runtime instances) */
  propertyValue?: any;
}

// ============================================================================
// CORE UI AGGREGATE TYPES
// ============================================================================

/**
 * AggregateRef - Reference to an aggregate type
 * 
 * Used to reference an aggregate type within an entity without including the full
 * aggregate definition. This is particularly useful for entity schemas where we want
 * to define which aggregates are available without duplicating the full aggregate
 * metadata.
 * 
 * Field Descriptions:
 * - aggregateType: Type identifier matching a UIAggregateMeta definition
 * - displayName: Human-readable name shown in tabs or section headers
 * - ordinal: Display order for multiple aggregates (lower numbers first)
 */
export interface AggregateRef {
  /** Type identifier matching a UIAggregateMeta definition */
  aggregateType: string;
  
  /** Human-readable display name (shown in tabs, section headers, etc.) */
  displayName: string;
  
  /** Display order when multiple aggregates are present (lower numbers appear first) */
  ordinal: number;
}

/**
 * UIAggregateMeta - Base metadata interface for entity aggregates (collections/sub-tables)
 * 
 * An aggregate represents a collection of related data that belongs to an entity.
 * For example, a "Drug" entity might have aggregates like "Routes & Dosing", "Approvals",
 * and "Aliases" - each containing multiple rows of related data.
 * 
 * Field Descriptions:
 * - aggregateType: Type identifier for the aggregate (e.g., "GenericRoute", "GenericApproval")
 * - displayName: Human-readable name shown in tabs or section headers
 * - propertyDefs: Schema definitions for the properties that appear in each row
 * - ordinal: Display order for multiple aggregates (lower numbers first)
 */
export interface UIAggregateMeta {
  /** Type identifier for this aggregate (used for API routing and type checking) */
  aggregateType: string; 
  
  /** Human-readable display name (shown in tabs, section headers, etc.) */
  displayName: string;
  
  /** Property schema definitions for this aggregate (defines the "columns" of the collection) */
  propertyDefs?: UIPropertyMeta[];

  /** Whether this aggregate should be displayed as a table (true) or as properties (false) */
  isTable: boolean;
  
  /** Whether this aggregate can be edited (shows edit/delete controls and new row button) */
  canEdit: boolean;
}

/**
 * UIAggregate - Complete aggregate definition with optional runtime data
 * 
 * Represents a collection of related data rows that belong to an entity. This is conceptually
 * similar to a sub-table or related collection in database terms. Each aggregate contains
 * multiple rows of data, where each row consists of the same set of properties.
 * 
 * The key insight is that an aggregate represents the entire collection, not individual rows.
 * For example, instead of having multiple "Route" objects, you have one "Routes & Dosing"
 * aggregate containing multiple rows of route data.
 * 
 * Data Structure:
 * - rows: 2D array where each inner array represents one row of data
 * - Each row contains UIProperty objects with the same propertyNames but different values
 * 
 * Usage Examples:
 * - Schema: { aggregateType: "GenericRoute", displayName: "Routes & Dosing", propertyDefs: [...] }
 * - Runtime: { aggregateType: "GenericRoute", displayName: "Routes & Dosing", rows: [[...], [...]] }
 */
export interface UIAggregate extends UIAggregateMeta {
  /** Entity identifier that this aggregate belongs to (optional for schema definitions) */
  entityUid?: string; 
  
  /** 
   * Array of data rows, where each row is an array of UIProperty objects.
   * This creates a 2D structure: rows[rowIndex][propertyIndex]
   * All rows in the same aggregate have the same property structure (same propertyNames)
   * but different propertyValues.
   */
  rows?: UIProperty[][];
}

export interface UIReportMeta {
  /** Type identifier for this report (used for API routing and type checking) */
  reportType: string; 
 
  /** Human-readable display name (shown in report headers, navigation, etc.) */
  displayName: string;
 
  /** Property schema definitions for this aggregate (defines the "columns" of the collection) */
  propertyDefs?: UIPropertyMeta[];

}

export interface UIReport extends UIReportMeta {
  /** Entity identifier that this aggregate belongs to (optional for schema definitions) */
  entityUid?: string; 

  displayName: string;

  reportDef: string;
  
}

// ============================================================================
// CORE UI ENTITY REFERENCE TYPES
// ============================================================================

/**
 * UIEntityRef - Lightweight reference to an entity for hierarchical navigation
 * 
 * Used to represent entity relationships and hierarchical structures without
 * loading the complete entity data. This is particularly useful for tree views,
 * breadcrumbs, and parent-child navigation.
 * 
 * Field Descriptions:
 * - entityUid: Unique identifier for the referenced entity (optional for schema refs)
 * - displayName: Human-readable name for display in navigation UI
 * - ancestors: Chain of parent entities leading to the root
 * - children: Direct child entities (for expandable tree views)
 * 
 * Note: The ancestors and children arrays contain UIEntityRef objects, creating
 * a recursive structure that can represent arbitrarily deep hierarchies.
 */
export interface UIEntityRef {
  /** Unique identifier for the referenced entity (undefined for schema-only references) */
  entityUid?: string;
  
  /** Human-readable name displayed in navigation, breadcrumbs, tree views, etc. */
  displayName: string;
  
  /** Array of ancestor entities from root to immediate parent (for breadcrumb navigation) */
  ancestors: UIEntityRef[];
  
  /** Array of direct child entities (for expandable tree views and drill-down navigation) */
  children: UIEntityRef[];
}

// ============================================================================
// CORE UI ENTITY TYPES
// ============================================================================

/**
 * UIEntityMeta - Base metadata interface for entity types
 * 
 * This interface defines the schema-level metadata for an entity type. It contains
 * information about how the entity should be displayed, what properties it has,
 * and what aggregates (sub-collections) it can contain.
 * 
 * Field Descriptions:
 * - entityType: Type identifier for polymorphic entities
 * - displayName: Human-readable name for UI display
 * - pluralName: Plural form for collections and lists
 * - propertyDefs: Schema definitions for the entity's properties
 * - aggregateRefs: References to aggregates that this entity type can have
 */
export interface UIEntityMeta {
  /** Type identifier for this entity (useful for polymorphic entities or type checking) */
  entityType?: string;
  
  /** Human-readable display name (for entity types: "Generic Drug", for instances: "Aspirin") */
  displayName: string;
  
  /** Plural form of the entity name (used in collection headers, navigation: "Generic Drugs") */
  pluralName?: string; 
  
  /** Property schema definitions (the "columns" or "fields" that this entity type has) */
  propertyDefs?: UIPropertyMeta[];
  
  /** References to aggregates that this entity type can have */
  aggregateRefs?: AggregateRef[];
}

/**
 * UIEntity - Complete entity definition with optional runtime data
 * 
 * The primary interface for representing business objects in the application.
 * Supports dual usage as both schema definitions and runtime instances.
 * 
 * SCHEMA DEFINITION USAGE:
 * Used to define the structure, validation rules, and UI metadata for an entity type.
 * Contains propertyDefs, aggregateDefs, tableName, and display information.
 * Example: Definition of what a "Generic Drug" entity looks like
 * 
 * RUNTIME INSTANCE USAGE:
 * Used to represent actual entity instances with data values.
 * Contains entityUid, properties with values, aggregates with data.
 * Example: A specific drug like "Aspirin" with its actual property values
 * 
 * HIERARCHICAL RELATIONSHIPS:
 * Entities can participate in parent-child relationships through ancestors and children.
 * This enables tree views, breadcrumb navigation, and drill-down scenarios.
 * 
 * AGGREGATES:
 * Entities can contain aggregates (sub-collections) like "Routes & Dosing" or "Approvals".
 * Each aggregate contains multiple rows of related data.
 */
export interface UIEntity extends UIEntityMeta {
  // ============================================================================
  // RUNTIME INSTANCE IDENTIFICATION
  // ============================================================================
  
  /** Unique GUID identifier for this specific entity instance (undefined for schema definitions) */
  entityUid?: string;
  
  // ============================================================================
  // RUNTIME INSTANCE DATA
  // ============================================================================
  
  /** 
   * Array of properties with actual values for this entity instance
   * Each UIProperty contains both metadata (from schema) and the current value
   * Example: [{ propertyName: "drug_name", propertyValue: "Aspirin", isEditable: true, ... }]
   */
  properties?: UIProperty[];
  
  /** 
   * Array of aggregates (sub-collections) containing related data rows
   * Each UIAggregate represents a collection like "Routes & Dosing" with multiple data rows
   * Example: [{ displayName: "Routes & Dosing", rows: [[route1_props], [route2_props]] }]
   */
  aggregates?: UIAggregate[];
  
  // ============================================================================
  // HIERARCHICAL RELATIONSHIPS
  // ============================================================================
  
  /** 
   * Array of ancestor entities from root to immediate parent
   * Used for breadcrumb navigation and understanding entity context
   * Example: [{ displayName: "Pharmaceuticals" }, { displayName: "Pain Relievers" }]
   */
  ancestors?: UIEntityRef[];
  
  /** 
   * Array of direct child entities
   * Used for tree view expansion and drill-down navigation
   * Example: [{ displayName: "Bayer Aspirin" }, { displayName: "Generic Aspirin" }]
   */
  children?: UIEntityRef[];
}

export class UIModel {
  private entities: Record<string, UIEntityMeta>;
  private aggregates: Record<string, UIAggregateMeta>;
  private reports: Record<string, UIReportMeta>;

  constructor(
    entities: Record<string, UIEntityMeta>,
    aggregates: Record<string, UIAggregateMeta>,
    reports: Record<string, UIReportMeta> = {}
  ) {
    this.entities = entities;
    this.aggregates = aggregates;
    this.reports = reports;
  }

  // ============================================================================
  // ENTITY OPERATIONS
  // ============================================================================

  /**
   * Get a UI entity definition by name
   */
  getEntity(entityName: string): UIEntityMeta | undefined {
    return this.entities[entityName];
  }

  /**
   * Get all entity names
   */
  getEntityNames(): string[] {
    return Object.keys(this.entities);
  }

  /**
   * Get all entities
   */
  getAllEntities(): Record<string, UIEntityMeta> {
    return { ...this.entities };
  }

  /**
   * Get entity display name
   */
  getEntityDisplayName(entityName: string): string {
    const entity = this.getEntity(entityName);
    return entity?.displayName || entityName;
  }

  /**
   * Get entity plural name
   */
  getEntityPluralName(entityName: string): string {
    const entity = this.getEntity(entityName);
    return entity?.pluralName || entity?.displayName || entityName;
  }

  /**
   * Check if an entity exists
   */
  hasEntity(entityName: string): boolean {
    return entityName in this.entities;
  }

  // ============================================================================
  // ENTITY PROPERTY OPERATIONS
  // ============================================================================

  /**
   * Get all property definitions for an entity
   */
  getEntityProperties(entityName: string): UIProperty[] {
    const entity = this.getEntity(entityName);
    return entity?.propertyDefs || [];
  }

  /**
   * Get visible properties for an entity
   */
  getEntityVisibleProperties(entityName: string): UIProperty[] {
    const properties = this.getEntityProperties(entityName);
    return properties.filter(prop => prop.isVisible);
  }

  /**
   * Get editable properties for an entity
   */
  getEntityEditableProperties(entityName: string): UIProperty[] {
    const properties = this.getEntityProperties(entityName);
    return properties.filter(prop => prop.isVisible && prop.isEditable && !prop.isId);
  }

  /**
   * Get ID properties for an entity
   */
  getEntityIdProperties(entityName: string): UIProperty[] {
    const properties = this.getEntityProperties(entityName);
    return properties.filter(prop => prop.isId);
  }

  /**
   * Get the primary ID property for an entity
   */
  getEntityIdProperty(entityName: string): UIProperty | undefined {
    const idProperties = this.getEntityIdProperties(entityName);
    return idProperties.length > 0 ? idProperties[0] : undefined;
  }

  /**
   * Get required properties for an entity
   */
  getEntityRequiredProperties(entityName: string): UIProperty[] {
    const properties = this.getEntityProperties(entityName);
    return properties.filter(prop => prop.isRequired);
  }

  /**
   * Find a specific property by name in an entity
   */
  findEntityProperty(entityName: string, propertyName: string): UIProperty | undefined {
    const properties = this.getEntityProperties(entityName);
    return properties.find(prop => prop.propertyName === propertyName);
  }

  // ============================================================================
  // ENTITY AGGREGATE OPERATIONS
  // ============================================================================

  /**
   * Get aggregate definitions for an entity
   */
  getEntityAggregates(entityName: string): UIAggregateMeta[] {
    const entity = this.getEntity(entityName);
    if (!entity) return [];
    
    // Map aggregate refs to their full definitions
    return (entity.aggregateRefs || [])
      .map(ref => this.getAggregate(ref.aggregateType))
      .filter((agg): agg is UIAggregateMeta => agg !== undefined);
  }

  /**
   * Find a specific aggregate by type in an entity
   */
  findEntityAggregate(entityName: string, aggregateType: string): UIAggregateMeta | undefined {
    const entity = this.getEntity(entityName);
    if (!entity) return undefined;
    
    // Find the aggregate ref and map to full definition
    const ref = (entity.aggregateRefs || []).find(ref => ref.aggregateType === aggregateType);
    return ref ? this.getAggregate(ref.aggregateType) : undefined;
  }

  // ============================================================================
  // AGGREGATE OPERATIONS
  // ============================================================================

  /**
   * Get an aggregate definition by type
   */
  getAggregate(aggregateType: string): UIAggregateMeta | undefined {
    return this.aggregates[aggregateType];
  }

  /**
   * Get all aggregate types
   */
  getAggregateTypes(): string[] {
    return Object.keys(this.aggregates);
  }

  /**
   * Get all aggregates
   */
  getAllAggregates(): Record<string, UIAggregateMeta> {
    return { ...this.aggregates };
  }

  /**
   * Get aggregate display name
   */
  getAggregateDisplayName(aggregateType: string): string {
    const aggregate = this.getAggregate(aggregateType);
    return aggregate?.displayName || aggregateType;
  }

  /**
   * Check if an aggregate exists
   */
  hasAggregate(aggregateType: string): boolean {
    return aggregateType in this.aggregates;
  }

  // ============================================================================
  // AGGREGATE PROPERTY OPERATIONS
  // ============================================================================

  /**
   * Get all property definitions for an aggregate
   */
  getAggregateProperties(aggregateType: string): UIProperty[] {
    const aggregate = this.getAggregate(aggregateType);
    return aggregate?.propertyDefs || [];
  }

  /**
   * Get visible properties for an aggregate
   */
  getAggregateVisibleProperties(aggregateType: string): UIProperty[] {
    const properties = this.getAggregateProperties(aggregateType);
    return properties.filter(prop => prop.isVisible);
  }

  /**
   * Get editable properties for an aggregate
   */
  getAggregateEditableProperties(aggregateType: string): UIProperty[] {
    const properties = this.getAggregateProperties(aggregateType);
    return properties.filter(prop => prop.isVisible && prop.isEditable && !prop.isId);
  }

  /**
   * Get ID properties for an aggregate
   */
  getAggregateIdProperties(aggregateType: string): UIProperty[] {
    const properties = this.getAggregateProperties(aggregateType);
    return properties.filter(prop => prop.isId);
  }

  /**
   * Get required properties for an aggregate
   */
  getAggregateRequiredProperties(aggregateType: string): UIProperty[] {
    const properties = this.getAggregateProperties(aggregateType);
    return properties.filter(prop => prop.isRequired);
  }

  /**
   * Find a specific property by name in an aggregate
   */
  findAggregateProperty(aggregateType: string, propertyName: string): UIProperty | undefined {
    const properties = this.getAggregateProperties(aggregateType);
    return properties.find(prop => prop.propertyName === propertyName);
  }

  // ============================================================================
  // REPORT OPERATIONS
  // ============================================================================

  /**
   * Get a report definition by type
   */
  getReport(reportType: string): UIReportMeta | undefined {
    return this.reports[reportType];
  }

  /**
   * Get all report types
   */
  getReportTypes(): string[] {
    return Object.keys(this.reports);
  }

  /**
   * Get all reports
   */
  getAllReports(): Record<string, UIReportMeta> {
    return { ...this.reports };
  }

  /**
   * Get report display name
   */
  getReportDisplayName(reportType: string): string {
    const report = this.getReport(reportType);
    return report?.displayName || reportType;
  }

  /**
   * Check if a report exists
   */
  hasReport(reportType: string): boolean {
    return reportType in this.reports;
  }

  // ============================================================================
  // REPORT PROPERTY OPERATIONS
  // ============================================================================

  /**
   * Get all property definitions for a report
   */
  getReportProperties(reportType: string): UIProperty[] {
    const report = this.getReport(reportType);
    return report?.propertyDefs || [];
  }

  /**
   * Get visible properties for a report
   */
  getReportVisibleProperties(reportType: string): UIProperty[] {
    const properties = this.getReportProperties(reportType);
    return properties.filter(prop => prop.isVisible);
  }

  /**
   * Get editable properties for a report
   */
  getReportEditableProperties(reportType: string): UIProperty[] {
    const properties = this.getReportProperties(reportType);
    return properties.filter(prop => prop.isVisible && prop.isEditable && !prop.isId);
  }

  /**
   * Get ID properties for a report
   */
  getReportIdProperties(reportType: string): UIProperty[] {
    const properties = this.getReportProperties(reportType);
    return properties.filter(prop => prop.isId);
  }

  /**
   * Get required properties for a report
   */
  getReportRequiredProperties(reportType: string): UIProperty[] {
    const properties = this.getReportProperties(reportType);
    return properties.filter(prop => prop.isRequired);
  }

  /**
   * Find a specific property by name in a report
   */
  findReportProperty(reportType: string, propertyName: string): UIProperty | undefined {
    const properties = this.getReportProperties(reportType);
    return properties.find(prop => prop.propertyName === propertyName);
  }

  // ============================================================================
  // UTILITY OPERATIONS
  // ============================================================================

  /**
   * Get a summary of the model structure
   */
  getModelSummary(): {
    entityCount: number;
    aggregateCount: number;
    reportCount: number;
    entities: string[];
    aggregates: string[];
    reports: string[];
  } {
    return {
      entityCount: Object.keys(this.entities).length,
      aggregateCount: Object.keys(this.aggregates).length,
      reportCount: Object.keys(this.reports).length,
      entities: Object.keys(this.entities),
      aggregates: Object.keys(this.aggregates),
      reports: Object.keys(this.reports)
    };
  }

  /**
   * Validate the model structure
   */
  validateModel(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate entities
    Object.entries(this.entities).forEach(([name, entity]) => {
      if (!entity.displayName) {
        errors.push(`Entity ${name} missing displayName`);
      }
    });

    // Validate aggregates
    Object.entries(this.aggregates).forEach(([name, aggregate]) => {
      if (!aggregate.displayName) {
        errors.push(`Aggregate ${name} missing displayName`);
      }
    });

    // Validate reports
    Object.entries(this.reports).forEach(([name, report]) => {
      if (!report.reportType) {
        errors.push(`Report ${name} missing reportType`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 

 

