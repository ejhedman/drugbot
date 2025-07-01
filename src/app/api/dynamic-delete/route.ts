import { NextRequest, NextResponse } from 'next/server';
import { theDBModel } from '@/model_instances/TheDBModel';
import { createServiceClient } from '@/lib/supabase-server';

function isSafeName(name: string) {
  return /^[a-zA-Z0-9_]+$/.test(name);
}

export async function DELETE(request: NextRequest) {
  try {
    const { table, uid } = await request.json();

    console.log('=== DYNAMIC DELETE OPERATION ===');
    console.log('Parameters:', { table, uid });

    if (!table || !uid) {
      console.log('Error: Missing required parameters');
      return NextResponse.json({ error: 'Missing required parameters: table, uid' }, { status: 400 });
    }

    // Validate table name
    if (!isSafeName(table)) {
      console.log('Error: Invalid table name format');
      return NextResponse.json({ error: 'Invalid table name format' }, { status: 400 });
    }
    const dbTable = theDBModel.getTable(table);
    if (!dbTable) {
      console.log('Error: Table not found in schema');
      return NextResponse.json({ error: 'Table not found in schema' }, { status: 400 });
    }

    console.log('Validation passed, proceeding with delete...');

    // First, check if the record exists
    const supabase = createServiceClient();
    const { data: existingRecord, error: selectError } = await (supabase as any)
      .from(table)
      .select('*')
      .eq('uid', uid)
      .limit(1);

    console.log('Record check:', { existingRecord, selectError, recordExists: existingRecord && existingRecord.length > 0 });

    if (selectError) {
      console.log('Error checking for existing record:', selectError);
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    if (!existingRecord || existingRecord.length === 0) {
      console.log('No record found to delete');
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Handle cascading deletes for top-level entities
    if (table === 'generic_drugs') {
      console.log('Deleting top-level entity - cleaning up all child records first');
      
      // Delete child records in the correct order to avoid foreign key constraint violations
      const childTables = [
        'generic_aliases',
        'generic_routes', 
        'generic_approvals',
        'manu_drugs'
      ];

      for (const childTable of childTables) {
        console.log(`Deleting from ${childTable}...`);
        const { error: childError } = await (supabase as any)
          .from(childTable)
          .delete()
          .eq('generic_uid', uid);
        
        if (childError) {
          console.log(`Error deleting from ${childTable}:`, childError);
          return NextResponse.json({ error: `Failed to delete child records from ${childTable}: ${childError.message}` }, { status: 500 });
        }
        console.log(`Successfully deleted from ${childTable}`);
      }

      // Delete from entity_relationships (both as ancestor and child)
      console.log('Cleaning up entity relationships...');
      const { error: relError } = await (supabase as any)
        .from('entity_relationships')
        .delete()
        .or(`ancestor_uid.eq.${uid},child_uid.eq.${uid}`);
      
      if (relError) {
        console.log('Error deleting relationships:', relError);
        // Continue anyway as this might not exist
      } else {
        console.log('Successfully deleted relationship records');
      }
    }

    // For manu_drugs (child entities), we need to clean up relationships first
    if (table === 'manu_drugs') {
      console.log('Deleting child entity - cleaning up relationships first');
      
      // Delete from entity_relationships
      const { error: relError } = await (supabase as any)
        .from('entity_relationships')
        .delete()
        .eq('child_uid', uid);
      
      if (relError) {
        console.log('Error deleting relationships:', relError);
        // Continue anyway as this might not exist
      } else {
        console.log('Successfully deleted relationship records');
      }
    }

    // Delete using parameterized query (Supabase client is safe)
    const { error, data } = await (supabase as any)
      .from(table)
      .delete()
      .eq('uid', uid)
      .select();

    console.log('Delete result:', { error, data, rowsAffected: data?.length || 0 });

    if (error) {
      console.log('Delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Delete successful, rows affected:', data?.length || 0);
    return NextResponse.json({ success: true, rowsAffected: data?.length || 0 }, { status: 200 });
  } catch (err: any) {
    console.log('Exception in dynamic delete:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
} 