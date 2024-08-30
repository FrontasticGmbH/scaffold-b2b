import { act, render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import MultiSelect from '.';
import { SelectProps } from './types';

describe('[Component] MultiSelect', () => {
  const renderMultiSelect = (props: Partial<SelectProps>) => {
    return render(
      <MultiSelect
        options={[
          { name: '1', value: '1' },
          { name: '2', value: '2' },
          { name: '3', value: '3' },
        ]}
        {...props}
      />,
    );
  };

  test('It shows placeholder when no value is selected', () => {
    renderMultiSelect({ placeholder: 'Placeholder' });

    expect(screen.getByRole('button').textContent).toBe('Placeholder');
  });

  test('It shows default values when no value is selected', () => {
    renderMultiSelect({ defaultValue: ['1', '2'] });

    expect(screen.getByRole('button').textContent).toBe('1, 2');
  });

  test('It selects values correctly', async () => {
    const onChange = jest.fn();

    renderMultiSelect({ onChange });

    await act(async () => userEvent.click(screen.getByRole('button')));
    await act(async () => userEvent.click(screen.getByText('1')));

    expect(screen.getByRole('button').textContent).toBe('1');
    expect(onChange).toHaveBeenCalledWith(['1']);

    await act(async () => userEvent.click(screen.getByRole('button')));
    await act(async () => userEvent.click(screen.getByText('2')));

    expect(screen.getByRole('button').textContent).toBe('1, 2');
    expect(onChange).toHaveBeenCalledWith(['1', '2']);

    await act(async () => userEvent.click(screen.getByRole('button')));
    await act(async () => userEvent.click(screen.getByText('2')));

    expect(screen.getByRole('button').textContent).toBe('1');
    expect(onChange).toHaveBeenCalledWith(['1']);
  });

  test('It renders label correctly', () => {
    renderMultiSelect({ label: 'Label' });

    expect(screen.getByText('Label')).toBeDefined();
  });

  test('It renders required label (asterisk) correctly', () => {
    renderMultiSelect({ label: 'Label', required: true, requiredStyle: 'asterisk' });

    expect(screen.getByText('*')).toBeDefined();
  });

  test('It renders required label (label) correctly', () => {
    renderMultiSelect({ label: 'Label', required: true, requiredStyle: 'label' });

    expect(screen.getByText('common.field.required')).toBeDefined();
  });

  test('It renders optional label correctly', () => {
    renderMultiSelect({ label: 'Label', showOptionalLabel: true });

    expect(screen.getByText('(common.optional)')).toBeDefined();
  });

  test('It renders search correctly', async () => {
    renderMultiSelect({ enableSearch: true });

    await act(async () => userEvent.click(screen.getByRole('button')));

    expect(screen.getByRole('textbox')).toBeDefined();
  });

  test('It searches options correctly', async () => {
    renderMultiSelect({
      enableSearch: true,
      options: [
        { name: '1', value: '1' },
        { name: '2', value: '2' },
        { name: '10', value: '10' },
      ],
    });

    await act(async () => userEvent.click(screen.getByRole('button')));

    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText('10')).toBeDefined();

    await act(async () => userEvent.type(screen.getByRole('textbox'), '1'));

    expect(screen.getByText('1')).toBeDefined();
    expect(screen.queryByText('2')).toBeNull();
    expect(screen.getByText('10')).toBeDefined();
  });

  test('It shows no results correctly when searching', async () => {
    renderMultiSelect({ enableSearch: true });

    await act(async () => userEvent.click(screen.getByRole('button')));
    await act(async () => userEvent.type(screen.getByRole('textbox'), 'none'));

    expect(screen.queryByText('1')).toBeNull();
    expect(screen.queryByText('2')).toBeNull();
    expect(screen.queryByText('3')).toBeNull();
    expect(screen.getByText('common.no.results.found')).toBeDefined();
  });
});
