import { BaseRepository } from './base_repository';
import { createServerSupabaseClient } from '../lib/supabase-server';
import { 
  UIAggregate,
  UIProperty,
} from '@/model_defs';
import { ENTITY_AGGREGATES } from '@/model_instances/TheUIModel';

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

  /**
   * Get field definitions from UIModel schema
   */
  private getFieldsFromSchema(aggregateKey: string): Array<{name: string, ordinal: number, isEditable: boolean, isVisible: boolean, isKey: boolean, isId: boolean, isRequired: boolean, controlType: string}> {
    const aggregateDef = ENTITY_AGGREGATES[aggregateKey];
    if (!aggregateDef || !aggregateDef.propertyDefs) {
      throw new Error(`Aggregate definition not found: ${aggregateKey}`);
    }

    return aggregateDef.propertyDefs.map((prop: any) => ({
      name: prop.propertyName,
      ordinal: prop.ordinal,
      isEditable: prop.isEditable,
      isVisible: prop.isVisible,
      isKey: prop.isKey,
      isId: prop.isId,
      isRequired: prop.isRequired,
      controlType: prop.controlType
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

    // Get field definitions from UIModel schema instead of hardcoding
    const routeFields = this.getFieldsFromSchema('generic_routes');

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

    // Get field definitions from UIModel schema instead of hardcoding
    const approvalFields = this.getFieldsFromSchema('generic_approvals');

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

    // Get field definitions from UIModel schema instead of hardcoding
    const aliasFields = this.getFieldsFromSchema('generic_aliases');

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

  // ============================================================================
  // GENERIC MANUFACTURED DRUGS AGGREGATES
  // ============================================================================
  async getGenericManuDrugsAggregatesByEntityKey(entityKey: string): Promise<UIAggregate> {
    this.log('GET_BY_ENTITY_KEY', 'GENERIC_MANU_DRUGS_AGGREGATES', { entityKey });
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('manu_drugs')
      .select('*')
      .eq('generic_key', entityKey)
      .order('drug_name');

    if (error) {
      this.log('GET_BY_ENTITY_KEY_ERROR', 'GENERIC_MANU_DRUGS_AGGREGATES', { entityKey, error: error.message });
      throw new Error(`Failed to fetch generic manufactured drugs aggregates: ${error.message}`);
    }

    // Get field definitions from UIModel schema instead of hardcoding
    const manuDrugFields = this.getFieldsFromSchema('generic_manu_drugs');

    // Convert each database row to a row of properties
    const rows: UIProperty[][] = data.map(row => this.createPropertiesFromRow(row, manuDrugFields));

    const aggregate: UIAggregate = {
      entityUid: entityKey,
      aggregateType: 'GenericManuDrugs',
      displayName: 'Manufactured Drugs',
      ordinal: 4,
      rows: rows
    };

    this.log('GET_BY_ENTITY_KEY_SUCCESS', 'GENERIC_MANU_DRUGS_AGGREGATES', { 
      entityKey, 
      recordCount: rows.length 
    });
    return aggregate;
  }
}

export default AggregateRepository; 