import fs from "fs";
import path from "path";
import crypto from "crypto";
import IStorageDriver, {
  UploadIntentOptions,
  UploadIntentResult,
  UploadFileOptions,
  UploadFileResult,
  DownloadUrlOptions,
} from "./IStorageDriver.js";

export interface LocalDiskConfig {
  uploadDir?: string;
  publicUrl?: string;
}

export class LocalDiskDriver extends IStorageDriver {
  private uploadDir: string;
  private publicUrl: string;

  constructor(config: LocalDiskConfig = {}) {
    super();
    this.uploadDir = path.resolve(
      process.cwd(),
      config.uploadDir || process.env.UPLOAD_DIR || "uploads"
    );
    this.publicUrl = (
      config.publicUrl ||
      process.env.PUBLIC_URL ||
      "http://localhost:5000"
    ).replace(/\/$/, "");
    this.ensureDirectories();
  }

  ensureDirectories(): void {
    const folders = [
      "avatars",
      "covers",
      "videos",
      "assignments",
      "attachments",
      "private",
      "general",
    ];
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    folders.forEach((f) => {
      const p = path.join(this.uploadDir, f);
      if (!fs.existsSync(p)) {
        fs.mkdirSync(p, { recursive: true });
      }
    });
  }

  generateKey(
    fileName: string = "file",
    folder: string = "general",
    isPrivate: boolean = false
  ): string {
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueId = crypto.randomUUID();
    const targetFolder = isPrivate ? path.join("private", folder) : folder;
    return `${targetFolder}/${uniqueId}-${safeName}`.replace(/\\/g, "/");
  }

  async getUploadIntent({
    fileName,
    fileType: _fileType,
    folder = "general",
    size: _size,
    isPrivate = false,
  }: UploadIntentOptions): Promise<UploadIntentResult> {
    const key = this.generateKey(fileName, folder, isPrivate);
    const fileUrl = isPrivate
      ? `${this.publicUrl}/api/v1/media/private/${key}`
      : `${this.publicUrl}/uploads/${key}`;

    return {
      success: true,
      directUpload: false,
      provider: "local",
      uploadUrl: "/api/v1/media/upload",
      fileUrl,
      key,
      folder,
      isPrivate: Boolean(isPrivate),
    };
  }

  async uploadFile(
    buffer: Buffer,
    { key, mimeType, isPrivate = false }: UploadFileOptions
  ): Promise<UploadFileResult> {
    const finalKey = key || this.generateKey("upload.bin", "general", isPrivate);
    const destinationPath = path.join(this.uploadDir, finalKey);
    const dir = path.dirname(destinationPath);

    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }

    await fs.promises.writeFile(destinationPath, buffer);

    const fileUrl = isPrivate
      ? `${this.publicUrl}/api/v1/media/private/${finalKey}`
      : `${this.publicUrl}/uploads/${finalKey}`;

    return {
      success: true,
      provider: "local",
      fileUrl,
      key: finalKey,
      size: buffer.length,
      mimeType,
      isPrivate: Boolean(isPrivate),
    };
  }

  async getDownloadUrl(
    key: string,
    { isPrivate = false }: DownloadUrlOptions = {}
  ): Promise<string> {
    if (isPrivate || key.startsWith("private/")) {
      return `${this.publicUrl}/api/v1/media/private/${key}`;
    }
    return `${this.publicUrl}/uploads/${key}`;
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, key);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error(`Failed to delete local file ${key}:`, err?.message || err);
      return false;
    }
  }
}

export default LocalDiskDriver;
