import React from 'react';
import { fireEvent, render, screen, waitFor, act } from '@test/utils';
import { within } from '@testing-library/react';
import MoveToList from '@/components/molecules/move-to-list';
import { MoveToListProps } from '@/components/molecules/move-to-list/types';
import userEvent from '@testing-library/user-event';

const mockLists = Array(10)
  .fill(0)
  .map((val, index) => {
    const unq = 'Wishlist-' + index;
    return {
      label: unq,
      id: 'Wishlist-' + index,
    };
  });

const defaultProps: MoveToListProps = {
  lists: mockLists,
  onSubmit: jest.fn(),
  onAddNewList: jest.fn(),
  disabled: false,
};

describe('MoveToList', () => {
  it('renders the button and modal correctly', () => {
    render(<MoveToList {...defaultProps} />);

    expect(screen.getByText('Move to list')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens the modal when the button is clicked', () => {
    render(<MoveToList {...defaultProps} />);

    fireEvent.click(screen.getByText('Move to list'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onSubmit when the submit button is clicked', async () => {
    defaultProps.onSubmit = jest.fn();
    render(<MoveToList {...defaultProps} />);

    await act(async () => userEvent.click(screen.getByText('Move to list')));

    const row = screen.getByTestId('list-row-Wishlist-1');
    await act(async () => userEvent.click(within(row).getByTestId('add-to-list-Wishlist-1')));

    await act(async () => userEvent.click(screen.getByTestId('confirm')));

    expect(defaultProps.onSubmit).toHaveBeenCalledWith(['Wishlist-1']);
  });

  it('disables the button when the disabled prop is true', () => {
    render(<MoveToList {...defaultProps} disabled={true} />);

    expect(screen.getByText('Move to list')).toBeDisabled();
  });

  it('handles list add/remove button interactions correctly', async () => {
    render(<MoveToList {...defaultProps} />);

    fireEvent.click(screen.getByText('Move to list'));

    const row1 = screen.getByTestId('list-row-Wishlist-1');
    const row2 = screen.getByTestId('list-row-Wishlist-2');

    await act(async () => userEvent.click(within(row1).getByRole('button', { name: /add/i })));
    expect(within(row1).getByRole('button', { name: /remove/i })).toBeInTheDocument();

    await act(async () => userEvent.click(within(row2).getByRole('button', { name: /add/i })));
    expect(within(row2).getByRole('button', { name: /remove/i })).toBeInTheDocument();

    await act(async () => userEvent.click(within(row1).getByRole('button', { name: /remove/i })));
    expect(within(row1).getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('calls onAddNewList when the add new list button is clicked', async () => {
    defaultProps.onAddNewList = jest.fn();
    render(<MoveToList {...defaultProps} lists={[]} />);

    fireEvent.click(screen.getByText('Move to list'));

    const nameInput = screen.getByRole('textbox', { name: /name/i });
    fireEvent.change(nameInput, { target: { value: 'New Wishlist' } });

    fireEvent.click(screen.getByText('Save & Add'));
    await waitFor(() => expect(defaultProps.onAddNewList).toHaveBeenCalled());
  });
});
