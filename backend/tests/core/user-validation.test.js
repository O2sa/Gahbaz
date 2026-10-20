import { describe, it, expect } from 'vitest';
import { userNameSchema } from '../../src/core/validators/user.validator.js';
import User from '../../src/models/User.js';

describe('Strict User Name Validation', () => {
  it('should accept valid Arabic and Latin names', () => {
    expect(userNameSchema.safeParse('عبدالرحمن المطيري').success).toBe(true);
    expect(userNameSchema.safeParse('Dr. John Doe').success).toBe(false); // contains period
    expect(userNameSchema.safeParse('John Doe').success).toBe(true);
    expect(userNameSchema.safeParse('Jean-Luc Picard').success).toBe(true);
  });

  it('should reject names with numbers or symbols', () => {
    expect(userNameSchema.safeParse('Ahmed123').success).toBe(false);
    expect(userNameSchema.safeParse('Sara@Admin!').success).toBe(false);
    expect(userNameSchema.safeParse('User_Name').success).toBe(false);
  });

  it('should reject names shorter than 3 or longer than 70 characters', () => {
    expect(userNameSchema.safeParse('Al').success).toBe(false);
    expect(userNameSchema.safeParse('a'.repeat(71)).success).toBe(false);
  });

  it('User model should have name as primary field and support firstName/lastName virtuals', () => {
    const user = new User({
      name: 'فيصل الشمري',
      email: 'faisal.shammari@test.com',
    });
    expect(user.name).toBe('فيصل الشمري');
    expect(user.firstName).toBe('فيصل');
    expect(user.lastName).toBe('الشمري');

    // Test setter
    user.firstName = 'طارق';
    expect(user.name).toBe('طارق الشمري');
    expect(user.firstName).toBe('طارق');
  });

  it('User model should synthesize name from firstName and lastName if name is omitted', async () => {
    const user = new User({
      firstName: 'سارة',
      lastName: 'الأحمد',
      email: 'sara.ahmed@test.com',
    });
    await user.validate();
    expect(user.name).toBe('سارة الأحمد');
  });
});
