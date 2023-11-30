import { useCallback } from 'react';
import {
  Facet,
  NavigationFacet as NavigationFacetType,
  RangeFacet as RangeFacetType,
  TermFacet as TermFacetType,
} from '@/types/entity/facet';
import NavigationFacet from '../../components/navigation-facet';
import TermFacet from '../../components/term-facet';
import RangeFacet from '../../components/range-facet';

const useFacetComponent = () => {
  const resolveFacetComponent = useCallback((facet: Facet) => {
    return (
      {
        navigation: <NavigationFacet {...(facet as NavigationFacetType)} />,
        term: <TermFacet {...(facet as TermFacetType)} />,
        range: <RangeFacet {...(facet as RangeFacetType)} />,
      } as Record<Facet['type'], JSX.Element>
    )[facet.type];
  }, []);

  return { resolveFacetComponent };
};

export default useFacetComponent;
