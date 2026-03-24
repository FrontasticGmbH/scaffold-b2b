import { fireEvent, render, screen } from '@test/utils';
import ColoredVariant from '@/components/atoms/colored-variants/index';

describe('[Component] ColoredVariant', () => {
  it('renders with the correct background color', () => {
    render(<ColoredVariant color="red" />);

    const divElement = screen.getByRole('button');
    expect(divElement.style.backgroundColor).toBe('red');
  });

  it('applies active styling when active is true', () => {
    render(<ColoredVariant color="blue" active={true} />);

    const divElement = screen.getByRole('button');
    expect(divElement.className).toContain('border-[1.5px]');
    expect(divElement.className).toContain('border-primary');
  });

  it('does not apply active styling when active is false', () => {
    render(<ColoredVariant color="green" active={false} />);

    const divElement = screen.getByRole('button');
    expect(divElement.className).not.toContain('border-[1.5px]');
    expect(divElement.className).not.toContain('border-primary');
  });

  it('applies provided className', () => {
    //eslint-disable-next-line
    render(<ColoredVariant color="yellow" className="additional-class" />);

    const divElement = screen.getByRole('button');
    expect(divElement.className.includes('additional-class')).toBe(true);
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<ColoredVariant color="purple" onClick={handleClick} />);

    const divElement = screen.getByRole('button');
    fireEvent.click(divElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
