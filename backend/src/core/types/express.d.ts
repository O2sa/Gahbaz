export interface AuthenticatedUser {
  userId: string;
  id?: string;
  email: string;
  role: "super-admin" | "admin" | "teacher" | "student";
  universityId?: string;
  isDemoUser?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
