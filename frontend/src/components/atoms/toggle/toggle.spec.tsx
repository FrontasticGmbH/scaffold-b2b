import { act, render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import Toggle from '.';

describe('[Component] Toggle', () => {
  test('It renders label correctly', () => {
    render(<Toggle label="Label" />);

    expect(screen.getByText('Label')).toBeDefined();
  });

  test('It checks and unchecks correctly', async () => {
    const onChange = jest.fn();

    const tree = render(<Toggle onChange={onChange} />);

    await act(async () => userEvent.click(tree.baseElement.querySelector('label') as HTMLLabelElement));

    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByTestId('checked-icon').classList.contains('block')).toBeTruthy();
    expect(screen.getByTestId('unchecked-icon').classList.contains('hidden')).toBeTruthy();

    await act(async () => userEvent.click(tree.baseElement.querySelector('label') as HTMLLabelElement));

    expect(onChange).toHaveBeenCalledWith(false);
    expect(screen.getByTestId('checked-icon').classList.contains('hidden')).toBeTruthy();
    expect(screen.getByTestId('unchecked-icon').classList.contains('block')).toBeTruthy();
  });

  test('It can be default checked', () => {
    render(<Toggle defaultChecked />);

    expect(screen.getByTestId('checked-icon').classList.contains('block')).toBeTruthy();
    expect(screen.getByTestId('unchecked-icon').classList.contains('hidden')).toBeTruthy();
  });

  test('It works within the controlled state correctly', async () => {
    const tree = render(<Toggle checked={false} />);

    await act(async () => userEvent.click(tree.baseElement.querySelector('label') as HTMLLabelElement));

    expect(screen.getByTestId('checked-icon').classList.contains('hidden')).toBeTruthy();
    expect(screen.getByTestId('unchecked-icon').classList.contains('block')).toBeTruthy();
  });
});
