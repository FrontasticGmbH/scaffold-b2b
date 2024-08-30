import { act, render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import Modal from '.';

const blockScroll = jest.fn();

jest.mock('@/hooks/useScrollBlock', () => () => ({ blockScroll }));

describe('[Component] Modal', () => {
  it('Opens correctly', () => {
    const { rerender } = render(<Modal isOpen={false}>Iam Closed!</Modal>);

    expect(screen.queryByText('Iam Closed!')).not.toBeInTheDocument();

    rerender(<Modal isOpen={true}>Iam Open!</Modal>);

    expect(screen.queryByText('Iam Open!')).toBeInTheDocument();
  });

  it('Renders within the custom portal if defined', () => {
    render(
      <div>
        <div id="react-modal-custom-portal" />
        <Modal isOpen>Iam Modal!</Modal>
      </div>,
    );

    expect(screen.getByText('Iam Modal!').closest('#react-modal-custom-portal')).toBeTruthy();
  });

  it('Prevents scroll correctly if specified', () => {
    const { rerender } = render(<Modal isOpen preventScroll={false} />);

    expect(blockScroll).not.toHaveBeenCalled();

    rerender(<Modal isOpen preventScroll={true} />);

    expect(blockScroll).toHaveBeenCalledWith(true);
  });

  it('Renders close button correctly', () => {
    const { rerender } = render(<Modal isOpen />);

    expect(screen.queryByTestId('close-modal')).not.toBeInTheDocument();

    rerender(<Modal isOpen closeButton />);

    expect(screen.queryByTestId('close-modal')).toBeInTheDocument();
  });

  it('Closes correctly using the close button', async () => {
    const { rerender } = render(<></>);

    const onClose = jest.fn(() => rerender(<Modal isOpen={false}>Iam Modal!</Modal>));

    rerender(
      <Modal isOpen closeButton onRequestClose={onClose}>
        Iam Modal!
      </Modal>,
    );

    expect(screen.queryByText('Iam Modal!')).toBeInTheDocument();

    await act(async () => userEvent.click(screen.getByTestId('close-modal')));

    expect(onClose).toHaveBeenCalled();

    expect(screen.queryByText('Iam Modal!')).not.toBeInTheDocument();
  });
});
