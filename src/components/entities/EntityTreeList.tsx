'use client';

import { useState, useEffect } from 'react';
import { UIEntity } from '@/model_defs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SquarePlus, Search, Pill, Tag, ChevronRight, ChevronDown } from 'lucide-react';
// import { shouldShowBorders } from '@/lib/borderUtils';
import { EntityListSkeleton, ChildEntitySkeleton } from '@/components/ui/skeleton';

interface EntityTreeListProps {
  selectedEntityKey: string | null;
  selectedChildKey: string | null;
  onEntitySelect: (entityKey: string) => void;
  onChildSelect: (childKey: string) => void;
  onAddEntity?: () => void;
  onAddChild?: (entityKey: string) => void;
}

export function EntityTreeList({ 
  selectedEntityKey, 
  selectedChildKey, 
  onEntitySelect, 
  onChildSelect, 
  onAddEntity, 
  onAddChild 
}: EntityTreeListProps) {
  const [entities, setEntities] = useState<UIEntity[]>([]);
  const [childrenMap, setChildrenMap] = useState<Record<string, UIEntity[]>>({});
  const [expandedEntities, setExpandedEntities] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingChildren, setLoadingChildren] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEntities();
  }, [searchTerm]);

  const fetchEntities = async () => {
    try {
      setLoading(true);
      const params = searchTerm 
        ? `?search=${encodeURIComponent(searchTerm)}&format=ui` 
        : '?format=ui';
      const response = await fetch(`/api/entities${params}`);
      if (response.ok) {
        const data = await response.json();
        // Add delay to see skeleton loader
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEntities(data);
      }
    } catch (error) {
      console.error('Error fetching entities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async (entityKey: string) => {
    if (childrenMap[entityKey]) return; // Already loaded
    
    try {
      setLoadingChildren(prev => new Set(prev).add(entityKey));
      const response = await fetch(`/api/children?entityKey=${encodeURIComponent(entityKey)}&format=ui`);
      if (response.ok) {
        const data = await response.json();
        // Add delay to see skeleton loader
        await new Promise(resolve => setTimeout(resolve, 1000));
        setChildrenMap(prev => ({
          ...prev,
          [entityKey]: data
        }));
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoadingChildren(prev => {
        const newSet = new Set(prev);
        newSet.delete(entityKey);
        return newSet;
      });
    }
  };

  const handleEntityClick = (entityKey: string) => {
    onEntitySelect(entityKey);
    
    // Toggle expansion
    const newExpanded = new Set(expandedEntities);
    if (newExpanded.has(entityKey)) {
      newExpanded.delete(entityKey);
    } else {
      // Close other expanded entities (only one open at a time)
      newExpanded.clear();
      newExpanded.add(entityKey);
      // Fetch children if not already loaded
      fetchChildren(entityKey);
    }
    setExpandedEntities(newExpanded);
  };

  const handleChildClick = (childKey: string) => {
    onChildSelect(childKey);
  };

  const handleAddChild = (entityKey: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent entity selection
    onAddChild?.(entityKey);
  };

  const isExpanded = (entityKey: string) => expandedEntities.has(entityKey);
  const isLoadingChildren = (entityKey: string) => loadingChildren.has(entityKey);
  const children = (entityKey: string) => childrenMap[entityKey] || [];

      return (
      <div className="flex-1 min-h-0 h-full flex flex-col bg-white shadow-accent-md rounded-xl m-4">
      {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-200 rounded-t-xl">
                  <h2 className="section-title text-white">Entities</h2>
        {onAddEntity && (
          <Button
            onClick={onAddEntity}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-xl text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            title="Add New Entity"
          >
            <SquarePlus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-sm py-2 rounded-xl"
          />
        </div>
      </div>

      {/* Entity Tree List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <EntityListSkeleton />
        ) : entities.length === 0 ? (
          <div className="px-4 py-3 text-center label">
            {searchTerm ? 'No entities found' : 'No entities available'}
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {entities.map((entity, index) => {
              const entityKey = entity.entityKey || entity.entityUid || `entity-${index}`;
              const uniqueKey = entity.entityUid || `entity-${index}`;
              
              return (
                <div key={uniqueKey} className="space-y-1">
                  {/* Entity Row */}
                  <div className="flex items-center gap-2 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleEntityClick(entityKey)}
                      className={`flex-1 text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm rounded-xl ${
                        selectedEntityKey === entityKey
                          ? 'bg-slate-100'
                          : 'hover-accent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded(entityKey) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                        <Pill className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-gray-900 text-sm">
                          {entity.displayName}
                        </span>
                      </div>
                    </button>
                    
                    {/* Add Child Button */}
                    {onAddChild && isExpanded(entityKey) && (
                      <Button
                        onClick={(e) => handleAddChild(entityKey, e)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 mr-2 rounded-xl text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                        title="Add Child Entity"
                      >
                        <SquarePlus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Children Section */}
                  {isExpanded(entityKey) && (
                    <div className="ml-6 space-y-1">
                      {isLoadingChildren(entityKey) ? (
                        <ChildEntitySkeleton />
                      ) : children(entityKey).length === 0 ? (
                        <div className="px-4 py-2 text-center label">
                          No children found
                        </div>
                      ) : (
                        children(entityKey).map((child, childIndex) => {
                          const childKey = child.entityKey || child.entityUid || `child-${childIndex}`;
                          const childUniqueKey = child.entityUid || `child-${childIndex}`;
                          
                          return (
                            <div
                              key={childUniqueKey}
                              onClick={() => handleChildClick(childKey)}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm rounded-xl cursor-pointer ${
                                selectedChildKey === childKey
                                  ? 'bg-green-50'
                                  : ''
                              }`}
                            >
                              <div className="flex items-center gap-3 font-medium text-gray-900 text-sm">
                                <Tag className="w-4 h-4 text-green-500" />
                                {child.displayName}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 