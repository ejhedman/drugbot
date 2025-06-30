'use client';

import { 
  UIEntity
} from '@/model_defs';
import { EntityDetailPage } from './EntityDetailPage';
import { FormCard, FormField } from './FormCard';
import { useEntityOperations } from '@/hooks/useEntityOperations';
import { theUIModel } from '@/model_instances/TheUIModel';

interface DetailViewProps {
  entityUid: string | null;
  childUid: string | null;
  isAddingEntity?: boolean;
  isAddingChild?: boolean;
  onCancelAddEntity?: () => void;
  onCancelAddChild?: () => void;
  onEntityCreated?: (entity: UIEntity) => void;
  onChildCreated?: (child: UIEntity) => void;
  onEntityUpdated?: (entity: UIEntity) => void;
  onChildUpdated?: (child: UIEntity) => void;
  onEntityDeleted?: (entityUid: string) => void;
  onChildDeleted?: (childUid: string) => void;
}

export function DetailView({
  entityUid,
  childUid,
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
      if (key !== 'displayName' && value) {
        // Use the actual property names from the form (no mapping needed)
        properties[key] = value;
      }
    });

    const unifiedEntity = await operations.createEntity({
      displayName: data.displayName || '',
      properties: Object.keys(properties).length > 0 ? properties : undefined
    });
    onEntityCreated?.(unifiedEntity);
  };

  // Handle child creation  
  const handleCreateChild = async (data: Record<string, any>) => {
    if (!entityUid) {
      throw new Error('Entity key is required to create a child entity');
    }
    
    // Build properties object from form data, excluding displayName
    const properties: { [key: string]: any } = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'displayName' && value) {
        // Use the actual property names from the form (no mapping needed)
        properties[key] = value;
      }
    });

    const unifiedChild = await operations.createChild({
      parent_entity_uid: entityUid, // Link to parent entity
      displayName: data.displayName || '',
      properties: Object.keys(properties).length > 0 ? properties : undefined
    });
    onChildCreated?.(unifiedChild);
  };

  // Generate form fields dynamically from schema
  const generateFormFields = (entityType: string): FormField[] => {
    const fields: FormField[] = [
      {
        key: 'displayName',
        label: 'Display Name',
        type: 'text',
        required: true,
        placeholder: 'Enter display name',
      }
    ];

    const editableProperties = theUIModel.getEntityEditableProperties(entityType);
    editableProperties.forEach(prop => {
      fields.push({
        key: prop.propertyName,
        label: prop.displayName || prop.propertyName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type: prop.controlType === 'number' ? 'number' : 'text', // Map all types to supported FormField types
        required: prop.isRequired,
        placeholder: prop.placeholder || `Enter ${prop.displayName || prop.propertyName}`,
      });
    });

    return fields;
  };

  // Entity form fields configuration - dynamically generated
  const entityFormFields: FormField[] = generateFormFields('GenericDrugs');

  // Child entity form fields configuration - dynamically generated  
  const childFormFields: FormField[] = generateFormFields('ManuDrugs');

  return (
    <div className="h-full flex flex-col bg-white rounded-xl">
      <div className="flex-1 min-h-0 overflow-hidden">
        {!entityUid && !childUid && !isAddingEntity && !isAddingChild ? (
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
            title={`Add New Child Entity to ${entityUid || 'Entity'}`}
            fields={childFormFields}
            onSubmit={handleCreateChild}
            onCancel={onCancelAddChild || (() => {})}
            submitLabel="Create Child Entity"
            loading={operations.loading}
          />
        ) : (
          <EntityDetailPage
            entityUid={entityUid}
            childUid={childUid}
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