import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PopoverButton from './';
import { Props } from './types';

describe('PopoverButton Component', () => {
  const defaultProps = {
    isOpen: false,
    direction: 'right',
    onClose: jest.fn(),
    buttonElement: <button>Click me</button>,
    children: <div>Popover Content</div>,
  } as unknown as Props;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the button element', () => {
    render(<PopoverButton {...defaultProps} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('does not render popover content when closed', () => {
    render(<PopoverButton {...defaultProps} />);
    expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
  });

  it('renders popover content when open', () => {
    render(<PopoverButton {...defaultProps} isOpen={true} />);
    expect(screen.getByText('Popover Content')).toBeInTheDocument();
  });

  it('applies correct class names for left direction', () => {
    render(<PopoverButton {...defaultProps} isOpen={true} direction="left" />);
    const popoverPanel = screen.getByText('Popover Content').parentElement?.parentElement?.parentElement;
    expect(popoverPanel).toHaveClass('absolute top-10 z-[999] left-0');
  });

  it('applies correct class names for right direction', () => {
    render(<PopoverButton {...defaultProps} isOpen={true} direction="right" />);
    const popoverPanel = screen.getByText('Popover Content').parentElement?.parentElement?.parentElement;
    expect(popoverPanel).toHaveClass('absolute top-10 z-[999] right-0');
  });

  it('calls onClose when overlay is clicked', () => {
    render(<PopoverButton {...defaultProps} isOpen={true} />);
    const overlay = screen.getByTestId('overlay');
    fireEvent.click(overlay);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders overlay when open', () => {
    render(<PopoverButton {...defaultProps} isOpen={true} />);
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
  });

  it('does not render overlay when closed', () => {
    render(<PopoverButton {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
  });
});
