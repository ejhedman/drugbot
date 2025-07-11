'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, X, Check, SquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/skeleton';
import { theUIModel, ENTITY_AGGREGATES } from '@/model_instances';
import { UIProperty } from '@/model_defs/UIModel';
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/confirm-dialog';
import { getBorderClasses } from '@/lib/borderUtils';

interface TabTableProps {
  data: any[];
  title?: string;
  icon?: React.ReactNode;
  emptyMessage?: string;
  loading?: boolean;
  onUpdate?: (id: string | number, data: any) => Promise<void>;
  onDelete?: (id: string | number) => Promise<void>;
  onCreate?: (data: any) => Promise<void>;
  schemaEntityName?: string; // Schema entity name for metadata lookup
  canEdit?: boolean; // Whether edit controls should be shown
}

export function TabTable({ data, title, icon, emptyMessage, loading = false, onUpdate, onDelete, onCreate, schemaEntityName, canEdit = true }: TabTableProps) {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<any>(null);
  const [tableData, setTableData] = useState(data);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemData, setNewItemData] = useState<any>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const confirmDialog = useConfirmDialog();

  // Update local state when data prop changes
  useEffect(() => {
    console.log('TabTable: Data prop changed, new data length:', data.length);
    setTableData(data);
  }, [data]);

  // Check if data contains UIEntity objects (has properties array)
  const isUIEntityData = (data: any[]): boolean => {
    if (data.length === 0) {
      return false;
    }
    if (!data[0]) {
      return false;
    }
    if (!data[0].properties) {
      return false;
    }
    if (!Array.isArray(data[0].properties)) {
      return false;
    }
    if (data[0].displayName === undefined) {
      return false;
    }
    return true;
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
        if (prop.isVisible) {
          flatRow[prop.propertyName] = prop.propertyValue;
        }
      });
      
      // Keep original entity data for updates
      flatRow._originalEntity = entity;
      
      // Preserve any existing _uid field from the original data
      if (entity._uid) {
        flatRow._uid = entity._uid;
      }
      
      return flatRow;
    });
  };

  // Get all unique property names for column headers
  const getPropertyColumns = (data: any[]): string[] => {
    if (!isUIEntityData(data)) return [];
    
    const propertyNames = new Set<string>();
    data.forEach(entity => {
      entity.properties.forEach((prop: any) => {
        if (prop.isVisible) {
          propertyNames.add(prop.propertyName);
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
    const schema = theUIModel.getEntity(schemaEntityName) || ENTITY_AGGREGATES[schemaEntityName];
    
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
    const schema = theUIModel.getEntity(schemaEntityName) || ENTITY_AGGREGATES[schemaEntityName];
    
    if (!schema || !schema.propertyDefs) {
      // If no schema found, assume editable unless it's a key/id field
      return !fieldName.endsWith('_key') && !fieldName.endsWith('_uid') && fieldName !== 'uid';
    }
    
    // Check editability based on schema
    const propertyDef = schema.propertyDefs.find((f: UIProperty) => f.propertyName === fieldName);
    return propertyDef ? propertyDef.isEditable : true; // Assume editable if no definition found
  };

  // Helper to get controlType for a property
  const getControlType = (fieldName: string): string => {
    if (!schemaEntityName) return 'text';
    const schema = theUIModel.getEntity(schemaEntityName) || ENTITY_AGGREGATES[schemaEntityName];
    if (!schema) return 'text';
    const field = (schema.propertyDefs || []).find((f: UIProperty) => f.propertyName === fieldName);
    return field?.controlType || 'text';
  };

  // Helper to get select values
  const getSelectValues = (fieldName: string): string[] => {
    if (!schemaEntityName) return ['no values defined'];
    const schema = theUIModel.getEntity(schemaEntityName) || ENTITY_AGGREGATES[schemaEntityName];
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
    const baseClasses = `w-full px-4 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded-xl text-sm focus-accent text-left`;

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

  const handleEdit = (index: number) => {
    setEditingRow(index);
    // Create editedData without the _uid field to avoid sending it to the API
    const { _uid, _originalEntity, ...editableData } = flatTableData[index];
    setEditedData(editableData);
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedData(null);
  };

  const handleSave = async (index: number) => {
    // Validate all fields before saving
    let hasError = false;
    const errors: Record<string, boolean> = {};
    const fields = isUsingUIEntityData ? propertyColumns : Object.keys(flatTableData[index] || {}).filter(key => key !== 'uid' && key !== '_uid');
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
        // For aggregates, pass the uid of the record being updated
        // For UIEntity data, pass the index as before
        const idToUpdate = isUsingUIEntityData 
          ? index
          : flatTableData[index]?._uid || flatTableData[index]?.uid || index;
        

        
        await onUpdate(idToUpdate, editedData);
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
            if (editedData.hasOwnProperty(prop.propertyName)) {
              return { ...prop, propertyValue: editedData[prop.propertyName] };
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
        // For aggregates, use the _uid field from the flat data (hidden property)
        // For UIEntity data, use entityUid
        const idToDelete = isUsingUIEntityData 
          ? tableData[index]?.entityUid || index
          : flatTableData[index]?._uid || flatTableData[index]?.uid || tableData[index]?.id || index;
        
        await onDelete(idToDelete);
      }
      
      // Only update local state for UIEntity data, not for aggregates
      // Aggregates will be refreshed from the server by the parent component
      if (isUsingUIEntityData) {
        const newData = tableData.filter((_, i) => i !== index);
        setTableData(newData);
      }
    });
  };



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
        // Create a new UIEntity structure using schema metadata
        const newEntity = {
          entityUid: crypto.randomUUID(),
          displayName: newItemData.displayName,
          properties: propertyColumns.map((propName, index) => ({
            propertyName: propName,
            propertyValue: newItemData[propName] || '',
            ordinal: index + 1,
            isEditable: isFieldEditable(propName),
            isVisible: true, // Columns are already filtered to visible only
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

  // Helper function to properly display values, distinguishing between null and zero/empty
  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '--null--';
    }
    // Explicitly handle zero values to ensure they're visible
    if (value === 0 || value === '0') {
      return '0';
    }
    // Handle empty strings
    if (value === '') {
      return '';
    }
    return value.toString();
  };

  const handleNewItemInputChange = (key: string, value: any) => {
    setNewItemData((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const renderNewItemControl = (fieldName: string, value: any, onChange: (value: any) => void) => {
    const controlType = getControlType(fieldName);
    const baseClasses = "w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent";
    
    switch (controlType) {
      case 'checkbox':
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
            placeholder={`Enter ${getFieldDisplayName(fieldName)}`}
          />
        );
    }
  };

  if (loading) {
    return <TableSkeleton />;
  }

  if (!flatTableData || flatTableData.length === 0) {
    return (
      <div className="flex flex-col h-full">
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-200 rounded-t-lg flex-shrink-0">
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
          <div className="p-4 rounded-b-lg flex-1 min-h-0 overflow-y-auto overflow-x-auto scrollbar-always-visible max-h-[75vh]">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitAdd(); }} className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">Add the first item to this collection:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isUsingUIEntityData ? (
                  <>
                    <div className="space-y-2">
                      <label className="label">Display Name</label>
                      {renderNewItemControl(
                        'displayName',
                        newItemData.displayName,
                        (value) => handleNewItemInputChange('displayName', value)
                      )}
                    </div>
                    {propertyColumns.filter(propName => propName !== 'uid' && propName !== '_uid').map((propName) => (
                      <div key={propName} className="space-y-2">
                        <label className="label">{getFieldDisplayName(propName)}</label>
                        {renderNewItemControl(
                          propName,
                          newItemData[propName],
                          (value) => handleNewItemInputChange(propName, value)
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  Object.keys(newItemData).filter(key => key !== 'uid' && key !== '_uid').map((key) => (
                    <div key={key} className="space-y-2">
                      <label className="label">{getFieldDisplayName(key)}</label>
                      {renderNewItemControl(
                        key,
                        newItemData[key],
                        (value) => handleNewItemInputChange(key, value)
                      )}
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
          <div className="p-4 label rounded-b-lg flex-1 flex items-center justify-center">{emptyMessage || `No data.`}</div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-200 rounded-t-lg flex-shrink-0">
          <div className="flex items-center gap-2">
            {icon && <span className="text-slate-700">{icon}</span>}
            <span className="section-title text-slate-700">{title}</span>
          </div>
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddNew}
              className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl"
              title="Add new item"
            >
              <SquarePlus className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
      {isAddingNew ? (
        <div className="p-4 rounded-b-lg flex-1 min-h-0 overflow-y-auto overflow-x-auto scrollbar-always-visible max-h-[75vh]">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitAdd(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {isUsingUIEntityData ? (
                    <>
                      {isFieldEditable('displayName') && (
                        <div className="space-y-2">
                          <label className="label">Display Name</label>
                          {renderNewItemControl(
                            'displayName',
                            newItemData.displayName,
                            (value) => handleNewItemInputChange('displayName', value)
                          )}
                        </div>
                      )}
                      {propertyColumns.filter(propName => propName !== 'uid' && propName !== '_uid').map((propName) => (
                        <div key={propName} className="space-y-2">
                          <label className="label">{getFieldDisplayName(propName)}</label>
                          {renderNewItemControl(
                            propName,
                            newItemData[propName],
                            (value) => handleNewItemInputChange(propName, value)
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    Object.keys(newItemData).filter(key => key !== 'uid' && key !== '_uid').map((key) => (
                      <div key={key} className="space-y-2">
                        <label className="label">{getFieldDisplayName(key)}</label>
                        {renderNewItemControl(
                          key,
                          newItemData[key],
                          (value) => handleNewItemInputChange(key, value)
                        )}
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
        <div className="flex-1 min-h-0 border-l border-r border-b rounded-b-lg overflow-hidden">
          {/* Table container with fixed height that works */}
          <div className="overflow-y-auto overflow-x-auto scrollbar-always-visible max-h-[65vh]">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr>
                  {isUsingUIEntityData && (
                    <th className="px-4 py-1 bg-slate-600 text-left font-semibold text-white border-r border-gray-400">
                      Display Name
                    </th>
                  )}
                  {isUsingUIEntityData ? (
                    propertyColumns.map((propName, index) => (
                      <th key={propName} className="px-4 py-1 bg-slate-600 text-left font-semibold text-white border-r border-gray-400">
                        {getFieldDisplayName(propName)}
                      </th>
                    ))
                  ) : (
                    Object.keys(flatTableData[0] || {}).filter(key => key !== 'uid' && key !== '_uid').map((key, index, array) => (
                      <th key={key} className="px-4 py-1 bg-slate-600 text-left font-semibold text-white border-r border-gray-400">
                        {getFieldDisplayName(key)}
                      </th>
                                      ))
                )}
                {canEdit && (
                  <th className="px-4 py-1 bg-slate-600 text-left font-semibold text-white w-24">
                    Actions
                  </th>
                )}
                </tr>
              </thead>
              <tbody className={getBorderClasses("", "border-6 border-blue-500")}>
                {flatTableData.map((row, idx) => (
                  <tr key={row._uid || row.uid || row.id || idx} className="hover:bg-gray-50 border-b last:border-b-0">
                    {isUsingUIEntityData && (
                      <td className="px-4 py-1 text-gray-900 text-left border-r border-gray-200">
                        {editingRow === idx ? (
                          isFieldEditable('displayName') ? (
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
                          <span className="text-gray-500 italic">{formatCellValue(row.displayName)}</span>
                        )
                      ) : (
                        formatCellValue(row.displayName)
                      )}
                      </td>
                    )}
                    {isUsingUIEntityData ? (
                      propertyColumns.map((propName, index) => (
                        <td key={propName} className="px-4 py-1 text-gray-900 text-left border-r border-gray-200">
                          {editingRow === idx ? (
                            isFieldEditable(propName) ? (
                              renderEditControl(
                                propName,
                                editedData?.[propName],
                                (value) => {
                                  setEditedData((prev: any) => ({
                                    ...prev,
                                    [propName]: value
                                  }));
                                }
                              )
                            ) : (
                              <span className="text-gray-500 italic">{formatCellValue(row[propName])}</span>
                            )
                          ) : (
                            formatCellValue(row[propName])
                          )}
                        </td>
                      ))
                    ) : (
                      Object.keys(row).filter(key => key !== 'uid' && key !== '_uid').map((key, index, array) => (
                        <td key={key} className="px-4 py-1 text-gray-900 text-left border-r border-gray-200">
                          {editingRow === idx ? (
                            isFieldEditable(key) ? (
                              renderEditControl(
                                key,
                                editedData?.[key],
                                (value) => {
                                  setEditedData((prev: any) => ({
                                    ...prev,
                                    [key]: value
                                  }));
                                }
                              )
                            ) : (
                              <span className="text-gray-500 italic">{formatCellValue(row[key])}</span>
                            )
                          ) : (
                            formatCellValue(row[key])
                          )}
                        </td>
                      ))
                    )}
                    {canEdit && (
                      <td className="px-4 py-1 text-gray-900 w-24">
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
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
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