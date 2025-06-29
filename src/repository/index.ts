/**
 * Repository Layer Index
 * 
 * This file exports all repository classes and provides unified access
 * to the data layer for the application.
 */

// ============================================================================
// BASE REPOSITORY
// ============================================================================
export { BaseRepository } from './base_repository';

export { drugBotDBSchema  } from './thedb';

// ============================================================================
// ENTITY REPOSITORIES
// ============================================================================
export { EntityRepository } from './entity_repository';
export { ChildEntityRepository } from './child_entity_repository';
export { AggregateRepository } from './aggregate_repository';

// ============================================================================
// REPOSITORY INSTANCES
// ============================================================================

// Import classes for instantiation
import { EntityRepository } from './entity_repository';
import { ChildEntityRepository } from './child_entity_repository';
import { AggregateRepository } from './aggregate_repository';

// Create individual repository instances
const entityRepository = new EntityRepository();
const childEntityRepository = new ChildEntityRepository();
const aggregateRepository = new AggregateRepository();

// Export individual instances for direct use
export { 
  entityRepository,
  childEntityRepository,
  aggregateRepository
};

// ============================================================================
// UNIFIED REPOSITORY INTERFACE
// ============================================================================

/**
 * Unified repository interface that combines all repository functionality
 * This provides a single access point for all data operations
 */
export class UnifiedRepository {
  public readonly entities: EntityRepository;
  public readonly childEntities: ChildEntityRepository;
  public readonly aggregates: AggregateRepository;

  constructor() {
    this.entities = entityRepository;
    this.childEntities = childEntityRepository;
    this.aggregates = aggregateRepository;
  }
}

// Export unified repository instance
export const unifiedRepository = new UnifiedRepository();

// Export as default for convenience
export default unifiedRepository; 

