import { Facet, RangeFacet, TermFacet } from '@/types/entity/facet';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { DataSourceProps, Props } from '../../types';

const useMappedFacets = ({ facets, categories }: Partial<DataSourceProps & Props>) => {
  const { translate } = useTranslation();

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
      if (facet.type === 'term' && !facet.terms?.length) return;

      const res = {
        id: facet.identifier,
        name: translate(`product.${facet.identifier}`),
        selected: facet.selected,
        count: facet.count,
        type: facet.type,
      } as Facet;

      if (facet.identifier === 'categories.id') res.type = 'navigation';

      if (facet.type === 'term') {
        (res as TermFacet).values = (facet.terms ?? []).map((term) => {
          const value = {
            id: term.identifier,
            name: term.label,
            selected: term.selected,
            count: term.count,
          };

          if (facet.identifier === 'categories.id') value.name = categories?.find((c) => c.categoryId)?.name ?? '';

          return value;
        });
      }

      if (facet.type === 'range') {
        (res as RangeFacet).min = (facet.minSelected ?? 0) / 100;
        (res as RangeFacet).max = (facet.maxSelected ?? 0) / 100;
      }

      return res;
    }) as Facet[];

  return mappedFacets.filter(Boolean);
};

export default useMappedFacets;
