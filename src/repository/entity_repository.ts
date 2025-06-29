import { BaseRepository } from './base_repository';
import { UIEntity, UIEntityRef } from '@/model_defs';
import { 
  DBTable,
  CreateEntityRequest,
  UpdateEntityRequest
} from '@/model_defs/DBModel';
import { manuDrugsTable, genericDrugsTable } from './thedb';

/**
 * Repository for Entity operations (generic_drugs table)
 * Handles CRUD operations for main entities
 */
export class EntityRepository extends BaseRepository {
  
  // ============================================================================
  // ENTITY OPERATIONS (generic_drugs table)
  // ============================================================================

  async getAllEntities(table: DBTable): Promise<UIEntity[]> {
    this.log('GET_ALL_AS_UI_ENTITIES', 'ENTITIES', { tableName: table.name });
    const supabase = await this.getSupabaseClient();
    
    // Find the name field for ordering
    const nameField = this.findNameField(table);
    const orderBy = nameField ? nameField.name : 'uid';
    
    const { data, error } = await supabase
      .from(table.name)
      .select('*')
      .order(orderBy);

    if (error) {
      this.log('GET_ALL_AS_UI_ENTITIES_ERROR', 'ENTITIES', { tableName: table.name, error: error.message });
      throw new Error(`Failed to fetch entities: ${error.message}`);
    }

    // Find the key and name fields for entity mapping
    const keyField = this.findKeyField(table);
    if (!keyField) {
      throw new Error(`No key field found in table ${table.name}`);
    }

    const entities: UIEntity[] = data.map(row => ({
      entityUid: row.uid,
      entityKey: row[keyField.name],
      displayName: nameField ? row[nameField.name] : row[keyField.name],
      properties: this.generatePropertiesFromTable(table, row),
      aggregates: [],
      ancestors: [], // Root entities have no ancestors
      children: [] // Will be populated when expanded
    }));

    this.log('GET_ALL_AS_UI_ENTITIES_SUCCESS', 'ENTITIES', { tableName: table.name, recordCount: entities.length });
    return entities;
  }

  async getEntityByKey(
    entityKey: string, 
    table: DBTable, 
    options: { isChildEntity?: boolean; childTable?: DBTable; parentTable?: DBTable } = {}
  ): Promise<UIEntity | null> {
    const { isChildEntity = false, childTable = manuDrugsTable, parentTable = genericDrugsTable } = options;
    
    this.log('GET_BY_KEY_AS_UI_ENTITY', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
      entityKey, 
      tableName: table.name,
      isChildEntity 
    });
    const supabase = await this.getSupabaseClient();
    
    // Extract table name from the DBTable parameter
    const tableName = table.name;
    
    // Find the key field - for child entities, exclude 'generic_key'
    const keyField = this.findKeyField(table, isChildEntity);
    if (!keyField) {
      throw new Error(`No key field found in table ${tableName}`);
    }
    
