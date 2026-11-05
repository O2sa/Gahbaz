import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { createJWT } from "../../../src/core/utils/token.utils.js";
import University from "../../../src/models/University.js";
import User from "../../../src/models/User.js";
import College from "../../../src/models/College.js";
import Major from "../../../src/models/Major.js";
import Course from "../../../src/models/Course.js";
import mongoose from "mongoose";

describe("Universities Provisioning & Governance Module (REQ-GOV-001)", () => {
  const superAdminToken = createJWT({
    userId: "64f1a2b3c4d5e6f7a8b9c001",
    email: "super@gahbaz.com",
    role: "super-admin",
  });

  const adminToken = createJWT({
    userId: "64f1a2b3c4d5e6f7a8b9c002",
    email: "admin@univ.com",
    role: "admin",
    universityId: "64f1a2b3c4d5e6f7a8b9c099",
  });

  const studentToken = createJWT({
    userId: "64f1a2b3c4d5e6f7a8b9c003",
    email: "student@univ.com",
    role: "student",
    universityId: "64f1a2b3c4d5e6f7a8b9c099",
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("POST /api/v1/universities should reject student and admin with 403 Forbidden", async () => {
    const payload = {
      name: "King Saud University",
      code: "KSU",
      adminName: "Dr. Fahad",
      adminEmail: "fahad@ksu.edu.sa",
    };

    const resAdmin = await request(app)
      .post("/api/v1/universities")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload);
    expect(resAdmin.status).toBe(403);

    const resStudent = await request(app)
      .post("/api/v1/universities")
      .set("Authorization", `Bearer ${studentToken}`)
      .send(payload);
    expect(resStudent.status).toBe(403);
  });

  it("POST /api/v1/universities should reject duplicate name or code with 400 Bad Request", async () => {
    vi.spyOn(University, "findOne").mockResolvedValueOnce({
      _id: "existing_id",
      name: "King Saud University",
      code: "KSU",
    });

    const res = await request(app)
      .post("/api/v1/universities")
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({
        name: "King Saud University",
        code: "KSU",
        adminName: "Dr. Fahad",
        adminEmail: "fahad@ksu.edu.sa",
      });

    expect(res.status).toBe(400);
    const msg = res.body.error?.message || res.body.message || res.body.msg;
    expect(msg).toMatch(/already exists/i);
  });

  it("POST /api/v1/universities should reject duplicate admin email with 400 Bad Request", async () => {
    vi.spyOn(University, "findOne").mockResolvedValueOnce(null);
    vi.spyOn(User, "findOne").mockResolvedValueOnce({
      _id: "existing_admin_id",
      email: "fahad@ksu.edu.sa",
    });

    const res = await request(app)
      .post("/api/v1/universities")
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({
        name: "King Saud University",
        code: "KSU",
        adminName: "Dr. Fahad",
        adminEmail: "fahad@ksu.edu.sa",
      });

    expect(res.status).toBe(400);
    const msg = res.body.error?.message || res.body.message || res.body.msg;
    expect(msg).toMatch(/email already in use/i);
  });

  it("POST /api/v1/universities should provision university & admin in a transaction and return credentials", async () => {
    vi.spyOn(University, "findOne").mockResolvedValue(null);
    vi.spyOn(User, "findOne").mockResolvedValue(null);

    const mockUnivId = "64f1a2b3c4d5e6f7a8b9c099";
    const mockAdminId = "64f1a2b3c4d5e6f7a8b9c088";

    // Mock session
    const mockSession = {
      startTransaction: vi.fn(),
      commitTransaction: vi.fn(),
      abortTransaction: vi.fn(),
      endSession: vi.fn(),
    };
    vi.spyOn(mongoose, "startSession").mockResolvedValue(mockSession);

    vi.spyOn(University.prototype, "save").mockResolvedValue({
      _id: mockUnivId,
      name: "King Saud University",
      code: "KSU",
      admin: mockAdminId,
      active: true,
    });

    vi.spyOn(User, "create").mockResolvedValue([
      {
        _id: mockAdminId,
        name: "Dr. Fahad",
        email: "fahad@ksu.edu.sa",
        role: "admin",
        university: mockUnivId,
      },
    ]);

    const res = await request(app)
      .post("/api/v1/universities")
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({
        name: "King Saud University",
        code: "KSU",
        adminName: "Dr. Fahad",
        adminEmail: "fahad@ksu.edu.sa",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.university.name).toBe("King Saud University");
    expect(res.body.university.code).toBe("KSU");
    expect(res.body.admin.email).toBe("fahad@ksu.edu.sa");
    expect(res.body.tempPassword).toBeDefined();
    expect(typeof res.body.tempPassword).toBe("string");
    expect(res.body.tempPassword.length).toBeGreaterThan(6);
  });

  it("GET /api/v1/universities should return paginated list with aggregated telemetry", async () => {
    const mockUniv = {
      _id: "64f1a2b3c4d5e6f7a8b9c099",
      name: "King Saud University",
      code: "KSU",
      active: true,
      admin: {
        _id: "64f1a2b3c4d5e6f7a8b9c088",
        name: "Dr. Fahad",
        email: "fahad@ksu.edu.sa",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.spyOn(University, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            populate: vi.fn().mockReturnValue({
              lean: vi.fn().mockResolvedValue([mockUniv]),
            }),
          }),
        }),
      }),
    });

    vi.spyOn(University, "countDocuments").mockResolvedValue(1);
    vi.spyOn(College, "countDocuments").mockResolvedValue(4);
    vi.spyOn(Major, "countDocuments").mockResolvedValue(8);
    vi.spyOn(Course, "countDocuments").mockResolvedValue(15);
    vi.spyOn(User, "countDocuments")
      .mockResolvedValueOnce(120) // students
      .mockResolvedValueOnce(18); // teachers

    const res = await request(app)
      .get("/api/v1/universities")
      .set("Authorization", `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.universities).toHaveLength(1);
    const item = res.body.universities[0];
    expect(item.name).toBe("King Saud University");
    expect(item.code).toBe("KSU");
    expect(item.telemetry).toBeDefined();
    expect(item.telemetry.collegesCount).toBe(4);
    expect(item.telemetry.majorsCount).toBe(8);
    expect(item.telemetry.coursesCount).toBe(15);
    expect(item.telemetry.studentsCount).toBe(120);
    expect(item.telemetry.teachersCount).toBe(18);
  });

  it("GET /api/v1/universities/:id should return single university with telemetry", async () => {
    const mockUniv = {
      _id: "64f1a2b3c4d5e6f7a8b9c099",
      name: "King Saud University",
      code: "KSU",
      active: true,
      admin: {
        _id: "64f1a2b3c4d5e6f7a8b9c088",
        name: "Dr. Fahad",
        email: "fahad@ksu.edu.sa",
      },
    };

    vi.spyOn(University, "findById").mockReturnValue({
      populate: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockUniv),
      }),
    });

    vi.spyOn(College, "countDocuments").mockResolvedValue(5);
    vi.spyOn(Major, "countDocuments").mockResolvedValue(10);
    vi.spyOn(Course, "countDocuments").mockResolvedValue(25);
    vi.spyOn(User, "countDocuments")
      .mockResolvedValueOnce(350) // students
      .mockResolvedValueOnce(30); // teachers

    const res = await request(app)
      .get("/api/v1/universities/64f1a2b3c4d5e6f7a8b9c099")
      .set("Authorization", `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.university.name).toBe("King Saud University");
    expect(res.body.university.telemetry.collegesCount).toBe(5);
  });

  it("PATCH /api/v1/universities/:id should update details and status", async () => {
    vi.spyOn(University, "findById").mockResolvedValue({
      _id: "64f1a2b3c4d5e6f7a8b9c099",
      name: "King Saud University",
      code: "KSU",
      active: true,
    });

    vi.spyOn(University, "findOne").mockResolvedValue(null);

    vi.spyOn(University, "findByIdAndUpdate").mockReturnValue({
      populate: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: "64f1a2b3c4d5e6f7a8b9c099",
          name: "King Saud University Renamed",
          code: "KSUR",
          active: false,
          admin: { name: "Dr. Fahad", email: "fahad@ksu.edu.sa" },
        }),
      }),
    });

    const res = await request(app)
      .patch("/api/v1/universities/64f1a2b3c4d5e6f7a8b9c099")
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({
        name: "King Saud University Renamed",
        code: "KSUR",
        active: false,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.university.name).toBe("King Saud University Renamed");
    expect(res.body.university.active).toBe(false);
  });

  it("GET /api/v1/universities/my-university should return admin's own university details", async () => {
    vi.spyOn(University, "findById").mockReturnValue({
      populate: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: "64f1a2b3c4d5e6f7a8b9c099",
          name: "King Saud University",
          code: "KSU",
          needsSetup: true,
          active: true,
          admin: { name: "Admin", email: "admin@univ.com" },
        }),
      }),
    });
    vi.spyOn(College, "countDocuments").mockResolvedValue(4);
    vi.spyOn(Major, "countDocuments").mockResolvedValue(10);
    vi.spyOn(Course, "countDocuments").mockResolvedValue(15);
    vi.spyOn(User, "countDocuments").mockResolvedValue(200);

    const res = await request(app)
      .get("/api/v1/universities/my-university")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.university.name).toBe("King Saud University");
    expect(res.body.university.needsSetup).toBe(true);
  });

  it("PATCH /api/v1/universities/my-university should update university and clear needsSetup", async () => {
    vi.spyOn(University, "findById").mockResolvedValue({
      _id: "64f1a2b3c4d5e6f7a8b9c099",
      name: "Temporary University",
      code: "UTEMP",
      needsSetup: true,
    });
    vi.spyOn(University, "findOne").mockResolvedValue(null);
    vi.spyOn(University, "findByIdAndUpdate").mockReturnValue({
      populate: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: "64f1a2b3c4d5e6f7a8b9c099",
          name: "Modern Science University",
          code: "MSU",
          needsSetup: false,
          admin: { name: "Admin", email: "admin@univ.com" },
        }),
      }),
    });

    const res = await request(app)
      .patch("/api/v1/universities/my-university")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Modern Science University",
        code: "MSU",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.university.name).toBe("Modern Science University");
    expect(res.body.university.code).toBe("MSU");
    expect(res.body.university.needsSetup).toBe(false);
  });

  it("PATCH /api/v1/universities/my-university should reject student with 403 Forbidden", async () => {
    const res = await request(app)
      .patch("/api/v1/universities/my-university")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        name: "Hacked University",
        code: "HCK",
      });

    expect(res.status).toBe(403);
  });
});
