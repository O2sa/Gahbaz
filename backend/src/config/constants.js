export const ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
  SUPER_ADMIN: "super-admin",
};

export const PERMISSIONS = ["r", "rw", "rd", "rwd"];

export const GRADE_LETTERS = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"];

export const DAYS_OF_WEEK = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

export const getCurrentTime = () => new Date();
