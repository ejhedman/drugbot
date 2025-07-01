'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TabTable } from './TabTable';
import { TabProperties } from './TabProperties';
import { getBorderClasses } from '@/lib/borderUtils';

export interface TabConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  data: any[] | Record<string, any>;
  emptyMessage?: string;
  schemaEntityName?: string; // Schema entity name for metadata lookup
  isTable: boolean; // Whether this aggregate should be displayed as a table (true) or as properties (false) - REQUIRED
  canEdit?: boolean; // Whether edit controls should be shown
}

export interface TabCallbacks {
  onUpdate?: (id: string | number, data: any) => Promise<void>;
  onDelete?: (id: string | number) => Promise<void>;
  onCreate?: (data: any) => Promise<void>;
}

interface CollectionTabSetProps {
  tabs: TabConfig[];
  defaultTab?: string;
  loading?: boolean;
  callbacks?: Record<string, TabCallbacks>; // Map of tab key to callbacks
  className?: string;
}

export function CollectionTabSet({ 
  tabs, 
  defaultTab, 
  loading = false, 
  callbacks = {},
  className = "border border-accent rounded-2xl bg-white mt-4 shadow-accent"
}: CollectionTabSetProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key || '');

  const determineTabType = (isTable: boolean): 'table' | 'properties' => {
    // Decision based SOLELY on the isTable property from aggregate schema
    return isTable ? 'table' : 'properties';
  };

  const getTabData = (tabConfig: TabConfig) => {
    if (determineTabType(tabConfig.isTable) === 'table') {
      return Array.isArray(tabConfig.data) ? tabConfig.data : [];
    } else {
      // For properties display: use first row if array has data, otherwise use data as-is
      return Array.isArray(tabConfig.data) && tabConfig.data.length > 0
        ? tabConfig.data[0] 
        : Array.isArray(tabConfig.data) ? {} : tabConfig.data;
    }
  };

  const renderTabContent = (tabConfig: TabConfig) => {
    const tabType = determineTabType(tabConfig.isTable);
    const tabCallbacks = callbacks[tabConfig.key] || {};
    
    if (tabType === 'table') {
      return (
        <TabTable
          data={getTabData(tabConfig)}
          title={tabConfig.label}
          emptyMessage={tabConfig.emptyMessage}
          loading={loading}
          onUpdate={tabCallbacks.onUpdate}
          onDelete={tabCallbacks.onDelete}
          onCreate={tabCallbacks.onCreate}
          schemaEntityName={tabConfig.schemaEntityName}
          canEdit={tabConfig.canEdit}
        />
      );
    } else {
      return (
        <TabProperties
          data={getTabData(tabConfig)}
          title={tabConfig.label}
          emptyMessage={tabConfig.emptyMessage}
          loading={loading}
          onUpdate={tabCallbacks.onUpdate}
          schemaEntityName={tabConfig.schemaEntityName}
          canEdit={tabConfig.canEdit}
        />
      );
    }
  };

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className={`${className} flex flex-col`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className={getBorderClasses("flex flex-col flex-1 min-h-0", "border-6 border-red-500")}>
        <TabsList className="flex w-full bg-transparent rounded-t-2xl flex-shrink-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border-b-2 border-b-indigo-200 data-[state=active]:border-b-indigo-500 data-[state=active]:text-indigo-700 data-[state=active]:bg-white focus:outline-none focus:ring-0 shadow-none ring-0 rounded-none"
            >
              {tab.icon} {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className={getBorderClasses("flex-1 min-h-0 overflow-hidden", "border-6 border-green-500")}>
            {renderTabContent(tab)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 