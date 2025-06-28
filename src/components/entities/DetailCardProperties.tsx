'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, X, Check, Trash2 } from 'lucide-react';
import { UIEntity, UIProperty } from '@/types';

export interface DetailField {
  key: string;
  label: string;
  value: any;
  editable?: boolean;
  type?: 'text' | 'number' | 'email' | 'readonly';
}

interface DetailCardPropertiesProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  entity: UIEntity;
  onUpdate?: (entity: UIEntity, updatedProperties: UIProperty[]) => Promise<void>;
  onDelete?: (entity: UIEntity) => Promise<void>;
  className?: string;
  showActions?: boolean;
}

export function DetailCardProperties({ 
  title, 
  subtitle, 
  icon, 
  entity,
  onUpdate, 
  onDelete, 
  className = "rounded-t-xl rounded-b-none",
  showActions = true
}: DetailCardPropertiesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperties, setEditedProperties] = useState<UIProperty[]>([]);

  // Use entity name as title if not provided
  const displayTitle = title || entity.display_name;

  // Filter visible properties for display
  const visibleProperties = entity.properties.filter((prop: UIProperty) => prop.is_visible);

  const handleEdit = () => {
    setIsEditing(true);
    // Initialize edited properties with current property values
    setEditedProperties([...entity.properties]);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProperties([]);
  };

  const handleSave = async () => {
    try {
      if (onUpdate) {
        await onUpdate(entity, editedProperties);
      }
      setIsEditing(false);
      setEditedProperties([]);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete(entity);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handlePropertyChange = (propertyName: string, value: any) => {
    setEditedProperties((prev: UIProperty[]) => 
      prev.map(prop => 
        prop.property_name === propertyName 
          ? { ...prop, property_value: value }
          : prop
      )
    );
  };

  const renderProperty = (property: UIProperty) => {
    const currentProperty = isEditing 
      ? editedProperties.find(p => p.property_name === property.property_name) || property
      : property;
    
    return (
      <div key={property.property_name} className="flex items-center gap-2">
        <span className="label min-w-32">{property.property_name}:</span>
        <div className="flex-1">
          {isEditing && property.is_editable ? (
            <input
              type="text"
              value={currentProperty.property_value || ''}
              onChange={(e) => handlePropertyChange(property.property_name, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
            />
          ) : (
            <span className={!property.is_editable ? 'label' : 'value'}>
              {currentProperty.property_value || ''}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="border-b border-slate-200 bg-slate-200 rounded-t-xl px-4 py-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="section-title text-slate-700">{displayTitle}</span>
          </div>
          {subtitle && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h2 className="section-title text-slate-700">{subtitle}</h2>
            </div>
          )}
          {showActions && (
            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    title="Save changes"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
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
                    onClick={handleEdit}
                    className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="section-title mb-2">Properties</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {visibleProperties.map(renderProperty)}
          </div>
        </div>
        
        {entity.sub_collections.length > 0 && (
          <div>
            <h4 className="section-title mb-2">Collections</h4>
            <div className="text-sm text-gray-600">
              {entity.sub_collections
                .sort((a, b) => a.ordinal - b.ordinal)
                .map(collection => collection.display_name)
                .join(', ')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 