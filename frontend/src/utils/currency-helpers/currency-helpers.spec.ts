import { CurrencyHelpers } from '.';

describe('CurrencyHelpers', () => {
  it('should format amount to Euros by default', () => {
    const formattedAmount = CurrencyHelpers.formatForCurrency('1200', 'en');

    expect(formattedAmount).toBe('€12');
  });

  it('should format amount with the provided fractional digits', () => {
    const formattedAmount = CurrencyHelpers.formatForCurrency(25000.957, 'en', 'eur', 2);

    expect(formattedAmount).toBe('€250.01');
  });

  it('should format amount if it is passed as a number', () => {
    const formattedAmount = CurrencyHelpers.formatForCurrency(15000, 'en', 'usd');

    expect(formattedAmount).toBe('US$150');
  });

  it('should add currencies correctly', () => {
    const value = CurrencyHelpers.addCurrency(
      { centAmount: 9000, fractionDigits: 2, currencyCode: 'eur' },
      { centAmount: 15000, currencyCode: 'eur', fractionDigits: 2 },
    );

    expect(value).toEqual({ centAmount: 24000, currencyCode: 'eur', fractionDigits: 2 });
  });

  it('should subtract currencies correctly', () => {
    const value = CurrencyHelpers.subtractCurrency(
      { centAmount: 15000, currencyCode: 'usd', fractionDigits: 2 },
      { centAmount: 5000, currencyCode: 'usd', fractionDigits: 2 },
    );

    expect(value).toEqual({ centAmount: 10000, currencyCode: 'usd', fractionDigits: 2 });
  });

  it('should multiply currencies correctly', () => {
    const value = CurrencyHelpers.multiplyCurrency({ centAmount: 3000, currencyCode: 'eur', fractionDigits: 2 }, 5);

    expect(value).toEqual({ centAmount: 15000, currencyCode: 'eur', fractionDigits: 2 });
  });

  it('should return empty when the amount is not a valid number', () => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());

    const formattedAmount = CurrencyHelpers.formatForCurrency('abc', 'en', 'usd');
    expect(formattedAmount).toBe('');

    jest.clearAllMocks();
  });
});
