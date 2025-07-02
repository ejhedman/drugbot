'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';
import { Button } from './button';

interface JsonViewerProps {
  data: any;
  title?: string;
  onCopy?: () => void;
}

interface JsonNodeProps {
  data: any;
  keyName?: string;
  level?: number;
}

function JsonNode({ data, keyName, level = 0 }: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const [copied, setCopied] = useState(false);

  const isObject = data !== null && typeof data === 'object';
  const isArray = Array.isArray(data);
  const isExpandable = isObject && Object.keys(data).length > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const toggleExpanded = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderValue = (value: any) => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (typeof value === 'string') return <span className="text-green-600">&quot;{value}&quot;</span>;
    if (typeof value === 'number') return <span className="text-blue-600">{value}</span>;
    if (typeof value === 'boolean') return <span className="text-purple-600">{value.toString()}</span>;
    if (isArray) return <span className="text-gray-600">[{Object.keys(value).length} items]</span>;
    if (isObject) return <span className="text-gray-600">{'{'}{Object.keys(value).length} properties{'}'}</span>;
    return <span className="text-gray-600">{String(value)}</span>;
  };

  return (
    <div className="font-mono text-sm">
      <div className="flex items-center space-x-1">
        {isExpandable && (
          <button
            onClick={toggleExpanded}
            className="p-0.5 hover:bg-gray-100 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-gray-500" />
            ) : (
              <ChevronRight className="h-3 w-3 text-gray-500" />
            )}
          </button>
        )}
        
        {keyName && (
          <span className="text-blue-800 font-semibold">&quot;{keyName}&quot;:</span>
        )}
        
        {!isExpandable && renderValue(data)}
        
        {isExpandable && !isExpanded && (
          <div className="flex items-center space-x-2">
            {renderValue(data)}
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-100 rounded"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3 text-gray-500" />
              )}
            </button>
          </div>
        )}
      </div>

      {isExpandable && isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <JsonNode
                data={value}
                keyName={key}
                level={level + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function JsonViewer({ data, title, onCopy }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="flex items-center space-x-2"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
        </Button>
      </div>
      
      <div className="bg-white border border-gray-200 rounded p-4 overflow-auto max-h-96">
        <JsonNode data={data} />
      </div>
    </div>
  );
} 