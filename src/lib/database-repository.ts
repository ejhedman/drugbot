import { createServerSupabaseClient } from './supabase-server';
import { 
  UIEntity,
  UIEntityRef,
  UIProperty,
  UIAggregate,
  CreateUIAggregateRequest,
  UpdateUIAggregateRequest,
  CreateChildUIAggregateRequest,
  UpdateChildUIAggregateRequest,
  CreateEntityRequest,
  UpdateEntityRequest,
  CreateChildEntityRequest,
  UpdateChildEntityRequest
} from '@/model_defs';

class DatabaseRepository {
  
  // ============================================================================
  // LOGGING UTILITY
  // ============================================================================
  
  private log(operation: string, entityType: string, details: any = {}) {
    const timestamp = new Date().toISOString();
    
    console.log('=== DATABASE REPOSITORY OPERATION ===');
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Operation: ${operation}`);
    console.log(`Entity Type: ${entityType}`);
    console.log(`Details:`, JSON.stringify(details, null, 2));
    console.log('=====================================');
  }

  private generateKey(prefix: string): string {
    const key = `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.log('GENERATE_KEY', prefix, { generatedKey: key });
    return key;
  }

  // ============================================================================
  // ENTITY OPERATIONS (mapped to generic_drugs table)
  // ============================================================================

  async getAllEntities(): Promise<UIEntity[]> {
    return this.getAllEntitiesAsUIEntities();
  }

