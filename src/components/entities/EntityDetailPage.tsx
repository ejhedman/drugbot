'use client';

import { useState, useEffect } from 'react';
import { 
  UIEntity, 
  UIProperty, 
  UIAggregate,
  UpdateChildEntityRequest,
  UpdateEntityRequest
} from '@/model_defs';
import { Settings, Database, Pill, Tag } from 'lucide-react';
import { DetailCardProperties } from './DetailCardProperties';
import { CollectionTabSet, TabConfig, TabCallbacks } from './CollectionTabSet';
import { useEntityOperations } from '@/hooks/useEntityOperations';
import { EntityDetailSkeleton } from '@/components/ui/skeleton';

interface EntityDetailPageProps {
  entityKey: string | null;
  childKey: string | null;
  onEntityUpdated?: (entity: UIEntity) => void;
  onChildUpdated?: (child: UIEntity) => void;
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
  const [entity, setEntity] = useState<UIEntity | null>(null);
  const [child, setChild] = useState<UIEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  
  // Collection data for entity (generic_drugs)
  const [aliasesList, setAliasesList] = useState<UIAggregate[]>([]);
  const [routesList, setRoutesList] = useState<UIAggregate[]>([]);
  const [approvalsList, setApprovalsList] = useState<UIAggregate[]>([]);

  const operations = useEntityOperations();

  useEffect(() => {
    if (childKey) {
      fetchChild();
      // Child entities (manu_drugs) have no collections, so no fetching needed
    } else if (entityKey) {
      fetchEntity();
      fetchEntityCollections(entityKey);
    } else {
      setEntity(null);
      setChild(null);
      setAliasesList([]);
      setRoutesList([]);
      setApprovalsList([]);
    }
  }, [entityKey, childKey]);

