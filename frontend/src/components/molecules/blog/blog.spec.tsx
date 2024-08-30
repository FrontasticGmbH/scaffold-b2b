import React from 'react';
import { render, screen } from '@testing-library/react';
import { blog } from '@/mocks/blog';
import Blog from '@/components/molecules/blog/index';

describe('Blog Component', () => {
  it('renders the blog image if provided', () => {
    render(<Blog {...blog} />);
    const imageElement = screen.getByAltText('mundial hybrid system');
    expect(imageElement).toBeInTheDocument();
  });

  it('does not render the image div if image is not provided', () => {
    const { container } = render(<Blog {...blog} image={undefined} />);
    expect(container.querySelector('img')).toBeNull();
  });

  it('renders the blog title if provided', () => {
    render(<Blog {...blog} />);
    const titleElement = screen.getByText('mundial hybrid system');
    expect(titleElement).toBeInTheDocument();
  });

  it('does not render the title if not provided', () => {
    render(<Blog {...blog} title={undefined} />);
    const titleElement = screen.queryByText('mundial hybrid system');
    expect(titleElement).toBeNull();
  });

  it('renders the blog description as markdown', () => {
    render(<Blog {...blog} />);
    const descriptionElement = screen.getByText(/Combines the efficiency of electric power/i);
    expect(descriptionElement).toBeInTheDocument();

    // Checking if markdown is rendered correctly
    const boldText = screen.getByText('Mundial');
    expect(boldText).toBeInTheDocument();
    expect(boldText.tagName).toBe('STRONG');
  });

  it('does not render the description if not provided', () => {
    render(<Blog {...blog} description={undefined} />);
    const descriptionElement = screen.queryByText(/Combines the efficiency of electric power/i);
    expect(descriptionElement).toBeNull();
  });

  it('renders the blog link if provided', () => {
    render(<Blog {...blog} />);
    const linkElement = screen.getByText('Shop MUNDIAL');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/en/mundial');
  });

  it('does not render the link if link name is not provided', () => {
    render(<Blog {...blog} link={{ ...blog.link, name: undefined }} />);
    const linkElement = screen.queryByText('Shop MUNDIAL');
    expect(linkElement).toBeNull();
  });

  it('opens the link in a new tab if openInNewTab is true', () => {
    render(<Blog {...blog} link={{ ...blog.link, openInNewTab: true }} />);
    const linkElement = screen.getByText('Shop MUNDIAL');
    expect(linkElement).toHaveAttribute('target', '_blank');
  });

  it('does not set target="_blank" if openInNewTab is false', () => {
    render(<Blog {...blog} link={{ ...blog.link, openInNewTab: false }} />);
    const linkElement = screen.getByText('Shop MUNDIAL');
    expect(linkElement).not.toHaveAttribute('target', '_blank');
  });
});
