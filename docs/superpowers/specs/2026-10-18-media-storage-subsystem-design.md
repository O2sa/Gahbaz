# Media & Storage Subsystem Architecture Specification

**Document:** `2026-10-18-media-storage-subsystem-design.md`  
**Date:** 2026-10-18  
**Status:** Approved  
**Author:** Antigravity Engineering  
**Scope:** Gahbaz E-Learning Platform (Backend & Frontend)

---

## 1. Executive Summary & Objective

The Gahbaz platform requires a resilient, provider-agnostic Media Management and Storage subsystem capable of handling diverse media assets:
- **User Avatars** (Images: JPG, PNG, WEBP)
- **Course & Major Covers** (Images: JPG, PNG, WEBP)
- **Lesson Video Lectures** (Videos: MP4, WebM, MOV; up to several hundred MBs)
- **Course & Lesson Documents** (PDFs, presentations, markdown notes)
- **Assignment Questions & Submissions** (Documents: PDF, ZIP, DOCX, Code)

### Core Architectural Requirement:
The subsystem must seamlessly support 4 storage drivers:
1. **Local Disk Storage** (Server-hosted in `uploads/` directory with byte-range HTTP streaming)
2. **Cloudinary** (Cloud asset CDN with signed client uploads)
3. **Wasabi Cloud Storage** (High-performance, cost-effective S3-compatible object storage)
4. **AWS S3** (Industry standard cloud object storage)

**Zero-Configuration Fallback:** If external cloud credentials are not supplied via `.env`, the system automatically and transparently falls back to Local Disk storage without throwing runtime errors or disrupting platform operations.

---

## 2. Architecture & Design Principles

### 2.1 Strategy / Factory Pattern
Storage providers implement a unified interface `IStorageDriver`:
- `getUploadIntent({ fileName, fileType, folder, size, isPrivate })`: Returns presigned parameters or points to local upload route.
- `uploadFile(fileBuffer, { key, mimeType, isPrivate })`: Used for server-side processing or fallback uploads.
- `getDownloadUrl(key, { isPrivate, expiresIn })`: Returns a persistent URL for public media or a time-limited signed URL for private assets.
- `deleteFile(key)`: Permanently deletes the asset from the storage medium.

### 2.2 Direct-to-Cloud with Presigned URLs
To protect backend server memory and network bandwidth from heavy video and document uploads:
- **Cloud Providers (AWS S3, Wasabi, Cloudinary):** The client requests an upload intent (`presigned-url`), and uploads the file directly to the cloud provider via HTTP PUT (S3/Wasabi) or signed POST (Cloudinary).
- **Local Storage:** The intent points to the local upload endpoint (`/api/v1/media/upload`), and the client sends multipart form-data via Multer.
- **Frontend Abstraction:** A single universal frontend helper (`uploadMedia(file, options)`) encapsulates this branching completely.

### 2.3 Hybrid Security Model
- **Public Assets (`avatars`, `covers`, `public_docs`):** Stored in public partitions; accessible via direct, permanent URLs.
- **Private / Sensitive Assets (`submissions`, `exam_papers`, `private_assignments`):**
  - **Local:** Stored in `uploads/private/` outside public static middleware. Accessible only via authenticated endpoint `GET /api/v1/media/private/:fileKey` with role-based checks.
  - **S3 / Wasabi:** Stored in private bucket paths. Download requires a presigned GET URL (15-minute expiration) generated on-demand for authorized users.

---

## 3. Storage Drivers Specification

### 3.1 Local Disk Driver (`LocalDiskDriver`)
- **Storage Root:** Configurable via `UPLOAD_DIR` (default: `./uploads`).
- **Subdirectories:** Auto-creates partitions: `uploads/avatars`, `uploads/covers`, `uploads/videos`, `uploads/attachments`, `uploads/private`.
- **Upload Intent:** Returns `{ directUpload: false, uploadUrl: '/api/v1/media/upload', key: '...' }`.
- **Video Streaming (HTTP 206 Partial Content):**
  When serving videos locally, Express middleware handles byte-range headers (`Range: bytes=start-end`), calculating `Content-Range` and streaming partial chunks so browser `<video>` players can seek and scrub smoothly.

### 3.2 S3-Compatible Driver (`S3CompatibleDriver`)
Both AWS S3 and Wasabi utilize the `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` SDKs:
- **AWS S3 Configuration:**
  - `endpoint`: Standard AWS regional endpoint.
  - `region`: `AWS_REGION`
  - `credentials`: `{ accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY }`
  - `bucket`: `AWS_BUCKET_NAME`
- **Wasabi Configuration:**
  - `endpoint`: `WASABI_ENDPOINT` (e.g., `https://s3.wasabisys.com` or `https://s3.eu-central-1.wasabisys.com`)
  - `region`: `WASABI_REGION`
  - `credentials`: `{ accessKeyId: WASABI_ACCESS_KEY_ID, secretAccessKey: WASABI_SECRET_ACCESS_KEY }`
  - `bucket`: `WASABI_BUCKET_NAME`
  - `forcePathStyle`: `true` (standard for S3-compatible providers).
- **Presigned Upload:** Generates `PutObjectCommand` with a 15-minute expiry.
- **Presigned Download:** Generates `GetObjectCommand` with a 15-minute expiry for private files.

### 3.3 Cloudinary Driver (`CloudinaryDriver`)
- **SDK:** `cloudinary` (v2).
- **Upload Intent:** Generates SHA1 upload signature using `api_secret`, returning:
  `{ directUpload: true, provider: 'cloudinary', uploadUrl: 'https://api.cloudinary.com/v1_1/<cloud_name>/auto/upload', fields: { timestamp, signature, api_key, folder } }`.
