import Toaster from '@/components/atoms/toaster';
import { act, render, renderHook, screen } from '@test/utils';
import useClipboard from '.';

describe('[Hook] useClipboard', () => {
  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
  });

  afterAll(() => {
    Object.assign(navigator, { clipboard: undefined });
  });

  beforeEach(() => {
    render(<Toaster />);
  });

  it('Copies to clipboard successfully and shows a success message', async () => {
    const {
      result: {
        current: { copyToClipboard },
      },
    } = renderHook(useClipboard);

    jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(jest.fn());

    await act(() => copyToClipboard('COPYME!'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('COPYME!');

    expect(screen.getByText('common.copy.clipboard.success')).toBeInTheDocument();
  });

  it('Shows an error message upon failing to copy to clipboard', async () => {
    const {
      result: {
        current: { copyToClipboard },
      },
    } = renderHook(useClipboard);

    jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(() => {
      throw new Error('COPY FAILED!');
    });

    await act(() => copyToClipboard('COPYME!'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('COPYME!');
    expect(navigator.clipboard.writeText).toThrow('COPY FAILED!');

    expect(screen.getByText('common.copy.clipboard.error')).toBeInTheDocument();
  });
});
