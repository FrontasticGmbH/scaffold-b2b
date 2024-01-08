import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import usePath from '@/hooks/usePath';
import { Facet, RangeFacet, TermFacet, NavigationFacet } from '@/types/entity/facet';

const useRefinement = () => {
  const router = useRouter();

  const { pathWithoutQuery } = usePath();

  const params = useSearchParams();

  const searchParams = Object.fromEntries(params.entries());

  const { query: searchQuery } = searchParams;

  const limit = +(params.get('limit') ?? '24');

  const currentSortValue =
    Array.from(params.keys())
      .find((key) => key.startsWith('sortAttributes'))
      ?.match(/sortAttributes\[0\]\[(.+)\]/)?.[1] ?? 'price';

  const onSortValueChange = useCallback(
    (key: string) => {
      const newParams = new URLSearchParams(searchParams);

      for (const key of Array.from(newParams.keys())) {
        if (key.startsWith('sortAttributes')) newParams.delete(key);
      }

      newParams.set(`sortAttributes[0][${key}]`, 'asc');

      router.push(`${pathWithoutQuery}?${newParams.toString()}`);
    },
    [searchParams, router, pathWithoutQuery],
  );

  const refineRange = useCallback((facet: RangeFacet, newParams: URLSearchParams) => {
    if (facet.min) newParams.set(`facets[${facet.id}][min]`, (facet.min * 100).toString());
    if (facet.max) newParams.set(`facets[${facet.id}][max]`, (facet.max * 100).toString());
  }, []);

  const refineTerms = useCallback((facet: TermFacet | NavigationFacet, newParams: URLSearchParams) => {
    facet.values
      .filter((value) => value.selected)
      .forEach((value, index) => {
        newParams.set(`facets[${facet.id}][terms][${index}]`, value.id);
      });
  }, []);

  const onRefine = useCallback(
    (facets: Facet[]) => {
      const newParams = new URLSearchParams();

      newParams.set(`sortAttributes[0][${currentSortValue}]`, 'asc');

      facets
        .filter((facet) => facet.selected)
        .forEach((facet) => {
          if (facet.type === 'range') refineRange(facet, newParams);
          else if (facet.type === 'navigation' || facet.type === 'term') refineTerms(facet, newParams);
        });

      if (searchQuery) newParams.set('query', searchQuery);

      router.push(`${pathWithoutQuery}?${newParams.toString()}`);
    },
    [currentSortValue, refineRange, refineTerms, pathWithoutQuery, router, searchQuery],
  );

  const onLoadMore = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);

    newParams.set('limit', (+limit + 24).toString());

    router.push(`${pathWithoutQuery}?${newParams.toString()}`);
  }, [searchParams, limit, router, pathWithoutQuery]);

  const onResetAll = useCallback(() => {
    router.push(`${pathWithoutQuery}?limit=${limit}`);
  }, [router, limit, pathWithoutQuery]);

  return { onSortValueChange, currentSortValue, limit, onLoadMore, onResetAll, onRefine };
};

export default useRefinement;
