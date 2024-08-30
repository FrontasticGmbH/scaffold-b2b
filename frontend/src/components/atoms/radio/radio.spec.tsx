import { act, render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import Radio from '.';

describe('[Component] Radio', () => {
  it('Is selected correctly', async () => {
    const onSelected = jest.fn();

    const tree = render(<Radio onSelected={onSelected} />);

    await act(async () => userEvent.click(tree.baseElement.querySelector('label') as HTMLLabelElement));

    expect(onSelected).toHaveBeenCalled();
    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBeTruthy();
  });

  it('Renders label correctly', () => {
    render(<Radio label="Label" />);

    expect(screen.getByText('Label')).toBeDefined();
  });

  it('Works within the controlled state correctly', async () => {
    const tree = render(<Radio checked={false} />);

    await act(async () => userEvent.click(tree.baseElement.querySelector('label') as HTMLLabelElement));

    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBeFalsy();
  });

  it('Works within the disabled state correctly', async () => {
    const tree = render(<Radio disabled />);

    await act(async () => userEvent.click(tree.baseElement.querySelector('label') as HTMLLabelElement));

    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBeFalsy();
  });
});
