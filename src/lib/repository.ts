import DatabaseRepository from './database-repository';

// Re-export the DatabaseRepository as DataRepository for backward compatibility
class DataRepository extends DatabaseRepository {}

// Export singleton instance
export const dataRepository = new DataRepository();
export default DataRepository; 