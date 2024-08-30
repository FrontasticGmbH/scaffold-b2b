import React from 'react';
import { render } from '@testing-library/react';
import LoadingIcon from './index';
import { LoadingIconProps } from './types';

describe('LoadingIcon Component', () => {
  const defaultProps: LoadingIconProps = {
    svgWidth: 20,
    svgHeight: 20,
    className: 'fill-white',
  };

  it('renders without crashing', () => {
    const { container } = render(<LoadingIcon {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('applies the correct className to the SVG path', () => {
    const { container } = render(<LoadingIcon {...defaultProps} />);
    const path = container.querySelector('path');
    expect(path).toHaveClass('fill-white');
  });

  it('sets the correct width and height for the SVG', () => {
    const { container } = render(<LoadingIcon {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('renders the spinning sector with the correct dimensions', () => {
    const { container } = render(<LoadingIcon {...defaultProps} />);
    const span = container.querySelector('span');
    expect(span).toHaveStyle({ width: '20px', height: '20px' });
  });

  it('renders the inner SVG with half the dimensions of the outer SVG', () => {
    const { container } = render(<LoadingIcon {...defaultProps} />);
    const innerSvg = container.querySelector('span svg');
    expect(innerSvg).toHaveAttribute('width', '10');
    expect(innerSvg).toHaveAttribute('height', '10');
  });
});
