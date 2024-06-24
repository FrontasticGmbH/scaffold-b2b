import { Facet, RangeFacet, TermFacet } from '@/types/entity/facet';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { DataSourceProps, Props } from '../../types';

const useMappedFacets = ({ facets, categories }: Partial<DataSourceProps & Props>) => {
  const { translate } = useTranslation();
  console.log(facets);
  // Only facet keys present here will be picked up
  const allowedFacets = new Set([
    'variants.scopedPrice.value',
    'variants.prices.centAmount',
    'variants.attributes.iso45001',
    'variants.attributes.mobility',
  ]);

  const mappedFacets = (facets ?? [])
    .filter((facet) => allowedFacets.has(facet.identifier))
    .map((facet) => {
      const isNavigationFacet = facet.identifier === 'categories.id';
      const isBooleanFacet = facet.type === 'boolean';
      const isTermFacet = facet.type === 'term' || isBooleanFacet;
      const isRangeFacet = facet.type === 'range';

      if (isTermFacet && !facet.terms?.length) return;

      const res = {
        id: facet.identifier,
        name: translate(`product.${facet.identifier}`),
        selected: facet.selected,
        count: facet.count,
        type: facet.type,
      } as Facet;

      if (isNavigationFacet) res.type = 'navigation';

      if (isTermFacet) {
        (res as TermFacet).values = (facet.terms ?? []).map((term) => {
          const value = {
            id: term.identifier,
            name: isBooleanFacet ? translate(`product.${facet.identifier}.${term.identifier}`) : term.label,
            selected: term.selected,
            count: term.count,
          };

          if (isNavigationFacet) value.name = categories?.find((c) => c.categoryId)?.name ?? '';

          return value;
        });
      }

      if (isRangeFacet) {
        (res as RangeFacet).min = (facet.minSelected ?? 0) / 100;
        (res as RangeFacet).max = (facet.maxSelected ?? 0) / 100;
      }

      return res;
    }) as Facet[];

  return mappedFacets.filter(Boolean);
};

export default useMappedFacets;
