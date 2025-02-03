import React from 'react';
import { AlertCircle } from 'lucide-react';
import { UploadError } from '../types';

interface ErrorMessageProps {
  error: UploadError;
  onDismiss: () => void;
}

export function ErrorMessage({ error, onDismiss }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-700">{error.message}</p>
          {error.file && (
            <p className="mt-1 text-xs text-red-500">File: {error.file}</p>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="ml-auto text-red-400 hover:text-red-500"
        >
          ×
        </button>
      </div>
    </div>
  );
}