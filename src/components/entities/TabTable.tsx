'use client';

import { useState } from 'react';
import { Trash2, Edit, X, Check, SquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/skeleton';

interface TabTableProps {
  data: any[];
  title?: string;
  icon?: React.ReactNode;
  emptyMessage?: string;
  loading?: boolean;
  onUpdate?: (index: number, data: any) => Promise<void>;
  onDelete?: (id: string | number) => Promise<void>;
  onCreate?: (data: any) => Promise<void>;
}

export function TabTable({ data, title, icon, emptyMessage, loading = false, onUpdate, onDelete, onCreate }: TabTableProps) {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<any>(null);
  const [tableData, setTableData] = useState(data);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemData, setNewItemData] = useState<any>({});

  const handleEdit = (index: number) => {
    setEditingRow(index);
    setEditedData({ ...tableData[index] });
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
      const newData = [...tableData];
      newData[index] = editedData;
      setTableData(newData);
      setEditingRow(null);
      setEditedData(null);
    } catch (error) {
      console.error('Error updating row:', error);
    }
  };

  const handleDelete = async (index: number) => {
    try {
      if (onDelete) {
        await onDelete(tableData[index].id || index);
      }
      const newData = tableData.filter((_, i) => i !== index);
      setTableData(newData);
    } catch (error) {
      console.error('Error deleting row:', error);
    }
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
    if (tableData.length > 0) {
      const sampleItem = tableData[0];
      const emptyItem = Object.keys(sampleItem).reduce((acc, key) => {
        acc[key] = '';
        return acc;
      }, {} as any);
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
      const newData = [...tableData, newItemData];
      setTableData(newData);
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

  if (!tableData || tableData.length === 0) {
    return (
      <div className="space-y-3">
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
          <div className="px-4 py-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitAdd(); }} className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">Add the first item to this collection:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(newItemData).map((key) => (
                  <div key={key} className="space-y-2">
                    <label className="label">{key}</label>
                    <input
                      type="text"
                      value={newItemData[key] || ''}
                      onChange={(e) => handleNewItemInputChange(key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                      placeholder={`Enter ${key}`}
                    />
                  </div>
                ))}
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
          <div className="px-4 py-3 label">{emptyMessage || `No data.`}</div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
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
        <div className="px-4 py-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitAdd(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(newItemData).map((key) => (
                <div key={key} className="space-y-2">
                  <label className="label">{key}</label>
                  <input
                    type="text"
                    value={newItemData[key] || ''}
                    onChange={(e) => handleNewItemInputChange(key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                    placeholder={`Enter ${key}`}
                  />
                </div>
              ))}
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
        <div className="overflow-x-auto px-4">
          <table className="min-w-full border text-sm rounded-lg overflow-hidden">
            <thead>
              <tr>
                {Object.keys(tableData[0]).map((key) => (
                  <th key={key} className="px-4 py-3 border-b bg-slate-600 text-left font-semibold text-white first:rounded-tl-lg">
                    {key}
                  </th>
                ))}
                <th className="px-4 py-3 border-b bg-slate-600 text-left font-semibold text-white w-24 rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.keys(row).map((key) => (
                    <td key={key} className="px-4 py-3 border-b text-gray-900">
                      {editingRow === idx ? (
                        <input
                          type="text"
                          value={editedData[key]?.toString() || ''}
                          onChange={(e) => {
                            setEditedData((prev: any) => ({
                              ...prev,
                              [key]: e.target.value
                            }));
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus-accent"
                        />
                      ) : (
                        row[key]?.toString() || ''
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 border-b text-gray-900">
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
      )}
    </div>
  );
} 