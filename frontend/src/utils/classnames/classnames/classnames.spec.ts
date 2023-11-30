import { classnames } from '.';

describe('[Util] classnames', () => {
  it('Concatenates classes correctly', () => {
    const classNames = classnames('bg-red-100', 'text-red-100', 'font-medium');

    expect(classNames).toBe('bg-red-100 text-red-100 font-medium');
  });

  it('Removes falsy values', () => {
    const classNames = classnames('bg-red-100', null, 'font-medium');

    expect(classNames).toBe('bg-red-100 font-medium');
  });

  it('Resolves conditional class names correctly', () => {
    const classNames = classnames(
      'bg-red-100',
      { 'text-red-100': true, 'text-red-200': false },
      { 'font-thin': false, 'font-medium': true },
    );

    expect(classNames).toBe('bg-red-100 text-red-100 font-medium');
  });
});
