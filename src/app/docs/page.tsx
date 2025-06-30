'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DocFile {
  name: string;
  title: string;
  description: string;
  path: string;
}

const docFiles: DocFile[] = [
  {
    name: 'README.md',
    title: 'Application Overview',
    description: 'Complete guide to the Drug Database Application including features, architecture, and getting started instructions.',
    path: '/docs/README.md'
  },
  {
    name: 'api.md',
    title: 'API Specification',
    description: 'Complete API reference with endpoints, data types, request/response examples, and authentication details.',
    path: '/docs/api.md'
  },
  {
    name: 'KEY_UID_DESIGN.md',
    title: 'Database Design',
    description: 'Technical documentation covering database schema, key/UID design decisions, and relationship mapping.',
    path: '/docs/KEY_UID_DESIGN.md'
  },
  {
    name: 'questions.md',
    title: 'FAQ & Questions',
    description: 'Common questions and answers about the system, troubleshooting, and usage guidelines.',
    path: '/docs/questions.md'
  }
];

export default function DocsPage() {
  const [selectedDoc, setSelectedDoc] = useState<DocFile | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
    fetchMarkdown(doc.path);
  };

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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {docFiles.map((doc) => (
                    <button
                      key={doc.name}
                      onClick={() => handleDocSelect(doc)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        selectedDoc?.name === doc.name
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="font-medium">{doc.title}</div>
                      <div className="text-sm text-slate-500 mt-1">{doc.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    {selectedDoc ? selectedDoc.title : 'Documentation'}
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/')}
                  >
                    Back to App
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!selectedDoc ? (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold text-slate-700 mb-4">
                      Welcome to the Documentation
                    </h2>
                    <p className="text-slate-600 mb-8">
                      Select a document from the sidebar to get started. The documentation covers everything from getting started to advanced API usage.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {docFiles.map((doc) => (
                        <Card key={doc.name} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-slate-800 mb-2">{doc.title}</h3>
                            <p className="text-sm text-slate-600">{doc.description}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-3"
                              onClick={() => handleDocSelect(doc)}
                            >
                              Read More
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
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
    </div>
  );
} 