export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  progress: number;
  url?: string;
  content?: string;
}

export interface UploadError {
  message: string;
  file?: string;
}