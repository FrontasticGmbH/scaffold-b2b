export interface BaseFacet {
  id: string;
  name: string;
  selected?: boolean;
  count?: number;
}

export interface RangeFacet extends BaseFacet {
  type: 'range';
  min?: number;
  max?: number;
}

export interface TermFacet extends BaseFacet {
  type: 'term';
  values: Array<BaseFacet>;
  maxVisibleItems?: number;
}

export interface NavigationFacet extends BaseFacet {
  type: 'navigation';
  values: Array<BaseFacet>;
  maxVisibleItems?: number;
}

export type Facet = RangeFacet | NavigationFacet | TermFacet;
