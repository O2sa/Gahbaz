# Media & Storage Subsystem Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a robust, provider-agnostic Media and Storage subsystem for Gahbaz supporting Local Disk, Cloudinary, Wasabi, and AWS S3 with client direct-to-cloud presigned uploads, video range streaming, hybrid access control, and seamless local fallback.

**Architecture:** Strategy and Factory pattern with `IStorageDriver` implementations for Local Disk, S3-Compatible (Wasabi & AWS S3), and Cloudinary. Backend endpoints provide presigned upload intents and local multipart endpoints via Multer. Frontend uses a universal `uploadMedia` helper utility.

**Tech Stack:** Node.js, Express, Multer, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `cloudinary`, `vitest`, React, Vite, Mantine.

**Spec:** `docs/superpowers/specs/2026-10-18-media-storage-subsystem-design.md`

## Global Constraints
- Must not break existing 115 tests (`pnpm test` in `backend`).
- Must maintain frontend build integrity (`npm run build` in `client`).
- If no external storage credentials are configured in `.env`, the system MUST gracefully fall back to Local Disk storage without throwing uncaught exceptions.
- Local video streaming must support HTTP 206 Partial Content (Range Requests) for smooth video playback.

---

### Task 1: Storage Driver Abstraction & Core Drivers

**Files:**
- Create: `backend/src/services/storage/IStorageDriver.js`
- Create: `backend/src/services/storage/LocalDiskDriver.js`
- Create: `backend/src/services/storage/S3CompatibleDriver.js`
- Create: `backend/src/services/storage/CloudinaryDriver.js`
- Create: `backend/src/services/storage/storage.service.js`
- Test: `backend/tests/services/storage.test.js`

**Interfaces:**
- `IStorageDriver`:
  - `getUploadIntent({ fileName, fileType, folder, size, isPrivate })`: Promise<UploadIntent>
  - `uploadFile(buffer, { key, mimeType, isPrivate })`: Promise<{ url, key, provider, size }>
  - `getDownloadUrl(key, { isPrivate, expiresIn })`: Promise<string>
  - `deleteFile(key)`: Promise<boolean>
- `storageService`:
  - `getDriver()`: returns active `IStorageDriver` instance (or Local fallback)
  - `getUploadIntent(options)`
  - `uploadFile(buffer, options)`
  - `getDownloadUrl(key, options)`
  - `deleteFile(key)`

- [x] **Step 1: Write failing unit test for storage driver factory and fallback**

Create `backend/tests/services/storage.test.js`:
```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StorageService } from '../../src/services/storage/storage.service.js';
import { LocalDiskDriver } from '../../src/services/storage/LocalDiskDriver.js';
import { S3CompatibleDriver } from '../../src/services/storage/S3CompatibleDriver.js';

describe('StorageService & Driver Factory', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should default to LocalDiskDriver when STORAGE_PROVIDER is not set', () => {
    delete process.env.STORAGE_PROVIDER;
    const service = new StorageService();
    expect(service.getDriver()).toBeInstanceOf(LocalDiskDriver);
  });

  it('should fallback to LocalDiskDriver if Wasabi or S3 credentials are missing', () => {
    process.env.STORAGE_PROVIDER = 'wasabi';
    delete process.env.WASABI_ACCESS_KEY_ID;
    const service = new StorageService();
    expect(service.getDriver()).toBeInstanceOf(LocalDiskDriver);
  });

  it('should initialize S3CompatibleDriver when valid Wasabi config is provided', () => {
    process.env.STORAGE_PROVIDER = 'wasabi';
    process.env.WASABI_ACCESS_KEY_ID = 'test-key';
    process.env.WASABI_SECRET_ACCESS_KEY = 'test-secret';
    process.env.WASABI_BUCKET_NAME = 'test-bucket';
    process.env.WASABI_ENDPOINT = 'https://s3.wasabisys.com';

    const service = new StorageService();
    expect(service.getDriver()).toBeInstanceOf(S3CompatibleDriver);
  });

  it('LocalDiskDriver should return correct upload intent pointing to local endpoint', async () => {
    const service = new StorageService();
    const intent = await service.getUploadIntent({
      fileName: 'avatar.png',
      fileType: 'image/png',
      folder: 'avatars',
    });

    expect(intent.directUpload).toBe(false);
    expect(intent.provider).toBe('local');
    expect(intent.uploadUrl).toBe('/api/v1/media/upload');
    expect(intent.key).toContain('avatars/');
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/services/storage.test.js` in `backend`  
Expected: FAIL (Cannot find module `storage.service.js`)

- [x] **Step 3: Implement driver abstraction, drivers, and StorageService**

