import { BaseRepository } from './base_repository';
import { createServerSupabaseClient } from '../lib/supabase-server';
import { 
  UIAggregate,
  CreateUIAggregateRequest,
  UpdateUIAggregateRequest,
  CreateChildUIAggregateRequest,
  UpdateChildUIAggregateRequest
} from '@/model_defs';

/**
 * Repository for aggregate operations
 * Handles entity aggregates, child entity aggregates, generic approvals, and generic aliases
 */
export class AggregateRepository extends BaseRepository {
  
  // ============================================================================
  // ENTITY AGGREGATES (Generic Routes)
  // ============================================================================

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

  // ============================================================================
  // CHILD ENTITY AGGREGATES
  // ============================================================================

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
  // GENERIC APPROVAL AGGREGATES
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
  // GENERIC ALIAS AGGREGATES
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

export default AggregateRepository; 