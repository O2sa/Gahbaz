import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError, ValidationErrorItem } from "../errors/customErrors.js";

export interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validateRequest = ({ body, query, params }: ValidationSchemas): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (body) {
        req.body = await body.parseAsync(req.body);
      }
      if (query) {
        req.query = await query.parseAsync(req.query);
      }
      if (params) {
        req.params = await params.parseAsync(req.params);
      }
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error.errors) {
        const errorDetails: ValidationErrorItem[] = (error.errors || []).map((e: any) => ({
          field: Array.isArray(e.path) ? e.path.join(".") : String(e.path || ""),
          message: e.message,
        }));
        throw new ValidationError(errorDetails, "Validation failed");
      }
      throw error;
    }
  };
};
