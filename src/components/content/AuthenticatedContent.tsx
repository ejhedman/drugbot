'use client';

import { useState } from 'react';
import { EntityTreeList } from '@/components/entities/EntityTreeList';
import { DetailViewRefactored } from '@/components/entities/DetailViewRefactored';
import { getBorderClasses } from '@/lib/borderUtils';

export function AuthenticatedContent() {
  const [selectedEntityKey, setSelectedEntityKey] = useState<string | null>(null);
  const [selectedChildKey, setSelectedChildKey] = useState<string | null>(null);
  const [isAddingEntity, setIsAddingEntity] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);

  const handleEntitySelect = (entityKey: string) => {
    setSelectedEntityKey(entityKey);
    setSelectedChildKey(null); // Clear child selection when entity changes
    setIsAddingEntity(false);
    setIsAddingChild(false);
  };

  const handleChildSelect = (childKey: string) => {
    setSelectedChildKey(childKey);
    setIsAddingEntity(false);
    setIsAddingChild(false);
  };

  const handleAddEntity = () => {
    setIsAddingEntity(true);
    setIsAddingChild(false);
    setSelectedEntityKey(null);
    setSelectedChildKey(null);
  };

  const handleAddChild = (entityKey: string) => {
    setSelectedEntityKey(entityKey); // Ensure the parent entity is selected
    setIsAddingChild(true);
    setIsAddingEntity(false);
    setSelectedChildKey(null);
  };

  const handleCancelAddEntity = () => {
    setIsAddingEntity(false);
  };

  const handleCancelAddChild = () => {
    setIsAddingChild(false);
  };

  const handleEntityCreated = (newEntity: any) => {
    setIsAddingEntity(false);
    // TODO: Navigate to the newly created entity
    console.log('New entity created:', newEntity);
  };

  const handleChildCreated = (newChild: any) => {
    setIsAddingChild(false);
    // TODO: Navigate to the newly created child entity
    console.log('New child entity created:', newChild);
  };

  return (
    <div className={getBorderClasses("flex flex-col flex-1 min-h-0 bg-gray-50", "border-4 border-purple-500")}>
      <div className="flex-1 min-h-0 grid grid-cols-12">
        {/* Column 1: Entity Tree List */}
        <div className={getBorderClasses("col-span-3 h-full min-h-0 flex flex-col", "border-2 border-accent-active shadow-accent-md")}>
          <EntityTreeList
            selectedEntityKey={selectedEntityKey}
            selectedChildKey={selectedChildKey}
            onEntitySelect={handleEntitySelect}
            onChildSelect={handleChildSelect}
            onAddEntity={handleAddEntity}
            onAddChild={handleAddChild}
          />
        </div>

        {/* Column 2: Detail View */}
        <div className={getBorderClasses("col-span-9 h-full min-h-0 flex flex-col", "border-4 border-yellow-500")}>
          <DetailViewRefactored
            entityKey={selectedEntityKey}
            childKey={selectedChildKey}
            isAddingEntity={isAddingEntity}
            isAddingChild={isAddingChild}
            onCancelAddEntity={handleCancelAddEntity}
            onCancelAddChild={handleCancelAddChild}
            onEntityCreated={handleEntityCreated}
            onChildCreated={handleChildCreated}
          />
        </div>
      </div>
    </div>
  );
} 