  async getAllEntitiesAsUIEntities(): Promise<UIEntity[]> {
    this.log('GET_ALL_AS_UI_ENTITIES', 'ENTITIES');
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('generic_drugs')
      .select('*')
      .order('generic_name');

    if (error) {
      this.log('GET_ALL_AS_UI_ENTITIES_ERROR', 'ENTITIES', { error: error.message });
      throw new Error(`Failed to fetch entities: ${error.message}`);
    }

    const entities: UIEntity[] = data.map(row => ({
      entity_id: row.uid,
      entity_key: row.generic_key,
      displayName: row.generic_name,
      properties: [
        {
          property_name: 'entity_key',
          property_value: row.generic_key,
          ordinal: 1,
          is_editable: false,
          is_visible: true,
          is_key: true
        },
        {
          property_name: 'entity_name',
          property_value: row.generic_name,
          ordinal: 2,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'entity_property1',
          property_value: row.mech_of_action || '',
          ordinal: 3,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ],
      aggregates: [],
      ancestors: [], // Root entities have no ancestors
      children: [] // Will be populated when expanded
    }));

    this.log('GET_ALL_AS_UI_ENTITIES_SUCCESS', 'ENTITIES', { recordCount: entities.length });
    return entities;
  }

  async getEntityByKey(entityKey: string): Promise<UIEntity | null> {
    this.log('GET_BY_KEY_AS_UI_ENTITY', 'ENTITIES', { entityKey });
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('generic_drugs')
      .select('*')
      .eq('generic_key', entityKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        this.log('GET_BY_KEY_AS_UI_ENTITY_NOT_FOUND', 'ENTITIES', { entityKey });
        return null;
      }
      this.log('GET_BY_KEY_AS_UI_ENTITY_ERROR', 'ENTITIES', { entityKey, error: error.message });
      throw new Error(`Failed to fetch entity: ${error.message}`);
    }

    const entity: UIEntity = {
      entity_id: data.uid,
      entity_key: data.generic_key,
      displayName: data.generic_name,
      properties: [
        {
          property_name: 'entity_key',
          property_value: data.generic_key,
          ordinal: 1,
          is_editable: false,
          is_visible: true,
          is_key: true
        },
        {
          property_name: 'entity_name',
          property_value: data.generic_name,
          ordinal: 2,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'entity_property1',
          property_value: data.mech_of_action || '',
          ordinal: 3,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ],
      aggregates: [],
      ancestors: [], // Root entities have no ancestors
      children: [] // Will be populated when expanded
    };

    this.log('GET_BY_KEY_AS_UI_ENTITY_SUCCESS', 'ENTITIES', { entityKey, entityName: entity.displayName });
    return entity;
  }

  async searchEntities(searchTerm: string): Promise<UIEntity[]> {
    return this.searchEntitiesAsUIEntities(searchTerm);
  }

  async searchEntitiesAsUIEntities(searchTerm: string): Promise<UIEntity[]> {
    this.log('SEARCH_AS_UI_ENTITIES', 'ENTITIES', { searchTerm });
    const supabase = await createServerSupabaseClient();
    
    let query = supabase
      .from('generic_drugs')
      .select('*')
      .order('generic_name');

    if (searchTerm) {
      query = query.or(`generic_name.ilike.%${searchTerm}%,mech_of_action.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      this.log('SEARCH_AS_UI_ENTITIES_ERROR', 'ENTITIES', { searchTerm, error: error.message });
      throw new Error(`Failed to search entities: ${error.message}`);
    }

    const entities: UIEntity[] = data.map(row => ({
      entity_id: row.uid,
      entity_key: row.generic_key,
      displayName: row.generic_name,
      properties: [
        {
          property_name: 'entity_key',
          property_value: row.generic_key,
          ordinal: 1,
          is_editable: false,
          is_visible: true,
          is_key: true
        },
        {
          property_name: 'entity_name',
          property_value: row.generic_name,
          ordinal: 2,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'entity_property1',
          property_value: row.mech_of_action || '',
          ordinal: 3,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ],
      aggregates: [],
      ancestors: [], // Root entities have no ancestors
      children: [] // Will be populated when expanded
    }));

    this.log('SEARCH_AS_UI_ENTITIES_SUCCESS', 'ENTITIES', { 
      searchTerm, 
      matchedRecords: entities.length 
    });
    return entities;
  }

  async createEntity(data: CreateEntityRequest): Promise<UIEntity> {
    this.log('CREATE_AS_UI_ENTITY', 'ENTITIES', { data });
    const supabase = await createServerSupabaseClient();
    
    const newEntity = {
      generic_key: this.generateKey('generic'),
      generic_name: data.displayName,
      mech_of_action: data.entity_property1 || ''
    };

    const { data: inserted, error } = await supabase
      .from('generic_drugs')
      .insert(newEntity)
      .select()
      .single();

    if (error) {
      this.log('CREATE_AS_UI_ENTITY_ERROR', 'ENTITIES', { data, error: error.message });
      throw new Error(`Failed to create entity: ${error.message}`);
    }

    const entity: UIEntity = {
      entity_id: inserted.uid,
      entity_key: inserted.generic_key,
      displayName: inserted.generic_name,
      properties: [
        {
          property_name: 'entity_key',
          property_value: inserted.generic_key,
          ordinal: 1,
          is_editable: false,
          is_visible: true,
          is_key: true
        },
        {
          property_name: 'entity_name',
          property_value: inserted.generic_name,
          ordinal: 2,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'entity_property1',
          property_value: inserted.mech_of_action || '',
          ordinal: 3,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ],
      aggregates: [],
      ancestors: [], // Root entities have no ancestors
      children: [] // Will be populated when expanded
    };

    this.log('CREATE_AS_UI_ENTITY_SUCCESS', 'ENTITIES', { newEntity: entity });
    return entity;
  }

  async updateEntity(entityKey: string, data: UpdateEntityRequest): Promise<UIEntity | null> {
    this.log('UPDATE_AS_UI_ENTITY', 'ENTITIES', { entityKey, data });
    const supabase = await createServerSupabaseClient();
    
    const updateData: any = {};
    if (data.displayName !== undefined) updateData.generic_name = data.displayName;
    if (data.entity_property1 !== undefined) updateData.mech_of_action = data.entity_property1;

    const { data: updated, error } = await supabase
      .from('generic_drugs')
      .update(updateData)
      .eq('generic_key', entityKey)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        this.log('UPDATE_AS_UI_ENTITY_NOT_FOUND', 'ENTITIES', { entityKey });
        return null;
      }
      this.log('UPDATE_AS_UI_ENTITY_ERROR', 'ENTITIES', { entityKey, data, error: error.message });
      throw new Error(`Failed to update entity: ${error.message}`);
    }

    const entity: UIEntity = {
      entity_id: updated.uid,
      entity_key: updated.generic_key,
      displayName: updated.generic_name,
      properties: [
        {
          property_name: 'entity_key',
          property_value: updated.generic_key,
          ordinal: 1,
          is_editable: false,
          is_visible: true,
          is_key: true
        },
        {
          property_name: 'entity_name',
          property_value: updated.generic_name,
          ordinal: 2,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'entity_property1',
          property_value: updated.mech_of_action || '',
          ordinal: 3,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ],
      aggregates: [],
      ancestors: [], // Root entities have no ancestors
      children: [] // Will be populated when expanded
    };

    this.log('UPDATE_AS_UI_ENTITY_SUCCESS', 'ENTITIES', { entityKey, updatedEntity: entity });
    return entity;
  }

  async deleteEntity(entityKey: string): Promise<boolean> {
    this.log('DELETE', 'ENTITIES', { entityKey });
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase
      .from('generic_drugs')
      .delete()
      .eq('generic_key', entityKey);

    if (error) {
      this.log('DELETE_ERROR', 'ENTITIES', { entityKey, error: error.message });
      throw new Error(`Failed to delete entity: ${error.message}`);
    }

    this.log('DELETE_SUCCESS', 'ENTITIES', { entityKey });
    return true;
  }

  // ============================================================================
  // CHILD ENTITY OPERATIONS (mapped to manu_drugs table)
  // ============================================================================

  async getAllChildren(): Promise<UIEntity[]> {
    return this.getAllChildrenAsUIEntities();
  }

  async getChildrenByEntityKey(entityKey: string): Promise<UIEntity[]> {
    return this.getChildrenAsUIEntitiesByEntityKey(entityKey);
  }

  async getChildrenAsUIEntitiesByEntityKey(entityKey: string): Promise<UIEntity[]> {
    this.log('GET_AS_UI_ENTITIES_BY_ENTITY_KEY', 'CHILD_ENTITIES', { entityKey });
    const supabase = await createServerSupabaseClient();
    
    // Get the child entities and parent info in one query (same approach as legacy method)
    const { data, error } = await supabase
      .from('manu_drugs')
      .select('*, generic_drugs!inner(uid, generic_key, generic_name, mech_of_action)')
      .eq('generic_key', entityKey)
      .order('drug_name');

    if (error) {
      this.log('GET_AS_UI_ENTITIES_BY_ENTITY_KEY_ERROR', 'CHILD_ENTITIES', { entityKey, error: error.message });
      throw new Error(`Failed to fetch child entities: ${error.message}`);
    }

    if (data.length === 0) {
      this.log('GET_AS_UI_ENTITIES_BY_ENTITY_KEY_SUCCESS', 'CHILD_ENTITIES', { 
        entityKey, 
        recordCount: 0
      });
      return [];
    }

    // Create parent entity reference for ancestors (use the first record's parent info)
    const parentInfo = data[0].generic_drugs;
    const parentEntityRef: UIEntityRef = {
      entity_id: parentInfo.uid,
      displayName: parentInfo.generic_name,
      ancestors: [],
      children: []
    };

    // Convert to UIEntity with proper ancestors
    const children: UIEntity[] = data.map(row => ({
      entity_id: row.uid,
      entity_key: row.manu_drug_key,
      displayName: row.drug_name,
      properties: [
        {
          property_name: 'child_entity_key',
          property_value: row.manu_drug_key,
          ordinal: 1,
          is_editable: false,
          is_visible: true,
          is_key: true
        },
        {
          property_name: 'entity_key',
          property_value: entityKey,
          ordinal: 2,
          is_editable: false,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'child_entity_name',
          property_value: row.drug_name,
          ordinal: 3,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'child_entity_property1',
          property_value: row.manufacturer || '',
          ordinal: 4,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ],
      aggregates: [],
      ancestors: [parentEntityRef], // Parent is the first (and only) ancestor
      children: []
    }));

    this.log('GET_AS_UI_ENTITIES_BY_ENTITY_KEY_SUCCESS', 'CHILD_ENTITIES', { 
      entityKey, 
      recordCount: children.length 
    });
    return children;
  }

  async getAllChildrenAsUIEntities(): Promise<UIEntity[]> {
    this.log('GET_ALL_AS_UI_ENTITIES', 'CHILD_ENTITIES');
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('manu_drugs')
      .select('*, generic_drugs!inner(uid, generic_key, generic_name, mech_of_action)')
      .order('drug_name');

    if (error) {
      this.log('GET_ALL_AS_UI_ENTITIES_ERROR', 'CHILD_ENTITIES', { error: error.message });
      throw new Error(`Failed to fetch child entities: ${error.message}`);
    }

    // Convert to UIEntity with proper ancestors
    const children: UIEntity[] = data.map(row => {
      const parentInfo = row.generic_drugs;
      const parentEntityRef: UIEntityRef = {
        entity_id: parentInfo.uid,
        displayName: parentInfo.generic_name,
        ancestors: [],
        children: []
      };

      return {
        entity_id: row.uid,
        entity_key: row.manu_drug_key,
        displayName: row.drug_name,
        properties: [
          {
            property_name: 'child_entity_key',
            property_value: row.manu_drug_key,
            ordinal: 1,
            is_editable: false,
            is_visible: true,
            is_key: true
          },
          {
            property_name: 'entity_key',
            property_value: row.generic_key,
            ordinal: 2,
            is_editable: false,
            is_visible: true,
            is_key: false
          },
          {
            property_name: 'child_entity_name',
            property_value: row.drug_name,
            ordinal: 3,
            is_editable: true,
            is_visible: true,
            is_key: false
          },
          {
            property_name: 'child_entity_property1',
            property_value: row.manufacturer || '',
            ordinal: 4,
            is_editable: true,
            is_visible: true,
            is_key: false
          }
        ],
        aggregates: [],
        ancestors: [parentEntityRef], // Parent is the first (and only) ancestor
        children: []
    };
    });

    this.log('GET_ALL_AS_UI_ENTITIES_SUCCESS', 'CHILD_ENTITIES', { 
      recordCount: children.length 
    });
    return children;
  }

  async searchChildrenAsUIEntities(searchTerm: string): Promise<UIEntity[]> {
    this.log('SEARCH_AS_UI_ENTITIES', 'CHILD_ENTITIES', { searchTerm });
    const supabase = await createServerSupabaseClient();
    
    let query = supabase
      .from('manu_drugs')
      .select('*, generic_drugs!inner(uid, generic_key, generic_name, mech_of_action)')
      .order('drug_name');

    if (searchTerm) {
      query = query.or(`drug_name.ilike.%${searchTerm}%,manufacturer.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      this.log('SEARCH_AS_UI_ENTITIES_ERROR', 'CHILD_ENTITIES', { searchTerm, error: error.message });
      throw new Error(`Failed to search child entities: ${error.message}`);
    }

    // Convert to UIEntity with proper ancestors
    const children: UIEntity[] = data.map(row => {
      const parentInfo = row.generic_drugs;
      const parentEntityRef: UIEntityRef = {
        entity_id: parentInfo.uid,
        displayName: parentInfo.generic_name,
        ancestors: [],
        children: []
      };

      return {
        entity_id: row.uid,
        entity_key: row.manu_drug_key,
        displayName: row.drug_name,
        properties: [
          {
            property_name: 'child_entity_key',
            property_value: row.manu_drug_key,
            ordinal: 1,
            is_editable: false,
            is_visible: true,
            is_key: true
          },
          {
            property_name: 'entity_key',
            property_value: row.generic_key,
            ordinal: 2,
            is_editable: false,
            is_visible: true,
            is_key: false
          },
          {
            property_name: 'child_entity_name',
            property_value: row.drug_name,
            ordinal: 3,
            is_editable: true,
            is_visible: true,
            is_key: false
          },
          {
            property_name: 'child_entity_property1',
            property_value: row.manufacturer || '',
            ordinal: 4,
            is_editable: true,
            is_visible: true,
            is_key: false
          }
        ],
        aggregates: [],
        ancestors: [parentEntityRef], // Parent is the first (and only) ancestor
        children: []
      };
    });

    this.log('SEARCH_AS_UI_ENTITIES_SUCCESS', 'CHILD_ENTITIES', { 
      searchTerm, 
      matchedRecords: children.length 
    });
    return children;
  }

  async getChildByKey(childKey: string): Promise<UIEntity | null> {
    return this.getChildByKeyAsUIEntity(childKey);
  }

  async getChildByKeyAsUIEntity(childKey: string): Promise<UIEntity | null> {
    this.log('GET_BY_KEY_AS_UI_ENTITY', 'CHILD_ENTITIES', { childKey });
    
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('manu_drugs')
      .select('*, generic_drugs!inner(uid, generic_key, generic_name, mech_of_action)')
      .eq('manu_drug_key', childKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        this.log('GET_BY_KEY_AS_UI_ENTITY_NOT_FOUND', 'CHILD_ENTITIES', { childKey });
        return null;
      }
      this.log('GET_BY_KEY_AS_UI_ENTITY_ERROR', 'CHILD_ENTITIES', { childKey, error: error.message });
      throw new Error(`Failed to fetch child entity: ${error.message}`);
    }

    // Create parent entity reference for ancestors
    const parentInfo = data.generic_drugs;
    const parentEntityRef: UIEntityRef = {
      entity_id: parentInfo.uid,
      displayName: parentInfo.generic_name,
      ancestors: [],
      children: []
    };

    const child: UIEntity = {
      entity_id: data.uid,
      entity_key: data.manu_drug_key,
      displayName: data.drug_name,
      properties: [
        {
          property_name: 'child_entity_key',
          property_value: data.manu_drug_key,
          ordinal: 1,
          is_editable: false,
          is_visible: true,
          is_key: true
        },
        {
          property_name: 'entity_key',
          property_value: data.generic_key,
          ordinal: 2,
          is_editable: false,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'child_entity_name',
          property_value: data.drug_name,
          ordinal: 3,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'child_entity_property1',
          property_value: data.manufacturer || '',
          ordinal: 4,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ],
      aggregates: [],
      ancestors: [parentEntityRef], // Parent is the first (and only) ancestor
      children: []
    };

    this.log('GET_BY_KEY_AS_UI_ENTITY_SUCCESS', 'CHILD_ENTITIES', { childKey, childName: child.displayName });
    return child;
  }

  async searchChildren(searchTerm: string): Promise<UIEntity[]> {
    return this.searchChildrenAsUIEntities(searchTerm);
  }

  async createChildEntity(data: CreateChildEntityRequest): Promise<UIEntity> {
    return this.createChildEntityAsUIEntity(data);
  }

  async createChildEntityAsUIEntity(data: CreateChildEntityRequest): Promise<UIEntity> {
    this.log('CREATE_AS_UI_ENTITY', 'CHILD_ENTITIES', { data });
    const supabase = await createServerSupabaseClient();
    
    // Get the generic_uid for the foreign key and parent info
    const { data: genericDrug, error: genericError } = await supabase
      .from('generic_drugs')
      .select('uid, generic_key, generic_name, mech_of_action')
      .eq('generic_key', data.parent_entity_key)
      .single();

    if (genericError) {
      this.log('CREATE_AS_UI_ENTITY_ERROR', 'CHILD_ENTITIES', { data, error: 'Parent entity not found' });
      throw new Error(`Parent entity not found: ${genericError.message}`);
    }

    const newChild = {
      manu_drug_key: this.generateKey('manu'),
      drug_name: data.displayName,
      manufacturer: data.child_entity_property1 || '',
      generic_uid: genericDrug.uid
    };

    const { data: inserted, error } = await supabase
      .from('manu_drugs')
      .insert(newChild)
      .select()
      .single();

    if (error) {
      this.log('CREATE_AS_UI_ENTITY_ERROR', 'CHILD_ENTITIES', { data, error: error.message });
      throw new Error(`Failed to create child entity: ${error.message}`);
    }

    // Create parent entity reference for ancestors
    const parentEntityRef: UIEntityRef = {
      entity_id: genericDrug.uid,
      displayName: genericDrug.generic_name,
      ancestors: [],
      children: []
    };

    const child: UIEntity = {
      entity_id: inserted.uid,
      entity_key: inserted.manu_drug_key,
      displayName: inserted.drug_name,
      properties: [
        {
          property_name: 'child_entity_key',
          property_value: inserted.manu_drug_key,
          ordinal: 1,
          is_editable: false,
          is_visible: true,
          is_key: true
        },
        {
          property_name: 'entity_key',
          property_value: data.parent_entity_key,
          ordinal: 2,
          is_editable: false,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'child_entity_name',
          property_value: inserted.drug_name,
          ordinal: 3,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'child_entity_property1',
          property_value: inserted.manufacturer || '',
          ordinal: 4,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ],
      aggregates: [],
      ancestors: [parentEntityRef], // Parent is the first (and only) ancestor
      children: []
    };

    this.log('CREATE_AS_UI_ENTITY_SUCCESS', 'CHILD_ENTITIES', { newChild: child });
    return child;
  }

  async updateChildEntity(childKey: string, data: UpdateChildEntityRequest): Promise<UIEntity | null> {
    return this.updateChildEntityAsUIEntity(childKey, data);
  }

  async updateChildEntityAsUIEntity(childKey: string, data: UpdateChildEntityRequest): Promise<UIEntity | null> {
    this.log('UPDATE_AS_UI_ENTITY', 'CHILD_ENTITIES', { childKey, data });
    
    const supabase = await createServerSupabaseClient();
    
    const updateData: any = {};
    if (data.displayName !== undefined) updateData.drug_name = data.displayName;
    if (data.child_entity_property1 !== undefined) updateData.manufacturer = data.child_entity_property1;

    const { data: updated, error } = await supabase
      .from('manu_drugs')
      .update(updateData)
      .eq('manu_drug_key', childKey)
      .select('*, generic_drugs!inner(uid, generic_key, generic_name, mech_of_action)')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        this.log('UPDATE_AS_UI_ENTITY_NOT_FOUND', 'CHILD_ENTITIES', { childKey });
        return null;
      }
      this.log('UPDATE_AS_UI_ENTITY_ERROR', 'CHILD_ENTITIES', { childKey, data, error: error.message });
      throw new Error(`Failed to update child entity: ${error.message}`);
    }

    // Create parent entity reference for ancestors
    const parentInfo = updated.generic_drugs;
    const parentEntityRef: UIEntityRef = {
      entity_id: parentInfo.uid,
      displayName: parentInfo.generic_name,
      ancestors: [],
      children: []
    };

    const child: UIEntity = {
      entity_id: updated.uid,
      entity_key: updated.manu_drug_key,
      displayName: updated.drug_name,
      properties: [
        {
          property_name: 'child_entity_key',
          property_value: updated.manu_drug_key,
          ordinal: 1,
          is_editable: false,
          is_visible: true,
          is_key: true
        },
        {
          property_name: 'entity_key',
          property_value: updated.generic_key,
          ordinal: 2,
          is_editable: false,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'child_entity_name',
          property_value: updated.drug_name,
          ordinal: 3,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'child_entity_property1',
          property_value: updated.manufacturer || '',
          ordinal: 4,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ],
      aggregates: [],
      ancestors: [parentEntityRef], // Parent is the first (and only) ancestor
      children: []
    };

    this.log('UPDATE_AS_UI_ENTITY_SUCCESS', 'CHILD_ENTITIES', { childKey, updatedChild: child });
    return child;
  }

  async deleteChildEntity(childKey: string): Promise<boolean> {
    this.log('DELETE', 'CHILD_ENTITIES', { childKey });
    
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase
      .from('manu_drugs')
      .delete()
      .eq('manu_drug_key', childKey);

    if (error) {
      this.log('DELETE_ERROR', 'CHILD_ENTITIES', { childKey, error: error.message });
      throw new Error(`Failed to delete child entity: ${error.message}`);
    }

    this.log('DELETE_SUCCESS', 'CHILD_ENTITIES', { childKey });
    return true;
  }

  // ============================================================================
  // ENTITY AGGREGATE OPERATIONS (UIAggregate-based, replacing legacy collection types)
  // ============================================================================

  /**
   * Get all entity aggregates as UIAggregate (replaces getAllEntityColl1)
   */
  async getAllEntityAggregates(): Promise<UIAggregate[]> {
    this.log('GET_ALL', 'ENTITY_AGGREGATES');
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('generic_routes')
      .select('*')
      .order('route_type');

    if (error) {
      this.log('GET_ALL_ERROR', 'ENTITY_AGGREGATES', { error: error.message });
      throw new Error(`Failed to fetch entity aggregates: ${error.message}`);
    }

    const aggregates: UIAggregate[] = data.map(row => ({
      entity_id: row.generic_key, // Use generic_key as entity_id
      aggregate_type: 'GenericRoute',
      displayName: `${row.route_type} Route`,
      ordinal: 1,
      properties: [
        {
          property_name: 'route_type',
          property_value: row.route_type || '',
          ordinal: 1,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'load_dose',
          property_value: row.load_dose || '',
          ordinal: 2,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'maintain_dose',
          property_value: row.maintain_dose || '',
          ordinal: 3,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'load_measure',
          property_value: row.load_measure || '',
          ordinal: 4,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'maintain_measure',
          property_value: row.maintain_measure || '',
          ordinal: 5,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'load_reg',
          property_value: row.load_reg || '',
          ordinal: 6,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'maintain_reg',
          property_value: row.maintain_reg || '',
          ordinal: 7,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'montherapy',
          property_value: row.montherapy || '',
          ordinal: 8,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'half_life',
          property_value: row.half_life || '',
          ordinal: 9,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ]
    }));

    this.log('GET_ALL_SUCCESS', 'ENTITY_AGGREGATES', { recordCount: aggregates.length });
    return aggregates;
  }

  /**
   * Get entity aggregates by entity key as UIAggregate (replaces getEntityColl1ByEntityKey)
   */
  async getEntityAggregatesByEntityKey(entityKey: string): Promise<UIAggregate[]> {
    this.log('GET_BY_ENTITY_KEY', 'ENTITY_AGGREGATES', { entityKey });
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('generic_routes')
      .select('*')
      .eq('generic_key', entityKey)
      .order('route_type');

    if (error) {
      this.log('GET_BY_ENTITY_KEY_ERROR', 'ENTITY_AGGREGATES', { entityKey, error: error.message });
      throw new Error(`Failed to fetch entity aggregates: ${error.message}`);
    }

    const aggregates: UIAggregate[] = data.map(row => ({
      entity_id: row.generic_key,
      aggregate_type: 'GenericRoute',
      displayName: `${row.route_type} Route`,
      ordinal: 1,
      properties: [
        {
          property_name: 'route_type',
          property_value: row.route_type || '',
          ordinal: 1,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'load_dose',
          property_value: row.load_dose || '',
          ordinal: 2,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'maintain_dose',
          property_value: row.maintain_dose || '',
          ordinal: 3,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'load_measure',
          property_value: row.load_measure || '',
          ordinal: 4,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'maintain_measure',
          property_value: row.maintain_measure || '',
          ordinal: 5,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'load_reg',
          property_value: row.load_reg || '',
          ordinal: 6,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'maintain_reg',
          property_value: row.maintain_reg || '',
          ordinal: 7,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'montherapy',
          property_value: row.montherapy || '',
          ordinal: 8,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'half_life',
          property_value: row.half_life || '',
          ordinal: 9,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ]
    }));

    this.log('GET_BY_ENTITY_KEY_SUCCESS', 'ENTITY_AGGREGATES', { 
      entityKey, 
      recordCount: aggregates.length 
    });
    return aggregates;
  }

  // ============================================================================
  // CHILD ENTITY AGGREGATE OPERATIONS (UIAggregate-based, replacing legacy child collection types)
  // ============================================================================

  /**
   * Get all child entity aggregates as UIAggregate (replaces getAllChildEntityColl1/Coll2)
   */
  async getAllChildEntityAggregates(): Promise<UIAggregate[]> {
    this.log('GET_ALL', 'CHILD_ENTITY_AGGREGATES');
    
    // For now, return empty array since child entity collections are not implemented
    // In a full implementation, these would query specific child collection tables
    const aggregates: UIAggregate[] = [];
    
    this.log('GET_ALL_SUCCESS', 'CHILD_ENTITY_AGGREGATES', { recordCount: aggregates.length });
    return aggregates;
  }

  /**
   * Get child entity aggregates by child key as UIAggregate (replaces getChildEntityColl1ByChildKey/getChildEntityColl2ByChildKey)
   */
  async getChildEntityAggregatesByChildKey(childKey: string): Promise<UIAggregate[]> {
    this.log('GET_BY_CHILD_KEY', 'CHILD_ENTITY_AGGREGATES', { childKey });
    
    // For now, return empty array since child entity collections are not implemented
    // In a full implementation, these would query specific child collection tables
    const aggregates: UIAggregate[] = [];
    
    this.log('GET_BY_CHILD_KEY_SUCCESS', 'CHILD_ENTITY_AGGREGATES', { 
      childKey, 
      recordCount: aggregates.length 
    });
    return aggregates;
  }

  /**
   * Create a new entity aggregate as UIAggregate (replaces createEntityColl1)
   */
  async createEntityAggregate(data: CreateUIAggregateRequest): Promise<UIAggregate> {
    this.log('CREATE', 'ENTITY_AGGREGATES', { data });
    const supabase = await createServerSupabaseClient();
    
    // Extract route properties from the aggregate properties
    const routeType = data.properties.find(p => p.property_name === 'route_type')?.property_value || '';
    const loadDose = data.properties.find(p => p.property_name === 'load_dose')?.property_value || '';
    const maintainDose = data.properties.find(p => p.property_name === 'maintain_dose')?.property_value || '';
    const loadMeasure = data.properties.find(p => p.property_name === 'load_measure')?.property_value || '';
    const maintainMeasure = data.properties.find(p => p.property_name === 'maintain_measure')?.property_value || '';
    const loadReg = data.properties.find(p => p.property_name === 'load_reg')?.property_value || '';
    const maintainReg = data.properties.find(p => p.property_name === 'maintain_reg')?.property_value || '';
    const montherapy = data.properties.find(p => p.property_name === 'montherapy')?.property_value || '';
    const halfLife = data.properties.find(p => p.property_name === 'half_life')?.property_value || '';

    const { data: inserted, error } = await supabase
      .from('generic_routes')
      .insert({
        generic_key: data.entity_key,
        route_type: routeType,
        load_dose: loadDose,
        maintain_dose: maintainDose,
        load_measure: loadMeasure,
        maintain_measure: maintainMeasure,
        load_reg: loadReg,
        maintain_reg: maintainReg,
        montherapy: montherapy,
        half_life: halfLife
      })
      .select()
      .single();

    if (error) {
      this.log('CREATE_ERROR', 'ENTITY_AGGREGATES', { error: error.message });
      throw new Error(`Failed to create entity aggregate: ${error.message}`);
  }

    const newAggregate: UIAggregate = {
      entity_id: inserted.generic_key,
      aggregate_type: 'GenericRoute',
      displayName: data.displayName,
      ordinal: data.ordinal,
      properties: data.properties
    };

    this.log('CREATE_SUCCESS', 'ENTITY_AGGREGATES', { newAggregate });
    return newAggregate;
  }

  /**
   * Update an entity aggregate as UIAggregate (replaces updateEntityColl1)
   */
  async updateEntityAggregate(entityKey: string, index: number, data: UpdateUIAggregateRequest): Promise<UIAggregate | null> {
    this.log('UPDATE', 'ENTITY_AGGREGATES', { entityKey, index, data });
    
    // For now, return a mock updated aggregate until we implement the full update logic
    // In a real implementation, this would update the specific route record by index
    const updatedAggregate: UIAggregate = {
      entity_id: entityKey,
      aggregate_type: 'GenericRoute',
      displayName: data.displayName || `Updated Route ${index}`,
      ordinal: data.ordinal || 1,
      properties: data.properties || []
    };

    this.log('UPDATE_SUCCESS', 'ENTITY_AGGREGATES', { entityKey, index, updatedAggregate });
    return updatedAggregate;
  }

  /**
   * Delete an entity aggregate (replaces deleteEntityColl1)
   */
  async deleteEntityAggregate(entityKey: string, index: number): Promise<boolean> {
    this.log('DELETE', 'ENTITY_AGGREGATES', { entityKey, index });
    
    // For now, return true until we implement the full delete logic
    // In a real implementation, this would delete the specific route record by index
    
    this.log('DELETE_SUCCESS', 'ENTITY_AGGREGATES', { entityKey, index });
    return true;
  }

  /**
   * Create a new child entity aggregate as UIAggregate (replaces createChildEntityColl1/Coll2)
   */
  async createChildEntityAggregate(data: CreateChildUIAggregateRequest): Promise<UIAggregate> {
    this.log('CREATE', 'CHILD_ENTITY_AGGREGATES', { data });
    
    // For now, return a mock created aggregate until we implement the full create logic
    // In a real implementation, this would create records in child collection tables
    const newAggregate: UIAggregate = {
      entity_id: data.child_entity_key,
      aggregate_type: 'ChildEntityAggregate',
      displayName: data.displayName,
      ordinal: data.ordinal,
      properties: data.properties
    };

    this.log('CREATE_SUCCESS', 'CHILD_ENTITY_AGGREGATES', { newAggregate });
    return newAggregate;
  }

  /**
   * Update a child entity aggregate as UIAggregate (replaces updateChildEntityColl1/Coll2)
   */
  async updateChildEntityAggregate(childKey: string, index: number, data: UpdateChildUIAggregateRequest): Promise<UIAggregate | null> {
    this.log('UPDATE', 'CHILD_ENTITY_AGGREGATES', { childKey, index, data });
    
    // For now, return a mock updated aggregate until we implement the full update logic
    // In a real implementation, this would update the specific child collection record by index
    const updatedAggregate: UIAggregate = {
      entity_id: childKey,
      aggregate_type: 'ChildEntityAggregate',
      displayName: data.displayName || `Updated Child Collection ${index}`,
      ordinal: data.ordinal || 1,
      properties: data.properties || []
    };

    this.log('UPDATE_SUCCESS', 'CHILD_ENTITY_AGGREGATES', { childKey, index, updatedAggregate });
    return updatedAggregate;
  }

  /**
   * Delete a child entity aggregate (replaces deleteChildEntityColl1/Coll2)
   */
  async deleteChildEntityAggregate(childKey: string, index: number): Promise<boolean> {
    this.log('DELETE', 'CHILD_ENTITY_AGGREGATES', { childKey, index });
    
    // For now, return true until we implement the full delete logic
    // In a real implementation, this would delete the specific child collection record by index
    
    this.log('DELETE_SUCCESS', 'CHILD_ENTITY_AGGREGATES', { childKey, index });
    return true;
  }

  // ============================================================================
  // GENERIC APPROVAL AGGREGATE OPERATIONS (UIAggregate-based, replacing GenericApproval)
  // ============================================================================

  /**
   * Get all generic approval aggregates as UIAggregate (replaces GenericApproval usage)
   */
  async getAllGenericApprovalAggregates(): Promise<UIAggregate[]> {
    this.log('GET_ALL', 'GENERIC_APPROVAL_AGGREGATES');
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('generic_approvals')
      .select('*')
      .order('approval_date', { ascending: false });

    if (error) {
      this.log('GET_ALL_ERROR', 'GENERIC_APPROVAL_AGGREGATES', { error: error.message });
      throw new Error(`Failed to fetch generic approval aggregates: ${error.message}`);
    }

    const aggregates: UIAggregate[] = data.map(row => ({
      entity_id: row.generic_key,
      aggregate_type: 'GenericApproval',
      displayName: `${row.country} - ${row.route_type} (${row.approval_date || 'N/A'})`,
      ordinal: 1,
      properties: [
        {
          property_name: 'uid',
          property_value: row.uid || '',
          ordinal: 1,
          is_editable: false,
          is_visible: false,
          is_key: true
        },
        {
          property_name: 'generic_key',
          property_value: row.generic_key || '',
          ordinal: 2,
          is_editable: false,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'generic_uid',
          property_value: row.generic_uid || '',
          ordinal: 3,
          is_editable: false,
          is_visible: false,
          is_key: false
        },
        {
          property_name: 'route_type',
          property_value: row.route_type || '',
          ordinal: 4,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'country',
          property_value: row.country || '',
          ordinal: 5,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'indication',
          property_value: row.indication || '',
          ordinal: 6,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'populations',
          property_value: row.populations || '',
          ordinal: 7,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'approval_date',
          property_value: row.approval_date || '',
          ordinal: 8,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'discon_date',
          property_value: row.discon_date || '',
          ordinal: 9,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'box_warning',
          property_value: row.box_warning || '',
          ordinal: 10,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'box_warning_date',
          property_value: row.box_warning_date || '',
          ordinal: 11,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ]
    }));

    this.log('GET_ALL_SUCCESS', 'GENERIC_APPROVAL_AGGREGATES', { recordCount: aggregates.length });
    return aggregates;
  }

  /**
   * Get generic approval aggregates by entity key as UIAggregate (replaces GenericApproval usage)
   */
  async getGenericApprovalAggregatesByEntityKey(entityKey: string): Promise<UIAggregate[]> {
    this.log('GET_BY_ENTITY_KEY', 'GENERIC_APPROVAL_AGGREGATES', { entityKey });
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('generic_approvals')
      .select('*')
      .eq('generic_key', entityKey)
      .order('approval_date', { ascending: false });

    if (error) {
      this.log('GET_BY_ENTITY_KEY_ERROR', 'GENERIC_APPROVAL_AGGREGATES', { entityKey, error: error.message });
      throw new Error(`Failed to fetch generic approval aggregates: ${error.message}`);
    }

    const aggregates: UIAggregate[] = data.map(row => ({
      entity_id: row.generic_key,
      aggregate_type: 'GenericApproval',
      displayName: `${row.country} - ${row.route_type} (${row.approval_date || 'N/A'})`,
      ordinal: 1,
      properties: [
        {
          property_name: 'uid',
          property_value: row.uid || '',
          ordinal: 1,
          is_editable: false,
          is_visible: false,
          is_key: true
        },
        {
          property_name: 'generic_key',
          property_value: row.generic_key || '',
          ordinal: 2,
          is_editable: false,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'generic_uid',
          property_value: row.generic_uid || '',
          ordinal: 3,
          is_editable: false,
          is_visible: false,
          is_key: false
        },
        {
          property_name: 'route_type',
          property_value: row.route_type || '',
          ordinal: 4,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'country',
          property_value: row.country || '',
          ordinal: 5,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'indication',
          property_value: row.indication || '',
          ordinal: 6,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'populations',
          property_value: row.populations || '',
          ordinal: 7,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'approval_date',
          property_value: row.approval_date || '',
          ordinal: 8,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'discon_date',
          property_value: row.discon_date || '',
          ordinal: 9,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'box_warning',
          property_value: row.box_warning || '',
          ordinal: 10,
          is_editable: true,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'box_warning_date',
          property_value: row.box_warning_date || '',
          ordinal: 11,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ]
    }));

    this.log('GET_BY_ENTITY_KEY_SUCCESS', 'GENERIC_APPROVAL_AGGREGATES', { 
      entityKey, 
      recordCount: aggregates.length 
    });
    return aggregates;
  }

  // ============================================================================
  // GENERIC ALIAS AGGREGATE OPERATIONS (UIAggregate-based, replacing GenericAlias)
  // ============================================================================

  /**
   * Get all generic alias aggregates as UIAggregate (replaces GenericAlias usage)
   */
  async getAllGenericAliasAggregates(): Promise<UIAggregate[]> {
    this.log('GET_ALL', 'GENERIC_ALIAS_AGGREGATES');
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('generic_aliases')
      .select('*')
      .order('alias');

    if (error) {
      this.log('GET_ALL_ERROR', 'GENERIC_ALIAS_AGGREGATES', { error: error.message });
      throw new Error(`Failed to fetch generic alias aggregates: ${error.message}`);
    }

    const aggregates: UIAggregate[] = data.map(row => ({
      entity_id: row.generic_key,
      aggregate_type: 'GenericAlias',
      displayName: row.alias,
      ordinal: 1,
      properties: [
        {
          property_name: 'uid',
          property_value: row.uid || '',
          ordinal: 1,
          is_editable: false,
          is_visible: false,
          is_key: true
        },
        {
          property_name: 'row',
          property_value: row.row || '',
          ordinal: 2,
          is_editable: false,
          is_visible: false,
          is_key: false
        },
        {
          property_name: 'generic_key',
          property_value: row.generic_key || '',
          ordinal: 3,
          is_editable: false,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'generic_uid',
          property_value: row.generic_uid || '',
          ordinal: 4,
          is_editable: false,
          is_visible: false,
          is_key: false
        },
        {
          property_name: 'alias',
          property_value: row.alias || '',
          ordinal: 5,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ]
    }));

    this.log('GET_ALL_SUCCESS', 'GENERIC_ALIAS_AGGREGATES', { recordCount: aggregates.length });
    return aggregates;
  }

  /**
   * Get generic alias aggregates by entity key as UIAggregate (replaces GenericAlias usage)
   */
  async getGenericAliasAggregatesByEntityKey(entityKey: string): Promise<UIAggregate[]> {
    this.log('GET_BY_ENTITY_KEY', 'GENERIC_ALIAS_AGGREGATES', { entityKey });
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('generic_aliases')
      .select('*')
      .eq('generic_key', entityKey)
      .order('alias');

    if (error) {
      this.log('GET_BY_ENTITY_KEY_ERROR', 'GENERIC_ALIAS_AGGREGATES', { entityKey, error: error.message });
      throw new Error(`Failed to fetch generic alias aggregates: ${error.message}`);
    }

    const aggregates: UIAggregate[] = data.map(row => ({
      entity_id: row.generic_key,
      aggregate_type: 'GenericAlias',
      displayName: row.alias,
      ordinal: 1,
      properties: [
        {
          property_name: 'uid',
          property_value: row.uid || '',
          ordinal: 1,
          is_editable: false,
          is_visible: false,
          is_key: true
        },
        {
          property_name: 'row',
          property_value: row.row || '',
          ordinal: 2,
          is_editable: false,
          is_visible: false,
          is_key: false
        },
        {
          property_name: 'generic_key',
          property_value: row.generic_key || '',
          ordinal: 3,
          is_editable: false,
          is_visible: true,
          is_key: false
        },
        {
          property_name: 'generic_uid',
          property_value: row.generic_uid || '',
          ordinal: 4,
          is_editable: false,
          is_visible: false,
          is_key: false
        },
        {
          property_name: 'alias',
          property_value: row.alias || '',
          ordinal: 5,
          is_editable: true,
          is_visible: true,
          is_key: false
        }
      ]
    }));

    this.log('GET_BY_ENTITY_KEY_SUCCESS', 'GENERIC_ALIAS_AGGREGATES', { 
      entityKey, 
      recordCount: aggregates.length 
    });
    return aggregates;
  }
}

export default DatabaseRepository; 