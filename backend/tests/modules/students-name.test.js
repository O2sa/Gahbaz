import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import Student from '../../src/models/Student.js';
import { createJWT } from '../../src/core/utils/token.utils.js';

describe('Student Name & Credentials Management', () => {
  const adminToken = createJWT({
    userId: 'admin123',
    role: 'admin',
    universityId: 'univ123',
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('POST /api/v1/students should create student with single name and return tempPassword', async () => {
    const mockStudent = {
      _id: 'stud123',
      name: 'سارة محمد الأحمد',
      email: 'sara.ahmed@student.test',
      role: 'student',
      university: 'univ123',
    };

    vi.spyOn(Student, 'create').mockResolvedValue(mockStudent);
    vi.spyOn(Student, 'findById').mockReturnValue({
      select: vi.fn().mockReturnValue({
        populate: vi.fn().mockResolvedValue(mockStudent),
      }),
    });

    const res = await request(app)
      .post('/api/v1/students')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'سارة محمد الأحمد',
        email: 'sara.ahmed@student.test',
        phone: '0551122334',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('سارة محمد الأحمد');
    expect(res.body.tempPassword).toBeDefined();
    expect(res.body.tempPassword.length).toBeGreaterThanOrEqual(8);
  });

  it('POST /api/v1/students should reject invalid names containing numbers or special chars', async () => {
    const res = await request(app)
      .post('/api/v1/students')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Student123!',
        email: 'bad.name@student.test',
      });

    expect(res.status).toBe(422);
  });
});
