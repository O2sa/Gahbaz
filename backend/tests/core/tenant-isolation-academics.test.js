import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createJWT } from "../../src/core/utils/token.utils.js";
import College from "../../src/models/College.js";
import Major from "../../src/models/Major.js";
import Subject from "../../src/models/Subject.js";

describe("Tenant Isolation for Academic Catalog (/majors, /subjects, /colleges)", () => {
  const univAToken = createJWT({
    userId: "adminA",
    role: "admin",
    universityId: "univ_AAA",
  });

  const superAdminToken = createJWT({
    userId: "superAdmin1",
    role: "super-admin",
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/v1/majors should scope to colleges of the authenticated user's university", async () => {
    const mockCollegeIds = ["col_A1", "col_A2"];
    vi.spyOn(College, "find").mockReturnValue({
      distinct: vi.fn().mockResolvedValue(mockCollegeIds),
    });

    const mockMajors = [
      { _id: "maj_1", name: "Computer Science", college: "col_A1" },
    ];

    const majorFindSpy = vi.spyOn(Major, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue(mockMajors),
          }),
        }),
      }),
    });
    vi.spyOn(Major, "countDocuments").mockResolvedValue(1);

    const res = await request(app)
      .get("/api/v1/majors")
      .set("Authorization", `Bearer ${univAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(College.find).toHaveBeenCalledWith({ university: "univ_AAA" });
    expect(majorFindSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: [
          { university: "univ_AAA" },
          { college: { $in: mockCollegeIds } },
        ],
      })
    );
  });

  it("GET /api/v1/majors should adopt x-university-id for super-admin", async () => {
    const mockCollegeIds = ["col_B1"];
    vi.spyOn(College, "find").mockReturnValue({
      distinct: vi.fn().mockResolvedValue(mockCollegeIds),
    });

    const majorFindSpy = vi.spyOn(Major, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    });
    vi.spyOn(Major, "countDocuments").mockResolvedValue(0);

    const res = await request(app)
      .get("/api/v1/majors")
      .set("Authorization", `Bearer ${superAdminToken}`)
      .set("x-university-id", "univ_BBB");

    expect(res.status).toBe(200);
    expect(College.find).toHaveBeenCalledWith({ university: "univ_BBB" });
    expect(majorFindSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: [
          { university: "univ_BBB" },
          { college: { $in: mockCollegeIds } },
        ],
      })
    );
  });

  it("GET /api/v1/majors with college query outside user's university should return empty results", async () => {
    const mockCollegeIds = ["col_A1", "col_A2"];
    vi.spyOn(College, "find").mockReturnValue({
      distinct: vi.fn().mockResolvedValue(mockCollegeIds),
    });

    const majorFindSpy = vi.spyOn(Major, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    });
    vi.spyOn(Major, "countDocuments").mockResolvedValue(0);

    const res = await request(app)
      .get("/api/v1/majors?college=foreign_col_999")
      .set("Authorization", `Bearer ${univAToken}`);

    expect(res.status).toBe(200);
    expect(majorFindSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        college: { $in: [] },
      })
    );
  });

  it("GET /api/v1/subjects should scope to user's university and colleges", async () => {
    const mockCollegeIds = ["col_A1"];
    vi.spyOn(College, "find").mockReturnValue({
      distinct: vi.fn().mockResolvedValue(mockCollegeIds),
    });

    const mockSubjects = [
      { _id: "sub_1", name: "Data Structures", college: "col_A1", university: "univ_AAA" },
    ];

    const subjectFindSpy = vi.spyOn(Subject, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue(mockSubjects),
          }),
        }),
      }),
    });
    vi.spyOn(Subject, "countDocuments").mockResolvedValue(1);

    const res = await request(app)
      .get("/api/v1/subjects")
      .set("Authorization", `Bearer ${univAToken}`);

    expect(res.status).toBe(200);
    expect(College.find).toHaveBeenCalledWith({ university: "univ_AAA" });
    expect(subjectFindSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: [
          { university: "univ_AAA" },
          { college: { $in: mockCollegeIds } },
        ],
      })
    );
  });

  it("GET /api/v1/subjects with search should maintain university isolation via $and", async () => {
    const mockCollegeIds = ["col_A1"];
    vi.spyOn(College, "find").mockReturnValue({
      distinct: vi.fn().mockResolvedValue(mockCollegeIds),
    });

    const subjectFindSpy = vi.spyOn(Subject, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            populate: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    });
    vi.spyOn(Subject, "countDocuments").mockResolvedValue(0);

    const res = await request(app)
      .get("/api/v1/subjects?search=algorithms")
      .set("Authorization", `Bearer ${univAToken}`);

    expect(res.status).toBe(200);
    expect(subjectFindSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        $and: [
          {
            $or: [
              { university: "univ_AAA" },
              { college: { $in: mockCollegeIds } },
            ],
          },
          {
            $or: [
              { name: { $regex: "algorithms", $options: "i" } },
              { code: { $regex: "algorithms", $options: "i" } },
            ],
          },
        ],
      })
    );
  });

  it("GET /api/v1/colleges for super-admin without header returns all colleges", async () => {
    const collegeFindSpy = vi.spyOn(College, "find").mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    vi.spyOn(College, "countDocuments").mockResolvedValue(0);

    const res = await request(app)
      .get("/api/v1/colleges")
      .set("Authorization", `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    // When super admin has no university context, filter should be empty {} rather than { university: undefined }
    expect(collegeFindSpy).toHaveBeenCalledWith({});
  });
});
