'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TabTable } from './TabTable';
import { TabProperties } from './TabProperties';

export interface TabConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  data: any[] | Record<string, any>;
  emptyMessage?: string;
  type?: 'table' | 'properties' | 'auto';
  schemaEntityName?: string; // Schema entity name for metadata lookup
}

export interface TabCallbacks {
  onUpdate?: (index: number, data: any) => Promise<void>;
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

  const determineTabType = (data: any[] | Record<string, any>): 'table' | 'properties' => {
    return Array.isArray(data) && data.length > 1 ? 'table' : 'properties';
  };

  const getTabData = (tabConfig: TabConfig) => {
    if (tabConfig.type === 'table' || (tabConfig.type === 'auto' && determineTabType(tabConfig.data) === 'table')) {
      return Array.isArray(tabConfig.data) ? tabConfig.data : [];
    } else {
      return Array.isArray(tabConfig.data) && tabConfig.data.length === 1 
        ? tabConfig.data[0] 
        : Array.isArray(tabConfig.data) ? {} : tabConfig.data;
    }
  };

  const renderTabContent = (tabConfig: TabConfig) => {
    const tabType = tabConfig.type === 'auto' ? determineTabType(tabConfig.data) : (tabConfig.type || 'properties');
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
        />
      );
    }
  };

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full bg-transparent rounded-t-2xl">
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
          <TabsContent key={tab.key} value={tab.key} className="pt-4 pb-4">
            {renderTabContent(tab)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 