import { useCallback, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

const useRefinements = () => {
  const [limit, setLimit] = useState(25);
  const [cursor, setCursor] = useState<string>('offset:0');
  const [states, setStates] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');

  const debouncedSearch = useDebounce(search);

  const page = Math.floor(+cursor.split(':')[1] / limit);

  const addState = useCallback((state: string) => setStates([...states, state]), [states]);
  const removeState = useCallback((state: string) => setStates(states.filter((s) => s !== state)), [states]);

  const clearRefinements = useCallback(() => {
    setLimit(25);
    setStates([]);
    setSearch('');
  }, []);

  return {
    limit,
    page,
    setLimit,
    cursor,
    setCursor,
    states,
    addState,
    removeState,
    setStates,
    search,
    debouncedSearch,
    setSearch,
    clearRefinements,
  };
};

export default useRefinements;
