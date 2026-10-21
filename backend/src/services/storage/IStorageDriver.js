/**
 * Interface definition for all Storage Drivers in Gahbaz.
 */
export class IStorageDriver {
  /**
   * Generates upload intent metadata (presigned URL for cloud or target route for local).
   * @param {Object} options
   * @param {string} options.fileName
   * @param {string} options.fileType
   * @param {string} options.folder
   * @param {number} [options.size]
   * @param {boolean} [options.isPrivate]
   * @returns {Promise<Object>}
   */
  async getUploadIntent(options) {
    throw new Error('getUploadIntent must be implemented by driver');
  }

  /**
   * Server-side upload of a file buffer or stream.
   * @param {Buffer} buffer
   * @param {Object} options
   * @param {string} options.key
   * @param {string} options.mimeType
   * @param {boolean} [options.isPrivate]
   * @returns {Promise<Object>}
   */
  async uploadFile(buffer, options) {
    throw new Error('uploadFile must be implemented by driver');
  }

  /**
   * Retrieves access URL (public or temporary signed URL for private assets).
   * @param {string} key
   * @param {Object} [options]
   * @param {boolean} [options.isPrivate]
   * @param {number} [options.expiresIn]
   * @returns {Promise<string>}
   */
  async getDownloadUrl(key, options) {
    throw new Error('getDownloadUrl must be implemented by driver');
  }

  /**
   * Deletes a file permanently from storage.
   * @param {string} key
   * @returns {Promise<boolean>}
   */
  async deleteFile(key) {
    throw new Error('deleteFile must be implemented by driver');
  }
}

export default IStorageDriver;
