import { BusinessUnit, Store } from '@/types/entity/business-unit';

export interface ContextShape {
  selectedStore?: Store;
  selectedBusinessUnit?: BusinessUnit;
  setSelectedBusinessUnit: (businessUnit: BusinessUnit) => void;
  setSelectedStore: (store: Store) => void;
}
