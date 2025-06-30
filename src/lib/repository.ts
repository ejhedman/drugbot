// import DatabaseRepository from '../repository/database-repository';
import { unifiedRepository, EntityRepository, AggregateRepository } from '../repository';

// Re-export the DatabaseRepository as DataRepository for backward compatibility
// class DataRepository extends DatabaseRepository {}

// Export singleton instance (legacy)
// export const dataRepository = new DataRepository();

// Export new structured repositories
export const entityRepository = unifiedRepository.entities;
export const aggregateRepository = unifiedRepository.aggregates;

// Export unified repository for new code
export { unifiedRepository };

// Export classes for direct instantiation if needed
export { EntityRepository, AggregateRepository };

// // Default export maintains backward compatibility
// export default DataRepository; 