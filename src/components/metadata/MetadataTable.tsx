'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EntityField } from '@/lib/schema';

interface MetadataTableProps {
  entityName: string;
  fields: EntityField[];
  data: Record<string, any>[];
  title?: string;
  onRowClick?: (row: Record<string, any>) => void;
  onEdit?: (row: Record<string, any>) => void;
  onDelete?: (row: Record<string, any>) => void;
  onCreate?: () => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function MetadataTable({
  entityName,
  fields,
  data,
  title,
  onRowClick,
  onEdit,
  onDelete,
  onCreate,
  isLoading = false,
  emptyMessage = 'No data available'
}: MetadataTableProps) {
  // Only show visible fields in the table
  const visibleFields = fields.filter(field => 
    field.ui.visibility === 'visible' || field.ui.visibility === 'readonly'
  );

  const formatCellValue = (value: any, field: EntityField): React.ReactNode => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400">-</span>;
    }

    switch (field.type) {
      case 'boolean':
        return (
          <Badge variant={value ? 'default' : 'secondary'}>
            {value ? 'Yes' : 'No'}
          </Badge>
        );
      case 'date':
        const date = new Date(value);
        return isNaN(date.getTime()) ? 
          <span className="text-gray-400">Invalid Date</span> : 
          date.toLocaleDateString();
      case 'enum':
        return (
          <Badge variant="outline">
            {value}
          </Badge>
        );
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      default:
        // Truncate long text
        const text = String(value);
        return text.length > 50 ? (
          <span title={text}>
            {text.substring(0, 50)}...
          </span>
        ) : text;
    }
  };

  if (isLoading) {
    return (
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {title && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {onCreate && (
            <Button onClick={onCreate}>
              Add New
            </Button>
          )}
        </CardHeader>
      )}
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {visibleFields.map((field) => (
                    <th
                      key={field.name}
                      className="text-left py-3 px-4 font-medium text-gray-600"
                    >
                      {field.ui.displayName}
                    </th>
                  ))}
                  {(onEdit || onDelete) && (
                    <th className="text-right py-3 px-4 font-medium text-gray-600">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b hover:bg-gray-50 ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {visibleFields.map((field) => (
                      <td key={field.name} className="py-3 px-4">
                        {formatCellValue(row[field.name], field)}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          {onEdit && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(row);
                              }}
                            >
                              Edit
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(row);
                              }}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 