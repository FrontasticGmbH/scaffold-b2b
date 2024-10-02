import React from 'react';
import { fireEvent, render, screen, act } from '@test/utils';
import userEvent from '@testing-library/user-event';
import SearchInput from '@/components/atoms/search-input/index';

describe('[Component] SearchInput', () => {
  it('renders with label', () => {
    render(<SearchInput label="Search Label" variant="sm" />);

    const labelElement = screen.getByText('Search Label');
    expect(labelElement).toBeDefined();
  });

  it('renders without label for lg variant', () => {
    render(<SearchInput label="Search Label" variant="lg" />);

    const labelElement = screen.queryByText('Search Label');
    expect(labelElement).toBeNull();
  });

  it('calls handleOnChange when input value changes', () => {
    const handleOnChange = jest.fn();
    render(<SearchInput handleOnChange={handleOnChange} variant={'sm'} />);

    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'New Value' } });

    expect(handleOnChange).toHaveBeenCalledWith('New Value');
  });

  it('calls handleSearchAction when Enter key is pressed', () => {
    const handleSearchAction = jest.fn();
    render(<SearchInput variant={'sm'} handleSearchAction={handleSearchAction} />);

    const inputElement = screen.getByRole('textbox');
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(handleSearchAction).toHaveBeenCalledTimes(1);
  });

  it('calls handleClear when clear button is clicked', async () => {
    const handleOnChange = jest.fn();
    render(<SearchInput variant={'lg'} handleOnChange={handleOnChange} searchValue="Clear Me" />);

    const clearButton = screen.getByTestId('clear-button');

    await act(async () => userEvent.click(clearButton));

    expect(handleOnChange).toHaveBeenCalledWith('');
  });

  it('calls onBackClick when back button is clicked in mobile mode', async () => {
    const onBackClick = jest.fn();
    render(<SearchInput variant="lg" mobile onBackClick={onBackClick} />);

    const backButton = screen.getByTestId('back-button');

    await act(async () => userEvent.click(backButton));

    expect(onBackClick).toHaveBeenCalledTimes(1);
  });

  it('focuses input when onFocus is called', () => {
    const onFocus = jest.fn();
    render(<SearchInput variant={'sm'} onFocus={onFocus} />);

    const inputElement = screen.getByRole('textbox');
    fireEvent.focus(inputElement);

    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('blurs input when onBlur is called', async () => {
    const handleBlur = jest.fn();

    render(<SearchInput variant={'lg'} onBlur={handleBlur} />);

    const inputElement = screen.getByRole('textbox');

    await act(async () => {
      inputElement.focus();
      inputElement.blur();
    });

    setTimeout(() => {
      expect(handleBlur).toHaveBeenCalled();
    }, 300);
  });

  it('applies provided className to input', () => {
    render(<SearchInput variant={'sm'} className="ms-2" />);

    const inputElement = screen.getByRole('textbox');
    expect(inputElement.className).toContain('ms-2');
  });

  it('renders with provided placeholder', () => {
    render(<SearchInput variant={'sm'} placeholder="Search here..." />);

    const inputElement = screen.getByPlaceholderText('Search here...');
    expect(inputElement).toBeDefined();
  });
});
