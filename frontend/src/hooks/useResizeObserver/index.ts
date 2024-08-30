import { useCallback, useEffect, useRef } from 'react';

const useResizeObserver = <T = HTMLElement>(callback: (entry: T) => void, cleanup?: (entry: T) => void) => {
  const ref = useRef<T>(null) as React.MutableRefObject<T>;

  //eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallback = useCallback(callback, []);

  //eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCleanup = useCallback((entry: T) => cleanup?.(entry), []);

  useEffect(() => {
    if (!('ResizeObserver' in window)) return;

    const observer = new ResizeObserver((entries) => memoizedCallback(entries[0].target as T));

    const el = ref.current;

    if (el) {
      memoizedCallback(el as T);
      observer.observe(el as unknown as Element);
    }

    return () => {
      memoizedCleanup(el as T);
      observer.disconnect();
    };
  }, [memoizedCallback, memoizedCleanup]);

  return { ref };
};

export default useResizeObserver;
