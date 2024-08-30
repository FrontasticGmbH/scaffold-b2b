import { act, render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import MultiDropdown from '.';
import { DropdownProps } from './types';

describe('[Component] MultiDropdown', () => {
  const renderMultiDropdown = (props: DropdownProps) => {
    return render(
      <MultiDropdown {...props}>
        <MultiDropdown.Button>
          {({ selected }) => selected.map((s) => s.value).join(',') || 'Toggle'}
        </MultiDropdown.Button>
        <MultiDropdown.Options>
          <MultiDropdown.Option value="1">1</MultiDropdown.Option>
          <MultiDropdown.Option value="2">2</MultiDropdown.Option>
          <MultiDropdown.Option value="3">3</MultiDropdown.Option>
        </MultiDropdown.Options>
      </MultiDropdown>,
    );
  };

  test('It expands and collapses correctly', async () => {
    renderMultiDropdown({});

    const options = ['1', '2', '3'];

    options.forEach((option) => expect(screen.queryByText(option)).toBeNull());

    await act(async () => userEvent.click(screen.getByRole('button')));

    options.forEach((option) => expect(screen.getByText(option)).toBeDefined());
  });

  test('It selects option and updates value correctly', async () => {
    const onChange = jest.fn();

    renderMultiDropdown({ onChange });

    expect(screen.getByRole('button').textContent).toBe('Toggle');

    await act(async () => userEvent.click(screen.getByRole('button')));
    await act(async () => userEvent.click(screen.getByText('1')));

    expect(onChange).toHaveBeenCalledWith(['1']);
    expect(screen.getByRole('button').textContent).toBe('1');

    await act(async () => userEvent.click(screen.getByRole('button')));
    await act(async () => userEvent.click(screen.getByText('2')));

    expect(onChange).toHaveBeenCalledWith(['1', '2']);
    expect(screen.getByRole('button').textContent).toBe('1,2');

    await act(async () => userEvent.click(screen.getByRole('button')));
    await act(async () => userEvent.click(screen.getByText('1')));

    expect(onChange).toHaveBeenCalledWith(['2']);
    expect(screen.getByRole('button').textContent).toBe('2');
  });

  test('It works within controlled state correctly', async () => {
    renderMultiDropdown({ value: ['CONTROLLED'] });

    expect(screen.getByRole('button').textContent).toBe('CONTROLLED');

    await act(async () => userEvent.click(screen.getByRole('button')));
    await act(async () => userEvent.click(screen.getByText('1')));

    expect(screen.getByRole('button').textContent).toBe('CONTROLLED');
  });

  test('It works within disabled state correctly', async () => {
    renderMultiDropdown({ disabled: true });

    await act(async () => userEvent.click(screen.getByRole('button')));

    expect(screen.queryByText('1')).toBeNull();
  });
});
