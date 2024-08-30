import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Drawer from './';

const blockScrollMock = jest.fn();

jest.mock('@/hooks/useScrollBlock', () => ({
  __esModule: true,
  default: () => ({
    blockScroll: blockScrollMock,
  }),
}));

jest.mock('@/components/atoms/overlay', () => jest.fn(() => <div data-testid="overlay" />));

describe('Drawer Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the drawer when isOpen is true', () => {
    render(
      <Drawer direction={'left'} isOpen={true} headline="Test Drawer" onClose={jest.fn()}>
        <p>Drawer Content</p>
      </Drawer>,
    );

    expect(screen.getByText('Test Drawer')).toBeInTheDocument();
    expect(screen.getByText('Drawer Content')).toBeInTheDocument();
  });

  it('does not render the drawer when isOpen is false', () => {
    render(
      <Drawer direction={'left'} isOpen={false} headline="Test Drawer" onClose={jest.fn()}>
        <p>Drawer Content</p>
      </Drawer>,
    );

    expect(screen.queryByText('Test Drawer')).not.toBeInTheDocument();
    expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();
  });

  it('renders the overlay when isOpen and overlay are true', () => {
    render(
      <Drawer direction={'left'} isOpen={true} overlay={true} headline="Test Drawer" onClose={jest.fn()}>
        <p>Drawer Content</p>
      </Drawer>,
    );

    expect(screen.getByTestId('overlay')).toBeInTheDocument();
  });

  it('does not render the overlay when overlay is false', () => {
    render(
      <Drawer direction={'left'} isOpen={true} overlay={false} headline="Test Drawer" onClose={jest.fn()}>
        <p>Drawer Content</p>
      </Drawer>,
    );

    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking outside the drawer', async () => {
    const onCloseMock = jest.fn();

    render(
      <>
        <h1>Something here</h1>
        <Drawer direction={'left'} isOpen={true} headline="Test Drawer" onClose={onCloseMock}>
          <p>Drawer Content</p>
        </Drawer>
      </>,
    );

    const outsideDiv = screen.getByRole('heading', { name: 'Something here' });

    await userEvent.click(outsideDiv);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the close button is clicked', async () => {
    const onCloseMock = jest.fn();

    render(
      <Drawer direction={'left'} isOpen={true} headline="Test Drawer" onClose={onCloseMock}>
        <p>Drawer Content</p>
      </Drawer>,
    );

    await userEvent.click(screen.getByRole('button'));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('blocks scrolling when the drawer is open', () => {
    render(
      <Drawer direction={'left'} isOpen={true} headline="Test Drawer" onClose={jest.fn()}>
        <p>Drawer Content</p>
      </Drawer>,
    );

    // Verify that blockScroll was called with true
    expect(blockScrollMock).toHaveBeenCalledWith(true);
  });

  it('applies the correct class names based on props', () => {
    const { container } = render(
      // eslint-disable-next-line tailwindcss/no-custom-classname
      <Drawer isOpen={true} className="custom-class" direction="left" headline="Test Drawer" onClose={jest.fn()}>
        <p>Drawer Content</p>
      </Drawer>,
    );

    const drawerElement = container.querySelector('.custom-class');

    expect(drawerElement).toBeInTheDocument();
  });
});
