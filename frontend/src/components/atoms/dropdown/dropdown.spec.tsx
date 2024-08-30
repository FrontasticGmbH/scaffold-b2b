import { act, render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import Dropdown from '.';
import { DropdownProps } from './types';

describe('[Component] Dropdown', () => {
  const renderDropdown = (props: DropdownProps) => {
    return render(
      <Dropdown {...props}>
        <Dropdown.Button>{({ selected }) => selected.value || 'Toggle'}</Dropdown.Button>
        <Dropdown.Options>
          <Dropdown.Option value="1">1</Dropdown.Option>
          <Dropdown.Option value="2">2</Dropdown.Option>
          <Dropdown.Option value="3">3</Dropdown.Option>
        </Dropdown.Options>
      </Dropdown>,
    );
  };

  test('It expands and collapses correctly', async () => {
    renderDropdown({});

    const options = ['1', '2', '3'];

    options.forEach((option) => expect(screen.queryByText(option)).toBeNull());

    await act(async () => userEvent.click(screen.getByRole('button')));

    options.forEach((option) => expect(screen.getByText(option)).toBeDefined());
  });

  test('It selects option and updates value correctly', async () => {
    const onChange = jest.fn();

    renderDropdown({ onChange });

    expect(screen.getByRole('button').textContent).toBe('Toggle');

    await act(async () => userEvent.click(screen.getByRole('button')));
    await act(async () => userEvent.click(screen.getByText('1')));

    expect(onChange).toHaveBeenCalledWith('1');
    expect(screen.getByRole('button').textContent).toBe('1');
  });

  test('It works within controlled state correctly', async () => {
    renderDropdown({ value: 'CONTROLLED' });

    expect(screen.getByRole('button').textContent).toBe('CONTROLLED');

    await act(async () => userEvent.click(screen.getByRole('button')));
    await act(async () => userEvent.click(screen.getByText('1')));

    expect(screen.getByRole('button').textContent).toBe('CONTROLLED');
  });

  test('It works within disabled state correctly', async () => {
    renderDropdown({ disabled: true });

    await act(async () => userEvent.click(screen.getByRole('button')));

    expect(screen.queryByText('1')).toBeNull();
  });
});
