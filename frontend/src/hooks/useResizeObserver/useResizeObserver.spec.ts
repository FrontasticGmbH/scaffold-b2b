import React from 'react';
import { renderHook } from '@test/utils';
import useResizeObserver from '.';

jest.spyOn(React, 'useRef').mockReturnValue({ current: {} });

describe('[Hook] useResizeObserver', () => {
  it('Calls given callback upon mounting', async () => {
    const callback = jest.fn();

    renderHook(() => useResizeObserver(callback));

    expect(callback).toHaveBeenCalled();
  });

  it('Calls given cleanup upon unmounting', () => {
    const callback = jest.fn();
    const cleanup = jest.fn();

    const { unmount } = renderHook(() => useResizeObserver(callback, cleanup));

    unmount();

    expect(cleanup).toHaveBeenCalled();
  });
});
