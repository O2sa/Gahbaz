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

  it('POST /api/v1/media/upload should route to correct folder and be servable via HTTP', async () => {
    const buffer = Buffer.from('fake image content for covers');
    const res = await request(app)
      .post('/api/v1/media/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', buffer, 'test-cover.jpg')
      .field('folder', 'covers');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.key).toMatch(/^covers\//);
    expect(res.body.fileUrl).toContain('/uploads/covers/');

    // Verify file is immediately servable via HTTP GET /uploads/covers/...
    const serveRes = await request(app).get(`/uploads/${res.body.key}`);
    expect(serveRes.status).toBe(200);
    expect(serveRes.headers['cross-origin-resource-policy']).toBe('cross-origin');
    expect(serveRes.body.toString()).toBe('fake image content for covers');
  });

  it('POST /api/v1/media/upload?folder=videos should route via query params', async () => {
    const buffer = Buffer.from('fake video bytes');
    const res = await request(app)
      .post('/api/v1/media/upload?folder=videos')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', buffer, 'sample-lesson.mp4');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.key).toMatch(/^videos\//);
    expect(res.body.fileUrl).toContain('/uploads/videos/');

    // Verify servable via stream or static
    const streamRes = await request(app).get(`/api/v1/media/stream/${res.body.key}`);
    expect(streamRes.status).toBe(200);
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
