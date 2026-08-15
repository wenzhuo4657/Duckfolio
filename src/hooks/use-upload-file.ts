import * as React from 'react';

import { toast } from 'sonner';
import { z } from 'zod';

import { addPendingMedia } from '@/lib/admin/pending-media';

export interface UploadedFile<T = unknown> {
  appUrl?: string;
  key: string;
  name: string;
  serverData?: T;
  size: number;
  type: string;
  url: string;
}

interface UseUploadFileProps {
  headers?: HeadersInit;
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
}

export function useUploadFile({
  onUploadComplete,
  onUploadError,
  ...props
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadRepositoryMedia(file: File) {
    setIsUploading(true);
    setUploadingFile(file);
    setProgress(10);

    try {
      const blobUrl = addPendingMedia(file);

      setProgress(100);

      const uploaded: UploadedFile = {
        appUrl: blobUrl,
        key: blobUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        url: blobUrl,
      };

      setUploadedFile(uploaded);
      onUploadComplete?.(uploaded);

      return uploaded;
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      toast.error(errorMessage || 'Something went wrong, please try again later.');

      onUploadError?.(error);

      const mockUploadedFile = {
        key: 'mock-key-0',
        appUrl: `https://mock-app-url.com/${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      } as UploadedFile;

      setUploadedFile(mockUploadedFile);

      return mockUploadedFile;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile: uploadRepositoryMedia,
    uploadingFile,
  };
}

export function getErrorMessage(err: unknown) {
  const unknownError = 'Something went wrong, please try again later.';

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => issue.message);

    return errors.join('\n');
  }
  if (err instanceof Error) {
    return err.message;
  }
  return unknownError;
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);

  return toast.error(errorMessage);
}
