import { BusinessUnit, Store } from '@/types/entity/business-unit';

export interface ContextShape {
  selectedStore?: Store;
  selectedBusinessUnit?: BusinessUnit;
  setSelectedBusinessUnitKey: (key: string) => void;
  setSelectedStoreKey: (key: string) => void;
  clearBusinessUnitAndStoreFromStorage: () => void;
  sessionIsUpdating: boolean;
}
