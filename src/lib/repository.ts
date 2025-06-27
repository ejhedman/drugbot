import fs from 'fs';
import path from 'path';
import {
  Entity,
  ChildEntity,
  EntityColl1,
  ChildEntityColl1,
  ChildEntityColl2,
  CreateEntityRequest,
  UpdateEntityRequest,
  CreateChildEntityRequest,
  UpdateChildEntityRequest,
  CreateEntityColl1Request,
  UpdateEntityColl1Request,
  CreateChildEntityColl1Request,
  UpdateChildEntityColl1Request,
  CreateChildEntityColl2Request,
  UpdateChildEntityColl2Request
} from '@/types';

class DataRepository {
  private dataPath: string;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data');
  }

  // ============================================================================
  // LOGGING UTILITY
  // ============================================================================
  
  private log(operation: string, entityType: string, details: any = {}) {
    const timestamp = new Date().toISOString();
    
    console.log('=== REPOSITORY OPERATION ===');
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Operation: ${operation}`);
    console.log(`Entity Type: ${entityType}`);
    console.log(`Details:`, JSON.stringify(details, null, 2));
    console.log('============================');
  }

  private readJsonFile<T>(filename: string): T[] {
    try {
      const filePath = path.join(this.dataPath, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent) as T[];
      this.log('READ', filename, { recordCount: data.length });
      return data;
    } catch (error) {
      this.log('READ_ERROR', filename, { error: error instanceof Error ? error.message : 'Unknown error' });
      console.error(`Error reading ${filename}:`, error);
      return [];
    }
  }

  private writeJsonFile<T>(filename: string, data: T[]): void {
    try {
      const filePath = path.join(this.dataPath, filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      this.log('WRITE', filename, { recordCount: data.length });
    } catch (error) {
      this.log('WRITE_ERROR', filename, { 
        error: error instanceof Error ? error.message : 'Unknown error',
        recordCount: data.length 
      });
      console.error(`Error writing ${filename}:`, error);
      throw new Error(`Failed to write ${filename}`);
    }
  }

  private generateKey(prefix: string): string {
    const key = `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.log('GENERATE_KEY', prefix, { generatedKey: key });
    return key;
  }

  private getActualChanges(original: any, updated: any): any {
    const changes: any = {};
    for (const key in updated) {
      if (updated.hasOwnProperty(key) && original[key] !== updated[key]) {
        changes[key] = {
          from: original[key],
          to: updated[key]
        };
      }
    }
    return changes;
  }

  // ============================================================================
  // ENTITY OPERATIONS
  // ============================================================================

  async getAllEntities(): Promise<Entity[]> {
    this.log('GET_ALL', 'ENTITIES');
    return this.readJsonFile<Entity>('entities.json');
  }

  async getEntityByKey(entityKey: string): Promise<Entity | null> {
    this.log('GET_BY_KEY', 'ENTITIES', { entityKey });
    const entities = await this.getAllEntities();
    const entity = entities.find(entity => entity.entity_key === entityKey) || null;
    this.log('GET_BY_KEY_RESULT', 'ENTITIES', { 
      entityKey, 
      found: !!entity,
      entityName: entity?.entity_name 
    });
    return entity;
  }

  async searchEntities(searchTerm: string): Promise<Entity[]> {
    this.log('SEARCH', 'ENTITIES', { searchTerm });
    const entities = await this.getAllEntities();
    if (!searchTerm) return entities;
    
    const results = entities.filter(entity => 
      entity.entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.entity_property1.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.log('SEARCH_RESULT', 'ENTITIES', { 
      searchTerm, 
      totalRecords: entities.length, 
      matchedRecords: results.length 
    });
    return results;
  }

  async createEntity(data: CreateEntityRequest): Promise<Entity> {
    this.log('CREATE', 'ENTITIES', { data });
    const entities = await this.getAllEntities();
    const newEntity: Entity = {
      entity_key: this.generateKey('entity'),
      entity_name: data.entity_name,
      entity_property1: data.entity_property1
    };
    
    entities.push(newEntity);
    this.writeJsonFile('entities.json', entities);
    this.log('CREATE_SUCCESS', 'ENTITIES', { 
      newEntity,
      totalRecords: entities.length 
    });
    return newEntity;
  }

  async updateEntity(entityKey: string, data: UpdateEntityRequest): Promise<Entity | null> {
    this.log('UPDATE', 'ENTITIES', { entityKey, data });
    const entities = await this.getAllEntities();
    const index = entities.findIndex(entity => entity.entity_key === entityKey);
    
    if (index === -1) {
      this.log('UPDATE_NOT_FOUND', 'ENTITIES', { entityKey });
      return null;
    }
    
    const originalEntity = { ...entities[index] };
    entities[index] = {
      ...entities[index],
      ...data
    };
    
    this.writeJsonFile('entities.json', entities);
    const actualChanges = this.getActualChanges(originalEntity, entities[index]);
    this.log('UPDATE_SUCCESS', 'ENTITIES', { 
      entityKey,
      originalEntity,
      updatedEntity: entities[index],
      changes: actualChanges
    });
    return entities[index];
  }

  async deleteEntity(entityKey: string): Promise<boolean> {
    this.log('DELETE', 'ENTITIES', { entityKey });
    const entities = await this.getAllEntities();
    const entityToDelete = entities.find(entity => entity.entity_key === entityKey);
    const filteredEntities = entities.filter(entity => entity.entity_key !== entityKey);
    
    if (filteredEntities.length === entities.length) {
      this.log('DELETE_NOT_FOUND', 'ENTITIES', { entityKey });
      return false;
    }
    
    this.writeJsonFile('entities.json', filteredEntities);
    this.log('DELETE_SUCCESS', 'ENTITIES', { 
      entityKey,
      deletedEntity: entityToDelete,
      remainingRecords: filteredEntities.length
    });
    return true;
  }

  // ============================================================================
  // CHILD ENTITY OPERATIONS
  // ============================================================================

  async getAllChildren(): Promise<ChildEntity[]> {
    this.log('GET_ALL', 'CHILD_ENTITIES');
    return this.readJsonFile<ChildEntity>('children.json');
  }

  async getChildrenByEntityKey(entityKey: string): Promise<ChildEntity[]> {
    this.log('GET_CHILDREN_BY_ENTITY', 'CHILD_ENTITIES', { entityKey });
    const children = await this.getAllChildren();
    const results = children.filter(child => child.entity_key === entityKey);
    this.log('GET_CHILDREN_BY_ENTITY_RESULT', 'CHILD_ENTITIES', { 
      entityKey, 
      matchedRecords: results.length 
    });
    return results;
  }

  async getChildByKey(childKey: string): Promise<ChildEntity | null> {
    this.log('GET_BY_KEY', 'CHILD_ENTITIES', { childKey });
    const children = await this.getAllChildren();
    const child = children.find(child => child.child_entity_key === childKey) || null;
    this.log('GET_BY_KEY_RESULT', 'CHILD_ENTITIES', { 
      childKey, 
      found: !!child,
      childName: child?.child_entity_name,
      parentEntityKey: child?.entity_key
    });
    return child;
  }

  async searchChildren(searchTerm: string): Promise<ChildEntity[]> {
    this.log('SEARCH', 'CHILD_ENTITIES', { searchTerm });
    const children = await this.getAllChildren();
    if (!searchTerm) return children;
    
    const results = children.filter(child => 
      child.child_entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.child_entity_property1.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.log('SEARCH_RESULT', 'CHILD_ENTITIES', { 
      searchTerm, 
      totalRecords: children.length, 
      matchedRecords: results.length 
    });
    return results;
  }

  async createChildEntity(data: CreateChildEntityRequest): Promise<ChildEntity> {
    this.log('CREATE', 'CHILD_ENTITIES', { data });
    const children = await this.getAllChildren();
    const newChild: ChildEntity = {
      child_entity_key: this.generateKey('child'),
      entity_key: data.entity_key,
      child_entity_name: data.child_entity_name,
      child_entity_property1: data.child_entity_property1
    };
    
    children.push(newChild);
    this.writeJsonFile('children.json', children);
    this.log('CREATE_SUCCESS', 'CHILD_ENTITIES', { 
      newChild,
      totalRecords: children.length 
    });
    return newChild;
  }

  async updateChildEntity(childKey: string, data: UpdateChildEntityRequest): Promise<ChildEntity | null> {
    this.log('UPDATE', 'CHILD_ENTITIES', { childKey, data });
    const children = await this.getAllChildren();
    const index = children.findIndex(child => child.child_entity_key === childKey);
    
    if (index === -1) {
      this.log('UPDATE_NOT_FOUND', 'CHILD_ENTITIES', { childKey });
      return null;
    }
    
    const originalChild = { ...children[index] };
    children[index] = {
      ...children[index],
      ...data
    };
    
    this.writeJsonFile('children.json', children);
    const actualChanges = this.getActualChanges(originalChild, children[index]);
    this.log('UPDATE_SUCCESS', 'CHILD_ENTITIES', { 
      childKey,
      originalChild,
      updatedChild: children[index],
      changes: actualChanges
    });
    return children[index];
  }

  async deleteChildEntity(childKey: string): Promise<boolean> {
    this.log('DELETE', 'CHILD_ENTITIES', { childKey });
    const children = await this.getAllChildren();
    const childToDelete = children.find(child => child.child_entity_key === childKey);
    const filteredChildren = children.filter(child => child.child_entity_key !== childKey);
    
    if (filteredChildren.length === children.length) {
      this.log('DELETE_NOT_FOUND', 'CHILD_ENTITIES', { childKey });
      return false;
    }
    
    this.writeJsonFile('children.json', filteredChildren);
    this.log('DELETE_SUCCESS', 'CHILD_ENTITIES', { 
      childKey,
      deletedChild: childToDelete,
      remainingRecords: filteredChildren.length
    });
    return true;
  }

  // ============================================================================
  // ENTITY COLL1 OPERATIONS
  // ============================================================================

  async getAllEntityColl1(): Promise<EntityColl1[]> {
    this.log('GET_ALL', 'ENTITY_COLL1');
    return this.readJsonFile<EntityColl1>('entity_coll1.json');
  }

  async getEntityColl1ByEntityKey(entityKey: string): Promise<EntityColl1[]> {
    this.log('GET_BY_ENTITY_KEY', 'ENTITY_COLL1', { entityKey });
    const coll = await this.getAllEntityColl1();
    const results = coll.filter(item => item.entity_key === entityKey);
    this.log('GET_BY_ENTITY_KEY_RESULT', 'ENTITY_COLL1', { 
      entityKey, 
      matchedRecords: results.length 
    });
    return results;
  }

  async createEntityColl1(data: CreateEntityColl1Request): Promise<EntityColl1> {
    this.log('CREATE', 'ENTITY_COLL1', { data });
    const coll = await this.getAllEntityColl1();
    const newItem: EntityColl1 = {
      entity_key: data.entity_key,
      coll1_property1: data.coll1_property1,
      coll1_property2: data.coll1_property2,
      coll1_property3: data.coll1_property3
    };
    
    coll.push(newItem);
    this.writeJsonFile('entity_coll1.json', coll);
    this.log('CREATE_SUCCESS', 'ENTITY_COLL1', { 
      newItem,
      totalRecords: coll.length 
    });
    return newItem;
  }

  async updateEntityColl1(entityKey: string, index: number, data: UpdateEntityColl1Request): Promise<EntityColl1 | null> {
    this.log('UPDATE', 'ENTITY_COLL1', { entityKey, index, data });
    const coll = await this.getAllEntityColl1();
    const items = coll.filter(item => item.entity_key === entityKey);
    
    if (index < 0 || index >= items.length) {
      this.log('UPDATE_INDEX_OUT_OF_RANGE', 'ENTITY_COLL1', { 
        entityKey, 
        index, 
        availableItems: items.length 
      });
      return null;
    }
    
    const globalIndex = coll.findIndex(item => item === items[index]);
    if (globalIndex === -1) {
      this.log('UPDATE_ITEM_NOT_FOUND', 'ENTITY_COLL1', { entityKey, index });
      return null;
    }
    
    const originalItem = { ...coll[globalIndex] };
    coll[globalIndex] = {
      ...coll[globalIndex],
      ...data
    };
    
    this.writeJsonFile('entity_coll1.json', coll);
    const actualChanges = this.getActualChanges(originalItem, coll[globalIndex]);
    this.log('UPDATE_SUCCESS', 'ENTITY_COLL1', { 
      entityKey,
      index,
      originalItem,
      updatedItem: coll[globalIndex],
      changes: actualChanges
    });
    return coll[globalIndex];
  }

  async deleteEntityColl1(entityKey: string, index: number): Promise<boolean> {
    this.log('DELETE', 'ENTITY_COLL1', { entityKey, index });
    const coll = await this.getAllEntityColl1();
    const items = coll.filter(item => item.entity_key === entityKey);
    
    if (index < 0 || index >= items.length) {
      this.log('DELETE_INDEX_OUT_OF_RANGE', 'ENTITY_COLL1', { 
        entityKey, 
        index, 
        availableItems: items.length 
      });
      return false;
    }
    
    const itemToDelete = items[index];
    const filteredColl = coll.filter(item => item !== itemToDelete);
    
    this.writeJsonFile('entity_coll1.json', filteredColl);
    this.log('DELETE_SUCCESS', 'ENTITY_COLL1', { 
      entityKey,
      index,
      deletedItem: itemToDelete,
      remainingRecords: filteredColl.length
    });
    return true;
  }

  // ============================================================================
  // CHILD ENTITY COLL1 OPERATIONS
  // ============================================================================

  async getAllChildEntityColl1(): Promise<ChildEntityColl1[]> {
    this.log('GET_ALL', 'CHILD_ENTITY_COLL1');
    return this.readJsonFile<ChildEntityColl1>('child_entity_coll1.json');
  }

  async getChildEntityColl1ByChildKey(childKey: string): Promise<ChildEntityColl1[]> {
    this.log('GET_BY_CHILD_KEY', 'CHILD_ENTITY_COLL1', { childKey });
    const coll = await this.getAllChildEntityColl1();
    const results = coll.filter(item => item.child_entity_key === childKey);
    this.log('GET_BY_CHILD_KEY_RESULT', 'CHILD_ENTITY_COLL1', { 
      childKey, 
      matchedRecords: results.length 
    });
    return results;
  }

  async createChildEntityColl1(data: CreateChildEntityColl1Request): Promise<ChildEntityColl1> {
    this.log('CREATE', 'CHILD_ENTITY_COLL1', { data });
    const coll = await this.getAllChildEntityColl1();
    const newItem: ChildEntityColl1 = {
      child_entity_key: data.child_entity_key,
      coll1_property1: data.coll1_property1,
      coll1_property2: data.coll1_property2
    };
    
    coll.push(newItem);
    this.writeJsonFile('child_entity_coll1.json', coll);
    this.log('CREATE_SUCCESS', 'CHILD_ENTITY_COLL1', { 
      newItem,
      totalRecords: coll.length 
    });
    return newItem;
  }

  async updateChildEntityColl1(childKey: string, index: number, data: UpdateChildEntityColl1Request): Promise<ChildEntityColl1 | null> {
    this.log('UPDATE', 'CHILD_ENTITY_COLL1', { childKey, index, data });
    const coll = await this.getAllChildEntityColl1();
    const items = coll.filter(item => item.child_entity_key === childKey);
    
    if (index < 0 || index >= items.length) {
      this.log('UPDATE_INDEX_OUT_OF_RANGE', 'CHILD_ENTITY_COLL1', { 
        childKey, 
        index, 
        availableItems: items.length 
      });
      return null;
    }
    
    const globalIndex = coll.findIndex(item => item === items[index]);
    if (globalIndex === -1) {
      this.log('UPDATE_ITEM_NOT_FOUND', 'CHILD_ENTITY_COLL1', { childKey, index });
      return null;
    }
    
    const originalItem = { ...coll[globalIndex] };
    coll[globalIndex] = {
      ...coll[globalIndex],
      ...data
    };
    
    this.writeJsonFile('child_entity_coll1.json', coll);
    const actualChanges = this.getActualChanges(originalItem, coll[globalIndex]);
    this.log('UPDATE_SUCCESS', 'CHILD_ENTITY_COLL1', { 
      childKey,
      index,
      originalItem,
      updatedItem: coll[globalIndex],
      changes: actualChanges
    });
    return coll[globalIndex];
  }

  async deleteChildEntityColl1(childKey: string, index: number): Promise<boolean> {
    this.log('DELETE', 'CHILD_ENTITY_COLL1', { childKey, index });
    const coll = await this.getAllChildEntityColl1();
    const items = coll.filter(item => item.child_entity_key === childKey);
    
    if (index < 0 || index >= items.length) {
      this.log('DELETE_INDEX_OUT_OF_RANGE', 'CHILD_ENTITY_COLL1', { 
        childKey, 
        index, 
        availableItems: items.length 
      });
      return false;
    }
    
    const itemToDelete = items[index];
    const filteredColl = coll.filter(item => item !== itemToDelete);
    
    this.writeJsonFile('child_entity_coll1.json', filteredColl);
    this.log('DELETE_SUCCESS', 'CHILD_ENTITY_COLL1', { 
      childKey,
      index,
      deletedItem: itemToDelete,
      remainingRecords: filteredColl.length
    });
    return true;
  }

  // ============================================================================
  // CHILD ENTITY COLL2 OPERATIONS
  // ============================================================================

  async getAllChildEntityColl2(): Promise<ChildEntityColl2[]> {
    this.log('GET_ALL', 'CHILD_ENTITY_COLL2');
    return this.readJsonFile<ChildEntityColl2>('child_entity_coll2.json');
  }

  async getChildEntityColl2ByChildKey(childKey: string): Promise<ChildEntityColl2[]> {
    this.log('GET_BY_CHILD_KEY', 'CHILD_ENTITY_COLL2', { childKey });
    const coll = await this.getAllChildEntityColl2();
    const results = coll.filter(item => item.child_entity_key === childKey);
    this.log('GET_BY_CHILD_KEY_RESULT', 'CHILD_ENTITY_COLL2', { 
      childKey, 
      matchedRecords: results.length 
    });
    return results;
  }

  async createChildEntityColl2(data: CreateChildEntityColl2Request): Promise<ChildEntityColl2> {
    this.log('CREATE', 'CHILD_ENTITY_COLL2', { data });
    const coll = await this.getAllChildEntityColl2();
    const newItem: ChildEntityColl2 = {
      child_entity_key: data.child_entity_key,
      coll2_property1: data.coll2_property1,
      coll2_property2: data.coll2_property2
    };
    
    coll.push(newItem);
    this.writeJsonFile('child_entity_coll2.json', coll);
    this.log('CREATE_SUCCESS', 'CHILD_ENTITY_COLL2', { 
      newItem,
      totalRecords: coll.length 
    });
    return newItem;
  }

  async updateChildEntityColl2(childKey: string, index: number, data: UpdateChildEntityColl2Request): Promise<ChildEntityColl2 | null> {
    this.log('UPDATE', 'CHILD_ENTITY_COLL2', { childKey, index, data });
    const coll = await this.getAllChildEntityColl2();
    const items = coll.filter(item => item.child_entity_key === childKey);
    
    if (index < 0 || index >= items.length) {
      this.log('UPDATE_INDEX_OUT_OF_RANGE', 'CHILD_ENTITY_COLL2', { 
        childKey, 
        index, 
        availableItems: items.length 
      });
      return null;
    }
    
    const globalIndex = coll.findIndex(item => item === items[index]);
    if (globalIndex === -1) {
      this.log('UPDATE_ITEM_NOT_FOUND', 'CHILD_ENTITY_COLL2', { childKey, index });
      return null;
    }
    
    const originalItem = { ...coll[globalIndex] };
    coll[globalIndex] = {
      ...coll[globalIndex],
      ...data
    };
    
    this.writeJsonFile('child_entity_coll2.json', coll);
    const actualChanges = this.getActualChanges(originalItem, coll[globalIndex]);
    this.log('UPDATE_SUCCESS', 'CHILD_ENTITY_COLL2', { 
      childKey,
      index,
      originalItem,
      updatedItem: coll[globalIndex],
      changes: actualChanges
    });
    return coll[globalIndex];
  }

  async deleteChildEntityColl2(childKey: string, index: number): Promise<boolean> {
    this.log('DELETE', 'CHILD_ENTITY_COLL2', { childKey, index });
    const coll = await this.getAllChildEntityColl2();
    const items = coll.filter(item => item.child_entity_key === childKey);
    
    if (index < 0 || index >= items.length) {
      this.log('DELETE_INDEX_OUT_OF_RANGE', 'CHILD_ENTITY_COLL2', { 
        childKey, 
        index, 
        availableItems: items.length 
      });
      return false;
    }
    
    const itemToDelete = items[index];
    const filteredColl = coll.filter(item => item !== itemToDelete);
    
    this.writeJsonFile('child_entity_coll2.json', filteredColl);
    this.log('DELETE_SUCCESS', 'CHILD_ENTITY_COLL2', { 
      childKey,
      index,
      deletedItem: itemToDelete,
      remainingRecords: filteredColl.length
    });
    return true;
  }
}

export const dataRepository = new DataRepository(); 