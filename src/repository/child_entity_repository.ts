import { BaseRepository } from './base_repository';
import { UIEntity } from '@/model_defs';
import {
  CreateChildEntityRequest,
  UpdateChildEntityRequest
} from '@/model_defs/DBModel';
import { DBTable } from '@/model_defs/DBModel';
import { genericDrugsTable } from '../model_instances/TheDBModel';

/**
 * Repository for Child Entity operations (manu_drugs table)
 * Handles CRUD operations for entity entities (manufactured drugs)
 */
export class ChildEntityRepository extends BaseRepository {
  
  // ============================================================================
  // CHILD ENTITY OPERATIONS (manu_drugs table)
  // ============================================================================

  async getChildrenAsUIEntitiesByEntityKey(entityKey: string, table: DBTable): Promise<UIEntity[]> {
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
    
    // Simplified query - no embedded join needed
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('generic_key', entityKey)
      .order(nameField.name);

    if (error) {
      this.log('GET_AS_UI_ENTITIES_BY_ENTITY_KEY_ERROR', 'CHILD_ENTITIES', { entityKey, tableName, error: error.message });
      throw new Error(`Failed to fetch entity entities: ${error.message}`);
    }

    if (data.length === 0) {
      this.log('GET_AS_UI_ENTITIES_BY_ENTITY_KEY_SUCCESS', 'CHILD_ENTITIES', { 
        entityKey, 
        tableName,
        recordCount: 0
      });
      return [];
    }

    // Fetch ancestors for each entity entity
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
    
    const newEntity: any = {
      [keyField.name]: this.generateKey('entity'),
      generic_key: data.parent_entity_key,
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