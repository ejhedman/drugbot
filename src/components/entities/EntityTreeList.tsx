'use client';

import { useState, useEffect } from 'react';
import { UIEntity } from '@/model_defs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SquarePlus, Search, Pill, Tag, ChevronRight, ChevronDown, RefreshCw } from 'lucide-react';
import { EntityListSkeleton, ChildEntitySkeleton } from '@/components/ui/skeleton';
import { getBorderClasses } from '@/lib/borderUtils';

interface EntityTreeListProps {
  selectedEntityUid: string | null;
  selectedChildUid: string | null;
  onEntitySelect: (entityUid: string) => void;
  onChildSelect: (childUid: string) => void;
  onAddEntity?: () => void;
  onAddChild?: (entityUid: string) => void;
  refreshTrigger?: number; // Add refresh trigger prop
}

export function EntityTreeList({ 
  selectedEntityUid, 
  selectedChildUid, 
  onEntitySelect, 
  onChildSelect, 
  onAddEntity, 
  onAddChild,
  refreshTrigger = 0
}: EntityTreeListProps) {
  const [entities, setEntities] = useState<UIEntity[]>([]);
  const [childrenMap, setChildrenMap] = useState<Record<string, UIEntity[]>>({});
  const [expandedEntities, setExpandedEntities] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingChildren, setLoadingChildren] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTreeData();
  }, [refreshTrigger]); // Refresh when refreshTrigger changes

  useEffect(() => {
    if (searchTerm) {
      // For search, we'll filter the existing tree data
      filterTreeData();
    } else {
      fetchTreeData();
    }
  }, [searchTerm]);

  const fetchTreeData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/entities/tree');
      if (response.ok) {
        const data = await response.json();
        setEntities(data.ancestors || []);
        setChildrenMap(data.childrenMap || {});
      }
    } catch (error) {
      console.error('Error fetching tree data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTreeData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dynamic-select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          table: 'generic_drugs',
          where: searchTerm ? { generic_name: searchTerm } : undefined,
          orderBy: { generic_name: 'asc' }
        }),
      });
      if (response.ok) {
        const result = await response.json();
        // Convert raw database rows to UIEntity format
        const entities: UIEntity[] = result.data.map((row: any) => ({
          entityUid: row.uid,
          displayName: row.generic_name,
          properties: [
            { propertyName: 'uid', propertyValue: row.uid, isVisible: false, isEditable: false, isId: true, controlType: 'text', isRequired: true, ordinal: 1 },
            { propertyName: 'generic_key', propertyValue: row.generic_key, isVisible: false, isEditable: false, isId: false, controlType: 'text', isRequired: true, ordinal: 2 },
            { propertyName: 'generic_name', propertyValue: row.generic_name, isVisible: true, isEditable: true, isId: false, controlType: 'text', isRequired: true, ordinal: 3 },
            { propertyName: 'biologic', propertyValue: row.biologic, isVisible: true, isEditable: true, isId: false, controlType: 'text', isRequired: false, ordinal: 4 },
            { propertyName: 'mech_of_action', propertyValue: row.mech_of_action, isVisible: true, isEditable: true, isId: false, controlType: 'text', isRequired: false, ordinal: 5 },
            { propertyName: 'class_or_type', propertyValue: row.class_or_type, isVisible: true, isEditable: true, isId: false, controlType: 'text', isRequired: false, ordinal: 6 },
            { propertyName: 'target', propertyValue: row.target, isVisible: true, isEditable: true, isId: false, controlType: 'text', isRequired: false, ordinal: 7 }
          ],
          aggregates: [],
          ancestors: [],
          children: []
        }));
        setEntities(entities);
        // Clear children map for search results
        setChildrenMap({});
      }
    } catch (error) {
      console.error('Error searching entities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTreeData();
  };

  const handleEntityClick = (entityUid: string) => {
    onEntitySelect(entityUid);
    
    // Toggle expansion
    const newExpanded = new Set(expandedEntities);
    if (newExpanded.has(entityUid)) {
      newExpanded.delete(entityUid);
    } else {
      // Close other expanded entities (only one open at a time)
      newExpanded.clear();
      newExpanded.add(entityUid);
    }
    setExpandedEntities(newExpanded);
  };

  const handleAddChild = (entityUid: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent entity selection
    onAddChild?.(entityUid);
  };

  const isExpanded = (entityUid: string) => expandedEntities.has(entityUid);
  const children = (entityUid: string) => childrenMap[entityUid] || [];

  return (
    <div className={getBorderClasses("flex-1 min-h-0 h-full flex flex-col bg-white rounded-xl p-4", "border-6 border-orange-500")}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-200 rounded-t-xl">
        <h2 className="section-title text-white">Entities</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-xl text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            title="Refresh Tree"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          {onAddEntity && (
            <Button
              onClick={onAddEntity}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 rounded-xl text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
              title="Add New Item"
            >
              <SquarePlus className="h-4 w-4" />
            </Button>
          )}
        </div>
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

      {/* Tree List */}
      <div className="flex-1 overflow-y-scroll scrollbar-always-visible">
        {loading ? (
          <EntityListSkeleton />
        ) : entities.length === 0 ? (
          <div className="px-4 py-3 text-center label">
            {searchTerm ? 'No entities found' : 'No entities available'}
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {entities.map((entity, index) => {
              const entityUid = entity.entityUid || `entity-${index}`;
              const uniqueKey = entity.entityUid || `entity-${index}`;
              
              return (
                <div key={uniqueKey} className="space-y-1">
                  {/* Row */}
                  <div className="flex items-center gap-2 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleEntityClick(entityUid)}
                      className={`flex-1 text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm rounded-xl ${
                        selectedEntityUid === entityUid
                          ? 'bg-slate-100'
                          : 'hover-accent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded(entityUid) ? (
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
                  </div>

                  {/* Children Section */}
                  {isExpanded(entityUid) && (
                    <div className="ml-6 space-y-1">
                      {children(entityUid).length === 0 ? (
                        <div className="px-4 py-2 text-center label">
                          No children found
                        </div>
                      ) : (
                        children(entityUid).map((child, childIndex) => {
                          const childUid = child.entityUid || `child-${childIndex}`;
                          
                          return (
                            <div
                              key={childUid}
                              onClick={() => onChildSelect(childUid)}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm rounded-xl cursor-pointer ${
                                selectedChildUid === childUid
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