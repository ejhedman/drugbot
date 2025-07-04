'use client';

import React, { useState } from 'react';
import { Plus, Edit, Check, X, ChevronUp, ChevronDown, Trash } from 'lucide-react';
import { SelectList, SelectListItem } from '@/hooks/useSelectLists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SelectListEditorProps {
  selectedSelectList: SelectList | null;
  isEditingName: boolean;
  editingName: string;
  setIsEditingName: (editing: boolean) => void;
  setEditingName: (name: string) => void;
  updateSelectListName: () => void;
  onCancelEditName: () => void;
  creatingNewSelectList: boolean;
  setCreatingNewSelectList: (creating: boolean) => void;
  onUpdateSelectList: (selectList: SelectList) => void;
}

export function SelectListEditor({
  selectedSelectList,
  isEditingName,
  editingName,
  setIsEditingName,
  setEditingName,
  updateSelectListName,
  onCancelEditName,
  creatingNewSelectList,
  setCreatingNewSelectList,
  onUpdateSelectList
}: SelectListEditorProps) {
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editingItemText, setEditingItemText] = useState('');
  const [editingItemCode, setEditingItemCode] = useState('');

  const handleAddItem = () => {
    if (!selectedSelectList) return;

    const newItem: SelectListItem = {
      text: 'New Item',
      code: 'new_item',
      ordinal: selectedSelectList.items.length
    };

    const updatedSelectList = {
      ...selectedSelectList,
      items: [...selectedSelectList.items, newItem]
    };

    onUpdateSelectList(updatedSelectList);
  };

  const handleEditItem = (index: number) => {
    if (!selectedSelectList) return;

    const item = selectedSelectList.items[index];
    setEditingItemIndex(index);
    setEditingItemText(item.text);
    setEditingItemCode(item.code);
  };

  const handleSaveItem = () => {
    if (!selectedSelectList || editingItemIndex === null) return;

    const updatedItems = [...selectedSelectList.items];
    updatedItems[editingItemIndex] = {
      ...updatedItems[editingItemIndex],
      text: editingItemText,
      code: editingItemCode
    };

    const updatedSelectList = {
      ...selectedSelectList,
      items: updatedItems
    };

    onUpdateSelectList(updatedSelectList);
    setEditingItemIndex(null);
    setEditingItemText('');
    setEditingItemCode('');
  };

  const handleCancelEditItem = () => {
    setEditingItemIndex(null);
    setEditingItemText('');
    setEditingItemCode('');
  };

  const handleDeleteItem = (index: number) => {
    if (!selectedSelectList) return;

    const updatedItems = selectedSelectList.items.filter((_, i) => i !== index);
    // Reorder ordinals
    const reorderedItems = updatedItems.map((item, i) => ({
      ...item,
      ordinal: i
    }));

    const updatedSelectList = {
      ...selectedSelectList,
      items: reorderedItems
    };

    onUpdateSelectList(updatedSelectList);
  };

  const handleMoveItem = (index: number, direction: number) => {
    if (!selectedSelectList) return;

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= selectedSelectList.items.length) return;

    const updatedItems = [...selectedSelectList.items];
    const temp = updatedItems[index];
    updatedItems[index] = updatedItems[newIndex];
    updatedItems[newIndex] = temp;

    // Update ordinals
    const reorderedItems = updatedItems.map((item, i) => ({
      ...item,
      ordinal: i
    }));

    const updatedSelectList = {
      ...selectedSelectList,
      items: reorderedItems
    };

    onUpdateSelectList(updatedSelectList);
  };

  if (!selectedSelectList && !creatingNewSelectList) {
    return null;
  }

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col bg-white rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-slate-200 bg-slate-100 rounded-t-xl min-h-[64px]">
        <div className="flex items-center gap-2 flex-1 pl-4">
          <h2 className="section-title text-gray-900 font-semibold text-lg">
            {creatingNewSelectList ? 'New Select List' : 'Edit Select List'}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4">
          {selectedSelectList && (
            <>
              {/* Select List Name */}
              <div className="mb-6">
                <div className="mb-2">
                  <h3 className="text-lg font-medium text-gray-900">Select List Name</h3>
                </div>
                
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={updateSelectListName}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={onCancelEditName}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-medium text-gray-900 flex-1">
                      {selectedSelectList.display_name}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setIsEditingName(true);
                        setEditingName(selectedSelectList.display_name);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">Items</h3>
                  <Button
                    onClick={handleAddItem}
                    size="sm"
                    variant="ghost"
                    className="h-8 px-3 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-2">
                  {selectedSelectList.items.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No items yet. Add your first item!
                    </div>
                  ) : (
                    selectedSelectList.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                        {editingItemIndex === index ? (
                          <div className="flex-1 space-y-2">
                            <Input
                              value={editingItemText}
                              onChange={(e) => setEditingItemText(e.target.value)}
                              placeholder="Item text"
                              className="w-full"
                            />
                            <Input
                              value={editingItemCode}
                              onChange={(e) => setEditingItemCode(e.target.value)}
                              placeholder="Item code"
                              className="w-full"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={handleSaveItem}
                                className="flex-1"
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEditItem}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.text}</div>
                              <div className="text-sm text-gray-500">Code: {item.code}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                disabled={index === 0}
                                onClick={() => handleMoveItem(index, -1)}
                                title="Move up"
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                disabled={index === selectedSelectList.items.length - 1}
                                onClick={() => handleMoveItem(index, 1)}
                                title="Move down"
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-orange-600 hover:bg-orange-50"
                                onClick={() => handleEditItem(index)}
                                title="Edit item"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteItem(index)}
                                title="Delete item"
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
    </div>
  );
} 