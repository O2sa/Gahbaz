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
