'use client';

import { 
  UIEntity
} from '@/model_defs';
import { EntityDetailPage } from './EntityDetailPage';
import { FormCard, FormField } from './FormCard';
import { useEntityOperations } from '@/hooks/useEntityOperations';

interface DetailViewProps {
  entityKey: string | null;
  childKey: string | null;
  isAddingEntity?: boolean;
  isAddingChild?: boolean;
  onCancelAddEntity?: () => void;
  onCancelAddChild?: () => void;
  onEntityCreated?: (entity: UIEntity) => void;
  onChildCreated?: (child: UIEntity) => void;
  onEntityUpdated?: (entity: UIEntity) => void;
  onChildUpdated?: (child: UIEntity) => void;
  onEntityDeleted?: (entityKey: string) => void;
  onChildDeleted?: (childKey: string) => void;
}

export function DetailView({
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
}: DetailViewProps) {
  const operations = useEntityOperations();

  // Handle entity creation
  const handleCreateEntity = async (data: Record<string, any>) => {
    // Build properties object from form data, excluding displayName
    const properties: { [key: string]: any } = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'entity_name' && value) {
        // Map form field names to actual property names
        if (key === 'entity_property1') {
          // For generic drugs, this typically maps to 'mech_of_action'
          properties['mech_of_action'] = value;
        } else {
          properties[key] = value;
        }
      }
    });

    const unifiedEntity = await operations.createEntity({
      displayName: data.entity_name || '',
      properties: Object.keys(properties).length > 0 ? properties : undefined
    });
    onEntityCreated?.(unifiedEntity);
  };

  // Handle child creation  
  const handleCreateChild = async (data: Record<string, any>) => {
    if (!entityKey) {
      throw new Error('Entity key is required to create a child entity');
    }
    
    // Build properties object from form data, excluding displayName and parent_entity_key
    const properties: { [key: string]: any } = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'child_entity_name' && value) {
        // Map form field names to actual property names
        if (key === 'child_entity_property1') {
          // For manu drugs, this typically maps to 'manufacturer'
          properties['manufacturer'] = value;
        } else {
          properties[key] = value;
        }
      }
    });

    const unifiedChild = await operations.createChild({
      parent_entity_key: entityKey, // Link to parent entity
      displayName: data.child_entity_name || '',
      properties: Object.keys(properties).length > 0 ? properties : undefined
    });
    onChildCreated?.(unifiedChild);
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