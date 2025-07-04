'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Code, Database, Palette, HelpCircle, FileText } from 'lucide-react';

interface DocFile {
  name: string;
  title: string;
  description: string;
  path: string;
  category: 'overview' | 'technical' | 'user-guide';
  icon: React.ComponentType<{ className?: string }>;
}

const docFiles: DocFile[] = [
  {
    name: 'README.md',
    title: 'Application Overview',
    description: 'Complete guide to Drugissimo including features, technology stack, data model, and getting started instructions.',
    path: '/docs/README.md',
    category: 'overview',
    icon: BookOpen
  },
  {
    name: 'faq.md',
    title: 'User Guide & FAQ',
    description: 'Comprehensive user guide with step-by-step instructions, troubleshooting, and answers to common questions.',
    path: '/docs/faq.md',
    category: 'user-guide',
    icon: HelpCircle
  },
  {
    name: 'api.md',
    title: 'API Specification',
    description: 'Complete RESTful API reference with endpoints, data types, request/response examples, and authentication details.',
    path: '/docs/api.md',
    category: 'technical',
    icon: Code
  },
  {
    name: 'architecture.md',
    title: 'System Architecture',
    description: 'Technical architecture documentation covering system design, database schema, and deployment considerations.',
    path: '/docs/architecture.md',
    category: 'technical',
    icon: Database
  },
  {
    name: 'design.md',
    title: 'Design System',
    description: 'UI/UX design documentation including design principles, component system, and user experience patterns.',
    path: '/docs/design.md',
    category: 'technical',
    icon: Palette
  }
];

const categories = {
  overview: { name: 'Overview', description: 'Get started with Drugissimo' },
  'user-guide': { name: 'User Guide', description: 'Learn how to use Drugissimo' },
  technical: { name: 'Technical', description: 'Developer and technical documentation' }
};

