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

    expect(screen.getByPlaceholderText('Placeholder')).toBeInTheDocument();
  });

  test('It shows default values when no value is selected', () => {
    renderMultiSelect({ defaultValue: ['1', '2'] });

    expect(screen.getByDisplayValue('1, 2')).toBeInTheDocument();
  });

  test('It selects values correctly', async () => {
    const onChange = jest.fn();

    renderMultiSelect({ onChange, placeholder: 'Select' });

    userEvent.click(screen.getByPlaceholderText('Select'));
    userEvent.click(await screen.findByText('1'));

    expect(await screen.findByDisplayValue('1')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(['1']);

    userEvent.click(screen.getByTestId('dropdown-button'));
    userEvent.click(await screen.findByText('2'));

    expect(await screen.findByDisplayValue('1, 2')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(['1', '2']);

    userEvent.click(screen.getByTestId('dropdown-button'));
    userEvent.click(await screen.findByText('2'));

    expect(await screen.findByDisplayValue('1')).toBeInTheDocument();
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

  test('It searches options correctly', async () => {
    renderMultiSelect({
      enableSearch: true,
      options: [
        { name: '1', value: '1' },
        { name: '2', value: '2' },
        { name: '10', value: '10' },
      ],
      placeholder: 'Select',
    });

    userEvent.click(screen.getByPlaceholderText('Select'));
    expect(await screen.findByText('1')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText('10')).toBeDefined();

    userEvent.type(screen.getByPlaceholderText('Select'), '1');

    expect(await screen.findByText('1')).toBeDefined();
    expect(await screen.findByText('10')).toBeDefined();
    expect(await screen.findByText('2')).not.toBeInTheDocument();
  });

  test('It shows no results correctly when searching', async () => {
    renderMultiSelect({ enableSearch: true, placeholder: 'Select' });

    userEvent.click(screen.getByPlaceholderText('Select'));

    userEvent.type(screen.getByPlaceholderText('Select'), 'none');

    expect(screen.queryByText('1')).toBeNull();
    expect(screen.queryByText('2')).toBeNull();
    expect(screen.queryByText('3')).toBeNull();
    expect(await screen.findByText('common.no.results.found')).toBeDefined();
  });
});
