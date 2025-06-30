import { createServiceClient } from '../src/lib/supabase-server';

async function cleanupOrphanedRelationships() {
  console.log('Starting cleanup of orphaned relationships...');
  
  const supabase = createServiceClient();
  
  try {
    // First, get all existing UIDs from generic_drugs and manu_drugs
    console.log('Fetching existing entity UIDs...');
    
    const { data: genericUids, error: genericError } = await supabase
      .from('generic_drugs')
      .select('uid');
    
    if (genericError) {
      console.error('Error fetching generic UIDs:', genericError);
      return;
    }
    
    const { data: manuUids, error: manuError } = await supabase
      .from('manu_drugs')
      .select('uid');
    
    if (manuError) {
      console.error('Error fetching manu UIDs:', manuError);
      return;
    }
    
    const genericUidSet = new Set(genericUids.map(row => row.uid));
    const manuUidSet = new Set(manuUids.map(row => row.uid));
    
    console.log(`Found ${genericUidSet.size} generic drugs and ${manuUidSet.size} manufactured drugs`);
    
    // Get all relationships
    const { data: relationships, error: relError } = await supabase
      .from('entity_relationships')
      .select('uid, ancestor_uid, child_uid');
    
    if (relError) {
      console.error('Error fetching relationships:', relError);
      return;
    }
    
    console.log(`Found ${relationships?.length || 0} total relationships`);
    
    // Find orphaned relationships
    const orphanedAncestors = relationships?.filter(rel => !genericUidSet.has(rel.ancestor_uid)) || [];
    const orphanedChildren = relationships?.filter(rel => !manuUidSet.has(rel.child_uid)) || [];
    
    console.log(`Found ${orphanedAncestors.length} orphaned ancestor relationships`);
    console.log(`Found ${orphanedChildren.length} orphaned child relationships`);
    
    // Delete orphaned ancestor relationships
    if (orphanedAncestors.length > 0) {
      console.log('Deleting orphaned ancestor relationships...');
      const ancestorUids = orphanedAncestors.map(rel => rel.uid);
      
      const { error: deleteAncestorError } = await supabase
        .from('entity_relationships')
        .delete()
        .in('uid', ancestorUids);
      
      if (deleteAncestorError) {
        console.error('Error deleting orphaned ancestor relationships:', deleteAncestorError);
      } else {
        console.log('Successfully deleted orphaned ancestor relationships');
      }
    }
    
    // Delete orphaned child relationships
    if (orphanedChildren.length > 0) {
      console.log('Deleting orphaned child relationships...');
      const childUids = orphanedChildren.map(rel => rel.uid);
      
      const { error: deleteChildError } = await supabase
        .from('entity_relationships')
        .delete()
        .in('uid', childUids);
      
      if (deleteChildError) {
        console.error('Error deleting orphaned child relationships:', deleteChildError);
      } else {
        console.log('Successfully deleted orphaned child relationships');
      }
    }
    
    // Show final count
    const { data: finalCount, error: countError } = await supabase
      .from('entity_relationships')
      .select('uid');
    
    if (countError) {
      console.error('Error getting final count:', countError);
    } else {
      console.log(`Final relationship count: ${finalCount?.length || 0}`);
    }
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// Run the cleanup
cleanupOrphanedRelationships().then(() => {
  console.log('Cleanup completed');
  process.exit(0);
}).catch((error) => {
  console.error('Cleanup failed:', error);
  process.exit(1);
}); 