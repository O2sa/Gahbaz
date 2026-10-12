import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createJWT } from "../../src/core/utils/token.utils.js";
import College from "../../src/models/College.js";
import Major from "../../src/models/Major.js";
import Subject from "../../src/models/Subject.js";
import Semester from "../../src/models/Semester.js";
import Course from "../../src/models/Course.js";
import Grade from "../../src/models/Grade.js";
import Student from "../../src/models/Student.js";
import Teacher from "../../src/models/Teacher.js";
import Admin from "../../src/models/Admin.js";
import Chat from "../../src/models/Chat.js";
import Message from "../../src/models/Message.js";

describe("Listing Endpoints Pagination Integration Tests", () => {
  const adminToken = createJWT({
    userId: "660000000000000000000001",
    email: "admin@test.com",
    role: "super-admin",
    universityId: "660000000000000000000099",
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/v1/colleges should return paginated envelope with meta", async () => {
    const mockColleges = [
      { _id: "c1", name: "Engineering" },
      { _id: "c2", name: "Medicine" },
    ];

    vi.spyOn(College, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue(Promise.resolve(mockColleges)),
        }),
      }),
    });
    vi.spyOn(College, "countDocuments").mockResolvedValue(25);

    const res = await request(app)
      .get("/api/v1/colleges?page=2&limit=2")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta).toEqual({
      page: 2,
      limit: 2,
      total: 25,
      totalPages: 13,
      hasNextPage: true,
      hasPrevPage: true,
    });
  });

  it("GET /api/v1/majors should return paginated envelope with meta", async () => {
    vi.spyOn(Major, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue([{ _id: "m1", name: "CS" }]),
          }),
        }),
      }),
    });
    vi.spyOn(Major, "countDocuments").mockResolvedValue(1);

    const res = await request(app)
      .get("/api/v1/majors?page=1&limit=10")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.page).toBe(1);
    expect(res.body.meta.limit).toBe(10);
    expect(res.body.meta.total).toBe(1);
  });

  it("GET /api/v1/subjects should return paginated envelope with meta", async () => {
    vi.spyOn(Subject, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue([{ _id: "s1", name: "Math" }]),
          }),
        }),
      }),
    });
    vi.spyOn(Subject, "countDocuments").mockResolvedValue(1);

    const res = await request(app)
      .get("/api/v1/subjects?page=1&limit=5")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.meta.page).toBe(1);
    expect(res.body.meta.limit).toBe(5);
  });

  it("GET /api/v1/semesters should return paginated envelope with meta", async () => {
    vi.spyOn(Semester, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue([{ _id: "sem1", name: "Fall 2026" }]),
          }),
        }),
      }),
    });
    vi.spyOn(Semester, "countDocuments").mockResolvedValue(1);

    const res = await request(app)
      .get("/api/v1/semesters?page=1&limit=10")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.meta.totalPages).toBe(1);
  });

  it("GET /api/v1/students should return paginated envelope with meta", async () => {
    vi.spyOn(Student, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            populate: vi.fn().mockReturnValue({
              select: vi.fn().mockResolvedValue([{ _id: "st1", firstName: "Ali" }]),
            }),
            select: vi.fn().mockReturnValue({
              populate: vi.fn().mockResolvedValue([{ _id: "st1", firstName: "Ali" }]),
            }),
          }),
        }),
      }),
    });
    vi.spyOn(Student, "countDocuments").mockResolvedValue(1);

    const res = await request(app)
      .get("/api/v1/students?page=1&limit=10")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.meta.total).toBe(1);
  });

  it("GET /api/v1/teachers should return paginated envelope with meta", async () => {
    vi.spyOn(Teacher, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue([{ _id: "t1", firstName: "Prof" }]),
          }),
        }),
      }),
    });
    vi.spyOn(Teacher, "countDocuments").mockResolvedValue(1);

    const res = await request(app)
      .get("/api/v1/teachers?page=1&limit=10")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.meta.total).toBe(1);
  });

  it("GET /api/v1/admins should return paginated envelope with meta", async () => {
    vi.spyOn(Admin, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue([{ _id: "a1", firstName: "Admin" }]),
          }),
        }),
      }),
    });
    vi.spyOn(Admin, "countDocuments").mockResolvedValue(1);

    const res = await request(app)
      .get("/api/v1/admins?page=1&limit=10")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.meta.total).toBe(1);
  });

  it("should reject invalid pagination parameters with 422", async () => {
    const res = await request(app)
      .get("/api/v1/colleges?page=-1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});
