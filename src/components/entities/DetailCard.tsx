'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, X, Check, Trash2 } from 'lucide-react';

export interface DetailField {
  key: string;
  label: string;
  value: any;
  editable?: boolean;
  type?: 'text' | 'number' | 'email' | 'readonly';
}

interface DetailCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  fields: DetailField[];
  onUpdate?: (updatedData: Record<string, any>) => Promise<void>;
  onDelete?: () => Promise<void>;
  className?: string;
  showActions?: boolean;
}

export function DetailCard({ 
  title, 
  subtitle, 
  icon, 
  fields, 
  onUpdate, 
  onDelete, 
  className = "rounded-t-xl rounded-b-none",
  showActions = true
}: DetailCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Record<string, any>>({});

  const handleEdit = () => {
    setIsEditing(true);
    // Initialize edited data with current field values
    const initialData = fields.reduce((acc, field) => {
      acc[field.key] = field.value;
      return acc;
    }, {} as Record<string, any>);
    setEditedData(initialData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const handleSave = async () => {
    try {
      if (onUpdate) {
        await onUpdate(editedData);
      }
      setIsEditing(false);
      setEditedData({});
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete();
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const renderField = (field: DetailField) => {
    const isFieldEditable = field.editable !== false && field.type !== 'readonly';
    
    return (
      <div key={field.key} className="flex items-center gap-2">
        <span className="label min-w-32">{field.label}:</span>
        <div className="flex-1">
          {isEditing && isFieldEditable ? (
            <input
              type={field.type || 'text'}
              value={editedData[field.key] || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
            />
          ) : (
            <span className={field.type === 'readonly' ? 'label' : 'value'}>
              {field.value || ''}
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
            <span className="section-title text-slate-700">{title}</span>
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
            {fields.map(renderField)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 