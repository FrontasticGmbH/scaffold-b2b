import { isEmptyObject } from '.';

describe('isEmptyObject', () => {
  it('should return true when an object is empty', () => {
    expect(isEmptyObject({})).toBe(true);
  });

  it('should return false when an object is not empty', () => {
    expect(isEmptyObject({ name: 'test' })).toBe(false);
  });
});
