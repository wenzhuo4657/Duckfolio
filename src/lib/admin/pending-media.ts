const pendingFiles = new Map<string, File>();

export function addPendingMedia(file: File): string {
  const url = URL.createObjectURL(file);
  pendingFiles.set(url, file);
  return url;
}

export function getPendingMedia(blobUrl: string): File | undefined {
  return pendingFiles.get(blobUrl);
}

export function removePendingMedia(blobUrl: string) {
  const file = pendingFiles.get(blobUrl);
  if (file) {
    URL.revokeObjectURL(blobUrl);
    pendingFiles.delete(blobUrl);
  }
}

export function drainPendingMedia(): Map<string, File> {
  const snapshot = new Map(pendingFiles);
  pendingFiles.clear();
  return snapshot;
}

export function hasPendingMedia(): boolean {
  return pendingFiles.size > 0;
}
