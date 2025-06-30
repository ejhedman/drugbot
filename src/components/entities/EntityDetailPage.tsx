'use client';

import { useState, useEffect } from 'react';
import { 
  UIEntity, 
  UIProperty, 
  UIAggregate,
} from '@/model_defs';
import {
  UpdateChildEntityRequest,
  UpdateEntityRequest
} from '@/model_defs/DBModel';
import { Settings, Database, Pill, Tag } from 'lucide-react';
import { DetailCardProperties } from './DetailCardProperties';
import { CollectionTabSet, TabConfig, TabCallbacks } from './CollectionTabSet';
import { useEntityOperations } from '@/hooks/useEntityOperations';
import { EntityDetailSkeleton } from '@/components/ui/skeleton';
import { theUIModel } from '@/model_instances/TheUIModel';
import { getBorderClasses } from '@/lib/borderUtils';

interface EntityDetailPageProps {
  entityUid: string | null;
  childUid: string | null;
  onEntityUpdated?: (entity: UIEntity) => void;
  onChildUpdated?: (child: UIEntity) => void;
  onEntityDeleted?: (entityUid: string) => void;
  onChildDeleted?: (childUid: string) => void;
}

export function EntityDetailPage({
  entityUid,
  childUid,
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
  const [aliasesList, setAliasesList] = useState<UIAggregate | null>(null);
  const [routesList, setRoutesList] = useState<UIAggregate | null>(null);
  const [approvalsList, setApprovalsList] = useState<UIAggregate | null>(null);
  const [manuDrugsList, setManuDrugsList] = useState<UIAggregate | null>(null);

  const operations = useEntityOperations();

  useEffect(() => {
    if (childUid) {
      fetchChild();
      // Child entities (manu_drugs) have no collections, so no fetching needed
    } else if (entityUid) {
      fetchEntity();
      // fetchEntityCollections will be called after entity is loaded
    } else {
      setEntity(null);
      setChild(null);
      setAliasesList(null);
      setRoutesList(null);
      setApprovalsList(null);
      setManuDrugsList(null);
    }
  }, [entityUid, childUid]);

  // Fetch collections when entity is loaded
  useEffect(() => {
    if (entity && !child) {
      fetchEntityCollections();
    }
  }, [entity, child]);

  const fetchEntity = async () => {
    if (!entityUid) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/entities/${encodeURIComponent(entityUid)}`);
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
    if (!childUid) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/children/${encodeURIComponent(childUid)}?format=ui`);
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

  const fetchEntityCollections = async () => {
    try {
      setCollectionsLoading(true);
      // Get the entity UID from the entity object
      const entityUid = entity?.entityUid;
      if (!entityUid) {
        console.error('Entity UID not available for fetching collections');
        return;
      }
      
      // Fetch all four collections for the entity
      const [routesData, aliasesRes, approvalsRes, manuDrugsRes] = await Promise.all([
        fetchRoutes(entityUid),
        fetch(`/api/generic-aliases?entityUid=${encodeURIComponent(entityUid)}`), // aliases (generic_aliases)
        fetch(`/api/generic-approvals?entityUid=${encodeURIComponent(entityUid)}`), // approvals (generic_approvals)
        fetch(`/api/generic-manu-drugs?entityUid=${encodeURIComponent(entityUid)}`) // manufactured drugs (manu_drugs)
      ]);

      // Set routes data (already processed by fetchRoutes)
      setRoutesList(routesData);

      // Fetch aliases (now returns single UIAggregate)
      if (aliasesRes.ok) {
        const aliases: UIAggregate = await aliasesRes.json();
        console.log('EntityDetailPage: Aliases refreshed, count:', aliases.rows?.length || 0);
        setAliasesList(aliases);
      } else {
        console.log('EntityDetailPage: Failed to fetch aliases');
        setAliasesList(null);
      }

      // Fetch approvals (now returns single UIAggregate)
      if (approvalsRes.ok) {
        const approvals: UIAggregate = await approvalsRes.json();
        setApprovalsList(approvals);
      } else {
        setApprovalsList(null);
      }

      // Fetch manufactured drugs (now returns single UIAggregate)
      if (manuDrugsRes.ok) {
        const manuDrugs: UIAggregate = await manuDrugsRes.json();
        setManuDrugsList(manuDrugs);
      } else {
        setManuDrugsList(null);
      }
    } catch (error) {
      setAliasesList(null);
      setRoutesList(null);
      setApprovalsList(null);
      setManuDrugsList(null);
    } finally {
      setCollectionsLoading(false);
    }
  };

  async function fetchRoutes(entityUid: string): Promise<UIAggregate> {
    const routesRes = await fetch(`/api/generic-routes?entityUid=${encodeURIComponent(entityUid)}`);
    if (!routesRes.ok) {
      throw new Error('Failed to fetch routes');
    }
    
    const routes: UIAggregate = await routesRes.json();
    return routes;
  }

  // Create callback maps for tabs
  const createTabCallbacks = (collectionType: string, parentKey: string): TabCallbacks => ({
    onUpdate: async (id: string | number, data: any) => {
      await operations.updateCollection(collectionType, parentKey, id, data);
      // Refresh collections after update (only for entities, not child entities)  
      if (entity && !child) {
        await fetchEntityCollections();
      }
    },
    onDelete: async (id: string | number) => {
      console.log('EntityDetailPage: onDelete called with id:', id, 'collectionType:', collectionType);
      await operations.deleteFromCollection(collectionType, parentKey, id);
      // Refresh collections after delete (only for entities, not child entities)
      if (entity && !child) {
        console.log('EntityDetailPage: Refreshing collections after delete');
        await fetchEntityCollections();
        console.log('EntityDetailPage: Collections refreshed');
      }
    },
    onCreate: async (data: any) => {
      await operations.createInCollection(collectionType, parentKey, data);
      // Refresh collections after create (only for entities, not child entities)
      if (entity && !child) {
        await fetchEntityCollections();
      }
    },
  });

  // Generic handler for both entity and child updates
  const handleUpdate = async (entity: UIEntity, updatedProperties: UIProperty[]) => {
    try {
      // Check if this is a child entity by looking for child_entity_key property
      const childEntityIndicator = updatedProperties.find((p: UIProperty) => p.propertyName === 'child_entity_key');
      
      if (childEntityIndicator) {
        // Handle child entity update - build properties object from updated properties
        const nameProperty = updatedProperties.find(p => p.propertyName === 'child_entity_name');
        
        // Build properties object from all non-name, non-key properties
        const properties: { [key: string]: any } = {};
        updatedProperties.forEach(prop => {
          if (prop.propertyName !== 'child_entity_name' && 
              prop.propertyName !== 'child_entity_key' && 
              prop.propertyName !== 'uid') {
            // Map property names to actual database field names
            if (prop.propertyName === 'child_entity_property1') {
              properties['manufacturer'] = prop.propertyValue;
            } else {
              properties[prop.propertyName] = prop.propertyValue;
            }
          }
        });
        
        const updateData: UpdateChildEntityRequest = {
          displayName: nameProperty?.propertyValue || '',
          properties: Object.keys(properties).length > 0 ? properties : undefined
        };
        
        // Use entityUid for child operations
        if (entity.entityUid) {
          const updatedChild = await operations.updateChild(entity.entityUid, updateData);
          setChild(updatedChild);
          onChildUpdated?.(updatedChild);
        }
      } else {
        // Handle main entity update - build properties object from updated properties
        const nameProperty = updatedProperties.find(p => p.propertyName === 'entity_name');
        
        // Build properties object from all non-name, non-key properties
        const properties: { [key: string]: any } = {};
        updatedProperties.forEach(prop => {
          if (prop.propertyName !== 'entity_name' && 
              prop.propertyName !== 'entity_key' && 
              prop.propertyName !== 'uid') {
            // Map property names to actual database field names
            if (prop.propertyName === 'entity_property1') {
              properties['mech_of_action'] = prop.propertyValue;
            } else {
              properties[prop.propertyName] = prop.propertyValue;
            }
          }
        });
        
        const updateData: UpdateEntityRequest = {
          displayName: nameProperty?.propertyValue || '',
          properties: Object.keys(properties).length > 0 ? properties : undefined
        };
        
        if (entity.entityUid) {
          const updatedEntity = await operations.updateEntity(entity.entityUid, updateData);
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
      const childEntityIndicator = entity.properties?.find((p: UIProperty) => p.propertyName === 'child_entity_key');
      
      if (childEntityIndicator) {
        // Handle child entity delete
        if (entity.entityUid) {
          await operations.deleteChild(entity.entityUid);
          onChildDeleted?.(childEntityIndicator.propertyValue);
        }
      } else {
        // Handle main entity delete
        if (entity.entityUid) {
          await operations.deleteEntity(entity.entityUid);
          onEntityDeleted?.(entity.entityUid || '');
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
        // Only include properties that are marked as visible
        if (prop.isVisible) {
          obj[prop.propertyName] = prop.propertyValue;
        }
      });
      return obj;
    });
  };

  // Helper function to convert UIAggregate rows to simple objects for TabProperties
  const convertUIAggregateToTabData = (uiAggregate: UIAggregate | null): any[] => {
    if (!uiAggregate) {
      return [];
    }
    
    // Handle new rows structure (2D array)
    if (uiAggregate.rows && uiAggregate.rows.length > 0) {
      const result = uiAggregate.rows.map(row => {
        const obj: Record<string, any> = {};
        let uid: string | undefined;
        
        row.forEach(prop => {
          if (prop.propertyName === 'uid') {
            // Store uid separately for operations but don't include in visible data
            uid = prop.propertyValue;
          } else if (prop.isVisible) {
            // Only include properties that are marked as visible
            obj[prop.propertyName] = prop.propertyValue;
          }
        });
        
        // Add uid as a hidden property for operations
        if (uid) {
          obj._uid = uid;
        }
        
        return obj;
      });
      
      console.log('EntityDetailPage: convertUIAggregateToTabData result:', result.length, 'items');
      return result;
    }
    

    
    return [];
  };

  // Get entity key for legacy API compatibility
  const entityUidForAPI = entity?.entityUid || '';
  
  // Get the aggregateRefs from the UI model to determine tab order
  const entityAggregateRefs = entity ? theUIModel.getEntity('GenericDrugs')?.aggregateRefs || [] : [];
  
  // Prepare tab configurations - use schema-driven approach for generic_drugs entities
  const tabConfigs: TabConfig[] = child
    ? [] // Child entities have no collections/tabs
    : entity
    ? [
        // Schema-driven tab structure using API responses and aggregateRefs for ordering
        {
          key: 'manufactured-drugs',
          label: 'Manufactured Drugs',
          icon: <Database className="w-4 h-4" />,
          data: convertUIAggregateToTabData(manuDrugsList),
          emptyMessage: 'No manufactured drugs for this generic drug.',
          schemaEntityName: 'generic_manu_drugs',
          isTable: manuDrugsList?.isTable ?? true,
          ordinal: entityAggregateRefs.find(ref => ref.aggregateType === 'GenericManuDrugs')?.ordinal ?? 4,
        },
        {
          key: 'routes',
          label: 'Routes & Dosing',
          icon: <Database className="w-4 h-4" />,
          data: convertUIAggregateToTabData(routesList),
          emptyMessage: 'No routes & dosing information for this generic drug.',
          schemaEntityName: 'generic_routes',
          isTable: routesList?.isTable ?? true,
          ordinal: entityAggregateRefs.find(ref => ref.aggregateType === 'GenericRoute')?.ordinal ?? 2,
        },
        {
          key: 'approvals',
          label: 'Approvals',
          icon: <Settings className="w-4 h-4" />,
          data: convertUIAggregateToTabData(approvalsList),
          emptyMessage: 'No approval information for this generic drug.',
          schemaEntityName: 'generic_approvals',
          isTable: approvalsList?.isTable ?? true,
          ordinal: entityAggregateRefs.find(ref => ref.aggregateType === 'GenericApproval')?.ordinal ?? 3,
        },
        {
          key: 'aliases',
          label: 'Aliases',
          icon: <Tag className="w-4 h-4" />,
          data: convertUIAggregateToTabData(aliasesList),
          emptyMessage: 'No aliases for this generic drug.',
          schemaEntityName: 'generic_aliases',
          isTable: aliasesList?.isTable ?? true,
          ordinal: entityAggregateRefs.find(ref => ref.aggregateType === 'GenericAlias')?.ordinal ?? 1,
        },
      ].sort((a, b) => a.ordinal - b.ordinal) // Sort tabs by ordinal
    : [];

  // Create callback map for tabs
  const tabCallbacks: Record<string, TabCallbacks> = {};
  if (entity && !child) { // Only entity has collections, child entities have no tabs
    tabCallbacks['aliases'] = createTabCallbacks('generic-aliases', entityUidForAPI);
    tabCallbacks['routes'] = createTabCallbacks('generic-routes', entityUidForAPI);
    tabCallbacks['approvals'] = createTabCallbacks('generic-approvals', entityUidForAPI);
    tabCallbacks['manufactured-drugs'] = createTabCallbacks('generic-manu-drugs', entityUidForAPI);
  }

  return (
    <div className={getBorderClasses("flex-1 min-h-0 flex flex-col bg-white rounded-xl overflow-hidden", "border-6 border-orange-500")}>
      <div className="flex-1 min-h-0 flex flex-col p-4 overflow-hidden">
        <DetailCardProperties
          subtitle={child ? 'Child Entity Detail' : 'Entity Detail'}
          icon={child ? <Tag className="w-4 h-4 text-emerald-500" /> : <Pill className="w-4 h-4 text-indigo-600" />}
          entity={child || entity!}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />

        {tabConfigs.length > 0 && (
          <CollectionTabSet
            tabs={tabConfigs}
            loading={collectionsLoading}
            callbacks={tabCallbacks}
            className={getBorderClasses("bg-white mt-4 shadow-accent flex-1 min-h-0", "border-6 border-yellow-500")}
          />
        )}
      </div>
    </div>
  );
} 