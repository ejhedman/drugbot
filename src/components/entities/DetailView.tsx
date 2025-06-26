'use client';

import { useState, useEffect } from 'react';
import { Entity, ChildEntity } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Table, Settings, Database, Trash2, Edit, X, Check, Pill, Tag } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TabTable } from './TabTable';
import { TabProperties } from './TabProperties';
import { EntityDetailSkeleton } from '@/components/ui/skeleton';

interface DetailViewProps {
  entityKey: string | null;
  childKey: string | null;
  isAddingEntity?: boolean;
  isAddingChild?: boolean;
  onCancelAddEntity?: () => void;
  onCancelAddChild?: () => void;
  onEntityCreated?: (entity: Entity) => void;
  onChildCreated?: (child: ChildEntity) => void;
}

export function DetailView({ entityKey, childKey, isAddingEntity = false, isAddingChild = false, onCancelAddEntity, onCancelAddChild, onEntityCreated, onChildCreated }: DetailViewProps) {
  const [entity, setEntity] = useState<Entity | null>(null);
  const [child, setChild] = useState<ChildEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [isEditingChild, setIsEditingChild] = useState(false);
  const [editedChild, setEditedChild] = useState<ChildEntity | null>(null);
  const [isEditingEntity, setIsEditingEntity] = useState(false);
  const [editedEntity, setEditedEntity] = useState<Entity | null>(null);
  const [newEntity, setNewEntity] = useState<Partial<Entity>>({});
  const [newChild, setNewChild] = useState<Partial<ChildEntity>>({});
  const [entityColl1List, setEntityColl1List] = useState<any[]>([]);
  const [childColl1List, setChildColl1List] = useState<any[]>([]);
  const [childColl2List, setChildColl2List] = useState<any[]>([]);
  const [tab, setTab] = useState('coll1');

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
    // eslint-disable-next-line
  }, [entityKey, childKey]);

  const fetchEntity = async () => {
    if (!entityKey) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/entities/${encodeURIComponent(entityKey)}`);
      if (response.ok) {
        const data = await response.json();
        // Add delay to see skeleton loader
        await new Promise(resolve => setTimeout(resolve, 1000));
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
        // Add delay to see skeleton loader
        await new Promise(resolve => setTimeout(resolve, 1000));
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
      const all1Res = await fetch(`/api/child-entity-coll1`);
      const all2Res = await fetch(`/api/child-entity-coll2`);
      // Add delay to see skeleton loader
      await new Promise(resolve => setTimeout(resolve, 1000));
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
      const allRes = await fetch(`/api/entity-coll1`);
      // Add delay to see skeleton loader
      await new Promise(resolve => setTimeout(resolve, 1000));
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

  // Child entity edit handlers
  const handleEditChild = () => {
    if (child) {
      setIsEditingChild(true);
      setEditedChild({ ...child });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingChild(false);
    setEditedChild(null);
  };

  const handleSaveChild = async () => {
    if (!editedChild) return;
    
    try {
      // TODO: Call API to update the child entity
      console.log('Saving updated child entity:', editedChild);
      
      // For now, just update the local state
      setChild(editedChild);
      setIsEditingChild(false);
      setEditedChild(null);
    } catch (error) {
      console.error('Error saving child entity:', error);
    }
  };

  const handleDeleteChild = async () => {
    if (!child) return;
    
    try {
      // TODO: Call API to delete the child entity
      console.log('Deleting child entity:', child);
      
      // For now, just clear the child selection
      setChild(null);
      setIsEditingChild(false);
      setEditedChild(null);
    } catch (error) {
      console.error('Error deleting child entity:', error);
    }
  };

  const handleChildInputChange = (field: keyof ChildEntity, value: string) => {
    if (editedChild) {
      setEditedChild({
        ...editedChild,
        [field]: value
      });
    }
  };

  // Parent entity edit handlers
  const handleEditEntity = () => {
    if (entity) {
      setIsEditingEntity(true);
      setEditedEntity({ ...entity });
    }
  };

  const handleCancelEditEntity = () => {
    setIsEditingEntity(false);
    setEditedEntity(null);
  };

  const handleSaveEntity = async () => {
    if (!editedEntity) return;
    
    try {
      // TODO: Call API to update the entity
      console.log('Saving updated entity:', editedEntity);
      
      // For now, just update the local state
      setEntity(editedEntity);
      setIsEditingEntity(false);
      setEditedEntity(null);
    } catch (error) {
      console.error('Error saving entity:', error);
    }
  };

  const handleDeleteEntity = async () => {
    if (!entity) return;
    
    try {
      // TODO: Call API to delete the entity
      console.log('Deleting entity:', entity);
      
      // For now, just clear the entity selection
      setEntity(null);
      setIsEditingEntity(false);
      setEditedEntity(null);
    } catch (error) {
      console.error('Error deleting entity:', error);
    }
  };

  const handleEntityInputChange = (field: keyof Entity, value: string) => {
    if (editedEntity) {
      setEditedEntity({
        ...editedEntity,
        [field]: value
      });
    }
  };

  // // Add entity handlers
  // const handleAddEntity = () => {
  //   // This is now handled by the parent component
  // };

  const handleCancelAddEntity = () => {
    setNewEntity({});
    onCancelAddEntity?.();
  };

  const handleSubmitAddEntity = async () => {
    try {
      // TODO: Call API to create the new entity
      console.log('Creating new entity:', newEntity);
      
      // For now, create a mock entity with a generated key
      const mockNewEntity: Entity = {
        entity_key: `entity_${Date.now()}`,
        entity_name: newEntity.entity_name || 'New Entity',
        entity_property1: newEntity.entity_property1 || ''
      };
      
      // Reset form state
      setNewEntity({});
      onCancelAddEntity?.();
      
      // Notify parent of the new entity
      onEntityCreated?.(mockNewEntity);
    } catch (error) {
      console.error('Error creating entity:', error);
    }
  };

  const handleNewEntityInputChange = (field: keyof Entity, value: string) => {
    setNewEntity({
      ...newEntity,
      [field]: value
    });
  };

  // // Add child entity handlers
  // const handleAddChild = () => {
  //   // This is now handled by the parent component
  // };

  const handleCancelAddChild = () => {
    setNewChild({});
    onCancelAddChild?.();
  };

  const handleSubmitAddChild = async () => {
    if (!entityKey) return;
    
    try {
      // TODO: Call API to create the new child entity
      console.log('Creating new child entity:', newChild);
      
      // For now, create a mock child entity with a generated key
      const mockNewChild: ChildEntity = {
        child_entity_key: `child_${Date.now()}`,
        child_entity_name: newChild.child_entity_name || 'New Child Entity',
        child_entity_property1: newChild.child_entity_property1 || '',
        entity_key: entityKey
      };
      
      // Reset form state
      setNewChild({});
      onCancelAddChild?.();
      
      // Notify parent of the new child entity
      onChildCreated?.(mockNewChild);
    } catch (error) {
      console.error('Error creating child entity:', error);
    }
  };

  const handleNewChildInputChange = (field: keyof ChildEntity, value: string) => {
    setNewChild({
      ...newChild,
      [field]: value
    });
  };

  // Helper to build collections array for child entity
  const childCollections = [
    {
      key: 'coll1',
      label: 'Collection One',
      icon: <Table className="w-4 h-4" />,
      data: childColl1List,
      emptyMessage: 'No data in Collection One for this child entity.'
    },
    {
      key: 'coll2',
      label: 'Collection Two',
      icon: <Settings className="w-4 h-4" />,
      data: childColl2List,
      emptyMessage: 'No data in Collection Two for this child entity.'
    }
  ];
  // Helper to build collections array for entity
  const entityCollections = [
    {
      key: 'coll1',
      label: 'Entity Collection',
      icon: <Database className="w-4 h-4" />,
      data: entityColl1List,
      emptyMessage: 'No data in Entity Collection for this entity.'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-accent-md m-4">
      {/* Content */}
              <div className="flex-1 overflow-y-auto">
        {!entityKey && !childKey && !isAddingEntity && !isAddingChild ? (
          <div className="text-center label">
            Select an entity or child to view details
          </div>
        ) : loading ? (
          <EntityDetailSkeleton />
        ) : isAddingEntity ? (
          <div>
            <Card className="rounded-t-xl rounded-b-none">
              <CardHeader className="border-b border-slate-200 bg-slate-200 rounded-t-xl px-4 py-3">
                <div className="flex items-center justify-center">
                  <h2 className="section-title text-slate-700">Add New Entity</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="label w-32">Entity Name:</label>
                    <input
                      type="text"
                      value={newEntity.entity_name || ''}
                      onChange={(e) => handleNewEntityInputChange('entity_name', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                      placeholder="Enter entity name"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="label w-32">Entity Property 1:</label>
                    <input
                      type="text"
                      value={newEntity.entity_property1 || ''}
                      onChange={(e) => handleNewEntityInputChange('entity_property1', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                      placeholder="Enter entity property"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handleCancelAddEntity}
                    className="px-4 py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitAddEntity}
                    className="px-4 py-2"
                  >
                    Create Entity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : isAddingChild ? (
          <div>
            <Card className="rounded-t-xl rounded-b-none">
              <CardHeader className="border-b border-slate-200 bg-slate-200 rounded-t-xl px-4 py-3">
                <div className="flex items-center justify-center">
                  <h2 className="section-title text-slate-700">Add New Child Entity to {entity?.entity_name || 'Entity'}</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="label w-32">Child Entity Name:</label>
                    <input
                      type="text"
                      value={newChild.child_entity_name || ''}
                      onChange={(e) => handleNewChildInputChange('child_entity_name', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                      placeholder="Enter child entity name"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="label w-32">Child Entity Property 1:</label>
                    <input
                      type="text"
                      value={newChild.child_entity_property1 || ''}
                      onChange={(e) => handleNewChildInputChange('child_entity_property1', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                      placeholder="Enter child entity property"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handleCancelAddChild}
                    className="px-4 py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitAddChild}
                    className="px-4 py-2"
                  >
                    Create Child Entity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : child ? (
          <>
            {/* Child entity detail card */}
            <Card className="rounded-t-xl rounded-b-none">
              <CardHeader className="border-b border-slate-200 bg-slate-200 rounded-t-xl px-4 py-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-500" />
                    <span className="section-title text-slate-700">{child.child_entity_name}</span>
                  </div>
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h2 className="section-title text-slate-700">Child Entity Detail</h2>
                  </div>
                  <div className="flex items-center gap-1">
                    {isEditingChild ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSaveChild}
                          className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          title="Save changes"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEdit}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditChild}
                          className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                          title="Edit child entity"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDeleteChild}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete child entity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="section-title mb-2">Properties</h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2">
                      <span className="label">Child Entity Key:</span>
                                              <span className="label">{child.child_entity_key}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="label">Child Entity Name:</span>
                      {isEditingChild ? (
                        <input
                          type="text"
                          value={editedChild?.child_entity_name || ''}
                          onChange={(e) => handleChildInputChange('child_entity_name', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                        />
                      ) : (
                        <span className="value">{child.child_entity_name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="label">Child Entity Property 1:</span>
                      {isEditingChild ? (
                        <input
                          type="text"
                          value={editedChild?.child_entity_property1 || ''}
                          onChange={(e) => handleChildInputChange('child_entity_property1', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                        />
                      ) : (
                        <span className="value">{child.child_entity_property1}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="label">Parent Entity Key:</span>
                      <span className="label">{child.entity_key}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabbed collections for child entity */}
            <div className="border border-accent rounded-2xl bg-white mt-4 shadow-accent">
              <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="flex w-full bg-transparent rounded-t-2xl">
                  {childCollections.map((coll) => (
                    <TabsTrigger
                      key={coll.key}
                      value={coll.key}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 border-b-2 border-b-indigo-200 data-[state=active]:border-b-indigo-500 data-[state=active]:text-indigo-700 data-[state=active]:bg-white focus:outline-none focus:ring-0 shadow-none ring-0 rounded-none"
                    >
                      {coll.icon} {coll.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {childCollections.map((coll) => (
                  <TabsContent key={coll.key} value={coll.key} className="pt-4 pb-4">
                    {Array.isArray(coll.data) && coll.data.length > 1 ? (
                      <TabTable
                        data={coll.data}
                        title={coll.label}
                        emptyMessage={coll.emptyMessage}
                        loading={collectionsLoading}
                      />
                    ) : (
                      <TabProperties
                        data={Array.isArray(coll.data) && coll.data.length === 1 ? coll.data[0] : {}}
                        title={coll.label}
                        emptyMessage={coll.emptyMessage}
                        loading={collectionsLoading}
                      />
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </>
        ) : entity && !isAddingEntity && !isAddingChild ? (
          <>
            {/* Parent entity detail */}
            <Card className="rounded-t-xl rounded-b-none">
              <CardHeader className="border-b border-slate-200 bg-slate-200 rounded-t-xl px-4 py-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-indigo-600" />
                    <span className="section-title text-slate-700">{entity.entity_name}</span>
                  </div>
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h2 className="section-title text-slate-700">Entity Detail</h2>
                  </div>
                  <div className="flex items-center gap-1">
                    {isEditingEntity ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSaveEntity}
                          className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          title="Save changes"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEditEntity}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditEntity}
                          className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                          title="Edit entity"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDeleteEntity}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete entity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="section-title mb-2">Properties</h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2">
                      <span className="label">Entity Key:</span>
                      <span className="label">{entity.entity_key}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="label">Entity Name:</span>
                      {isEditingEntity ? (
                        <input
                          type="text"
                          value={editedEntity?.entity_name || ''}
                          onChange={(e) => handleEntityInputChange('entity_name', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                        />
                      ) : (
                        <span className="value">{entity.entity_name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="label">Entity Property 1:</span>
                      {isEditingEntity ? (
                        <input
                          type="text"
                          value={editedEntity?.entity_property1 || ''}
                          onChange={(e) => handleEntityInputChange('entity_property1', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                        />
                      ) : (
                        <span className="value">{entity.entity_property1}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Entity collection tabbed section */}
            <div className="border border-accent rounded-2xl bg-white mt-4 shadow-accent">
              <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="flex w-full bg-transparent rounded-t-2xl">
                  {entityCollections.map((coll) => (
                    <TabsTrigger
                      key={coll.key}
                      value={coll.key}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 border-b-2 border-b-indigo-200 data-[state=active]:border-b-indigo-500 data-[state=active]:text-indigo-700 data-[state=active]:bg-white focus:outline-none focus:ring-0 shadow-none ring-0 rounded-none"
                    >
                      {coll.icon} {coll.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {entityCollections.map((coll) => (
                  <TabsContent key={coll.key} value={coll.key} className="pt-4 pb-4">
                    {Array.isArray(coll.data) && coll.data.length > 1 ? (
                      <TabTable
                        data={coll.data}
                        title={coll.label}
                        emptyMessage={coll.emptyMessage}
                        loading={collectionsLoading}
                      />
                    ) : (
                      <TabProperties
                        data={Array.isArray(coll.data) && coll.data.length === 1 ? coll.data[0] : {}}
                        title={coll.label}
                        emptyMessage={coll.emptyMessage}
                        loading={collectionsLoading}
                      />
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
} 