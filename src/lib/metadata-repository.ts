import { ENTITIES } from '../model_instances';
import { UIEntity, UIProperty } from '../model_defs/UIModel';

interface RepositoryOptions {
  dataPath?: string;
  databaseUrl?: string; // For future Supabase integration
}

class MetadataRepository {
  private schemas: typeof ENTITIES;
  private options: RepositoryOptions;

  constructor(options: RepositoryOptions = {}) {
    this.schemas = ENTITIES;
    this.options = {
      dataPath: options.dataPath || 'data',
      ...options
    };
  }

  // ============================================================================
  // SCHEMA OPERATIONS
  // ============================================================================

  getEntitySchema(entityName: string): UIEntity | undefined {
    return this.schemas[entityName];
  }

  // getEntitySchemaByTable(tableName: string): UIEntity | undefined {
  //   return getSchemaByTableName(tableName);
  // }

  getAllSchemas(): typeof ENTITIES {
    return this.schemas;
  }

  getDisplayName(entityName: string): string {
    const schema = this.getEntitySchema(entityName);
    return schema?.displayName || entityName;
  }

  getPluralName(entityName: string): string {
    const schema = this.getEntitySchema(entityName);
    return schema?.pluralName || `${entityName}s`;
  }

  // ============================================================================
  // FIELD OPERATIONS
  // ============================================================================

  getVisibleFields(entityName: string): UIProperty[] {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return [];
    
    return (schema.properties || []).filter((field: UIProperty) => field.visibility === 'visible');
  }

  getEditableFields(entityName: string): UIProperty[] {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return [];
    
    return (schema.properties || []).filter((field: UIProperty) => 
      field.visibility === 'visible' && !(field as any).isId
    );
  }

  getKeyFields(entityName: string): UIProperty[] {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return [];
    
    return (schema.properties || []).filter((field: UIProperty) => field.is_key || (field as any).isId);
  }

  getPrimaryKeyField(entityName: string): UIProperty | undefined {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return undefined;
    
    return (schema.properties || []).find((field: UIProperty) => (field as any).isId);
  }

  getReadableKeyField(entityName: string): UIProperty | undefined {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return undefined;
    
    return (schema.properties || []).find((field: UIProperty) => field.is_key && !(field as any).isId);
  }

  // ============================================================================
  // VALIDATION
  // ============================================================================

