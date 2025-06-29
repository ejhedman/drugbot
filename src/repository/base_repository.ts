import { createServerSupabaseClient } from '../lib/supabase-server';

/**
 * Base repository class containing common utilities used by all repositories
 */
export class BaseRepository {
  
  // ============================================================================
  // LOGGING UTILITY
  // ============================================================================
  
  protected log(operation: string, entityType: string, details: any = {}) {
    const timestamp = new Date().toISOString();
    
    console.log('=== DATABASE REPOSITORY OPERATION ===');
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Operation: ${operation}`);
    console.log(`Entity Type: ${entityType}`);
    console.log(`Details:`, JSON.stringify(details, null, 2));
    console.log('=====================================');
  }

  // ============================================================================
  // KEY GENERATION
  // ============================================================================
  
  protected generateKey(prefix: string): string {
    const key = `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.log('GENERATE_KEY', prefix, { generatedKey: key });
    return key;
  }

  // ============================================================================
  // SUPABASE CLIENT
  // ============================================================================
  
  protected async getSupabaseClient() {
    return await createServerSupabaseClient();
  }
} 