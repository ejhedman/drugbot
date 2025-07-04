'use client';

import { useState } from 'react';
import { Edit, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabContentSkeleton } from '@/components/ui/skeleton';
import { theUIModel, ENTITY_AGGREGATES } from '@/model_instances';
import { UIProperty } from '@/model_defs/UIModel';

interface TabPropertiesProps {
  data: Record<string, any>;
  title?: string;
  icon?: React.ReactNode;
  emptyMessage?: string;
  loading?: boolean;
  onUpdate?: (index: number, data: any) => Promise<void>;
  schemaEntityName?: string; // Optional schema entity name for metadata lookup
  canEdit?: boolean; // Whether edit controls should be shown
}

export function TabProperties({ data, title, emptyMessage, loading = false, onUpdate, schemaEntityName, canEdit = true }: TabPropertiesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  
  // Get display name for a field using schema metadata
  const getFieldDisplayName = (fieldName: string): string => {
    if (!schemaEntityName) {
      // Fallback to formatting the field name
      return fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    // First try to find in main entity schemas
    let schema = theUIModel.getEntity(schemaEntityName);
    
    // If not found in main schemas, try sub-collections
    if (!schema) {
      schema = ENTITY_AGGREGATES[schemaEntityName];
    }
    
    if (!schema) {
      return fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    const field = (schema.propertyDefs || []).find((f: UIProperty) => f.propertyName === fieldName);
    return field?.displayName || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Check if a field is editable using schema metadata
  const isFieldEditable = (fieldName: string): boolean => {
    if (!schemaEntityName) {
      // If no schema name provided, assume editable unless it's a key/id field
      return !fieldName.endsWith('_key') && !fieldName.endsWith('_uid') && fieldName !== 'uid';
    }
    
    // First try to find in main entity schemas
    let schema = theUIModel.getEntity(schemaEntityName);
    
    // If not found in main schemas, try sub-collections
    if (!schema) {
      schema = ENTITY_AGGREGATES[schemaEntityName];
    }
    
    if (!schema || !schema.propertyDefs) {
      // If no schema found, assume editable unless it's a key/id field
      return !fieldName.endsWith('_key') && !fieldName.endsWith('_uid') && fieldName !== 'uid';
    }
    
    // Check editability based on schema
    const propertyDef = schema.propertyDefs.find((f: UIProperty) => f.propertyName === fieldName);
    return propertyDef ? propertyDef.isEditable : true; // Assume editable if no definition found
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...data });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const handleSave = async () => {
    // Validate all fields before saving
    let hasError = false;
    const errors: Record<string, boolean> = {};
    const fields = Object.keys(editedData);
    fields.forEach((field) => {
      if (!validateField(field, editedData[field])) {
        errors[field] = true;
        hasError = true;
      }
    });
    setValidationErrors(errors);
    if (hasError) return;

    try {
      if (onUpdate) {
        await onUpdate(0, editedData);
      }
      setIsEditing(false);
      setEditedData({});
      setValidationErrors({});
    } catch (error) {
      console.error('Error updating properties:', error);
    }
  };

  // Helper to get controlType for a property
  const getControlType = (fieldName: string): string => {
    if (!schemaEntityName) return 'text';
    let schema = theUIModel.getEntity(schemaEntityName) || ENTITY_AGGREGATES[schemaEntityName];
    if (!schema) return 'text';
    const field = (schema.propertyDefs || []).find((f: UIProperty) => f.propertyName === fieldName);
    return field?.controlType || 'text';
  };

  // Helper to get select values
  const getSelectValues = (fieldName: string): string[] => {
    if (!schemaEntityName) return ['no values defined'];
    let schema = theUIModel.getEntity(schemaEntityName) || ENTITY_AGGREGATES[schemaEntityName];
    if (!schema) return ['no values defined'];
    const field = (schema.propertyDefs || []).find((f: UIProperty) => f.propertyName === fieldName);
    return field?.selectValues || ['no values defined'];
  };

  // Validation logic
  const validateField = (fieldName: string, value: any): boolean => {
    const controlType = getControlType(fieldName);
    if (controlType === 'number' || controlType === 'numeric') {
      return value === '' || !isNaN(Number(value));
    }
    if (controlType === 'select') {
      return getSelectValues(fieldName).includes(value);
    }
    return true;
  };

  // Render appropriate control based on controlType
  const renderEditControl = (fieldName: string, value: any, onChange: (value: any) => void) => {
    const controlType = getControlType(fieldName);
    const hasError = validationErrors[fieldName];
    const baseClasses = `w-full px-4 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded-xl text-sm focus-accent`;

    switch (controlType) {
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        );
      
      case 'select':
        const selectValues = getSelectValues(fieldName);
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => {
              if (!validateField(fieldName, e.target.value)) {
                setValidationErrors((prev) => ({
                  ...prev,
                  [fieldName]: true
                }));
              } else {
                setValidationErrors((prev) => ({
                  ...prev,
                  [fieldName]: false
                }));
              }
            }}
            className={baseClasses}
          >
            <option value="">Select...</option>
            {selectValues.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'number':
      case 'numeric':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => {
              if (!validateField(fieldName, e.target.value)) {
                setValidationErrors((prev) => ({
                  ...prev,
                  [fieldName]: true
                }));
              } else {
                setValidationErrors((prev) => ({
                  ...prev,
                  [fieldName]: false
                }));
              }
            }}
            className={baseClasses}
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
          />
        );
      
      default: // text, textarea, etc.
        return (
          <input
            type="text"
            value={value?.toString() || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
          />
        );
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return <TabContentSkeleton />;
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        {emptyMessage}
      </div>
    );
  }

  // Filter properties based on visibility from schema metadata
  const getVisibleProperties = (data: Record<string, any>): [string, any][] => {
    if (!schemaEntityName) {
      // If no schema name provided, show all properties
      return Object.entries(data);
    }
    
    // First try to find in main entity schemas
    let schema = theUIModel.getEntity(schemaEntityName);
    
    // If not found in main schemas, try sub-collections
    if (!schema) {
      schema = ENTITY_AGGREGATES[schemaEntityName];
    }
    
    if (!schema || !schema.propertyDefs) {
      // If no schema found, show all properties
      return Object.entries(data);
    }
    
    // Filter properties based on isVisible flag in schema
    return Object.entries(data).filter(([key, value]) => {
      const propertyDef = schema.propertyDefs?.find((f: UIProperty) => f.propertyName === key);
      return propertyDef ? propertyDef.isVisible : true; // Show if no definition found
    });
  };

  const properties = getVisibleProperties(data);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-200 pb-2 px-4 py-3 rounded-t-lg">
        {title && (
                      <div className="section-title text-white">
              {title}
            </div>
        )}
        <div className="flex items-center gap-1">
          {canEdit && (isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl"
                title="Save changes"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-xl"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl"
                title="Edit properties"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-4">
        {properties.map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="label font-medium min-w-32">{getFieldDisplayName(key)}:</span>
            <div className="flex-1">
              {isEditing ? (
                isFieldEditable(key) ? (
                  renderEditControl(
                    key,
                    editedData[key],
                    (value) => handleInputChange(key, value)
                  )
                ) : (
                  <span className="text-gray-500 italic">{value}</span>
                )
              ) : (
                <span className="value">{value}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 