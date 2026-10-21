import LocalDiskDriver from './LocalDiskDriver.js';
import S3CompatibleDriver from './S3CompatibleDriver.js';
import CloudinaryDriver from './CloudinaryDriver.js';

export class StorageService {
  constructor() {
    this.driver = this.createDriver();
  }

  createDriver() {
    const provider = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();

    if (provider === 'wasabi') {
      const config = {
        providerName: 'wasabi',
        accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
        secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY,
        bucketName: process.env.WASABI_BUCKET_NAME,
        region: process.env.WASABI_REGION || 'us-east-1',
        endpoint: process.env.WASABI_ENDPOINT || 'https://s3.wasabisys.com',
      };
      const driver = new S3CompatibleDriver(config);
      if (driver.isConfigured()) {
        return driver;
      }
      console.warn('⚠️ [StorageService] Wasabi credentials incomplete, falling back to LocalDiskDriver.');
    }

    if (provider === 's3') {
      const config = {
        providerName: 's3',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        bucketName: process.env.AWS_BUCKET_NAME,
        region: process.env.AWS_REGION || 'us-east-1',
      };
      const driver = new S3CompatibleDriver(config);
      if (driver.isConfigured()) {
        return driver;
      }
      console.warn('⚠️ [StorageService] AWS S3 credentials incomplete, falling back to LocalDiskDriver.');
    }

    if (provider === 'cloudinary') {
      const driver = new CloudinaryDriver();
      if (driver.isConfigured()) {
        return driver;
      }
      console.warn('⚠️ [StorageService] Cloudinary credentials incomplete, falling back to LocalDiskDriver.');
    }

    return new LocalDiskDriver();
  }

  getDriver() {
    return this.driver;
  }

  async getUploadIntent(options) {
    return this.driver.getUploadIntent(options);
  }

  async uploadFile(buffer, options) {
    return this.driver.uploadFile(buffer, options);
  }

  async getDownloadUrl(key, options) {
    return this.driver.getDownloadUrl(key, options);
  }

  async deleteFile(key) {
    return this.driver.deleteFile(key);
  }
}

export const storageService = new StorageService();
export default storageService;
