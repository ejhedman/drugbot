import { createServerSupabaseClient } from '../lib/supabase-server';
import { DBTable } from '@/model_defs/DBModel';
import { UIProperty, UIEntityRef } from '@/model_defs';
import { theUIModel, ENTITY_AGGREGATES } from '@/model_instances';

/**
 * Base repository class containing common utilities used by all repositories
 */
export class BaseRepository {
  
  // ============================================================================
  // LOGGING UTILITY
  // ============================================================================
  
  protected log(operation: string, entityType: string, details: any = {}) {
    const timestamp = new Date().toISOString();
    
    console.log('=== DATABASE REPOSITORY OPERATION ===');
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Operation: ${operation}`);
    console.log(`Entity Type: ${entityType}`);
    console.log(`Details:`, JSON.stringify(details, null, 2));
    console.log('=====================================');
  }

  // ============================================================================
  // PROPERTY GENERATION UTILITIES
  // ============================================================================

  /**
   * Get property metadata from UI schema
   * @param tableName - The database table name
   * @param propertyName - The property name to look up
   * @param isChildEntity - Whether this is a child entity
   */
  protected getPropertyMetaFromSchema(tableName: string, propertyName: string, isChildEntity: boolean = false) {
    // Map table names to entity types that match UIModel keys
    const entityTypeMap: Record<string, string> = {
      'generic_drugs': 'GenericDrugs',
      'manu_drugs': 'ManuDrugs'
    };

    const entityType = entityTypeMap[tableName];
    if (!entityType) {
      // Return secure defaults if no schema mapping found - hide everything not explicitly defined
      return {
        isVisible: false,
        isEditable: false,
        isRequired: false,
        isKey: false,
        isId: false,
        controlType: 'text'
      };
    }

    // Get the schema definition
    const schema = theUIModel.getEntity(entityType);
    if (!schema || !schema.propertyDefs) {
      // Return secure defaults if no schema found - hide everything not explicitly defined
      return {
        isVisible: false,
        isEditable: false,
        isRequired: false,
        isKey: false,
        isId: false,
        controlType: 'text'
      };
    }

    // Find the property definition
    const propertyDef = schema.propertyDefs.find(prop => prop.propertyName === propertyName);
    if (propertyDef) {
      return {
        isVisible: propertyDef.isVisible,
        isEditable: propertyDef.isEditable,
        controlType: propertyDef.controlType,
        isRequired: propertyDef.isRequired,
        isId: propertyDef.isId,
        displayName: propertyDef.displayName,
        ordinal: propertyDef.ordinal
      };
    }

    // Return secure defaults if property not found in schema - hide everything not explicitly defined
    return {
      isVisible: false,
      isEditable: false,
      isRequired: false,
      isKey: false,
      isId: false,
      controlType: 'text'
    };
  }

  /**
   * Generate UIEntity properties dynamically from table fields and row data
   * @param table - The database table definition
   * @param rowData - The row data from the database
   * @param options - Options for property generation
   */
  protected generatePropertiesFromTable(
    table: DBTable, 
    rowData: any, 
    options: {
      isChildEntity?: boolean;
      excludeFromEditing?: string[];
    } = {}
  ): UIProperty[] {
    const { isChildEntity = false, excludeFromEditing = [] } = options;
    
    // Find the key field - for child entities, exclude 'generic_key'
    const keyField = isChildEntity 
      ? table.fields.find(field => field.name.includes('_key') && field.name !== 'generic_key')
      : table.fields.find(field => field.name.includes('_key'));
      
    if (!keyField) {
      const entityType = isChildEntity ? 'child' : 'main';
      throw new Error(`No ${entityType} key field found in table ${table.name}`);
    }

    return table.fields
      .filter(field => field.name !== 'uid' && field.name !== 'row') // Skip system fields
      .map((field, index) => {
        // Get metadata from UI schema
        const metadata = this.getPropertyMetaFromSchema(table.name, field.name, isChildEntity);
        
        return {
          propertyName: field.name,
          propertyValue: rowData[field.name] || '',
          ordinal: metadata.ordinal || (index + 1),
          isEditable: metadata.isEditable,
          isVisible: metadata.isVisible,
          isKey: field.name === keyField.name, 
          isId: metadata.isId,
          controlType: (metadata.controlType as UIProperty['controlType']) || 'text',
          isRequired: metadata.isRequired,
          ...(metadata.displayName && { displayName: metadata.displayName })
        };
      });
  }

  /**
   * Find the key field in a table definition
   * @param table - The database table definition
   * @param isChildEntity - Whether this is a child entity (excludes 'generic_key')
   */
  protected findKeyField(table: DBTable, isChildEntity: boolean = false) {
    return isChildEntity 
      ? table.fields.find(field => field.name.includes('_key') && field.name !== 'generic_key')
      : table.fields.find(field => field.name.includes('_key'));
  }

  /**
   * Find the name/display field in a table definition
   * @param table - The database table definition
   */
  protected findNameField(table: DBTable) {
    return table.fields.find(field => field.name.includes('_name') || field.name.includes('name'));
  }

  // ============================================================================
  // RELATIONSHIP UTILITIES
  // ============================================================================

  /**
   * Fetch children entities for a given ancestor entity UID
   * @param ancestorUid - The UID of the ancestor entity
   * @param childTable - The table definition for child entities
   */
  protected async fetchChildrenForEntity(ancestorUid: string, childTable: DBTable): Promise<UIEntityRef[]> {
    this.log('FETCH_CHILDREN_FOR_ENTITY', 'RELATIONSHIPS', { ancestorUid, childTableName: childTable.name });
    const supabase = await this.getSupabaseClient();

    const keyField = this.findKeyField(childTable, true);
    const nameField = this.findNameField(childTable);
    
    if (!keyField || !nameField) {
      throw new Error(`Missing key or name field in child table ${childTable.name}`);
    }

    const { data, error } = await supabase
      .from('entity_relationships_detailed')
      .select('child_uid, child_key, child_name')
      .eq('ancestor_uid', ancestorUid);

    if (error) {
      this.log('FETCH_CHILDREN_FOR_ENTITY_ERROR', 'RELATIONSHIPS', { ancestorUid, error: error.message });
      throw new Error(`Failed to fetch children: ${error.message}`);
    }

    const children: UIEntityRef[] = data.map(row => ({
      entityUid: row.child_uid,
      displayName: row.child_name,
      ancestors: [], // Populated separately if needed
      children: [] // Child entities typically don't have children themselves
    }));

    this.log('FETCH_CHILDREN_FOR_ENTITY_SUCCESS', 'RELATIONSHIPS', { 
      ancestorUid, 
      childCount: children.length 
    });
    return children;
  }

  /**
   * Fetch ancestor entities for a given child entity UID
   * @param childUid - The UID of the child entity
   * @param ancestorTable - The table definition for ancestor entities
   */
  protected async fetchAncestorsForEntity(childUid: string, ancestorTable: DBTable): Promise<UIEntityRef[]> {
    this.log('FETCH_ANCESTORS_FOR_ENTITY', 'RELATIONSHIPS', { childUid, ancestorTableName: ancestorTable.name });
    const supabase = await this.getSupabaseClient();

    const keyField = this.findKeyField(ancestorTable);
    const nameField = this.findNameField(ancestorTable);
    
    if (!keyField || !nameField) {
      throw new Error(`Missing key or name field in ancestor table ${ancestorTable.name}`);
    }

    const { data, error } = await supabase
      .from('entity_relationships_detailed')
      .select('ancestor_uid, ancestor_key, ancestor_name')
      .eq('child_uid', childUid);

    if (error) {
      this.log('FETCH_ANCESTORS_FOR_ENTITY_ERROR', 'RELATIONSHIPS', { childUid, error: error.message });
      throw new Error(`Failed to fetch ancestors: ${error.message}`);
    }

    const ancestors: UIEntityRef[] = data.map(row => ({
      entityUid: row.ancestor_uid,
      displayName: row.ancestor_name,
      ancestors: [], // Ancestors typically don't have ancestors themselves  
      children: [] // Populated separately if needed
    }));

    this.log('FETCH_ANCESTORS_FOR_ENTITY_SUCCESS', 'RELATIONSHIPS', { 
      childUid, 
      ancestorCount: ancestors.length 
    });
    return ancestors;
  }

  /**
   * Create a relationship entry in the entity_relationships table
   * @param ancestorUid - The UID of the ancestor entity
   * @param childUid - The UID of the child entity
   * @param relationshipType - The type of relationship (default: 'parent_child')
   */
  protected async createEntityRelationship(
    ancestorUid: string, 
    childUid: string, 
    relationshipType: string = 'parent_child'
  ): Promise<void> {
    this.log('CREATE_ENTITY_RELATIONSHIP', 'RELATIONSHIPS', { 
      ancestorUid, 
      childUid, 
      relationshipType 
    });
    const supabase = await this.getSupabaseClient();

    const { error } = await supabase
      .from('entity_relationships')
      .insert({
        ancestor_uid: ancestorUid,
        child_uid: childUid,
        relationship_type: relationshipType
      });

    if (error) {
      this.log('CREATE_ENTITY_RELATIONSHIP_ERROR', 'RELATIONSHIPS', { 
        ancestorUid, 
        childUid, 
        error: error.message 
      });
      throw new Error(`Failed to create entity relationship: ${error.message}`);
    }

    this.log('CREATE_ENTITY_RELATIONSHIP_SUCCESS', 'RELATIONSHIPS', { 
      ancestorUid, 
      childUid, 
      relationshipType 
    });
  }

  // ============================================================================
  // KEY GENERATION
  // ============================================================================
  
  protected generateKey(prefix: string): string {
    const key = `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.log('GENERATE_KEY', prefix, { generatedKey: key });
    return key;
  }

  // ============================================================================
  // SUPABASE CLIENT
  // ============================================================================
  
  protected async getSupabaseClient() {
    return await createServerSupabaseClient();
  }
} 