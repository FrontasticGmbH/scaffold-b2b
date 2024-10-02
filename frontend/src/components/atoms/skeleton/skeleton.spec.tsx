import { render } from '@testing-library/react';
import Skeleton from '.';

describe('Skeleton Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).not.toHaveClass('h-full w-full');
  });

  it('applies custom className', () => {
    //eslint-disable-next-line
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies fillMode class when fillMode is true', () => {
    const { container } = render(<Skeleton fillMode />);
    expect(container.firstChild).toHaveClass('absolute left-0 top-0 z-10 size-full');
  });

  it('passes additional props to ReactSkeleton', () => {
    const { getByTestId } = render(<Skeleton data-testid="skeleton" />);
    expect(getByTestId('skeleton')).toBeInTheDocument();
  });
});
