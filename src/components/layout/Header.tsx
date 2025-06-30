'use client';

import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, HelpCircle, Download, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

interface HeaderProps {
  onLogin?: () => void;
  onLogout: () => void;
}

export function Header({ onLogin, onLogout }: HeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get display name and avatar from GitHub user data
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;

  const handleDocsClick = () => {
    router.push('/docs');
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

    const successFiles: string[] = [];

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
        console.log('File uploaded successfully:', result);
        successFiles.push(file.name);
        
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Failed to upload "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (successFiles.length > 0) {
      setUploadedFiles(successFiles);
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

    const successFiles: string[] = [];

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
        console.log('File uploaded successfully:', result);
        successFiles.push(file.name);
        
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Failed to upload "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (successFiles.length > 0) {
      setUploadedFiles(successFiles);
      setUploadSuccess(true);
    }
  }, []);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleCloseUpload = () => {
    setUploadSuccess(false);
    setUploadedFiles([]);
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
    <header className="bg-slate-200 px-6 flex justify-between items-center border-b border-slate-200 shadow-sm" style={{ minHeight: '100px' }}>
      <div className="flex items-center">
        <div className="h-24 rounded-xl overflow-hidden">
          <Image 
            src="/Mapissimo.png" 
            alt="Entity Manager Logo" 
            width={0}
            height={0}
            sizes="100vw"
            className="h-24 w-auto object-contain"
            priority
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-3">
              {/* Export Icon */}
              <Dialog
                open={isDownloadDialogOpen}
                onOpenChange={(open) => {
                  setIsDownloadDialogOpen(open);
                  if (open) setIsDownloading(false);
                }}
              >
                <DialogTrigger asChild>
                  <button
                    className="text-slate-600 hover:text-slate-800 transition-colors"
                    title="Export Data"
                  >
                    <Download className="h-5 w-5" />
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
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="text-slate-600 hover:text-slate-800 transition-colors"
                    title="Upload File"
                  >
                    <Upload className="h-5 w-5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {uploadSuccess ? 'Upload Complete' : 'Upload Excel File'}
                    </DialogTitle>
                    <DialogDescription>
                      {uploadSuccess 
                        ? `${uploadedFiles.length} file(s) uploaded successfully`
                        : 'Drag and drop an Excel file (.xlsx or .xls) to upload'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  {uploadSuccess ? (
                    <div className="text-center py-8">
                      <div className="mx-auto h-12 w-12 text-green-500 mb-4">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Files Uploaded Successfully!
                      </h3>
                      <div className="text-sm text-gray-600 mb-6">
                        {uploadedFiles.map((fileName, index) => (
                          <div key={index} className="py-1">
                            ✓ {fileName}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={handleCloseUpload}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  ) : (
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
                  )}
                </DialogContent>
              </Dialog>

              {/* Help Icon */}
              <button
                onClick={handleDocsClick}
                className="text-slate-600 hover:text-slate-800 transition-colors"
                title="Documentation"
              >
                <HelpCircle className="h-5 w-5" />
              </button>

              {avatarUrl && (
                <Image
                  src={avatarUrl}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="label text-slate-700">Welcome, {displayName}</span>
            </div>
            <Button
              onClick={onLogout}
              size="sm"
              variant="outline"
              className="px-4 py-2 rounded-xl border-slate-400 text-slate-700 hover:bg-slate-600 hover:text-white hover:border-slate-600 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </>
        ) : null}
      </div>
    </header>
  );
} 