import { render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import Select from '.';
import { SelectProps } from './types';

describe('[Component] Select', () => {
  const renderSelect = (props: Partial<SelectProps>) => {
    return render(
      <Select
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
    renderSelect({ placeholder: 'Placeholder' });

    expect(screen.getByPlaceholderText('Placeholder')).toBeInTheDocument();
  });

  test('It shows default value when no value is selected', () => {
    renderSelect({ defaultValue: '1' });

    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  test('It selects value correctly', async () => {
    const onChange = jest.fn();

    renderSelect({ onChange, placeholder: 'Select' });

    userEvent.click(screen.getByPlaceholderText('Select'));
    userEvent.click(await screen.findByText('1'));

    expect(await screen.findByDisplayValue('1')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith('1');
  });

  test('It renders label correctly', () => {
    renderSelect({ label: 'Label' });

    expect(screen.getByText('Label')).toBeDefined();
  });

  test('It renders required label (asterisk) correctly', () => {
    renderSelect({ label: 'Label', required: true, requiredStyle: 'asterisk' });

    expect(screen.getByText('*')).toBeDefined();
  });

  test('It renders required label (label) correctly', () => {
    renderSelect({ label: 'Label', required: true, requiredStyle: 'label' });

    expect(screen.getByText('common.field.required')).toBeDefined();
  });

  test('It renders optional label correctly', () => {
    renderSelect({ label: 'Label', showOptionalLabel: true });

    expect(screen.getByText('(common.optional)')).toBeDefined();
  });

  test('It searches options correctly', async () => {
    renderSelect({
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

  test('It shows "no results" correctly when searching', async () => {
    renderSelect({ enableSearch: true, placeholder: 'Select' });

    userEvent.click(screen.getByPlaceholderText('Select'));

    userEvent.type(screen.getByPlaceholderText('Select'), 'none');

    expect(screen.queryByText('1')).toBeNull();
    expect(screen.queryByText('2')).toBeNull();
    expect(screen.queryByText('3')).toBeNull();
    expect(await screen.findByText('common.no.results.found')).toBeInTheDocument();
  });
});
