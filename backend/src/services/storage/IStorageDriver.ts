/**
 * Storage driver types and base class for Gahbaz.
 */

export interface UploadIntentOptions {
  fileName: string;
  fileType?: string;
  folder?: string;
  size?: number;
  isPrivate?: boolean;
}

export interface UploadIntentResult {
  success: boolean;
  directUpload: boolean;
  provider: string;
  uploadUrl: string;
  fileUrl?: string;
  key: string;
  folder?: string;
  method?: string;
  headers?: Record<string, string>;
  fields?: Record<string, any>;
  isPrivate: boolean;
}

export interface UploadFileOptions {
  key?: string;
  mimeType?: string;
  isPrivate?: boolean;
}

export interface UploadFileResult {
  success: boolean;
  provider: string;
  fileUrl: string;
  key: string;
  size: number;
  mimeType?: string;
  isPrivate: boolean;
}

export interface DownloadUrlOptions {
  isPrivate?: boolean;
  expiresIn?: number;
}

export abstract class IStorageDriver {
  abstract getUploadIntent(options: UploadIntentOptions): Promise<UploadIntentResult>;
  abstract uploadFile(buffer: Buffer, options: UploadFileOptions): Promise<UploadFileResult>;
  abstract getDownloadUrl(key: string, options?: DownloadUrlOptions): Promise<string>;
  abstract deleteFile(key: string): Promise<boolean>;
}

export default IStorageDriver;
