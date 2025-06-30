import { BaseRepository } from './base_repository';
import { createServerSupabaseClient } from '../lib/supabase-server';
import { 
  UIAggregate,
  UIProperty,
} from '@/model_defs';
import { ENTITY_AGGREGATES } from '@/model_instances/TheUIModel';
import { getAggregateMapping } from '@/model_instances/TheModelMap';

/**
 * Repository for aggregate operations
 * Handles entity aggregates using the ModelMap system for mapping between UI and database
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
  private getFieldsFromSchema(aggregateType: string): Array<{name: string, ordinal: number, isEditable: boolean, isVisible: boolean, isKey: boolean, isId: boolean, isRequired: boolean, controlType: string}> {
    // Map aggregate types to their UI model keys
    const uiModelKey = this.getUIModelKey(aggregateType);
    
    const aggregateDef = ENTITY_AGGREGATES[uiModelKey];
    if (!aggregateDef || !aggregateDef.propertyDefs) {
      throw new Error(`Aggregate definition not found: ${uiModelKey}`);
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

  /**
   * Get the UI model key for an aggregate type
   */
  private getUIModelKey(aggregateType: string): string {
    // Return the aggregate type as-is since ENTITY_AGGREGATES uses PascalCase keys
    return aggregateType;
  }

  /**
   * Get the sort configuration for a specific aggregate type
   */
  private getSortConfig(aggregateType: string): { field: string; ascending?: boolean } {
    switch (aggregateType) {
      case 'GenericRoute':
        return { field: 'route_type' };
      case 'GenericApproval':
        return { field: 'approval_date', ascending: false };
      case 'GenericAlias':
        return { field: 'alias' };
      case 'GenericManuDrugs':
        return { field: 'drug_name' };
      default:
        return { field: 'uid' }; // Default sort by uid if no specific sort defined
    }
  }
  
  // ============================================================================
  // AGGREGATE RETRIEVAL
  // ============================================================================
  
  /**
   * Retrieves aggregate data for a given entity key and aggregate type using ModelMap
   * @param entityKey - The key of the parent entity (e.g., generic_key like "ASPIRIN_001")
   * @param aggregateType - The type of aggregate to retrieve (e.g., 'GenericRoute', 'GenericApproval')
   * @returns Promise<UIAggregate>
   */
  async getAggregateByEntityKey(entityKey: string, aggregateType: string): Promise<UIAggregate> {
    this.log('GET_AGGREGATE', aggregateType, { entityKey });
    
    // Get the mapping configuration for this aggregate type
    const aggregateMapping = getAggregateMapping(aggregateType);
    if (!aggregateMapping) {
      throw new Error(`Aggregate mapping not found for type: ${aggregateType}`);
    }

    const supabase = await createServerSupabaseClient();
    
    // First, get the generic_uid from the generic_key
    const { data: entityData, error: entityError } = await supabase
      .from('generic_drugs')
      .select('uid')
      .eq('generic_key', entityKey)
      .single();

    if (entityError || !entityData) {
      this.log('GET_AGGREGATE_ENTITY_NOT_FOUND', aggregateType, { entityKey, error: entityError?.message });
      throw new Error(`Parent entity not found for key: ${entityKey}`);
    }

    const genericUid = entityData.uid;
    
    // Get sort configuration for this aggregate type
    const sortConfig = this.getSortConfig(aggregateType);
    
    // Build the query using the mapping configuration and the correct parent key
    const query = supabase
      .from(aggregateMapping.tableName)
      .select('*')
      .eq(aggregateMapping.parentKeyField, genericUid); // Use generic_uid from the lookup

    // Apply sorting
    if (sortConfig.ascending === false) {
      query.order(sortConfig.field, { ascending: false });
    } else {
      query.order(sortConfig.field);
    }

    const { data, error } = await query;

    if (error) {
      this.log('GET_AGGREGATE_ERROR', aggregateType, { entityKey, genericUid, error: error.message });
      throw new Error(`Failed to fetch aggregate data: ${error.message}`);
    }

    // Get field definitions from UIModel schema
    const fields = this.getFieldsFromSchema(aggregateType);

    // Convert each database row to a row of properties using the mapping
    const rows: UIProperty[][] = data.map(row => this.createPropertiesFromRow(row, fields));

    // Get the display name and ordinal from the UI model definition
    const uiModelKey = this.getUIModelKey(aggregateType);
    const aggregateDef = ENTITY_AGGREGATES[uiModelKey];
    
    const aggregate: UIAggregate = {
      entityUid: entityKey,
      aggregateType: aggregateType,
      displayName: aggregateDef.displayName,
      isTable: aggregateDef.isTable,
      rows: rows
    };

    this.log('GET_AGGREGATE_SUCCESS', aggregateType, { 
      entityKey, 
      genericUid,
      recordCount: rows.length 
    });
    return aggregate;
  }
}

export default AggregateRepository; 