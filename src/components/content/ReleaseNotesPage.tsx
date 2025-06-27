'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ReleaseNote {
  version: string;
  date: string;
  title: string;
  features: string[];
  fixes: string[];
  improvements: string[];
}

const releaseNotes: ReleaseNote[] = [
  {
    version: "1.0",
    date: "2024-12-15",
    title: "Major Release - Full Feature Set",
    features: [
      "Complete entity management system with CRUD operations",
      "Advanced child entity collections with nested relationships",
      "Full authentication and authorization system",
      "Real-time data synchronization across all views",
      "Comprehensive search and filtering capabilities",
      "Export functionality for all data types",
      "Mobile-responsive design optimization"
    ],
    fixes: [
      "Resolved all known memory leaks in tree view component",
      "Fixed intermittent authentication timeout issues",
      "Corrected entity deletion cascade behavior",
      "Resolved data validation edge cases"
    ],
    improvements: [
      "50% performance improvement in large dataset handling",
      "Enhanced UI/UX with modern design system",
      "Improved error handling and user feedback",
      "Streamlined navigation and workflow patterns"
    ]
  },
  {
    version: "0.5",
    date: "2024-11-20",
    title: "Beta Release - Enhanced Features",
    features: [
      "Child entity collection management",
      "Advanced detail view with tabbed interface",
      "Form validation and error handling",
      "Basic authentication system",
      "Tree view navigation with entity hierarchy",
      "API integration for data persistence"
    ],
    fixes: [
      "Fixed entity selection state management",
      "Resolved form submission edge cases",
      "Corrected tree view expansion behavior",
      "Fixed responsive layout issues on tablet devices"
    ],
    improvements: [
      "Enhanced performance for tree rendering",
      "Improved form user experience",
      "Better error messaging throughout application",
      "Optimized API response handling"
    ]
  },
  {
    version: "0.1",
    date: "2024-10-15",
    title: "Initial Alpha Release",
    features: [
      "Basic entity management (view, create, edit)",
      "Simple tree view for entity navigation",
      "Basic detail view for entity information",
      "Foundation authentication framework",
      "Core API endpoints for entity operations",
      "Basic responsive layout structure"
    ],
    fixes: [
      "Initial bug fixes from development testing",
      "Resolved basic form validation issues",
      "Fixed initial load state handling"
    ],
    improvements: [
      "Established consistent styling patterns",
      "Set up development and build toolchain",
      "Implemented basic accessibility features"
    ]
  }
];

interface ReleaseNotesPageProps {
  selectedVersion?: string;
  onClose: () => void;
}

export function ReleaseNotesPage({ selectedVersion, onClose }: ReleaseNotesPageProps) {
  // If a specific version is selected, show only that version, otherwise show all
  const notesToShow = selectedVersion 
    ? releaseNotes.filter(note => note.version === selectedVersion)
    : releaseNotes;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedVersion ? `Release Notes - Version ${selectedVersion}` : 'Release Notes'}
            </h2>
            <p className="text-gray-600 mt-1">
              {selectedVersion 
                ? `Details for version ${selectedVersion}` 
                : 'Complete version history and feature updates'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            ← Back to Detail View
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-6 max-w-4xl">
          {notesToShow.map((release) => (
            <Card key={release.version} className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      v{release.version}
                    </Badge>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {release.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Released on {new Date(release.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {release.features.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      New Features
                    </h4>
                    <ul className="space-y-2">
                      {release.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2 mt-1">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.improvements.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Improvements
                    </h4>
                    <ul className="space-y-2">
                      {release.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2 mt-1">↗</span>
                          <span className="text-gray-700">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.fixes.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      Bug Fixes
                    </h4>
                    <ul className="space-y-2">
                      {release.fixes.map((fix, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-orange-600 mr-2 mt-1">🔧</span>
                          <span className="text-gray-700">{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 