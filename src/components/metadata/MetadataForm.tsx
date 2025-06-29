'use client';

import React from 'react';
import { UIProperty } from '@/model_defs/UIModel';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MetadataFormProps {
  entityName: string;
  fields: UIProperty[];
  data?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  title?: string;
  submitLabel?: string;
  isLoading?: boolean;
}

export function MetadataForm({
  entityName,
  fields,
  data = {},
  onSubmit,
  onCancel,
  title,
  submitLabel = 'Save',
  isLoading = false
}: MetadataFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: data
  });

  const getErrorMessage = (fieldName: string): string | undefined => {
    const error = errors[fieldName];
    if (error && typeof error.message === 'string') {
      return error.message;
    }
    return undefined;
  };

  const renderField = (field: UIProperty) => {
    
    const fieldValue = watch(field.property_name);
    
    if (field.visibility === 'hidden') {
      return null;
    }

    const fieldId = `${entityName}-${field.property_name}`;
    const isReadonly = field.visibility === 'readonly';
    const isRequired = field.isRequired;
    const errorMessage = getErrorMessage(field.property_name);

    const commonProps = {
      id: fieldId,
      disabled: isReadonly || isLoading,
      ...register(field.property_name, {
        required: isRequired ? `${field.displayName} is required` : false,
        pattern: field.validation?.pattern ? {
          value: new RegExp(field.validation.pattern),
          message: `${field.displayName} format is invalid`
        } : undefined
      })
    };

    switch (field.controlType) {
      case 'textarea':
        return (
          <div key={field.property_name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.displayName}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              {...commonProps}
              placeholder={field.placeholder}
              rows={3}
            />
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.property_name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.displayName}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={fieldValue || ''}
              onValueChange={(value) => setValue(field.property_name, value)}
              disabled={isReadonly || isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.enumValues?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.property_name} className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...commonProps}
                checked={!!fieldValue}
                className="rounded border-gray-300"
              />
              <Label htmlFor={fieldId}>
                {field.displayName}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.property_name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.displayName}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="date"
              placeholder={field.placeholder}
            />
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.property_name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.displayName}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="number"
              placeholder={field.placeholder}
              min={field.validation?.min}
              max={field.validation?.max}
            />
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        );

      case 'text':
      default:
        return (
          <div key={field.property_name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.displayName}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="text"
              placeholder={field.placeholder}
            />
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        );
    }
  };

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {fields.filter(f => f.visibility !== 'hidden').map(renderField)}
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : submitLabel}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 