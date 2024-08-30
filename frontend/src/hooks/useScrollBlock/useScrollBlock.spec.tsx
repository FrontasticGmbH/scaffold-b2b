import { act, renderHook } from '__test__/utils';
import useScrollBlock from '.';

describe('useScrollBlock', () => {
  const createHeaderElement = () => {
    const header = document.createElement('div');
    header.id = 'header-container';
    header.style.paddingRight = '20px';
    document.body.appendChild(header);
    return header;
  };

  it('should return two values only', () => {
    const { result } = renderHook(() => useScrollBlock());

    expect(Object.keys(result.current).length).toBe(2);
    expect(typeof result.current.isBlocked).toBe('boolean');
    expect(typeof result.current.blockScroll).toBe('function');
  });

  it('should block scrolling when true is passed to the blockScroll function', () => {
    const header = createHeaderElement();
    const { result } = renderHook(() => useScrollBlock());
    const { blockScroll } = result.current;

    expect(document.body.style.overflowY).toBe('');

    act(() => {
      blockScroll(true);
    });

    expect(header.style.paddingRight).toBe('0px');
    expect(document.body.style.overflowY).toBe('hidden');
    expect(result.current.isBlocked).toBe(true);
    document.body.removeChild(header);
  });

  it('should allow scrolling when false is passed to the blockScroll function', () => {
    const header = createHeaderElement();
    const { result } = renderHook(() => useScrollBlock());
    const { blockScroll } = result.current;

    act(() => {
      blockScroll(false);
    });

    expect(header.style.paddingRight).toBe('0px');
    expect(document.body.style.overflowY).toBe('auto');
    expect(result.current.isBlocked).toBe(false);

    document.body.removeChild(header);
  });
});
