import { createServerSupabaseClient } from './supabase-server';
import { 
  LegacyEntity, 
  LegacyChildEntity,
  LegacyEntityColl1,
  LegacyChildEntityColl1,
  LegacyChildEntityColl2,
  CreateEntityRequest,
  UpdateEntityRequest,
  CreateChildEntityRequest,
  UpdateChildEntityRequest,
  CreateLegacyEntityColl1Request,
  UpdateLegacyEntityColl1Request,
  CreateLegacyChildEntityColl1Request,
  UpdateLegacyChildEntityColl1Request,
  CreateLegacyChildEntityColl2Request,
  UpdateLegacyChildEntityColl2Request
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

  async getAllEntities(): Promise<LegacyEntity[]> {
    this.log('GET_ALL', 'ENTITIES');
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('generic_drugs')
      .select('*')
      .order('generic_name');

    if (error) {
      this.log('GET_ALL_ERROR', 'ENTITIES', { error: error.message });
      throw new Error(`Failed to fetch entities: ${error.message}`);
    }

    const entities: LegacyEntity[] = data.map(row => ({
      entity_key: row.generic_key,
      entity_name: row.generic_name,
      entity_property1: row.mech_of_action || ''
    }));

    this.log('GET_ALL_SUCCESS', 'ENTITIES', { recordCount: entities.length });
    return entities;
  }

  async getEntityByKey(entityKey: string): Promise<LegacyEntity | null> {
    this.log('GET_BY_KEY', 'ENTITIES', { entityKey });
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('generic_drugs')
      .select('*')
      .eq('generic_key', entityKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        this.log('GET_BY_KEY_NOT_FOUND', 'ENTITIES', { entityKey });
        return null;
      }
      this.log('GET_BY_KEY_ERROR', 'ENTITIES', { entityKey, error: error.message });
      throw new Error(`Failed to fetch entity: ${error.message}`);
    }

    const entity: LegacyEntity = {
      entity_key: data.generic_key,
      entity_name: data.generic_name,
      entity_property1: data.mech_of_action || ''
    };

    this.log('GET_BY_KEY_SUCCESS', 'ENTITIES', { entityKey, entityName: entity.entity_name });
    return entity;
  }

  async searchEntities(searchTerm: string): Promise<LegacyEntity[]> {
    this.log('SEARCH', 'ENTITIES', { searchTerm });
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
      this.log('SEARCH_ERROR', 'ENTITIES', { searchTerm, error: error.message });
      throw new Error(`Failed to search entities: ${error.message}`);
    }

    const entities: LegacyEntity[] = data.map(row => ({
      entity_key: row.generic_key,
      entity_name: row.generic_name,
      entity_property1: row.mech_of_action || ''
    }));

    this.log('SEARCH_SUCCESS', 'ENTITIES', { 
      searchTerm, 
      matchedRecords: entities.length 
    });
    return entities;
  }

  async createEntity(data: CreateEntityRequest): Promise<LegacyEntity> {
    this.log('CREATE', 'ENTITIES', { data });
    const supabase = await createServerSupabaseClient();
    
    const newEntity = {
      generic_key: this.generateKey('generic'),
      generic_name: data.entity_name,
      mech_of_action: data.entity_property1
    };

    const { data: inserted, error } = await supabase
      .from('generic_drugs')
      .insert(newEntity)
      .select()
      .single();

    if (error) {
      this.log('CREATE_ERROR', 'ENTITIES', { data, error: error.message });
      throw new Error(`Failed to create entity: ${error.message}`);
    }

    const entity: LegacyEntity = {
      entity_key: inserted.generic_key,
      entity_name: inserted.generic_name,
      entity_property1: inserted.mech_of_action || ''
    };

    this.log('CREATE_SUCCESS', 'ENTITIES', { newEntity: entity });
    return entity;
  }

  async updateEntity(entityKey: string, data: UpdateEntityRequest): Promise<LegacyEntity | null> {
    this.log('UPDATE', 'ENTITIES', { entityKey, data });
    const supabase = await createServerSupabaseClient();
    
    const updateData: any = {};
    if (data.entity_name !== undefined) updateData.generic_name = data.entity_name;
    if (data.entity_property1 !== undefined) updateData.mech_of_action = data.entity_property1;

    const { data: updated, error } = await supabase
      .from('generic_drugs')
      .update(updateData)
      .eq('generic_key', entityKey)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        this.log('UPDATE_NOT_FOUND', 'ENTITIES', { entityKey });
        return null;
      }
      this.log('UPDATE_ERROR', 'ENTITIES', { entityKey, data, error: error.message });
      throw new Error(`Failed to update entity: ${error.message}`);
    }

    const entity: LegacyEntity = {
      entity_key: updated.generic_key,
      entity_name: updated.generic_name,
      entity_property1: updated.mech_of_action || ''
    };

    this.log('UPDATE_SUCCESS', 'ENTITIES', { entityKey, updatedEntity: entity });
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

  async getAllChildren(): Promise<LegacyChildEntity[]> {
    this.log('GET_ALL', 'CHILD_ENTITIES');
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('manu_drugs')
      .select('*')
      .order('drug_name');

    if (error) {
      this.log('GET_ALL_ERROR', 'CHILD_ENTITIES', { error: error.message });
      throw new Error(`Failed to fetch child entities: ${error.message}`);
    }

    const children: LegacyChildEntity[] = data.map(row => ({
      child_entity_key: row.manu_drug_key,
      entity_key: row.generic_key || '', // This might need to be derived from generic_uid
      child_entity_name: row.drug_name,
      child_entity_property1: row.manufacturer || ''
    }));

    this.log('GET_ALL_SUCCESS', 'CHILD_ENTITIES', { recordCount: children.length });
    return children;
  }

  async getChildrenByEntityKey(entityKey: string): Promise<LegacyChildEntity[]> {
    this.log('GET_BY_ENTITY_KEY', 'CHILD_ENTITIES', { entityKey });
    const supabase = await createServerSupabaseClient();
    
    // First get the generic_uid from the entity_key
    const { data: genericDrug, error: genericError } = await supabase
      .from('generic_drugs')
      .select('uid')
      .eq('generic_key', entityKey)
      .single();

    if (genericError) {
      this.log('GET_BY_ENTITY_KEY_ERROR', 'CHILD_ENTITIES', { entityKey, error: 'Entity not found' });
      return [];
    }

    const { data, error } = await supabase
      .from('manu_drugs')
      .select('*')
      .eq('generic_uid', genericDrug.uid)
      .order('drug_name');

    if (error) {
      this.log('GET_BY_ENTITY_KEY_ERROR', 'CHILD_ENTITIES', { entityKey, error: error.message });
      throw new Error(`Failed to fetch child entities: ${error.message}`);
    }

    const children: LegacyChildEntity[] = data.map(row => ({
      child_entity_key: row.manu_drug_key,
      entity_key: entityKey,
      child_entity_name: row.drug_name,
      child_entity_property1: row.manufacturer || ''
    }));

    this.log('GET_BY_ENTITY_KEY_SUCCESS', 'CHILD_ENTITIES', { 
      entityKey, 
      recordCount: children.length 
    });
    return children;
  }

  async getChildByKey(childKey: string): Promise<LegacyChildEntity | null> {
    this.log('GET_BY_KEY', 'CHILD_ENTITIES', { childKey });
    
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('manu_drugs')
      .select('*, generic_drugs!inner(generic_key)')
      .eq('manu_drug_key', childKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        this.log('GET_BY_KEY_NOT_FOUND', 'CHILD_ENTITIES', { childKey });
        return null;
      }
      this.log('GET_BY_KEY_ERROR', 'CHILD_ENTITIES', { childKey, error: error.message });
      throw new Error(`Failed to fetch child entity: ${error.message}`);
    }

    const child: LegacyChildEntity = {
      child_entity_key: data.manu_drug_key,
      entity_key: data.generic_drugs.generic_key,
      child_entity_name: data.drug_name,
      child_entity_property1: data.manufacturer || ''
    };

    this.log('GET_BY_KEY_SUCCESS', 'CHILD_ENTITIES', { childKey, childName: child.child_entity_name });
    return child;
  }

  async searchChildren(searchTerm: string): Promise<LegacyChildEntity[]> {
    this.log('SEARCH', 'CHILD_ENTITIES', { searchTerm });
    const supabase = await createServerSupabaseClient();
    
    let query = supabase
      .from('manu_drugs')
      .select('*, generic_drugs!inner(generic_key)')
      .order('drug_name');

    if (searchTerm) {
      query = query.or(`drug_name.ilike.%${searchTerm}%,manufacturer.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      this.log('SEARCH_ERROR', 'CHILD_ENTITIES', { searchTerm, error: error.message });
      throw new Error(`Failed to search child entities: ${error.message}`);
    }

    const children: LegacyChildEntity[] = data.map(row => ({
      child_entity_key: row.manu_drug_key,
      entity_key: row.generic_drugs.generic_key,
      child_entity_name: row.drug_name,
      child_entity_property1: row.manufacturer || ''
    }));

    this.log('SEARCH_SUCCESS', 'CHILD_ENTITIES', { 
      searchTerm, 
      matchedRecords: children.length 
    });
    return children;
  }

  async createChildEntity(data: CreateChildEntityRequest): Promise<LegacyChildEntity> {
    this.log('CREATE', 'CHILD_ENTITIES', { data });
    const supabase = await createServerSupabaseClient();
    
    // Get the generic_uid for the foreign key
    const { data: genericDrug, error: genericError } = await supabase
      .from('generic_drugs')
      .select('uid')
      .eq('generic_key', data.entity_key)
      .single();

    if (genericError) {
      this.log('CREATE_ERROR', 'CHILD_ENTITIES', { data, error: 'Parent entity not found' });
      throw new Error(`Parent entity not found: ${genericError.message}`);
    }

    const newChild = {
      manu_drug_key: this.generateKey('manu'),
      drug_name: data.child_entity_name,
      manufacturer: data.child_entity_property1 || '',
      generic_uid: genericDrug.uid
    };

    const { data: inserted, error } = await supabase
      .from('manu_drugs')
      .insert(newChild)
      .select()
      .single();

    if (error) {
      this.log('CREATE_ERROR', 'CHILD_ENTITIES', { data, error: error.message });
      throw new Error(`Failed to create child entity: ${error.message}`);
    }

    const child: LegacyChildEntity = {
      child_entity_key: inserted.manu_drug_key,
      entity_key: data.entity_key,
      child_entity_name: inserted.drug_name,
      child_entity_property1: inserted.manufacturer || ''
    };

    this.log('CREATE_SUCCESS', 'CHILD_ENTITIES', { newChild: child });
    return child;
  }

  async updateChildEntity(childKey: string, data: UpdateChildEntityRequest): Promise<LegacyChildEntity | null> {
    this.log('UPDATE', 'CHILD_ENTITIES', { childKey, data });
    
    const supabase = await createServerSupabaseClient();
    
    const updateData: any = {};
    if (data.child_entity_name !== undefined) updateData.drug_name = data.child_entity_name;
    if (data.child_entity_property1 !== undefined) updateData.manufacturer = data.child_entity_property1;

    const { data: updated, error } = await supabase
      .from('manu_drugs')
      .update(updateData)
      .eq('manu_drug_key', childKey)
      .select('*, generic_drugs!inner(generic_key)')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        this.log('UPDATE_NOT_FOUND', 'CHILD_ENTITIES', { childKey });
        return null;
      }
      this.log('UPDATE_ERROR', 'CHILD_ENTITIES', { childKey, data, error: error.message });
      throw new Error(`Failed to update child entity: ${error.message}`);
    }

    const child: LegacyChildEntity = {
      child_entity_key: updated.manu_drug_key,
      entity_key: updated.generic_drugs.generic_key,
      child_entity_name: updated.drug_name,
      child_entity_property1: updated.manufacturer || ''
    };

    this.log('UPDATE_SUCCESS', 'CHILD_ENTITIES', { childKey, updatedChild: child });
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
  // ENTITY COLL1 OPERATIONS (mapped to generic_routes table)
  // ============================================================================

  async getAllEntityColl1(): Promise<LegacyEntityColl1[]> {
    this.log('GET_ALL', 'ENTITY_COLL1');
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('generic_routes')
      .select('*')
      .order('route_type');

    if (error) {
      this.log('GET_ALL_ERROR', 'ENTITY_COLL1', { error: error.message });
      throw new Error(`Failed to fetch entity coll1: ${error.message}`);
    }

    const routes: LegacyEntityColl1[] = data.map(row => ({
      entity_key: row.generic_key,
      coll1_property1: row.route_type || '',
      coll1_property2: row.load_dose || '',
      coll1_property3: parseInt(row.maintain_dose) || 0
    }));

    this.log('GET_ALL_SUCCESS', 'ENTITY_COLL1', { recordCount: routes.length });
    return routes;
  }

  async getEntityColl1ByEntityKey(entityKey: string): Promise<LegacyEntityColl1[]> {
    this.log('GET_BY_ENTITY_KEY', 'ENTITY_COLL1', { entityKey });
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('generic_routes')
      .select('*')
      .eq('generic_key', entityKey)
      .order('route_type');

    if (error) {
      this.log('GET_BY_ENTITY_KEY_ERROR', 'ENTITY_COLL1', { entityKey, error: error.message });
      throw new Error(`Failed to fetch entity coll1: ${error.message}`);
    }

    const routes: LegacyEntityColl1[] = data.map(row => ({
      entity_key: row.generic_key,
      coll1_property1: row.route_type || '',
      coll1_property2: row.load_dose || '',
      coll1_property3: parseInt(row.maintain_dose) || 0
    }));

    this.log('GET_BY_ENTITY_KEY_SUCCESS', 'ENTITY_COLL1', { 
      entityKey, 
      recordCount: routes.length 
    });
    return routes;
  }

  // Implementation continues for other EntityColl1, ChildEntityColl1, and ChildEntityColl2 operations...
  // Placeholder methods to maintain interface compatibility

  async createEntityColl1(data: CreateLegacyEntityColl1Request): Promise<LegacyEntityColl1> {
    // TODO: Implement create entity coll1
    throw new Error('Not yet implemented');
  }

  async updateEntityColl1(entityKey: string, index: number, data: UpdateLegacyEntityColl1Request): Promise<LegacyEntityColl1 | null> {
    // TODO: Implement update entity coll1
    throw new Error('Not yet implemented');
  }

  async deleteEntityColl1(entityKey: string, index: number): Promise<boolean> {
    // TODO: Implement delete entity coll1
    throw new Error('Not yet implemented');
  }

  async getAllChildEntityColl1(): Promise<LegacyChildEntityColl1[]> {
    // TODO: Implement get all child entity coll1
    throw new Error('Not yet implemented');
  }

  async getChildEntityColl1ByChildKey(childKey: string): Promise<LegacyChildEntityColl1[]> {
    // TODO: Implement get child entity coll1 by child key
    throw new Error('Not yet implemented');
  }

  async createChildEntityColl1(data: CreateLegacyChildEntityColl1Request): Promise<LegacyChildEntityColl1> {
    // TODO: Implement create child entity coll1
    throw new Error('Not yet implemented');
  }

  async updateChildEntityColl1(childKey: string, index: number, data: UpdateLegacyChildEntityColl1Request): Promise<LegacyChildEntityColl1 | null> {
    // TODO: Implement update child entity coll1
    throw new Error('Not yet implemented');
  }

  async deleteChildEntityColl1(childKey: string, index: number): Promise<boolean> {
    // TODO: Implement delete child entity coll1
    throw new Error('Not yet implemented');
  }

  async getAllChildEntityColl2(): Promise<LegacyChildEntityColl2[]> {
    // TODO: Implement get all child entity coll2
    throw new Error('Not yet implemented');
  }

  async getChildEntityColl2ByChildKey(childKey: string): Promise<LegacyChildEntityColl2[]> {
    // TODO: Implement get child entity coll2 by child key
    throw new Error('Not yet implemented');
  }

  async createChildEntityColl2(data: CreateLegacyChildEntityColl2Request): Promise<LegacyChildEntityColl2> {
    // TODO: Implement create child entity coll2
    throw new Error('Not yet implemented');
  }

  async updateChildEntityColl2(childKey: string, index: number, data: UpdateLegacyChildEntityColl2Request): Promise<LegacyChildEntityColl2 | null> {
    // TODO: Implement update child entity coll2
    throw new Error('Not yet implemented');
  }

  async deleteChildEntityColl2(childKey: string, index: number): Promise<boolean> {
    // TODO: Implement delete child entity coll2
    throw new Error('Not yet implemented');
  }
}

export default DatabaseRepository; 