import { BaseRepository } from './base_repository';
import { 
  UIEntity,
  CreateEntityRequest,
  UpdateEntityRequest
} from '@/model_defs';

/**
 * Repository for Entity operations (generic_drugs table)
 * Handles CRUD operations for main entities
 */
export class EntityRepository extends BaseRepository {
  
  // ============================================================================
  // ENTITY OPERATIONS (generic_drugs table)
  // ============================================================================

  async getAllEntities(): Promise<UIEntity[]> {
    this.log('GET_ALL_AS_UI_ENTITIES', 'ENTITIES');
    const supabase = await this.getSupabaseClient();
    
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
    const supabase = await this.getSupabaseClient();
    
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
    this.log('SEARCH_AS_UI_ENTITIES', 'ENTITIES', { searchTerm });
    const supabase = await this.getSupabaseClient();
    
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
    const supabase = await this.getSupabaseClient();
    
    const newEntity: any = {
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
    const supabase = await this.getSupabaseClient();
    
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
    const supabase = await this.getSupabaseClient();
    
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
} 