import { render, screen } from '@test/utils';
import ContentTile from '.';
import { ContentTileProps } from './types';

describe('[Component] Content Tile', () => {
  const commonProps: ContentTileProps = {
    image: {
      src: './sb-assets/engine.png',
    },
    title: 'Engine',
    link: { href: '#' },
  };

  it('Renders the image correctly', () => {
    render(<ContentTile {...commonProps} />);

    const image = screen.getByAltText('Engine');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', './sb-assets/engine.png');
  });

  it('Renders the title correctly', () => {
    render(<ContentTile {...commonProps} />);

    const titleElement = screen.getByText('Engine');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('block text-16 font-bold leading-normal text-gray-700 lg:text-18');
  });

  it('Renders the link correctly', () => {
    render(<ContentTile {...commonProps} />);

    const links = screen.getAllByRole('link');
    const titleLink = links.find((link) => link.textContent === 'Engine');

    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', '#');
  });

  it('Renders the arrow icon correctly', () => {
    render(<ContentTile {...commonProps} />);

    const arrowIcon = screen.getByRole('img', { hidden: true });

    expect(arrowIcon).toBeInTheDocument();
  });

  it('Renders the link name when provided', () => {
    const propsWithLinkName: ContentTileProps = {
      ...commonProps,
      link: { href: '#', name: 'Learn More' },
    };

    render(<ContentTile {...propsWithLinkName} />);

    const linkNameElement = screen.getByText('Learn More');
    expect(linkNameElement).toBeInTheDocument();
  });

  it('Does not render the link name when not provided', () => {
    render(<ContentTile {...commonProps} />);

    const linkNameElement = screen.queryByText('Learn More');
    expect(linkNameElement).not.toBeInTheDocument();
  });
});
