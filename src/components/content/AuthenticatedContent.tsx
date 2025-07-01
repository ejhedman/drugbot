'use client';

import { useState } from 'react';
import { EntityTreeList } from '@/components/entities/EntityTreeList';
import { DetailView } from '@/components/entities/DetailView';
import { getBorderClasses } from '@/lib/borderUtils';

export function AuthenticatedContent() {
  const [selectedEntityUid, setSelectedEntityUid] = useState<string | null>(null);
  const [selectedChildUid, setSelectedChildUid] = useState<string | null>(null);
  const [isAddingEntity, setIsAddingEntity] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEntitySelect = (entityUid: string) => {
    setSelectedEntityUid(entityUid);
    setSelectedChildUid(null); // Clear child selection when entity changes
    setIsAddingEntity(false);
    setIsAddingChild(false);
  };

  const handleChildSelect = (childUid: string) => {
    setSelectedChildUid(childUid);
    setIsAddingEntity(false);
    setIsAddingChild(false);
  };

  const handleAddEntity = () => {
    setIsAddingEntity(true);
    setIsAddingChild(false);
    setSelectedEntityUid(null);
    setSelectedChildUid(null);
  };

  const handleAddChild = (entityUid: string) => {
    setSelectedEntityUid(entityUid); // Ensure the parent entity is selected
    setIsAddingChild(true);
    setIsAddingEntity(false);
    setSelectedChildUid(null);
  };

  const handleCancelAddEntity = () => {
    setIsAddingEntity(false);
  };

  const handleCancelAddChild = () => {
    setIsAddingChild(false);
  };

  const handleEntityCreated = (newEntity: any) => {
    setIsAddingEntity(false);
    // Refresh the tree view after creating an entity
    setRefreshTrigger(prev => prev + 1);
    // TODO: Navigate to the newly created entity
    console.log('New entity created:', newEntity);
  };

  const handleChildCreated = (newChild: any) => {
    setIsAddingChild(false);
    // Refresh the tree view after creating a child entity
    setRefreshTrigger(prev => prev + 1);
    // TODO: Navigate to the newly created child entity
    console.log('New child entity created:', newChild);
  };

  const handleEntityDeleted = (entityUid: string) => {
    // Refresh the tree view after deleting an entity
    setRefreshTrigger(prev => prev + 1);
    // Clear selection if the deleted entity was selected
    if (selectedEntityUid === entityUid) {
      setSelectedEntityUid(null);
      setSelectedChildUid(null);
    }
  };

  const handleChildDeleted = (childUid: string) => {
    // Refresh the tree view after deleting a child entity
    setRefreshTrigger(prev => prev + 1);
    // Clear selection if the deleted child was selected
    if (selectedChildUid === childUid) {
      setSelectedChildUid(null);
    }
  };

  return (
    <div className={getBorderClasses("flex flex-col flex-1 min-h-0 bg-gray-50", "border-6 border-purple-500")}>
      <div className="flex-1 min-h-0 grid grid-cols-12 overflow-hidden">
        {/* Column 1: Tree List */}
        <div className={getBorderClasses("col-span-3 h-full min-h-0 flex flex-col overflow-hidden", "border-6 border-blue-500")}>
                  <EntityTreeList
          selectedEntityUid={selectedEntityUid}
          selectedChildUid={selectedChildUid}
          onEntitySelect={handleEntitySelect}
          onChildSelect={handleChildSelect}
          onAddEntity={handleAddEntity}
          onAddChild={handleAddChild}
          refreshTrigger={refreshTrigger}
        />
        </div>

        {/* Column 2: Detail View */}
        <div className={getBorderClasses("col-span-9 h-full min-h-0 flex flex-col overflow-hidden", "border-6 border-yellow-500")}>
                  <DetailView
          entityUid={selectedEntityUid}
          childUid={selectedChildUid}
          entityType="GenericDrugs"
          childType="ManuDrugs"
          isAddingEntity={isAddingEntity}
          isAddingChild={isAddingChild}
          onCancelAddEntity={handleCancelAddEntity}
          onCancelAddChild={handleCancelAddChild}
          onEntityCreated={handleEntityCreated}
          onChildCreated={handleChildCreated}
          onEntityDeleted={handleEntityDeleted}
          onChildDeleted={handleChildDeleted}
        />
        </div>
      </div>
    </div>
  );
} 