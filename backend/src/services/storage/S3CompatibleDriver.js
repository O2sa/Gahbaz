import crypto from 'crypto';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import IStorageDriver from './IStorageDriver.js';

export class S3CompatibleDriver extends IStorageDriver {
  constructor(config = {}) {
    super();
    this.providerName = config.providerName || 's3';
    this.bucketName = config.bucketName;
    this.region = config.region || 'us-east-1';
    this.endpoint = config.endpoint || undefined;
    this.accessKeyId = config.accessKeyId;
    this.secretAccessKey = config.secretAccessKey;

    const clientConfig = {
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    };

    if (this.endpoint) {
      clientConfig.endpoint = this.endpoint;
      clientConfig.forcePathStyle = true; // Required for Wasabi and MinIO
    }

    this.client = new S3Client(clientConfig);
  }

  isConfigured() {
    return Boolean(this.bucketName && this.accessKeyId && this.secretAccessKey);
  }

  generateKey(fileName = 'file', folder = 'general', isPrivate = false) {
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueId = crypto.randomUUID();
    const targetFolder = isPrivate ? `private/${folder}` : folder;
    return `${targetFolder}/${uniqueId}-${safeName}`;
  }

  getPublicUrl(key) {
    if (this.endpoint) {
      return `${this.endpoint.replace(/\/$/, '')}/${this.bucketName}/${key}`;
    }
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async getUploadIntent({ fileName, fileType, folder = 'general', size, isPrivate = false }) {
    if (!this.isConfigured()) {
      throw new Error(`S3/Wasabi storage credentials are incomplete for provider: ${this.providerName}`);
    }

    const key = this.generateKey(fileName, folder, isPrivate);
    const contentType = fileType || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: 900 });
    const fileUrl = this.getPublicUrl(key);

    return {
      success: true,
      directUpload: true,
      provider: this.providerName,
      uploadUrl,
      fileUrl,
      key,
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      isPrivate: Boolean(isPrivate),
    };
  }

  async uploadFile(buffer, { key, mimeType = 'application/octet-stream', isPrivate = false }) {
    const finalKey = key || this.generateKey('upload.bin', 'general', isPrivate);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: finalKey,
      Body: buffer,
      ContentType: mimeType,
    });

    await this.client.send(command);

    return {
      success: true,
      provider: this.providerName,
      fileUrl: this.getPublicUrl(finalKey),
      key: finalKey,
      size: buffer.length,
      mimeType,
      isPrivate: Boolean(isPrivate),
    };
  }

  async getDownloadUrl(key, { isPrivate = false, expiresIn = 900 } = {}) {
    if (isPrivate || key.startsWith('private/')) {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      return await getSignedUrl(this.client, command, { expiresIn });
    }
    return this.getPublicUrl(key);
  }

  async deleteFile(key) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.client.send(command);
      return true;
    } catch (err) {
      console.error(`S3CompatibleDriver deleteFile error on ${key}:`, err.message);
      return false;
    }
  }
}

export default S3CompatibleDriver;
