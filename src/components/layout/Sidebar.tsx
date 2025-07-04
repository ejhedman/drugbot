'use client';

import { Home, Pill, BarChart3, List, HelpCircle, Download, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeFeature: string;
  onFeatureChange: (feature: string) => void;
}

export function Sidebar({ activeFeature, onFeatureChange }: SidebarProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [processingResults, setProcessingResults] = useState<any[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const features = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'drugs', icon: Pill, label: 'Drugs' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
  ];

  const handleDocsClick = () => {
    onFeatureChange('documentation');
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const xlsxFiles = files.filter(file => 
      file.name.toLowerCase().endsWith('.xlsx') || 
      file.name.toLowerCase().endsWith('.xls')
    );
    
    if (xlsxFiles.length === 0) {
      alert('Please select only Excel files (.xlsx or .xls)');
      return;
    }

    setIsProcessing(true);
    const successFiles: string[] = [];
    const allProcessingResults: any[] = [];

    // Upload each file
    for (const file of xlsxFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();
        console.log('File uploaded and processed successfully:', result);
        successFiles.push(file.name);
        
        // Add processing results
        if (result.processedFiles) {
          allProcessingResults.push(...result.processedFiles);
        }
        
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Failed to upload "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    setIsProcessing(false);
    if (successFiles.length > 0) {
      setUploadedFiles(successFiles);
      setProcessingResults(allProcessingResults);
      setUploadSuccess(true);
    }
  }, []);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return;
    
    const xlsxFiles = Array.from(files).filter(file => 
      file.name.toLowerCase().endsWith('.xlsx') || 
      file.name.toLowerCase().endsWith('.xls')
    );
    
    if (xlsxFiles.length === 0) {
      alert('Please select only Excel files (.xlsx or .xls)');
      return;
    }

    setIsProcessing(true);
    const successFiles: string[] = [];
    const allProcessingResults: any[] = [];

    // Upload each file
    for (const file of xlsxFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();
        console.log('File uploaded and processed successfully:', result);
        successFiles.push(file.name);
        
        // Add processing results
        if (result.processedFiles) {
          allProcessingResults.push(...result.processedFiles);
        }
        
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Failed to upload "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    setIsProcessing(false);
    if (successFiles.length > 0) {
      setUploadedFiles(successFiles);
      setProcessingResults(allProcessingResults);
      setUploadSuccess(true);
    }
  }, []);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleCloseUpload = () => {
    setUploadSuccess(false);
    setIsProcessing(false);
    setUploadedFiles([]);
    setProcessingResults([]);
    setIsDragOver(false);
    setIsUploadDialogOpen(false);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/export');
      if (!response.ok) throw new Error('Failed to download file');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'drugbot_export.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      handleCloseDownloadDialog();
    } catch (err) {
      alert('Failed to download file');
      setIsDownloading(false);
    }
  };

  const handleCloseDownloadDialog = () => {
    setIsDownloadDialogOpen(false);
    setIsDownloading(false);
  };

  return (
    <div className="w-16 flex-none bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4 h-full">
      {/* Top section with feature navigation */}
      <div className="flex flex-col items-center space-y-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;
          
          return (
            <button
              key={feature.id}
              onClick={() => onFeatureChange(feature.id)}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 group relative",
                isActive 
                  ? "bg-blue-500 text-white shadow-md" 
                  : "bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              )}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      {/* Bottom section with utility buttons */}
      <div className="flex flex-col items-center space-y-4 mt-auto">

        {/* Select Lists Icon */}
        <button
          onClick={() => onFeatureChange('select-lists')}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 group relative",
            activeFeature === 'select-lists'
              ? "bg-blue-500 text-white shadow-md" 
              : "bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          )}
        >
          <List size={20} />
        </button>

        {/* Download Icon */}
        <Dialog
          open={isDownloadDialogOpen}
          onOpenChange={(open) => {
            setIsDownloadDialogOpen(open);
            if (open) setIsDownloading(false);
          }}
        >
          <DialogTrigger asChild>
            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 group relative bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            >
              <Download size={20} />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Data</DialogTitle>
              <DialogDescription>
                Export your data to Excel format
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="default"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? 'Downloading...' : 'Download'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCloseDownloadDialog}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload Icon */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 group relative bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            >
              <Upload size={20} />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            {uploadSuccess ? (
              // Status/Results View
              <>
                <DialogHeader>
                  <DialogTitle>Upload Complete</DialogTitle>
                  <DialogDescription>
                    {uploadedFiles.length} file(s) uploaded and processed successfully
                  </DialogDescription>
                </DialogHeader>
                
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 text-green-500 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Files Uploaded and Processed Successfully!
                  </h3>
                  <div className="text-sm text-gray-600 mb-6">
                    {uploadedFiles.map((fileName, index) => (
                      <div key={index} className="py-1">
                        ✓ {fileName}
                      </div>
                    ))}
                  </div>
                  
                  {/* Processing Results */}
                  {processingResults.length > 0 && (
                    <div className="text-left mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Processing Results:</h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {processingResults.map((result, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-md">
                            <div className="font-medium text-gray-800 mb-1">
                              {result.worksheetName}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Total rows: {result.totalRows}</div>
                              <div className="flex gap-4">
                                <span className="text-green-600">New: {result.newRows}</span>
                                <span className="text-blue-600">Existing: {result.existingRows}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                CSV saved to: {result.csvPath.split('/').pop()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={handleCloseUpload}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : isProcessing ? (
              // Processing View
              <>
                <DialogHeader>
                  <DialogTitle>Processing Files</DialogTitle>
                  <DialogDescription>
                    Please wait while your files are being uploaded and processed...
                  </DialogDescription>
                </DialogHeader>
                
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-blue-500 mb-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Processing...
                  </h3>
                  <p className="text-sm text-gray-600">
                    Extracting worksheets, comparing with database, and generating CSV files.
                  </p>
                </div>
              </>
            ) : (
              // Upload Zone View
              <>
                <DialogHeader>
                  <DialogTitle>Upload Excel File</DialogTitle>
                  <DialogDescription>
                    Drag and drop an Excel file (.xlsx or .xls) to upload and process
                  </DialogDescription>
                </DialogHeader>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">
                    {isDragOver ? 'Drop your file here' : 'Drag and drop your Excel file here'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 mb-4">
                    Supports .xlsx and .xls files
                  </p>
                  <button
                    onClick={handleClickUpload}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Or click to select files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Help Icon */}
        <button
          onClick={handleDocsClick}
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 group relative bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800"
        >
          <HelpCircle size={20} />
        </button>

      </div>
    </div>
  );
} 