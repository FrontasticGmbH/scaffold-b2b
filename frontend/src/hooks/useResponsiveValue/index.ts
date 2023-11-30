import { useMemo } from 'react';
import { ResponsiveQuery } from '@/types/responsive';
import { smallMobile, mobile, tablet, desktop, mediumDesktop, bigDesktop, hugeDesktop } from '@/constants/screensizes';
import useMediaQuery from '../useMediaQuery';

const useResponsiveValue = <T = unknown>(query: ResponsiveQuery<T>) => {
  const [width] = useMediaQuery();

  const value = useMemo(() => {
    const values = [query.base];

    if (width >= smallMobile) values.push(query.xs);
    if (width >= mobile) values.push(query.sm);
    if (width >= tablet) values.push(query.md);
    if (width >= desktop) values.push(query.lg);
    if (width >= mediumDesktop) values.push(query.xl);
    if (width >= bigDesktop) values.push(query['2xl']);
    if (width >= hugeDesktop) values.push(query['3xl']);

    return values.filter(Boolean).at(-1); // Last valid value
  }, [width, query]);

  return value;
};

export default useResponsiveValue;
