import { ENTITY_SCHEMAS, EntitySchema, EntityField, getSchemaByTableName } from './schema';

interface RepositoryOptions {
  dataPath?: string;
  databaseUrl?: string; // For future Supabase integration
}

class MetadataRepository {
  private schemas: typeof ENTITY_SCHEMAS;
  private options: RepositoryOptions;

  constructor(options: RepositoryOptions = {}) {
    this.schemas = ENTITY_SCHEMAS;
    this.options = {
      dataPath: options.dataPath || 'data',
      ...options
    };
  }

  // ============================================================================
  // SCHEMA OPERATIONS
  // ============================================================================

  getEntitySchema(entityName: string): EntitySchema | undefined {
    return this.schemas[entityName];
  }

  getEntitySchemaByTable(tableName: string): EntitySchema | undefined {
    return getSchemaByTableName(tableName);
  }

  getAllSchemas(): typeof ENTITY_SCHEMAS {
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

  getVisibleFields(entityName: string): EntityField[] {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return [];
    
    return schema.fields.filter(field => field.ui.visibility === 'visible');
  }

  getEditableFields(entityName: string): EntityField[] {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return [];
    
    return schema.fields.filter(field => 
      field.ui.visibility === 'visible' && !field.isId
    );
  }

  getKeyFields(entityName: string): EntityField[] {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return [];
    
    return schema.fields.filter(field => field.isKey || field.isId);
  }

  getPrimaryKeyField(entityName: string): EntityField | undefined {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return undefined;
    
    return schema.fields.find(field => field.isId);
  }

  getReadableKeyField(entityName: string): EntityField | undefined {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return undefined;
    
    return schema.fields.find(field => field.isKey && !field.isId);
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
    for (const field of schema.fields) {
      if (field.isRequired && (data[field.name] === undefined || data[field.name] === null || data[field.name] === '')) {
        errors.push(`${field.ui.displayName} is required`);
      }

      // Type validation
      if (data[field.name] !== undefined && data[field.name] !== null) {
        const value = data[field.name];
        
        switch (field.type) {
          case 'number':
            if (typeof value !== 'number' && isNaN(Number(value))) {
              errors.push(`${field.ui.displayName} must be a number`);
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean' && value !== 0 && value !== 1 && value !== 'true' && value !== 'false') {
              errors.push(`${field.ui.displayName} must be a boolean value`);
            }
            break;
          case 'date':
            if (!(value instanceof Date) && isNaN(Date.parse(value))) {
              errors.push(`${field.ui.displayName} must be a valid date`);
            }
            break;
          case 'enum':
            if (field.enumValues && !field.enumValues.includes(value)) {
              errors.push(`${field.ui.displayName} must be one of: ${field.enumValues.join(', ')}`);
            }
            break;
        }

        // Custom validation patterns
        if (field.ui.validation?.pattern && typeof value === 'string') {
          const regex = new RegExp(field.ui.validation.pattern);
          if (!regex.test(value)) {
            errors.push(`${field.ui.displayName} format is invalid`);
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
    const keyPrefix = prefix || keyField?.name.replace('_key', '') || entityName;
    
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

    for (const field of schema.fields) {
      if (transformed[field.name] !== undefined) {
        switch (field.type) {
          case 'boolean':
            // Convert to integer for database storage if needed
            if (field.sqlType?.includes('INTEGER')) {
              transformed[field.name] = transformed[field.name] ? 1 : 0;
            }
            break;
          case 'date':
            // Ensure proper date format
            if (typeof transformed[field.name] === 'string') {
              transformed[field.name] = new Date(transformed[field.name]).toISOString().split('T')[0];
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

    for (const field of schema.fields) {
      if (transformed[field.name] !== undefined) {
        switch (field.type) {
          case 'boolean':
            // Convert from integer back to boolean if needed
            if (field.sqlType?.includes('INTEGER')) {
              transformed[field.name] = transformed[field.name] === 1;
            }
            break;
          case 'number':
            if (typeof transformed[field.name] === 'string') {
              transformed[field.name] = Number(transformed[field.name]);
            }
            break;
          case 'date':
            if (typeof transformed[field.name] === 'string') {
              transformed[field.name] = new Date(transformed[field.name]);
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

  getFieldsForTab(entityName: string, tabId: string): EntityField[] {
    const schema = this.getEntitySchema(entityName);
    if (!schema) return [];

    const tab = schema.tabs.find(t => t.id === tabId);
    if (!tab || tab.type !== 'properties') return [];

    if (!tab.fields) return this.getVisibleFields(entityName);

    return schema.fields.filter(field => 
      tab.fields!.includes(field.name) && field.ui.visibility === 'visible'
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

    return schema.tabs
      .filter(tab => tab.type === 'collection')
      .map(tab => {
        const relationship = schema.relationships.find(rel => 
          rel.targetEntity === tab.collectionEntity
        );
        return {
          id: tab.id,
          displayName: tab.displayName,
          entityName: tab.collectionEntity!,
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
        fields: schema.fields.reduce((acc, field) => {
          acc[field.name] = {
            displayName: field.ui.displayName,
            controlType: field.ui.controlType,
            visibility: field.ui.visibility,
            placeholder: field.ui.placeholder,
            validation: field.ui.validation,
            type: field.type,
            enumValues: field.enumValues,
            isRequired: field.isRequired
          };
          return acc;
        }, {} as Record<string, any>),
        tabs: schema.tabs,
        relationships: schema.relationships
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