- **Deletion:** Invokes `cloudinary.uploader.destroy(publicId)`.

---

## 4. Provider Selection & Fallback Logic

The driver factory chooses the active provider based on environment variables:

```javascript
export function getStorageDriver() {
  const provider = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();

  if (provider === 'wasabi' && isWasabiConfigured()) {
    return new S3CompatibleDriver(getWasabiConfig());
  }

  if (provider === 's3' && isS3Configured()) {
    return new S3CompatibleDriver(getS3Config());
  }

  if (provider === 'cloudinary' && isCloudinaryConfigured()) {
    return new CloudinaryDriver(getCloudinaryConfig());
  }

  // Graceful Fallback
  return new LocalDiskDriver(getLocalConfig());
}
```

---

## 5. Backend API Endpoints

### 5.1 Request Upload Intent
- **Route:** `POST /api/v1/media/presigned-url`
- **Auth:** Required (JWT)
- **Request Body:**
  ```json
  {
    "fileName": "lecture-intro.mp4",
    "fileType": "video/mp4",
    "folder": "videos",
    "size": 52428800,
    "isPrivate": false
  }
  ```
- **Response (Cloud S3/Wasabi):**
  ```json
  {
    "success": true,
    "directUpload": true,
    "provider": "wasabi",
    "uploadUrl": "https://s3.wasabisys.com/gahbaz-bucket/videos/uuid-lecture-intro.mp4?...",
    "fileUrl": "https://s3.wasabisys.com/gahbaz-bucket/videos/uuid-lecture-intro.mp4",
    "key": "videos/uuid-lecture-intro.mp4",
    "method": "PUT",
    "headers": {
      "Content-Type": "video/mp4"
    }
  }
  ```
- **Response (Local Disk):**
  ```json
  {
    "success": true,
    "directUpload": false,
    "provider": "local",
    "uploadUrl": "/api/v1/media/upload",
    "key": "videos/uuid-lecture-intro.mp4",
    "folder": "videos"
  }
  ```

### 5.2 Local Upload Endpoint (Fallback / Local Driver)
- **Route:** `POST /api/v1/media/upload`
- **Auth:** Required (JWT)
- **Content-Type:** `multipart/form-data`
- **Fields:** `file`, `folder`, `key` (optional), `isPrivate` (optional)
- **Response:**
  ```json
  {
    "success": true,
    "provider": "local",
    "fileUrl": "http://localhost:5000/uploads/videos/uuid-lecture-intro.mp4",
    "key": "videos/uuid-lecture-intro.mp4",
    "size": 52428800,
    "mimeType": "video/mp4"
  }
  ```

### 5.3 Secure Download / Streaming Endpoint
- **Route:** `GET /api/v1/media/private/:fileKey`
- **Auth:** Required (Student submission owner, Course Teacher, University Admin)
- **Behavior:**
  - If Local: Streams file with correct MIME type or sends as attachment.
  - If Cloud: Redirects (302) to presigned cloud GET URL.

### 5.4 File Deletion Endpoint
- **Route:** `DELETE /api/v1/media/:fileKey`
- **Auth:** Required (Owner or Admin)
- **Behavior:** Invokes `StorageService.deleteFile(fileKey)`.

---

## 6. Frontend Universal Client Helper (`uploadMedia`)

A unified utility located in `client/src/utils/mediaUpload.js`:

```javascript
import client from '../api/client';

export async function uploadMedia(file, { folder = 'general', isPrivate = false, onProgress } = {}) {
  // 1. Get upload intent from backend
  const { data: intent } = await client.post('/media/presigned-url', {
    fileName: file.name,
    fileType: file.type || 'application/octet-stream',
    folder,
    size: file.size,
    isPrivate,
  });

  // 2. Direct upload to S3 / Wasabi
  if (intent.directUpload && (intent.provider === 's3' || intent.provider === 'wasabi')) {
    await fetchWithProgress(intent.uploadUrl, {
      method: intent.method || 'PUT',
      headers: intent.headers || { 'Content-Type': file.type },
      body: file,
      onProgress,
    });
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

    const res = await axiosWithProgress(intent.uploadUrl, formData, onProgress);
    return {
      url: res.data.secure_url,
      key: res.data.public_id,
      provider: 'cloudinary',
      size: res.data.bytes,
      mimeType: file.type,
    };
  }

  // 4. Local fallback upload via backend multipart
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  if (intent.key) formData.append('key', intent.key);
  formData.append('isPrivate', String(isPrivate));

  const res = await client.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) onProgress(Math.round((evt.loaded * 100) / evt.total));
    },
  });

  return res.data;
}
```

---

## 7. Migration & UI Components Integration

The universal helper will replace custom/hardcoded upload blocks across:
1. `client/src/pages/public/UploadProfile.jsx` (Avatars)
2. `client/src/pages/admin/UploadCourseCover.jsx` (Course covers)
3. `client/src/pages/admin/UploadVideo.jsx` (Lesson lecture videos)
4. `client/src/pages/student/` (Assignment file submissions)
5. `client/src/pages/teacher/` (Assignment question attachments)

---

## 8. Verification & Quality Assurance Strategy

1. **Unit & Integration Tests:**
   - Test driver factory for all four modes (`local`, `cloudinary`, `s3`, `wasabi`).
   - Test automatic fallback to `local` when cloud env variables are absent.
   - Test `presigned-url` endpoint validation and payload responses.
   - Test local multipart file upload and directory creation.
   - Test Range Requests (HTTP 206) for video files.
   - Test private file authorization gating.
2. **Build Validation:**
   - Execute `vitest run` on backend test suite (maintain 100% pass rate).
   - Execute `npm run build` on frontend client (maintain exit code 0).
