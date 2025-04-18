import { BooleanFacet, Facet, RangeFacet, TermFacet } from '@/types/entity/facet';
import { useTranslations } from 'use-intl';
import { DataSourceProps, Props } from '../../types';

const useMappedFacets = ({ facets, categories }: Partial<DataSourceProps & Props>) => {
  const translate = useTranslations();

  // Only facet keys present here will be picked up
  const allowedFacets = new Set([
    'variants.scopedPrice.value',
    'variants.prices.centAmount',
    'variants.prices',
    'variants.attributes.iso45001',
    'variants.attributes.mobility',
  ]);

  const mappedFacets = (facets ?? [])
    .filter((facet) => allowedFacets.has(facet.identifier))
    .map((facet) => {
      const isNavigationFacet = facet.identifier === 'categories.id';
      const isBooleanFacet = facet.type === 'boolean';
      const isTermFacet = facet.type === 'term';
      const isRangeFacet = facet.type === 'range';

      if (isTermFacet && !facet.terms?.length) return;

      const res = {
        id: facet.identifier,
        // eslint-disable-next-line
        // @ts-ignore
        name: translate(`product.${facet.identifier.replaceAll('.', '-')}`),
        selected: facet.selected,
        count: facet.count,
        type: facet.type,
      } as Facet;

      if (isNavigationFacet) res.type = 'navigation';

      if (isTermFacet || isBooleanFacet) {
        (res as TermFacet | BooleanFacet).values = (facet.terms ?? []).map((term) => {
          const value = {
            id: term.identifier,
            name: isBooleanFacet
              ? translate(
                  // eslint-disable-next-line
                // @ts-ignore
                  `product.${facet.identifier.replaceAll('.', '-')}-${term.identifier.replaceAll('.', '-')}`,
                )
              : term.label,
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
