import { cleanup, render, screen } from '@test/utils';
import Spacer from '.';

describe('[Component] Spacer', () => {
  test('It uses the given space correctly', () => {
    render(<Spacer space={32} />);

    expect(screen.getByTestId('spacer').style.paddingTop).toBe('32px');
  });

  test('It uses the correct background', () => {
    render(<Spacer bgColor="white" space={0} />);

    expect(screen.getByTestId('spacer').classList.contains('bg-white')).toBeTruthy();

    cleanup();

    render(<Spacer bgColor="neutral-200" space={0} />);

    expect(screen.getByTestId('spacer').classList.contains('bg-neutral-200')).toBeTruthy();
  });
});
