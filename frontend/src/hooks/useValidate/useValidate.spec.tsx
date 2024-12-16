import { renderHook } from '@test/utils';
import useValidate from './useValidate';

describe('useValidate', () => {
  it('should reject passwords without numbers', () => {
    const {
      result: {
        current: { validatePassword },
      },
    } = renderHook(useValidate);
    const isValidPassword = validatePassword('abclmnopq');

    expect(isValidPassword).toBe(false);
  });

  it('should reject passwords without uppercase characters', () => {
    const {
      result: {
        current: { validatePassword },
      },
    } = renderHook(useValidate);
    const isValidPassword = validatePassword('abclmnopq123%');

    expect(isValidPassword).toBe(false);
  });

  it('should reject passwords with less than 8 characters', () => {
    const {
      result: {
        current: { validatePassword },
      },
    } = renderHook(useValidate);
    const isValidPassword = validatePassword('Abcl12');

    expect(isValidPassword).toBe(false);
  });

  it('should accept passwords that match the required pattern', () => {
    const {
      result: {
        current: { validatePassword },
      },
    } = renderHook(useValidate);
    const isValidPassword = validatePassword('Abclmnopq123%');

    expect(isValidPassword).toBe(true);
  });
});
