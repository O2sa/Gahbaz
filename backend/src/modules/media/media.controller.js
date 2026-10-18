import path from 'path';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import storageService from '../../services/storage/storage.service.js';
import streamWithRange from '../../middlewares/rangeStream.middleware.js';

export const getPresignedUrl = async (req, res) => {
  const { fileName, fileType, folder = 'general', size, isPrivate = false } = req.body;

  if (!fileName) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, msg: 'fileName is required' });
  }

  const intent = await storageService.getUploadIntent({
    fileName,
    fileType: fileType || 'application/octet-stream',
    folder,
    size: size ? Number(size) : undefined,
    isPrivate: Boolean(isPrivate),
  });

  return res.status(StatusCodes.OK).json(intent);
};

export const uploadLocalFile = async (req, res) => {
  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, msg: 'No file uploaded' });
  }

  const folder = req.body.folder || 'general';
  const isPrivate = req.body.isPrivate === 'true' || req.body.isPrivate === true;
  const key = req.file.filename
    ? (isPrivate ? `private/${folder}/${req.file.filename}` : `${folder}/${req.file.filename}`).replace(/\\/g, '/')
    : undefined;

  const driver = storageService.getDriver();
  
  // If the active driver is LocalDiskDriver and multer saved it to disk
  if (driver.constructor.name === 'LocalDiskDriver' && req.file.path) {
    const publicUrl = (process.env.PUBLIC_URL || 'http://localhost:5000').replace(/\/$/, '');
    const fileUrl = isPrivate
      ? `${publicUrl}/api/v1/media/private/${key}`
      : `${publicUrl}/uploads/${key}`;

    return res.status(StatusCodes.CREATED).json({
      success: true,
      provider: 'local',
      fileUrl,
      key,
      size: req.file.size,
      mimeType: req.file.mimetype,
      isPrivate,
    });
  }

  // Otherwise, if multer used memory storage or buffer is present
  const fileBuffer = req.file.buffer || (req.file.path ? await fs.promises.readFile(req.file.path) : null);
  if (!fileBuffer) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, msg: 'Unable to read uploaded file' });
  }

  const result = await storageService.uploadFile(fileBuffer, {
    key,
    mimeType: req.file.mimetype,
    isPrivate,
  });

  return res.status(StatusCodes.CREATED).json(result);
};

export const streamVideo = async (req, res) => {
  const filePathParam = req.params[0] || req.params.fileKey;
  const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
  const fullPath = path.join(uploadDir, filePathParam);

  const ext = path.extname(fullPath).toLowerCase();
  const mimeMap = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.ogg': 'video/ogg',
  };
  const mime = mimeMap[ext] || 'video/mp4';

  streamWithRange(fullPath, req, res, mime);
};

export const getPrivateFile = async (req, res) => {
  const fileKeyParam = req.params[0] || req.params.fileKey;
  const driver = storageService.getDriver();

  if (driver.constructor.name === 'LocalDiskDriver') {
    const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
    const fullPath = path.join(uploadDir, fileKeyParam.startsWith('private/') ? fileKeyParam : `private/${fileKeyParam}`);

    if (!fs.existsSync(fullPath)) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, msg: 'File not found' });
    }

    return res.sendFile(fullPath);
  }

  // For S3 or Wasabi, redirect to signed temporary download URL
  const downloadUrl = await storageService.getDownloadUrl(fileKeyParam, { isPrivate: true, expiresIn: 900 });
  return res.redirect(downloadUrl);
};

export const deleteMedia = async (req, res) => {
  const fileKey = req.params[0] || req.params.fileKey;
  const deleted = await storageService.deleteFile(fileKey);
  return res.status(StatusCodes.OK).json({ success: deleted });
};
