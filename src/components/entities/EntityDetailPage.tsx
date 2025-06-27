'use client';

import { useState, useEffect } from 'react';
import { Entity, ChildEntity } from '@/types';
import { Table, Settings, Database, Pill, Tag } from 'lucide-react';
import { DetailCard, DetailField } from './DetailCard';
import { CollectionTabSet, TabConfig, TabCallbacks } from './CollectionTabSet';
import { useEntityOperations } from '@/hooks/useEntityOperations';
import { EntityDetailSkeleton } from '@/components/ui/skeleton';

interface EntityDetailPageProps {
  entityKey: string | null;
  childKey: string | null;
  onEntityUpdated?: (entity: Entity) => void;
  onChildUpdated?: (child: ChildEntity) => void;
  onEntityDeleted?: (entityKey: string) => void;
  onChildDeleted?: (childKey: string) => void;
}

export function EntityDetailPage({
  entityKey,
  childKey,
  onEntityUpdated,
  onChildUpdated,
  onEntityDeleted,
  onChildDeleted,
}: EntityDetailPageProps) {
  const [entity, setEntity] = useState<Entity | null>(null);
  const [child, setChild] = useState<ChildEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  
  // Collection data
  const [entityColl1List, setEntityColl1List] = useState<any[]>([]);
  const [childColl1List, setChildColl1List] = useState<any[]>([]);
  const [childColl2List, setChildColl2List] = useState<any[]>([]);

  const operations = useEntityOperations();

  useEffect(() => {
    if (childKey) {
      fetchChild();
      fetchChildCollections(childKey);
    } else if (entityKey) {
      fetchEntity();
      fetchEntityCollections(entityKey);
      setChildColl1List([]);
      setChildColl2List([]);
    } else {
      setEntity(null);
      setChild(null);
      setEntityColl1List([]);
      setChildColl1List([]);
      setChildColl2List([]);
    }
  }, [entityKey, childKey]);

  const fetchEntity = async () => {
    if (!entityKey) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/entities/${encodeURIComponent(entityKey)}`);
      if (response.ok) {
        const data = await response.json();
        setEntity(data);
        setChild(null);
      }
    } catch (error) {
      console.error('Error fetching entity:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChild = async () => {
    if (!childKey) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/children/${encodeURIComponent(childKey)}`);
      if (response.ok) {
        const data = await response.json();
        setChild(data);
        // Also fetch the parent entity
        if (data.entity_key) {
          const entityResponse = await fetch(`/api/entities/${encodeURIComponent(data.entity_key)}`);
          if (entityResponse.ok) {
            const entityData = await entityResponse.json();
            setEntity(entityData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching child:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildCollections = async (childKey: string) => {
    try {
      setCollectionsLoading(true);
      const [all1Res, all2Res] = await Promise.all([
        fetch('/api/child-entity-coll1'),
        fetch('/api/child-entity-coll2')
      ]);

      if (all1Res.ok) {
        const all1 = await all1Res.json();
        setChildColl1List(all1.filter((item: any) => item.child_entity_key === childKey));
      } else {
        setChildColl1List([]);
      }

      if (all2Res.ok) {
        const all2 = await all2Res.json();
        setChildColl2List(all2.filter((item: any) => item.child_entity_key === childKey));
      } else {
        setChildColl2List([]);
      }
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      setChildColl1List([]);
      setChildColl2List([]);
    } finally {
      setCollectionsLoading(false);
    }
  };

  const fetchEntityCollections = async (entityKey: string) => {
    try {
      setCollectionsLoading(true);
      const allRes = await fetch('/api/entity-coll1');

      if (allRes.ok) {
        const all = await allRes.json();
        setEntityColl1List(all.filter((item: any) => item.entity_key === entityKey));
      } else {
        setEntityColl1List([]);
      }
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      setEntityColl1List([]);
    } finally {
      setCollectionsLoading(false);
    }
  };

  // Create callback maps for tabs
  const createTabCallbacks = (collectionType: string, parentKey: string): TabCallbacks => ({
    onUpdate: async (index: number, data: any) => {
      await operations.updateCollection(collectionType, parentKey, index, data);
      // Refresh collections after update
      if (child) {
        await fetchChildCollections(child.child_entity_key);
      } else if (entity) {
        await fetchEntityCollections(entity.entity_key);
      }
    },
    onDelete: async (id: string | number) => {
      await operations.deleteFromCollection(collectionType, parentKey, id);
      // Refresh collections after delete
      if (child) {
        await fetchChildCollections(child.child_entity_key);
      } else if (entity) {
        await fetchEntityCollections(entity.entity_key);
      }
    },
    onCreate: async (data: any) => {
      await operations.createInCollection(collectionType, parentKey, data);
      // Refresh collections after create
      if (child) {
        await fetchChildCollections(child.child_entity_key);
      } else if (entity) {
        await fetchEntityCollections(entity.entity_key);
      }
    },
  });

  // Handle entity operations
  const handleEntityUpdate = async (updatedData: Record<string, any>) => {
    if (!entity) return;
    // Filter data to only include fields that can be updated
    const updateData = {
      entity_name: updatedData.entity_name,
      entity_property1: updatedData.entity_property1,
    };
    const updatedEntity = await operations.updateEntity(entity.entity_key, updateData);
    setEntity(updatedEntity);
    onEntityUpdated?.(updatedEntity);
  };

  const handleEntityDelete = async () => {
    if (!entity) return;
    await operations.deleteEntity(entity.entity_key);
    onEntityDeleted?.(entity.entity_key);
  };

  const handleChildUpdate = async (updatedData: Record<string, any>) => {
    if (!child) return;
    // Filter data to only include fields that can be updated
    const updateData = {
      child_entity_name: updatedData.child_entity_name,
      child_entity_property1: updatedData.child_entity_property1,
    };
    const updatedChild = await operations.updateChild(child.child_entity_key, updateData);
    setChild(updatedChild);
    onChildUpdated?.(updatedChild);
  };

  const handleChildDelete = async () => {
    if (!child) return;
    await operations.deleteChild(child.child_entity_key);
    onChildDeleted?.(child.child_entity_key);
  };

  if (loading) {
    return <EntityDetailSkeleton />;
  }

  if (!entity && !child) {
    return (
      <div className="h-full flex flex-col bg-white rounded-xl shadow-accent-md m-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center label">
            Select an entity or child to view details
          </div>
        </div>
      </div>
    );
  }

  // Prepare detail fields based on whether we're showing child or entity
  const detailFields: DetailField[] = child
    ? [
        { key: 'child_entity_key', label: 'Child Entity Key', value: child.child_entity_key, type: 'readonly' },
        { key: 'child_entity_name', label: 'Child Entity Name', value: child.child_entity_name },
        { key: 'child_entity_property1', label: 'Child Entity Property 1', value: child.child_entity_property1 },
        { key: 'entity_key', label: 'Parent Entity Key', value: child.entity_key, type: 'readonly' },
      ]
    : entity
    ? [
        { key: 'entity_key', label: 'Entity Key', value: entity.entity_key, type: 'readonly' },
        { key: 'entity_name', label: 'Entity Name', value: entity.entity_name },
        { key: 'entity_property1', label: 'Entity Property 1', value: entity.entity_property1 },
      ]
    : [];

  // Prepare tab configurations
  const tabConfigs: TabConfig[] = child
    ? [
        {
          key: 'coll1',
          label: 'Collection One',
          icon: <Table className="w-4 h-4" />,
          data: childColl1List,
          emptyMessage: 'No data in Collection One for this child entity.',
          type: 'auto',
        },
        {
          key: 'coll2',
          label: 'Collection Two',
          icon: <Settings className="w-4 h-4" />,
          data: childColl2List,
          emptyMessage: 'No data in Collection Two for this child entity.',
          type: 'auto',
        },
      ]
    : entity
    ? [
        {
          key: 'coll1',
          label: 'Entity Collection',
          icon: <Database className="w-4 h-4" />,
          data: entityColl1List,
          emptyMessage: 'No data in Entity Collection for this entity.',
          type: 'auto',
        },
      ]
    : [];

  // Create callback map for tabs
  const tabCallbacks: Record<string, TabCallbacks> = {};
  if (child) {
    tabCallbacks['coll1'] = createTabCallbacks('child-entity-coll1', child.child_entity_key);
    tabCallbacks['coll2'] = createTabCallbacks('child-entity-coll2', child.child_entity_key);
  } else if (entity) {
    tabCallbacks['coll1'] = createTabCallbacks('entity-coll1', entity.entity_key);
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-accent-md m-4">
      <div className="flex-1 min-h-0 flex flex-col">
        <DetailCard
          title={child ? child.child_entity_name : entity?.entity_name || ''}
          subtitle={child ? 'Child Entity Detail' : 'Entity Detail'}
          icon={child ? <Tag className="w-4 h-4 text-emerald-500" /> : <Pill className="w-4 h-4 text-indigo-600" />}
          fields={detailFields}
          onUpdate={child ? handleChildUpdate : handleEntityUpdate}
          onDelete={child ? handleChildDelete : handleEntityDelete}
        />

        {tabConfigs.length > 0 && (
          <div className="flex-1 min-h-0">
            <CollectionTabSet
              tabs={tabConfigs}
              loading={collectionsLoading}
              callbacks={tabCallbacks}
            />
          </div>
        )}
      </div>
    </div>
  );
} 