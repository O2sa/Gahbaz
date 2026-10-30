import crypto from "crypto";
import IStorageDriver, {
  UploadIntentOptions,
  UploadIntentResult,
  UploadFileOptions,
  UploadFileResult,
  DownloadUrlOptions,
} from "./IStorageDriver.js";

export interface CloudinaryConfig {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
}

export class CloudinaryDriver extends IStorageDriver {
  public cloudName?: string;
  public apiKey?: string;
  public apiSecret?: string;

  constructor(config: CloudinaryConfig = {}) {
    super();
    this.cloudName = config.cloudName || process.env.CLOUDINARY_CLOUD_NAME;
    this.apiKey = config.apiKey || process.env.CLOUDINARY_API_KEY;
    this.apiSecret = config.apiSecret || process.env.CLOUDINARY_API_SECRET;
  }

  isConfigured(): boolean {
    return Boolean(this.cloudName && this.apiKey && this.apiSecret);
  }

  generateSignature(paramsToSign: Record<string, string | number>): string {
    const sortedKeys = Object.keys(paramsToSign).sort();
    const serialized = sortedKeys
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join("&");
    return crypto
      .createHash("sha1")
      .update(serialized + (this.apiSecret || ""))
      .digest("hex");
  }

  async getUploadIntent({
    fileName,
    fileType: _fileType,
    folder = "general",
    isPrivate = false,
  }: UploadIntentOptions): Promise<UploadIntentResult> {
    if (!this.isConfigured()) {
      throw new Error("Cloudinary credentials are incomplete");
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const targetFolder = isPrivate ? `gahbaz/private/${folder}` : `gahbaz/${folder}`;
    const paramsToSign = {
      folder: targetFolder,
      timestamp,
    };

    const signature = this.generateSignature(paramsToSign);

    return {
      success: true,
      directUpload: true,
      provider: "cloudinary",
      uploadUrl: `https://api.cloudinary.com/v1_1/${this.cloudName}/auto/upload`,
      method: "POST",
      fields: {
        timestamp,
        signature,
        api_key: this.apiKey,
        folder: targetFolder,
      },
      key: `${targetFolder}/${fileName}`,
      isPrivate: Boolean(isPrivate),
    };
  }

  async uploadFile(
    _buffer: Buffer,
    _options: UploadFileOptions
  ): Promise<UploadFileResult> {
    throw new Error("Direct buffer upload not implemented for CloudinaryDriver");
  }

  async getDownloadUrl(
    key: string,
    _options: DownloadUrlOptions = {}
  ): Promise<string> {
    if (key && (key.startsWith("http://") || key.startsWith("https://"))) {
      return key;
    }
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${key}`;
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      const publicId = key.replace(/\.[^/.]+$/, "");
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = this.generateSignature({ public_id: publicId, timestamp });

      const formData = new URLSearchParams();
      formData.append("public_id", publicId);
      formData.append("timestamp", timestamp.toString());
      formData.append("api_key", this.apiKey || "");
      formData.append("signature", signature);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = (await res.json()) as { result: string };
      return data.result === "ok";
    } catch (err: any) {
      console.error("Cloudinary deleteFile error:", err?.message || err);
      return false;
    }
  }
}

export default CloudinaryDriver;
