import { Facet, FacetTypes } from '@shared/types/result/Facet';

type RawFacet = {
  identifier: string;
  label: string;
  selected?: boolean;
  terms?: Array<{
    identifier: string;
    label: string;
    count?: number;
    selected?: boolean;
  }>;
  min?: number;
  max?: number;
  minSelected?: number;
  maxSelected?: number;
  count?: number;
};

export const mapFacets = (facets: RawFacet[]): Facet[] => {
  return facets.map(
    (facet): Facet => ({
      type:
        facet.min !== undefined && facet.max !== undefined
          ? FacetTypes.RANGE
          : facet.terms && facet.terms.length > 0
            ? FacetTypes.TERM
            : FacetTypes.BOOLEAN,
      identifier: facet.identifier,
      label: facet.label,
      key: facet.identifier,
      count: facet.count,
      selected: facet.selected,
    }),
  );
};
