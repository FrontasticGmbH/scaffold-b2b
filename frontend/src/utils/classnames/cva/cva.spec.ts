import { cva } from '.';

describe('[Util] cva', () => {
  it('Resolves classnames correctly based on variants', () => {
    const resolveVariant = cva({ primary: 'bg-primary', secondary: 'bg-secondary' });

    const primary = resolveVariant('primary');
    const secondary = resolveVariant('secondary');

    expect(primary).toBe('bg-primary');
    expect(secondary).toBe('bg-secondary');
  });

  it('Resolves classnames correctly based on nested variants', () => {
    const resolveVariant = cva({ primary: { sm: 'bg-primary text-sm' } });

    const primarySmall = resolveVariant('primary.sm');

    expect(primarySmall).toBe('bg-primary text-sm');
  });

  it('Resolves to object correctly for partial resolves', () => {
    const resolveVariant = cva({ primary: { sm: 'bg-primary text-sm' } });

    const primary = resolveVariant('primary');

    expect(primary).toMatchObject({ sm: 'bg-primary text-sm' });
  });

  it('Resolves classnames correctly when given an array', () => {
    const resolveVariant = cva({ primary: { sm: ['bg-primary', 'text-sm'] } });

    const primarySmall = resolveVariant('primary.sm');

    expect(primarySmall).toBe('bg-primary text-sm');
  });

  it('Resolves to undefined when giving an invalid token to an array', () => {
    const resolveVariant = cva({ primary: { sm: ['bg-primary', 'text-sm'] } });

    const primarySmall = resolveVariant('primary.sm.disabled');

    expect(primarySmall).toBeUndefined();
  });

  it('Removes falsy values when resolving classnames in an array', () => {
    const resolveVariant = cva({ primary: { sm: ['bg-primary', undefined, 'text-sm'] } });

    const primarySmall = resolveVariant('primary.sm');

    expect(primarySmall).toBe('bg-primary text-sm');
  });

  it('Resolves to undefined for invalid tokens', () => {
    const resolveVariant = cva({ primary: { sm: 'bg-primary text-sm' } });

    const primaryBig = resolveVariant('primary.bg');
    const secondary = resolveVariant('secondary');

    expect(primaryBig).toBeUndefined();
    expect(secondary).toBeUndefined();
  });
});
