import { useState } from 'react';
import { UIEntity } from '@/model_defs';
import { 
  CreateChildEntityRequest, 
  UpdateChildEntityRequest, 
  CreateEntityRequest, 
  UpdateEntityRequest 
} from '@/model_defs/DBModel';
import { getAggregateTableName } from '@/model_instances/TheModelMap';

interface UseEntityOperationsReturn {
  loading: boolean;
  error: string | null;
  createEntity: (args: { table: string, properties: any }) => Promise<UIEntity>;
  updateEntity: (uid: string, args: { table: string, properties: any }) => Promise<UIEntity>;
  deleteEntity: (uid: string, args: { table: string }) => Promise<void>;
  createChild: (args: { table: string, properties: any }) => Promise<UIEntity>;
  updateChild: (uid: string, args: { table: string, properties: any }) => Promise<UIEntity>;
  deleteChild: (uid: string, args: { table: string }) => Promise<void>;
  updateCollection: (type: string, parentKey: string, id: string | number, data: any) => Promise<any>;
  deleteFromCollection: (type: string, parentKey: string, id: string | number) => Promise<void>;
  createInCollection: (type: string, parentKey: string, data: any) => Promise<any>;
}

export function useEntityOperations(): UseEntityOperationsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async <T>(apiCall: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createEntity = async ({ table, properties }: { table: string, properties: any }): Promise<UIEntity> => {
    return handleApiCall(async () => {
      const response = await fetch('/api/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, properties }),
      });
      if (!response.ok) throw new Error('Failed to create entity');
      return response.json();
    });
  };

  const updateEntity = async (uid: string, { table, properties }: { table: string, properties: any }): Promise<UIEntity> => {
    return handleApiCall(async () => {
      const response = await fetch(`/api/dynamic-update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, uid, properties }),
      });
      if (!response.ok) throw new Error('Failed to update entity');
      return response.json();
    });
  };

  const deleteEntity = async (uid: string, { table }: { table: string }): Promise<void> => {
    return handleApiCall(async () => {
      const response = await fetch(`/api/dynamic-delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, uid }),
      });
      if (!response.ok) throw new Error('Failed to delete entity');
    });
  };

  const createChild = async ({ table, properties }: { table: string, properties: any }): Promise<UIEntity> => createEntity({ table, properties });
  const updateChild = async (uid: string, { table, properties }: { table: string, properties: any }): Promise<UIEntity> => updateEntity(uid, { table, properties });
  const deleteChild = async (uid: string, { table }: { table: string }): Promise<void> => deleteEntity(uid, { table });

  const updateCollection = async (type: string, parentKey: string, id: string | number, data: any): Promise<any> => {
    return handleApiCall(async () => {
      const table = getAggregateTableName(type);
      if (!table) {
        throw new Error(`Unknown aggregate type: ${type}`);
      }
      
      const response = await fetch(`/api/dynamic-update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table,
          uid: id,
          properties: data
        }),
      });
      if (!response.ok) throw new Error(`Failed to update ${type}`);
      return response.json();
    });
  };

  const deleteFromCollection = async (type: string, parentKey: string, id: string | number): Promise<void> => {
    return handleApiCall(async () => {
      const table = getAggregateTableName(type);
      if (!table) {
        throw new Error(`Unknown aggregate type: ${type}`);
      }
      
      const response = await fetch(`/api/dynamic-delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table,
          uid: id.toString()
        }),
      });
      if (!response.ok) throw new Error(`Failed to delete from ${type}`);
    });
  };

  const createInCollection = async (type: string, parentKey: string, data: any): Promise<any> => {
    return handleApiCall(async () => {
      const response = await fetch(`/api/dynamic-create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityUid: parentKey,
          aggregateType: type,
          ...data
        }),
      });
      if (!response.ok) throw new Error(`Failed to create in ${type}`);
      return response.json();
    });
  };

  return {
    loading,
    error,
    createEntity,
    updateEntity,
    deleteEntity,
    createChild,
    updateChild,
    deleteChild,
    updateCollection,
    deleteFromCollection,
    createInCollection,
  };
} 