  validateEntityData(entityName: string, data: Record<string, any>): { 
    isValid: boolean; 
    errors: string[] 
  } {
    const schema = this.getEntitySchema(entityName);
    if (!schema) {
      return { isValid: false, errors: [`Schema not found for entity: ${entityName}`] };
    }

    const errors: string[] = [];

    // Check required fields
    for (const field of (schema.properties || [])) {
      if (field.isRequired && (data[field.property_name] === undefined || data[field.property_name] === null || data[field.property_name] === '')) {
        errors.push(`${field.displayName} is required`);
      }

      // Type validation
      if (data[field.property_name] !== undefined && data[field.property_name] !== null) {
        const value = data[field.property_name];
        
        switch (field.type) {
          case 'number':
            if (typeof value !== 'number' && isNaN(Number(value))) {
              errors.push(`${field.displayName} must be a number`);
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean' && value !== 0 && value !== 1 && value !== 'true' && value !== 'false') {
              errors.push(`${field.displayName} must be a boolean value`);
            }
            break;
          case 'date':
            if (!(value instanceof Date) && isNaN(Date.parse(value))) {
              errors.push(`${field.displayName} must be a valid date`);
            }
            break;
          case 'enum':
            if (field.enumValues && !field.enumValues.includes(value)) {
              errors.push(`${field.displayName} must be one of: ${field.enumValues.join(', ')}`);
            }
            break;
        }

        // Custom validation patterns
        if (field.validation?.pattern && typeof value === 'string') {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(value)) {
            errors.push(`${field.displayName} format is invalid`);
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ============================================================================
  // KEY GENERATION
  // ============================================================================

  generateKey(entityName: string, prefix?: string): string {
    const schema = this.getEntitySchema(entityName);
    if (!schema) {
      throw new Error(`Schema not found for entity: ${entityName}`);
    }

    const keyField = this.getReadableKeyField(entityName);
    const keyPrefix = prefix || keyField?.property_name.replace('_key', '') || entityName;
    
    return `${keyPrefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateId(): string {
    // For UUID generation - in real implementation, use crypto.randomUUID() or similar
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============================================================================
  // DATA TRANSFORMATION
  // ============================================================================

  transformForDatabase(entityName: string, data: Record<string, any>): Record<string, any> {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return data;

    const transformed = { ...data };

    for (const field of (schema.properties || [])) {
      if (transformed[field.property_name] !== undefined) {
        switch (field.type) {
          case 'boolean':
            // Convert to integer for database storage if needed
            if (field.sqlType?.includes('INTEGER')) {
              transformed[field.property_name] = transformed[field.property_name] ? 1 : 0;
            }
            break;
          case 'date':
            // Ensure proper date format
            if (typeof transformed[field.property_name] === 'string') {
              transformed[field.property_name] = new Date(transformed[field.property_name]).toISOString().split('T')[0];
            }
            break;
        }
      }
    }

    return transformed;
  }

  transformFromDatabase(entityName: string, data: Record<string, any>): Record<string, any> {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return data;

    const transformed = { ...data };

    for (const field of (schema.properties || [])) {
      if (transformed[field.property_name] !== undefined) {
        switch (field.type) {
          case 'boolean':
            // Convert from integer back to boolean if needed
            if (field.sqlType?.includes('INTEGER')) {
              transformed[field.property_name] = transformed[field.property_name] === 1;
            }
            break;
          case 'number':
            if (typeof transformed[field.property_name] === 'string') {
              transformed[field.property_name] = Number(transformed[field.property_name]);
            }
            break;
          case 'date':
            if (typeof transformed[field.property_name] === 'string') {
              transformed[field.property_name] = new Date(transformed[field.property_name]);
            }
            break;
        }
      }
    }

    return transformed;
  }

  // ============================================================================
  // UI HELPERS
  // ============================================================================

  getFieldsForTab(entityName: string, tabId: string): UIProperty[] {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return [];

    const aggregate = (schema.aggregates || []).find((sc: any) => sc.id === tabId);
    if (!aggregate || aggregate.type !== 'properties') return [];

    if (!aggregate.properties || aggregate.properties.length === 0) return this.getVisibleFields(entityName);

    // Extract property names from the aggregate's properties array
    const aggregatePropertyNames = aggregate.properties.map(prop => prop.property_name);

    return (schema.properties || []).filter((field: UIProperty) => 
      aggregatePropertyNames.includes(field.property_name) && field.visibility === 'visible'
    );
  }

  getRelationshipTabs(entityName: string): Array<{ 
    id: string; 
    displayName: string; 
    entityName: string;
    relationship: any;
  }> {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return [];

    return (schema.aggregates || [])
      .filter((aggregate: any) => aggregate.type === 'collection')
      .map((aggregate: any) => {
        const relationship = (schema.children || []).find((rel: any) => 
          rel.entity_id === aggregate.collectionEntity
        );
        return {
          id: aggregate.id || 'unknown',
          displayName: aggregate.displayName,
          entityName: aggregate.collectionEntity!,
          relationship
        };
      });
  }

  // ============================================================================
  // CLIENT METADATA GENERATION
  // ============================================================================

  generateClientMetadata(): Record<string, any> {
    const clientMetadata: Record<string, any> = {};

    for (const [entityName, schema] of Object.entries(this.schemas)) {
      clientMetadata[entityName] = {
        displayName: schema.displayName,
        pluralName: schema.pluralName,
        comment: schema.comment,
        fields: (schema.properties || []).reduce((acc: any, field: UIProperty) => {
          acc[field.property_name] = {
            displayName: field.displayName,
            controlType: field.controlType,
            visibility: field.visibility,
            placeholder: field.placeholder,
            validation: field.validation,
            type: field.type,
            enumValues: field.enumValues,
            isRequired: field.isRequired
          };
          return acc;
        }, {} as Record<string, any>),
        aggregates: schema.aggregates,
        relationships: schema.children
      };
    }

    return clientMetadata;
  }

  // ============================================================================
  // LOGGING AND DEBUGGING
  // ============================================================================

  logOperation(operation: string, entityName: string, details: any = {}) {
    const timestamp = new Date().toISOString();
    const schema = this.getEntitySchema(entityName);
    
    console.log('=== METADATA REPOSITORY OPERATION ===');
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Operation: ${operation}`);
    console.log(`Entity: ${entityName} (${schema?.displayName || 'Unknown'})`);
    console.log(`Table: ${schema?.tableName || 'Unknown'}`);
    console.log(`Details:`, JSON.stringify(details, null, 2));
    console.log('======================================');
  }
}

export default MetadataRepository;
export { MetadataRepository }; 