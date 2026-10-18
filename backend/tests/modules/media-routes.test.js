import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { createJWT } from '../../src/core/utils/token.utils.js';

describe('Media API Endpoints', () => {
  const token = createJWT({ userId: '507f1f77bcf86cd799439011', role: 'admin', universityId: '507f1f77bcf86cd799439012' });

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
    expect(res.body.key).toBeDefined();
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
    expect(res.body.key).toBeDefined();
  });

  it('POST /api/v1/media/presigned-url should reject request without auth', async () => {
    const res = await request(app)
      .post('/api/v1/media/presigned-url')
      .send({
        fileName: 'cover.jpg',
        fileType: 'image/jpeg',
      });

    expect(res.status).toBe(401);
  });
});
