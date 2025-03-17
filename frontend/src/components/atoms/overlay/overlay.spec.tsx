import { act, render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import Overlay from '@/components/atoms/overlay/index';

describe('[Component] Overlay', () => {
  it('Renders with default zIndex and className', () => {
    render(<Overlay />);

    const overlayElement = screen.getByTestId('overlay');
    expect(overlayElement).toBeDefined();
    expect(overlayElement.className).toContain('z-[305]');
    expect(overlayElement.className).toContain('fixed left-0 top-0 h-screen w-screen bg-gray-800/45');
  });

  it('Renders with provided zIndex', () => {
    render(<Overlay zIndex="z-[400]" />);

    const overlayElement = screen.getByTestId('overlay');
    expect(overlayElement).toBeDefined();
    expect(overlayElement.className).toContain('z-[400]');
  });

  it('Renders with provided className', () => {
    render(<Overlay className="bg-white" />);

    const overlayElement = screen.getByTestId('overlay');
    expect(overlayElement).toBeDefined();
    expect(overlayElement.className).toContain('bg-white');
  });

  it('Calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Overlay onClick={handleClick} />);

    const overlayElement = screen.getByTestId('overlay');

    await act(async () => userEvent.click(overlayElement));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
