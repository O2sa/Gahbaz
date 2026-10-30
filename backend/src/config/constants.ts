export const ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
  SUPER_ADMIN: "super-admin",
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

export const PERMISSIONS = ["r", "rw", "rd", "rwd"] as const;

export const GRADE_LETTERS = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"] as const;

export const DAYS_OF_WEEK = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"] as const;

export const getCurrentTime = (): Date => new Date();
