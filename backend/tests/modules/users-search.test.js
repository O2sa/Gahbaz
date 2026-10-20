import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/User.js';
import Admin from '../../src/models/Admin.js';
import { createJWT } from '../../src/core/utils/token.utils.js';

describe('Universal User Search & Admin Credentials', () => {
  const adminToken = createJWT({
    userId: 'admin123',
    role: 'admin',
    universityId: 'univ123',
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/v1/users should match search queries on name', async () => {
    const mockUsers = [
      {
        _id: 'usr123',
        name: 'مدير النظام الأول',
        email: 'admin.super@test.com',
        phone: '0501112233',
        role: 'admin',
      },
    ];

    vi.spyOn(User, 'find').mockReturnValue({
      select: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            sort: vi.fn().mockResolvedValue(mockUsers),
          }),
        }),
      }),
    });
    vi.spyOn(User, 'countDocuments').mockResolvedValue(1);

    const res = await request(app)
      .get('/api/v1/users?search=النظام')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('مدير النظام الأول');
  });

  it('POST /api/v1/admins should create admin and return tempPassword', async () => {
    const mockAdmin = {
      _id: 'adm999',
      name: 'مدير جديد',
      email: 'new.admin@test.com',
      role: 'admin',
      permissions: 'rw',
    };

    vi.spyOn(Admin, 'create').mockResolvedValue(mockAdmin);
    vi.spyOn(Admin, 'findById').mockReturnValue({
      select: vi.fn().mockResolvedValue(mockAdmin),
    });

    const res = await request(app)
      .post('/api/v1/admins')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'مدير جديد',
        email: 'new.admin@test.com',
        permissions: 'rw',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('مدير جديد');
    expect(res.body.tempPassword).toBeDefined();
    expect(res.body.tempPassword.length).toBeGreaterThanOrEqual(8);
  });
});
