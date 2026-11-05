import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../src/app.js';
import Grade from '../../../src/models/Grade.js';
import Course from '../../../src/models/Course.js';
import { createJWT } from '../../../src/core/utils/token.utils.js';

describe('Faculty Gradebook & Assessment Service', () => {
  const adminToken = createJWT({
    userId: 'admin123',
    role: 'admin',
    universityId: 'univ123',
  });

  const courseId = '64f1a2b3c4d5e6f7a8b9c0d1';
  const gradeId = '64f1a2b3c4d5e6f7a8b9c0d2';

  const mockCourse = {
    _id: courseId,
    name: 'هياكل البيانات',
    code: 'CS201',
    creditHours: 3,
    gradeSchema: {
      total: 100,
      grade: {
        0: { name: 'تكاليف', value: 20 },
        1: { name: 'نصفي', value: 30 },
        2: { name: 'نهائي', value: 50 },
      },
    },
  };

  const mockStudent = {
    _id: 'stud123',
    name: 'أحمد محمود العتيبي',
    email: 'ahmed.student@test.com',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/v1/grades/course/:courseId should return enriched envelope with gradeSchema and metrics', async () => {
    const mockGrades = [
      {
        _id: gradeId,
        course: courseId,
        student: mockStudent,
        grade: {
          0: { name: 'تكاليف', value: 15 },
          1: { name: 'نصفي', value: 25 },
          2: { name: 'نهائي', value: 40 },
        },
        total: 80,
        percent: 80,
      },
    ];

    vi.spyOn(Course, 'findById').mockResolvedValue(mockCourse);
    vi.spyOn(Grade, 'find').mockReturnValue({
      populate: vi.fn().mockResolvedValue(mockGrades),
    });

    const res = await request(app)
      .get(`/api/v1/grades/course/${courseId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.gradeSchema).toBeDefined();
    expect(res.body.data.metrics.totalStudents).toBe(1);
    expect(res.body.data.metrics.averageScore).toBe(80);
    expect(res.body.data.metrics.passingRate).toBe(100);
    expect(res.body.data.grades.length).toBe(1);
    expect(res.body.data.grades[0].student.name).toBe('أحمد محمود العتيبي');
  });

  it('PATCH /api/v1/grades/:id should reject score exceeding maxValue', async () => {
    const mockGradeDoc = {
      _id: gradeId,
      course: courseId,
      grade: {
        0: { name: 'تكاليف', value: 15 },
      },
      updateGrade: vi.fn(),
    };

    vi.spyOn(Grade, 'findById').mockResolvedValue(mockGradeDoc);
    vi.spyOn(Course, 'findById').mockResolvedValue(mockCourse);

    const res = await request(app)
      .patch(`/api/v1/grades/${gradeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        grade: {
          0: { name: 'تكاليف', value: 25 }, // Exceeds max 20
        },
      });

    expect(res.status).toBe(400);
  });

  it('PATCH /api/v1/grades/:id should update valid scores and recalculate total and percent', async () => {
    const mockGradeDoc = {
      _id: gradeId,
      course: courseId,
      grade: {
        0: { name: 'تكاليف', value: 15 },
        1: { name: 'نصفي', value: 25 },
        2: { name: 'نهائي', value: 40 },
      },
      total: 80,
      percent: 80,
      updateGrade: vi.fn().mockImplementation(function (payload) {
        this.total = 95;
        this.percent = 95;
        return Promise.resolve(this);
      }),
    };

    vi.spyOn(Grade, 'findById').mockResolvedValue(mockGradeDoc);
    vi.spyOn(Course, 'findById').mockResolvedValue(mockCourse);

    const res = await request(app)
      .patch(`/api/v1/grades/${gradeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        grade: {
          0: { name: 'تكاليف', value: 20 },
          1: { name: 'نصفي', value: 30 },
          2: { name: 'نهائي', value: 45 },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(95);
    expect(res.body.data.percent).toBe(95);
  });

  it('Grade.schema.methods.updateGrade should update all item scores, markModified grade, and recalculate total', async () => {
    const gradeInstance = new Grade({
      course: courseId,
      student: 'stud123',
      grade: {
        0: { name: 'تكاليف', value: 10 },
        1: { name: 'نصفي', value: 20 },
        2: { name: 'نهائي', value: 30 },
      },
      total: 60,
      percent: 60,
    });

    const markModifiedSpy = vi.spyOn(gradeInstance, 'markModified');
    vi.spyOn(gradeInstance, 'save').mockImplementation(async function () {
      return this;
    });

    await gradeInstance.updateGrade(
      {
        0: { name: 'تكاليف', value: 18 },
        1: { name: 'نصفي', value: 28 },
        2: { name: 'نهائي', value: 48 },
      },
      mockCourse.gradeSchema
    );

    expect(markModifiedSpy).toHaveBeenCalledWith('grade');
    expect(gradeInstance.grade['0'].value).toBe(18);
    expect(gradeInstance.grade['1'].value).toBe(28);
    expect(gradeInstance.grade['2'].value).toBe(48);
    expect(gradeInstance.total).toBe(94);
    expect(gradeInstance.percent).toBe(94);
  });
});
