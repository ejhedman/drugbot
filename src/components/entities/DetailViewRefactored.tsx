'use client';

import { Entity, ChildEntity } from '@/types';
import { EntityDetailPage } from './EntityDetailPage';
import { FormCard, FormField } from './FormCard';
import { useEntityOperations } from '@/hooks/useEntityOperations';

interface DetailViewRefactoredProps {
  entityKey: string | null;
  childKey: string | null;
  isAddingEntity?: boolean;
  isAddingChild?: boolean;
  onCancelAddEntity?: () => void;
  onCancelAddChild?: () => void;
  onEntityCreated?: (entity: Entity) => void;
  onChildCreated?: (child: ChildEntity) => void;
  onEntityUpdated?: (entity: Entity) => void;
  onChildUpdated?: (child: ChildEntity) => void;
  onEntityDeleted?: (entityKey: string) => void;
  onChildDeleted?: (childKey: string) => void;
}

export function DetailViewRefactored({
  entityKey,
  childKey,
  isAddingEntity = false,
  isAddingChild = false,
  onCancelAddEntity,
  onCancelAddChild,
  onEntityCreated,
  onChildCreated,
  onEntityUpdated,
  onChildUpdated,
  onEntityDeleted,
  onChildDeleted,
}: DetailViewRefactoredProps) {
  const operations = useEntityOperations();

  // Handle entity creation
  const handleCreateEntity = async (data: Record<string, any>) => {
    const newEntity = await operations.createEntity(data);
    onEntityCreated?.(newEntity);
  };

  // Handle child creation  
  const handleCreateChild = async (data: Record<string, any>) => {
    const newChild = await operations.createChild({
      ...data,
      entity_key: entityKey || undefined, // Link to parent entity
    });
    onChildCreated?.(newChild);
  };

  // Entity form fields configuration
  const entityFormFields: FormField[] = [
    {
      key: 'entity_name',
      label: 'Entity Name',
      type: 'text',
      required: true,
      placeholder: 'Enter entity name',
    },
    {
      key: 'entity_property1',
      label: 'Entity Property 1',
      type: 'text',
      placeholder: 'Enter entity property',
    },
  ];

  // Child entity form fields configuration
  const childFormFields: FormField[] = [
    {
      key: 'child_entity_name',
      label: 'Child Entity Name',
      type: 'text',
      required: true,
      placeholder: 'Enter child entity name',
    },
    {
      key: 'child_entity_property1',
      label: 'Child Entity Property 1',
      type: 'text',
      placeholder: 'Enter child entity property',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-accent-md m-4">
      <div className="flex-1 min-h-0">
        {!entityKey && !childKey && !isAddingEntity && !isAddingChild ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center label">
              Select an entity or child to view details
            </div>
          </div>
        ) : isAddingEntity ? (
          <FormCard
            title="Add New Entity"
            fields={entityFormFields}
            onSubmit={handleCreateEntity}
            onCancel={onCancelAddEntity || (() => {})}
            submitLabel="Create Entity"
            loading={operations.loading}
          />
        ) : isAddingChild ? (
          <FormCard
            title={`Add New Child Entity to ${entityKey || 'Entity'}`}
            fields={childFormFields}
            onSubmit={handleCreateChild}
            onCancel={onCancelAddChild || (() => {})}
            submitLabel="Create Child Entity"
            loading={operations.loading}
          />
        ) : (
          <EntityDetailPage
            entityKey={entityKey}
            childKey={childKey}
            onEntityUpdated={onEntityUpdated}
            onChildUpdated={onChildUpdated}
            onEntityDeleted={onEntityDeleted}
            onChildDeleted={onChildDeleted}
          />
        )}
      </div>
    </div>
  );
} 