  const fetchEntity = async () => {
    if (!entityKey) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/entities/${encodeURIComponent(entityKey)}`);
      if (response.ok) {
        const unifiedEntity: UIEntity = await response.json();
        setEntity(unifiedEntity);
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
      const response = await fetch(`/api/children/${encodeURIComponent(childKey)}?format=ui`);
      if (response.ok) {
        const unifiedChild: UIEntity = await response.json();
        setChild(unifiedChild);
        
        // Also fetch the parent entity from the child's ancestors
        if (unifiedChild.ancestors && unifiedChild.ancestors.length > 0) {
          const parentEntity = unifiedChild.ancestors[0];
          setEntity(parentEntity);
        }
      }
    } catch (error) {
      console.error('Error fetching child:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntityCollections = async (entityKey: string) => {
    try {
      setCollectionsLoading(true);
      // Fetch all three collections for the entity
      const [routesData, aliasesRes, approvalsRes] = await Promise.all([
        fetchRoutes(entityKey),
        fetch(`/api/generic-aliases?entityKey=${encodeURIComponent(entityKey)}`), // aliases (generic_aliases)
        fetch(`/api/generic-approvals?entityKey=${encodeURIComponent(entityKey)}`) // approvals (generic_approvals)
      ]);

      // Set routes data (already processed by fetchRoutes)
      setRoutesList(routesData);

      // Fetch aliases (now returns UIAggregate directly)
      if (aliasesRes.ok) {
        const aliases: UIAggregate[] = await aliasesRes.json();
        setAliasesList(aliases);
      } else {
        setAliasesList([]);
      }

      // Fetch approvals (now returns UIAggregate directly)
      if (approvalsRes.ok) {
        const approvals: UIAggregate[] = await approvalsRes.json();
        setApprovalsList(approvals);
      } else {
        setApprovalsList([]);
      }
    } catch (error) {
      setAliasesList([]);
      setRoutesList([]);
      setApprovalsList([]);
    } finally {
      setCollectionsLoading(false);
    }
  };

  async function fetchRoutes(entityKey: string): Promise<UIAggregate[]> {
    const routesRes = await fetch(`/api/generic-routes?entityKey=${encodeURIComponent(entityKey)}`);
    if (!routesRes.ok) {
      throw new Error('Failed to fetch routes');
    }
    
    const routes: UIAggregate[] = await routesRes.json();
    return routes;
  }

  // Create callback maps for tabs
  const createTabCallbacks = (collectionType: string, parentKey: string): TabCallbacks => ({
    onUpdate: async (index: number, data: any) => {
      await operations.updateCollection(collectionType, parentKey, index, data);
      // Refresh collections after update (only for entities, not child entities)  
      if (entity && !child) {
        await fetchEntityCollections(parentKey);
      }
    },
    onDelete: async (id: string | number) => {
      await operations.deleteFromCollection(collectionType, parentKey, id);
      // Refresh collections after delete (only for entities, not child entities)
      if (entity && !child) {
        await fetchEntityCollections(parentKey);
      }
    },
    onCreate: async (data: any) => {
      await operations.createInCollection(collectionType, parentKey, data);
      // Refresh collections after create (only for entities, not child entities)
      if (entity && !child) {
        await fetchEntityCollections(parentKey);
      }
    },
  });

  // Generic handler for both entity and child updates
  const handleUpdate = async (entity: UIEntity, updatedProperties: UIProperty[]) => {
    try {
      // Check if this is a child entity by looking for child_entity_key property
      const childKeyProp = updatedProperties.find((p: UIProperty) => p.property_name === 'child_entity_key');
      
      if (childKeyProp) {
        // Handle child entity update - extract update data from properties
        const nameProperty = updatedProperties.find(p => p.property_name === 'child_entity_name');
        const property1 = updatedProperties.find(p => p.property_name === 'child_entity_property1');
        
        const updateData: UpdateChildEntityRequest = {
          displayName: nameProperty?.property_value || '',
          child_entity_property1: property1?.property_value || ''
        };
        
        const updatedChild = await operations.updateChild(childKeyProp.property_value, updateData);
        setChild(updatedChild);
        onChildUpdated?.(updatedChild);
      } else {
        // Handle main entity update - extract update data from properties
        const nameProperty = updatedProperties.find(p => p.property_name === 'entity_name');
        const property1 = updatedProperties.find(p => p.property_name === 'entity_property1');
        
        const updateData: UpdateEntityRequest = {
          displayName: nameProperty?.property_value || '',
          entity_property1: property1?.property_value || ''
        };
        
        if (entity.entity_key) {
          const updatedEntity = await operations.updateEntity(entity.entity_key, updateData);
          setEntity(updatedEntity);
          onEntityUpdated?.(updatedEntity);
        }
      }
    } catch (error) {
      console.error('Error updating entity:', error);
    }
  };

  // Generic handler for both entity and child deletes
  const handleDelete = async (entity: UIEntity) => {
    try {
      // Check if this is a child entity by looking for child_entity_key property
      const childKeyProp = entity.properties?.find((p: UIProperty) => p.property_name === 'child_entity_key');
      
      if (childKeyProp) {
        // Handle child entity delete
        await operations.deleteChild(childKeyProp.property_value);
        onChildDeleted?.(childKeyProp.property_value);
      } else {
        // Handle main entity delete
        if (entity.entity_key) {
          await operations.deleteEntity(entity.entity_key);
          onEntityDeleted?.(entity.entity_key);
        }
      }
    } catch (error) {
      console.error('Error deleting entity:', error);
    }
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

  // Helper function to convert UIEntity properties array to simple object for TabProperties
  const convertUIEntityToTabData = (uiEntities: UIEntity[]): any[] => {
    return uiEntities.map(uiEntity => {
      const obj: Record<string, any> = {};
      uiEntity.properties?.forEach(prop => {
        obj[prop.property_name] = prop.property_value;
      });
      return obj;
    });
  };

  // Helper function to convert UIAggregate properties array to simple object for TabProperties
  const convertUIAggregateToTabData = (uiAggregates: UIAggregate[]): any[] => {
    return uiAggregates.map(uiAggregate => {
      const obj: Record<string, any> = {};
      uiAggregate.properties?.forEach(prop => {
        obj[prop.property_name] = prop.property_value;
      });
      return obj;
    });
  };

  // Get entity key for legacy API compatibility
  const entityKeyForAPI = entity?.entity_key || '';
  
  // Prepare tab configurations - use aggregates from the unified entity if available
  const tabConfigs: TabConfig[] = child
    ? [] // Child entities have no collections/tabs
    : entity && entity.aggregates && entity.aggregates.length > 0
    ? entity.aggregates
        .sort((a, b) => a.ordinal - b.ordinal)
        .map(collection => ({
          key: collection.displayName.toLowerCase().replace(/\s+/g, '-'),
          label: collection.displayName,
          icon: <Database className="w-4 h-4" />,
          data: collection.properties || [],
          emptyMessage: `No ${collection.displayName.toLowerCase()} for this entity.`,
          type: 'auto' as const,
          schemaEntityName: collection.displayName.toLowerCase().replace(/\s+/g, '_'),
        }))
    : entity
    ? [
        // Fallback to legacy tab structure if no aggregates defined
        {
          key: 'aliases',
          label: 'Aliases',
          icon: <Tag className="w-4 h-4" />,
          data: convertUIAggregateToTabData(aliasesList),
          emptyMessage: 'No aliases for this generic drug.',
          type: 'auto' as const,
          schemaEntityName: 'generic_aliases',
        },
        {
          key: 'routes',
          label: 'Routes & Dosing',
          icon: <Database className="w-4 h-4" />,
          data: convertUIAggregateToTabData(routesList),
          emptyMessage: 'No routes & dosing information for this generic drug.',
          type: 'auto' as const,
          schemaEntityName: 'generic_routes',
        },
        {
          key: 'approvals',
          label: 'Approvals',
          icon: <Settings className="w-4 h-4" />,
          data: convertUIAggregateToTabData(approvalsList),
          emptyMessage: 'No approval information for this generic drug.',
          type: 'auto' as const,
          schemaEntityName: 'generic_approvals',
        },
      ]
    : [];

  // Create callback map for tabs
  const tabCallbacks: Record<string, TabCallbacks> = {};
  if (entity && !child) { // Only entity has collections, child entities have no tabs
    tabCallbacks['aliases'] = createTabCallbacks('generic-aliases', entityKeyForAPI);
    tabCallbacks['routes'] = createTabCallbacks('generic-routes', entityKeyForAPI);
    tabCallbacks['approvals'] = createTabCallbacks('generic-approvals', entityKeyForAPI);
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-accent-md m-4">
      <div className="flex-1 min-h-0 flex flex-col">
        <DetailCardProperties
          subtitle={child ? 'Child Entity Detail' : 'Entity Detail'}
          icon={child ? <Tag className="w-4 h-4 text-emerald-500" /> : <Pill className="w-4 h-4 text-indigo-600" />}
          entity={child || entity!}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
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