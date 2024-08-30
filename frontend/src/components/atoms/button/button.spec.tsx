import { render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import Button from '.';

describe('[Component] Button', () => {
  it('Renders children correctly', () => {
    render(<Button>Click Me</Button>);

    expect(screen.getByText('Click Me')).toBeDefined();
  });

  it('Renders icon correctly', () => {
    const Icon = <svg data-testid="test-icon"></svg>;
    render(<Button icon={Icon}>Click Me</Button>);

    expect(screen.getByTestId('test-icon')).toBeDefined();
  });

  it('Renders as skeleton when asSkeleton is true', () => {
    render(<Button asSkeleton>Click Me</Button>);

    expect(screen.getByText('Click Me')).toBeDefined();
    expect(screen.getByTestId('skeleton')).toBeDefined();
  });

  it('Renders loading animation correctly', () => {
    render(<Button loading>Click Me</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-svg')).toBeDefined();
  });

  it('Renders added icon correctly', () => {
    render(<Button added>Click Me</Button>);

    expect(screen.getByTestId('added-svg')).toBeDefined();
  });

  it('Renders loading icon when given loading and added as true at the same time', () => {
    render(
      <Button added loading>
        Click Me
      </Button>,
    );

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-svg')).toBeDefined();
  });

  it('Calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Renders with the added classNames', () => {
    render(<Button className="leading-[16px]">Click Me</Button>);

    expect(screen.getByRole('button')).toHaveClass('leading-[16px]');
  });

  it('Disables button correctly when disabled prop is true', () => {
    render(<Button disabled>Click Me</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('Disables button correctly when loading prop is true', () => {
    render(<Button loading>Click Me</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('Does not render FeedbackIconLayer when neither loading nor added', () => {
    render(<Button>Click Me</Button>);

    expect(screen.queryByTestId('feedback-icon-layer')).toBeNull();
  });
});