1. Install AWS SDK S3 dependencies in backend:
```bash
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

2. Implement `backend/src/services/storage/IStorageDriver.js`:
Base interface class defining abstract methods: `getUploadIntent`, `uploadFile`, `getDownloadUrl`, `deleteFile`.

3. Implement `backend/src/services/storage/LocalDiskDriver.js`:
Handles local filesystem operations under `UPLOAD_DIR` (e.g. `uploads/`), generating unique keys with `crypto.randomUUID()`, creating partition subdirectories (`avatars`, `covers`, `videos`, `assignments`, `private`), and returning `/uploads/...` URLs.

4. Implement `backend/src/services/storage/S3CompatibleDriver.js`:
Uses `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` to create `S3Client` with `endpoint`, `region`, and `credentials`. Implements `PutObjectCommand` presigning for uploads and `GetObjectCommand` presigning for downloads.

5. Implement `backend/src/services/storage/CloudinaryDriver.js`:
Calculates SHA1 upload signature using `crypto.createHash('sha1')` and returns Cloudinary upload endpoint with timestamp, api_key, and signature.

6. Implement `backend/src/services/storage/storage.service.js`:
Factory class that inspects `process.env` and instantiates the proper driver with automatic fallback to `LocalDiskDriver`.

- [x] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/services/storage.test.js` in `backend`  
Expected: PASS (All 4 tests passing)

- [x] **Step 5: Commit changes**

```bash
git add backend/src/services/storage/ backend/tests/services/storage.test.js backend/package.json pnpm-lock.yaml
git commit -m "feat(storage): implement storage driver abstraction with local, S3, and Cloudinary drivers"
```

---

### Task 2: Backend Media Routes & Controllers with Video Streaming

**Files:**
- Create: `backend/src/modules/media/media.controller.js`
- Create: `backend/src/modules/media/media.routes.js`
- Create: `backend/src/middlewares/rangeStream.middleware.js`
- Test: `backend/tests/modules/media-routes.test.js`

**Interfaces:**
- `POST /api/v1/media/presigned-url`:
  - Body: `{ fileName, fileType, folder, size, isPrivate }`
  - Returns: `{ success: true, directUpload, provider, uploadUrl, fileUrl, key, ... }`
- `POST /api/v1/media/upload`:
  - Multipart: `file` (Multer), `folder`, `key`, `isPrivate`
  - Returns: `{ success: true, provider, fileUrl, key, size, mimeType }`
- `GET /api/v1/media/stream/:fileKey`:
  - Streams local video file with HTTP 206 Partial Content (Byte Range Requests).
- `GET /api/v1/media/private/:fileKey`:
  - Authenticated handler for private assignments/submissions.
- `DELETE /api/v1/media/:fileKey`:
  - Deletes asset from active storage provider.

- [x] **Step 1: Write failing integration test for media endpoints**

Create `backend/tests/modules/media-routes.test.js`:
```javascript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { generateToken } from '../../src/core/security.js';

describe('Media API Endpoints', () => {
  const token = generateToken({ id: '507f1f77bcf86cd799439011', role: 'admin' });

  it('POST /api/v1/media/presigned-url should return intent for valid payload', async () => {
    const res = await request(app)
      .post('/api/v1/media/presigned-url')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fileName: 'cover.jpg',
        fileType: 'image/jpeg',
        folder: 'covers',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.provider).toBeDefined();
    expect(res.body.uploadUrl).toBeDefined();
  });

  it('POST /api/v1/media/upload should accept multipart file upload for local storage', async () => {
    const buffer = Buffer.from('fake image content');
    const res = await request(app)
      .post('/api/v1/media/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', buffer, 'test-image.jpg')
      .field('folder', 'covers');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.fileUrl).toBeDefined();
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/modules/media-routes.test.js` in `backend`  
Expected: FAIL (404 Not Found)

- [x] **Step 3: Implement controller, video range streaming, and routes**

1. Create `backend/src/middlewares/rangeStream.middleware.js`:
Handles `req.headers.range`, reads file stats via `fs.stat`, computes chunk boundaries, sends status code `206 Partial Content`, and streams with `fs.createReadStream(filePath, { start, end })`.

2. Create `backend/src/modules/media/media.controller.js`:
- `getPresignedUrl`: Validates payload and calls `storageService.getUploadIntent(req.body)`.
- `uploadLocalFile`: Uses Multer diskStorage to save file in `uploads/{folder}/`, returning public/streaming URL.
- `streamVideo`: Streams video via range streaming middleware.
- `getPrivateFile`: Checks user permissions and either streams local private file or redirects (302) to presigned download URL.
- `deleteMedia`: Deletes file via `storageService.deleteFile(key)`.

3. Create `backend/src/modules/media/media.routes.js`:
Mounts routes with authMiddleware and multer file upload.

4. Register routes in `backend/src/routes.js` and serve static `uploads/` in `backend/src/app.js`.

