'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, X, Check, SquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/skeleton';
import { MetadataRepository } from '@/lib/metadata-repository';
import { ENTITY_AGGREGATES } from '@/model_instances/theuimodel';
import { UIProperty } from '@/model_defs/UIModel';
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/confirm-dialog';

interface TabTableProps {
  data: any[];
  title?: string;
  icon?: React.ReactNode;
  emptyMessage?: string;
  loading?: boolean;
  onUpdate?: (index: number, data: any) => Promise<void>;
  onDelete?: (id: string | number) => Promise<void>;
  onCreate?: (data: any) => Promise<void>;
  schemaEntityName?: string; // Schema entity name for metadata lookup
}

export function TabTable({ data, title, icon, emptyMessage, loading = false, onUpdate, onDelete, onCreate, schemaEntityName }: TabTableProps) {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<any>(null);
  const [tableData, setTableData] = useState(data);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemData, setNewItemData] = useState<any>({});

  const metadataRepo = new MetadataRepository();
  const confirmDialog = useConfirmDialog();

  // Update local state when data prop changes
  useEffect(() => {
    setTableData(data);
  }, [data]);

  // Check if data contains UIEntity objects (has properties array)
  const isUIEntityData = (data: any[]): boolean => {
    return data.length > 0 && 
           data[0].properties && 
           Array.isArray(data[0].properties) &&
           data[0].displayName !== undefined;
  };

  // Transform UIEntity data to flat row format for table display
  const transformUIEntityData = (data: any[]): any[] => {
    if (!isUIEntityData(data)) return data;
    
    return data.map(entity => {
      const flatRow: any = {
        displayName: entity.displayName
      };
      
      // Add each property as a separate column
      entity.properties.forEach((prop: any) => {
        if (prop.is_visible) {
          flatRow[prop.property_name] = prop.property_value;
        }
      });
      
      // Keep original entity data for updates
      flatRow._originalEntity = entity;
      
      return flatRow;
    });
  };

  // Get all unique property names for column headers
  const getPropertyColumns = (data: any[]): string[] => {
    if (!isUIEntityData(data)) return [];
    
    const propertyNames = new Set<string>();
    data.forEach(entity => {
      entity.properties.forEach((prop: any) => {
        if (prop.is_visible) {
          propertyNames.add(prop.property_name);
        }
      });
    });
    
    return Array.from(propertyNames).sort();
  };

  // Transform data for table display
  const flatTableData = transformUIEntityData(tableData);
  const isUsingUIEntityData = isUIEntityData(tableData);
  const propertyColumns = getPropertyColumns(tableData);
  
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
    
    const field = (schema.properties || []).find((f: UIProperty) => (f as any).name === fieldName || f.property_name === fieldName);
    return field?.displayName || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleEdit = (index: number) => {
    setEditingRow(index);
    setEditedData({ ...flatTableData[index] });
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedData(null);
  };

  const handleSave = async (index: number) => {
    try {
      if (onUpdate) {
        await onUpdate(index, editedData);
      }
      
      // Update the original tableData if this is UIEntity data
      if (isUsingUIEntityData) {
        const newData = [...tableData];
        // Preserve the original entity structure but update the editable fields
        if (newData[index] && newData[index].properties) {
          const updatedEntity = { ...newData[index] };
          updatedEntity.displayName = editedData.displayName;
          
          // Update property values
          updatedEntity.properties = updatedEntity.properties.map((prop: any) => {
            if (editedData.hasOwnProperty(prop.property_name)) {
              return { ...prop, property_value: editedData[prop.property_name] };
            }
            return prop;
          });
          
          newData[index] = updatedEntity;
        }
        setTableData(newData);
      } else {
        // For simple data, just update directly
        const newData = [...tableData];
        newData[index] = editedData;
        setTableData(newData);
      }
      
      setEditingRow(null);
      setEditedData(null);
    } catch (error) {
      console.error('Error updating row:', error);
    }
  };

  const handleDelete = (index: number) => {
    confirmDialog.openDialog(async () => {
      if (onDelete) {
        // Use the appropriate id field based on data type
        const idToDelete = isUsingUIEntityData 
          ? tableData[index]?.entity_id || index
          : tableData[index]?.id || index;
        await onDelete(idToDelete);
      }
      const newData = tableData.filter((_, i) => i !== index);
      setTableData(newData);
    });
  };

  // const handleInputChange = (key: string, value: string) => {
  //   setEditedData((prev: any) => ({
  //     ...prev,
  //     [key]: value
  //   }));
  // };

  const handleAddNew = () => {
    setIsAddingNew(true);
    // Initialize new item data with empty values based on existing data structure
    if (flatTableData.length > 0) {
      const sampleItem = flatTableData[0];
      const emptyItem: any = {};
      
      if (isUsingUIEntityData) {
        // For UIEntity data, create empty values for displayName and properties
        emptyItem.displayName = '';
        propertyColumns.forEach(propName => {
          emptyItem[propName] = '';
        });
      } else {
        // For simple data, create empty values for all keys
        Object.keys(sampleItem).forEach(key => {
          emptyItem[key] = '';
        });
      }
      
      setNewItemData(emptyItem);
    } else {
      // If no data exists, create a basic template with common fields
      setNewItemData({
        name: '',
        value: '',
        description: ''
      });
    }
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewItemData({});
  };

  const handleSubmitAdd = async () => {
    try {
      if (onCreate) {
        await onCreate(newItemData);
      }
      
      // Add to original tableData format
      if (isUsingUIEntityData) {
        // Create a new UIEntity structure
        const newEntity = {
          entity_id: crypto.randomUUID(),
          entity_key: 'new-item',
          displayName: newItemData.displayName,
          properties: propertyColumns.map((propName, index) => ({
            property_name: propName,
            property_value: newItemData[propName] || '',
            ordinal: index + 1,
            is_editable: true,
            is_visible: true,
            is_key: false
          })),
          aggregates: []
        };
        const newData = [...tableData, newEntity];
        setTableData(newData);
      } else {
        const newData = [...tableData, newItemData];
        setTableData(newData);
      }
      
      setIsAddingNew(false);
      setNewItemData({});
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleNewItemInputChange = (key: string, value: string) => {
    setNewItemData((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return <TableSkeleton />;
  }

  if (!flatTableData || flatTableData.length === 0) {
    return (
      <div>
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-200 rounded-t-lg">
            <div className="flex items-center gap-2">
              {icon && <span className="text-slate-700">{icon}</span>}
              <span className="section-title text-slate-700">{title}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddNew}
              className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl"
              title="Add new item"
            >
              <SquarePlus className="w-4 h-4" />
            </Button>
          </div>
        )}
        {isAddingNew ? (
          <div className="p-4 rounded-b-lg">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitAdd(); }} className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">Add the first item to this collection:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isUsingUIEntityData ? (
                  <>
                    <div className="space-y-2">
                      <label className="label">Display Name</label>
                      <input
                        type="text"
                        value={newItemData.displayName || ''}
                        onChange={(e) => handleNewItemInputChange('displayName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                        placeholder="Enter Display Name"
                      />
                    </div>
                    {propertyColumns.map((propName) => (
                      <div key={propName} className="space-y-2">
                        <label className="label">{getFieldDisplayName(propName)}</label>
                        <input
                          type="text"
                          value={newItemData[propName] || ''}
                          onChange={(e) => handleNewItemInputChange(propName, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                          placeholder={`Enter ${getFieldDisplayName(propName)}`}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  Object.keys(newItemData).map((key) => (
                    <div key={key} className="space-y-2">
                      <label className="label">{getFieldDisplayName(key)}</label>
                      <input
                        type="text"
                        value={newItemData[key] || ''}
                        onChange={(e) => handleNewItemInputChange(key, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                        placeholder={`Enter ${getFieldDisplayName(key)}`}
                      />
                    </div>
                  ))
                )}
              </div>
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium"
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  onClick={handleCancelAdd}
                  variant="ghost"
                  className="px-6 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-xl text-sm"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-4 label rounded-b-lg">{emptyMessage || `No data.`}</div>
        )}
      </div>
    );
  }

  return (
    <div>
              {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-200 rounded-t-lg">
            <div className="flex items-center gap-2">
              {icon && <span className="text-slate-700">{icon}</span>}
              <span className="section-title text-slate-700">{title}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddNew}
              className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl"
              title="Add new item"
            >
              <SquarePlus className="w-4 h-4" />
            </Button>
          </div>
        )}
      {isAddingNew ? (
        <div className="p-4 rounded-b-lg">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitAdd(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isUsingUIEntityData ? (
                <>
                  <div className="space-y-2">
                    <label className="label">Display Name</label>
                    <input
                      type="text"
                      value={newItemData.displayName || ''}
                      onChange={(e) => handleNewItemInputChange('displayName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                      placeholder="Enter Display Name"
                    />
                  </div>
                  {propertyColumns.map((propName) => (
                    <div key={propName} className="space-y-2">
                      <label className="label">{getFieldDisplayName(propName)}</label>
                      <input
                        type="text"
                        value={newItemData[propName] || ''}
                        onChange={(e) => handleNewItemInputChange(propName, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                        placeholder={`Enter ${getFieldDisplayName(propName)}`}
                      />
                    </div>
                  ))}
                </>
              ) : (
                Object.keys(newItemData).map((key) => (
                  <div key={key} className="space-y-2">
                    <label className="label">{getFieldDisplayName(key)}</label>
                    <input
                      type="text"
                      value={newItemData[key] || ''}
                      onChange={(e) => handleNewItemInputChange(key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                      placeholder={`Enter ${getFieldDisplayName(key)}`}
                    />
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium"
              >
                Submit
              </Button>
              <Button
                type="button"
                onClick={handleCancelAdd}
                variant="ghost"
                className="px-6 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-xl text-sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="border-l border-r border-b rounded-b-lg overflow-hidden">
            {/* Single table with sticky header for perfect column alignment */}
            <div className="overflow-auto max-h-96">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr>
                    {/* Display Name column first */}
                    {isUsingUIEntityData && (
                      <th className="px-4 py-3 bg-slate-600 text-left font-semibold text-white border-r border-gray-400">
                        Display Name
                      </th>
                    )}
                    {/* Property columns or regular object keys */}
                    {isUsingUIEntityData ? (
                      propertyColumns.map((propName, index) => (
                        <th key={propName} className="px-4 py-3 bg-slate-600 text-left font-semibold text-white border-r border-gray-400">
                          {getFieldDisplayName(propName)}
                        </th>
                      ))
                    ) : (
                      Object.keys(flatTableData[0]).map((key, index, array) => (
                        <th key={key} className="px-4 py-3 bg-slate-600 text-left font-semibold text-white border-r border-gray-400">
                          {getFieldDisplayName(key)}
                        </th>
                      ))
                    )}
                    {/* Actions column last */}
                    <th className="px-4 py-3 bg-slate-600 text-left font-semibold text-white w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {flatTableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 border-b last:border-b-0">
                      {/* Display Name column first for UIEntity data */}
                      {isUsingUIEntityData && (
                        <td className="px-4 py-3 text-gray-900 text-left border-r border-gray-200">
                          {editingRow === idx ? (
                            <input
                              type="text"
                              value={editedData?.displayName?.toString() || ''}
                              onChange={(e) => {
                                setEditedData((prev: any) => ({
                                  ...prev,
                                  displayName: e.target.value
                                }));
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent text-left"
                            />
                          ) : (
                            row.displayName?.toString() || ''
                          )}
                        </td>
                      )}
                      {/* Property columns or regular object keys */}
                      {isUsingUIEntityData ? (
                        propertyColumns.map((propName, index) => (
                          <td key={propName} className="px-4 py-3 text-gray-900 text-left border-r border-gray-200">
                            {editingRow === idx ? (
                              <input
                                type="text"
                                value={editedData?.[propName]?.toString() || ''}
                                onChange={(e) => {
                                  setEditedData((prev: any) => ({
                                    ...prev,
                                    [propName]: e.target.value
                                  }));
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent text-left"
                              />
                            ) : (
                              row[propName]?.toString() || ''
                            )}
                          </td>
                        ))
                      ) : (
                        Object.keys(row).map((key, index, array) => (
                          <td key={key} className="px-4 py-3 text-gray-900 text-left border-r border-gray-200">
                            {editingRow === idx ? (
                              <input
                                type="text"
                                value={editedData?.[key]?.toString() || ''}
                                onChange={(e) => {
                                  setEditedData((prev: any) => ({
                                    ...prev,
                                    [key]: e.target.value
                                  }));
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent text-left"
                              />
                            ) : (
                              row[key]?.toString() || ''
                            )}
                          </td>
                        ))
                      )}
                      {/* Actions column last */}
                      <td className="px-4 py-3 text-gray-900 w-24">
                        <div className="flex items-center gap-2">
                          {editingRow === idx ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSave(idx)}
                                className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl"
                                title="Save"
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
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(idx)}
                                className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(idx)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.closeDialog}
        onConfirm={confirmDialog.handleConfirm}
        isLoading={confirmDialog.isLoading}
      />
    </div>
  );
} 