import crypto from 'crypto';
import IStorageDriver from './IStorageDriver.js';

export class CloudinaryDriver extends IStorageDriver {
  constructor(config = {}) {
    super();
    this.cloudName = config.cloudName || process.env.CLOUDINARY_CLOUD_NAME;
    this.apiKey = config.apiKey || process.env.CLOUDINARY_API_KEY;
    this.apiSecret = config.apiSecret || process.env.CLOUDINARY_API_SECRET;
  }

  isConfigured() {
    return Boolean(this.cloudName && this.apiKey && this.apiSecret);
  }

  generateSignature(paramsToSign) {
    const sortedKeys = Object.keys(paramsToSign).sort();
    const serialized = sortedKeys
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join('&');
    return crypto
      .createHash('sha1')
      .update(serialized + this.apiSecret)
      .digest('hex');
  }

  async getUploadIntent({ fileName, fileType, folder = 'general', isPrivate = false }) {
    if (!this.isConfigured()) {
      throw new Error('Cloudinary credentials are incomplete');
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
      provider: 'cloudinary',
      uploadUrl: `https://api.cloudinary.com/v1_1/${this.cloudName}/auto/upload`,
      method: 'POST',
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

  async getDownloadUrl(key, { isPrivate = false } = {}) {
    // If key is already a full Cloudinary URL, return as is
    if (key && (key.startsWith('http://') || key.startsWith('https://'))) {
      return key;
    }
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${key}`;
  }

  async deleteFile(key) {
    // Cloudinary destroy API call
    try {
      const publicId = key.replace(/\.[^/.]+$/, '');
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = this.generateSignature({ public_id: publicId, timestamp });
      
      const formData = new URLSearchParams();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp);
      formData.append('api_key', this.apiKey);
      formData.append('signature', signature);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.result === 'ok';
    } catch (err) {
      console.error('Cloudinary deleteFile error:', err.message);
      return false;
    }
  }
}

export default CloudinaryDriver;
