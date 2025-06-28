'use client';

import { useState, useEffect } from 'react';
import { 
  UIEntity, 
  UIProperty, 
  LegacyEntity, 
  LegacyChildEntity,
  LegacyEntityColl1,
  GenericAlias,
  GenericApproval,
  convertLegacyEntityToUIEntity,
  convertLegacyChildEntityToUIEntity,
  convertUIEntityToLegacyEntity,
  convertUIEntityToLegacyChildEntity,
  convertLegacyEntityColl1ToUIEntity,
  convertGenericAliasToUIEntity,
  convertGenericApprovalToUIEntity
} from '@/types';
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
  const [aliasesList, setAliasesList] = useState<any[]>([]);
  const [routesList, setRoutesList] = useState<any[]>([]);
  const [approvalsList, setApprovalsList] = useState<any[]>([]);

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
        const legacyData: LegacyEntity = await response.json();
        const unifiedEntity = convertLegacyEntityToUIEntity(legacyData);
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
      const response = await fetch(`/api/children/${encodeURIComponent(childKey)}`);
      if (response.ok) {
        const legacyChildData: LegacyChildEntity = await response.json();
        const unifiedChild = convertLegacyChildEntityToUIEntity(legacyChildData);
        setChild(unifiedChild);
        
        // Also fetch the parent entity
        if (legacyChildData.entity_key) {
          const entityResponse = await fetch(`/api/entities/${encodeURIComponent(legacyChildData.entity_key)}`);
          if (entityResponse.ok) {
            const legacyEntityData: LegacyEntity = await entityResponse.json();
            const unifiedEntity = convertLegacyEntityToUIEntity(legacyEntityData);
            setEntity(unifiedEntity);
          }
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
      const [routesRes, aliasesRes, approvalsRes] = await Promise.all([
        fetch('/api/entity-coll1'), // routes and dosing (generic_routes)
        fetch(`/api/generic-aliases?entityKey=${encodeURIComponent(entityKey)}`), // aliases (generic_aliases)
        fetch(`/api/generic-approvals?entityKey=${encodeURIComponent(entityKey)}`) // approvals (generic_approvals)
      ]);

      // Fetch and convert aliases
      if (aliasesRes.ok) {
        const aliases: GenericAlias[] = await aliasesRes.json();
        const convertedAliases = aliases.map(alias => convertGenericAliasToUIEntity(alias));
        setAliasesList(convertedAliases);
      } else {
        setAliasesList([]);
      }

      // Fetch and convert routes
      if (routesRes.ok) {
        const routes: LegacyEntityColl1[] = await routesRes.json();
        const filteredRoutes = routes.filter((item: LegacyEntityColl1) => item.entity_key === entityKey);
        // Convert legacy collection data to UIEntity format with proper schema field names
        const convertedRoutes = filteredRoutes.map(route => convertLegacyEntityColl1ToUIEntity(route));
        setRoutesList(convertedRoutes);
      } else {
        setRoutesList([]);
      }

      // Fetch and convert approvals
      if (approvalsRes.ok) {
        const approvals: GenericApproval[] = await approvalsRes.json();
        const convertedApprovals = approvals.map(approval => convertGenericApprovalToUIEntity(approval));
        setApprovalsList(convertedApprovals);
      } else {
        setApprovalsList([]);
      }
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      setAliasesList([]);
      setRoutesList([]);
      setApprovalsList([]);
    } finally {
      setCollectionsLoading(false);
    }
  };

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
        // Handle child entity update - convert to legacy format for API
        const legacyChildEntity = convertUIEntityToLegacyChildEntity({
          ...entity,
          properties: updatedProperties
        });
        
        const updatedChild = await operations.updateChild(legacyChildEntity.child_entity_key, {
          child_entity_name: legacyChildEntity.child_entity_name,
          child_entity_property1: legacyChildEntity.child_entity_property1
        });
        
        // Convert back to unified UIEntity type
        const unifiedChild = convertLegacyChildEntityToUIEntity(updatedChild);
        setChild(unifiedChild);
        onChildUpdated?.(unifiedChild);
      } else {
        // Handle main entity update - convert to legacy format for API
        const legacyEntity = convertUIEntityToLegacyEntity({
          ...entity,
          properties: updatedProperties
        });
        
        // Use legacy format for API call
        const updateData: Partial<LegacyEntity> = {
          entity_name: legacyEntity.entity_name,
          entity_property1: legacyEntity.entity_property1,
        };
        const updatedEntity = await operations.updateEntity(legacyEntity.entity_key, updateData);
        
        // Convert back to unified UIEntity type (API still returns legacy format)
        const unifiedEntity = convertLegacyEntityToUIEntity(updatedEntity as any);
        setEntity(unifiedEntity);
        onEntityUpdated?.(unifiedEntity);
      }
    } catch (error) {
      console.error('Error updating entity:', error);
    }
  };

  // Generic handler for both entity and child deletes
  const handleDelete = async (entity: UIEntity) => {
    try {
      // Check if this is a child entity by looking for child_entity_key property
      const childKeyProp = entity.properties.find((p: UIProperty) => p.property_name === 'child_entity_key');
      
      if (childKeyProp) {
        // Handle child entity delete
        await operations.deleteChild(childKeyProp.property_value);
        onChildDeleted?.(childKeyProp.property_value);
      } else {
        // Handle main entity delete
        await operations.deleteEntity(entity.entity_key);
        onEntityDeleted?.(entity.entity_key);
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
      uiEntity.properties.forEach(prop => {
        obj[prop.property_name] = prop.property_value;
      });
      return obj;
    });
  };

  // Get entity key for legacy API compatibility
  const entityKeyForAPI = entity ? entity.entity_key : '';
  
  // Prepare tab configurations - use sub_collections from the unified entity if available
  const tabConfigs: TabConfig[] = child
    ? [] // Child entities have no collections/tabs
    : entity && entity.sub_collections.length > 0
    ? entity.sub_collections
        .sort((a, b) => a.ordinal - b.ordinal)
        .map(collection => ({
          key: collection.display_name.toLowerCase().replace(/\s+/g, '-'),
          label: collection.display_name,
          icon: <Database className="w-4 h-4" />,
          data: collection.properties,
          emptyMessage: `No ${collection.display_name.toLowerCase()} for this entity.`,
          type: 'auto' as const,
          schemaEntityName: collection.display_name.toLowerCase().replace(/\s+/g, '_'),
        }))
    : entity
    ? [
        // Fallback to legacy tab structure if no sub_collections defined
        {
          key: 'aliases',
          label: 'Aliases',
          icon: <Tag className="w-4 h-4" />,
          data: convertUIEntityToTabData(aliasesList),
          emptyMessage: 'No aliases for this generic drug.',
          type: 'auto' as const,
          schemaEntityName: 'generic_aliases',
        },
        {
          key: 'routes',
          label: 'Routes & Dosing',
          icon: <Database className="w-4 h-4" />,
          data: convertUIEntityToTabData(routesList),
          emptyMessage: 'No routes & dosing information for this generic drug.',
          type: 'auto' as const,
          schemaEntityName: 'generic_routes',
        },
        {
          key: 'approvals',
          label: 'Approvals',
          icon: <Settings className="w-4 h-4" />,
          data: approvalsList,
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