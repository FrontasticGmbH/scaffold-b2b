import { render, screen } from '@test/utils';
import Card from '.';

describe('[Component] Card', () => {
  test('It renders icon correctly', () => {
    render(<Card icon={<div data-testid="test-card-icon" />} />);

    expect(screen.getByTestId('test-card-icon')).toBeDefined();
  });

  test('It renders title correctly', () => {
    render(<Card icon={<div />} title="Title" />);

    expect(screen.getByText('Title')).toBeDefined();
  });

  test('It renders summary correctly', () => {
    render(<Card icon={<div />} summary="Summary" />);

    expect(screen.getByText('Summary')).toBeDefined();
  });
});
