import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

interface Options {
  length: number;
  onSelect?: (index: number) => void;
  allow?: (ref: RefObject<HTMLOListElement | HTMLUListElement | null>) => boolean;
}

const useListKeyboardNavigation = ({ length, onSelect, allow = () => true }: Options) => {
  const ref = useRef<HTMLOListElement | HTMLUListElement>(null);

  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (allow && !allow(ref)) return;

      if (e.code === 'Enter') {
        e.preventDefault();

        if (0 <= activeIndex && activeIndex < length) {
          onSelect?.(activeIndex);
        }

        return;
      }

      let nextIndex = -1;

      if (e.code === 'ArrowDown') {
        e.preventDefault();
        nextIndex = activeIndex >= length - 1 ? 0 : activeIndex + 1;
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        nextIndex = activeIndex <= 0 ? length - 1 : activeIndex - 1;
      }

      if (ref.current) ref.current.children.item(nextIndex)?.scrollIntoView({ behavior: 'auto', block: 'nearest' });

      setActiveIndex(nextIndex);
    },
    [activeIndex, length, onSelect, allow],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { ref, activeIndex };
};

export default useListKeyboardNavigation;
