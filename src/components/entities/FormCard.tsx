'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface FormField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'email';
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
}

export function FormCard({
  title,
  fields,
  onSubmit,
  onCancel,
  submitLabel = 'Create',
  cancelLabel = 'Cancel',
  loading = false,
}: FormCardProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    return fields.reduce((acc, field) => {
      acc[field.key] = field.defaultValue || '';
      return acc;
    }, {} as Record<string, any>);
  });

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          {fields.map((field) => (
            <div key={field.key} className="flex items-center gap-4">
              <label className="label w-32">{field.label}:</label>
              <input
                type={field.type || 'text'}
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                required={field.required}
                disabled={loading}
              />
            </div>
          ))}
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