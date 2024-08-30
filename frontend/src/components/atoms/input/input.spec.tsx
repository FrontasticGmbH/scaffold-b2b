import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Input from '@/components/atoms/input/index';

describe('[Component] Input', () => {
  test('renders label correctly', () => {
    render(<Input label="Test Label" id="test-input" />);
    const labelElement = screen.getByTestId('label');
    const inputElement = screen.getByLabelText('Test Label');

    expect(labelElement).toBeDefined();
    expect(inputElement).toBeDefined();
    expect(inputElement.getAttribute('id')).toBe('test-input');
    expect(labelElement.getAttribute('for')).toBe('test-input');
  });

  test('renders with default value', () => {
    render(<Input value="Default Value" />);

    const inputElement = screen.getByDisplayValue('Default Value');
    expect(inputElement).toBeDefined();
  });

  test('calls onChange handler', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const inputElement = screen.getByRole<HTMLInputElement>('textbox');
    fireEvent.change(inputElement, { target: { value: 'New Value' } });

    expect(handleChange).toHaveBeenCalled();
    expect(inputElement.value).toBe('New Value');
  });

  test('clears input value when clear button is clicked', () => {
    const handleClear = jest.fn();
    render(<Input clearButton={true} onClear={handleClear} />);

    const clearButton = screen.getByTestId('clear-button');
    fireEvent.click(clearButton);

    const inputElement = screen.getByRole<HTMLInputElement>('textbox');
    expect(handleClear).toHaveBeenCalled();
    expect(inputElement.value).toBe('');
  });

  test('displays error message', () => {
    render(<Input error="This is an error message" />);

    const errorElement = screen.getByText('This is an error message');
    expect(errorElement).toBeDefined();
    expect(errorElement.classList.contains('text-red-500')).toBe(true);
  });

  test('displays valid icon when valid', () => {
    render(<Input valid />);

    const validIcon = screen.getByTestId('valid-icon');
    expect(validIcon).toBeDefined();
  });

  test('displays custom icon', () => {
    const customIcon = <span data-testid="custom-icon">🔍</span>;
    render(<Input icon={customIcon} />);

    const iconElement = screen.getByTestId('custom-icon');
    expect(iconElement).toBeDefined();
  });

  test('focuses input when focusOnMount is true', async () => {
    render(<Input focusOnMount />);

    const inputElement = screen.getByRole('textbox');
    await waitFor(() => {
      expect(document.activeElement).toBe(inputElement);
    });
  });
});
