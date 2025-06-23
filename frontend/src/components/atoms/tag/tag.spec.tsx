import { cleanup, render, screen } from '@test/utils';
import Tag from '.';

describe('[Component] Tag', () => {
  test('It renders variant correctly', () => {
    render(<Tag variant="primary" />);

    expect(screen.getByTestId('tag').className.includes('bg-blue-100 text-blue-600')).toBeTruthy();

    cleanup();

    render(<Tag variant="secondary" />);

    expect(screen.getByTestId('tag').className.includes('bg-neutral-200 text-gray-700')).toBeTruthy();

    cleanup();

    render(<Tag variant="light" />);

    expect(screen.getByTestId('tag').className.includes('bg-neutral-200 text-blue-500')).toBeTruthy();

    cleanup();

    render(<Tag variant="warning" />);

    expect(screen.getByTestId('tag').className.includes('bg-yellow-100 text-yellow-700')).toBeTruthy();

    cleanup();

    render(<Tag variant="success" />);

    expect(screen.getByTestId('tag').className.includes('bg-green-100 text-green-700')).toBeTruthy();

    cleanup();

    render(<Tag variant="danger" />);

    expect(screen.getByTestId('tag').className.includes('bg-red-100 text-red-600')).toBeTruthy();

    cleanup();
  });
});
