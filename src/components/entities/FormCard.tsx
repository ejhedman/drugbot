'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UIPropertyMeta } from '@/model_defs/UIModel';

export interface FormField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'numeric' | 'email' | 'date' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
}

interface FormCardProps {
  title: string;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  propertyDefs: UIPropertyMeta[];
}

export function FormCard({
  title,
  fields,
  onSubmit,
  onCancel,
  submitLabel = 'Create',
  cancelLabel = 'Cancel',
  loading = false,
  propertyDefs,
}: FormCardProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    return fields.reduce((acc, field) => {
      acc[field.key] = field.defaultValue || '';
      return acc;
    }, {} as Record<string, any>);
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getPropertyDef = (key: string) => propertyDefs.find((p) => p.propertyName === key);

  const validateField = (key: string, value: any): string => {
    const def = getPropertyDef(key);
    if (!def) return '';
    if (def.isRequired && (value === '' || value === undefined || value === null || (def.controlType === 'checkbox' && value === false))) {
      return 'This field is required.';
    }
    if (def.controlType === 'number' && value !== '' && isNaN(Number(value))) {
      return 'Must be a valid number.';
    }
    if (def.validation) {
      if (def.validation.pattern && value && !(new RegExp(def.validation.pattern).test(value))) {
        return 'Invalid format.';
      }
      if (def.validation.min !== undefined && value !== '' && Number(value) < def.validation.min) {
        return `Must be at least ${def.validation.min}.`;
      }
      if (def.validation.max !== undefined && value !== '' && Number(value) > def.validation.max) {
        return `Must be at most ${def.validation.max}.`;
      }
    }
    return '';
  };

  const validateAll = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      const error = validateField(field.key, formData[field.key]);
      if (error) newErrors[field.key] = error;
    }
    return newErrors;
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [key]: validateField(key, value),
    }));
  };

  const renderFormControl = (field: FormField, value: any, onChange: (value: any) => void) => {
    const def = getPropertyDef(field.key);
    const controlType = def?.controlType || field.type || 'text';
    const baseClasses = `flex-1 px-4 py-2 border rounded-xl text-sm focus-accent ${errors[field.key] ? 'border-red-500' : 'border-gray-300'}`;
    
    switch (controlType) {
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            disabled={loading}
          />
        );
      
      case 'select':
        const selectValues = def?.selectValues || [];
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
            disabled={loading}
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
            className={baseClasses}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={field.required}
            disabled={loading}
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={field.required}
            disabled={loading}
          />
        );
      
      default: // text, textarea, etc.
        return (
          <input
            type="text"
            value={value?.toString() || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={field.required}
            disabled={loading}
          />
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateAll();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Card className="rounded-t-xl rounded-b-none">
      <CardHeader className="border-b border-slate-200 bg-slate-200 rounded-t-xl px-4 py-3">
        <div className="flex items-center justify-center">
          <h2 className="section-title text-slate-700">{title}</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields
            .filter(field => field.key !== 'uid')
            .map((field) => {
              const error = errors[field.key];
              const def = getPropertyDef(field.key);
              return (
                <div key={field.key} className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-4">
                    <label className="label w-32">{field.label}:</label>
                    {renderFormControl(field, formData[field.key], (value) => handleInputChange(field.key, value))}
                  </div>
                  {error && <span className="text-red-600 text-xs ml-36">{error}</span>}
                </div>
              );
            })}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-4 py-2"
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              className="px-4 py-2"
              disabled={loading}
            >
              {loading ? 'Creating...' : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 