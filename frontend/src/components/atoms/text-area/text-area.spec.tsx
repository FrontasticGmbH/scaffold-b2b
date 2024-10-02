import { fireEvent, render, screen, waitFor, act } from '@test/utils';
import TextArea from '@/components/atoms/text-area/index';

describe('[Component] TextArea', () => {
  it('renders with a label', () => {
    render(<TextArea label="Text Area Label" />);

    const labelElement = screen.getByText('Text Area Label');
    expect(labelElement).toBeInTheDocument();
  });

  it('renders without a label when not provided', () => {
    render(<TextArea />);

    const labelElement = screen.queryByText('Text Area Label');
    expect(labelElement).toBeNull();
  });

  it('renders error message when error prop is provided', () => {
    render(<TextArea error="This is an error message" />);

    const errorElement = screen.getByText('This is an error message');
    expect(errorElement).toBeInTheDocument();
  });

  it('does not render error message when error prop is not provided', () => {
    render(<TextArea />);

    const errorElement = screen.queryByText('This is an error message');
    expect(errorElement).toBeNull();
  });

  it('renders with provided placeholder', () => {
    render(<TextArea placeholder="Enter text..." />);

    const textAreaElement = screen.getByPlaceholderText('Enter text...');
    expect(textAreaElement).toBeInTheDocument();
  });

  it('handles input value changes correctly', () => {
    const handleChange = jest.fn();
    render(<TextArea onChange={handleChange} />);

    const textAreaElement = screen.getByRole<HTMLTextAreaElement>('textbox');
    fireEvent.change(textAreaElement, { target: { value: 'New text' } });

    expect(handleChange).toHaveBeenCalled();
    expect(textAreaElement.value).toBe('New text');
  });

  it('adjusts height when fitContent is true', async () => {
    const { container } = render(<TextArea fitContent={true} defaultValue="Initial text" />);

    const textAreaElement = container.querySelector('textarea') as HTMLTextAreaElement;

    act(() => {
      textAreaElement.style.height = 'auto';
      fireEvent.change(textAreaElement, { target: { value: 'New text' } }); // Trigger resize
    });

    await waitFor(() => {
      expect(textAreaElement.style.height).toBe(`${textAreaElement.scrollHeight}px`);
    });
  });

  it('renders with the provided className', () => {
    render(<TextArea className="ms-2" />);

    const textAreaElement = screen.getByRole('textbox');
    expect(textAreaElement.className.includes('ms-2')).toBe(true);
  });

  it('applies required styling when required is true', () => {
    render(<TextArea required label={'label'} />);

    const textAreaElement = screen.getByRole('textbox');
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
    expect(textAreaElement).toBeRequired();
  });

  it('does not apply required styling when required is false', () => {
    render(<TextArea label="Optional Field" required={false} />);

    const requiredIndicator = screen.queryByText('*');
    expect(requiredIndicator).not.toBeInTheDocument();
  });
});
