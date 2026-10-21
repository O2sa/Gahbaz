import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import Teacher from '../../src/models/Teacher.js';
import { createJWT } from '../../src/core/utils/token.utils.js';

describe('Teacher Name & Title Management', () => {
  const adminToken = createJWT({
    userId: 'admin123',
    role: 'admin',
    universityId: 'univ123',
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('POST /api/v1/teachers should create teacher with name, title, and return tempPassword', async () => {
    const mockTeacher = {
      _id: 'teach123',
      name: 'فيصل الشمري',
      title: 'دكتور',
      email: 'faisal.shammari@teacher.test',
      role: 'teacher',
      university: 'univ123',
    };

    vi.spyOn(Teacher, 'create').mockResolvedValue(mockTeacher);
    vi.spyOn(Teacher, 'findById').mockReturnValue({
      select: vi.fn().mockResolvedValue(mockTeacher),
    });

    const res = await request(app)
      .post('/api/v1/teachers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'فيصل الشمري',
        title: 'دكتور',
        email: 'faisal.shammari@teacher.test',
        phone: '0559988776',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('فيصل الشمري');
    expect(res.body.data.title).toBe('دكتور');
    expect(res.body.tempPassword).toBeDefined();
    expect(res.body.tempPassword.length).toBeGreaterThanOrEqual(8);
  });

  it('POST /api/v1/teachers should reject invalid names containing numbers or special chars', async () => {
    const res = await request(app)
      .post('/api/v1/teachers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Teacher#1',
        email: 'bad.teacher@test.com',
      });

    expect(res.status).toBe(422);
  });
});
