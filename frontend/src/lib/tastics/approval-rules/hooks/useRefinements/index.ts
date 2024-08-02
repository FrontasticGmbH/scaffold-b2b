import { useState } from 'react';

const useRefinements = () => {
  const [limit, setLimit] = useState(25);
  const [cursor, setCursor] = useState<string>('offset:0');

  const page = Math.floor(+cursor.split(':')[1] / limit) + 1;

  return {
    limit,
    page,
    setLimit,
    cursor,
    setCursor,
  };
};

export default useRefinements;
