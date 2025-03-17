import { render, screen } from '@test/utils';
import Typography from '.';

describe('[Component] Typography', () => {
  it('Renders Typography with default props', () => {
    render(<Typography>Default typography</Typography>);

    expect(screen.getByText('Default typography')).toBeInTheDocument();
  });

  it('Renders Typography with different tags', () => {
    render(<Typography as="h1">H1 typography</Typography>);
    expect(screen.getByText('H1 typography')).toBeInTheDocument();
    expect(screen.getByText('H1 typography').tagName).toBe('H1');

    render(<Typography as="span">Span typography</Typography>);
    expect(screen.getByText('Span typography')).toBeInTheDocument();
    expect(screen.getByText('Span typography').tagName).toBe('SPAN');
  });

  it('Renders as skeleton when asSkeleton is true', () => {
    render(<Typography asSkeleton>Skeleton Typography</Typography>);

    expect(screen.getByText('Skeleton Typography')).toBeDefined();
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('Renders Typography with different font sizes', () => {
    render(<Typography fontSize={10}>10 typography</Typography>);
    expect(screen.getByText('10 typography')).toHaveClass('text-10');

    render(<Typography fontSize={20}>20 typography</Typography>);
    expect(screen.getByText('20 typography')).toHaveClass('text-20');
  });

  it('Renders Typography with different font weights', () => {
    render(<Typography fontWeight="medium">Medium weight typography</Typography>);
    expect(screen.getByText('Medium weight typography')).toHaveClass('font-medium');

    render(<Typography fontWeight="bold">Bold weight typography</Typography>);
    expect(screen.getByText('Bold weight typography')).toHaveClass('font-bold');
  });

  it('Renders Typography with different alignments', () => {
    render(<Typography align="right">Right aligned</Typography>);
    expect(screen.getByText('Right aligned')).toHaveClass('text-right');

    render(<Typography align="center">Center aligned</Typography>);
    expect(screen.getByText('Center aligned')).toHaveClass('text-center');
  });

  it('Renders Typography with underline', () => {
    render(<Typography underline>Underlined</Typography>);
    expect(screen.getByText('Underlined')).toHaveClass('underline');
  });

  it('Renders Typography with different line heights', () => {
    render(<Typography lineHeight="tight">Tight line height</Typography>);
    expect(screen.getByText('Tight line height')).toHaveClass('leading-tight');

    render(<Typography lineHeight="loose">Loose line height</Typography>);
    expect(screen.getByText('Loose line height')).toHaveClass('leading-loose');
  });
});
