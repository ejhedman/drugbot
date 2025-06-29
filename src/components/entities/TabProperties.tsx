'use client';

import { useState } from 'react';
import { Edit, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabContentSkeleton } from '@/components/ui/skeleton';
import { MetadataRepository } from '@/model_instances/metadata-repository';
import { ENTITY_AGGREGATES } from '@/model_instances/theuimodel';
import { UIProperty } from '@/model_defs/UIModel';

interface TabPropertiesProps {
  data: Record<string, any>;
  title?: string;
  icon?: React.ReactNode;
  emptyMessage?: string;
  loading?: boolean;
  onUpdate?: (index: number, data: any) => Promise<void>;
  schemaEntityName?: string; // Optional schema entity name for metadata lookup
}

export function TabProperties({ data, title, emptyMessage, loading = false, onUpdate, schemaEntityName }: TabPropertiesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  
  const metadataRepo = new MetadataRepository();
  
  // Get display name for a field using schema metadata
  const getFieldDisplayName = (fieldName: string): string => {
    if (!schemaEntityName) {
      // Fallback to formatting the field name
      return fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    // First try to find in main entity schemas
    let schema = metadataRepo.getEntitySchema(schemaEntityName);
    
    // If not found in main schemas, try sub-collections
    if (!schema) {
      schema = ENTITY_AGGREGATES[schemaEntityName];
    }
    
    if (!schema) {
      return fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    const field = (schema.properties || []).find((f: UIProperty) => (f as any).name === fieldName || f.propertyName === fieldName);
    return field?.displayName || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
    try {
      if (onUpdate) {
        await onUpdate(0, editedData);
      }
      setIsEditing(false);
      setEditedData({});
    } catch (error) {
      console.error('Error updating properties:', error);
    }
  };

  const handleInputChange = (key: string, value: string) => {
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

  const properties = Object.entries(data);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-200 pb-2 px-4 py-3 rounded-t-lg">
        {title && (
                      <div className="section-title text-white">
              {title}
            </div>
        )}
        <div className="flex items-center gap-1">
          {isEditing ? (
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
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-4">
        {properties.map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="label font-medium min-w-32">{getFieldDisplayName(key)}:</span>
            <div className="flex-1">
              {isEditing ? (
                key.endsWith('_key') || key.endsWith('_uid') || key === 'uid' ? (
                  <span className="label">{value}</span>
                ) : (
                  <input
                    type="text"
                    value={editedData[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                  />
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