export function DocumentationPage() {
  const [selectedDoc, setSelectedDoc] = useState<DocFile | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('overview');

  const fetchMarkdown = async (docPath: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(docPath);
      if (response.ok) {
        const content = await response.text();
        setMarkdownContent(content);
      } else {
        setMarkdownContent('# Document Not Found\n\nThe requested document could not be loaded.');
      }
    } catch (error) {
      setMarkdownContent('# Error Loading Document\n\nThere was an error loading the requested document.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocSelect = (doc: DocFile) => {
    setSelectedDoc(doc);
    setSelectedCategory(doc.category);
    fetchMarkdown(doc.path);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Select the first document in the category
    const firstDocInCategory = docFiles.find(doc => doc.category === category);
    if (firstDocInCategory) {
      setSelectedDoc(firstDocInCategory);
      fetchMarkdown(firstDocInCategory.path);
    }
  };

  // Auto-select first document on component mount
  useEffect(() => {
    if (!selectedDoc && docFiles.length > 0) {
      const firstDoc = docFiles[0];
      setSelectedDoc(firstDoc);
      setSelectedCategory(firstDoc.category);
      fetchMarkdown(firstDoc.path);
    }
  }, [selectedDoc]);

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.JSX.Element[] = [];
    let inCodeBlock = false;
    let inList = false;
    let listItems: React.JSX.Element[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc ml-6 mb-4 space-y-1">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          return;
        } else {
          flushList();
          inCodeBlock = true;
          elements.push(
            <div key={`code-${index}`} className="bg-slate-100 p-4 rounded-md my-4 font-mono text-sm overflow-x-auto border">
              <div className="text-slate-500 text-xs mb-2">Code Block</div>
            </div>
          );
          return;
        }
      }

      if (inCodeBlock) {
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={`h1-${index}`} className="text-3xl font-bold mt-6 mb-4 text-slate-900 border-b border-slate-200 pb-2">
            {line.substring(2)}
          </h1>
        );
        return;
      }
      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${index}`} className="text-2xl font-semibold mt-5 mb-3 text-slate-800">
            {line.substring(3)}
          </h2>
        );
        return;
      }
      if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${index}`} className="text-xl font-semibold mt-4 mb-2 text-slate-700">
            {line.substring(4)}
          </h3>
        );
        return;
      }
      if (line.startsWith('#### ')) {
        flushList();
        elements.push(
          <h4 key={`h4-${index}`} className="text-lg font-medium mt-3 mb-2 text-slate-700">
            {line.substring(5)}
          </h4>
        );
        return;
      }

      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          inList = true;
        }
        const itemText = line.substring(2);
        listItems.push(
          <li key={`li-${index}`} className="text-slate-700">
            {renderInlineMarkdown(itemText)}
          </li>
        );
        return;
      }

      // Flush list if we encounter a non-list item
      if (inList && line.trim() !== '') {
        flushList();
      }

      // Links
      if (line.includes('[') && line.includes('](') && line.includes(')')) {
        flushList();
        const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const [, text, url] = linkMatch;
          const isExternal = url.startsWith('http');
          const isInternalDoc = url.endsWith('.md');
          
          if (isInternalDoc) {
            const docName = url.split('/').pop()?.replace('.md', '');
            const doc = docFiles.find(d => d.name === docName);
            if (doc) {
              elements.push(
                <p key={`link-${index}`} className="mb-3">
                  <button
                    onClick={() => handleDocSelect(doc)}
                    className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                  >
                    {text}
                  </button>
                </p>
              );
              return;
            }
          }
          
          elements.push(
            <p key={`link-${index}`} className="mb-3">
              <a 
                href={url} 
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
              >
                {text}
              </a>
            </p>
          );
          return;
        }
      }

      // Empty lines
      if (line.trim() === '') {
        flushList();
        elements.push(<div key={`empty-${index}`} className="h-3"></div>);
        return;
      }

      // Regular paragraphs
      flushList();
      elements.push(
        <p key={`p-${index}`} className="mb-3 text-slate-700 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });

    // Flush any remaining list
    flushList();

    return elements;
  };

  const renderInlineMarkdown = (text: string): React.JSX.Element[] => {
    const elements: React.JSX.Element[] = [];
    let currentText = text;
    let keyIndex = 0;

    // Handle bold text
    while (currentText.includes('**')) {
      const parts = currentText.split('**');
      if (parts.length >= 3) {
        if (parts[0]) {
          elements.push(<span key={`text-${keyIndex++}`}>{parts[0]}</span>);
        }
        elements.push(<strong key={`bold-${keyIndex++}`}>{parts[1]}</strong>);
        currentText = parts.slice(2).join('**');
      } else {
        break;
      }
    }

    if (currentText) {
      elements.push(<span key={`text-${keyIndex++}`}>{currentText}</span>);
    }

    return elements;
  };

  const filteredDocs = docFiles.filter(doc => doc.category === selectedCategory);

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden bg-gray-50">
      <div className="flex flex-1 gap-6 p-6">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              {/* Category Navigation */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Categories</h3>
                <div className="space-y-2">
                  {Object.entries(categories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => handleCategorySelect(key)}
                      className={`w-full text-left p-2 rounded-md transition-colors text-sm ${
                        selectedCategory === key
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-slate-500">{category.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Document Navigation */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Documents</h3>
                {filteredDocs.map((doc) => {
                  const IconComponent = doc.icon;
                  return (
                    <button
                      key={doc.name}
                      onClick={() => handleDocSelect(doc)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        selectedDoc?.name === doc.name
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className="h-4 w-4" />
                        <div className="font-medium">{doc.title}</div>
                      </div>
                      <div className="text-sm text-slate-500">{doc.description}</div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                {selectedDoc && (
                  <>
                    <selectedDoc.icon className="h-6 w-6 text-indigo-600" />
                    <CardTitle className="text-2xl">
                      {selectedDoc.title}
                    </CardTitle>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              {!selectedDoc ? (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-semibold text-slate-700 mb-4">
                    Welcome to Drugissimo Documentation
                  </h2>
                  <p className="text-slate-600 mb-8">
                    Select a category and document from the sidebar to get started. The documentation covers everything from getting started to advanced technical details.
                  </p>
                  
                  {/* Category Cards */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {Object.entries(categories).map(([key, category]) => {
                      const categoryDocs = docFiles.filter(doc => doc.category === key);
                      return (
                        <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <h3 className="font-semibold text-slate-800 mb-2">{category.name}</h3>
                            <p className="text-sm text-slate-600 mb-4">{category.description}</p>
                            <div className="space-y-2">
                              {categoryDocs.map((doc) => {
                                const IconComponent = doc.icon;
                                return (
                                  <button
                                    key={doc.name}
                                    onClick={() => handleDocSelect(doc)}
                                    className="w-full text-left p-2 rounded hover:bg-slate-50 flex items-center gap-2 text-sm"
                                  >
                                    <IconComponent className="h-4 w-4 text-slate-500" />
                                    {doc.title}
                                  </button>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Quick Start Guide */}
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-indigo-900 mb-3">Quick Start</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-indigo-800 mb-2">For Users</h4>
                        <ul className="space-y-1 text-indigo-700">
                          <li>• Read the Application Overview</li>
                          <li>• Check the User Guide & FAQ</li>
                          <li>• Learn about data management</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-indigo-800 mb-2">For Developers</h4>
                        <ul className="space-y-1 text-indigo-700">
                          <li>• Review the API Specification</li>
                          <li>• Study the System Architecture</li>
                          <li>• Understand the Design System</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <span className="ml-3 text-slate-600">Loading document...</span>
                    </div>
                  ) : (
                    <div className="markdown-content">
                      {renderMarkdown(markdownContent)}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 