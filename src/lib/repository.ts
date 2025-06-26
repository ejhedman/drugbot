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

  private readJsonFile<T>(filename: string): T[] {
    try {
      const filePath = path.join(this.dataPath, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent) as T[];
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return [];
    }
  }

  private writeJsonFile<T>(filename: string, data: T[]): void {
    try {
      const filePath = path.join(this.dataPath, filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      throw new Error(`Failed to write ${filename}`);
    }
  }

  private generateKey(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============================================================================
  // ENTITY OPERATIONS
  // ============================================================================

  async getAllEntities(): Promise<Entity[]> {
    return this.readJsonFile<Entity>('entities.json');
  }

  async getEntityByKey(entityKey: string): Promise<Entity | null> {
    const entities = await this.getAllEntities();
    return entities.find(entity => entity.entity_key === entityKey) || null;
  }

  async searchEntities(searchTerm: string): Promise<Entity[]> {
    const entities = await this.getAllEntities();
    if (!searchTerm) return entities;
    
    return entities.filter(entity => 
      entity.entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.entity_property1.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  async createEntity(data: CreateEntityRequest): Promise<Entity> {
    const entities = await this.getAllEntities();
    const newEntity: Entity = {
      entity_key: this.generateKey('entity'),
      entity_name: data.entity_name,
      entity_property1: data.entity_property1
    };
    
    entities.push(newEntity);
    this.writeJsonFile('entities.json', entities);
    return newEntity;
  }

  async updateEntity(entityKey: string, data: UpdateEntityRequest): Promise<Entity | null> {
    const entities = await this.getAllEntities();
    const index = entities.findIndex(entity => entity.entity_key === entityKey);
    
    if (index === -1) return null;
    
    entities[index] = {
      ...entities[index],
      ...data
    };
    
    this.writeJsonFile('entities.json', entities);
    return entities[index];
  }

  async deleteEntity(entityKey: string): Promise<boolean> {
    const entities = await this.getAllEntities();
    const filteredEntities = entities.filter(entity => entity.entity_key !== entityKey);
    
    if (filteredEntities.length === entities.length) return false;
    
    this.writeJsonFile('entities.json', filteredEntities);
    return true;
  }

  // ============================================================================
  // CHILD ENTITY OPERATIONS
  // ============================================================================

  async getAllChildren(): Promise<ChildEntity[]> {
    return this.readJsonFile<ChildEntity>('children.json');
  }

  async getChildrenByEntityKey(entityKey: string): Promise<ChildEntity[]> {
    const children = await this.getAllChildren();
    return children.filter(child => child.entity_key === entityKey);
  }

  async getChildByKey(childKey: string): Promise<ChildEntity | null> {
    const children = await this.getAllChildren();
    return children.find(child => child.child_entity_key === childKey) || null;
  }

  async searchChildren(searchTerm: string): Promise<ChildEntity[]> {
    const children = await this.getAllChildren();
    if (!searchTerm) return children;
    
    return children.filter(child => 
      child.child_entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.child_entity_property1.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  async createChildEntity(data: CreateChildEntityRequest): Promise<ChildEntity> {
    const children = await this.getAllChildren();
    const newChild: ChildEntity = {
      child_entity_key: this.generateKey('child'),
      entity_key: data.entity_key,
      child_entity_name: data.child_entity_name,
      child_entity_property1: data.child_entity_property1
    };
    
    children.push(newChild);
    this.writeJsonFile('children.json', children);
    return newChild;
  }

  async updateChildEntity(childKey: string, data: UpdateChildEntityRequest): Promise<ChildEntity | null> {
    const children = await this.getAllChildren();
    const index = children.findIndex(child => child.child_entity_key === childKey);
    
    if (index === -1) return null;
    
    children[index] = {
      ...children[index],
      ...data
    };
    
    this.writeJsonFile('children.json', children);
    return children[index];
  }

  async deleteChildEntity(childKey: string): Promise<boolean> {
    const children = await this.getAllChildren();
    const filteredChildren = children.filter(child => child.child_entity_key !== childKey);
    
    if (filteredChildren.length === children.length) return false;
    
    this.writeJsonFile('children.json', filteredChildren);
    return true;
  }

  // ============================================================================
  // ENTITY COLL1 OPERATIONS
  // ============================================================================

  async getAllEntityColl1(): Promise<EntityColl1[]> {
    return this.readJsonFile<EntityColl1>('entity_coll1.json');
  }

  async getEntityColl1ByEntityKey(entityKey: string): Promise<EntityColl1[]> {
    const coll = await this.getAllEntityColl1();
    return coll.filter(item => item.entity_key === entityKey);
  }

  async createEntityColl1(data: CreateEntityColl1Request): Promise<EntityColl1> {
    const coll = await this.getAllEntityColl1();
    const newItem: EntityColl1 = {
      entity_key: data.entity_key,
      coll1_property1: data.coll1_property1,
      coll1_property2: data.coll1_property2,
      coll1_property3: data.coll1_property3
    };
    
    coll.push(newItem);
    this.writeJsonFile('entity_coll1.json', coll);
    return newItem;
  }

  async updateEntityColl1(entityKey: string, index: number, data: UpdateEntityColl1Request): Promise<EntityColl1 | null> {
    const coll = await this.getAllEntityColl1();
    const items = coll.filter(item => item.entity_key === entityKey);
    
    if (index < 0 || index >= items.length) return null;
    
    const globalIndex = coll.findIndex(item => item === items[index]);
    if (globalIndex === -1) return null;
    
    coll[globalIndex] = {
      ...coll[globalIndex],
      ...data
    };
    
    this.writeJsonFile('entity_coll1.json', coll);
    return coll[globalIndex];
  }

  async deleteEntityColl1(entityKey: string, index: number): Promise<boolean> {
    const coll = await this.getAllEntityColl1();
    const items = coll.filter(item => item.entity_key === entityKey);
    
    if (index < 0 || index >= items.length) return false;
    
    const itemToDelete = items[index];
    const filteredColl = coll.filter(item => item !== itemToDelete);
    
    this.writeJsonFile('entity_coll1.json', filteredColl);
    return true;
  }

  // ============================================================================
  // CHILD ENTITY COLL1 OPERATIONS
  // ============================================================================

  async getAllChildEntityColl1(): Promise<ChildEntityColl1[]> {
    return this.readJsonFile<ChildEntityColl1>('child_entity_coll1.json');
  }

  async getChildEntityColl1ByChildKey(childKey: string): Promise<ChildEntityColl1[]> {
    const coll = await this.getAllChildEntityColl1();
    return coll.filter(item => item.child_entity_key === childKey);
  }

  async createChildEntityColl1(data: CreateChildEntityColl1Request): Promise<ChildEntityColl1> {
    const coll = await this.getAllChildEntityColl1();
    const newItem: ChildEntityColl1 = {
      child_entity_key: data.child_entity_key,
      coll1_property1: data.coll1_property1,
      coll1_property2: data.coll1_property2
    };
    
    coll.push(newItem);
    this.writeJsonFile('child_entity_coll1.json', coll);
    return newItem;
  }

  async updateChildEntityColl1(childKey: string, index: number, data: UpdateChildEntityColl1Request): Promise<ChildEntityColl1 | null> {
    const coll = await this.getAllChildEntityColl1();
    const items = coll.filter(item => item.child_entity_key === childKey);
    
    if (index < 0 || index >= items.length) return null;
    
    const globalIndex = coll.findIndex(item => item === items[index]);
    if (globalIndex === -1) return null;
    
    coll[globalIndex] = {
      ...coll[globalIndex],
      ...data
    };
    
    this.writeJsonFile('child_entity_coll1.json', coll);
    return coll[globalIndex];
  }

  async deleteChildEntityColl1(childKey: string, index: number): Promise<boolean> {
    const coll = await this.getAllChildEntityColl1();
    const items = coll.filter(item => item.child_entity_key === childKey);
    
    if (index < 0 || index >= items.length) return false;
    
    const itemToDelete = items[index];
    const filteredColl = coll.filter(item => item !== itemToDelete);
    
    this.writeJsonFile('child_entity_coll1.json', filteredColl);
    return true;
  }

  // ============================================================================
  // CHILD ENTITY COLL2 OPERATIONS
  // ============================================================================

  async getAllChildEntityColl2(): Promise<ChildEntityColl2[]> {
    return this.readJsonFile<ChildEntityColl2>('child_entity_coll2.json');
  }

  async getChildEntityColl2ByChildKey(childKey: string): Promise<ChildEntityColl2[]> {
    const coll = await this.getAllChildEntityColl2();
    return coll.filter(item => item.child_entity_key === childKey);
  }

  async createChildEntityColl2(data: CreateChildEntityColl2Request): Promise<ChildEntityColl2> {
    const coll = await this.getAllChildEntityColl2();
    const newItem: ChildEntityColl2 = {
      child_entity_key: data.child_entity_key,
      coll2_property1: data.coll2_property1,
      coll2_property2: data.coll2_property2
    };
    
    coll.push(newItem);
    this.writeJsonFile('child_entity_coll2.json', coll);
    return newItem;
  }

  async updateChildEntityColl2(childKey: string, index: number, data: UpdateChildEntityColl2Request): Promise<ChildEntityColl2 | null> {
    const coll = await this.getAllChildEntityColl2();
    const items = coll.filter(item => item.child_entity_key === childKey);
    
    if (index < 0 || index >= items.length) return null;
    
    const globalIndex = coll.findIndex(item => item === items[index]);
    if (globalIndex === -1) return null;
    
    coll[globalIndex] = {
      ...coll[globalIndex],
      ...data
    };
    
    this.writeJsonFile('child_entity_coll2.json', coll);
    return coll[globalIndex];
  }

  async deleteChildEntityColl2(childKey: string, index: number): Promise<boolean> {
    const coll = await this.getAllChildEntityColl2();
    const items = coll.filter(item => item.child_entity_key === childKey);
    
    if (index < 0 || index >= items.length) return false;
    
    const itemToDelete = items[index];
    const filteredColl = coll.filter(item => item !== itemToDelete);
    
    this.writeJsonFile('child_entity_coll2.json', filteredColl);
    return true;
  }
}

export const dataRepository = new DataRepository(); 