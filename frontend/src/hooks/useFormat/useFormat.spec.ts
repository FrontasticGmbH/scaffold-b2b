import { renderHook } from '@test/utils';
import useFormat from '.';

describe('[Hook] useFormat', () => {
  it('Formats currency correctly', () => {
    const {
      result: {
        current: { formatCurrency },
      },
    } = renderHook(useFormat);

    expect(formatCurrency(100, 'USD')).toBe('$100.00');
    expect(formatCurrency(100, 'EUR')).toBe('€100.00');
    expect(formatCurrency(100, 'GBP')).toBe('£100.00');
  });

  it('Formats address correctly', () => {
    const {
      result: {
        current: { formatAddress },
      },
    } = renderHook(useFormat);

    expect(
      formatAddress({
        name: 'Zack',
        careOf: 'Kuni',
        zip: 'NW1 6XE',
        country: 'United Kingdom',
        streetName: 'Baker Street',
        streetNumber: '221B',
        city: 'Leicester',
      }),
    ).toBe('Zack (c/o Kuni)\nBaker Street 221B\nNW1 6XE Leicester, United Kingdom');

    expect(
      formatAddress({
        name: 'Zack',
        streetName: 'King Street',
        streetNumber: '221B',
        careOf: 'Kuni',
        zip: 'NW1 6XE',
        city: 'New York',
        country: 'United States',
      }),
    ).toBe('Zack (c/o Kuni)\nKing Street 221B\nNW1 6XE New York, United States');
  });

  it('Formats local date correctly', () => {
    const {
      result: {
        current: { formatLocalDate },
      },
    } = renderHook(useFormat);

    expect(formatLocalDate('2024/12/7')).toBe('07-12-2024');
    expect(formatLocalDate('2024/8/31')).toBe('31-08-2024');
  });

  it('Formats position correctly', () => {
    const {
      result: {
        current: { formatPosition },
      },
    } = renderHook(useFormat);

    expect(formatPosition(1)).toBe('1st');
    expect(formatPosition(2)).toBe('2nd');
    expect(formatPosition(3)).toBe('3rd');
    expect(formatPosition(5)).toBe('5th');
    expect(formatPosition(11)).toBe('11th');
    expect(formatPosition(12)).toBe('12th');
    expect(formatPosition(13)).toBe('13th');
    expect(formatPosition(21)).toBe('21st');
    expect(formatPosition(42)).toBe('42nd');
    expect(formatPosition(53)).toBe('53rd');
    expect(formatPosition(142)).toBe('142nd');
    expect(formatPosition(411)).toBe('411th');
  });
});
