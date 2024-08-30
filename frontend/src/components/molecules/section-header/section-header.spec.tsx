import { render, screen } from '@test/utils';
import SectionHeader from '.';

describe('[Component] Section header', () => {
  it('Renders title correctly when provided', () => {
    render(<SectionHeader title="Hello!" />);

    expect(screen.queryByRole('heading')).toBeInTheDocument();
    expect(screen.queryByRole('heading')?.textContent).toBe('Hello!');
  });

  it("Doesn't render title when not provided", () => {
    render(<SectionHeader />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('Renders link correctly when provided', () => {
    render(<SectionHeader link={{ href: '/path/to/blog', name: 'Click Me!' }} />);

    expect(screen.queryByRole('link')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toHaveAttribute('href', '/en/path/to/blog'); // `en` locale comes from `useParams` mock
    expect(screen.queryByRole('link')?.textContent).toBe('Click Me!');
  });

  it("Doesn't render link when not provided", () => {
    render(<SectionHeader />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
