import { filterChangedProps } from '.';

describe('filterChangedProps', () => {
  it('should filter the different fields in two object', () => {
    const newObj = {
      index: 0,
      isActive: true,
      balance: '$1,894.60',
      age: 34,
    };

    const originalObj = {
      index: 0,
      age: 34,
    };

    const filteredObj = filterChangedProps(newObj, originalObj);

    expect(filteredObj).toEqual({ isActive: true, balance: '$1,894.60' });
  });
});
