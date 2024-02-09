import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

const useRefinements = () => {
  const [limit, setLimit] = useState(25);
  const [cursor, setCursor] = useState<string>('offset:0');
  const [states, setStates] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [date, setDate] = useState<{ from?: Date; to?: Date }>({ from: undefined, to: undefined });

  const debouncedSearch = useDebounce(search);

  const page = Math.floor(+cursor.split(':')[1] / limit) + 1;

  const addState = useCallback((state: string) => setStates([...states, state]), [states]);
  const removeState = useCallback((state: string) => setStates(states.filter((s) => s !== state)), [states]);

  const extractDate = useCallback((date: Date) => {
    const [day, month, year] = [
      date.getDate().toString().padStart(2, '0'),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getFullYear(),
    ];

    return `${year}-${month}-${day}`;
  }, []);

  const ISODate = useMemo(() => {
    const result = {} as { from?: string; to?: string };

    if (date.from) result.from = `${extractDate(date.from)}T00:00:00.000Z`;

    if (date.to) result.to = `${extractDate(date.to)}T23:59:59.999Z`;

    return result;
  }, [date, extractDate]);

  const clearRefinements = useCallback(() => {
    setLimit(25);
    setStates([]);
    setSearch('');
    setDate({ from: undefined, to: undefined });
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
    date,
    ISODate,
    onCreationDateRefine: setDate,
    clearRefinements,
  };
};

export default useRefinements;
