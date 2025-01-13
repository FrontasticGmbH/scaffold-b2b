import { StringHelpers } from '.';

describe('StringHelpers', () => {
  it('should detect numbers correctly', () => {
    expect(StringHelpers.isNumeric('45')).toBe(true);
  });

  it('should detect if string is not a number', () => {
    expect(StringHelpers.isNumeric('5a')).toBe(false);
  });

  it('should capitalize the first character of a string', () => {
    expect(StringHelpers.capitaliseFirstLetter('test')).toEqual('Test');
  });
});
