import crypto from "crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import IStorageDriver, {
  UploadIntentOptions,
  UploadIntentResult,
  UploadFileOptions,
  UploadFileResult,
  DownloadUrlOptions,
} from "./IStorageDriver.js";

export interface S3CompatibleConfig {
  providerName?: string;
  bucketName?: string;
  region?: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export class S3CompatibleDriver extends IStorageDriver {
  public providerName: string;
  public bucketName?: string;
  public region: string;
  public endpoint?: string;
  public accessKeyId?: string;
  public secretAccessKey?: string;
  public client: S3Client;

  constructor(config: S3CompatibleConfig = {}) {
    super();
    this.providerName = config.providerName || "s3";
    this.bucketName = config.bucketName;
    this.region = config.region || "us-east-1";
    this.endpoint = config.endpoint || undefined;
    this.accessKeyId = config.accessKeyId;
    this.secretAccessKey = config.secretAccessKey;

    const clientConfig: S3ClientConfig = {
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId || "",
        secretAccessKey: this.secretAccessKey || "",
      },
    };

    if (this.endpoint) {
      clientConfig.endpoint = this.endpoint;
      clientConfig.forcePathStyle = true; // Required for Wasabi and MinIO
    }

    this.client = new S3Client(clientConfig);
  }

  isConfigured(): boolean {
    return Boolean(this.bucketName && this.accessKeyId && this.secretAccessKey);
  }

  generateKey(
    fileName: string = "file",
    folder: string = "general",
    isPrivate: boolean = false
  ): string {
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueId = crypto.randomUUID();
    const targetFolder = isPrivate ? `private/${folder}` : folder;
    return `${targetFolder}/${uniqueId}-${safeName}`;
  }

  getPublicUrl(key: string): string {
    if (this.endpoint) {
      return `${this.endpoint.replace(/\/$/, "")}/${this.bucketName}/${key}`;
    }
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async getUploadIntent({
    fileName,
    fileType,
    folder = "general",
    size: _size,
    isPrivate = false,
  }: UploadIntentOptions): Promise<UploadIntentResult> {
    if (!this.isConfigured()) {
      throw new Error(
        `S3/Wasabi storage credentials are incomplete for provider: ${this.providerName}`
      );
    }

    const key = this.generateKey(fileName, folder, isPrivate);
    const contentType = fileType || "application/octet-stream";

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
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      isPrivate: Boolean(isPrivate),
    };
  }

  async uploadFile(
    buffer: Buffer,
    { key, mimeType = "application/octet-stream", isPrivate = false }: UploadFileOptions
  ): Promise<UploadFileResult> {
    const finalKey = key || this.generateKey("upload.bin", "general", isPrivate);

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

  async getDownloadUrl(
    key: string,
    { isPrivate = false, expiresIn = 900 }: DownloadUrlOptions = {}
  ): Promise<string> {
    if (isPrivate || key.startsWith("private/")) {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      return await getSignedUrl(this.client, command, { expiresIn });
    }
    return this.getPublicUrl(key);
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.client.send(command);
      return true;
    } catch (err: any) {
      console.error(`S3CompatibleDriver deleteFile error on ${key}:`, err?.message || err);
      return false;
    }
  }
}

export default S3CompatibleDriver;
