import { render, screen } from '@test/utils';
import HeroTile from '.';

describe('HeroTile', () => {
  const mockProps = {
    image: {
      src: 'https://cdn.com/test-image.jpg',
      width: 1200,
      height: 800,
    },
    title: 'Test Title',
    links: [
      { name: 'Link 1', href: '/link1' },
      { name: 'Link 2', href: '/link2', openInNewTab: true },
    ],
  };

  it('renders the component with all props', () => {
    render(<HeroTile {...mockProps} />);

    // Check if the image is rendered
    const image = screen.getByRole('img', { name: 'Test Title' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://cdn.com/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Title');

    // Check if the title is rendered
    expect(screen.getByText('Test Title')).toBeInTheDocument();

    // Check if links are rendered
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('Link 1');
    expect(links[0]).toHaveAttribute('href', '/en/link1');
    expect(links[0]).not.toHaveAttribute('target', '_blank');
    expect(links[1]).toHaveTextContent('Link 2');
    expect(links[1]).toHaveAttribute('href', '/en/link2');
    expect(links[1]).toHaveAttribute('target', '_blank');
  });

  it('renders without links', () => {
    const propsWithoutLinks = { ...mockProps, links: undefined };
    render(<HeroTile {...propsWithoutLinks} />);

    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(0);
  });

  it('renders with empty links array', () => {
    const propsWithEmptyLinks = { ...mockProps, links: [] };
    render(<HeroTile {...propsWithEmptyLinks} />);

    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(0);
  });

  it('renders without image', () => {
    const propsWithoutImage = { ...mockProps, image: undefined };
    render(<HeroTile {...propsWithoutImage} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders with default href when link href is not provided', () => {
    const propsWithDefaultHref = {
      ...mockProps,
      links: [{ name: 'Default Link' }],
    };
    render(<HeroTile {...propsWithDefaultHref} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#');
  });
});
