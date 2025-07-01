import { BaseRepository } from './base_repository';
import { createServiceClient } from '../lib/supabase-server';
import { UIEntity, UIEntityRef } from '@/model_defs';
import { 
  DBTable,
  CreateEntityRequest,
  UpdateEntityRequest,
  CreateChildEntityRequest,
  UpdateChildEntityRequest
} from '@/model_defs/DBModel';
import { manuDrugsTable, genericDrugsTable } from '../model_instances/TheDBModel';
import { applyTransform } from '@/lib/transformUtils';
import { drugBotModelMap } from '@/model_instances/TheModelMap';

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
      displayName: nameField ? row[nameField.name] : row[keyField.name],
      properties: this.generatePropertiesFromTable(table, row),
      aggregates: [],
      ancestors: [], // Root entities have no ancestors
      children: [] // Will be populated when expanded
    }));

    this.log('GET_ALL_AS_UI_ENTITIES_SUCCESS', 'ENTITIES', { tableName: table.name, recordCount: entities.length });
    return entities;
  }



  async getEntityByUid(
    entityUid: string, 
    table: DBTable, 
    options: { isChildEntity?: boolean; childTable?: DBTable; parentTable?: DBTable } = {}
  ): Promise<UIEntity | null> {
    const { isChildEntity = false, childTable = manuDrugsTable, parentTable = genericDrugsTable } = options;
    
    this.log('GET_BY_UID_AS_UI_ENTITY', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
      entityUid, 
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

    // Query by UID to get the entity data
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('uid', entityUid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        this.log('GET_BY_UID_AS_UI_ENTITY_NOT_FOUND', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
          entityUid, 
          tableName 
        });
        return null;
      }
      this.log('GET_BY_UID_AS_UI_ENTITY_ERROR', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
        entityUid, 
        tableName, 
        error: error.message 
      });
      throw new Error(`Failed to fetch entity: ${error.message}`);
    }

    const displayName = data[nameField.name];
    const uid = data.uid; // Get the UID for relationship queries
    
    // Always try to fetch both children and ancestors using UIDs
    let children: UIEntityRef[] = [];
    let ancestors: UIEntityRef[] = [];
    
    try {
      if (isChildEntity) {
        // For child entities, fetch ancestors from the parent table using UID
        ancestors = await this.fetchAncestorsForEntity(uid, parentTable);
        // Child entities typically don't have children, but we'll check anyway
        children = await this.fetchChildrenForEntity(uid, childTable);
      } else {
        // For parent entities, fetch children from the child table using UID
        children = await this.fetchChildrenForEntity(uid, childTable);
        // Parent entities typically don't have ancestors, but we'll check anyway
        ancestors = await this.fetchAncestorsForEntity(uid, parentTable);
      }
    } catch (error) {
      // Log the error but don't fail the whole request if relationships fail
      console.warn(`Failed to fetch ${isChildEntity ? 'ancestors' : 'children'} relationships:`, error);
    }
    
    const entity: UIEntity = {
      entityUid: uid,
      displayName: displayName,
      properties: this.generatePropertiesFromTable(table, data, { isChildEntity }),
      aggregates: [],
      ancestors: ancestors,
      children: children
    };

    this.log('GET_BY_UID_AS_UI_ENTITY_SUCCESS', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
      entityUid: uid, 
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
      displayName: inserted[nameField.name],
      properties: this.generatePropertiesFromTable(table, inserted),
      aggregates: [],
      ancestors: [], // Root entities have no ancestors
      children: [] // Will be populated when expanded
    };

    this.log('CREATE_AS_UI_ENTITY_SUCCESS', 'ENTITIES', { tableName: table.name, newEntity: entity });
    return entity;
  }

  async updateEntityByUid(entityUid: string, data: UpdateEntityRequest, table: DBTable): Promise<UIEntity | null> {
    this.log('UPDATE_BY_UID_AS_UI_ENTITY', 'ENTITIES', { entityUid, data, tableName: table.name });
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
      .eq('uid', entityUid)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        this.log('UPDATE_BY_UID_AS_UI_ENTITY_NOT_FOUND', 'ENTITIES', { entityUid, tableName: table.name });
        return null;
      }
      this.log('UPDATE_BY_UID_AS_UI_ENTITY_ERROR', 'ENTITIES', { entityUid, data, tableName: table.name, error: error.message });
      throw new Error(`Failed to update entity: ${error.message}`);
    }

    const entity: UIEntity = {
      entityUid: updated.uid,
      // entityKey: updated[keyField.name],
      displayName: nameField ? updated[nameField.name] : updated[keyField.name],
      properties: this.generatePropertiesFromTable(table, updated),
      aggregates: [],
      ancestors: [], // Root entities have no ancestors
      children: [] // Will be populated when expanded
    };

    this.log('UPDATE_BY_UID_AS_UI_ENTITY_SUCCESS', 'ENTITIES', { entityUid, tableName: table.name, updatedEntity: entity });
    return entity;
  }

  async deleteEntity(
    entityUid: string, 
    table: DBTable, 
    options: { isChildEntity?: boolean } = {}
  ): Promise<boolean> {
    const { isChildEntity = false } = options;
    
    this.log('DELETE', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
      entityUid, 
      tableName: table.name,
      isChildEntity 
    });
    
    // Use service role client to bypass RLS policies for admin operations
    const supabase = createServiceClient();
    
    console.log('deleteEntity - Using service role client to bypass RLS policies');
    console.log('deleteEntity - Deleting entity with UID:', entityUid);

    // Implement cascading delete for generic_drugs entities
    if (table.name === 'generic_drugs') {
      console.log('deleteEntity - Performing cascading delete for generic_drugs entity');
      
      try {
        // Delete in order of dependencies (child tables first, then parent)
        // 1. Delete from entity_relationships (both as ancestor and child)
        console.log('deleteEntity - Deleting from entity_relationships');
        const { error: relError } = await supabase
          .from('entity_relationships')
          .delete()
          .or(`ancestor_uid.eq.${entityUid},child_uid.eq.${entityUid}`);
        
        if (relError) {
          console.log('deleteEntity - Error deleting relationships:', relError.message);
          // Try alternative approach if OR fails
          console.log('deleteEntity - Trying alternative relationship deletion approach');
          const { error: relError2 } = await supabase
            .from('entity_relationships')
            .delete()
            .eq('ancestor_uid', entityUid);
          
          if (relError2) {
            console.log('deleteEntity - Error deleting ancestor relationships:', relError2.message);
          }
          
          const { error: relError3 } = await supabase
            .from('entity_relationships')
            .delete()
            .eq('child_uid', entityUid);
          
          if (relError3) {
            console.log('deleteEntity - Error deleting child relationships:', relError3.message);
          }
        }

        // 2. Delete from generic_approvals
        console.log('deleteEntity - Deleting from generic_approvals');
        const { error: approvalsError } = await supabase
          .from('generic_approvals')
          .delete()
          .eq('generic_uid', entityUid);
        
        if (approvalsError) {
          console.log('deleteEntity - Error deleting approvals:', approvalsError.message);
          throw new Error(`Failed to delete approvals: ${approvalsError.message}`);
        }

        // 3. Delete from generic_routes
        console.log('deleteEntity - Deleting from generic_routes');
        const { error: routesError } = await supabase
          .from('generic_routes')
          .delete()
          .eq('generic_uid', entityUid);
        
        if (routesError) {
          console.log('deleteEntity - Error deleting routes:', routesError.message);
          throw new Error(`Failed to delete routes: ${routesError.message}`);
        }

        // 4. Delete from generic_aliases
        console.log('deleteEntity - Deleting from generic_aliases');
        const { error: aliasesError } = await supabase
          .from('generic_aliases')
          .delete()
          .eq('generic_uid', entityUid);
        
        if (aliasesError) {
          console.log('deleteEntity - Error deleting aliases:', aliasesError.message);
          throw new Error(`Failed to delete aliases: ${aliasesError.message}`);
        }

        // 5. Delete from manu_drugs (child entities)
        console.log('deleteEntity - Deleting from manu_drugs');
        const { error: manuError } = await supabase
          .from('manu_drugs')
          .delete()
          .eq('generic_uid', entityUid);
        
        if (manuError) {
          console.log('deleteEntity - Error deleting manufactured drugs:', manuError.message);
          throw new Error(`Failed to delete manufactured drugs: ${manuError.message}`);
        }

        // 6. Finally, delete the main entity
        console.log('deleteEntity - Deleting main entity from generic_drugs');
        const { error: mainError } = await supabase
          .from(table.name)
          .delete()
          .eq('uid', entityUid);

        if (mainError) {
          console.log('deleteEntity - Error deleting main entity:', mainError.message);
          throw new Error(`Failed to delete main entity: ${mainError.message}`);
        }

      } catch (error) {
        console.log('deleteEntity - Cascading delete failed:', error);
        this.log('DELETE_ERROR', 'ENTITIES', { 
          entityUid, 
          tableName: table.name, 
          isChildEntity,
          error: error instanceof Error ? error.message : String(error)
        });
        throw error;
      }

    } else if (table.name === 'manu_drugs') {
      // For child entities, just delete from entity_relationships and the main table
      console.log('deleteEntity - Performing delete for manu_drugs entity');
      
      try {
        // Delete from entity_relationships
        console.log('deleteEntity - Deleting from entity_relationships');
        const { error: relError } = await supabase
          .from('entity_relationships')
          .delete()
          .eq('child_uid', entityUid);
        
        if (relError) {
          console.log('deleteEntity - Error deleting relationships:', relError.message);
          // Continue anyway as this might not exist
        }

        // Delete the main entity
        console.log('deleteEntity - Deleting main entity from manu_drugs');
        const { error: mainError } = await supabase
          .from(table.name)
          .delete()
          .eq('uid', entityUid);

        if (mainError) {
          console.log('deleteEntity - Error deleting main entity:', mainError.message);
          throw new Error(`Failed to delete main entity: ${mainError.message}`);
        }

      } catch (error) {
        console.log('deleteEntity - Delete failed:', error);
        this.log('DELETE_ERROR', 'CHILD_ENTITIES', { 
          entityUid, 
          tableName: table.name, 
          isChildEntity,
          error: error instanceof Error ? error.message : String(error)
        });
        throw error;
      }

    } else {
      // For other tables, use simple delete by UID
      console.log('deleteEntity - Using simple delete for table:', table.name);
      
      const { error } = await supabase
        .from(table.name)
        .delete()
        .eq('uid', entityUid);

      if (error) {
        console.log('deleteEntity - Delete error:', error.message);
        this.log('DELETE_ERROR', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
          entityUid, 
          tableName: table.name, 
          isChildEntity,
          error: error.message 
        });
        throw new Error(`Failed to delete entity: ${error.message}`);
      }
    }

    console.log('deleteEntity - Delete operation completed successfully');
    this.log('DELETE_SUCCESS', isChildEntity ? 'CHILD_ENTITIES' : 'ENTITIES', { 
      entityUid, 
      tableName: table.name,
      isChildEntity 
    });
    return true;
  }

  async getChildUIEntitiesByParentUid(parentUid: string, table: DBTable): Promise<UIEntity[]> {
    this.log('GET_CHILD_ENTITIES_BY_PARENT_UID', 'CHILD_ENTITIES', { parentUid, tableName: table.name });
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
    
    // Query child entities using the parent UID (generic_uid) directly
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('generic_uid', parentUid)
      .order(nameField.name);

    if (error) {
      this.log('GET_CHILD_ENTITIES_BY_PARENT_UID_ERROR', 'CHILD_ENTITIES', { parentUid, tableName, error: error.message });
      throw new Error(`Failed to fetch child entities: ${error.message}`);
    }

    if (data.length === 0) {
      this.log('GET_CHILD_ENTITIES_BY_PARENT_UID_SUCCESS', 'CHILD_ENTITIES', { 
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
          // entityKey: row[keyField.name],
          displayName: row[nameField.name],
          properties: this.generatePropertiesFromTable(table, row, { isChildEntity: true }),
          aggregates: [],
          ancestors: ancestors, // Populated from relationships table
          children: [] // Child entities typically don't have children
        };
      })
    );

    this.log('GET_CHILD_ENTITIES_BY_PARENT_UID_SUCCESS', 'CHILD_ENTITIES', { 
      parentUid,
      tableName,
      recordCount: children.length 
    });
    return children;
  }

  async createChildEntity(data: CreateChildEntityRequest, table: DBTable): Promise<UIEntity> {
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

    // First, find the parent entity UID from the parent_entity_uid
    const { data: parentData, error: parentError } = await supabase
      .from('generic_drugs')
      .select('uid')
      .eq('uid', data.parent_entity_uid)
      .single();

    if (parentError || !parentData) {
      this.log('CREATE_AS_UI_ENTITY_ERROR', 'CHILD_ENTITIES', { 
        data, 
        tableName, 
        error: 'Parent entity not found' 
      });
      throw new Error(`Parent entity not found for uid: ${data.parent_entity_uid}`);
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
          // Get the property mapping to check for transformations
          const entityType = this.getEntityTypeFromTableName(table.name);
          const propertyMapping = entityType ? this.getPropertyMapping(entityType, propertyName) : null;
          
          // Apply transformation if defined
          let convertedValue = propertyValue;
          if (propertyMapping?.transform?.toDB) {
            convertedValue = applyTransform(propertyMapping.transform.toDB, propertyValue);
          } else if (field.datatype === 'INTEGER' && propertyValue !== null && propertyValue !== undefined && propertyValue !== '') {
            // Fallback to basic integer conversion if no transform is defined
            convertedValue = parseInt(propertyValue as string, 10);
            if (isNaN(convertedValue)) {
              throw new Error(`Invalid integer value for field ${field.name}: ${propertyValue}`);
            }
          }
          newEntity[field.name] = convertedValue;
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
      // entityKey: inserted[keyField.name],
      displayName: inserted[nameField.name],
      properties: this.generatePropertiesFromTable(table, inserted, { isChildEntity: true }),
      aggregates: [],
      ancestors: ancestors, // Populated from relationships table
      children: [] // Child entities typically don't have children
    };

    this.log('CREATE_AS_UI_ENTITY_SUCCESS', 'CHILD_ENTITIES', { newChild: entity, tableName });
    return entity;
  }

  // async updateChildEntityByKey(childKey: string, data: UpdateChildEntityRequest, table: DBTable): Promise<UIEntity | null> {
  //   this.log('UPDATE_CHILD_ENTITY_BY_KEY', 'CHILD_ENTITIES', { childKey, data, tableName: table.name });
  //   const supabase = await this.getSupabaseClient();
    
  //   // Extract table name and find key/name fields
  //   const tableName = table.name;
  //   const keyField = this.findKeyField(table, true);
  //   const nameField = this.findNameField(table);
    
  //   if (!keyField) {
  //     throw new Error(`No entity key field found in table ${tableName}`);
  //   }
  //   if (!nameField) {
  //     throw new Error(`No name field found in table ${tableName}`);
  //   }
    
  //   const updateData: any = {};
    
  //   // Update display name if provided
  //   if (data.displayName !== undefined) {
  //     updateData[nameField.name] = data.displayName;
  //   }
    
  //   // Update dynamic properties if provided
  //   if (data.properties) {
  //     Object.entries(data.properties).forEach(([propertyName, propertyValue]) => {
  //       // Find the corresponding field in the table
  //       const field = table.fields.find(f => 
  //         f.name === propertyName && 
  //         f.name !== keyField.name && 
  //         f.name !== nameField.name && 
  //         f.name !== 'uid' &&
  //         f.name !== 'generic_key' &&
  //         !f.is_primary_key
  //       );
  //       if (field) {
  //         // Convert value based on field data type
  //         let convertedValue = propertyValue;
  //         if (field.datatype === 'INTEGER' && propertyValue !== null && propertyValue !== undefined && propertyValue !== '') {
  //           convertedValue = parseInt(propertyValue as string, 10);
  //           if (isNaN(convertedValue)) {
  //             throw new Error(`Invalid integer value for field ${field.name}: ${propertyValue}`);
  //           }
  //         }
  //         updateData[field.name] = convertedValue;
  //       }
  //     });
  //   }

  //   // Update the child entity
  //   const { data: updated, error } = await supabase
  //     .from(tableName)
  //     .update(updateData)
  //     .eq(keyField.name, childKey)
  //     .select()
  //     .single();

  //   if (error) {
  //     if (error.code === 'PGRST116') {
  //       this.log('UPDATE_CHILD_ENTITY_BY_KEY_NOT_FOUND', 'CHILD_ENTITIES', { childKey, tableName });
  //       return null;
  //     }
  //     this.log('UPDATE_CHILD_ENTITY_BY_KEY_ERROR', 'CHILD_ENTITIES', { childKey, data, tableName, error: error.message });
  //     throw new Error(`Failed to update entity entity: ${error.message}`);
  //   }

  //   // Fetch ancestors using the relationship utilities
  //   const ancestors = await this.fetchAncestorsForEntity(updated.uid, genericDrugsTable);

  //   const entity: UIEntity = {
  //     entityUid: updated.uid,
  //     // entityKey: updated[keyField.name],
  //     displayName: updated[nameField.name],
  //     properties: this.generatePropertiesFromTable(table, updated, { isChildEntity: true }),
  //     aggregates: [],
  //     ancestors: ancestors, // Populated from relationships table
  //     children: [] // Child entities typically don't have children
  //   };

  //   this.log('UPDATE_CHILD_ENTITY_BY_KEY_SUCCESS', 'CHILD_ENTITIES', { childKey, tableName, updatedChild: entity });
  //   return entity;
  // }

  // async updateChildEntityByUid(childUid: string, data: UpdateChildEntityRequest, table: DBTable): Promise<UIEntity | null> {
  //   this.log('UPDATE_CHILD_ENTITY_BY_UID', 'CHILD_ENTITIES', { childUid, data, tableName: table.name });
  //   const supabase = await this.getSupabaseClient();
    
  //   // Extract table name and find key/name fields
  //   const tableName = table.name;
  //   const keyField = this.findKeyField(table, true);
  //   const nameField = this.findNameField(table);
    
  //   if (!keyField) {
  //     throw new Error(`No entity key field found in table ${tableName}`);
  //   }
  //   if (!nameField) {
  //     throw new Error(`No name field found in table ${tableName}`);
  //   }
    
  //   const updateData: any = {};
    
  //   // Update display name if provided
  //   if (data.displayName !== undefined) {
  //     updateData[nameField.name] = data.displayName;
  //   }
    
  //   // Update dynamic properties if provided
  //   if (data.properties) {
  //     Object.entries(data.properties).forEach(([propertyName, propertyValue]) => {
  //       // Find the corresponding field in the table
  //       const field = table.fields.find(f => 
  //         f.name === propertyName && 
  //         f.name !== keyField.name && 
  //         f.name !== nameField.name && 
  //         f.name !== 'uid' &&
  //         f.name !== 'generic_key' &&
  //         !f.is_primary_key
  //       );
  //       if (field) {
  //         // Get the property mapping to check for transformations
  //         const entityType = this.getEntityTypeFromTableName(table.name);
  //         const propertyMapping = entityType ? this.getPropertyMapping(entityType, propertyName) : null;
          
  //         // Apply transformation if defined
  //         let convertedValue = propertyValue;
  //         if (propertyMapping?.transform?.toDB) {
  //           convertedValue = applyTransform(propertyMapping.transform.toDB, propertyValue);
  //         } else if (field.datatype === 'INTEGER' && propertyValue !== null && propertyValue !== undefined && propertyValue !== '') {
  //           // Fallback to basic integer conversion if no transform is defined
  //           convertedValue = parseInt(propertyValue as string, 10);
  //           if (isNaN(convertedValue)) {
  //             throw new Error(`Invalid integer value for field ${field.name}: ${propertyValue}`);
  //           }
  //         }
  //         updateData[field.name] = convertedValue;
  //       }
  //     });
  //   }

  //   // Update the child entity using UID directly
  //   const { data: updated, error } = await supabase
  //     .from(tableName)
  //     .update(updateData)
  //     .eq('uid', childUid)
  //     .select()
  //     .single();

  //   if (error) {
  //     if (error.code === 'PGRST116') {
  //       this.log('UPDATE_CHILD_ENTITY_BY_UID_NOT_FOUND', 'CHILD_ENTITIES', { childUid, tableName });
  //       return null;
  //     }
  //     this.log('UPDATE_CHILD_ENTITY_BY_UID_ERROR', 'CHILD_ENTITIES', { childUid, data, tableName, error: error.message });
  //     throw new Error(`Failed to update child entity: ${error.message}`);
  //   }

  //   // Fetch ancestors using the relationship utilities
  //   const ancestors = await this.fetchAncestorsForEntity(updated.uid, genericDrugsTable);

  //   const entity: UIEntity = {
  //     entityUid: updated.uid,
  //     // entityKey: updated[keyField.name],
  //     displayName: updated[nameField.name],
  //     properties: this.generatePropertiesFromTable(table, updated, { isChildEntity: true }),
  //     aggregates: [],
  //     ancestors: ancestors, // Populated from relationships table
  //     children: [] // Child entities typically don't have children
  //   };

  //   this.log('UPDATE_CHILD_ENTITY_BY_UID_SUCCESS', 'CHILD_ENTITIES', { childUid, tableName, updatedChild: entity });
  //   return entity;
  // }

  async getEntityTreeData(): Promise<{ ancestors: UIEntity[], childrenMap: Record<string, UIEntity[]> }> {
    this.log('GET_ENTITY_TREE_DATA', 'TREE', {});
    const supabase = await this.getSupabaseClient();
    
    try {
      // Get all data from the entity_relationships_detailed view
      const { data: relationships, error } = await supabase
        .from('entity_relationships_detailed')
        .select('*')
        .order('ancestor_name');

      if (error) {
        this.log('GET_ENTITY_TREE_DATA_ERROR', 'TREE', { error: error.message });
        throw new Error(`Failed to fetch tree data: ${error.message}`);
      }

      // Group by ancestors and build the tree structure
      const ancestorsMap = new Map<string, UIEntity>();
      const childrenMap: Record<string, UIEntity[]> = {};

      relationships?.forEach(rel => {
        // Create ancestor entity if not already created
        if (!ancestorsMap.has(rel.ancestor_uid)) {
          const ancestor: UIEntity = {
            entityUid: rel.ancestor_uid,
            // entityKey: rel.ancestor_key,
            displayName: rel.ancestor_name,
            properties: [
               {
                 propertyName: 'generic_key',
                 propertyValue: rel.ancestor_key,
                 controlType: 'text',
                 ordinal: 1,
                 isEditable: false,
                 isVisible: false,
                 isId: false,
                 isRequired: true
               },
               {
                 propertyName: 'generic_name',
                 propertyValue: rel.ancestor_name,
                 controlType: 'text',
                 ordinal: 2,
                 isEditable: true,
                 isVisible: true,
                 isId: false,
                 isRequired: true
               },
               {
                 propertyName: 'mech_of_action',
                 propertyValue: rel.ancestor_mechanism || '',
                 controlType: 'text',
                 ordinal: 3,
                 isEditable: true,
                 isVisible: true,
                 isId: false,
                 isRequired: false
               }
             ],
            aggregates: [],
            ancestors: [],
            children: []
          };
          ancestorsMap.set(rel.ancestor_uid, ancestor);
          childrenMap[rel.ancestor_uid] = [];
        }

        // Create child entity
        const child: UIEntity = {
          entityUid: rel.child_uid,
          // entityKey: rel.child_key,
          displayName: rel.child_name,
                     properties: [
             {
               propertyName: 'manu_drug_key',
               propertyValue: rel.child_key,
               controlType: 'text',
               ordinal: 1,
               isEditable: false,
               isVisible: false,
               isId: false,
               isRequired: true
             },
             {
               propertyName: 'drug_name',
               propertyValue: rel.child_name,
               controlType: 'text',
               ordinal: 2,
               isEditable: true,
               isVisible: true,
               isId: false,
               isRequired: true
             },
             {
               propertyName: 'manufacturer',
               propertyValue: rel.child_manufacturer || '',
               controlType: 'text',
               ordinal: 3,
               isEditable: true,
               isVisible: true,
               isId: false,
               isRequired: false
             },
             {
               propertyName: 'biosimilar',
               propertyValue: rel.child_biosimilar?.toString() || '',
               controlType: 'checkbox',
               ordinal: 4,
               isEditable: true,
               isVisible: true,
               isId: false,
               isRequired: false
             }
           ],
           aggregates: [],
           ancestors: [{
             entityUid: rel.ancestor_uid,
             displayName: rel.ancestor_name,
             ancestors: [],
             children: []
           }],
          children: []
        };

        // Add child to the children map
        if (!childrenMap[rel.ancestor_uid]) {
          childrenMap[rel.ancestor_uid] = [];
        }
        childrenMap[rel.ancestor_uid].push(child);
      });

      const ancestors = Array.from(ancestorsMap.values());

      this.log('GET_ENTITY_TREE_DATA_SUCCESS', 'TREE', { 
        ancestorCount: ancestors.length,
        totalRelationships: relationships?.length || 0
      });

      return { ancestors, childrenMap };
    } catch (error) {
      this.log('GET_ENTITY_TREE_DATA_ERROR', 'TREE', { 
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

} 