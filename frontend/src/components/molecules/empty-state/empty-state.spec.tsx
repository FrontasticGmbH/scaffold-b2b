import React from 'react';
import { render, screen } from '@test/utils';
import Image from '@/components/atoms/Image';
import EmptyState from './';

describe('EmptyState Component', () => {
  const defaultProps = {
    header: 'No Data Available',
    children: 'Please check back later.',
    className: 'custom-class',
  };

  it('renders the loading state with a loading icon', () => {
    render(<EmptyState isLoading />);

    expect(screen.getByTestId('loading-svg')).toBeInTheDocument();
    expect(screen.queryByText('No Data Available')).not.toBeInTheDocument();
    expect(screen.queryByText('Please check back later.')).not.toBeInTheDocument();
  });

  it('renders header and children when isLoading is false', () => {
    render(<EmptyState {...defaultProps} />);

    expect(screen.getByText('No Data Available')).toBeInTheDocument();
    expect(screen.getByText('Please check back later.')).toBeInTheDocument();
  });

  it('renders an image when the image prop is provided', () => {
    const mockImage = <Image src="mock-image.png" alt="mock" data-testid="mock-image" />;
    render(<EmptyState {...defaultProps} image={mockImage} />);

    expect(screen.getByTestId('mock-image')).toBeInTheDocument();
    expect(screen.getByAltText('mock')).toBeInTheDocument();
  });

  it('applies the custom className prop', () => {
    render(<EmptyState {...defaultProps} />);

    const container = screen.getByText('No Data Available').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('renders children content', () => {
    render(
      <EmptyState>
        <p data-testid="child-content">This is child content</p>
      </EmptyState>,
    );

    expect(screen.getByTestId('child-content')).toHaveTextContent('This is child content');
  });
});
