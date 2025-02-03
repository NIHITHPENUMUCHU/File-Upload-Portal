import React, { useState } from 'react';
import { FileItem } from '../types';
import { FileIcon, ImageIcon, FileTextIcon, Trash2, Eye, EyeOff, Download } from 'lucide-react';
import { formatFileSize } from '../utils';

interface FileListProps {
  files: FileItem[];
  onDelete: (id: string) => void;
}

export function FileList({ files, onDelete }: FileListProps) {
  const [expandedFile, setExpandedFile] = useState<string | null>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-6 h-6" />;
    if (type === 'application/pdf') return <FileIcon className="w-6 h-6" />;
    return <FileTextIcon className="w-6 h-6" />;
  };

  const getFileColor = (type: string) => {
    if (type.startsWith('image/')) return 'bg-pink-50 text-pink-500';
    if (type === 'application/pdf') return 'bg-blue-50 text-blue-500';
    return 'bg-purple-50 text-purple-500';
  };

  const renderPreview = (file: FileItem) => {
    if (file.type.startsWith('image/') && file.url) {
      return (
        <div className="relative rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-auto max-h-96 object-contain"
          />
        </div>
      );
    }
    
    if (file.type === 'application/pdf' && file.url) {
      return (
        <div className="relative rounded-lg overflow-hidden bg-gray-50 border border-gray-200 h-[600px]">
          <iframe
            src={file.url}
            title={file.name}
            className="w-full h-full"
            style={{ border: 'none' }}
          />
        </div>
      );
    }
    
    if (file.type.startsWith('text/') && file.content) {
      return (
        <div className="rounded-lg bg-gray-50 border border-gray-200">
          <div className="p-4 overflow-x-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {file.content}
            </pre>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${getFileColor(file.type)}`}>
            {getFileIcon(file.type)}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {file.name}
            </p>
            <p className="text-sm text-gray-500">
              This file type cannot be previewed
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <FileIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {files.map((file) => {
        const isExpanded = expandedFile === file.id;
        const fileColor = getFileColor(file.type);

        return (
          <div
            key={file.id}
            className={`bg-white rounded-lg shadow transition-all duration-300 ease-in-out
              ${isExpanded ? 'scale-102 ring-2 ring-blue-500 ring-opacity-50' : 'hover:shadow-lg'}`}
          >
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${fileColor}`}>
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                  </p>
                  {file.progress < 100 && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 rounded-full h-1.5 transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {file.progress === 100 && (
                    <>
                      <button
                        onClick={() => setExpandedFile(isExpanded ? null : file.id)}
                        className={`p-2 rounded-full transition-colors duration-200
                          ${isExpanded ? 'text-blue-500 bg-blue-50 hover:bg-blue-100' : 'text-gray-400 hover:text-blue-500 hover:bg-gray-100'}`}
                        title={isExpanded ? 'Hide preview' : 'Show preview'}
                      >
                        {isExpanded ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      {file.url && (
                        <a
                          href={file.url}
                          download={file.name}
                          className="p-2 text-gray-400 hover:text-green-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          title="Download file"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                      )}
                      <button
                        onClick={() => onDelete(file.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        title="Delete file"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {isExpanded && file.progress === 100 && (
                <div className="mt-4 transition-all duration-300 ease-in-out animate-fadeIn">
                  {renderPreview(file)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}