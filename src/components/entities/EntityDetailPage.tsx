'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { getEntityTableName, getEntityKeyField } from '@/model_instances/TheModelMap';
import { getBorderClasses } from '@/lib/borderUtils';
import { getEntityMapping } from '@/model_instances/TheModelMap';

interface EntityDetailPageProps {
  entityUid: string | null;
  childUid: string | null;
  entityType?: string; // Entity type for main entities (e.g., 'GenericDrugs')
  childType?: string; // Entity type for child entities (e.g., 'ManuDrugs')
  onEntityUpdated?: (entity: UIEntity) => void;
  onChildUpdated?: (child: UIEntity) => void;
  onEntityDeleted?: (entityUid: string) => void;
  onChildDeleted?: (childUid: string) => void;
}

export function EntityDetailPage({
  entityUid,
  childUid,
  entityType = 'GenericDrugs',
  childType = 'ManuDrugs',
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
  const [wideViewList, setWideViewList] = useState<UIAggregate | null>(null);

  const operations = useEntityOperations();

  // Function to convert raw database row to UIEntity format
  const convertRowToUIEntity = (row: any, entityType: string): UIEntity => {
    const entityMeta = theUIModel.getEntity(entityType);
    if (!entityMeta) {
      throw new Error(`Entity type not found: ${entityType}`);
    }

    const properties: UIProperty[] = entityMeta.propertyDefs?.map(propDef => ({
      ...propDef,
      propertyValue: row[propDef.propertyName]
    })) || [];

    // Determine the main display property for the entity type
    let mainNameProp = 'generic_name';
    if (entityType === 'ManuDrugs') mainNameProp = 'drug_name';
    // Add more entity types as needed
    const displayName = row[mainNameProp] || entityMeta.displayName;

    return {
      ...entityMeta,
      entityUid: row.uid,
      displayName,
      properties
    };
  };

  const fetchEntity = useCallback(async () => {
    if (!entityUid) return;
    const table = getEntityTableName(entityType);
    if (!table) {
      return;
    }
    try {
      setLoading(true);
      const requestBody = { table, where: { uid: entityUid }, limit: 1 };
      const response = await fetch('/api/dynamic-select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const result = await response.json();
        const row = result?.data?.[0] || null;
        if (row) {
          const uiEntity = convertRowToUIEntity(row, entityType);
          setEntity(uiEntity);
          setChild(null);
        } else {
          setEntity(null);
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [entityUid, entityType]);

  const fetchChild = useCallback(async () => {
    if (!childUid) return;
    const table = getEntityTableName(childType);
    if (!table) {
      return;
    }
    try {
      setLoading(true);
      const requestBody = { table, where: { uid: childUid }, limit: 1 };
      const response = await fetch('/api/dynamic-select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const result = await response.json();
        const row = result?.data?.[0] || null;
        if (row) {
          const uiChild = convertRowToUIEntity(row, childType);
          setChild(uiChild);
          setEntity(null); // Clear the parent entity when viewing a child
        } else {
          setChild(null);
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [childUid, childType]);

  const fetchEntityCollections = useCallback(async () => {
    try {
      setCollectionsLoading(true);
      // Get the entity UID from the entity object
      const entityUid = entity?.entityUid;
      if (!entityUid) {
        return;
      }
      
      // Fetch all five collections for the entity using the dynamic aggregate API
      const [aliasesRes, routesRes, approvalsRes, manuDrugsRes, wideViewRes] = await Promise.all([
        fetch(`/api/dynamic-aggregate?entityUid=${encodeURIComponent(entityUid)}&aggregateType=GenericAlias`),
        fetch(`/api/dynamic-aggregate?entityUid=${encodeURIComponent(entityUid)}&aggregateType=GenericRoute`),
        fetch(`/api/dynamic-aggregate?entityUid=${encodeURIComponent(entityUid)}&aggregateType=GenericApproval`),
        fetch(`/api/dynamic-aggregate?entityUid=${encodeURIComponent(entityUid)}&aggregateType=GenericManuDrugs`),
        fetch(`/api/dynamic-aggregate?entityUid=${encodeURIComponent(entityUid)}&aggregateType=GenericDrugsWideView`)
      ]);

      // Fetch aliases (now returns single UIAggregate)
      if (aliasesRes.ok) {
        const aliases: UIAggregate = await aliasesRes.json();
        setAliasesList(aliases);
      } else {
        setAliasesList(null);
      }

      // Fetch routes (now returns single UIAggregate)
      if (routesRes.ok) {
        const routes: UIAggregate = await routesRes.json();
        setRoutesList(routes);
      } else {
        setRoutesList(null);
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

      // Fetch wide view (now returns single UIAggregate)
      if (wideViewRes.ok) {
        const wideView: UIAggregate = await wideViewRes.json();
        setWideViewList(wideView);
      } else {
        setWideViewList(null);
      }
    } catch (error) {
      setAliasesList(null);
      setRoutesList(null);
      setApprovalsList(null);
      setManuDrugsList(null);
      setWideViewList(null);
    } finally {
      setCollectionsLoading(false);
    }
  }, [entity]);

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
      setWideViewList(null);
    }
  }, [entityUid, childUid, fetchEntity, fetchChild]);

  // Fetch collections when entity is loaded
  useEffect(() => {
    if (entity && !child && entity.entityUid) {
      fetchEntityCollections();
    }
  }, [entity, child, fetchEntityCollections]);

  async function fetchRoutes(entityUid: string): Promise<UIAggregate> {
    const routesRes = await fetch(`/api/dynamic-aggregate?entityUid=${encodeURIComponent(entityUid)}&aggregateType=GenericRoute`);
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
      await operations.deleteFromCollection(collectionType, parentKey, id);
      // Refresh collections after delete (only for entities, not child entities)
      if (entity && !child) {
        await fetchEntityCollections();
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
      // Check if this is a child entity by checking if we have a childUid and the entity matches
      const isChildEntity = childUid && child && entity.entityUid === childUid;
      
      if (isChildEntity) {
        // Handle child entity update - build properties object from updated properties
        // Build properties object from all non-uid properties
        const properties: { [key: string]: any } = {};
        updatedProperties.forEach(prop => {
          if (prop.propertyName !== 'uid') {
            // Use the actual property names from the UI model
            properties[prop.propertyName] = prop.propertyValue;
          }
        });
        
        // Get table and key from model for child entity
        const table = getEntityTableName(childType);
        
        if (!table) {
          throw new Error(`No table found for entity type: ${childType}`);
        }
        
        // Use entityUid for child operations
        if (entity.entityUid) {
          const updatedChild = await operations.updateChild(entity.entityUid, {
            table,
            properties
          });
          
          // Refetch the child entity to get the proper UIEntity format
          await fetchChild();
          
          onChildUpdated?.(updatedChild);
        }
      } else {
        // Handle main entity update - build properties object from updated properties
        // Build properties object from all non-uid properties
        const properties: { [key: string]: any } = {};
        updatedProperties.forEach(prop => {
          if (prop.propertyName !== 'uid') {
            // Use the actual property names from the UI model
            properties[prop.propertyName] = prop.propertyValue;
          }
        });
        
        // Get table from model for main entity
        const table = getEntityTableName(entityType);
        
        if (!table) {
          throw new Error(`No table found for entity type: ${entityType}`);
        }
        
        if (entity.entityUid) {
          const updatedEntity = await operations.updateEntity(entity.entityUid, {
            table,
            properties
          });
          
          // Refetch the entity to get the proper UIEntity format
          await fetchEntity();
          
          onEntityUpdated?.(updatedEntity);
        }
      }
    } catch (error) {
    }
  };

  // Generic handler for both entity and child deletes
  const handleDelete = async (entity: UIEntity) => {
    try {
      // Check if this is a child entity by checking if we have a childUid and the entity matches
      const isChildEntity = childUid && child && entity.entityUid === childUid;
      
      if (isChildEntity) {
        // Handle child entity delete
        if (entity.entityUid) {
          const table = getEntityTableName(childType);
          
          if (!table) {
            throw new Error(`No table found for entity type: ${childType}`);
          }
          
          await operations.deleteChild(entity.entityUid, { table });
          onChildDeleted?.(entity.entityUid);
        }
      } else {
        // Handle main entity delete
        if (entity.entityUid) {
          const table = getEntityTableName(entityType);
          
          if (!table) {
            throw new Error(`No table found for entity type: ${entityType}`);
          }
          
          await operations.deleteEntity(entity.entityUid, { table });
          onEntityDeleted?.(entity.entityUid || '');
        }
      }
    } catch (error) {
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
          schemaEntityName: 'GenericManuDrugs',
          isTable: manuDrugsList?.isTable ?? true,
          canEdit: theUIModel.getAggregate('GenericManuDrugs')?.canEdit ?? true,
          ordinal: entityAggregateRefs.find(ref => ref.aggregateType === 'GenericManuDrugs')?.ordinal ?? 4,
        },
        {
          key: 'routes',
          label: 'Routes & Dosing',
          icon: <Database className="w-4 h-4" />,
          data: convertUIAggregateToTabData(routesList),
          emptyMessage: 'No routes & dosing information for this generic drug.',
          schemaEntityName: 'GenericRoute',
          isTable: routesList?.isTable ?? true,
          canEdit: theUIModel.getAggregate('GenericRoute')?.canEdit ?? true,
          ordinal: entityAggregateRefs.find(ref => ref.aggregateType === 'GenericRoute')?.ordinal ?? 2,
        },
        {
          key: 'approvals',
          label: 'Approvals',
          icon: <Settings className="w-4 h-4" />,
          data: convertUIAggregateToTabData(approvalsList),
          emptyMessage: 'No approval information for this generic drug.',
          schemaEntityName: 'GenericApproval',
          isTable: approvalsList?.isTable ?? true,
          canEdit: theUIModel.getAggregate('GenericApproval')?.canEdit ?? true,
          ordinal: entityAggregateRefs.find(ref => ref.aggregateType === 'GenericApproval')?.ordinal ?? 3,
        },
        {
          key: 'aliases',
          label: 'Aliases',
          icon: <Tag className="w-4 h-4" />,
          data: convertUIAggregateToTabData(aliasesList),
          emptyMessage: 'No aliases for this generic drug.',
          schemaEntityName: 'GenericAlias',
          isTable: aliasesList?.isTable ?? true,
          canEdit: theUIModel.getAggregate('GenericAlias')?.canEdit ?? true,
          ordinal: entityAggregateRefs.find(ref => ref.aggregateType === 'GenericAlias')?.ordinal ?? 1,
        },
      ].sort((a, b) => a.ordinal - b.ordinal) // Sort tabs by ordinal
    : [];

  // Create callback map for tabs
  const tabCallbacks: Record<string, TabCallbacks> = {};
  if (entity && !child) { // Only entity has collections, child entities have no tabs
    tabCallbacks['aliases'] = createTabCallbacks('GenericAlias', entityUidForAPI);
    tabCallbacks['routes'] = createTabCallbacks('GenericRoute', entityUidForAPI);
    tabCallbacks['approvals'] = createTabCallbacks('GenericApproval', entityUidForAPI);
    tabCallbacks['manufactured-drugs'] = createTabCallbacks('GenericManuDrugs', entityUidForAPI);
    tabCallbacks['wide-view'] = createTabCallbacks('GenericDrugsWideView', entityUidForAPI);
  }

  return (
    <div className={getBorderClasses("flex-1 min-h-0 flex flex-col bg-white rounded-xl overflow-hidden", "border-6 border-orange-500")}>
      <div className="flex-1 min-h-0 flex flex-col p-4 overflow-hidden">
        <DetailCardProperties
          title={(child || entity!)?.displayName}
          subtitle={child ? theUIModel.getEntityDisplayName(childType) : theUIModel.getEntityDisplayName(entityType)}
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