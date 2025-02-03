import { useCallback, type JSX } from 'react';
import {
  Facet,
  NavigationFacet as NavigationFacetType,
  RangeFacet as RangeFacetType,
  TermFacet as TermFacetType,
  BooleanFacet as BooleanFacetType,
} from '@/types/entity/facet';
import NavigationFacet from '../../components/navigation-facet';
import TermFacet from '../../components/term-facet';
import RangeFacet from '../../components/range-facet';
import BooleanFacet from '../../components/boolean-facet';

const useFacetComponent = () => {
  const resolveFacetComponent = useCallback((facet: Facet) => {
    return (
      {
        navigation: <NavigationFacet {...(facet as NavigationFacetType)} />,
        term: <TermFacet {...(facet as TermFacetType)} />,
        range: <RangeFacet {...(facet as RangeFacetType)} />,
        boolean: <BooleanFacet {...(facet as BooleanFacetType)} />,
      } as Record<Facet['type'], JSX.Element>
    )[facet.type];
  }, []);

  return { resolveFacetComponent };
};

export default useFacetComponent;
