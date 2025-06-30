import { BaseRepository } from './base_repository';
import { UIEntity, UIEntityRef } from '@/model_defs';
import { 
  DBTable,
  CreateEntityRequest,
  UpdateEntityRequest,
  CreateChildEntityRequest,
  UpdateChildEntityRequest
} from '@/model_defs/DBModel';
import { manuDrugsTable, genericDrugsTable } from '../model_instances/TheDBModel';

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

    // Query by key field to get the entity data
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
    const entityUid = data.uid; // Get the UID for relationship queries
    
    // Always try to fetch both children and ancestors using UIDs
    let children: UIEntityRef[] = [];
    let ancestors: UIEntityRef[] = [];
    
    try {
      if (isChildEntity) {
        // For child entities, fetch ancestors from the parent table using UID
        ancestors = await this.fetchAncestorsForEntity(entityUid, parentTable);
        // Child entities typically don't have children, but we'll check anyway
        children = await this.fetchChildrenForEntity(entityUid, childTable);
      } else {
        // For parent entities, fetch children from the child table using UID
        children = await this.fetchChildrenForEntity(entityUid, childTable);
        // Parent entities typically don't have ancestors, but we'll check anyway
        ancestors = await this.fetchAncestorsForEntity(entityUid, parentTable);
      }
    } catch (error) {
      // Log the error but don't fail the whole request if relationships fail
      console.warn(`Failed to fetch ${isChildEntity ? 'ancestors' : 'children'} relationships:`, error);
    }
    
    const entity: UIEntity = {
      entityUid: entityUid,
      entityKey: data[keyField.name],
      displayName: displayName,
      properties: this.generatePropertiesFromTable(table, data, { isChildEntity }),
      aggregates: [],
      ancestors: ancestors,
      children: children
    };

    this.log('GET_BY_KEY_AS_UI_ENTITY_SUCCESS', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
      entityKey, 
      entityUid,
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

  async getChildUIEntitiesByEntityKey(entityKey: string, table: DBTable): Promise<UIEntity[]> {
    this.log('GET_AS_UI_ENTITIES_BY_ENTITY_KEY', 'CHILD_ENTITIES', { entityKey, tableName: table.name });
    const supabase = await this.getSupabaseClient();
    
    // Extract table name from the DBTable parameter
    const tableName = table.name;
    
    // Find the key field for the entity table - assume it's the field that contains '_key' and isn't 'generic_key'
    const keyField = this.findKeyField(table, true);
    if (!keyField) {
      throw new Error(`No entity key field found in table ${tableName}`);
    }
    
    // Find the name field - assume it's the field that contains '_name' or 'name'
    const nameField = this.findNameField(table);
    if (!nameField) {
      throw new Error(`No name field found in table ${tableName}`);
    }
    
    // First, get the parent entity UID from the generic_key
    const { data: parentData, error: parentError } = await supabase
      .from('generic_drugs')
      .select('uid')
      .eq('generic_key', entityKey)
      .single();

    if (parentError || !parentData) {
      this.log('GET_AS_UI_ENTITIES_BY_ENTITY_KEY_PARENT_NOT_FOUND', 'CHILD_ENTITIES', { entityKey, tableName });
      return [];
    }

    const parentUid = parentData.uid;
    
    // Query child entities using the parent UID (generic_uid)
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('generic_uid', parentUid)
      .order(nameField.name);

    if (error) {
      this.log('GET_AS_UI_ENTITIES_BY_ENTITY_KEY_ERROR', 'CHILD_ENTITIES', { entityKey, parentUid, tableName, error: error.message });
      throw new Error(`Failed to fetch entity entities: ${error.message}`);
    }

    if (data.length === 0) {
      this.log('GET_AS_UI_ENTITIES_BY_ENTITY_KEY_SUCCESS', 'CHILD_ENTITIES', { 
        entityKey, 
        parentUid,
        tableName,
        recordCount: 0
      });
      return [];
    }

    // Fetch ancestors for each entity entity using UIDs
    const children: UIEntity[] = await Promise.all(
      data.map(async (row) => {
        const ancestors = await this.fetchAncestorsForEntity(row.uid, genericDrugsTable);
        
        return {
          entityUid: row.uid,
          entityKey: row[keyField.name],
          displayName: row[nameField.name],
          properties: this.generatePropertiesFromTable(table, row, { isChildEntity: true }),
          aggregates: [],
          ancestors: ancestors, // Populated from relationships table
          children: [] // Child entities typically don't have children
        };
      })
    );

    this.log('GET_AS_UI_ENTITIES_BY_ENTITY_KEY_SUCCESS', 'CHILD_ENTITIES', { 
      entityKey, 
      parentUid,
      tableName,
      recordCount: children.length 
    });
    return children;
  }

  async createChildEntityAsUIEntity(data: CreateChildEntityRequest, table: DBTable): Promise<UIEntity> {
    this.log('CREATE_AS_UI_ENTITY', 'CHILD_ENTITIES', { data, tableName: table.name });
    const supabase = await this.getSupabaseClient();
    
    // Extract table name and find key/name fields
    const tableName = table.name;
    const keyField = this.findKeyField(table, true);
    const nameField = this.findNameField(table);
    
    if (!keyField) {
      throw new Error(`No entity key field found in table ${tableName}`);
    }
    if (!nameField) {
      throw new Error(`No name field found in table ${tableName}`);
    }

    // First, find the parent entity UID from the parent_entity_key
    const { data: parentData, error: parentError } = await supabase
      .from('generic_drugs')
      .select('uid')
      .eq('generic_key', data.parent_entity_key)
      .single();

    if (parentError || !parentData) {
      this.log('CREATE_AS_UI_ENTITY_ERROR', 'CHILD_ENTITIES', { 
        data, 
        tableName, 
        error: 'Parent entity not found' 
      });
      throw new Error(`Parent entity not found for key: ${data.parent_entity_key}`);
    }
    
    const parentUid = parentData.uid;
    
    const newEntity: any = {
      [keyField.name]: this.generateKey('entity'),
      generic_uid: parentUid, // Use UID for foreign key relationship
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
          f.name !== 'generic_key' &&
          !f.is_primary_key
        );
        if (field) {
          newEntity[field.name] = propertyValue;
        }
      });
    }

    // Insert the new entity entity
    const { data: inserted, error } = await supabase
      .from(tableName)
      .insert(newEntity)
      .select()
      .single();

    if (error) {
      this.log('CREATE_AS_UI_ENTITY_ERROR', 'CHILD_ENTITIES', { data, tableName, error: error.message });
      throw new Error(`Failed to create entity entity: ${error.message}`);
    }

    // Create the relationship entry in entity_relationships table
    await this.createEntityRelationship(parentData.uid, inserted.uid, 'parent_child');

    // Fetch ancestors using the relationship utilities
    const ancestors = await this.fetchAncestorsForEntity(inserted.uid, genericDrugsTable);

    const entity: UIEntity = {
      entityUid: inserted.uid,
      entityKey: inserted[keyField.name],
      displayName: inserted[nameField.name],
      properties: this.generatePropertiesFromTable(table, inserted, { isChildEntity: true }),
      aggregates: [],
      ancestors: ancestors, // Populated from relationships table
      children: [] // Child entities typically don't have children
    };

    this.log('CREATE_AS_UI_ENTITY_SUCCESS', 'CHILD_ENTITIES', { newChild: entity, tableName });
    return entity;
  }

  async updateChildEntityAsUIEntity(entityKey: string, data: UpdateChildEntityRequest, table: DBTable): Promise<UIEntity | null> {
    this.log('UPDATE_AS_UI_ENTITY', 'CHILD_ENTITIES', { childKey: entityKey, data, tableName: table.name });
    const supabase = await this.getSupabaseClient();
    
    // Extract table name and find key/name fields
    const tableName = table.name;
    const keyField = this.findKeyField(table, true);
    const nameField = this.findNameField(table);
    
    if (!keyField) {
      throw new Error(`No entity key field found in table ${tableName}`);
    }
    if (!nameField) {
      throw new Error(`No name field found in table ${tableName}`);
    }
    
    const updateData: any = {};
    
    // Update display name if provided
    if (data.displayName !== undefined) {
      updateData[nameField.name] = data.displayName;
    }
    
    // Update dynamic properties if provided
    if (data.properties) {
      Object.entries(data.properties).forEach(([propertyName, propertyValue]) => {
        // Find the corresponding field in the table
        const field = table.fields.find(f => 
          f.name === propertyName && 
          f.name !== keyField.name && 
          f.name !== nameField.name && 
          f.name !== 'uid' &&
          f.name !== 'generic_key' &&
          !f.is_primary_key
        );
        if (field) {
          updateData[field.name] = propertyValue;
        }
      });
    }

    // Update the entity entity
    const { data: updated, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq(keyField.name, entityKey)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        this.log('UPDATE_AS_UI_ENTITY_NOT_FOUND', 'CHILD_ENTITIES', { childKey: entityKey, tableName });
        return null;
      }
      this.log('UPDATE_AS_UI_ENTITY_ERROR', 'CHILD_ENTITIES', { childKey: entityKey, data, tableName, error: error.message });
      throw new Error(`Failed to update entity entity: ${error.message}`);
    }

    // Fetch ancestors using the relationship utilities
    const ancestors = await this.fetchAncestorsForEntity(updated.uid, genericDrugsTable);

    const entity: UIEntity = {
      entityUid: updated.uid,
      entityKey: updated[keyField.name],
      displayName: updated[nameField.name],
      properties: this.generatePropertiesFromTable(table, updated, { isChildEntity: true }),
      aggregates: [],
      ancestors: ancestors, // Populated from relationships table
      children: [] // Child entities typically don't have children
    };

    this.log('UPDATE_AS_UI_ENTITY_SUCCESS', 'CHILD_ENTITIES', { childKey: entityKey, tableName, updatedChild: entity });
    return entity;
  }

} 