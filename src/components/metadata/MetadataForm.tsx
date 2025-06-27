'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EntityField } from '@/lib/schema';

interface MetadataFormProps {
  entityName: string;
  fields: EntityField[];
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

  const renderField = (field: EntityField) => {
    const fieldValue = watch(field.name);
    
    if (field.ui.visibility === 'hidden') {
      return null;
    }

    const fieldId = `${entityName}-${field.name}`;
    const isReadonly = field.ui.visibility === 'readonly';
    const isRequired = field.isRequired;
    const errorMessage = getErrorMessage(field.name);

    const commonProps = {
      id: fieldId,
      disabled: isReadonly || isLoading,
      ...register(field.name, {
        required: isRequired ? `${field.ui.displayName} is required` : false,
        pattern: field.ui.validation?.pattern ? {
          value: new RegExp(field.ui.validation.pattern),
          message: `${field.ui.displayName} format is invalid`
        } : undefined
      })
    };

    switch (field.ui.controlType) {
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.ui.displayName}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              {...commonProps}
              placeholder={field.ui.placeholder}
              rows={3}
            />
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.ui.displayName}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={fieldValue || ''}
              onValueChange={(value) => setValue(field.name, value)}
              disabled={isReadonly || isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.ui.placeholder} />
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
          <div key={field.name} className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...commonProps}
                checked={!!fieldValue}
                className="rounded border-gray-300"
              />
              <Label htmlFor={fieldId}>
                {field.ui.displayName}
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
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.ui.displayName}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="date"
              placeholder={field.ui.placeholder}
            />
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.ui.displayName}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="number"
              placeholder={field.ui.placeholder}
              min={field.ui.validation?.min}
              max={field.ui.validation?.max}
            />
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        );

      case 'text':
      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.ui.displayName}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="text"
              placeholder={field.ui.placeholder}
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
          {fields.filter(f => f.ui.visibility !== 'hidden').map(renderField)}
          
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