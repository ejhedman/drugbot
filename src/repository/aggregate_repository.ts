import { BaseRepository } from './base_repository';
import { createServerSupabaseClient } from '../lib/supabase-server';
import { 
  UIAggregate,
  UIProperty,
} from '@/model_defs';

/**
 * Repository for aggregate operations
 * Handles entity aggregates, child entity aggregates, generic approvals, and generic aliases
 */
export class AggregateRepository extends BaseRepository {

  // ============================================================================
  // HELPER METHODS
  // ============================================================================
  
  /**
   * Helper function to create a property array from database row fields
   */
  private createPropertiesFromRow(row: any, fieldDefinitions: Array<{name: string, ordinal: number, isEditable: boolean, isVisible: boolean, isKey: boolean, isId: boolean, isRequired: boolean, controlType: string}>): UIProperty[] {
    return fieldDefinitions.map(field => ({
      propertyName: field.name,
      propertyValue: row[field.name] || '',
      ordinal: field.ordinal,
      isEditable: field.isEditable,
      isVisible: field.isVisible,
      isKey: field.isKey,
      isId: field.isId,
      isRequired: field.isRequired,
      controlType: field.controlType as any,
    }));
  }
  
  // ============================================================================
  // GENERIC ROUTES
  // ============================================================================
  async getGenericRouteAggregatesByEntityKey(entityKey: string): Promise<UIAggregate> {
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

    // Define field structure for generic routes
    const routeFields = [
      { name: 'route_type', ordinal: 1, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'load_dose', ordinal: 2, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'maintain_dose', ordinal: 3, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'load_measure', ordinal: 4, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'maintain_measure', ordinal: 5, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'load_reg', ordinal: 6, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'maintain_reg', ordinal: 7, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'montherapy', ordinal: 8, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'half_life', ordinal: 9, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' }
    ];

    // Convert each database row to a row of properties
    const rows: UIProperty[][] = data.map(row => this.createPropertiesFromRow(row, routeFields));

    const aggregate: UIAggregate = {
      entityUid: entityKey,
      aggregateType: 'GenericRoute',
      displayName: 'Routes & Dosing',
      ordinal: 1,
      rows: rows
    };

    this.log('GET_BY_ENTITY_KEY_SUCCESS', 'ENTITY_AGGREGATES', { 
      entityKey, 
      recordCount: rows.length 
    });
    return aggregate;
  }

  // ============================================================================
  // GENERIC APPROVAL AGGREGATES
  // ============================================================================
  async getGenericApprovalAggregatesByEntityKey(entityKey: string): Promise<UIAggregate> {
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

    // Define field structure for generic approvals
    const approvalFields = [
      { name: 'uid', ordinal: 1, isEditable: false, isVisible: false, isKey: true, isId: false, isRequired: true, controlType: 'text' },
      { name: 'generic_key', ordinal: 2, isEditable: false, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'generic_uid', ordinal: 3, isEditable: false, isVisible: false, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'route_type', ordinal: 4, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'country', ordinal: 5, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'indication', ordinal: 6, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'populations', ordinal: 7, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'approval_date', ordinal: 8, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'discon_date', ordinal: 9, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'box_warning', ordinal: 10, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'box_warning_date', ordinal: 11, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' }
    ];

    // Convert each database row to a row of properties
    const rows: UIProperty[][] = data.map(row => this.createPropertiesFromRow(row, approvalFields));

    const aggregate: UIAggregate = {
      entityUid: entityKey,
      aggregateType: 'GenericApproval',
      displayName: 'Approvals',
      ordinal: 2,
      rows: rows
    };

    this.log('GET_BY_ENTITY_KEY_SUCCESS', 'GENERIC_APPROVAL_AGGREGATES', { 
      entityKey, 
      recordCount: rows.length 
    });
    return aggregate;
  }

  // ============================================================================
  // GENERIC ALIAS AGGREGATES
  // ============================================================================
  async getGenericAliasAggregatesByEntityKey(entityKey: string): Promise<UIAggregate> {
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

    // Define field structure for generic aliases
    const aliasFields = [
      { name: 'uid', ordinal: 1, isEditable: false, isVisible: false, isKey: true, isId: false, isRequired: true, controlType: 'text' },
      { name: 'row', ordinal: 2, isEditable: false, isVisible: false, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'generic_key', ordinal: 3, isEditable: false, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'generic_uid', ordinal: 4, isEditable: false, isVisible: false, isKey: false, isId: false, isRequired: true, controlType: 'text' },
      { name: 'alias', ordinal: 5, isEditable: true, isVisible: true, isKey: false, isId: false, isRequired: true, controlType: 'text' }
    ];

    // Convert each database row to a row of properties
    const rows: UIProperty[][] = data.map(row => this.createPropertiesFromRow(row, aliasFields));

    const aggregate: UIAggregate = {
      entityUid: entityKey,
      aggregateType: 'GenericAlias',
      displayName: 'Aliases',
      ordinal: 3,
      rows: rows
    };

    this.log('GET_BY_ENTITY_KEY_SUCCESS', 'GENERIC_ALIAS_AGGREGATES', { 
      entityKey, 
      recordCount: rows.length 
    });
    return aggregate;
  }
}

export default AggregateRepository; 