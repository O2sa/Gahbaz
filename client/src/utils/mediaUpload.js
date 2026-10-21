import axios from 'axios';
import client from '../api/client';

/**
 * Universal media uploader supporting:
 * 1. Direct-to-Cloud PUT (AWS S3 & Wasabi) via Presigned URLs
 * 2. Direct-to-Cloud POST (Cloudinary) via Presigned Signatures
 * 3. Local Server Multipart Fallback via /api/v1/media/upload
 *
 * @param {File} file - The file to upload
 * @param {Object} options
 * @param {string} [options.folder='general'] - Subfolder/category (avatars, covers, videos, assignments)
 * @param {boolean} [options.isPrivate=false] - Whether file requires authenticated access
 * @param {Function} [options.onProgress] - Callback receiving upload percentage (0 - 100)
 * @returns {Promise<{ url: string, key: string, provider: string, size: number, mimeType: string }>}
 */
export async function uploadMedia(file, { folder = 'general', isPrivate = false, onProgress } = {}) {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  // 1. Request upload intent from backend
  const intent = await client.post('/media/presigned-url', {
    fileName: file.name,
    fileType: file.type || 'application/octet-stream',
    folder,
    size: file.size,
    isPrivate,
  });

  // 2. Direct upload to S3 or Wasabi
  if (intent.directUpload && (intent.provider === 's3' || intent.provider === 'wasabi')) {
    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(intent.method || 'PUT', intent.uploadUrl, true);

      if (intent.headers) {
        Object.entries(intent.headers).forEach(([key, val]) => {
          xhr.setRequestHeader(key, val);
        });
      }

      if (onProgress && xhr.upload) {
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const percent = Math.round((evt.loaded * 100) / evt.total);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Direct S3 upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during S3 upload'));
      xhr.send(file);
    });

    if (onProgress) onProgress(100);

    return {
      url: intent.fileUrl,
      key: intent.key,
      provider: intent.provider,
      size: file.size,
      mimeType: file.type,
    };
  }

  // 3. Direct upload to Cloudinary
  if (intent.directUpload && intent.provider === 'cloudinary') {
    const formData = new FormData();
    Object.entries(intent.fields || {}).forEach(([k, v]) => formData.append(k, v));
    formData.append('file', file);

    const res = await axios.post(intent.uploadUrl, formData, {
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      },
    });

    if (onProgress) onProgress(100);

    return {
      url: res.data.secure_url,
      key: res.data.public_id,
      provider: 'cloudinary',
      size: res.data.bytes || file.size,
      mimeType: file.type,
    };
  }

  // 4. Local storage fallback via backend multipart
  const formData = new FormData();
  formData.append('folder', folder);
  if (intent.key) formData.append('key', intent.key);
  formData.append('isPrivate', String(isPrivate));
  formData.append('file', file);

  // Use raw axios to preserve full progress and avoid content-type JSON conflict
  const queryParams = new URLSearchParams({
    folder,
    isPrivate: String(isPrivate),
  }).toString();
  const res = await axios.post(`/api/v1/media/upload?${queryParams}`, formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded * 100) / evt.total));
      }
    },
  });

  const data = res.data?.data || res.data;
  if (onProgress) onProgress(100);

  return {
    url: data.fileUrl,
    key: data.key,
    provider: 'local',
    size: data.size || file.size,
    mimeType: data.mimeType || file.type,
  };
}

export default uploadMedia;
