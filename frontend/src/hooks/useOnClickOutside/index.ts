import { useCallback, useEffect, useRef } from 'react';

function useOnClickOutside(handler: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  //eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedHandler = useCallback(handler, []);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        memoizedHandler();
      }
    };

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        memoizedHandler();
      }
    }

    document.addEventListener('mouseup', handleMouseDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [ref, memoizedHandler]);

  return { ref };
}

export default useOnClickOutside;
