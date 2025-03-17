import { act, fireEvent, render, screen, waitFor } from '@test/utils';
import Button from '../button';
import Toaster from '.';
import toast from './helpers/toast';

describe('[Component] Toaster', () => {
  afterEach(async () => {
    await act(async () => toast.removeAll());
  });

  it('Renders Toaster after the trigger', () => {
    render(
      <div>
        <Button onClick={() => toast.success("I'm a toaster")}>Show toaster</Button>
        <Toaster />
      </div>,
    );

    // Ensure the toast is not present initially
    expect(screen.queryByText("I'm a toaster")).toBeNull();

    // Trigger the toast
    fireEvent.click(screen.getByRole('button'));

    // Verify the toast appears
    expect(screen.getByText("I'm a toaster")).toBeInTheDocument();
  });

  it('Renders multiple toasts', () => {
    render(
      <div>
        <Button
          onClick={() => {
            toast.success('Toast 1');
            toast.success('Toast 2');
          }}
        >
          Show toasts
        </Button>
        <Toaster />
      </div>,
    );

    // Trigger the toasts
    fireEvent.click(screen.getByRole('button'));

    // Verify both toasts appear
    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
  });

  it('Renders different toast types', () => {
    render(
      <div>
        <Button
          onClick={() => {
            toast.success('Success toast');
            toast.error('Error toast');
            toast.warning('Warning toast');
            toast.info('Info toast');
          }}
        >
          Show different toasts
        </Button>
        <Toaster />
      </div>,
    );

    // Trigger the toasts
    fireEvent.click(screen.getByRole('button'));

    // Verify all different types of toasts appear
    expect(screen.getByText('Success toast')).toBeInTheDocument();
    expect(screen.getByText('Error toast')).toBeInTheDocument();
    expect(screen.getByText('Warning toast')).toBeInTheDocument();
    expect(screen.getByText('Info toast')).toBeInTheDocument();
  });

  it('Renders custom content', () => {
    render(
      <div>
        <Button onClick={() => toast.render(<strong>Custom Content</strong>, 'success')}>Show toaster</Button>
        <Toaster />
      </div>,
    );

    // Trigger the custom content toast
    fireEvent.click(screen.getByRole('button'));

    // Verify the custom content appears
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('Dismisses toasts successfully', async () => {
    render(<Toaster />);

    await act(async () => toast.info("I'm toast!", { duration: 99999 }));

    fireEvent.click(screen.getByTestId('toast-dismiss'));

    await waitFor(() => expect(screen.queryByText("I'm toast!")).not.toBeInTheDocument(), { timeout: 2000 }); //Because of animation on dismiss
  });
});
