// src/components/content/SelectListList.tsx
import { Plus, Copy, Trash, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SelectList } from '@/hooks/useSelectLists';
import React, { useState } from 'react';

interface SelectListListProps {
  isLoading: boolean;
  selectLists: SelectList[];
  selectedSelectList: SelectList | null;
  user: any;
  getUserInitials: (email: string) => string;
  handleSelectListSelect: (selectList: SelectList) => void;
  setSelectListToDelete: (selectList: SelectList) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  newSelectListName: string;
  setNewSelectListName: (name: string) => void;
  newSelectListDisplayName: string;
  setNewSelectListDisplayName: (name: string) => void;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  handleCreateSelectList: () => void;
  onDuplicateSelectList?: (selectList: SelectList) => void;
  panelState: string;
}

export function SelectListList({
  isLoading,
  selectLists,
  selectedSelectList,
  user,
  getUserInitials,
  handleSelectListSelect,
  setSelectListToDelete,
  setDeleteDialogOpen,
  newSelectListName,
  setNewSelectListName,
  newSelectListDisplayName,
  setNewSelectListDisplayName,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  handleCreateSelectList,
  onDuplicateSelectList,
  panelState
}: SelectListListProps) {


  const getSelectListIconStyle = (selectList: SelectList) => {
    return {
      icon: Globe,
      bgColor: 'bg-green-500'
    };
  };

  const getSelectListType = (selectList: SelectList) => {
    return `${selectList.items.length} items`;
  };

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col bg-white rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-slate-200 bg-slate-100 rounded-t-xl min-h-[64px]">
        <div className="flex items-center flex-1">
          <h2 className="section-title text-gray-900 font-semibold text-lg pl-4">Select Lists</h2>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              onClick={handleCreateSelectList}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 rounded-xl text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
              title="Create New Select List"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* Content */}
      {/* Select Lists List */}
      <div className="flex-1 overflow-y-auto min-h-0 pt-3">
            { isLoading ? (
              <div className="text-center text-gray-500 py-8">Loading select lists...</div>
            ) : (
              <div className="space-y-1 px-2">
                {/* All Select Lists */}
                {selectLists.map((selectList) => {
                  const { icon: Icon, bgColor } = getSelectListIconStyle(selectList);
                  return (
                    <div
                      key={selectList.uid}
                      className={`flex items-center gap-2 rounded-xl overflow-hidden ${
                        selectedSelectList?.uid === selectList.uid
                          ? 'bg-slate-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <button
                        onClick={() => handleSelectListSelect(selectList)}
                        className="flex-1 text-left px-4 py-2 transition-colors text-sm rounded-xl"
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center text-white text-sm group relative`}>
                            <Icon className="h-4 w-4" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                              Public Select List
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {selectList.display_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getSelectListType(selectList)}
                            </div>
                          </div>
                        </div>
                      </button>
                                                <div className="flex items-center gap-1 mr-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50 rounded-lg"
                              onClick={e => {
                                e.stopPropagation();
                                if (onDuplicateSelectList) {
                                  onDuplicateSelectList(selectList);
                                }
                              }}
                              title="Duplicate select list"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-600 hover:bg-red-50 rounded-lg"
                              onClick={e => {
                                e.stopPropagation();
                                setSelectListToDelete(selectList);
                                setDeleteDialogOpen(true);
                              }}
                              title="Delete select list"
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                    </div>
                  );
                })}

                {selectLists.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No select lists found. Create your first select list!
                  </div>
                )}
              </div>
            )}
          </div>
      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Select List</DialogTitle>
            <DialogDescription>
              Enter the details for your new select list
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name (Internal)
              </label>
              <Input
                id="name"
                value={newSelectListName}
                onChange={(e) => setNewSelectListName(e.target.value)}
                placeholder="Enter internal name"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <Input
                id="displayName"
                value={newSelectListDisplayName}
                onChange={(e) => setNewSelectListDisplayName(e.target.value)}
                placeholder="Enter display name"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSelectList}>
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}