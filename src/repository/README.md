# Repository Layer

This directory contains the organized repository layer for the DrugBot application. The repository layer provides a clean interface for data operations and abstracts database interactions.

## Structure

### Base Repository (`base_repository.ts`)
- Common utilities used by all repositories
- Logging functionality
- Key generation
- Supabase client access

### Entity Repository (`entity_repository.ts`)
- Handles CRUD operations for main entities (generic_drugs table)
- Methods: getAllEntities, getEntityByKey, searchEntities, createEntity, updateEntity, deleteEntity

### Child Entity Repository (`child_entity_repository.ts`)
- Handles CRUD operations for child entities (manu_drugs table)
- Methods: getChildrenAsUIEntitiesByEntityKey, getAllChildrenAsUIEntities, searchChildrenAsUIEntities, getChildByKey, createChildEntityAsUIEntity, updateChildEntityAsUIEntity, deleteChildEntity

### Legacy Database Repository (`database-repository.ts`)
- Original monolithic repository (maintained for backward compatibility)
- Contains all aggregate operations that haven't been extracted yet
- Will be gradually decomposed into specialized repositories

## Usage

### Using Individual Repositories

```typescript
import { entityRepository, childEntityRepository } from '@/lib/repository';

// Entity operations
const entities = await entityRepository.getAllEntities();
const entity = await entityRepository.getEntityByKey('some-key');

// Child entity operations  
const children = await childEntityRepository.getChildrenAsUIEntitiesByEntityKey('entity-key');
```

### Using Unified Repository

```typescript
import { unifiedRepository } from '@/lib/repository';

// Access through unified interface
const entities = await unifiedRepository.entities.getAllEntities();
const children = await unifiedRepository.childEntities.getAllChildrenAsUIEntities();
```

### Legacy Usage (Backward Compatibility)

```typescript
import { dataRepository } from '@/lib/repository';

// Still works with existing code
const entities = await dataRepository.getAllEntities();
```

## Migration Strategy

1. **Phase 1** ✅ - Split entity and child entity operations
2. **Phase 2** - Extract aggregate operations into separate repository
3. **Phase 3** - Extract generic approval and alias operations  
4. **Phase 4** - Remove legacy database repository

## Benefits

- **Separation of Concerns**: Each repository handles specific domain operations
- **Maintainability**: Smaller, focused files are easier to understand and modify
- **Testability**: Individual repositories can be tested in isolation
- **Backward Compatibility**: Existing code continues to work during migration
- **Type Safety**: Better TypeScript support with focused interfaces 