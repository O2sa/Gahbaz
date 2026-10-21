export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Gahbaz E-Learning Platform API",
    version: "1.0.0",
    description:
      "Enterprise E-Learning Platform API connecting universities, administrators, teachers, and students. Provides full academic lifecycle management, real-time messaging, and multi-tenant security.",
    contact: {
      name: "API Support",
      email: "support@gahbaz.com",
    },
  },
  servers: [
    {
      url: "/api/v1",
      description: "Default API Gateway (v1)",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Provide JWT bearer token in Authorization header: `Bearer <token>`",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
        description: "Session token automatically provided via HTTP-only cookie `token`",
      },
    },
    schemas: {
      StandardSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "object", description: "Resource payload" },
        },
      },
      StandardPaginatedSuccess: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "array", items: { type: "object" } },
          meta: {
            type: "object",
            properties: {
              page: { type: "integer", example: 1 },
              limit: { type: "integer", example: 20 },
              total: { type: "integer", example: 100 },
              totalPages: { type: "integer", example: 5 },
            },
          },
        },
      },
      StandardError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "VALIDATION_ERROR" },
              message: { type: "string", example: "Invalid request payload" },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string", example: "email" },
                    message: { type: "string", example: "Invalid email format" },
                  },
                },
              },
            },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7a" },
          firstName: { type: "string", example: "Ahmed" },
          lastName: { type: "string", example: "Ali" },
          email: { type: "string", format: "email", example: "ahmed@university.edu" },
          role: {
            type: "string",
            enum: ["student", "teacher", "admin", "super-admin"],
            example: "student",
          },
          university: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f70" },
          avatar: { type: "string", example: "/images/avatar.jpg" },
          phone: { type: "string", example: "+966500000000" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      College: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7b" },
          name: { type: "string", example: "College of Computer Science" },
          numberOfSemesters: { type: "integer", example: 8 },
          university: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f70" },
        },
      },
      Major: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7c" },
          name: { type: "string", example: "Software Engineering" },
          college: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7b" },
          semesterTemplates: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
      Subject: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7d" },
          name: { type: "string", example: "Data Structures & Algorithms" },
          code: { type: "string", example: "CS201" },
          college: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7b" },
          gradeSchema: {
            type: "object",
            properties: {
              total: { type: "number", example: 100 },
              grade: { type: "object" },
            },
          },
        },
      },
      SemesterTemplate: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7e" },
          name: { type: "string", example: "Level 1 - Fall" },
          major: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7c" },
          index: { type: "integer", example: 0 },
          active: { type: "boolean", example: true },
          subjects: { type: "array", items: { type: "string" } },
        },
      },
      Semester: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7f" },
          name: { type: "string", example: "Fall Term 2026" },
          major: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7c" },
          template: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7e" },
          university: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f70" },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
          completed: { type: "boolean", example: false },
        },
      },
      Course: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f80" },
          name: { type: "string", example: "Advanced Database Systems" },
          semester: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7f" },
          teachers: { type: "array", items: { type: "string" } },
          sections: { type: "array", items: { type: "string" } },
          status: { type: "string", enum: ["active", "done"], example: "active" },
        },
      },
      Section: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f81" },
          name: { type: "string", example: "Section A" },
          course: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f80" },
          lessons: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _id: { type: "string" },
                name: { type: "string", example: "Lesson 1: Introduction" },
                video: {
                  type: "object",
                  properties: { url: { type: "string" }, duration: { type: "number" } },
                },
              },
            },
          },
        },
      },
      Grade: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f82" },
          course: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f80" },
          student: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7a" },
          total: { type: "number", example: 88 },
          percent: { type: "number", example: 88 },
        },
      },
      Chat: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f83" },
          chatName: { type: "string", example: "CS101 Discussion Group" },
          isGroupChat: { type: "boolean", example: false },
          users: { type: "array", items: { type: "string" } },
          latestMessage: { type: "string" },
        },
      },
      Message: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f84" },
          sender: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7a" },
          content: { type: "string", example: "When is the next homework due?" },
          chat: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f83" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  security: [
    { bearerAuth: [] },
    { cookieAuth: [] },
  ],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register new student account",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["firstName", "lastName", "email", "password"],
                properties: {
                  firstName: { type: "string", example: "Sara" },
                  lastName: { type: "string", example: "Ahmed" },
                  email: { type: "string", format: "email", example: "sara@university.edu" },
                  password: { type: "string", format: "password", minLength: 6, example: "Password123!" },
                  university: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f70" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Account created successfully",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } },
          },
          400: { description: "Email already registered", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardError" } } } },
          422: { description: "Payload validation failure", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardError" } } } },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Log in with email and password",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "admin@test.com" },
                  password: { type: "string", format: "password", example: "Password123!" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Authentication successful, token issued and set in cookie",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } },
          },
          401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardError" } } } },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Retrieve authenticated user profile and university",
        responses: {
          200: {
            description: "Current user profile",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } },
          },
          401: { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardError" } } } },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Log out and clear session cookie",
        responses: {
          200: {
            description: "Logged out successfully",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } },
          },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List users with role filter and pagination",
        parameters: [
          { name: "role", in: "query", schema: { type: "string", enum: ["student", "teacher", "admin"] } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: {
            description: "Paginated list of users",
            content: { "application/json": { schema: { $ref: "#/components/schemas/StandardPaginatedSuccess" } } },
          },
        },
      },
    },
    "/users/me/profile": {
      patch: {
        tags: ["Users"],
        summary: "Update current user profile information",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  phone: { type: "string" },
                  avatar: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Profile updated", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/users/me/password": {
      patch: {
        tags: ["Users"],
        summary: "Change current user password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["oldPassword", "password"],
                properties: {
                  oldPassword: { type: "string" },
                  password: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password updated successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Retrieve user by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "User details", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
          404: { description: "User not found" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user account",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          204: { description: "User deleted successfully" },
          403: { description: "Unauthorized" },
        },
      },
    },
    "/colleges": {
      get: {
        tags: ["Colleges"],
        summary: "List colleges for university with pagination",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: { description: "Paginated list of colleges", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardPaginatedSuccess" } } } },
        },
      },
      post: {
        tags: ["Colleges"],
        summary: "Create new college (Admin only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "College of Science" },
                  numberOfSemesters: { type: "integer", example: 8 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "College created", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/colleges/{id}": {
      get: {
        tags: ["Colleges"],
        summary: "Get college details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "College details", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
          404: { description: "College not found" },
        },
      },
      patch: {
        tags: ["Colleges"],
        summary: "Update college",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  numberOfSemesters: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "College updated", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
      delete: {
        tags: ["Colleges"],
        summary: "Delete college and cascade associations",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          204: { description: "College deleted" },
        },
      },
    },
    "/majors": {
      get: {
        tags: ["Majors"],
        summary: "List majors with pagination",
        parameters: [
          { name: "college", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: { description: "Paginated list of majors", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardPaginatedSuccess" } } } },
        },
      },
      post: {
        tags: ["Majors"],
        summary: "Create major and generate curriculum templates",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "college"],
                properties: {
                  name: { type: "string", example: "Information Systems" },
                  college: { type: "string", example: "64fa1e2b4f1a2b3c4d5e6f7b" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Major created", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/majors/{id}": {
      get: {
        tags: ["Majors"],
        summary: "Get major by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Major details", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
      delete: {
        tags: ["Majors"],
        summary: "Delete major and associated curriculum templates",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          204: { description: "Major deleted" },
        },
      },
    },
    "/subjects": {
      get: {
        tags: ["Subjects"],
        summary: "List subjects with pagination",
        parameters: [
          { name: "college", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: { description: "Paginated list of subjects", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardPaginatedSuccess" } } } },
        },
      },
      post: {
        tags: ["Subjects"],
        summary: "Create new subject",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "Operating Systems" },
                  college: { type: "string" },
                  subtitle: { type: "string" },
                  category: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Subject created", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/subjects/{id}": {
      get: {
        tags: ["Subjects"],
        summary: "Get subject by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Subject details", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
      delete: {
        tags: ["Subjects"],
        summary: "Delete subject",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 204: { description: "Subject deleted" } },
      },
    },
    "/semesters": {
      get: {
        tags: ["Semesters"],
        summary: "List semesters with pagination",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: { description: "Paginated list of active and past semesters", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardPaginatedSuccess" } } } },
        },
      },
      post: {
        tags: ["Semesters"],
        summary: "Start new active semester and instantiate courses/chat rooms",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["semesterData", "semesters"],
                properties: {
                  semesterData: {
                    type: "object",
                    required: ["endDate"],
                    properties: { endDate: { type: "string", format: "date" } },
                  },
                  semesters: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Semesters started", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/semesters/templates": {
      get: {
        tags: ["Semesters"],
        summary: "List semester syllabus templates",
        parameters: [{ name: "major", in: "query", schema: { type: "string" } }],
        responses: {
          200: { description: "Curriculum templates", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
      post: {
        tags: ["Semesters"],
        summary: "Create semester syllabus template",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "major"],
                properties: {
                  name: { type: "string" },
                  major: { type: "string" },
                  index: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Template created", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/courses": {
      get: {
        tags: ["Courses"],
        summary: "Get courses for current user with pagination",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: { description: "Paginated user course enrollments", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardPaginatedSuccess" } } } },
        },
      },
      post: {
        tags: ["Courses"],
        summary: "Create course offering (Admin only)",
        responses: {
          201: { description: "Course offering created", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/courses/{id}": {
      get: {
        tags: ["Courses"],
        summary: "Get course details with sections and teachers",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Course details", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/courses/sections": {
      post: {
        tags: ["Courses"],
        summary: "Create section in course",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "course"],
                properties: {
                  name: { type: "string", example: "Section 1" },
                  course: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Section created", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/courses/sections/{sectionId}/lessons": {
      post: {
        tags: ["Courses"],
        summary: "Add lesson to section",
        parameters: [{ name: "sectionId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "Video Lecture 1" },
                  video: {
                    type: "object",
                    properties: { url: { type: "string" }, duration: { type: "number" } },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Lesson added", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/grades/course/{courseId}": {
      get: {
        tags: ["Grades"],
        summary: "Get all grades for a course with pagination",
        parameters: [
          { name: "courseId", in: "path", required: true, schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: { description: "Paginated course roster grades", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardPaginatedSuccess" } } } },
        },
      },
    },
    "/grades/student/{studentId}": {
      get: {
        tags: ["Grades"],
        summary: "Get academic transcript for a student",
        parameters: [{ name: "studentId", in: "path", required: false, schema: { type: "string" } }],
        responses: {
          200: { description: "Student academic grades transcript", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/grades/{gradeId}": {
      patch: {
        tags: ["Grades"],
        summary: "Update student grade assessment",
        parameters: [{ name: "gradeId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: {
          200: { description: "Grade updated and recalculated", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/students": {
      get: {
        tags: ["People & Roles"],
        summary: "List all students in university with pagination",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: { description: "Paginated students list", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardPaginatedSuccess" } } } },
        },
      },
      post: {
        tags: ["People & Roles"],
        summary: "Register new student with auto-generated secure password and email invite",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["firstName", "lastName", "email", "major"],
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string", format: "email" },
                  major: { type: "string" },
                  phone: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Student created", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/teachers": {
      get: {
        tags: ["People & Roles"],
        summary: "List all teachers in university with pagination",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: { description: "Paginated teachers list", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardPaginatedSuccess" } } } },
        },
      },
      post: {
        tags: ["People & Roles"],
        summary: "Register teacher account with generated credentials",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["firstName", "lastName", "email"],
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string", format: "email" },
                  title: { type: "string", example: "Professor" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Teacher created", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/admins": {
      get: {
        tags: ["People & Roles"],
        summary: "List administrators with pagination (Super-admin only)",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: { description: "Paginated admins list", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardPaginatedSuccess" } } } },
        },
      },
      post: {
        tags: ["People & Roles"],
        summary: "Create new administrator (Super-admin only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["firstName", "lastName", "email"],
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string", format: "email" },
                  permissions: { type: "string", enum: ["r", "rw", "rd", "rwd"], default: "r" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Admin created", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/chats": {
      get: {
        tags: ["Chat & Messaging"],
        summary: "List chats current user participates in with pagination",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: { description: "Paginated user chats", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardPaginatedSuccess" } } } },
        },
      },
      post: {
        tags: ["Chat & Messaging"],
        summary: "Access or initiate direct chat",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userId"],
                properties: { userId: { type: "string" } },
              },
            },
          },
        },
        responses: {
          200: { description: "Chat room opened", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/chats/group": {
      post: {
        tags: ["Chat & Messaging"],
        summary: "Create group chat room",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "users"],
                properties: {
                  name: { type: "string", example: "Study Group" },
                  users: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Group chat created", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/chats/{chatId}/messages": {
      get: {
        tags: ["Chat & Messaging"],
        summary: "Get chat message history with pagination",
        parameters: [
          { name: "chatId", in: "path", required: true, schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          200: { description: "Paginated message history", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardPaginatedSuccess" } } } },
        },
      },
      post: {
        tags: ["Chat & Messaging"],
        summary: "Send message in chat room",
        parameters: [{ name: "chatId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: {
                  content: { type: "string", example: "Hello everyone!" },
                  attachment: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Message sent", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/system/stats": {
      get: {
        tags: ["System & Telemetry"],
        summary: "Get dashboard telemetry and resource stats (Admin only)",
        responses: {
          200: { description: "Telemetry metrics", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
    "/system/search": {
      get: {
        tags: ["System & Telemetry"],
        summary: "Search system entities with ReDoS protection",
        parameters: [{ name: "q", in: "query", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Search results matching role access", content: { "application/json": { schema: { $ref: "#/components/schemas/StandardSuccess" } } } },
        },
      },
    },
  },
};

export default openApiSpec;
