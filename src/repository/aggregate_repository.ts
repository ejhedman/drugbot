import { BaseRepository } from './base_repository';
import { createServerSupabaseClient } from '../lib/supabase-server';
import { 
  UIAggregate,
} from '@/model_defs';

/**
 * Repository for aggregate operations
 * Handles entity aggregates, child entity aggregates, generic approvals, and generic aliases
 */
export class AggregateRepository extends BaseRepository {
  
  // ============================================================================
  // GENERIC ROUTES
  // ============================================================================
  async getGenericRouteAggregatesByEntityKey(entityKey: string): Promise<UIAggregate[]> {
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
      entityUid: row.generic_key,
      aggregateType: 'GenericRoute',
      displayName: `${row.route_type} Route`,
      ordinal: 1,
      properties: [
        {
          propertyName: 'route_type',
          propertyValue: row.route_type || '',
          ordinal: 1,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'load_dose',
          propertyValue: row.load_dose || '',
          ordinal: 2,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'maintain_dose',
          propertyValue: row.maintain_dose || '',
          ordinal: 3,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'load_measure',
          propertyValue: row.load_measure || '',
          ordinal: 4,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'maintain_measure',
          propertyValue: row.maintain_measure || '',
          ordinal: 5,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'load_reg',
          propertyValue: row.load_reg || '',
          ordinal: 6,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'maintain_reg',
          propertyValue: row.maintain_reg || '',
          ordinal: 7,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'montherapy',
          propertyValue: row.montherapy || '',
          ordinal: 8,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'half_life',
          propertyValue: row.half_life || '',
          ordinal: 9,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
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
  // GENERIC APPROVAL AGGREGATES
  // ============================================================================
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
      entityUid: row.generic_key,
      aggregateType: 'GenericApproval',
      displayName: `${row.country} - ${row.route_type} (${row.approval_date || 'N/A'})`,
      ordinal: 1,
      properties: [
        {
          propertyName: 'uid',
          propertyValue: row.uid || '',
          ordinal: 1,
          isEditable: false,
          isVisible: false,
          isKey: true,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'generic_key',
          propertyValue: row.generic_key || '',
          ordinal: 2,
          isEditable: false,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'generic_uid',
          propertyValue: row.generic_uid || '',
          ordinal: 3,
          isEditable: false,
          isVisible: false,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'route_type',
          propertyValue: row.route_type || '',
          ordinal: 4,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'country',
          propertyValue: row.country || '',
          ordinal: 5,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'indication',
          propertyValue: row.indication || '',
          ordinal: 6,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'populations',
          propertyValue: row.populations || '',
          ordinal: 7,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'approval_date',
          propertyValue: row.approval_date || '',
          ordinal: 8,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'discon_date',
          propertyValue: row.discon_date || '',
          ordinal: 9,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'box_warning',
          propertyValue: row.box_warning || '',
          ordinal: 10,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'box_warning_date',
          propertyValue: row.box_warning_date || '',
          ordinal: 11,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
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
      entityUid: row.generic_key,
      aggregateType: 'GenericAlias',
      displayName: row.alias,
      ordinal: 1,
      properties: [
        {
          propertyName: 'uid',
          propertyValue: row.uid || '',
          ordinal: 1,
          isEditable: false,
          isVisible: false,
          isKey: true,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'row',
          propertyValue: row.row || '',
          ordinal: 2,
          isEditable: false,
          isVisible: false,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'generic_key',
          propertyValue: row.generic_key || '',
          ordinal: 3,
          isEditable: false,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'generic_uid',
          propertyValue: row.generic_uid || '',
          ordinal: 4,
          isEditable: false,
          isVisible: false,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
        },
        {
          propertyName: 'alias',
          propertyValue: row.alias || '',
          ordinal: 5,
          isEditable: true,
          isVisible: true,
          isKey: false,
          isId: false,
          isRequired: true,
          controlType: 'text',
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