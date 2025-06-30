(function() {
  // Load environment variables from .env.local
  require('dotenv').config({ path: '.env.local' });
  
  const fs = require('fs');
  const path = require('path');
  const { createClient } = require('@supabase/supabase-js');

  // Paths to SQL files
  const GENERIC_DRUGS_PATH = path.join(__dirname, '../ddl/07a_generic_drugs.sql');
  const MANU_DRUGS_PATH = path.join(__dirname, '../ddl/07b_manu_drugs.sql');
  const GENERIC_ALIASES_PATH = path.join(__dirname, '../ddl/07c_generic_aliases.sql');
  const GENERIC_ROUTES_PATH = path.join(__dirname, '../ddl/07d_generic_routes.sql');
  const GENERIC_APPROVALS_PATH = path.join(__dirname, '../ddl/07e_generic_approvals.sql');
  const UPDATE_RELATIONSHIPS_PATH = path.join(__dirname, '../ddl/07f_update_relationships.sql');

  // Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables:');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
    console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
    console.error('\nMake sure these variables are defined in your .env.local file');
    process.exit(1);
  }

  // Create Supabase client with service role
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  function readSqlFile(filePath: string): string {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      throw error;
    }
  }

  function parseInsertStatement(sqlContent: string): any[] {
    // Extract the VALUES part and parse it into an array of objects
    const lines = sqlContent.split('\n');
    const insertLines: string[] = [];
    let inInsert = false;
    let columns: string[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines, comments, and transaction statements
      if (!trimmedLine || trimmedLine.startsWith('--') || 
          trimmedLine === 'BEGIN;' || trimmedLine === 'COMMIT;') {
        continue;
      }
      
      // Extract column names from INSERT statement
      if (trimmedLine.startsWith('INSERT INTO')) {
        inInsert = true;
        const match = trimmedLine.match(/INSERT INTO \w+ \(([^)]+)\)/);
        if (match) {
          columns = match[1].split(',').map(col => col.trim());
        }
        continue;
      }
      
      if (inInsert) {
        // Skip the VALUES keyword
        if (trimmedLine.toUpperCase() === 'VALUES') {
          continue;
        }
        
        // Parse value rows
        if (trimmedLine.startsWith('(') && trimmedLine.endsWith('),')) {
          const valuesStr = trimmedLine.slice(1, -2); // Remove ( and ),
          const values = valuesStr.split(',').map(val => val.trim());
          const row: any = {};
          
          columns.forEach((col, index) => {
            let value = values[index];
            if (value === 'NULL') {
              row[col] = null;
            } else if (value.startsWith("'") && value.endsWith("'")) {
              row[col] = value.slice(1, -1);
            } else if (!isNaN(Number(value))) {
              row[col] = Number(value);
            } else {
              row[col] = value;
            }
          });
          
          insertLines.push(row);
        } else if (trimmedLine.startsWith('(') && trimmedLine.endsWith(');')) {
          // Last row
          const valuesStr = trimmedLine.slice(1, -2); // Remove ( and );
          const values = valuesStr.split(',').map(val => val.trim());
          const row: any = {};
          
          columns.forEach((col, index) => {
            let value = values[index];
            if (value === 'NULL') {
              row[col] = null;
            } else if (value.startsWith("'") && value.endsWith("'")) {
              row[col] = value.slice(1, -1);
            } else if (!isNaN(Number(value))) {
              row[col] = Number(value);
            } else {
              row[col] = value;
            }
          });
          
          insertLines.push(row);
          break;
        }
      }
    }
    
    return insertLines;
  }

  async function clearTable(tableName: string): Promise<void> {
    try {
      console.log(`Clearing table: ${tableName}...`);
      const { error } = await supabase
        .from(tableName)
        .delete()
        .neq('uid', '00000000-0000-0000-0000-000000000000'); // Delete all rows
      
      if (error) {
        console.error(`Error clearing ${tableName}:`, error);
        throw error;
      }
      console.log(`✓ Cleared ${tableName}`);
    } catch (error) {
      console.error(`Failed to clear ${tableName}:`, error);
      throw error;
    }
  }

  async function insertData(tableName: string, data: any[], description: string): Promise<void> {
    try {
      console.log(`Inserting ${data.length} rows into ${description}...`);
      
      // Insert in batches of 1000 to avoid payload size limits
      const batchSize = 1000;
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        const { error } = await supabase
          .from(tableName)
          .insert(batch);
        
        if (error) {
          console.error(`Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error);
          throw error;
        }
      }
      
      console.log(`✓ Completed ${description} (${data.length} rows)`);
    } catch (error) {
      console.error(`Failed to insert ${description}:`, error);
      throw error;
    }
  }

  async function updateRelationships(): Promise<void> {
    try {
      console.log('Updating relationships...');
      
      // Step 1: Get all generic drugs to create a mapping
      const { data: genericDrugs, error: genericError } = await supabase
        .from('generic_drugs')
        .select('uid, generic_key');
      
      if (genericError) {
        console.error('Error fetching generic drugs:', genericError);
        throw genericError;
      }
      
      const genericMap = new Map(genericDrugs.map((gd: any) => [gd.generic_key, gd.uid]));
      
      // Step 2: Update generic_aliases
      console.log('Updating generic_aliases relationships...');
      for (const [genericKey, genericUid] of genericMap) {
        const { error } = await supabase
          .from('generic_aliases')
          .update({ generic_uid: genericUid })
          .eq('generic_key', genericKey);
        
        if (error) {
          console.error(`Error updating generic_aliases for ${genericKey}:`, error);
          throw error;
        }
      }
      
      // Step 3: Update generic_routes
      console.log('Updating generic_routes relationships...');
      for (const [genericKey, genericUid] of genericMap) {
        const { error } = await supabase
          .from('generic_routes')
          .update({ generic_uid: genericUid })
          .eq('generic_key', genericKey);
        
        if (error) {
          console.error(`Error updating generic_routes for ${genericKey}:`, error);
          throw error;
        }
      }
      
      // Step 4: Update generic_approvals
      console.log('Updating generic_approvals relationships...');
      for (const [genericKey, genericUid] of genericMap) {
        const { error } = await supabase
          .from('generic_approvals')
          .update({ generic_uid: genericUid })
          .eq('generic_key', genericKey);
        
        if (error) {
          console.error(`Error updating generic_approvals for ${genericKey}:`, error);
          throw error;
        }
      }
      
      // Step 5: Update manu_drugs
      console.log('Updating manu_drugs relationships...');
      for (const [genericKey, genericUid] of genericMap) {
        const { error } = await supabase
          .from('manu_drugs')
          .update({ generic_uid: genericUid })
          .eq('generic_key', genericKey);
        
        if (error) {
          console.error(`Error updating manu_drugs for ${genericKey}:`, error);
          throw error;
        }
      }
      
      // Step 6: Create entity_relationships
      console.log('Creating entity_relationships...');
      const { data: manuDrugs, error: manuError } = await supabase
        .from('manu_drugs')
        .select('uid, generic_uid')
        .not('generic_uid', 'is', null);
      
      if (manuError) {
        console.error('Error fetching manu_drugs:', manuError);
        throw manuError;
      }
      
      const relationships = manuDrugs.map((md: any) => ({
        ancestor_uid: md.generic_uid,
        child_uid: md.uid,
        relationship_type: 'parent_child'
      }));
      
      if (relationships.length > 0) {
        const { error: relError } = await supabase
          .from('entity_relationships')
          .insert(relationships);
        
        if (relError) {
          console.error('Error creating entity_relationships:', relError);
          throw relError;
        }
      }
      
      // Step 7: Show summary
      const { count: genericCount } = await supabase
        .from('generic_drugs')
        .select('*', { count: 'exact', head: true });
      
      const { count: manuCount } = await supabase
        .from('manu_drugs')
        .select('*', { count: 'exact', head: true });
      
      const { count: aliasCount } = await supabase
        .from('generic_aliases')
        .select('*', { count: 'exact', head: true });
      
      const { count: routeCount } = await supabase
        .from('generic_routes')
        .select('*', { count: 'exact', head: true });
      
      const { count: approvalCount } = await supabase
        .from('generic_approvals')
        .select('*', { count: 'exact', head: true });
      
      const { count: relationshipCount } = await supabase
        .from('entity_relationships')
        .select('*', { count: 'exact', head: true });
      
      console.log('\n📊 Demo Data Summary:');
      console.log(`- Generic Drugs: ${genericCount}`);
      console.log(`- Manufactured Drugs: ${manuCount}`);
      console.log(`- Generic Aliases: ${aliasCount}`);
      console.log(`- Generic Routes: ${routeCount}`);
      console.log(`- Generic Approvals: ${approvalCount}`);
      console.log(`- Entity Relationships: ${relationshipCount}`);
      
      console.log('✓ Completed update_relationships');
    } catch (error) {
      console.error('Failed to update relationships:', error);
      throw error;
    }
  }

  async function refreshDatabase(): Promise<void> {
    try {
      console.log('Starting database refresh...\n');

      // Step 1: Clear all tables in reverse dependency order
      console.log('Clearing tables...');
      await clearTable('entity_relationships');
      await clearTable('generic_approvals');
      await clearTable('generic_routes');
      await clearTable('generic_aliases');
      await clearTable('manu_drugs');
      await clearTable('generic_drugs');
      console.log('');

      // Step 2: Insert data in the correct order
      console.log('Inserting fresh data...');
      
      // Generic drugs
      const genericDrugsSql = readSqlFile(GENERIC_DRUGS_PATH);
      const genericDrugsData = parseInsertStatement(genericDrugsSql);
      await insertData('generic_drugs', genericDrugsData, 'generic_drugs');
      
      // Manufacturer drugs
      const manuDrugsSql = readSqlFile(MANU_DRUGS_PATH);
      const manuDrugsData = parseInsertStatement(manuDrugsSql);
      await insertData('manu_drugs', manuDrugsData, 'manu_drugs');
      
      // Generic aliases
      const genericAliasesSql = readSqlFile(GENERIC_ALIASES_PATH);
      const genericAliasesData = parseInsertStatement(genericAliasesSql);
      await insertData('generic_aliases', genericAliasesData, 'generic_aliases');
      
      // Generic routes
      const genericRoutesSql = readSqlFile(GENERIC_ROUTES_PATH);
      const genericRoutesData = parseInsertStatement(genericRoutesSql);
      await insertData('generic_routes', genericRoutesData, 'generic_routes');
      
      // Generic approvals
      const genericApprovalsSql = readSqlFile(GENERIC_APPROVALS_PATH);
      const genericApprovalsData = parseInsertStatement(genericApprovalsSql);
      await insertData('generic_approvals', genericApprovalsData, 'generic_approvals');

      // Update relationships
      await updateRelationships();

      console.log('\n🎉 Database refresh completed successfully!');
      
    } catch (error) {
      console.error('\n❌ Database refresh failed:', error);
      process.exit(1);
    }
  }

  // Check if required files exist
  function checkFiles(): void {
    const requiredFiles = [
      GENERIC_DRUGS_PATH,
      MANU_DRUGS_PATH,
      GENERIC_ALIASES_PATH,
      GENERIC_ROUTES_PATH,
      GENERIC_APPROVALS_PATH,
      UPDATE_RELATIONSHIPS_PATH
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        console.error(`❌ Required file not found: ${file}`);
        console.error('Please run the data generation scripts first:');
        console.error('  npx ts-node scripts/generate_fake_routes.ts');
        console.error('  npx ts-node scripts/generate_fake_approvals.ts');
        console.error('  npx ts-node scripts/generate_fake_aliases.ts');
        process.exit(1);
      }
    }
  }

  async function main(): Promise<void> {
    console.log('🔄 Database Refresh Script');
    console.log('========================\n');
    
    // Check if required files exist
    checkFiles();
    
    // Refresh the database
    await refreshDatabase();
  }

  main();
})(); 