- [x] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/modules/media-routes.test.js` in `backend`  
Expected: PASS

- [x] **Step 5: Commit changes**

```bash
git add backend/src/modules/media/ backend/src/middlewares/rangeStream.middleware.js backend/tests/modules/media-routes.test.js backend/src/routes.js backend/src/app.js
git commit -m "feat(media): add media upload, presigning, streaming, and access control routes"
```

---

### Task 3: Environment Configuration & Schema Validation

**Files:**
- Modify: `backend/src/config/env.js`
- Modify: `backend/src/config/env.example` or `.env`
- Test: `backend/tests/config/env.test.js`

**Interfaces:**
- Extends Zod schema in `src/config/env.js` to include:
  - `STORAGE_PROVIDER`: `z.enum(["local", "cloudinary", "s3", "wasabi"]).default("local")`
  - `UPLOAD_DIR`: `z.string().default("uploads")`
  - `PUBLIC_URL`: `z.string().default("http://localhost:5000")`
  - Optional cloud configs: `WASABI_ACCESS_KEY_ID`, `WASABI_SECRET_ACCESS_KEY`, `WASABI_REGION`, `WASABI_BUCKET_NAME`, `WASABI_ENDPOINT`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET_NAME`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

- [x] **Step 1: Write test for storage env schema**

Add test cases in `backend/tests/config/env.test.js` validating that missing cloud credentials gracefully default `STORAGE_PROVIDER` to `"local"`.

- [x] **Step 2: Update `env.js` schema**

Update Zod validation in `backend/src/config/env.js` with defaults.

- [x] **Step 3: Run env tests**

Run: `pnpm test tests/config/env.test.js` in `backend`  
Expected: PASS

- [x] **Step 4: Commit changes**

```bash
git add backend/src/config/env.js backend/tests/config/env.test.js
git commit -m "feat(config): add storage provider and cloud service keys to env schema"
```

---

### Task 4: Universal Client Media Upload Utility

**Files:**
- Create: `client/src/utils/mediaUpload.js`

**Interfaces:**
- `uploadMedia(file, { folder, isPrivate, onProgress })`: Promise<{ url, key, provider, size, mimeType }>

- [x] **Step 1: Implement `client/src/utils/mediaUpload.js`**

Implement `uploadMedia` supporting:
1. Fetching upload intent from `/media/presigned-url` via `client` axios instance.
2. Direct HTTP PUT upload for S3 / Wasabi using `XMLHttpRequest` (or `fetch`) with upload progress calculation.
3. Direct HTTP POST upload for Cloudinary using signed fields.
4. Multipart fallback upload to `/media/upload` via `client.post` with `onUploadProgress`.
5. Returns a uniform object `{ url, key, provider, size, mimeType }`.

- [x] **Step 2: Verify build in client**

Run: `npm run build` in `client`  
Expected: Success with 0 errors.

- [x] **Step 3: Commit changes**

```bash
git add client/src/utils/mediaUpload.js
git commit -m "feat(client): implement universal uploadMedia helper utility"
```

---

### Task 5: Frontend Components Migration to Universal Upload

**Files:**
- Modify: `client/src/pages/admin/UploadCourseCover.jsx`
- Modify: `client/src/pages/admin/UploadVideo.jsx`
- Modify: `client/src/pages/public/UploadProfile.jsx`

**Interfaces:**
- Replace hardcoded Cloudinary credentials (`cloudName = 'ddng3kwfw'`, `uploadPreset = 't01knn9d'`) and direct URLs with `uploadMedia(file, { folder: '...' })`.

- [x] **Step 1: Refactor `UploadCourseCover.jsx`**

Replace custom axios call with:
```javascript
const { url } = await uploadMedia(selectedFile, { folder: 'covers' });
await client.patch(`courses/${courseId}`, { cover: url });
```

- [x] **Step 2: Refactor `UploadVideo.jsx`**

Replace custom axios call with:
```javascript
const { url } = await uploadMedia(selectedFile, { folder: 'videos', onProgress: setProgress });
await client.patch(`sections/${sectionId}/lessons/${lesson._id}`, {
  video: { url, duration: videoDuration || 0 }
});
```

- [x] **Step 3: Refactor `UploadProfile.jsx`**

Replace custom axios call with:
```javascript
const { url } = await uploadMedia(selectedFile, { folder: 'avatars' });
await client.patch(`users/profile`, { avatar: url });
```

- [x] **Step 4: Verify client build**

Run: `npm run build` in `client`  
Expected: Exit code 0, 0 bundling errors.

- [x] **Step 5: Commit changes**

```bash
git add client/src/pages/admin/UploadCourseCover.jsx client/src/pages/admin/UploadVideo.jsx client/src/pages/public/UploadProfile.jsx
git commit -m "refactor(client): migrate cover, video, and avatar upload components to universal uploadMedia"
```

---

### Task 6: Comprehensive Verification & Regression Testing

**Files:**
- Verification only

- [x] **Step 1: Run all backend tests**

Run: `pnpm test` in `backend`  
Expected: All tests pass (100% green, 28+ test files, 120+ tests).

- [x] **Step 2: Run client production build**

Run: `npm run build` in `client`  
Expected: Vite build succeeds with 0 errors.

- [x] **Step 3: Final git status check & commit**

```bash
git status
git commit -m "chore: finalize media and storage subsystem implementation"
```