    // Find the name field - assume it's the field that contains '_name' or 'name'
    const nameField = this.findNameField(table);
    if (!nameField) {
      throw new Error(`No name field found in table ${tableName}`);
    }

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq(keyField.name, entityKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        this.log('GET_BY_KEY_AS_UI_ENTITY_NOT_FOUND', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
          entityKey, 
          tableName 
        });
        return null;
      }
      this.log('GET_BY_KEY_AS_UI_ENTITY_ERROR', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
        entityKey, 
        tableName, 
        error: error.message 
      });
      throw new Error(`Failed to fetch entity: ${error.message}`);
    }

    const displayName = data[nameField.name];
    
    // Always try to fetch both children and ancestors
    let children: UIEntityRef[] = [];
    let ancestors: UIEntityRef[] = [];
    
    try {
      if (isChildEntity) {
        // For child entities, fetch ancestors from the parent table
        ancestors = await this.fetchAncestorsForEntity(data.uid, parentTable);
        // Child entities typically don't have children, but we'll check anyway
        children = await this.fetchChildrenForEntity(data.uid, childTable);
      } else {
        // For parent entities, fetch children from the child table
        children = await this.fetchChildrenForEntity(data.uid, childTable);
        // Parent entities typically don't have ancestors, but we'll check anyway
        ancestors = await this.fetchAncestorsForEntity(data.uid, parentTable);
      }
    } catch (error) {
      // Log the error but don't fail the whole request if relationships fail
      console.warn(`Failed to fetch ${isChildEntity ? 'ancestors' : 'children'} relationships:`, error);
    }
    
    const entity: UIEntity = {
      entityUid: data.uid,
      entityKey: data[keyField.name],
      displayName: displayName,
      properties: this.generatePropertiesFromTable(table, data, { isChildEntity }),
      aggregates: [],
      ancestors: ancestors,
      children: children
    };

    this.log('GET_BY_KEY_AS_UI_ENTITY_SUCCESS', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
      entityKey, 
      tableName, 
      entityName: entity.displayName, 
      childrenCount: children.length,
      ancestorCount: ancestors.length,
      isChildEntity
    });
    return entity;
  }

  async searchEntities(searchTerm: string, table: DBTable): Promise<UIEntity[]> {
    this.log('SEARCH_AS_UI_ENTITIES', 'ENTITIES', { searchTerm, tableName: table.name });
    const supabase = await this.getSupabaseClient();
    
    // Find name field for ordering and searching
    const nameField = this.findNameField(table);
    const orderBy = nameField ? nameField.name : 'uid';
    
    let query = supabase
      .from(table.name)
      .select('*')
      .order(orderBy);

    if (searchTerm && nameField) {
      // Search in name field and other text/varchar fields
      const textFields = table.fields.filter(f => 
        f.datatype.toLowerCase().includes('varchar') || 
        f.datatype.toLowerCase().includes('text') ||
        f.datatype.toLowerCase().includes('char')
      );
      const searchConditions = textFields.map(f => `${f.name}.ilike.%${searchTerm}%`).join(',');
      if (searchConditions) {
        query = query.or(searchConditions);
      }
    }

    const { data, error } = await query;

    if (error) {
      this.log('SEARCH_AS_UI_ENTITIES_ERROR', 'ENTITIES', { searchTerm, tableName: table.name, error: error.message });
      throw new Error(`Failed to search entities: ${error.message}`);
    }

    // Find the key field for entity mapping
    const keyField = this.findKeyField(table);
    if (!keyField) {
      throw new Error(`No key field found in table ${table.name}`);
    }

    const entities: UIEntity[] = data.map(row => ({
      entityUid: row.uid,
      entityKey: row[keyField.name],
      displayName: nameField ? row[nameField.name] : row[keyField.name],
      properties: this.generatePropertiesFromTable(table, row),
      aggregates: [],
      ancestors: [], // Root entities have no ancestors
      children: [] // Will be populated when expanded
    }));

    this.log('SEARCH_AS_UI_ENTITIES_SUCCESS', 'ENTITIES', { 
      searchTerm, 
      tableName: table.name,
      matchedRecords: entities.length 
    });
    return entities;
  }

  async createEntity(data: CreateEntityRequest, table: DBTable): Promise<UIEntity> {
    this.log('CREATE_AS_UI_ENTITY', 'ENTITIES', { data, tableName: table.name });
    const supabase = await this.getSupabaseClient();
    
    // Find key and name fields
    const keyField = this.findKeyField(table);
    const nameField = this.findNameField(table);
    
    if (!keyField || !nameField) {
      throw new Error(`Key or name field not found in table ${table.name}`);
    }
    
    // Generate key based on table prefix
    const keyPrefix = keyField.name.replace('_key', '');
    const generatedKey = this.generateKey(keyPrefix);
    
    // Build the new entity data dynamically
    const newEntity: any = {
      [keyField.name]: generatedKey,
      [nameField.name]: data.displayName
    };
    
    // Add dynamic properties from the request
    if (data.properties) {
      Object.entries(data.properties).forEach(([propertyName, propertyValue]) => {
        // Find the corresponding field in the table
        const field = table.fields.find(f => 
          f.name === propertyName && 
          f.name !== keyField.name && 
          f.name !== nameField.name && 
          f.name !== 'uid' &&
          !f.is_primary_key
        );
        if (field) {
          newEntity[field.name] = propertyValue;
        }
      });
    }

    const { data: inserted, error } = await supabase
      .from(table.name)
      .insert(newEntity)
      .select()
      .single();

    if (error) {
      this.log('CREATE_AS_UI_ENTITY_ERROR', 'ENTITIES', { data, tableName: table.name, error: error.message });
      throw new Error(`Failed to create entity: ${error.message}`);
    }

    const entity: UIEntity = {
      entityUid: inserted.uid,
      entityKey: inserted[keyField.name],
      displayName: inserted[nameField.name],
      properties: this.generatePropertiesFromTable(table, inserted),
      aggregates: [],
      ancestors: [], // Root entities have no ancestors
      children: [] // Will be populated when expanded
    };

    this.log('CREATE_AS_UI_ENTITY_SUCCESS', 'ENTITIES', { tableName: table.name, newEntity: entity });
    return entity;
  }

  async updateEntity(entityKey: string, data: UpdateEntityRequest, table: DBTable): Promise<UIEntity | null> {
    this.log('UPDATE_AS_UI_ENTITY', 'ENTITIES', { entityKey, data, tableName: table.name });
    const supabase = await this.getSupabaseClient();
    
    // Find key and name fields
    const keyField = this.findKeyField(table);
    const nameField = this.findNameField(table);
    
    if (!keyField) {
      throw new Error(`Key field not found in table ${table.name}`);
    }
    
    const updateData: any = {};
    
    // Update display name if provided
    if (data.displayName !== undefined && nameField) {
      updateData[nameField.name] = data.displayName;
    }
    
    // Update dynamic properties if provided
    if (data.properties) {
      Object.entries(data.properties).forEach(([propertyName, propertyValue]) => {
        // Find the corresponding field in the table
        const field = table.fields.find(f => 
          f.name === propertyName && 
          f.name !== keyField.name && 
          f.name !== nameField?.name && 
          f.name !== 'uid' &&
          !f.is_primary_key
        );
        if (field) {
          updateData[field.name] = propertyValue;
        }
      });
    }

    const { data: updated, error } = await supabase
      .from(table.name)
      .update(updateData)
      .eq(keyField.name, entityKey)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        this.log('UPDATE_AS_UI_ENTITY_NOT_FOUND', 'ENTITIES', { entityKey, tableName: table.name });
        return null;
      }
      this.log('UPDATE_AS_UI_ENTITY_ERROR', 'ENTITIES', { entityKey, data, tableName: table.name, error: error.message });
      throw new Error(`Failed to update entity: ${error.message}`);
    }

    const entity: UIEntity = {
      entityUid: updated.uid,
      entityKey: updated[keyField.name],
      displayName: nameField ? updated[nameField.name] : updated[keyField.name],
      properties: this.generatePropertiesFromTable(table, updated),
      aggregates: [],
      ancestors: [], // Root entities have no ancestors
      children: [] // Will be populated when expanded
    };

    this.log('UPDATE_AS_UI_ENTITY_SUCCESS', 'ENTITIES', { entityKey, tableName: table.name, updatedEntity: entity });
    return entity;
  }

  async deleteEntity(
    entityKey: string, 
    table: DBTable, 
    options: { isChildEntity?: boolean } = {}
  ): Promise<boolean> {
    const { isChildEntity = false } = options;
    
    this.log('DELETE', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
      entityKey, 
      tableName: table.name,
      isChildEntity 
    });
    const supabase = await this.getSupabaseClient();
    
    // Find the key field - for child entities, exclude 'generic_key'
    const keyField = this.findKeyField(table, isChildEntity);
    if (!keyField) {
      throw new Error(`Key field not found in table ${table.name}`);
    }
    
    const { error } = await supabase
      .from(table.name)
      .delete()
      .eq(keyField.name, entityKey);

    if (error) {
      this.log('DELETE_ERROR', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
        entityKey, 
        tableName: table.name, 
        isChildEntity,
        error: error.message 
      });
      throw new Error(`Failed to delete entity: ${error.message}`);
    }

    this.log('DELETE_SUCCESS', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
      entityKey, 
      tableName: table.name,
      isChildEntity 
    });
    return true;
  }
} 