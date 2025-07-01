'use client';

import { 
  UIEntity
} from '@/model_defs';
import { EntityDetailPage } from './EntityDetailPage';
import { FormCard, FormField } from './FormCard';
import { useEntityOperations } from '@/hooks/useEntityOperations';
import { theUIModel } from '@/model_instances/TheUIModel';
import { getEntityTableName, getEntityKeyField } from '@/model_instances/TheModelMap';

interface DetailViewProps {
  entityUid: string | null;
  childUid: string | null;
  entityType?: string; // Entity type for creating entities (e.g., 'GenericDrugs')
  childType?: string; // Entity type for creating children (e.g., 'ManuDrugs')
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
  entityType = 'GenericDrugs',
  childType = 'ManuDrugs',
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
    // Get table and key from model
    const table = getEntityTableName(entityType);
    const key = getEntityKeyField(entityType);
    
    if (!table) {
      throw new Error(`No table found for entity type: ${entityType}`);
    }
    
    // Build properties object from form data, excluding displayName
    const properties: { [key: string]: any } = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'displayName' && value) {
        // Use the actual property names from the form (no mapping needed)
        properties[key] = value;
      }
    });

    const unifiedEntity = await operations.createEntity({
      table,
      properties
    });
    onEntityCreated?.(unifiedEntity);
  };

  // Handle child creation  
  const handleCreateChild = async (data: Record<string, any>) => {
    if (!entityUid) {
      throw new Error('Entity key is required to create a child entity');
    }
    
    // Get table and key from model
    const table = getEntityTableName(childType);
    const key = getEntityKeyField(childType);
    
    if (!table) {
      throw new Error(`No table found for entity type: ${childType}`);
    }
    
    // Build properties object from form data, excluding displayName
    const properties: { [key: string]: any } = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'displayName' && value) {
        // Use the actual property names from the form (no mapping needed)
        properties[key] = value;
      }
    });

    // Add parent reference
    properties.generic_uid = entityUid;

    const unifiedChild = await operations.createChild({
      table,
      properties
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
  const entityFormFields: FormField[] = generateFormFields(entityType);
  const entityPropertyDefs = theUIModel.getEntity(entityType)?.propertyDefs || [];

  // Child entity form fields configuration - dynamically generated  
  const childFormFields: FormField[] = generateFormFields(childType);
  const childPropertyDefs = theUIModel.getEntity(childType)?.propertyDefs || [];

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
            propertyDefs={entityPropertyDefs}
          />
        ) : isAddingChild ? (
          <FormCard
            title={`Add New Child Entity to ${entityUid || 'Entity'}`}
            fields={childFormFields}
            onSubmit={handleCreateChild}
            onCancel={onCancelAddChild || (() => {})}
            submitLabel="Create Child Entity"
            loading={operations.loading}
            propertyDefs={childPropertyDefs}
          />
        ) : (
          <EntityDetailPage
            entityUid={entityUid}
            childUid={childUid}
            entityType={entityType}
            childType={childType}
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