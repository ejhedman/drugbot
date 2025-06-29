import { BaseRepository } from './base_repository';
import { 
  UIEntity,
  UIEntityRef,
  CreateChildEntityRequest,
  UpdateChildEntityRequest
} from '@/model_defs';

/**
 * Repository for Child Entity operations (manu_drugs table)
 * Handles CRUD operations for child entities (manufactured drugs)
 */
export class ChildEntityRepository extends BaseRepository {
  
  // ============================================================================
  // CHILD ENTITY OPERATIONS (manu_drugs table)
  // ============================================================================

  async getChildrenAsUIEntitiesByEntityKey(entityKey: string): Promise<UIEntity[]> {
    this.log('GET_AS_UI_ENTITIES_BY_ENTITY_KEY', 'CHILD_ENTITIES', { entityKey });
    const supabase = await this.getSupabaseClient();
    
    // Get the child entities and parent info in one query
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

    // Create parent entity reference for ancestors (same for all children)
    const parentInfo = data[0].generic_drugs;
    const parentEntityRef: UIEntityRef = {
      entity_id: parentInfo.uid,
      displayName: parentInfo.generic_name,
      ancestors: [],
      children: []
    };

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
    }));

    this.log('GET_AS_UI_ENTITIES_BY_ENTITY_KEY_SUCCESS', 'CHILD_ENTITIES', { 
      entityKey, 
      recordCount: children.length 
    });
    return children;
  }

  // async getAllChildrenAsUIEntities(): Promise<UIEntity[]> {
  //   this.log('GET_ALL_AS_UI_ENTITIES', 'CHILD_ENTITIES');
  //   const supabase = await this.getSupabaseClient();
    
  //   const { data, error } = await supabase
  //     .from('manu_drugs')
  //     .select('*, generic_drugs!inner(uid, generic_key, generic_name, mech_of_action)')
  //     .order('drug_name');

  //   if (error) {
  //     this.log('GET_ALL_AS_UI_ENTITIES_ERROR', 'CHILD_ENTITIES', { error: error.message });
  //     throw new Error(`Failed to fetch child entities: ${error.message}`);
  //   }

  //   const children: UIEntity[] = data.map(row => {
  //     // Create parent entity reference for ancestors
  //     const parentInfo = row.generic_drugs;
  //     const parentEntityRef: UIEntityRef = {
  //       entity_id: parentInfo.uid,
  //       displayName: parentInfo.generic_name,
  //       ancestors: [],
  //       children: []
  //     };

  //     return {
  //       entity_id: row.uid,
  //       entity_key: row.manu_drug_key,
  //       displayName: row.drug_name,
  //       properties: [
  //         {
  //           property_name: 'child_entity_key',
  //           property_value: row.manu_drug_key,
  //           ordinal: 1,
  //           is_editable: false,
  //           is_visible: true,
  //           is_key: true
  //         },
  //         {
  //           property_name: 'entity_key',
  //           property_value: row.generic_key,
  //           ordinal: 2,
  //           is_editable: false,
  //           is_visible: true,
  //           is_key: false
  //         },
  //         {
  //           property_name: 'child_entity_name',
  //           property_value: row.drug_name,
  //           ordinal: 3,
  //           is_editable: true,
  //           is_visible: true,
  //           is_key: false
  //         },
  //         {
  //           property_name: 'child_entity_property1',
  //           property_value: row.manufacturer || '',
  //           ordinal: 4,
  //           is_editable: true,
  //           is_visible: true,
  //           is_key: false
  //         }
  //       ],
  //       aggregates: [],
  //       ancestors: [parentEntityRef], // Parent is the first (and only) ancestor
  //       children: []
  //     };
  //   });

  //   this.log('GET_ALL_AS_UI_ENTITIES_SUCCESS', 'CHILD_ENTITIES', { recordCount: children.length });
  //   return children;
  // }

  async getChildByKey(childKey: string): Promise<UIEntity | null> {
    return this.getChildByKeyAsUIEntity(childKey);
  }

  async getChildByKeyAsUIEntity(childKey: string): Promise<UIEntity | null> {
    this.log('GET_BY_KEY_AS_UI_ENTITY', 'CHILD_ENTITIES', { childKey });
    
    const supabase = await this.getSupabaseClient();
    
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

  async searchChildrenAsUIEntities(searchTerm: string): Promise<UIEntity[]> {
    this.log('SEARCH_AS_UI_ENTITIES', 'CHILD_ENTITIES', { searchTerm });
    const supabase = await this.getSupabaseClient();
    
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

    const children: UIEntity[] = data.map(row => {
      // Create parent entity reference for ancestors
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

  async createChildEntityAsUIEntity(data: CreateChildEntityRequest): Promise<UIEntity> {
    this.log('CREATE_AS_UI_ENTITY', 'CHILD_ENTITIES', { data });
    const supabase = await this.getSupabaseClient();
    
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

    const newChild: any = {
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

  async updateChildEntityAsUIEntity(childKey: string, data: UpdateChildEntityRequest): Promise<UIEntity | null> {
    this.log('UPDATE_AS_UI_ENTITY', 'CHILD_ENTITIES', { childKey, data });
    const supabase = await this.getSupabaseClient();
    
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
    const supabase = await this.getSupabaseClient();
    
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
} 