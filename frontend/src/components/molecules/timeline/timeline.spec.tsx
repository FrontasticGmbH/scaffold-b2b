import React from 'react';
import { render, screen } from '@test/utils';
import Timeline from '.';

describe('Timeline', () => {
  const defaultChildren = [<div key="1">Step 1</div>, <div key="2">Step 2</div>, <div key="3">Step 3</div>];

  it('renders the correct number of bullets and tracks', () => {
    render(<Timeline>{defaultChildren}</Timeline>);

    const tracks = screen.getAllByTestId('timeline-track');
    expect(tracks).toHaveLength(2);

    const bullets = screen.getAllByRole('presentation');
    expect(bullets).toHaveLength(3);
  });

  it('applies default classes for bullets and tracks', () => {
    render(<Timeline activeIndex={1}>{defaultChildren}</Timeline>);

    const bullets = screen.getAllByRole('presentation');
    const tracks = screen.getAllByTestId('timeline-track');

    expect(tracks[0]).toHaveClass('bg-primary'); // Active track
    expect(tracks[1]).toHaveClass('bg-gray-300'); // Inactive track

    expect(bullets[0].children.item(0)).toHaveClass('bg-primary'); // Active bullet
    expect(bullets[1].children.item(0)).toHaveClass('bg-primary'); // Active bullet
    expect(bullets[2].children.item(0)).toHaveClass('bg-gray-300'); // Inactive bullet
  });

  it('applies custom classes passed in classNames prop', () => {
    const customClasses = {
      bullet: 'custom-bullet',
      bulletActive: 'custom-bullet-active',
      track: 'custom-track',
      trackActive: 'custom-track-active',
    };

    render(
      <Timeline activeIndex={1} classNames={customClasses}>
        {defaultChildren}
      </Timeline>,
    );

    const bullets = screen.getAllByRole('presentation');
    const tracks = screen.getAllByTestId('timeline-track');

    expect(bullets[0].children.item(0)).toHaveClass('custom-bullet-active');
    expect(bullets[1].children.item(0)).toHaveClass('custom-bullet-active');
    expect(bullets[2].children.item(0)).toHaveClass('custom-bullet');

    expect(tracks[0]).toHaveClass('custom-track-active');
    expect(tracks[1]).toHaveClass('custom-track');
  });

  it('renders children correctly', () => {
    render(<Timeline>{defaultChildren}</Timeline>);

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('clamps activeIndex to valid range', () => {
    render(<Timeline activeIndex={5}>{defaultChildren}</Timeline>);

    const bullets = screen.getAllByRole('presentation');

    expect(bullets[0].children.item(0)).toHaveClass('bg-primary');
    expect(bullets[1].children.item(0)).toHaveClass('bg-primary');
    expect(bullets[2].children.item(0)).toHaveClass('bg-primary');
  });
});
