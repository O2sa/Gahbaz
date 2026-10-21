import { ValidationError } from "../errors/customErrors.js";

export const validateRequest = ({ body, query, params }) => {
  return async (req, res, next) => {
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
    } catch (error) {
      if (error.errors) {
        const errorDetails = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        throw new ValidationError(errorDetails, "Validation failed");
      }
      throw error;
    }
  };
};
