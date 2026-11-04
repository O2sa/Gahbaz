import { describe, it, expect } from 'vitest';
import { BadRequestError, NotFoundError, ForbiddenError, ConflictError } from '../../src/core/errors/customErrors.js';

describe('Standardized Domain Error Codes', () => {
  it('should instantiate BadRequestError with correct status and default code', () => {
    const err = new BadRequestError('Invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('BAD_REQUEST');
  });

  it('should instantiate NotFoundError with NOT_FOUND code', () => {
    const err = new NotFoundError('User not found');
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
  });

  it('should instantiate ForbiddenError with FORBIDDEN code', () => {
    const err = new ForbiddenError('Access denied');
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });

  it('should allow custom machine-readable domain code', () => {
    const err = new BadRequestError('Self registration closed', 'AUTH_REGISTRATION_DISABLED');
    expect(err.code).toBe('AUTH_REGISTRATION_DISABLED');
  });
});
