import { act, render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import QuantityWidget from '.';

describe('[Component] Quantity Widget', () => {
  it('Uses default value correctly', async () => {
    render(<QuantityWidget defaultValue={1} />);

    expect(screen.queryByDisplayValue('1')).toBeDefined();
  });

  it('Increments and decrements correctly', async () => {
    const onChange = jest.fn();

    render(<QuantityWidget defaultValue={0} onChange={onChange} />);

    await act(async () => userEvent.click(screen.getByText('+')));

    expect(onChange).toHaveBeenCalledWith(1);
    expect(screen.queryByDisplayValue('1')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('+')));

    expect(onChange).toHaveBeenCalledWith(2);
    expect(screen.queryByDisplayValue('2')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('-')));

    expect(onChange).toHaveBeenCalledWith(1);
    expect(screen.queryByDisplayValue('1')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('-')));

    expect(onChange).toHaveBeenCalledWith(0);
    expect(screen.queryByDisplayValue('0')).toBeDefined();
  });

  it('Changes quantity correctly via input given a valid number', async () => {
    render(<QuantityWidget defaultValue={0} />);

    const input = screen.getByDisplayValue('0');

    await act(async () => userEvent.clear(input));
    await act(async () => userEvent.type(input, '20'));

    expect(screen.queryByDisplayValue('20')).toBeInTheDocument();
  });

  it('Refuses invalid numbers given via input correctly', async () => {
    const onChange = jest.fn();

    render(<QuantityWidget defaultValue={0} onChange={onChange} />);

    await act(async () => userEvent.type(screen.getByDisplayValue('0'), 'A'));

    expect(screen.queryByDisplayValue('0')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('A')).not.toBeInTheDocument();
  });

  it('Submits value correctly via input on blur', async () => {
    const onChange = jest.fn();

    render(<QuantityWidget defaultValue={0} onChange={onChange} />);

    const input = screen.getByDisplayValue('0');

    await act(async () => userEvent.clear(input));
    await act(async () => userEvent.type(input, '20'));
    await act(async () => userEvent.click(document.body));

    expect(onChange).toHaveBeenCalledWith(20);
  });

  it('Submits value correctly via input when submitting form', async () => {
    const onChange = jest.fn();

    render(<QuantityWidget defaultValue={0} onChange={onChange} />);

    const input = screen.getByDisplayValue('0');

    await act(async () => userEvent.clear(input));
    await act(async () => userEvent.type(input, '20{enter}'));

    expect(onChange).toHaveBeenCalledWith(20);
  });

  it("Doesn't go beyond the maximum value", async () => {
    const onChange = jest.fn();

    render(<QuantityWidget defaultValue={1} maxValue={2} onChange={onChange} />);

    await act(async () => userEvent.click(screen.getByText('+')));

    expect(onChange).toHaveBeenCalledWith(2);

    onChange.mockReset();

    await act(async () => userEvent.click(screen.getByText('+')));

    expect(onChange).not.toHaveBeenCalled();

    const input = screen.getByDisplayValue('2');

    expect(input).toBeDefined();

    await act(async () => userEvent.clear(input));
    await act(async () => userEvent.type(input, '20{enter}'));

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("Doesn't go beyond the minimum value", async () => {
    const onChange = jest.fn();

    render(<QuantityWidget defaultValue={3} minValue={2} onChange={onChange} />);

    await act(async () => userEvent.click(screen.getByText('-')));

    expect(onChange).toHaveBeenCalledWith(2);

    onChange.mockReset();

    await act(async () => userEvent.click(screen.getByText('-')));

    expect(onChange).not.toHaveBeenCalled();

    const input = screen.getByDisplayValue('2');

    expect(input).toBeDefined();

    await act(async () => userEvent.clear(input));
    await act(async () => userEvent.type(input, '1{enter}'));

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('Works within the controled state correctly', async () => {
    render(<QuantityWidget value={0} />);

    await act(async () => userEvent.click(screen.getByText('+')));

    expect(screen.queryByDisplayValue('0')).toBeDefined();
  });

  it('Works within the disabled state correctly', async () => {
    render(<QuantityWidget disabled />);

    await act(async () => userEvent.click(screen.getByText('+')));

    expect(screen.queryByDisplayValue('0')).toBeDefined();
  });
});
