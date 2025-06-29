/**
 * Example: Using Aggregate Mapping for Complete Entity Queries
 * 
 * This example demonstrates how to use the new aggregate mapping functionality
 * to build API queries that retrieve all data needed to render an entity in the UI.
 */

import { 
  getEntityCompleteQueryInfo,
  getEntityAggregateMappings,
  getEntityAllTableNames,
  entityHasAggregates,
  entityHasAggregate
} from './src/model_instances/TheModelMap';

// Example 1: Get complete query information for a generic drug
console.log('=== Complete Query Info for Generic Drug ===');
const genericDrugQueryInfo = getEntityCompleteQueryInfo('generic_drugs');
if (genericDrugQueryInfo) {
  console.log('Entity Table:', genericDrugQueryInfo.entityTable);
  console.log('Key Field:', genericDrugQueryInfo.entityKeyField);
  console.log('Display Field:', genericDrugQueryInfo.entityDisplayField);
  console.log('All Tables:', genericDrugQueryInfo.allTables);
  console.log('Aggregates:');
  genericDrugQueryInfo.aggregates.forEach(agg => {
    console.log(`  - ${agg.aggregateType}: ${agg.tableName} (linked by ${agg.parentKeyField})`);
  });
}

// Example 2: Check if entities have aggregates
console.log('\n=== Entity Aggregate Checks ===');
console.log('Generic drugs has aggregates:', entityHasAggregates('generic_drugs'));
console.log('Manufactured drugs has aggregates:', entityHasAggregates('manu_drugs'));
console.log('Generic drugs has aliases:', entityHasAggregate('generic_drugs', 'GenericAlias'));
console.log('Generic drugs has routes:', entityHasAggregate('generic_drugs', 'GenericRoute'));

// Example 3: Get all tables needed for API query
console.log('\n=== Tables for API Queries ===');
const genericDrugTables = getEntityAllTableNames('generic_drugs');
console.log('Tables to query for generic drug:', genericDrugTables);

const manuDrugTables = getEntityAllTableNames('manu_drugs');
console.log('Tables to query for manufactured drug:', manuDrugTables);

// Example 4: Get detailed aggregate mappings
console.log('\n=== Detailed Aggregate Mappings ===');
const aggregateMappings = getEntityAggregateMappings('generic_drugs');
aggregateMappings.forEach(mapping => {
  console.log(`Aggregate: ${mapping.aggregateType}`);
  console.log(`  Table: ${mapping.tableName}`);
  console.log(`  Parent Key: ${mapping.parentKeyField}`);
  console.log(`  Properties: ${mapping.propertyMappings.map(p => p.propertyName).join(', ')}`);
});

/**
 * Practical Usage Example: Building a Complete Entity Query
 * 
 * This shows how an API endpoint could use the mapping information
 * to build queries that fetch all data needed to render an entity.
 */
function buildEntityQuery(entityType: string, entityKey: string): string {
  const queryInfo = getEntityCompleteQueryInfo(entityType);
  if (!queryInfo) {
    throw new Error(`No mapping found for entity type: ${entityType}`);
  }

  // Build main entity query
  let query = `-- Complete query for ${entityType} entity\n`;
  query += `SELECT * FROM ${queryInfo.entityTable} WHERE ${queryInfo.entityKeyField} = '${entityKey}';\n`;

  // Build aggregate queries
  queryInfo.aggregates.forEach(agg => {
    query += `\n-- Get ${agg.aggregateType} data\n`;
    query += `SELECT * FROM ${agg.tableName} WHERE ${agg.parentKeyField} = (\n`;
    query += `  SELECT uid FROM ${queryInfo.entityTable} WHERE ${queryInfo.entityKeyField} = '${entityKey}'\n`;
    query += `);\n`;
  });

  return query;
}

// Example usage of query builder
console.log('\n=== Generated SQL Query ===');
const sampleQuery = buildEntityQuery('generic_drugs', 'aspirin');
console.log(sampleQuery);

/**
 * API Route Example: How this would be used in a Next.js API route
 * 
 * ```typescript
 * // pages/api/entities/[entityType]/[key].ts
 * export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 *   const { entityType, key } = req.query;
 *   
 *   // Get complete query information
 *   const queryInfo = getEntityCompleteQueryInfo(entityType as string);
 *   if (!queryInfo) {
 *     return res.status(404).json({ error: 'Entity type not found' });
 *   }
 *   
 *   // Query main entity
 *   const entity = await supabase
 *     .from(queryInfo.entityTable)
 *     .select('*')
 *     .eq(queryInfo.entityKeyField, key)
 *     .single();
 *   
 *   // Query all aggregates
 *   const aggregateData = await Promise.all(
 *     queryInfo.aggregates.map(agg => 
 *       supabase
 *         .from(agg.tableName)
 *         .select('*')
 *         .eq(agg.parentKeyField, entity.data.uid)
 *     )
 *   );
 *   
 *   // Combine into complete entity response
 *   const completeEntity = {
 *     ...entity.data,
 *     aggregates: queryInfo.aggregates.reduce((acc, agg, index) => {
 *       acc[agg.aggregateType] = aggregateData[index].data;
 *       return acc;
 *     }, {})
 *   };
 *   
 *   res.json(completeEntity);
 * }
 * ```
 */ 