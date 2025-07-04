import { useState, useEffect } from 'react';

export interface SelectListItem {
  text: string;
  code: string;
  ordinal: number;
}

export interface SelectList {
  uid: string;
  name: string;
  display_name: string;
  items: SelectListItem[];
  created_at: string;
  updated_at: string;
}

export function useSelectLists() {
  const [selectLists, setSelectLists] = useState<SelectList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSelectLists = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/select-lists');
      if (response.ok) {
        const data = await response.json();
        setSelectLists(data.selectLists || []);
      } else {
        setError('Failed to fetch select lists');
      }
    } catch (error) {
      console.error('Error fetching select lists:', error);
      setError('Failed to fetch select lists');
    } finally {
      setIsLoading(false);
    }
  };

  const createSelectList = async (selectListData: {
    name: string;
    display_name: string;
    items: SelectListItem[];
  }) => {
    try {
      const response = await fetch('/api/select-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectListData)
      });

      if (response.ok) {
        const data = await response.json();
        setSelectLists(prev => [data.selectList, ...prev]);
        return data.selectList;
      } else {
        throw new Error('Failed to create select list');
      }
    } catch (error) {
      console.error('Error creating select list:', error);
      throw error;
    }
  };

  const updateSelectList = async (uid: string, selectListData: {
    name: string;
    display_name: string;
    items: SelectListItem[];
  }) => {
    try {
      const response = await fetch('/api/select-lists', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, ...selectListData })
      });

      if (response.ok) {
        const data = await response.json();
        setSelectLists(prev => prev.map(sl => sl.uid === uid ? data.selectList : sl));
        return data.selectList;
      } else {
        throw new Error('Failed to update select list');
      }
    } catch (error) {
      console.error('Error updating select list:', error);
      throw error;
    }
  };

  const deleteSelectList = async (uid: string) => {
    try {
      const response = await fetch(`/api/select-lists?uid=${uid}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSelectLists(prev => prev.filter(sl => sl.uid !== uid));
        return true;
      } else {
        throw new Error('Failed to delete select list');
      }
    } catch (error) {
      console.error('Error deleting select list:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSelectLists();
  }, []);

  return {
    selectLists,
    isLoading,
    error,
    fetchSelectLists,
    createSelectList,
    updateSelectList,
    deleteSelectList
  };
} 