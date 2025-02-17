import { render, screen } from '@testing-library/react';
import ContentItem from '.';
import { ContentItemProps } from './types';

describe('[Component] ContentItem', () => {
  const defaultProps: ContentItemProps = {
    image: {
      src: './sb-assets/engine.png',
    },
    title: 'Engine',
    link: { href: '#' },
    variant: 'default',
  };

  it('Renders the image correctly', () => {
    render(<ContentItem {...defaultProps} />);

    const image = screen.getByAltText('Engine');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', './sb-assets/engine.png');
  });

  it('Renders the link correctly', () => {
    render(<ContentItem {...defaultProps} />);

    const link = screen.getByRole('link', { name: /Engine/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#');
  });

  it('Handles inline variant correctly', () => {
    render(<ContentItem {...defaultProps} variant="inline" />);

    const imageParent = screen.getByAltText('Engine').parentElement;

    expect(imageParent).toHaveClass('size-[20px]');
  });

  it('Handles missing title', () => {
    render(<ContentItem {...defaultProps} title={undefined} />);

    const title = screen.getByTestId('title-text');

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('');
  });
});
