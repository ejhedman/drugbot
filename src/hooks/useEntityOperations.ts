import { useState } from 'react';
import { UIEntity } from '@/model_defs';
import { 
  CreateChildEntityRequest, 
  UpdateChildEntityRequest, 
  CreateEntityRequest, 
  UpdateEntityRequest 
} from '@/model_defs/DBModel';

interface UseEntityOperationsReturn {
  loading: boolean;
  error: string | null;
  createEntity: (entity: CreateEntityRequest) => Promise<UIEntity>;
  updateEntity: (uid: string, entity: UpdateEntityRequest) => Promise<UIEntity>;
  deleteEntity: (uid: string) => Promise<void>;
  createChild: (child: CreateChildEntityRequest) => Promise<UIEntity>;
  updateChild: (uid: string, child: UpdateChildEntityRequest) => Promise<UIEntity>;
  deleteChild: (uid: string) => Promise<void>;
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

  const createEntity = async (entity: CreateEntityRequest): Promise<UIEntity> => {
    return handleApiCall(async () => {
      const response = await fetch('/api/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entity),
      });
      if (!response.ok) throw new Error('Failed to create entity');
      return response.json();
    });
  };

  const updateEntity = async (uid: string, entity: UpdateEntityRequest): Promise<UIEntity> => {
    return handleApiCall(async () => {
      const response = await fetch(`/api/entities/${encodeURIComponent(uid)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entity),
      });
      if (!response.ok) throw new Error('Failed to update entity');
      return response.json();
    });
  };

  const deleteEntity = async (uid: string): Promise<void> => {
    return handleApiCall(async () => {
      const response = await fetch(`/api/entities/${encodeURIComponent(uid)}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete entity');
    });
  };

  const createChild = async (child: CreateChildEntityRequest): Promise<UIEntity> => {
    return handleApiCall(async () => {
      const response = await fetch('/api/children?format=ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(child),
      });
      if (!response.ok) throw new Error('Failed to create child entity');
      return response.json();
    });
  };

  const updateChild = async (uid: string, child: UpdateChildEntityRequest): Promise<UIEntity> => {
    return handleApiCall(async () => {
      const response = await fetch(`/api/children/${encodeURIComponent(uid)}?format=ui`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(child),
      });
      if (!response.ok) throw new Error('Failed to update child entity');
      return response.json();
    });
  };

  const deleteChild = async (uid: string): Promise<void> => {
    return handleApiCall(async () => {
      const response = await fetch(`/api/children/${encodeURIComponent(uid)}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete child entity');
    });
  };

  const updateCollection = async (type: string, parentKey: string, id: string | number, data: any): Promise<any> => {
    return handleApiCall(async () => {
      const response = await fetch(`/api/${type}/${encodeURIComponent(parentKey)}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Failed to update ${type}`);
      return response.json();
    });
  };

  const deleteFromCollection = async (type: string, parentKey: string, id: string | number): Promise<void> => {
    return handleApiCall(async () => {
      const response = await fetch(`/api/${type}/${encodeURIComponent(parentKey)}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Failed to delete from ${type}`);
    });
  };

  const createInCollection = async (type: string, parentKey: string, data: any): Promise<any> => {
    return handleApiCall(async () => {
      const response = await fetch(`/api/${type}/${encodeURIComponent(parentKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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