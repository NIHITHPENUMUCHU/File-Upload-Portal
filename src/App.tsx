import React, { useState, useCallback } from 'react';
import { FileUploadZone } from './components/FileUploadZone';
import { FileList } from './components/FileList';
import { ErrorMessage } from './components/ErrorMessage';
import { FileItem, UploadError } from './types';
import { generateId } from './utils';
import { Upload } from 'lucide-react';

export default function App() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<UploadError | null>(null);

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    selectedFiles.forEach((file) => {
      // Create a new file item
      const newFile: FileItem = {
        id: generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        progress: 0,
      };

      setFiles((prev) => [...prev, newFile]);

      // Simulate file upload with progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Create object URL for preview
          const url = URL.createObjectURL(file);
          
          // For text files, read the content
          if (file.type.startsWith('text/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const content = e.target?.result as string;
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === newFile.id ? { ...f, progress: 100, url, content } : f
                )
              );
            };
            reader.readAsText(file);
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === newFile.id ? { ...f, progress: 100, url } : f
              )
            );
          }
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, progress } : f
            )
          );
        }
      }, 200);
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.url) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Upload className="w-12 h-12 mx-auto text-blue-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            File Upload Portal
          </h1>
          <p className="mt-2 text-gray-600">
            Upload, manage, and preview your files
          </p>
        </div>

        {error && (
          <ErrorMessage
            error={error}
            onDismiss={() => setError(null)}
          />
        )}

        <div className="space-y-8">
          <FileUploadZone onFilesSelected={handleFilesSelected} />
          <FileList files={files} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}