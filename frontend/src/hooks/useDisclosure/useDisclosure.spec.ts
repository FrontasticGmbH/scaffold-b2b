import { act, renderHook } from '@test/utils';
import useDisclosure from '.';

describe('[Hook] useDisclosure', () => {
  it('Is auto closed by default', () => {
    const {
      result: {
        current: { isOpen },
      },
    } = renderHook(useDisclosure);

    expect(isOpen).toBe(false);
  });

  it('Can be auto opened by default', () => {
    const {
      result: {
        current: { isOpen },
      },
    } = renderHook(useDisclosure, { initialProps: { defaultIsOpen: true } });

    expect(isOpen).toBe(true);
  });

  it('Changes to opened state correctly', async () => {
    const { result } = renderHook(useDisclosure);

    expect(result.current.isOpen).toBe(false);

    await act(async () => result.current.onOpen());

    expect(result.current.isOpen).toBe(true);
  });

  it('Changes to opened state (with delay) correctly', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(useDisclosure, { initialProps: { openDelay: 500 } });

    await act(async () => result.current.onOpen());

    expect(result.current.isOpen).toBe(false);

    await act(async () => jest.advanceTimersByTime(500));

    expect(result.current.isOpen).toBe(true);
  });

  it('Changes to closed state correctly', async () => {
    const { result } = renderHook(useDisclosure, { initialProps: { defaultIsOpen: true } });

    expect(result.current.isOpen).toBe(true);

    await act(async () => result.current.onClose());

    expect(result.current.isOpen).toBe(false);
  });

  it('Changes to closed state (with delay) correctly', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(useDisclosure, { initialProps: { defaultIsOpen: true, closeDelay: 500 } });

    await act(async () => result.current.onClose());

    expect(result.current.isOpen).toBe(true);

    await act(async () => jest.advanceTimersByTime(500));

    expect(result.current.isOpen).toBe(false);
  });

  it('Toggles state correctly', async () => {
    const { result } = renderHook(useDisclosure);

    await act(async () => result.current.onToggle());

    expect(result.current.isOpen).toBe(true);

    await act(async () => result.current.onToggle());

    expect(result.current.isOpen).toBe(false);
  });
});
