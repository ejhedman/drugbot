'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Check, X, User, Globe, Copy, Settings, Trash, ChevronUp, ChevronDown, Lock, Unlock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSelectLists, type SelectList, type SelectListItem } from '@/hooks/useSelectLists';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SelectListList } from '@/components/content/SelectListList';
import { SelectListEditor } from '@/components/content/SelectListEditor';

type PanelState = 'SLISTE' | 'SLISTC' | 'SEDITOPEN' | 'SEDITCLOSED';

interface SelectListsPageProps {
  resetTrigger?: number;
}

export function SelectListsPage({ resetTrigger = 0 }: SelectListsPageProps) {
  const { user } = useAuth();
  const { selectLists, isLoading, createSelectList, updateSelectList, deleteSelectList } = useSelectLists();
  const [selectedSelectList, setSelectedSelectList] = useState<SelectList | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSelectListName, setNewSelectListName] = useState('');
  const [newSelectListDisplayName, setNewSelectListDisplayName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectListToDelete, setSelectListToDelete] = useState<SelectList | null>(null);
  const [panelState, setPanelState] = useState<PanelState>('SLISTE');
  const [creatingNewSelectList, setCreatingNewSelectList] = useState(false);

  // Clear selected select list when resetTrigger changes
  useEffect(() => {
    if (resetTrigger > 0) {
      setSelectedSelectList(null);
      setIsEditingName(false);
      setEditingName('');
      setCreatingNewSelectList(false);
      setPanelState('SLISTE');
    }
  }, [resetTrigger]);

  // Auto-collapse/expand Select Lists list based on selection
  useEffect(() => {
    if (creatingNewSelectList) return; // Do not override state when creating a new select list
    if (selectedSelectList) {
      setPanelState('SEDITOPEN');
    } else {
      setPanelState('SLISTE');
    }
  }, [selectedSelectList, creatingNewSelectList]);

  const handleSelectListSelect = (selectList: SelectList) => {
    setSelectedSelectList(selectList);
    setIsEditingName(false);
    setEditingName('');
  };

  const handleStartCreateSelectList = () => {
    setCreatingNewSelectList(true);
    setSelectedSelectList(null);
    setNewSelectListName('');
    setNewSelectListDisplayName('');
    setIsCreateDialogOpen(true);
  };

  const handleSaveNewSelectList = async () => {
    if (!newSelectListName.trim() || !newSelectListDisplayName.trim()) {
      alert('Please enter both name and display name');
      return;
    }

    try {
      const newSelectList = await createSelectList({
        name: newSelectListName.trim(),
        display_name: newSelectListDisplayName.trim(),
        items: []
      });

      setSelectedSelectList(newSelectList);
      setCreatingNewSelectList(false);
      setIsCreateDialogOpen(false);
      setNewSelectListName('');
      setNewSelectListDisplayName('');
    } catch (error) {
      console.error('Error creating select list:', error);
      alert('Failed to create select list');
    }
  };

  const handleEditSelectList = (selectList: SelectList) => {
    setSelectedSelectList(selectList);
    setIsEditingName(true);
    setEditingName(selectList.display_name);
  };

  const handleUpdateSelectListName = async () => {
    if (!selectedSelectList || !editingName.trim()) return;

    try {
      const updatedSelectList = await updateSelectList(selectedSelectList.uid, {
        name: selectedSelectList.name,
        display_name: editingName.trim(),
        items: selectedSelectList.items
      });

      setSelectedSelectList(updatedSelectList);
      setIsEditingName(false);
      setEditingName('');
    } catch (error) {
      console.error('Error updating select list name:', error);
      alert('Failed to update select list name');
    }
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditingName('');
  };

  const handleDuplicateSelectList = async (originalSelectList: SelectList) => {
    try {
      const newSelectList = await createSelectList({
        name: `${originalSelectList.name}_copy`,
        display_name: `${originalSelectList.display_name} (Copy)`,
        items: [...originalSelectList.items]
      });

      setSelectedSelectList(newSelectList);
    } catch (error) {
      console.error('Error duplicating select list:', error);
      alert('Failed to duplicate select list');
    }
  };

  const handleDeleteSelectList = async () => {
    if (!selectListToDelete) return;

    try {
      await deleteSelectList(selectListToDelete.uid);
      if (selectedSelectList?.uid === selectListToDelete.uid) {
        setSelectedSelectList(null);
      }
      setDeleteDialogOpen(false);
      setSelectListToDelete(null);
    } catch (error) {
      console.error('Error deleting select list:', error);
      alert('Failed to delete select list');
    }
  };

  const handleUpdateSelectList = async (updatedSelectList: SelectList) => {
    try {
      const result = await updateSelectList(updatedSelectList.uid, {
        name: updatedSelectList.name,
        display_name: updatedSelectList.display_name,
        items: updatedSelectList.items
      });
      setSelectedSelectList(result);
    } catch (error) {
      console.error('Error updating select list:', error);
      alert('Failed to update select list');
    }
  };



  const getUserInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  // All select lists are public and accessible to all users
  const allSelectLists = selectLists;

  return (
    <div className="flex flex-1 min-h-0 gap-4 p-4 bg-gray-50">
      {/* Select List List Card */}
      <div className="w-80 min-w-[360px] flex-none bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
        <SelectListList
          isLoading={isLoading}
          selectLists={allSelectLists}
          selectedSelectList={selectedSelectList}
          user={user}
          getUserInitials={getUserInitials}
          handleSelectListSelect={handleSelectListSelect}
          setSelectListToDelete={setSelectListToDelete}
          setDeleteDialogOpen={setDeleteDialogOpen}
          newSelectListName={newSelectListName}
          setNewSelectListName={setNewSelectListName}
          newSelectListDisplayName={newSelectListDisplayName}
          setNewSelectListDisplayName={setNewSelectListDisplayName}
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          handleCreateSelectList={handleStartCreateSelectList}
          onDuplicateSelectList={handleDuplicateSelectList}
          panelState={panelState}
        />
      </div>

      {/* Select List Editor Card */}
      {(selectedSelectList || creatingNewSelectList) && (
        <div className="w-96 min-w-[384px] flex-none bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
          <SelectListEditor
            selectedSelectList={selectedSelectList}
            isEditingName={isEditingName}
            editingName={editingName}
            setIsEditingName={setIsEditingName}
            setEditingName={setEditingName}
            updateSelectListName={creatingNewSelectList ? handleSaveNewSelectList : handleUpdateSelectListName}
            onCancelEditName={handleCancelEditName}
            creatingNewSelectList={creatingNewSelectList}
            setCreatingNewSelectList={setCreatingNewSelectList}
            onUpdateSelectList={handleUpdateSelectList}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Select List</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectListToDelete?.display_name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelectList}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 